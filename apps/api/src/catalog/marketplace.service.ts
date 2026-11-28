import { Inject, Injectable } from '@nestjs/common';
import {
  MAX_COMPARE,
  priceForQuantity,
  type CategoryNode,
  type HomeResponse,
  type MarketplaceSearchQuery,
  type ProductCard,
  type PublicProductDetail,
  type SupplierCard,
  type SupplierDetail,
  type supplierDirectoryQuery,
} from '@app/contracts';
import { Prisma, type PrismaClient } from '@app/db';
import type { z } from 'zod';
import { ApiError } from '../common/api-error';
import { PRISMA } from '../infra/tokens';
import { assertUuid, decodeOffset, encodeOffset, searchTokens } from './access';
import { mapCertifications, mediaUrl } from './mappers';

/**
 * Who is looking. Guests browse approved listings; email-verified users additionally see wholesale
 * prices and keep lists; only approved buyer workspaces may trade (A12). Resolved server-side from
 * the session cookie; never from the client.
 */
export interface Viewer {
  userId: string | null;
  verified: boolean;
  approvedBuyer: boolean;
}
export const GUEST: Viewer = { userId: null, verified: false, approvedBuyer: false };

const PUBLIC = { kind: 'public' } as const;
const MAX_OFFSET = 5000;

/** One row of the marketplace_products view (the single definition of public visibility). */
interface MpRow {
  id: string;
  seller_workspace_id: string;
  company_id: string;
  price_type: 'FIXED' | 'TIERED' | 'QUOTE_ONLY';
  min_price_fils: bigint | null;
  min_moq: number | null;
  published_at: Date | null;
  version_id: string;
  title_en: string;
  title_ar: string | null;
  category_id: string;
  parent_category_id: string | null;
  mode: 'READY_STOCK' | 'MADE_TO_ORDER';
  lead_time_min_days: number | null;
  lead_time_max_days: number | null;
  custom_manufacturing: boolean;
  private_label: boolean;
  white_label: boolean;
  samples_available: boolean;
  company_name: string;
  emirate: string;
  storefront_id: string | null;
  business_type: string | null;
  in_stock: boolean;
}

interface CatRow {
  id: string;
  parent_id: string | null;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  image_file_id: string | null;
  priority: boolean;
  restriction: 'OPEN' | 'REVIEW_REQUIRED' | 'BLOCKED';
  requirements_en: string | null;
  requirements_ar: string | null;
  position: number;
}

@Injectable()
export class MarketplaceService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  // ------------------------------------------------------------------ viewer

  async viewerFor(user: { id: string; emailVerifiedAt: Date | null } | null): Promise<Viewer> {
    if (!user || !user.emailVerifiedAt) return GUEST;
    const buyer = await this.prisma.$queryRaw<{ n: number }[]>`
      SELECT count(*)::int AS n FROM memberships m
        JOIN workspaces w ON w.id = m.workspace_id AND w.kind = 'BUYER' AND w.status = 'ACTIVE'
        JOIN companies c ON c.id = w.company_id AND c.status = 'APPROVED'
         AND c.licence_expiry >= (now() AT TIME ZONE 'UTC')::date
       WHERE m.user_id = ${user.id}::uuid AND m.status = 'ACTIVE' AND m.role IN ('OWNER', 'PROCUREMENT')`;
    return { userId: user.id, verified: true, approvedBuyer: (buyer[0]?.n ?? 0) > 0 };
  }

  // ------------------------------------------------------------------ cards

  /** Public cards for the given product ids, in the given order; non-public ids are dropped. */
  async cards(ids: string[], viewer: Viewer): Promise<ProductCard[]> {
    if (ids.length === 0) return [];
    const rows = await this.prisma.$queryRaw<MpRow[]>`
      SELECT * FROM marketplace_products WHERE id IN (${Prisma.join(ids.map((i) => Prisma.sql`${i}::uuid`))})`;
    const images = await this.firstImages(rows.map((r) => r.version_id));
    const byId = new Map(rows.map((r) => [r.id, r]));
    return ids
      .map((id) => byId.get(id))
      .filter((r): r is MpRow => !!r)
      .map((r) => this.card(r, images.get(r.version_id) ?? null, viewer));
  }

  private async firstImages(versionIds: string[]) {
    const out = new Map<string, string>();
    if (versionIds.length === 0) return out;
    const media = await this.prisma.productMedia.findMany({
      where: { productVersionId: { in: versionIds }, position: 0 },
      select: { productVersionId: true, fileId: true },
    });
    for (const m of media) out.set(m.productVersionId, mediaUrl(PUBLIC, m.fileId));
    return out;
  }

  private card(r: MpRow, image: string | null, viewer: Viewer): ProductCard {
    return {
      id: r.id,
      title_en: r.title_en,
      title_ar: r.title_ar,
      category_id: r.category_id,
      image_url: image,
      mode: r.mode,
      in_stock: r.in_stock,
      price: {
        visible: viewer.verified,
        price_type: r.price_type,
        min_price_fils:
          viewer.verified && r.min_price_fils !== null ? r.min_price_fils.toString() : null,
      },
      min_moq: r.min_moq,
      lead_time_min_days: r.lead_time_min_days,
      lead_time_max_days: r.lead_time_max_days,
      custom_manufacturing: r.custom_manufacturing,
      private_label: r.private_label,
      white_label: r.white_label,
      samples_available: r.samples_available,
      supplier: {
        storefront_id: r.storefront_id,
        name: r.company_name,
        emirate: r.emirate as ProductCard['supplier']['emirate'],
        business_type: r.business_type as ProductCard['supplier']['business_type'],
        verified: true,
      },
      published_at: r.published_at?.toISOString() ?? null,
    };
  }

  // ------------------------------------------------------------------ search

  private where(
    q: MarketplaceSearchQuery,
    viewer: Viewer,
    opts: { ignoreCategory?: boolean } = {},
  ) {
    const c: Prisma.Sql[] = [Prisma.sql`TRUE`];
    for (const t of searchTokens(q.q)) {
      c.push(Prisma.sql`(search_text LIKE '%' || mkt_normalize(${t}) || '%' ESCAPE '\\'
        OR company_search LIKE '%' || mkt_normalize(${t}) || '%' ESCAPE '\\')`);
    }
    if (q.category_id && !opts.ignoreCategory)
      c.push(
        Prisma.sql`(category_id = ${q.category_id}::uuid OR parent_category_id = ${q.category_id}::uuid)`,
      );
    if (q.storefront_id) c.push(Prisma.sql`storefront_id = ${q.storefront_id}::uuid`);
    if (q.mode) c.push(Prisma.sql`mode::text = ${q.mode}`);
    if (q.business_type?.length)
      c.push(Prisma.sql`business_type::text IN (${Prisma.join(q.business_type)})`);
    if (q.emirate?.length) c.push(Prisma.sql`emirate::text IN (${Prisma.join(q.emirate)})`);
    if (q.price_min !== undefined || q.price_max !== undefined) {
      // Prices are hidden from guests; filtering on them would let a guest infer them (A12).
      if (!viewer.verified)
        throw new ApiError('VALIDATION_FAILED', 'marketplace.price_requires_verified', {
          price_min: 'requires_verified',
        });
      if (q.price_min !== undefined) c.push(Prisma.sql`min_price_fils >= ${BigInt(q.price_min)}`);
      if (q.price_max !== undefined) c.push(Prisma.sql`min_price_fils <= ${BigInt(q.price_max)}`);
    }
    if (q.moq_max !== undefined) c.push(Prisma.sql`min_moq <= ${q.moq_max}`);
    if (q.lead_time_max !== undefined)
      c.push(Prisma.sql`(mode = 'READY_STOCK' OR lead_time_max_days <= ${q.lead_time_max})`);
    if (q.delivery_max !== undefined) c.push(Prisma.sql`fulfilment_days <= ${q.delivery_max}`);
    if (q.in_stock !== undefined)
      c.push(q.in_stock ? Prisma.sql`in_stock` : Prisma.sql`NOT in_stock`);
    if (q.custom) c.push(Prisma.sql`custom_manufacturing`);
    if (q.private_label) c.push(Prisma.sql`private_label`);
    if (q.white_label) c.push(Prisma.sql`white_label`);
    if (q.samples) c.push(Prisma.sql`samples_available`);
    if (q.attrs) {
      for (const pair of q.attrs.split(',')) {
        const i = pair.indexOf(':');
        const key = pair.slice(0, i);
        const value = pair.slice(i + 1);
        c.push(Prisma.sql`attributes ->> ${key} = ${value}`);
      }
    }
    return Prisma.join(c, ' AND ');
  }

  async search(q: MarketplaceSearchQuery, viewer: Viewer) {
    if ((q.sort === 'price_asc' || q.sort === 'price_desc') && !viewer.verified)
      throw new ApiError('VALIDATION_FAILED', 'marketplace.price_requires_verified', {
        sort: 'requires_verified',
      });
    const offset = decodeOffset(q.cursor);
    const where = this.where(q, viewer);
    const norm = q.q ? q.q.slice(0, 100) : '';
    const order = {
      relevance: norm
        ? Prisma.sql`similarity(search_text, mkt_normalize(${norm})) DESC, published_at DESC NULLS LAST`
        : Prisma.sql`published_at DESC NULLS LAST`,
      newest: Prisma.sql`published_at DESC NULLS LAST`,
      price_asc: Prisma.sql`min_price_fils ASC NULLS LAST`,
      price_desc: Prisma.sql`min_price_fils DESC NULLS LAST`,
      moq_asc: Prisma.sql`min_moq ASC NULLS LAST`,
    }[q.sort];
    const [ids, total, facets] = await Promise.all([
      this.prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM marketplace_products WHERE ${where} ORDER BY ${order}, id ASC
        LIMIT ${q.limit + 1} OFFSET ${offset}`,
      this.prisma.$queryRaw<
        { n: number }[]
      >`SELECT count(*)::int AS n FROM marketplace_products WHERE ${where}`,
      this.prisma.$queryRaw<
        { category_id: string; parent_category_id: string | null; n: number }[]
      >`
        SELECT category_id, parent_category_id, count(*)::int AS n FROM marketplace_products
         WHERE ${this.where(q, viewer, { ignoreCategory: true })} GROUP BY 1, 2`,
    ]);
    const counts = new Map<string, number>();
    for (const f of facets) {
      counts.set(f.category_id, (counts.get(f.category_id) ?? 0) + f.n);
      if (f.parent_category_id)
        counts.set(f.parent_category_id, (counts.get(f.parent_category_id) ?? 0) + f.n);
    }
    const pageIds = ids.slice(0, q.limit).map((r) => r.id);
    const next =
      ids.length > q.limit && offset + q.limit <= MAX_OFFSET
        ? encodeOffset(offset + q.limit)
        : null;
    return {
      items: await this.cards(pageIds, viewer),
      total: total[0]?.n ?? 0,
      price_visible: viewer.verified,
      facets: { categories: [...counts].map(([id, count]) => ({ id, count })) },
      next_cursor: next,
    };
  }

  async suggest(q: string) {
    const tokens = searchTokens(q);
    if (tokens.length === 0) return { products: [], suppliers: [], categories: [] };
    const like = Prisma.join(
      tokens.map((t) => Prisma.sql`search_text LIKE '%' || mkt_normalize(${t}) || '%' ESCAPE '\\'`),
      ' AND ',
    );
    const supLike = Prisma.join(
      tokens.map(
        (t) => Prisma.sql`company_search LIKE '%' || mkt_normalize(${t}) || '%' ESCAPE '\\'`,
      ),
      ' AND ',
    );
    const [products, suppliers, categories] = await Promise.all([
      this.prisma.$queryRaw<{ id: string; title_en: string; title_ar: string | null }[]>`
        SELECT id, title_en, title_ar FROM marketplace_products WHERE ${like}
         ORDER BY similarity(search_text, mkt_normalize(${q})) DESC, id LIMIT 6`,
      this.prisma.$queryRaw<{ id: string; name: string }[]>`
        SELECT id, company_name AS name FROM marketplace_suppliers WHERE ${supLike}
         ORDER BY similarity(company_search, mkt_normalize(${q})) DESC, id LIMIT 4`,
      this.prisma.$queryRaw<{ id: string; name_en: string; name_ar: string }[]>`
        SELECT c.id, c.name_en, c.name_ar FROM categories c
          LEFT JOIN categories p ON p.id = c.parent_id
         WHERE c.visible AND c.archived_at IS NULL AND c.restriction <> 'BLOCKED'
           AND (p.id IS NULL OR (p.visible AND p.archived_at IS NULL AND p.restriction <> 'BLOCKED'))
           AND (mkt_normalize(c.name_en) LIKE '%' || mkt_normalize(${tokens[0]!}) || '%' ESCAPE '\\'
             OR mkt_normalize(c.name_ar) LIKE '%' || mkt_normalize(${tokens[0]!}) || '%' ESCAPE '\\')
         ORDER BY c.position, c.id LIMIT 4`,
    ]);
    return { products, suppliers, categories };
  }

  // ------------------------------------------------------------------ categories

  private async visibleCategories(): Promise<CatRow[]> {
    return this.prisma.$queryRaw<CatRow[]>`
      SELECT c.id, c.parent_id, c.slug, c.name_en, c.name_ar, c.description_en, c.description_ar,
             c.image_file_id, c.priority, c.restriction, c.requirements_en, c.requirements_ar, c.position
        FROM categories c LEFT JOIN categories p ON p.id = c.parent_id
       WHERE c.visible AND c.archived_at IS NULL AND c.restriction <> 'BLOCKED'
         AND (p.id IS NULL OR (p.visible AND p.archived_at IS NULL AND p.restriction <> 'BLOCKED'))
       ORDER BY c.position, c.name_en`;
  }

  private async categoryCounts() {
    const rows = await this.prisma.$queryRaw<
      { category_id: string; parent_category_id: string | null; n: number }[]
    >`
      SELECT category_id, parent_category_id, count(*)::int AS n FROM marketplace_products GROUP BY 1, 2`;
    const counts = new Map<string, number>();
    for (const r of rows) {
      counts.set(r.category_id, (counts.get(r.category_id) ?? 0) + r.n);
      if (r.parent_category_id)
        counts.set(r.parent_category_id, (counts.get(r.parent_category_id) ?? 0) + r.n);
    }
    return counts;
  }

  private catBase(c: CatRow, counts: Map<string, number>) {
    return {
      id: c.id,
      parent_id: c.parent_id,
      slug: c.slug,
      name_en: c.name_en,
      name_ar: c.name_ar,
      description_en: c.description_en,
      description_ar: c.description_ar,
      image_url: c.image_file_id ? mediaUrl(PUBLIC, c.image_file_id) : null,
      priority: c.priority,
      restriction: c.restriction,
      requirements_en: c.requirements_en,
      requirements_ar: c.requirements_ar,
      position: c.position,
      product_count: counts.get(c.id) ?? 0,
    };
  }

  async categories(): Promise<CategoryNode[]> {
    const [cats, counts] = await Promise.all([this.visibleCategories(), this.categoryCounts()]);
    return cats
      .filter((c) => !c.parent_id)
      .map((c) => ({
        ...this.catBase(c, counts),
        children: cats.filter((k) => k.parent_id === c.id).map((k) => this.catBase(k, counts)),
      }));
  }

  async category(id: string) {
    assertUuid(id);
    const [cats, counts] = await Promise.all([this.visibleCategories(), this.categoryCounts()]);
    const c = cats.find((x) => x.id === id);
    if (!c) throw new ApiError('NOT_FOUND', 'common.not_found');
    const parent = c.parent_id ? cats.find((x) => x.id === c.parent_id) : undefined;
    const attrs = await this.prisma.categoryAttribute.findMany({
      where: { categoryId: { in: [c.id, ...(c.parent_id ? [c.parent_id] : [])] }, active: true },
      orderBy: [{ position: 'asc' }, { key: 'asc' }],
    });
    return {
      ...this.catBase(c, counts),
      parent: parent ? { id: parent.id, name_en: parent.name_en, name_ar: parent.name_ar } : null,
      children: cats.filter((k) => k.parent_id === c.id).map((k) => this.catBase(k, counts)),
      attributes: attrs.map((a) => ({
        id: a.id,
        category_id: a.categoryId,
        key: a.key,
        label_en: a.labelEn,
        label_ar: a.labelAr,
        type: a.type,
        options: Array.isArray(a.options)
          ? (a.options as { value: string; label_en: string; label_ar: string }[])
          : [],
        unit: a.unit,
        required: a.required,
        filterable: a.filterable,
        position: a.position,
        active: a.active,
      })),
    };
  }

  // ------------------------------------------------------------------ product detail

  private async publicRow(id: string) {
    assertUuid(id);
    const rows = await this.prisma.$queryRaw<
      MpRow[]
    >`SELECT * FROM marketplace_products WHERE id = ${id}::uuid`;
    const r = rows[0];
    if (!r) throw new ApiError('NOT_FOUND', 'common.not_found');
    return r;
  }

  private tradingFor(viewer: Viewer, priceType: string) {
    if (!viewer.verified) return { available: false, reason: 'sign_in' as const, rfq: false };
    if (!viewer.approvedBuyer)
      return { available: false, reason: 'requires_approved_buyer' as const, rfq: false };
    // Purchase (cart/checkout) arrives in Phase 4; quotations are available from Phase 3.
    if (priceType === 'QUOTE_ONLY')
      return { available: false, reason: 'quote_only' as const, rfq: true };
    return { available: false, reason: 'phase_unavailable' as const, rfq: true };
  }

  async product(id: string, viewer: Viewer): Promise<PublicProductDetail> {
    const r = await this.publicRow(id);
    const v = await this.prisma.productVersion.findUniqueOrThrow({
      where: { id: r.version_id },
      include: { media: { orderBy: { position: 'asc' } }, category: { include: { parent: true } } },
    });
    const [skus, files, attrDefs, storefront, verified, saved, compared] = await Promise.all([
      this.prisma.sku.findMany({
        where: { productId: r.id, active: true, approvedAt: { not: null } },
        include: { tiers: { orderBy: { minQty: 'asc' } }, inventory: true },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      }),
      this.prisma.file.findMany({
        where: { id: { in: v.media.map((m) => m.fileId) } },
        select: { id: true, width: true, height: true },
      }),
      this.prisma.categoryAttribute.findMany({
        where: {
          categoryId: { in: [v.categoryId, ...(v.category.parentId ? [v.category.parentId] : [])] },
          active: true,
        },
        orderBy: [{ position: 'asc' }, { key: 'asc' }],
      }),
      r.storefront_id
        ? this.prisma.storefront.findUnique({
            where: { id: r.storefront_id },
            include: { media: { where: { kind: 'LOGO' } } },
          })
        : null,
      this.verifiedSince([r.company_id]),
      viewer.userId
        ? this.prisma.savedItem.count({ where: { userId: viewer.userId, productId: r.id } })
        : Promise.resolve(0),
      viewer.userId
        ? this.prisma.comparisonItem.count({ where: { userId: viewer.userId, productId: r.id } })
        : Promise.resolve(0),
    ]);
    const dims = new Map(files.map((f) => [f.id, f]));
    const attrs = (v.attributes ?? {}) as Record<string, unknown>;
    const logo = storefront?.media[0];
    return {
      id: r.id,
      title_en: v.titleEn,
      title_ar: v.titleAr,
      description_en: v.descriptionEn ?? '',
      description_ar: v.descriptionAr,
      category: {
        id: v.category.id,
        name_en: v.category.nameEn,
        name_ar: v.category.nameAr,
        parent: v.category.parent
          ? {
              id: v.category.parent.id,
              name_en: v.category.parent.nameEn,
              name_ar: v.category.parent.nameAr,
            }
          : null,
      },
      media: v.media.map((m) => ({
        id: m.id,
        file_id: m.fileId,
        url: mediaUrl(PUBLIC, m.fileId),
        position: m.position,
        alt_en: m.altEn,
        alt_ar: m.altAr,
        width: dims.get(m.fileId)?.width ?? null,
        height: dims.get(m.fileId)?.height ?? null,
      })),
      mode: v.mode,
      attributes: attrDefs
        .filter((a) => attrs[a.key] !== undefined && attrs[a.key] !== null && attrs[a.key] !== '')
        .map((a) => {
          const raw = attrs[a.key];
          let value = String(raw);
          if (a.type === 'SELECT' && Array.isArray(a.options)) {
            const opt = (a.options as { value: string; label_en: string }[]).find(
              (o) => o.value === raw,
            );
            if (opt) value = opt.label_en;
          }
          if (a.type === 'BOOLEAN') value = raw ? 'yes' : 'no';
          return { key: a.key, label_en: a.labelEn, label_ar: a.labelAr, value, unit: a.unit };
        }),
      specifications: (Array.isArray(v.specifications)
        ? (v.specifications as Record<string, unknown>[])
        : []
      ).map((s) => ({
        label_en: String(s.label_en ?? ''),
        label_ar: (s.label_ar as string | null) ?? null,
        value: String(s.value ?? ''),
      })),
      materials: v.materials,
      dimensions: v.dimensions,
      country_of_origin: v.countryOfOrigin,
      lead_time_min_days: v.leadTimeMinDays,
      lead_time_max_days: v.leadTimeMaxDays,
      fulfilment_days: v.fulfilmentDays,
      custom_manufacturing: v.customManufacturing,
      private_label: v.privateLabel,
      white_label: v.whiteLabel,
      samples_available: v.samplesAvailable,
      sample_note: v.sampleNote,
      certifications: mapCertifications(v.certifications),
      video_url: v.videoUrl,
      price_visible: viewer.verified,
      price_type: r.price_type,
      skus: skus.map((s) => {
        const avail = s.inventory
          ? s.inventory.onHand - s.inventory.reserved - s.inventory.unavailable
          : 0;
        return {
          id: s.id,
          code: s.code,
          variant_attributes: (s.variantAttributes ?? {}) as Record<string, string>,
          unit: s.unit,
          moq: s.moq,
          order_increment: s.orderIncrement,
          tiers:
            viewer.verified && r.price_type !== 'QUOTE_ONLY'
              ? s.tiers.map((t) => ({
                  min_qty: t.minQty,
                  unit_price_fils: t.unitPriceFils.toString(),
                }))
              : null,
          availability:
            v.mode === 'MADE_TO_ORDER' ? 'MADE_TO_ORDER' : avail > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
        };
      }),
      supplier: {
        storefront_id: r.storefront_id,
        name: r.company_name,
        emirate: r.emirate as PublicProductDetail['supplier']['emirate'],
        business_type: r.business_type as PublicProductDetail['supplier']['business_type'],
        verified: true,
        verified_since: verified.get(r.company_id) ?? null,
        year_established: storefront?.yearEstablished ?? null,
        logo_url: logo ? mediaUrl(PUBLIC, logo.fileId) : null,
      },
      viewer: {
        tier: viewer.verified ? 'verified' : 'guest',
        saved: saved > 0,
        compared: compared > 0,
        trading: this.tradingFor(viewer, r.price_type),
      },
      published_at: r.published_at?.toISOString() ?? null,
    };
  }

  async related(id: string, viewer: Viewer) {
    const r = await this.publicRow(id);
    const ids = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM marketplace_products
       WHERE id <> ${r.id}::uuid
         AND (category_id = ${r.category_id}::uuid
              OR (${r.parent_category_id}::uuid IS NOT NULL AND parent_category_id = ${r.parent_category_id}::uuid))
       ORDER BY (category_id = ${r.category_id}::uuid) DESC, published_at DESC NULLS LAST, id LIMIT 8`;
    return {
      items: await this.cards(
        ids.map((x) => x.id),
        viewer,
      ),
    };
  }

  /** Server-side price for a quantity (T09/T10). Verified users only; never a commitment. */
  async estimate(id: string, skuId: string, quantity: number, viewer: Viewer) {
    if (!viewer.verified) throw new ApiError('FORBIDDEN', 'marketplace.price_requires_verified');
    const r = await this.publicRow(id);
    assertUuid(skuId);
    const sku = await this.prisma.sku.findFirst({
      where: { id: skuId, productId: r.id, active: true, approvedAt: { not: null } },
      include: { tiers: true },
    });
    if (!sku) throw new ApiError('NOT_FOUND', 'common.not_found');
    const res = priceForQuantity(
      r.price_type,
      {
        moq: sku.moq,
        order_increment: sku.orderIncrement,
        tiers: sku.tiers.map((t) => ({ min_qty: t.minQty, unit_price_fils: t.unitPriceFils })),
      },
      quantity,
    );
    if (!res.ok) {
      const map = {
        MOQ_NOT_MET: ['catalog.moq_not_met', 'moq'],
        INCREMENT: ['catalog.order_increment', 'increment'],
        QUOTE_ONLY: ['catalog.quote_only', 'quote_only'],
        INVALID: ['common.validation_failed', 'invalid'],
      } as const;
      const [key, code] = map[res.code];
      throw new ApiError('VALIDATION_FAILED', key, { quantity: code });
    }
    return {
      sku_id: sku.id,
      quantity,
      unit_price_fils: res.unitPriceFils.toString(),
      line_total_fils: res.lineTotalFils.toString(),
      tier_min_qty: res.tierMinQty,
      currency: 'AED' as const,
    };
  }

  // ------------------------------------------------------------------ suppliers

  private async verifiedSince(companyIds: string[]) {
    const out = new Map<string, string>();
    if (companyIds.length === 0) return out;
    const rows = await this.prisma.verificationCase.groupBy({
      by: ['companyId'],
      where: { companyId: { in: companyIds }, state: 'APPROVED' },
      _min: { decidedAt: true },
    });
    for (const r of rows)
      if (r._min.decidedAt) out.set(r.companyId, r._min.decidedAt.toISOString());
    return out;
  }

  /** Supplier cards for storefront ids (must be in marketplace_suppliers), in the given order. */
  async supplierCards(ids: string[]): Promise<SupplierCard[]> {
    if (ids.length === 0) return [];
    const pub = await this.prisma.$queryRaw<
      { id: string; company_id: string; company_name: string; emirate: string }[]
    >`
      SELECT id, company_id, company_name, emirate::text AS emirate FROM marketplace_suppliers
       WHERE id IN (${Prisma.join(ids.map((i) => Prisma.sql`${i}::uuid`))})`;
    if (pub.length === 0) return [];
    const sfIds = pub.map((p) => p.id);
    const [sfs, counts, cats, verified] = await Promise.all([
      this.prisma.storefront.findMany({
        where: { id: { in: sfIds } },
        include: { media: { where: { kind: { in: ['LOGO', 'COVER'] } } } },
      }),
      this.prisma.$queryRaw<{ storefront_id: string; n: number }[]>`
        SELECT storefront_id, count(*)::int AS n FROM marketplace_products
         WHERE storefront_id IN (${Prisma.join(sfIds.map((i) => Prisma.sql`${i}::uuid`))}) GROUP BY 1`,
      this.prisma.$queryRaw<
        { storefront_id: string; id: string; name_en: string; name_ar: string }[]
      >`
        SELECT DISTINCT mp.storefront_id, c.id, c.name_en, c.name_ar FROM marketplace_products mp
          JOIN categories c ON c.id = COALESCE(mp.parent_category_id, mp.category_id)
         WHERE mp.storefront_id IN (${Prisma.join(sfIds.map((i) => Prisma.sql`${i}::uuid`))})`,
      this.verifiedSince(pub.map((p) => p.company_id)),
    ]);
    const sfById = new Map(sfs.map((s) => [s.id, s]));
    const pubById = new Map(pub.map((p) => [p.id, p]));
    const countBy = new Map(counts.map((c) => [c.storefront_id, c.n]));
    return ids
      .filter((id) => pubById.has(id) && sfById.has(id))
      .map((id) => {
        const p = pubById.get(id)!;
        const s = sfById.get(id)!;
        const logo = s.media.find((m) => m.kind === 'LOGO');
        const cover = s.media.find((m) => m.kind === 'COVER');
        return {
          id,
          name: p.company_name,
          emirate: p.emirate as SupplierCard['emirate'],
          business_type: s.businessType,
          logo_url: logo ? mediaUrl(PUBLIC, logo.fileId) : null,
          cover_url: cover ? mediaUrl(PUBLIC, cover.fileId) : null,
          year_established: s.yearEstablished,
          specialization_en: s.specializationEn,
          specialization_ar: s.specializationAr,
          categories: cats
            .filter((c) => c.storefront_id === id)
            .map((c) => ({ id: c.id, name_en: c.name_en, name_ar: c.name_ar })),
          product_count: countBy.get(id) ?? 0,
          verified_since: verified.get(p.company_id) ?? null,
          customization_services: s.customizationServices,
          private_label: s.privateLabel,
          white_label: s.whiteLabel,
          samples_available: s.samplesAvailable,
        };
      });
  }

  async suppliers(q: z.infer<typeof supplierDirectoryQuery>) {
    const offset = decodeOffset(q.cursor);
    const c: Prisma.Sql[] = [Prisma.sql`TRUE`];
    for (const t of searchTokens(q.q))
      c.push(Prisma.sql`ms.company_search LIKE '%' || mkt_normalize(${t}) || '%' ESCAPE '\\'`);
    if (q.category_id)
      c.push(Prisma.sql`EXISTS (SELECT 1 FROM marketplace_products mp WHERE mp.storefront_id = ms.id
        AND (mp.category_id = ${q.category_id}::uuid OR mp.parent_category_id = ${q.category_id}::uuid))`);
    if (q.emirate?.length) c.push(Prisma.sql`ms.emirate::text IN (${Prisma.join(q.emirate)})`);
    if (q.business_type?.length)
      c.push(Prisma.sql`ms.business_type::text IN (${Prisma.join(q.business_type)})`);
    if (q.custom) c.push(Prisma.sql`s.customization_services`);
    if (q.private_label) c.push(Prisma.sql`s.private_label`);
    if (q.white_label) c.push(Prisma.sql`s.white_label`);
    if (q.samples) c.push(Prisma.sql`s.samples_available`);
    const where = Prisma.join(c, ' AND ');
    const [ids, total] = await Promise.all([
      this.prisma.$queryRaw<{ id: string }[]>`
        SELECT ms.id FROM marketplace_suppliers ms JOIN storefronts s ON s.id = ms.id
         WHERE ${where} ORDER BY ms.company_name ASC, ms.id ASC LIMIT ${q.limit + 1} OFFSET ${offset}`,
      this.prisma.$queryRaw<{ n: number }[]>`
        SELECT count(*)::int AS n FROM marketplace_suppliers ms JOIN storefronts s ON s.id = ms.id WHERE ${where}`,
    ]);
    return {
      items: await this.supplierCards(ids.slice(0, q.limit).map((r) => r.id)),
      total: total[0]?.n ?? 0,
      next_cursor:
        ids.length > q.limit && offset + q.limit <= MAX_OFFSET
          ? encodeOffset(offset + q.limit)
          : null,
    };
  }

  async supplier(id: string, viewer: Viewer): Promise<SupplierDetail> {
    assertUuid(id);
    const [card] = await this.supplierCards([id]);
    if (!card) throw new ApiError('NOT_FOUND', 'common.not_found');
    const s = await this.prisma.storefront.findUniqueOrThrow({
      where: { id },
      include: { media: true },
    });
    const saved = viewer.userId
      ? await this.prisma.savedItem.count({ where: { userId: viewer.userId, storefrontId: id } })
      : 0;
    return {
      ...card,
      description_en: s.descriptionEn,
      description_ar: s.descriptionAr,
      city: s.city,
      capabilities_en: s.capabilitiesEn,
      capabilities_ar: s.capabilitiesAr,
      production_capacity: s.productionCapacity,
      fulfilment_en: s.fulfilmentEn,
      fulfilment_ar: s.fulfilmentAr,
      certifications: mapCertifications(s.certifications),
      gallery: s.media
        .filter((m) => m.kind !== 'LOGO' && m.kind !== 'COVER')
        .sort((a, b) => a.kind.localeCompare(b.kind) || a.position - b.position)
        .map((m) => ({
          id: m.id,
          kind: m.kind,
          url: mediaUrl(PUBLIC, m.fileId),
          position: m.position,
          caption_en: m.captionEn,
          caption_ar: m.captionAr,
        })),
      viewer: { tier: viewer.verified ? 'verified' : 'guest', saved: saved > 0 },
    };
  }

  // ------------------------------------------------------------------ home

  private async featuredIds(kind: 'PRODUCT' | 'SUPPLIER') {
    const now = new Date();
    const rows = await this.prisma.featuredListing.findMany({
      where: {
        kind,
        removedAt: null,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gt: now } }] },
        ],
      },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
      take: 24,
    });
    return rows.map((r) => (kind === 'PRODUCT' ? r.productId! : r.storefrontId!));
  }

  async home(viewer: Viewer): Promise<HomeResponse> {
    const [cats, totals, fp, fs, manuIds, newIds, prefs] = await Promise.all([
      this.categories(),
      this.prisma.$queryRaw<{ p: number; s: number }[]>`
        SELECT (SELECT count(*)::int FROM marketplace_products) AS p,
               (SELECT count(*)::int FROM marketplace_suppliers) AS s`,
      this.featuredIds('PRODUCT'),
      this.featuredIds('SUPPLIER'),
      this.prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM marketplace_suppliers WHERE business_type IN ('MANUFACTURER', 'FACTORY')
         ORDER BY published_at DESC NULLS LAST, id LIMIT 8`,
      this.prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM marketplace_products ORDER BY published_at DESC NULLS LAST, id LIMIT 8`,
      viewer.userId
        ? this.prisma.marketplacePreference.findUnique({ where: { userId: viewer.userId } })
        : null,
    ]);
    let forYou: ProductCard[] = [];
    const prefCats = Array.isArray(prefs?.categoryIds) ? (prefs!.categoryIds as string[]) : [];
    if (prefCats.length) {
      const ids = await this.prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM marketplace_products
         WHERE category_id IN (${Prisma.join(prefCats.map((i) => Prisma.sql`${i}::uuid`))})
            OR parent_category_id IN (${Prisma.join(prefCats.map((i) => Prisma.sql`${i}::uuid`))})
         ORDER BY published_at DESC NULLS LAST, id LIMIT 8`;
      forYou = await this.cards(
        ids.map((x) => x.id),
        viewer,
      );
    }
    return {
      totals: { products: totals[0]?.p ?? 0, suppliers: totals[0]?.s ?? 0 },
      priority_categories: cats.filter((c) => c.priority),
      categories: cats,
      featured_products: (await this.cards(fp, viewer)).slice(0, 8),
      featured_suppliers: (await this.supplierCards(fs)).slice(0, 8),
      manufacturers: await this.supplierCards(manuIds.map((x) => x.id)),
      new_products: await this.cards(
        newIds.map((x) => x.id),
        viewer,
      ),
      for_you: forYou,
      price_visible: viewer.verified,
    };
  }

  static readonly MAX_COMPARE = MAX_COMPARE;
}
