import { Inject, Injectable } from '@nestjs/common';
import { MAX_COMPARE, type preferencesRequest } from '@app/contracts';
import { Prisma, type PrismaClient } from '@app/db';
import type { z } from 'zod';
import { ApiError } from '../common/api-error';
import { PRISMA } from '../infra/tokens';
import { assertUuid } from './access';
import { MarketplaceService, type Viewer } from './marketplace.service';

const MAX_SAVED = 500;
const MAX_RECENT = 30;

/**
 * Saved products/suppliers, comparison, recently viewed and preferences. Per user, email-verified
 * accounts only (A12). Only publicly visible listings can be added; items that later stop being
 * public stay in the list but render as unavailable (product: null) without leaking any content.
 */
@Injectable()
export class BuyerListsService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly market: MarketplaceService,
  ) {}

  private async requirePublicProduct(id: string) {
    assertUuid(id);
    const r = await this.prisma.$queryRaw<{ n: number }[]>`
      SELECT count(*)::int AS n FROM marketplace_products WHERE id = ${id}::uuid`;
    if ((r[0]?.n ?? 0) === 0) throw new ApiError('NOT_FOUND', 'common.not_found');
  }
  private async requirePublicSupplier(id: string) {
    assertUuid(id);
    const r = await this.prisma.$queryRaw<{ n: number }[]>`
      SELECT count(*)::int AS n FROM marketplace_suppliers WHERE id = ${id}::uuid`;
    if ((r[0]?.n ?? 0) === 0) throw new ApiError('NOT_FOUND', 'common.not_found');
  }

  // ---------------------------------------------------------------- saved

  async savedProducts(viewer: Viewer) {
    const rows = await this.prisma.savedItem.findMany({
      where: { userId: viewer.userId!, productId: { not: null } },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: MAX_SAVED,
    });
    const cards = new Map((await this.market.cards(rows.map((r) => r.productId!), viewer)).map((c) => [c.id, c]));
    return {
      items: rows.map((r) => ({
        product_id: r.productId!,
        saved_at: r.createdAt.toISOString(),
        product: cards.get(r.productId!) ?? null,
      })),
    };
  }

  async savedSuppliers(viewer: Viewer) {
    const rows = await this.prisma.savedItem.findMany({
      where: { userId: viewer.userId!, storefrontId: { not: null } },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: MAX_SAVED,
    });
    const cards = new Map((await this.market.supplierCards(rows.map((r) => r.storefrontId!))).map((c) => [c.id, c]));
    return {
      items: rows.map((r) => ({
        storefront_id: r.storefrontId!,
        saved_at: r.createdAt.toISOString(),
        supplier: cards.get(r.storefrontId!) ?? null,
      })),
    };
  }

  async save(viewer: Viewer, kind: 'product' | 'supplier', id: string) {
    if (kind === 'product') await this.requirePublicProduct(id);
    else await this.requirePublicSupplier(id);
    const userId = viewer.userId!;
    const count = await this.prisma.savedItem.count({ where: { userId } });
    if (count >= MAX_SAVED) throw new ApiError('CONFLICT', 'marketplace.saved_limit');
    // Idempotent: partial unique indexes on (user, product) / (user, storefront).
    await this.prisma.$executeRaw`
      INSERT INTO saved_items (id, user_id, product_id, storefront_id, created_at)
      VALUES (gen_random_uuid(), ${userId}::uuid,
              ${kind === 'product' ? id : null}::uuid, ${kind === 'supplier' ? id : null}::uuid, now())
      ON CONFLICT DO NOTHING`;
    return { saved: true };
  }

  async unsave(viewer: Viewer, kind: 'product' | 'supplier', id: string) {
    assertUuid(id);
    await this.prisma.savedItem.deleteMany({
      where: { userId: viewer.userId!, ...(kind === 'product' ? { productId: id } : { storefrontId: id }) },
    });
    return { saved: false };
  }

  // ---------------------------------------------------------------- compare

  async compare(viewer: Viewer) {
    const rows = await this.prisma.comparisonItem.findMany({
      where: { userId: viewer.userId! },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });
    const cards = new Map((await this.market.cards(rows.map((r) => r.productId), viewer)).map((c) => [c.id, c]));
    const publicIds = rows.map((r) => r.productId).filter((id) => cards.has(id));
    const details = publicIds.length
      ? await this.prisma.product.findMany({
          where: { id: { in: publicIds } },
          include: { publishedVersion: { include: { category: true } } },
        })
      : [];
    const catIds = [...new Set(details.flatMap((d) => (d.publishedVersion ? [d.publishedVersion.categoryId, d.publishedVersion.category.parentId] : [])))].filter(
      (x): x is string => !!x,
    );
    const defs = catIds.length
      ? await this.prisma.categoryAttribute.findMany({ where: { categoryId: { in: catIds }, active: true }, orderBy: { position: 'asc' } })
      : [];
    const byId = new Map(details.map((d) => [d.id, d]));
    return {
      items: rows.map((r) => {
        const card = cards.get(r.productId);
        const d = byId.get(r.productId);
        const v = d?.publishedVersion;
        if (!card || !v) return { product_id: r.productId, added_at: r.createdAt.toISOString(), product: null };
        const attrs = (v.attributes ?? {}) as Record<string, unknown>;
        return {
          product_id: r.productId,
          added_at: r.createdAt.toISOString(),
          product: {
            ...card,
            category_name_en: v.category.nameEn,
            category_name_ar: v.category.nameAr,
            materials: v.materials,
            dimensions: v.dimensions,
            country_of_origin: v.countryOfOrigin,
            fulfilment_days: v.fulfilmentDays,
            certifications: (Array.isArray(v.certifications) ? (v.certifications as { name?: string }[]) : []).map((c) =>
              String(c.name ?? ''),
            ),
            attributes: defs
              .filter((a) => (a.categoryId === v.categoryId || a.categoryId === v.category.parentId) && attrs[a.key] != null)
              .map((a) => ({ key: a.key, label_en: a.labelEn, label_ar: a.labelAr, value: String(attrs[a.key]) })),
          },
        };
      }),
    };
  }

  async addCompare(viewer: Viewer, id: string) {
    await this.requirePublicProduct(id);
    const userId = viewer.userId!;
    await this.prisma.$transaction(
      async (tx) => {
        const existing = await tx.comparisonItem.findUnique({ where: { userId_productId: { userId, productId: id } } });
        if (existing) return;
        const n = await tx.comparisonItem.count({ where: { userId } });
        if (n >= MAX_COMPARE) throw new ApiError('CONFLICT', 'marketplace.compare_limit');
        await tx.comparisonItem.create({ data: { userId, productId: id } });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    return this.compare(viewer);
  }

  async removeCompare(viewer: Viewer, id: string) {
    assertUuid(id);
    await this.prisma.comparisonItem.deleteMany({ where: { userId: viewer.userId!, productId: id } });
    return this.compare(viewer);
  }

  // ---------------------------------------------------------------- recent

  async recordView(viewer: Viewer, id: string) {
    await this.requirePublicProduct(id);
    const userId = viewer.userId!;
    await this.prisma.$executeRaw`
      INSERT INTO recently_viewed (id, user_id, product_id, viewed_at)
      VALUES (gen_random_uuid(), ${userId}::uuid, ${id}::uuid, now())
      ON CONFLICT (user_id, product_id) DO UPDATE SET viewed_at = now()`;
    await this.prisma.$executeRaw`
      DELETE FROM recently_viewed WHERE user_id = ${userId}::uuid AND id NOT IN (
        SELECT id FROM recently_viewed WHERE user_id = ${userId}::uuid ORDER BY viewed_at DESC LIMIT ${MAX_RECENT})`;
    return { recorded: true };
  }

  async recent(viewer: Viewer) {
    const rows = await this.prisma.recentlyViewed.findMany({
      where: { userId: viewer.userId! },
      orderBy: [{ viewedAt: 'desc' }, { id: 'desc' }],
      take: MAX_RECENT,
    });
    const cards = new Map((await this.market.cards(rows.map((r) => r.productId), viewer)).map((c) => [c.id, c]));
    return {
      items: rows.map((r) => ({
        product_id: r.productId,
        viewed_at: r.viewedAt.toISOString(),
        product: cards.get(r.productId) ?? null,
      })),
    };
  }

  async clearRecent(viewer: Viewer) {
    await this.prisma.recentlyViewed.deleteMany({ where: { userId: viewer.userId! } });
    return { items: [] };
  }

  // ---------------------------------------------------------------- preferences

  async preferences(viewer: Viewer) {
    const p = await this.prisma.marketplacePreference.findUnique({ where: { userId: viewer.userId! } });
    return {
      category_ids: Array.isArray(p?.categoryIds) ? (p!.categoryIds as string[]) : [],
      emirates: Array.isArray(p?.emirates) ? (p!.emirates as string[]) : [],
      default_view: p?.defaultView ?? 'GRID',
      default_sort: p?.defaultSort ?? 'relevance',
    };
  }

  async updatePreferences(viewer: Viewer, body: z.infer<typeof preferencesRequest>) {
    if (body.category_ids?.length) {
      const n = await this.prisma.category.count({
        where: { id: { in: body.category_ids }, visible: true, archivedAt: null, restriction: { not: 'BLOCKED' } },
      });
      if (n !== new Set(body.category_ids).size)
        throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', { category_ids: 'invalid' });
    }
    const data = {
      ...(body.category_ids ? { categoryIds: [...new Set(body.category_ids)] } : {}),
      ...(body.emirates ? { emirates: [...new Set(body.emirates)] } : {}),
      ...(body.default_view ? { defaultView: body.default_view } : {}),
      ...(body.default_sort ? { defaultSort: body.default_sort } : {}),
    };
    await this.prisma.marketplacePreference.upsert({
      where: { userId: viewer.userId! },
      create: { userId: viewer.userId!, ...data },
      update: data,
    });
    return this.preferences(viewer);
  }
}
