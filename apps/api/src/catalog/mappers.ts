import type {
  SellerProductDetail,
  SkuDetail,
  StorefrontResponse,
  VersionDetail,
} from '@app/contracts';
import {
  toIsoDate,
  type Category,
  type Inventory,
  type ModerationEvent,
  type PriceTier,
  type Product,
  type ProductMedia,
  type ProductVersion,
  type Sku,
  type Storefront,
  type StorefrontMedia,
} from '@app/db';

export type MediaScope =
  | { kind: 'public' }
  | { kind: 'seller'; workspaceId: string }
  | { kind: 'admin' };

/** URLs are always same-origin API paths; access is re-checked on every request. */
export function mediaUrl(scope: MediaScope, fileId: string): string {
  if (scope.kind === 'seller')
    return `/api/v1/seller/workspaces/${scope.workspaceId}/media/${fileId}`;
  if (scope.kind === 'admin') return `/api/v1/admin/media/${fileId}`;
  return `/api/v1/media/${fileId}`;
}

export const VERSION_INCLUDE = {
  media: { orderBy: { position: 'asc' as const } },
  category: { include: { parent: true } },
} as const;

export const SKU_INCLUDE = {
  tiers: { orderBy: { minQty: 'asc' as const } },
  inventory: true,
} as const;

export const PRODUCT_INCLUDE = {
  publishedVersion: { include: VERSION_INCLUDE },
  workingVersion: { include: VERSION_INCLUDE },
  skus: {
    include: SKU_INCLUDE,
    orderBy: [{ createdAt: 'asc' as const }, { id: 'asc' as const }] as {
      createdAt?: 'asc';
      id?: 'asc';
    }[],
  },
};

export type VersionWithRefs = ProductVersion & {
  media: (ProductMedia & { width?: number | null; height?: number | null })[];
  category: Category & { parent: Category | null };
};
export type SkuWithRefs = Sku & { tiers: PriceTier[]; inventory: Inventory | null };

type Json = Record<string, unknown>;
const asArray = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const asObject = (v: unknown): Json =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Json) : {};

export function mapVersion(
  v: VersionWithRefs,
  scope: MediaScope,
  dims: Map<string, { width: number | null; height: number | null }> = new Map(),
): VersionDetail {
  return {
    id: v.id,
    version: v.version,
    state: v.state,
    title_en: v.titleEn,
    title_ar: v.titleAr,
    description_en: v.descriptionEn,
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
      restriction: v.category.restriction,
    },
    mode: v.mode,
    attributes: asObject(v.attributes) as VersionDetail['attributes'],
    specifications: asArray<Json>(v.specifications).map((s) => ({
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
    media: v.media.map((m) => ({
      id: m.id,
      file_id: m.fileId,
      url: mediaUrl(scope, m.fileId),
      position: m.position,
      alt_en: m.altEn,
      alt_ar: m.altAr,
      width: dims.get(m.fileId)?.width ?? null,
      height: dims.get(m.fileId)?.height ?? null,
    })),
    auto_flags: asArray<Json>(v.autoFlags).map((f) => ({
      kind: String(f.kind ?? ''),
      term: String(f.term ?? ''),
      field: String(f.field ?? ''),
    })),
    submitted_at: v.submittedAt?.toISOString() ?? null,
    decided_at: v.decidedAt?.toISOString() ?? null,
    decision_reason: v.decisionReason,
    created_at: v.createdAt.toISOString(),
  };
}

export function mapCertifications(raw: unknown) {
  return asArray<Json>(raw).map((c) => ({
    name: String(c.name ?? ''),
    issuer: (c.issuer as string | null) ?? null,
    number: (c.number as string | null) ?? null,
    valid_until: (c.valid_until as string | null) ?? null,
  }));
}

export function available(inv: Inventory | null): number {
  return inv ? inv.onHand - inv.reserved - inv.unavailable : 0;
}

export function mapSku(s: SkuWithRefs): SkuDetail {
  const avail = available(s.inventory);
  return {
    id: s.id,
    code: s.code,
    variant_attributes: asObject(s.variantAttributes) as Record<string, string>,
    unit: s.unit,
    moq: s.moq,
    order_increment: s.orderIncrement,
    active: s.active,
    approved: s.approvedAt !== null,
    tiers: s.tiers.map((t) => ({ min_qty: t.minQty, unit_price_fils: t.unitPriceFils.toString() })),
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

export function mapEvent(e: ModerationEvent, versions: Map<string, number>) {
  return {
    id: e.id,
    action: e.action,
    from_state: e.fromState,
    to_state: e.toState,
    reason: e.reason,
    actor_type: e.actorType,
    version: e.productVersionId ? (versions.get(e.productVersionId) ?? null) : null,
    created_at: e.createdAt.toISOString(),
  };
}

export type ProductWithRefs = Product & {
  publishedVersion: VersionWithRefs | null;
  workingVersion: VersionWithRefs | null;
  skus: SkuWithRefs[];
};

export function baseProductDetail(
  p: ProductWithRefs,
  scope: MediaScope,
  history: ModerationEvent[],
  isPublic: boolean,
  versionNumbers: Map<string, number>,
  dims: Map<string, { width: number | null; height: number | null }>,
): Omit<SellerProductDetail, 'actions'> {
  return {
    id: p.id,
    workspace_id: p.sellerWorkspaceId,
    status: p.status,
    status_reason: p.statusReason,
    price_type: p.priceType,
    version: p.version,
    public: isPublic,
    published_version: p.publishedVersion ? mapVersion(p.publishedVersion, scope, dims) : null,
    working_version: p.workingVersion ? mapVersion(p.workingVersion, scope, dims) : null,
    skus: p.skus.map(mapSku),
    history: history.map((e) => mapEvent(e, versionNumbers)),
    created_at: p.createdAt.toISOString(),
    updated_at: p.updatedAt.toISOString(),
  };
}

export function mapStorefront(
  s: Storefront & { media: StorefrontMedia[] },
  companyName: string,
  scope: MediaScope,
  isPublic: boolean,
): StorefrontResponse {
  return {
    id: s.id,
    workspace_id: s.sellerWorkspaceId,
    company_name: companyName,
    status: s.status,
    public: isPublic,
    admin_hidden: s.adminHiddenAt !== null,
    admin_hidden_reason: s.adminHiddenReason,
    business_type: s.businessType,
    description_en: s.descriptionEn,
    description_ar: s.descriptionAr,
    year_established: s.yearEstablished,
    city: s.city,
    specialization_en: s.specializationEn,
    specialization_ar: s.specializationAr,
    capabilities_en: s.capabilitiesEn,
    capabilities_ar: s.capabilitiesAr,
    production_capacity: s.productionCapacity,
    customization_services: s.customizationServices,
    private_label: s.privateLabel,
    white_label: s.whiteLabel,
    samples_available: s.samplesAvailable,
    fulfilment_en: s.fulfilmentEn,
    fulfilment_ar: s.fulfilmentAr,
    certifications: mapCertifications(s.certifications),
    media: [...s.media]
      .sort((a, b) => a.kind.localeCompare(b.kind) || a.position - b.position)
      .map((m) => ({
        id: m.id,
        kind: m.kind,
        url: mediaUrl(scope, m.fileId),
        position: m.position,
        caption_en: m.captionEn,
        caption_ar: m.captionAr,
      })),
    version: s.version,
    published_at: s.publishedAt?.toISOString() ?? null,
  };
}
