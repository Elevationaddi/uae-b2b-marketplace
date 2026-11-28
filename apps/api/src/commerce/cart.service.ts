import { Inject, Injectable } from '@nestjs/common';
import { COMMERCE_LIMITS, priceForQuantity, type CartView } from '@app/contracts';
import { Prisma, type PrismaClient, type User } from '@app/db';
import { assertUuid } from '../catalog/access';
import { ApiError } from '../common/api-error';
import { PRISMA } from '../infra/tokens';
import { loadWorkspaceContext, requireCap, type WorkspaceContext } from '../rfq/access';
import { CommerceConfig } from './commerce-common';
import { loadCart, publicLine } from './pricing';

/**
 * Buyer workspace cart (docs/02-buyer.md). Only approved trading buyers (owner/procurement) may
 * use it (A12). Only ready-stock FIXED/TIERED listings can be added (P4-6); everything else goes
 * through an RFQ. A buyer company can never buy from itself (T42).
 */
@Injectable()
export class CartService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly config: CommerceConfig,
  ) {}

  async ctx(user: User, ws: string): Promise<WorkspaceContext> {
    const ctx = await loadWorkspaceContext(this.prisma, user.id, ws, 'BUYER');
    requireCap(ctx, 'buyer.purchase');
    return ctx;
  }

  async view(user: User, ws: string): Promise<CartView> {
    const ctx = await this.ctx(user, ws);
    return this.render(ctx);
  }

  async render(ctx: WorkspaceContext): Promise<CartView> {
    const groups = await loadCart(this.prisma, ctx.workspace.id);
    return {
      groups: groups.map((g) => ({
        seller: g.seller,
        delivery: {
          rates: g.delivery.rates,
          collection: {
            available: g.collection.enabled,
            emirate: g.collection.enabled ? g.collection.emirate : null,
            days: g.collection.enabled ? g.collection.days : null,
          },
        },
        lines: g.lines.map(publicLine),
        merchandise_fils: g.merchandise.toString(),
      })),
      line_count: groups.reduce((n, g) => n + g.lines.length, 0),
      merchandise_fils: groups.reduce((a, g) => a + g.merchandise, 0n).toString(),
      checkout_available: this.config.checkoutEnabled,
      checkout_unavailable_reason: this.config.checkoutEnabled
        ? null
        : 'checkout.payments_disabled',
    };
  }

  /** Validate a SKU and quantity against live listing data; returns nothing on success. */
  private async assertBuyable(ctx: WorkspaceContext, skuId: string, quantity: number) {
    assertUuid(skuId);
    const sku = await this.prisma.sku.findFirst({
      where: { id: skuId, active: true, approvedAt: { not: null } },
      include: { tiers: true, inventory: true, product: true },
    });
    if (!sku) throw new ApiError('NOT_FOUND', 'common.not_found');
    const listed = await this.prisma.$queryRaw<{ mode: string; company_id: string }[]>`
      SELECT mode::text AS mode, company_id FROM marketplace_products WHERE id = ${sku.productId}::uuid`;
    const row = listed[0];
    if (!row) throw new ApiError('NOT_FOUND', 'common.not_found');
    if (row.company_id === ctx.company.id) throw new ApiError('CONFLICT', 'cart.self_trade');
    if (row.mode !== 'READY_STOCK' || sku.product.priceType === 'QUOTE_ONLY')
      throw new ApiError('CONFLICT', 'cart.not_cart_eligible');
    const p = priceForQuantity(
      sku.product.priceType,
      {
        moq: sku.moq,
        order_increment: sku.orderIncrement,
        tiers: sku.tiers.map((t) => ({ min_qty: t.minQty, unit_price_fils: t.unitPriceFils })),
      },
      quantity,
    );
    if (!p.ok)
      throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', {
        quantity: p.code === 'MOQ_NOT_MET' ? 'moq' : p.code === 'INCREMENT' ? 'increment' : 'min',
      });
    const inv = sku.inventory;
    const available = inv ? inv.onHand - inv.reserved - inv.unavailable : 0;
    if (available < quantity)
      throw new ApiError('CONFLICT', 'cart.insufficient_stock', { quantity: 'insufficient_stock' });
  }

  async add(user: User, ws: string, skuId: string, quantity: number) {
    const ctx = await this.ctx(user, ws);
    const existing = await this.prisma.cartItem.findUnique({
      where: { buyerWorkspaceId_skuId: { buyerWorkspaceId: ctx.workspace.id, skuId } },
    });
    const next = (existing?.quantity ?? 0) + quantity;
    await this.assertBuyable(ctx, skuId, next);
    if (!existing) {
      const n = await this.prisma.cartItem.count({ where: { buyerWorkspaceId: ctx.workspace.id } });
      if (n >= COMMERCE_LIMITS.maxCartLines) throw new ApiError('CONFLICT', 'cart.limit_reached');
    }
    try {
      await this.prisma.cartItem.upsert({
        where: { buyerWorkspaceId_skuId: { buyerWorkspaceId: ctx.workspace.id, skuId } },
        create: { buyerWorkspaceId: ctx.workspace.id, skuId, quantity: next, addedById: user.id },
        update: { quantity: next },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ApiError('CONFLICT', 'common.stale_version');
      throw e;
    }
    return this.render(ctx);
  }

  async update(user: User, ws: string, itemId: string, quantity: number) {
    const ctx = await this.ctx(user, ws);
    const item = await this.own(ctx, itemId);
    await this.assertBuyable(ctx, item.skuId, quantity);
    await this.prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
    return this.render(ctx);
  }

  async remove(user: User, ws: string, itemId: string) {
    const ctx = await this.ctx(user, ws);
    const item = await this.own(ctx, itemId);
    await this.prisma.cartItem.delete({ where: { id: item.id } });
    return this.render(ctx);
  }

  private async own(ctx: WorkspaceContext, id: string) {
    assertUuid(id);
    const item = await this.prisma.cartItem.findFirst({
      where: { id, buyerWorkspaceId: ctx.workspace.id },
    });
    if (!item) throw new ApiError('NOT_FOUND', 'common.not_found');
    return item;
  }
}
