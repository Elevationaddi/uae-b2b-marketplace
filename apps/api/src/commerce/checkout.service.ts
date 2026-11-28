import { Inject, Injectable } from '@nestjs/common';
import {
  bpsOf,
  COMMERCE_LIMITS,
  type CheckoutPreview,
  type CheckoutResponse,
  type checkoutCreateRequest,
  type paymentStartRequest,
} from '@app/contracts';
import {
  activeCommission,
  closeUnpaidCheckout,
  Prisma,
  writeAudit,
  type Checkout,
  type PrismaClient,
  type QuoteVersion,
  type Rfq,
  type Tx,
  type User,
} from '@app/db';
import type { z } from 'zod';
import { assertUuid } from '../catalog/access';
import { ApiError } from '../common/api-error';
import type { RequestMeta } from '../common/request-context';
import { PRISMA } from '../infra/tokens';
import { loadWorkspaceContext, requireCap, type WorkspaceContext } from '../rfq/access';
import { AddressService, addressSnapshot } from './address.service';
import { CartService } from './cart.service';
import {
  CommerceConfig,
  companyNames,
  mapOrderSummary,
  mapPayment,
  nextNumber,
} from './commerce-common';
import { buildPreview, loadCart, publicLine, type DeliveryChoice } from './pricing';
import type { SupplierVat, TaxSettings } from './tax';

const TX = { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, timeout: 20_000 };

/**
 * Checkout (docs/09-workflows.md): preview, then create with a stock reservation in one
 * transaction, one order per seller (T13), then a payment session with the sandbox PSP. Payment
 * success comes only from a verified webhook processed by the worker; the return page never
 * marks anything paid (T14).
 */
@Injectable()
export class CheckoutService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly config: CommerceConfig,
    private readonly carts: CartService,
    private readonly addresses: AddressService,
  ) {}

  private requireEnabled() {
    if (!this.config.checkoutEnabled) throw new ApiError('CONFLICT', 'checkout.payments_disabled');
  }

  async preview(
    user: User,
    ws: string,
    addressId: string,
    methods: Record<string, DeliveryChoice> = {},
  ): Promise<CheckoutPreview> {
    const ctx = await this.carts.ctx(user, ws);
    const address = await this.addresses.own(ctx.workspace.id, addressId);
    const p = buildPreview(
      await loadCart(this.prisma, ctx.workspace.id),
      address,
      this.config.tax,
      methods,
    );
    return {
      address: p.address,
      groups: p.groups.map((g) => ({
        seller: g.group.seller,
        lines: g.group.lines.map(publicLine),
        merchandise_fils: g.group.merchandise.toString(),
        shipping_fils: g.shipping.toString(),
        tax_fils: g.tax.toString(),
        total_fils: g.total.toString(),
        delivery_days: g.method === 'COLLECTION' ? g.group.collection.days : (g.rate?.days ?? null),
        delivery_method: g.method,
        delivery_options: {
          delivery: {
            available: !!g.rate,
            fee_fils: g.rate ? String(g.rate.fee_fils) : null,
            days: g.rate?.days ?? null,
          },
          collection: {
            available: g.group.collection.enabled,
            emirate: g.group.collection.enabled ? g.group.collection.emirate : null,
            days: g.group.collection.enabled ? g.group.collection.days : null,
          },
        },
        tax_bps: g.taxBps,
        tax_code: g.taxCode,
        return_policy: g.group.returnPolicy,
        issue: g.issue,
      })),
      merchandise_fils: p.merchandise.toString(),
      shipping_fils: p.shipping.toString(),
      tax_fils: p.tax.toString(),
      total_fils: p.total.toString(),
      tax_bps: p.taxBps,
      tax_treatment: this.config.tax.treatment,
      tax_provisional: p.provisional,
      reservation_minutes: this.config.reservationMinutes,
      preview_hash: p.hash,
      blocked: p.blocked || !this.config.checkoutEnabled,
    };
  }

  async create(
    user: User,
    ws: string,
    b: z.infer<typeof checkoutCreateRequest>,
    meta: RequestMeta,
  ): Promise<CheckoutResponse> {
    const ctx = await this.carts.ctx(user, ws);
    this.requireEnabled();
    const address = await this.addresses.own(ctx.workspace.id, b.address_id);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.config.reservationMinutes * 60_000);
    const id = await this.prisma.$transaction(async (tx) => {
      // Serialise checkouts of one workspace so the same cart cannot be checked out twice.
      await tx.$queryRaw`SELECT id FROM workspaces WHERE id = ${ctx.workspace.id}::uuid FOR UPDATE`;
      const p = buildPreview(
        await loadCart(tx, ctx.workspace.id),
        address,
        this.config.tax,
        b.methods ?? {},
      );
      if (p.hash !== b.preview_hash) throw new ApiError('CONFLICT', 'checkout.changed');
      if (p.blocked) throw new ApiError('CONFLICT', 'checkout.blocked');
      if (p.groups.some((g) => g.group.seller_company_id === ctx.company.id))
        throw new ApiError('CONFLICT', 'cart.self_trade');
      // Commission policy in force now (C-05); recorded on the checkout and every order.
      const commission = await activeCommission(tx, this.config.commissionBps);

      // Reserve in a stable order (sku id) so concurrent checkouts cannot deadlock. The
      // conditional update is the race guard for the last unit (T11).
      const wanted = new Map<string, number>();
      for (const g of p.groups)
        for (const l of g.group.lines)
          wanted.set(l.sku_id, (wanted.get(l.sku_id) ?? 0) + l.quantity);
      const reserved: { skuId: string; qty: number; after: Record<string, number> }[] = [];
      for (const skuId of [...wanted.keys()].sort()) {
        const qty = wanted.get(skuId)!;
        const r = await tx.$queryRaw<{ on_hand: number; reserved: number; unavailable: number }[]>`
          UPDATE inventory SET reserved = reserved + ${qty}, version = version + 1, updated_at = now()
           WHERE sku_id = ${skuId}::uuid AND on_hand - reserved - unavailable >= ${qty}
           RETURNING on_hand, reserved, unavailable`;
        if (!r[0]) throw new ApiError('CONFLICT', 'checkout.insufficient_stock', { sku_id: skuId });
        reserved.push({ skuId, qty, after: r[0] });
      }

      const checkout = await tx.checkout.create({
        data: {
          number: await nextNumber(tx, 'checkout'),
          buyerWorkspaceId: ctx.workspace.id,
          buyerCompanyId: ctx.company.id,
          createdById: user.id,
          source: 'CART',
          addressSnapshot: p.address,
          poReference: b.po_reference || null,
          merchandiseFils: p.merchandise,
          shippingFils: p.shipping,
          taxFils: p.tax,
          totalFils: p.total,
          // Per-supplier rules live on each order's snapshot (F05); this records the treatment.
          taxRule: {
            treatment: this.config.tax.treatment,
            bps: p.taxBps,
            base: 'merchandise+shipping',
            per_order: true,
          },
          commissionBps: commission.bps,
          commissionPolicyId: commission.policyId,
          reservationExpiresAt: expiresAt,
          payBy: expiresAt,
        },
      });
      for (const r of reserved) {
        await tx.reservation.create({
          data: { checkoutId: checkout.id, skuId: r.skuId, quantity: r.qty, expiresAt },
        });
        await tx.stockMovement.create({
          data: {
            skuId: r.skuId,
            actorId: user.id,
            kind: 'RESERVE',
            deltaOnHand: 0,
            deltaReserved: r.qty,
            onHandAfter: r.after.on_hand!,
            reservedAfter: r.after.reserved!,
            unavailableAfter: r.after.unavailable!,
            reason: `Checkout ${checkout.number}`,
            referenceId: checkout.id,
          },
        });
      }
      for (const g of p.groups) {
        const commissionFils = bpsOf(g.group.merchandise, commission.bps);
        const order = await tx.order.create({
          data: {
            number: await nextNumber(tx, 'order'),
            checkoutId: checkout.id,
            buyerWorkspaceId: ctx.workspace.id,
            buyerCompanyId: ctx.company.id,
            sellerWorkspaceId: g.group.seller.workspace_id,
            sellerCompanyId: g.group.seller_company_id,
            merchandiseFils: g.group.merchandise,
            shippingFils: g.shipping,
            taxFils: g.tax,
            totalFils: g.total,
            commissionFils,
            sellerPayableFils: g.total - commissionFils,
            commissionBps: commission.bps,
            commissionPolicyId: commission.policyId,
            deliveryMethod: g.method,
            snapshot: {
              buyer: { company_name: ctx.company.displayName },
              seller: { company_name: g.group.seller.company_name },
              // C-10: method, charge and terms agreed at checkout.
              delivery: {
                method: g.method,
                fee_fils: g.shipping.toString(),
                days: g.method === 'COLLECTION' ? g.group.collection.days : (g.rate?.days ?? null),
                emirate: p.address.emirate,
                collection:
                  g.method === 'COLLECTION'
                    ? {
                        emirate: g.group.collection.emirate,
                        days: g.group.collection.days,
                        instructions_en: g.group.collection.instructions_en,
                        instructions_ar: g.group.collection.instructions_ar,
                      }
                    : null,
              },
              address: p.address,
              commission_bps: commission.bps,
              commission_policy_version: commission.version,
              tax: {
                treatment: this.config.tax.treatment,
                code: g.taxCode,
                bps: g.taxBps,
                provisional: g.provisional,
                base: 'merchandise+shipping',
                supplier_vat_status: g.group.vat.status,
                supplier_trn: g.group.vat.trn,
              },
              // C-11: the return policy the buyer saw before paying.
              return_policy: g.group.returnPolicy,
            },
            lines: {
              create: g.group.lines.map((l, i) => ({
                position: i + 1,
                skuId: l.sku_id,
                productId: l.product_id,
                title: l.title_en,
                skuCode: l.sku_code,
                variant: l.variant_attributes,
                unit: l.unit,
                quantity: l.quantity,
                unitPriceFils: l.unit_price!,
                lineTotalFils: l.unit_price! * BigInt(l.quantity),
              })),
            },
          },
        });
        await tx.orderEvent.create({
          data: { orderId: order.id, kind: 'order.created', actorSide: 'BUYER', actorId: user.id },
        });
      }
      await tx.cartItem.deleteMany({ where: { buyerWorkspaceId: ctx.workspace.id } });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'checkout.created',
        resourceType: 'checkout',
        resourceId: checkout.id,
        companyId: ctx.company.id,
        details: {
          total_fils: p.total.toString(),
          orders: p.groups.length,
          sandbox: this.config.psp?.sandbox ?? false,
        },
        requestId: meta.requestId,
        ip: meta.ip,
      });
      return checkout.id;
    }, TX);
    return this.view(ctx, id);
  }

  async get(user: User, ws: string, id: string): Promise<CheckoutResponse> {
    const ctx = await loadWorkspaceContext(this.prisma, user.id, ws, 'BUYER');
    requireCap(ctx, 'buyer.orders.read');
    await this.own(ctx, id);
    return this.view(ctx, id);
  }

  private async own(ctx: WorkspaceContext, id: string): Promise<Checkout> {
    assertUuid(id);
    const c = await this.prisma.checkout.findFirst({
      where: { id, buyerWorkspaceId: ctx.workspace.id },
    });
    if (!c) throw new ApiError('NOT_FOUND', 'common.not_found');
    return c;
  }

  async view(ctx: WorkspaceContext, id: string): Promise<CheckoutResponse> {
    const c = await this.prisma.checkout.findUniqueOrThrow({
      where: { id },
      include: {
        orders: { include: { _count: { select: { lines: true } } }, orderBy: { number: 'asc' } },
        payments: { orderBy: { createdAt: 'desc' } },
      },
    });
    const names = await companyNames(this.prisma, [
      c.buyerCompanyId,
      ...c.orders.map((o) => o.sellerCompanyId),
    ]);
    const canPay =
      c.state === 'PENDING_PAYMENT' &&
      c.payBy.getTime() > Date.now() &&
      this.config.checkoutEnabled &&
      ctx.eligible &&
      ['OWNER', 'PROCUREMENT'].includes(ctx.membership.role);
    return {
      id: c.id,
      number: c.number,
      source: c.source,
      state: c.state,
      address: (c.addressSnapshot ?? null) as CheckoutResponse['address'],
      po_reference: c.poReference,
      merchandise_fils: c.merchandiseFils.toString(),
      shipping_fils: c.shippingFils.toString(),
      tax_fils: c.taxFils.toString(),
      total_fils: c.totalFils.toString(),
      pay_by: c.payBy.toISOString(),
      reservation_expires_at: c.reservationExpiresAt?.toISOString() ?? null,
      paid_at: c.paidAt?.toISOString() ?? null,
      rfq_id: c.rfqId,
      orders: c.orders.map((o) => mapOrderSummary({ ...o, checkout: c }, names)),
      payments: c.payments.map(mapPayment),
      sandbox: this.config.psp?.sandbox ?? false,
      can_pay: canPay,
    };
  }

  /**
   * Start (or resume) a payment. Reuses an open session; a failed attempt may be retried until
   * pay_by. The redirect goes to the provider's hosted page (sandbox: the labelled test page).
   */
  async pay(
    user: User,
    ws: string,
    id: string,
    b: z.infer<typeof paymentStartRequest>,
    meta: RequestMeta,
  ) {
    const ctx = await this.carts.ctx(user, ws);
    this.requireEnabled();
    const psp = this.config.psp!;
    const c0 = await this.own(ctx, id);
    if (c0.state !== 'PENDING_PAYMENT') throw new ApiError('CONFLICT', 'checkout.not_payable');
    if (c0.payBy.getTime() <= Date.now()) throw new ApiError('CONFLICT', 'checkout.expired');

    if (!c0.addressSnapshot) {
      if (!b.address_id)
        throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', {
          address_id: 'required',
        });
      const address = await this.addresses.own(ctx.workspace.id, b.address_id);
      const rfq = c0.rfqId ? await this.prisma.rfq.findUnique({ where: { id: c0.rfqId } }) : null;
      if (rfq && rfq.emirate !== address.emirate)
        throw new ApiError('VALIDATION_FAILED', 'checkout.address_emirate_mismatch', {
          address_id: 'emirate_mismatch',
        });
      await this.prisma.checkout.updateMany({
        where: { id: c0.id, addressSnapshot: { equals: Prisma.DbNull } },
        data: { addressSnapshot: addressSnapshot(address) },
      });
    }

    const open = await this.prisma.payment.findFirst({
      where: { checkoutId: c0.id, state: { in: ['CREATED', 'PENDING'] } },
      orderBy: { createdAt: 'desc' },
    });
    if (open && (await psp.getSessionState(open.providerRef)) === 'OPEN')
      return this.redirect(open.id, open.providerRef, psp.sandbox);

    const attempts = await this.prisma.payment.count({ where: { checkoutId: c0.id } });
    if (attempts >= COMMERCE_LIMITS.maxPaymentAttempts)
      throw new ApiError('CONFLICT', 'checkout.too_many_attempts');
    const key = `${c0.id}:${attempts + 1}`;
    const session = await psp.createSession({
      amountFils: c0.totalFils,
      currency: c0.currency,
      reference: c0.number,
      idempotencyKey: key,
      returnUrl: `/app/buyer/${ctx.workspace.id}/checkouts/${c0.id}`,
    });
    const payment = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.payment.findUnique({ where: { idempotencyKey: key } });
      if (existing) return existing;
      const p = await tx.payment.create({
        data: {
          checkoutId: c0.id,
          provider: psp.provider,
          providerRef: session.sessionId,
          idempotencyKey: key,
          state: 'PENDING',
          amountFils: c0.totalFils,
          currency: c0.currency,
          sandbox: psp.sandbox,
        },
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'payment.started',
        resourceType: 'checkout',
        resourceId: c0.id,
        companyId: ctx.company.id,
        details: { payment_id: p.id, sandbox: psp.sandbox, amount_fils: c0.totalFils.toString() },
        requestId: meta.requestId,
        ip: meta.ip,
      });
      return p;
    });
    return this.redirect(payment.id, payment.providerRef, psp.sandbox);
  }

  private redirect(paymentId: string, sessionId: string, sandbox: boolean) {
    return { payment_id: paymentId, redirect_url: `/sandbox-pay/${sessionId}`, sandbox };
  }

  /** Buyer cancels an unpaid cart checkout; the provider is asked first (no release on capture). */
  async cancel(user: User, ws: string, id: string, meta: RequestMeta) {
    const ctx = await this.carts.ctx(user, ws);
    const c = await this.own(ctx, id);
    if (c.source !== 'CART') throw new ApiError('CONFLICT', 'checkout.quote_cancel_unsupported');
    if (c.state !== 'PENDING_PAYMENT') throw new ApiError('CONFLICT', 'checkout.not_payable');
    const psp = this.config.psp;
    const open = await this.prisma.payment.findMany({
      where: { checkoutId: c.id, state: { in: ['CREATED', 'PENDING'] } },
    });
    for (const p of open) {
      const state = psp ? await psp.cancelSession(p.providerRef) : 'UNKNOWN';
      if (state === 'CAPTURED') throw new ApiError('CONFLICT', 'checkout.payment_in_progress');
    }
    await this.prisma.$transaction(async (tx) => {
      await closeUnpaidCheckout(tx, c.id, 'CANCELLED', {
        reason: 'cancelled_by_buyer',
        actorSide: 'BUYER',
        actorId: user.id,
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'checkout.cancelled',
        resourceType: 'checkout',
        resourceId: c.id,
        companyId: ctx.company.id,
        requestId: meta.requestId,
        ip: meta.ip,
      });
    }, TX);
    return this.view(ctx, c.id);
  }
}

/** The tax rule recorded on a quote order: the quote's own code and rate, labelled (F05). */
function quoteOrderTax(tax: TaxSettings, vat: SupplierVat, v: QuoteVersion) {
  const provisional = tax.treatment === 'provisional_standard';
  const code =
    v.taxCode === 'STANDARD'
      ? provisional
        ? 'PROVISIONAL_STANDARD'
        : 'STANDARD'
      : vat.status === 'NOT_REGISTERED' && !provisional
        ? 'NO_VAT_NOT_REGISTERED'
        : v.taxCode;
  return {
    treatment: tax.treatment,
    code,
    bps: v.taxBps,
    provisional,
    base: 'merchandise+shipping',
    source: 'quote',
    supplier_vat_status: vat.status,
    supplier_trn: vat.trn,
  };
}

/**
 * Award to unpaid order (Phase 4): inside the award transaction, create the QUOTE checkout and a
 * single AWAITING_PAYMENT order from the accepted version. Totals are the quote's own figures
 * (P4-1, P4-2); commission is on merchandise (P4-3). Pay before rfq.paymentDueAt (A05).
 */
export async function createQuoteCheckout(
  tx: Tx,
  input: {
    rfq: Rfq;
    version: QuoteVersion;
    buyer: { workspaceId: string; companyId: string; companyName: string };
    seller: { workspaceId: string; companyId: string; companyName: string };
    userId: string;
    payBy: Date;
    poReference: string | null;
    /** Rate used when no commission policy version has been recorded yet. */
    commissionFallbackBps: number;
    /** VAT treatment (F05) and the supplier's VAT status at award. */
    tax: TaxSettings;
    sellerVat: SupplierVat;
  },
): Promise<{ checkoutId: string; orderId: string }> {
  const v = input.version;
  const policy = await activeCommission(tx, input.commissionFallbackBps);
  const commission = bpsOf(v.subtotalFils, policy.bps);
  const checkout = await tx.checkout.create({
    data: {
      number: await nextNumber(tx, 'checkout'),
      buyerWorkspaceId: input.buyer.workspaceId,
      buyerCompanyId: input.buyer.companyId,
      createdById: input.userId,
      source: 'QUOTE',
      rfqId: input.rfq.id,
      quoteVersionId: v.id,
      poReference: input.poReference,
      merchandiseFils: v.subtotalFils,
      shippingFils: v.shippingFils,
      taxFils: v.taxFils,
      totalFils: v.totalFils,
      taxRule: { code: v.taxCode, bps: v.taxBps, base: 'merchandise+shipping', source: 'quote' },
      commissionBps: policy.bps,
      commissionPolicyId: policy.policyId,
      payBy: input.payBy,
    },
  });
  const order = await tx.order.create({
    data: {
      number: await nextNumber(tx, 'order'),
      checkoutId: checkout.id,
      buyerWorkspaceId: input.buyer.workspaceId,
      buyerCompanyId: input.buyer.companyId,
      sellerWorkspaceId: input.seller.workspaceId,
      sellerCompanyId: input.seller.companyId,
      merchandiseFils: v.subtotalFils,
      shippingFils: v.shippingFils,
      taxFils: v.taxFils,
      totalFils: v.totalFils,
      commissionFils: commission,
      sellerPayableFils: v.totalFils - commission,
      commissionBps: policy.bps,
      commissionPolicyId: policy.policyId,
      // C-10: delivery charge and date agreed in the quote.
      deliveryMethod: 'QUOTE_TERMS',
      snapshot: {
        buyer: { company_name: input.buyer.companyName },
        seller: { company_name: input.seller.companyName },
        delivery: {
          method: 'QUOTE_TERMS',
          fee_fils: v.shippingFils.toString(),
          emirate: input.rfq.emirate,
          delivery_date: v.deliveryDate.toISOString().slice(0, 10),
          lead_days: v.leadDays,
        },
        rfq: { id: input.rfq.id, number: input.rfq.number },
        quote_version_id: v.id,
        commission_bps: policy.bps,
        commission_policy_version: policy.version,
        tax: quoteOrderTax(input.tax, input.sellerVat, v),
      },
      lines: {
        create: [
          {
            position: 1,
            quoteVersionId: v.id,
            title: input.rfq.title,
            unit: v.unit,
            quantity: v.quantity,
            unitPriceFils: v.unitPriceFils,
            lineTotalFils: v.unitPriceFils * BigInt(v.quantity),
          },
        ],
      },
    },
  });
  await tx.orderEvent.create({
    data: {
      orderId: order.id,
      kind: 'order.created',
      actorSide: 'BUYER',
      actorId: input.userId,
      reason: `Awarded ${input.rfq.number}`,
    },
  });
  return { checkoutId: checkout.id, orderId: order.id };
}
