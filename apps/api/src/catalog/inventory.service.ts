import { Inject, Injectable } from '@nestjs/common';
import type { inventoryAdjustRequest, inventoryQuery, inventorySettingsRequest } from '@app/contracts';
import { hasCapability } from '@app/contracts';
import { Prisma, toIsoDate, writeAudit, type PrismaClient, type User } from '@app/db';
import type { z } from 'zod';
import { ApiError } from '../common/api-error';
import { NEWEST_FIRST, beforeCursor, decodeCursor, page } from '../common/pagination';
import type { RequestMeta } from '../common/request-context';
import { PRISMA } from '../infra/tokens';
import { assertUuid, loadSellerContext, requireSeller, type SellerContext } from './access';
import { available } from './mappers';

type Tx = Prisma.TransactionClient;
type InvRow = { on_hand: number; reserved: number; unavailable: number; version: number };

/**
 * Variant-level stock (docs/05-finance.md stock rules, A11). Every change is one conditional
 * UPDATE ... RETURNING so concurrent adjustments can never drive any counter negative or let
 * reserved + unavailable exceed on_hand (also a CHECK constraint). Each change appends a
 * stock_movements row (append-only by trigger) and an audit entry with actor, quantity and reason.
 */
@Injectable()
export class InventoryService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  private ctx(user: User, ws: string) {
    return loadSellerContext(this.prisma, user.id, ws);
  }

  /** Stock changes: warehouse staff, or catalog editors (owner/admin/sales). Trading-gated. */
  private requireStock(ctx: SellerContext) {
    const role = ctx.membership.role;
    const can = (c: 'seller.inventory.ship' | 'seller.catalog.edit') => hasCapability('SELLER', role, true, c);
    if (!can('seller.inventory.ship') && !can('seller.catalog.edit'))
      throw new ApiError('FORBIDDEN', 'common.forbidden');
    if (!ctx.eligible) throw new ApiError('FORBIDDEN', ctx.ineligibleReason ?? 'catalog.seller_not_eligible');
  }

  private async ownedSku(tx: Tx | PrismaClient, ctx: SellerContext, skuId: string) {
    assertUuid(skuId);
    const sku = await tx.sku.findFirst({
      where: { id: skuId, sellerWorkspaceId: ctx.workspace.id },
      include: { product: { include: { workingVersion: true, publishedVersion: true } }, inventory: true },
    });
    if (!sku) throw new ApiError('NOT_FOUND', 'common.not_found');
    return sku;
  }

  async list(user: User, ws: string, q: z.infer<typeof inventoryQuery>) {
    const ctx = await this.ctx(user, ws);
    requireSeller(ctx, 'seller.catalog.read');
    const cursor = decodeCursor(q.cursor);
    const where: Prisma.SkuWhereInput = {
      sellerWorkspaceId: ctx.workspace.id,
      product: { status: { not: 'REMOVED' } },
      ...(q.q
        ? {
            OR: [
              { code: { contains: q.q, mode: 'insensitive' } },
              { product: { workingVersion: { titleEn: { contains: q.q, mode: 'insensitive' } } } },
              { product: { workingVersion: { titleAr: { contains: q.q } } } },
            ],
          }
        : {}),
      ...beforeCursor(cursor),
    };
    // Low/out filters are computed (available = on_hand - reserved - unavailable); fetch a bounded
    // window and filter in memory so the derived value has one definition (mappers.available).
    const rows = await this.prisma.sku.findMany({
      where,
      include: { product: { include: { workingVersion: true, publishedVersion: true } }, inventory: true },
      orderBy: NEWEST_FIRST,
      take: q.filter === 'all' ? q.limit + 1 : 1000,
    });
    const filtered = rows.filter((s) => {
      const a = available(s.inventory);
      if (q.filter === 'out') return a <= 0 && s.product.workingVersion?.mode !== 'MADE_TO_ORDER';
      if (q.filter === 'low') return s.lowStockThreshold > 0 && a <= s.lowStockThreshold;
      return true;
    });
    const { items, nextCursor } = page(filtered, q.limit);
    return { items: items.map((s) => this.item(s)), next_cursor: nextCursor };
  }

  private item(
    s: Prisma.SkuGetPayload<{
      include: { product: { include: { workingVersion: true; publishedVersion: true } }; inventory: true };
    }>,
  ) {
    const v = s.product.publishedVersion ?? s.product.workingVersion;
    const avail = available(s.inventory);
    return {
      sku_id: s.id,
      product_id: s.productId,
      code: s.code,
      variant_attributes: (s.variantAttributes ?? {}) as Record<string, string>,
      unit: s.unit,
      title_en: v?.titleEn ?? '',
      title_ar: v?.titleAr ?? null,
      product_status: s.product.status,
      mode: v?.mode ?? 'READY_STOCK',
      active: s.active,
      approved: s.approvedAt !== null,
      inventory: {
        on_hand: s.inventory?.onHand ?? 0,
        reserved: s.inventory?.reserved ?? 0,
        unavailable: s.inventory?.unavailable ?? 0,
        available: avail,
        sold: s.inventory?.sold ?? 0,
        version: s.inventory?.version ?? 1,
      },
      low_stock_threshold: s.lowStockThreshold,
      restock_at: s.restockAt ? toIsoDate(s.restockAt) : null,
      low_stock: s.lowStockThreshold > 0 && avail <= s.lowStockThreshold,
    };
  }

  async adjust(user: User, ws: string, skuId: string, body: z.infer<typeof inventoryAdjustRequest>, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws);
    this.requireStock(ctx);
    await this.prisma.$transaction(async (tx) => {
      const sku = await this.ownedSku(tx, ctx, skuId);
      if (sku.product.status === 'REMOVED') throw new ApiError('CONFLICT', 'catalog.product_locked');
      if (!sku.inventory) await tx.inventory.create({ data: { skuId: sku.id } });
      const q = body.quantity;
      let rows: InvRow[];
      let deltas: { onHand: number; unavailable: number };
      switch (body.kind) {
        case 'RECEIVE':
          rows = await tx.$queryRaw<InvRow[]>`UPDATE inventory SET on_hand = on_hand + ${q}, version = version + 1, updated_at = now()
            WHERE sku_id = ${sku.id}::uuid RETURNING on_hand, reserved, unavailable, version`;
          deltas = { onHand: q, unavailable: 0 };
          break;
        case 'REMOVE':
          rows = await tx.$queryRaw<InvRow[]>`UPDATE inventory SET on_hand = on_hand - ${q}, version = version + 1, updated_at = now()
            WHERE sku_id = ${sku.id}::uuid AND on_hand - reserved - unavailable >= ${q}
            RETURNING on_hand, reserved, unavailable, version`;
          deltas = { onHand: -q, unavailable: 0 };
          break;
        case 'MARK_UNAVAILABLE':
          rows = await tx.$queryRaw<InvRow[]>`UPDATE inventory SET unavailable = unavailable + ${q}, version = version + 1, updated_at = now()
            WHERE sku_id = ${sku.id}::uuid AND on_hand - reserved - unavailable >= ${q}
            RETURNING on_hand, reserved, unavailable, version`;
          deltas = { onHand: 0, unavailable: q };
          break;
        case 'RELEASE_UNAVAILABLE':
          rows = await tx.$queryRaw<InvRow[]>`UPDATE inventory SET unavailable = unavailable - ${q}, version = version + 1, updated_at = now()
            WHERE sku_id = ${sku.id}::uuid AND unavailable >= ${q}
            RETURNING on_hand, reserved, unavailable, version`;
          deltas = { onHand: 0, unavailable: -q };
          break;
        case 'SET_ON_HAND': {
          const before = await tx.inventory.findUniqueOrThrow({ where: { skuId: sku.id } });
          rows = await tx.$queryRaw<InvRow[]>`UPDATE inventory SET on_hand = ${q}, version = version + 1, updated_at = now()
            WHERE sku_id = ${sku.id}::uuid AND version = ${body.expected_version!} AND ${q} >= reserved + unavailable
            RETURNING on_hand, reserved, unavailable, version`;
          if (rows.length === 0 && before.version !== body.expected_version)
            throw new ApiError('CONFLICT', 'common.stale_version');
          deltas = { onHand: q - before.onHand, unavailable: 0 };
          break;
        }
      }
      const after = rows[0];
      if (!after)
        throw new ApiError('VALIDATION_FAILED', 'catalog.insufficient_stock', { quantity: 'insufficient_stock' });
      await tx.stockMovement.create({
        data: {
          skuId: sku.id,
          actorId: user.id,
          kind: body.kind,
          deltaOnHand: deltas.onHand,
          deltaUnavailable: deltas.unavailable,
          onHandAfter: after.on_hand,
          reservedAfter: after.reserved,
          unavailableAfter: after.unavailable,
          reason: body.reason,
        },
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'inventory.adjusted',
        resourceType: 'sku',
        resourceId: sku.id,
        companyId: ctx.company.id,
        details: { kind: body.kind, quantity: q, reason: body.reason, on_hand_after: after.on_hand },
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
    return this.get(ctx, skuId);
  }

  private async get(ctx: SellerContext, skuId: string) {
    return this.item(await this.ownedSku(this.prisma, ctx, skuId));
  }

  async settings(user: User, ws: string, skuId: string, body: z.infer<typeof inventorySettingsRequest>, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws);
    this.requireStock(ctx);
    await this.prisma.$transaction(async (tx) => {
      const sku = await this.ownedSku(tx, ctx, skuId);
      const data: Prisma.SkuUpdateInput = {};
      if (body.low_stock_threshold !== undefined) data.lowStockThreshold = body.low_stock_threshold;
      if (body.restock_at !== undefined) data.restockAt = body.restock_at ? new Date(`${body.restock_at}T00:00:00Z`) : null;
      await tx.sku.update({ where: { id: sku.id }, data });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'inventory.settings_changed',
        resourceType: 'sku',
        resourceId: sku.id,
        companyId: ctx.company.id,
        details: {
          before: { low_stock_threshold: sku.lowStockThreshold, restock_at: sku.restockAt ? toIsoDate(sku.restockAt) : null },
          after: body,
        },
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
    return this.get(ctx, skuId);
  }

  async movements(user: User, ws: string, skuId: string, cursorRaw: string | undefined, limit = 50) {
    const ctx = await this.ctx(user, ws);
    requireSeller(ctx, 'seller.catalog.read');
    const sku = await this.ownedSku(this.prisma, ctx, skuId);
    const rows = await this.prisma.stockMovement.findMany({
      where: { skuId: sku.id, ...beforeCursor(decodeCursor(cursorRaw)) },
      orderBy: NEWEST_FIRST,
      take: limit + 1,
    });
    const actorIds = [...new Set(rows.map((r) => r.actorId).filter((x): x is string => !!x))];
    const actors = new Map(
      (await this.prisma.user.findMany({ where: { id: { in: actorIds } }, select: { id: true, email: true } })).map(
        (u) => [u.id, u.email],
      ),
    );
    const { items, nextCursor } = page(rows, limit);
    return {
      items: items.map((m) => ({
        id: m.id,
        kind: m.kind,
        delta_on_hand: m.deltaOnHand,
        delta_reserved: m.deltaReserved,
        delta_unavailable: m.deltaUnavailable,
        on_hand_after: m.onHandAfter,
        reserved_after: m.reservedAfter,
        unavailable_after: m.unavailableAfter,
        reason: m.reason,
        actor_email: m.actorId ? (actors.get(m.actorId) ?? null) : null,
        created_at: m.createdAt.toISOString(),
      })),
      next_cursor: nextCursor,
    };
  }
}
