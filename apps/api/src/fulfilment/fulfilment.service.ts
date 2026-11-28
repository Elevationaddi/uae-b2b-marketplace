import { Inject, Injectable } from '@nestjs/common';
import type {
  reviewCreateRequest,
  reviewHideRequest,
  reviewListQuery,
  shipmentDeliverRequest,
  shipmentDispatchRequest,
} from '@app/contracts';
import type { AppEnv } from '@app/config';
import { Prisma, recomputeSettlement, writeAudit, type PrismaClient, type User } from '@app/db';
import type { z } from 'zod';
import { assertUuid, decodeOffset, encodeOffset } from '../catalog/access';
import { ApiError } from '../common/api-error';
import type { RequestMeta } from '../common/request-context';
import { APP_ENV, PRISMA } from '../infra/tokens';
import { AttachmentService, type Upload } from '../rfq/attachments';
import { loadWorkspaceContext, type WorkspaceContext } from '../rfq/access';
import { notify } from '../rfq/notify';
import { companyNames } from '../commerce/commerce-common';
import { requireRole } from './fulfilment-common';

type Tx = Prisma.TransactionClient;
const PAGE = 20;
const BUYER_NOTIFY = ['OWNER', 'PROCUREMENT'] as const;
const SELLER_NOTIFY = ['OWNER', 'SALES', 'WAREHOUSE', 'FINANCE'] as const;

export async function workspaceUsers(tx: Tx, workspaceId: string, roles: readonly string[]) {
  const m = await tx.membership.findMany({
    where: {
      workspaceId,
      status: 'ACTIVE',
      role: { in: roles as Prisma.EnumMembershipRoleFilter['in'] },
      user: { status: 'ACTIVE' },
    },
    select: { userId: true },
  });
  return [...new Set(m.map((x) => x.userId))];
}

/** Lock an order row and load it within the caller's scope; anything else is 404. */
export async function lockScopedOrder(tx: Tx, id: string, scope: Prisma.OrderWhereInput) {
  assertUuid(id);
  await tx.$queryRaw`SELECT id FROM orders WHERE id = ${id}::uuid FOR UPDATE`;
  const o = await tx.order.findFirst({ where: { id, ...scope }, include: { lines: true } });
  if (!o) throw new ApiError('NOT_FOUND', 'common.not_found');
  return o;
}

/**
 * Seller fulfilment (one shipment per order), buyer receipt and reviews (docs/02-buyer.md,
 * docs/03-seller.md, docs/09-workflows.md). Each transition is a server command with a state
 * check under a row lock; unsupported transitions return 409. Seller delivery evidence is not
 * buyer receipt, and nothing completes automatically.
 */
@Injectable()
export class FulfilmentService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
    private readonly attachments: AttachmentService,
  ) {}

  private async seller(user: User, ws: string) {
    const ctx = await loadWorkspaceContext(this.prisma, user.id, ws, 'SELLER');
    requireRole(ctx, 'seller.inventory.ship');
    return ctx;
  }

  private async buyer(user: User, ws: string) {
    const ctx = await loadWorkspaceContext(this.prisma, user.id, ws, 'BUYER');
    requireRole(ctx, 'buyer.orders.act');
    return ctx;
  }

  private async event(
    tx: Tx,
    orderId: string,
    kind: string,
    side: 'BUYER' | 'SELLER',
    userId: string,
    reason: string | null = null,
  ) {
    await tx.orderEvent.create({
      data: { orderId, kind, actorSide: side, actorId: userId, reason },
    });
  }

  private async audit(
    tx: Tx,
    ctx: WorkspaceContext,
    user: User,
    action: string,
    orderId: string,
    meta: RequestMeta,
    details?: Record<string, unknown>,
  ) {
    await writeAudit(tx, {
      actorId: user.id,
      actorType: 'user',
      action,
      resourceType: 'order',
      resourceId: orderId,
      companyId: ctx.company.id,
      details,
      requestId: meta.requestId,
      ip: meta.ip,
    });
  }

  private async tellBuyer(
    tx: Tx,
    o: { id: string; number: string; buyerWorkspaceId: string },
    type: 'order.dispatched' | 'order.delivered',
  ) {
    await notify(
      tx,
      await workspaceUsers(tx, o.buyerWorkspaceId, BUYER_NOTIFY),
      type,
      { order_id: o.id, order_number: o.number },
      {
        path: `/app/buyer/${o.buyerWorkspaceId}/orders/${o.id}`,
        webOrigin: this.env.WEB_ORIGIN,
      },
    );
  }

  // ---------------------------------------------------------------- seller

  async process(user: User, ws: string, id: string, meta: RequestMeta) {
    const ctx = await this.seller(user, ws);
    await this.prisma.$transaction(async (tx) => {
      const o = await lockScopedOrder(tx, id, { sellerWorkspaceId: ctx.workspace.id });
      if (o.state === 'AWAITING_PAYMENT') throw new ApiError('CONFLICT', 'order.not_paid');
      if (o.state !== 'CONFIRMED') throw new ApiError('CONFLICT', 'order.invalid_transition');
      await tx.order.update({
        where: { id: o.id },
        data: { state: 'PROCESSING', processingAt: new Date(), version: { increment: 1 } },
      });
      await this.event(tx, o.id, 'order.processing', 'SELLER', user.id);
      await this.audit(tx, ctx, user, 'order.processing', o.id, meta);
    });
  }

  async dispatch(
    user: User,
    ws: string,
    id: string,
    body: z.infer<typeof shipmentDispatchRequest>,
    meta: RequestMeta,
  ) {
    const ctx = await this.seller(user, ws);
    if (body.expected_delivery_date && Number.isNaN(Date.parse(body.expected_delivery_date)))
      throw new ApiError('VALIDATION_FAILED', 'common.validation', {
        expected_delivery_date: 'invalid',
      });
    await this.prisma.$transaction(async (tx) => {
      const o = await lockScopedOrder(tx, id, { sellerWorkspaceId: ctx.workspace.id });
      // T24: an unpaid order can never be shipped.
      if (o.state === 'AWAITING_PAYMENT') throw new ApiError('CONFLICT', 'order.not_paid');
      if (o.state !== 'CONFIRMED' && o.state !== 'PROCESSING')
        throw new ApiError('CONFLICT', 'order.invalid_transition');
      const now = new Date();
      await tx.shipment.create({
        data: {
          orderId: o.id,
          carrier: body.carrier,
          trackingCode: body.tracking_code ?? null,
          expectedDeliveryDate: body.expected_delivery_date
            ? new Date(`${body.expected_delivery_date}T00:00:00Z`)
            : null,
          dispatchedAt: now,
          dispatchedById: user.id,
          // MVP: one shipment carrying every line in full (verified quantities).
          items: { create: o.lines.map((l) => ({ orderLineId: l.id, quantity: l.quantity })) },
        },
      });
      await tx.order.update({
        where: { id: o.id },
        data: {
          state: 'DISPATCHED',
          dispatchedAt: now,
          processingAt: o.processingAt ?? now,
          version: { increment: 1 },
        },
      });
      await this.event(tx, o.id, 'order.dispatched', 'SELLER', user.id);
      await this.audit(tx, ctx, user, 'order.dispatched', o.id, meta, { carrier: body.carrier });
      await this.tellBuyer(tx, o, 'order.dispatched');
    });
  }

  async deliver(
    user: User,
    ws: string,
    id: string,
    body: z.infer<typeof shipmentDeliverRequest>,
    file: Upload | undefined,
    meta: RequestMeta,
  ) {
    const ctx = await this.seller(user, ws);
    assertUuid(id);
    const fileData = file
      ? await this.attachments.prepare(
          user.id,
          ctx.company.id,
          file,
          'DELIVERY_PROOF',
          `orders/${id}`,
        )
      : null;
    await this.prisma.$transaction(async (tx) => {
      const o = await lockScopedOrder(tx, id, { sellerWorkspaceId: ctx.workspace.id });
      if (o.state !== 'DISPATCHED') throw new ApiError('CONFLICT', 'order.invalid_transition');
      const f = fileData ? await tx.file.create({ data: fileData }) : null;
      if (f && f.scanState !== 'CLEAN') {
        await this.audit(tx, ctx, user, 'order.proof_quarantined', o.id, meta, { file_id: f.id });
        return;
      }
      const now = new Date();
      await tx.shipment.update({
        where: { orderId: o.id },
        data: {
          state: 'DELIVERED',
          deliveredAt: now,
          deliveredById: user.id,
          deliveryNote: body.note ?? null,
          proofFileId: f?.id ?? null,
        },
      });
      await tx.order.update({
        where: { id: o.id },
        data: { state: 'DELIVERED', deliveredAt: now, version: { increment: 1 } },
      });
      await this.event(tx, o.id, 'order.delivered', 'SELLER', user.id);
      await this.audit(tx, ctx, user, 'order.delivered', o.id, meta, { proof: !!f });
      await this.tellBuyer(tx, o, 'order.delivered');
    });
    if (fileData && fileData.scanState !== 'CLEAN')
      throw new ApiError('VALIDATION_FAILED', 'file.infected', { file: 'infected' });
  }

  async proof(user: User, side: 'buyer' | 'seller', ws: string, id: string, meta: RequestMeta) {
    const ctx = await loadWorkspaceContext(
      this.prisma,
      user.id,
      ws,
      side === 'buyer' ? 'BUYER' : 'SELLER',
    );
    requireRole(ctx, side === 'buyer' ? 'buyer.orders.read' : 'seller.orders.read');
    assertUuid(id);
    const o = await this.prisma.order.findFirst({
      where: {
        id,
        ...(side === 'buyer'
          ? { buyerWorkspaceId: ctx.workspace.id }
          : { sellerWorkspaceId: ctx.workspace.id }),
      },
      include: { shipment: true },
    });
    if (!o?.shipment?.proofFileId) throw new ApiError('NOT_FOUND', 'common.not_found');
    const out = await this.attachments.stream(o.shipment.proofFileId);
    await writeAudit(this.prisma, {
      actorId: user.id,
      actorType: 'user',
      action: 'order.proof_downloaded',
      resourceType: 'file',
      resourceId: o.shipment.proofFileId,
      companyId: ctx.company.id,
      requestId: meta.requestId,
      ip: meta.ip,
    });
    return out;
  }

  // ---------------------------------------------------------------- buyer

  /** Buyer receipt (T25/T26): only a buyer member can complete; the seller never can. */
  async confirmReceipt(user: User, ws: string, id: string, meta: RequestMeta) {
    const ctx = await this.buyer(user, ws);
    await this.prisma.$transaction(async (tx) => {
      const o = await lockScopedOrder(tx, id, { buyerWorkspaceId: ctx.workspace.id });
      if (o.state !== 'DISPATCHED' && o.state !== 'DELIVERED')
        throw new ApiError('CONFLICT', 'order.invalid_transition');
      await tx.order.update({
        where: { id: o.id },
        data: { state: 'COMPLETED', completedAt: new Date(), version: { increment: 1 } },
      });
      await this.event(tx, o.id, 'order.completed', 'BUYER', user.id);
      // Eligible for a payout, not paid: a provider payout event marks it paid (T25).
      await recomputeSettlement(tx, o.id);
      await this.audit(tx, ctx, user, 'order.receipt_confirmed', o.id, meta);
      await notify(
        tx,
        await workspaceUsers(tx, o.sellerWorkspaceId, SELLER_NOTIFY),
        'order.completed',
        { order_id: o.id, order_number: o.number },
        {
          path: `/app/seller/${o.sellerWorkspaceId}/orders/${o.id}`,
          webOrigin: this.env.WEB_ORIGIN,
        },
      );
    });
  }

  /** One review per completed order (T39), by a buyer member; ratings are never edited. */
  async review(
    user: User,
    ws: string,
    id: string,
    body: z.infer<typeof reviewCreateRequest>,
    meta: RequestMeta,
  ) {
    const ctx = await this.buyer(user, ws);
    try {
      await this.prisma.$transaction(async (tx) => {
        const o = await lockScopedOrder(tx, id, { buyerWorkspaceId: ctx.workspace.id });
        if (o.state !== 'COMPLETED') throw new ApiError('CONFLICT', 'review.not_completed');
        if (await tx.review.count({ where: { orderId: o.id } }))
          throw new ApiError('CONFLICT', 'review.exists');
        await tx.review.create({
          data: {
            orderId: o.id,
            buyerWorkspaceId: o.buyerWorkspaceId,
            sellerWorkspaceId: o.sellerWorkspaceId,
            authorId: user.id,
            rating: body.rating,
            comment: body.comment ?? null,
          },
        });
        await this.audit(tx, ctx, user, 'review.created', o.id, meta, { rating: body.rating });
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ApiError('CONFLICT', 'review.exists');
      throw e;
    }
  }

  // ---------------------------------------------------------------- reviews (public and admin)

  /** Published reviews of a public storefront (caller has already checked it is public). */
  /** Public storefront reviews. Buyer identities are not disclosed publicly (P5-6). */
  async storefrontReviews(sellerWorkspaceId: string) {
    const where = { sellerWorkspaceId, state: 'PUBLISHED' as const };
    const [agg, rows] = await Promise.all([
      this.prisma.review.aggregate({ where, _avg: { rating: true }, _count: { _all: true } }),
      this.prisma.review.findMany({ where, orderBy: { createdAt: 'desc' }, take: 10 }),
    ]);
    return {
      average: agg._avg.rating === null ? null : Math.round(agg._avg.rating * 10) / 10,
      count: agg._count._all,
      items: rows.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        buyer_company_name: null,
        created_at: r.createdAt.toISOString(),
      })),
    };
  }

  async adminReviews(q: z.infer<typeof reviewListQuery>) {
    const offset = decodeOffset(q.cursor);
    const rows = await this.prisma.review.findMany({
      where: q.state ? { state: q.state } : {},
      include: { order: true },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: offset,
      take: PAGE + 1,
    });
    const names = await companyNames(
      this.prisma,
      rows.flatMap((r) => [r.order.buyerCompanyId, r.order.sellerCompanyId]),
    );
    return {
      items: rows.slice(0, PAGE).map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        buyer_company_name: names.get(r.order.buyerCompanyId) ?? '',
        seller_company_name: names.get(r.order.sellerCompanyId) ?? '',
        order_id: r.orderId,
        order_number: r.order.number,
        state: r.state,
        hidden_reason: r.hiddenReason,
        created_at: r.createdAt.toISOString(),
      })),
      next: rows.length > PAGE ? encodeOffset(offset + PAGE) : null,
    };
  }

  /** Moderation hides or restores a review; it can never change the rating or text. */
  async moderateReview(
    admin: User,
    id: string,
    hide: boolean,
    body: z.infer<typeof reviewHideRequest>,
    meta: RequestMeta,
  ) {
    assertUuid(id);
    await this.prisma.$transaction(async (tx) => {
      const r = await tx.review.findUnique({ where: { id } });
      if (!r) throw new ApiError('NOT_FOUND', 'common.not_found');
      if ((r.state === 'HIDDEN') === hide) throw new ApiError('CONFLICT', 'review.no_change');
      await tx.review.update({
        where: { id },
        data: hide
          ? { state: 'HIDDEN', hiddenReason: body.reason, hiddenById: admin.id }
          : { state: 'PUBLISHED', hiddenReason: null, hiddenById: null },
      });
      await writeAudit(tx, {
        actorId: admin.id,
        actorType: 'admin',
        action: hide ? 'review.hidden' : 'review.restored',
        resourceType: 'review',
        resourceId: id,
        reason: body.reason,
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
  }
}
