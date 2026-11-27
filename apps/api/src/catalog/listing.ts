/**
 * Listing rules shared by seller and admin services: draft handling, submission validation,
 * restricted-product screening and denormalised listing statistics.
 */
import { validateSkuPricing, type PriceTypeValue } from '@app/contracts';
import { Prisma, type ProductVersion } from '@app/db';
import { ApiError } from '../common/api-error';

type Tx = Prisma.TransactionClient;

export const CONTENT_FIELDS = [
  'titleEn',
  'titleAr',
  'descriptionEn',
  'descriptionAr',
  'categoryId',
  'mode',
  'attributes',
  'specifications',
  'materials',
  'dimensions',
  'countryOfOrigin',
  'leadTimeMinDays',
  'leadTimeMaxDays',
  'fulfilmentDays',
  'customManufacturing',
  'privateLabel',
  'whiteLabel',
  'samplesAvailable',
  'sampleNote',
  'certifications',
  'videoUrl',
] as const;
export type ContentField = (typeof CONTENT_FIELDS)[number];

export const SNAKE: Record<ContentField, string> = {
  titleEn: 'title_en',
  titleAr: 'title_ar',
  descriptionEn: 'description_en',
  descriptionAr: 'description_ar',
  categoryId: 'category_id',
  mode: 'mode',
  attributes: 'attributes',
  specifications: 'specifications',
  materials: 'materials',
  dimensions: 'dimensions',
  countryOfOrigin: 'country_of_origin',
  leadTimeMinDays: 'lead_time_min_days',
  leadTimeMaxDays: 'lead_time_max_days',
  fulfilmentDays: 'fulfilment_days',
  customManufacturing: 'custom_manufacturing',
  privateLabel: 'private_label',
  whiteLabel: 'white_label',
  samplesAvailable: 'samples_available',
  sampleNote: 'sample_note',
  certifications: 'certifications',
  videoUrl: 'video_url',
};

/** Lock the product row for the rest of the transaction (serialises concurrent edits/decisions). */
export async function lockProduct(tx: Tx, productId: string): Promise<void> {
  await tx.$queryRaw`SELECT id FROM products WHERE id = ${productId}::uuid FOR UPDATE`;
}

/** Content copy of a version, for new drafts and duplicates. */
export function contentOf(v: ProductVersion): Prisma.ProductVersionUncheckedCreateInput {
  const out: Record<string, unknown> = {};
  for (const f of CONTENT_FIELDS) {
    const val = (v as unknown as Record<string, unknown>)[f];
    out[f] =
      val === null
        ? f === 'attributes' || f === 'specifications' || f === 'certifications'
          ? undefined
          : null
        : val;
  }
  return out as unknown as Prisma.ProductVersionUncheckedCreateInput;
}

/**
 * Returns the editable DRAFT version of a product, creating one (copied from the latest
 * rejected/changes-requested version, or from the approved version) when needed. The approved
 * version is never edited: it stays live until a replacement is approved (A11).
 */
export async function ensureDraft(
  tx: Tx,
  productId: string,
  userId: string,
): Promise<ProductVersion> {
  const p = await tx.product.findUniqueOrThrow({
    where: { id: productId },
    include: { workingVersion: true, publishedVersion: true },
  });
  const w = p.workingVersion;
  if (w?.state === 'DRAFT') return w;
  if (w?.state === 'PENDING_REVIEW')
    throw new ApiError('CONFLICT', 'catalog.pending_review_locked');
  const source = w ?? p.publishedVersion;
  if (!source) throw new ApiError('CONFLICT', 'catalog.no_content');
  const max = await tx.productVersion.aggregate({ where: { productId }, _max: { version: true } });
  const draft = await tx.productVersion.create({
    data: {
      ...contentOf(source),
      productId,
      version: (max._max.version ?? 0) + 1,
      state: 'DRAFT',
      createdById: userId,
    },
  });
  const media = await tx.productMedia.findMany({ where: { productVersionId: source.id } });
  if (media.length)
    await tx.productMedia.createMany({
      data: media.map((m) => ({
        productVersionId: draft.id,
        fileId: m.fileId,
        position: m.position,
        altEn: m.altEn,
        altAr: m.altAr,
      })),
    });
  await tx.product.update({ where: { id: productId }, data: { workingVersionId: draft.id } });
  return draft;
}

/** Categories a listing may use: visible, not archived, not BLOCKED (and the same for its parent). */
export async function assertSelectableCategory(tx: Tx, categoryId: string) {
  const c = await tx.category.findUnique({ where: { id: categoryId }, include: { parent: true } });
  const ok = (x: { visible: boolean; archivedAt: Date | null; restriction: string }) =>
    x.visible && !x.archivedAt && x.restriction !== 'BLOCKED';
  if (!c || !ok(c) || (c.parent && !ok(c.parent)))
    throw new ApiError('VALIDATION_FAILED', 'catalog.category_unavailable', {
      category_id: 'category_unavailable',
    });
  return c;
}

type AttrDef = {
  key: string;
  type: 'TEXT' | 'NUMBER' | 'SELECT' | 'BOOLEAN';
  required: boolean;
  options: unknown;
};

export function validateAttributes(
  defs: AttrDef[],
  values: Record<string, unknown>,
): Record<string, string> {
  const e: Record<string, string> = {};
  const byKey = new Map(defs.map((d) => [d.key, d]));
  for (const key of Object.keys(values)) if (!byKey.has(key)) e[`attributes.${key}`] = 'unknown';
  for (const d of defs) {
    const v = values[d.key];
    const missing = v === undefined || v === null || v === '';
    if (missing) {
      if (d.required) e[`attributes.${d.key}`] = 'required';
      continue;
    }
    if (d.type === 'NUMBER' && (typeof v !== 'number' || !Number.isFinite(v)))
      e[`attributes.${d.key}`] = 'number';
    if (d.type === 'BOOLEAN' && typeof v !== 'boolean') e[`attributes.${d.key}`] = 'boolean';
    if (d.type === 'TEXT' && typeof v !== 'string') e[`attributes.${d.key}`] = 'invalid';
    if (d.type === 'SELECT') {
      const opts = Array.isArray(d.options) ? (d.options as { value: string }[]) : [];
      if (typeof v !== 'string' || !opts.some((o) => o.value === v))
        e[`attributes.${d.key}`] = 'invalid';
    }
  }
  return e;
}

export async function attributeDefs(tx: Tx, categoryId: string, parentId: string | null) {
  return tx.categoryAttribute.findMany({
    where: { categoryId: { in: parentId ? [categoryId, parentId] : [categoryId] }, active: true },
    orderBy: [{ position: 'asc' }, { key: 'asc' }],
  });
}

export interface ScreeningResult {
  blocked: { term: string; field: string }[];
  flags: { kind: string; term: string; field: string }[];
}

/**
 * Restricted-product screening (provisional rules, D14). Matching uses the database
 * normalisation (Arabic/English) and whole-word boundaries. BLOCK terms reject submission;
 * REVIEW terms add a flag the reviewer must see.
 */
export async function screenContent(
  tx: Tx,
  v: Pick<
    ProductVersion,
    'titleEn' | 'titleAr' | 'descriptionEn' | 'descriptionAr' | 'materials' | 'categoryId'
  >,
  parentCategoryId: string | null,
  categoryRestriction: string,
): Promise<ScreeningResult> {
  const fields: [string, string | null][] = [
    ['title_en', v.titleEn],
    ['title_ar', v.titleAr],
    ['description_en', v.descriptionEn],
    ['description_ar', v.descriptionAr],
    ['materials', v.materials],
  ];
  const cats = [v.categoryId, ...(parentCategoryId ? [parentCategoryId] : [])];
  const result: ScreeningResult = { blocked: [], flags: [] };
  for (const [field, value] of fields) {
    if (!value) continue;
    const hits = await tx.$queryRaw<{ term: string; action: 'BLOCK' | 'REVIEW' }[]>`
      SELECT t.term, t.action::text AS action
        FROM restricted_terms t
       WHERE t.active
         AND (t.category_id IS NULL OR t.category_id = ANY(${cats}::uuid[]))
         AND mkt_normalize(${value}) ~ ('(^|[^[:alnum:]])' ||
               regexp_replace(t.normalized, '([.^$*+?()\\[\\]{}|\\\\-])', '\\\\\\1', 'g') ||
               '($|[^[:alnum:]])')`;
    for (const h of hits) {
      if (h.action === 'BLOCK') result.blocked.push({ term: h.term, field });
      else result.flags.push({ kind: 'restricted_term', term: h.term, field });
    }
  }
  if (categoryRestriction === 'REVIEW_REQUIRED')
    result.flags.push({ kind: 'category_review_required', term: '', field: 'category_id' });
  return result;
}

/**
 * Full submission validation (T07 and A10/A11). Returns field errors; empty when the draft can be
 * submitted for review.
 */
export async function validateForSubmission(
  tx: Tx,
  productId: string,
  draft: ProductVersion,
  priceType: PriceTypeValue,
): Promise<Record<string, string>> {
  const e: Record<string, string> = {};
  if (draft.titleEn.trim().length < 3) e.title_en = 'min';
  if (draft.descriptionEn.trim().length < 20) e.description_en = 'min_description';
  const cat = await tx.category.findUnique({
    where: { id: draft.categoryId },
    include: { parent: true, children: { where: { archivedAt: null, visible: true } } },
  });
  const selectable = (x: { visible: boolean; archivedAt: Date | null; restriction: string }) =>
    x.visible && !x.archivedAt && x.restriction !== 'BLOCKED';
  if (!cat || !selectable(cat) || (cat.parent && !selectable(cat.parent)))
    e.category_id = 'category_unavailable';
  else if (cat.children.length > 0) e.category_id = 'choose_subcategory';
  const restriction =
    cat?.restriction === 'REVIEW_REQUIRED' || cat?.parent?.restriction === 'REVIEW_REQUIRED';
  const certs = Array.isArray(draft.certifications) ? draft.certifications : [];
  if (restriction && certs.length === 0) e.certifications = 'required_for_category';
  if (cat) {
    const defs = await attributeDefs(tx, cat.id, cat.parentId);
    Object.assign(
      e,
      validateAttributes(defs, (draft.attributes as Record<string, unknown> | null) ?? {}),
    );
  }
  if (draft.mode === 'MADE_TO_ORDER' && (draft.leadTimeMinDays ?? null) === null)
    e.lead_time_min_days = 'required';
  if (
    typeof draft.leadTimeMinDays === 'number' &&
    typeof draft.leadTimeMaxDays === 'number' &&
    draft.leadTimeMaxDays < draft.leadTimeMinDays
  )
    e.lead_time_max_days = 'lead_time_range';
  const mediaCount = await tx.productMedia.count({ where: { productVersionId: draft.id } });
  if (mediaCount === 0) e.media = 'required';
  const skus = await tx.sku.findMany({
    where: { productId, active: true },
    include: { tiers: { orderBy: { minQty: 'asc' } } },
  });
  if (skus.length === 0) e.skus = 'required';
  for (const s of skus) {
    const errs = validateSkuPricing(priceType, {
      moq: s.moq,
      order_increment: s.orderIncrement,
      tiers: s.tiers.map((t) => ({
        min_qty: t.minQty,
        unit_price_fils: t.unitPriceFils.toString(),
      })),
    });
    if (Object.keys(errs).length) {
      e.pricing = 'invalid';
      e[`pricing.${s.code}`] = Object.values(errs)[0]!;
    }
  }
  return e;
}

/** Recompute denormalised "from" price and minimum MOQ (live pricing, A11). */
export async function refreshListingStats(tx: Tx, productId: string): Promise<void> {
  const p = await tx.product.findUniqueOrThrow({ where: { id: productId } });
  const skus = await tx.sku.findMany({
    where: {
      productId,
      active: true,
      ...(p.publishedVersionId ? { approvedAt: { not: null } } : {}),
    },
    include: { tiers: true },
  });
  let minPrice: bigint | null = null;
  let minMoq: number | null = null;
  for (const s of skus) {
    minMoq = minMoq === null ? s.moq : Math.min(minMoq, s.moq);
    if (p.priceType === 'QUOTE_ONLY') continue;
    for (const t of s.tiers)
      if (minPrice === null || t.unitPriceFils < minPrice) minPrice = t.unitPriceFils;
  }
  await tx.product.update({
    where: { id: productId },
    data: { minPriceFils: p.priceType === 'QUOTE_ONLY' ? null : minPrice, minMoq },
  });
}

export async function moderationEvent(
  tx: Tx,
  e: {
    productId?: string;
    productVersionId?: string;
    storefrontId?: string;
    actorId: string | null;
    actorType: 'user' | 'admin' | 'system';
    action: string;
    fromState?: string | null;
    toState?: string | null;
    reason?: string | null;
  },
): Promise<void> {
  await tx.moderationEvent.create({
    data: {
      productId: e.productId ?? null,
      productVersionId: e.productVersionId ?? null,
      storefrontId: e.storefrontId ?? null,
      actorId: e.actorId,
      actorType: e.actorType,
      action: e.action,
      fromState: e.fromState ?? null,
      toState: e.toState ?? null,
      reason: e.reason ?? null,
    },
  });
}

export async function isPublicProduct(tx: Tx | Prisma.TransactionClient, productId: string) {
  const r = await tx.$queryRaw<{ n: number }[]>`
    SELECT count(*)::int AS n FROM marketplace_products WHERE id = ${productId}::uuid`;
  return (r[0]?.n ?? 0) > 0;
}

export function isUniqueViolation(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
}
