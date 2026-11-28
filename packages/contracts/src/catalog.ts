/**
 * Phase 2 contracts: categories, storefronts, products, pricing, inventory, moderation and the
 * buyer marketplace (A09–A12). JSON keys are snake_case; money is integer fils as a digit string.
 */
import { z } from 'zod';
import { emirate, isoDate, isoDateTime, uuid } from './common';

export const CATEGORY_RESTRICTIONS = ['OPEN', 'REVIEW_REQUIRED', 'BLOCKED'] as const;
export const ATTRIBUTE_TYPES = ['TEXT', 'NUMBER', 'SELECT', 'BOOLEAN'] as const;
export const BUSINESS_TYPES = [
  'MANUFACTURER',
  'FACTORY',
  'WHOLESALER',
  'DISTRIBUTOR',
  'IMPORTER',
  'AUTHORIZED_DISTRIBUTOR',
  'TRADING_COMPANY',
] as const;
export const PRODUCT_STATUSES = [
  'DRAFT',
  'PUBLISHED',
  'UNPUBLISHED',
  'SUSPENDED',
  'ARCHIVED',
  'REMOVED',
] as const;
export const VERSION_STATES = [
  'DRAFT',
  'PENDING_REVIEW',
  'APPROVED',
  'REJECTED',
  'CHANGES_REQUESTED',
  'SUPERSEDED',
  'WITHDRAWN',
] as const;
export const FULFILMENT_MODES = ['READY_STOCK', 'MADE_TO_ORDER'] as const;
export const PRICE_TYPES = ['FIXED', 'TIERED', 'QUOTE_ONLY'] as const;
export const QUANTITY_UNITS = [
  'PIECE',
  'CARTON',
  'BOX',
  'PACK',
  'SET',
  'PAIR',
  'ROLL',
  'DOZEN',
] as const;
export const STOCK_MOVEMENT_KINDS = [
  'RECEIVE',
  'REMOVE',
  'MARK_UNAVAILABLE',
  'RELEASE_UNAVAILABLE',
  'SET_ON_HAND',
] as const;
/** Every movement kind, including the system movements written by checkout (Phase 4). */
export const ALL_STOCK_MOVEMENT_KINDS = [
  ...STOCK_MOVEMENT_KINDS,
  'RESERVE',
  'RELEASE_RESERVATION',
  'SALE',
] as const;
export const STOREFRONT_MEDIA_KINDS = ['LOGO', 'COVER', 'FACTORY', 'WAREHOUSE', 'OTHER'] as const;
export const MARKETPLACE_SORTS = [
  'relevance',
  'newest',
  'price_asc',
  'price_desc',
  'moq_asc',
] as const;
/** Seller product list tabs (docs: supplier dashboard). */
export const SELLER_PRODUCT_TABS = [
  'all',
  'draft',
  'pending',
  'published',
  'rejected',
  'suspended',
  'archived',
] as const;

export const categoryRestriction = z.enum(CATEGORY_RESTRICTIONS);
export const businessType = z.enum(BUSINESS_TYPES);
export const productStatus = z.enum(PRODUCT_STATUSES);
export const versionState = z.enum(VERSION_STATES);
export const fulfilmentMode = z.enum(FULFILMENT_MODES);
export const priceType = z.enum(PRICE_TYPES);
export const quantityUnit = z.enum(QUANTITY_UNITS);
export const filsString = z.string().regex(/^\d{1,15}$/, 'money');

const text = (min: number, max: number) => z.string().trim().min(min, 'min').max(max, 'max');
const optText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, 'max')
    .nullish()
    .transform((v) => (v === '' || v === undefined ? null : v));
const boolQuery = z
  .enum(['true', 'false', '1', '0'])
  .optional()
  .transform((v) => (v === undefined ? undefined : v === 'true' || v === '1'));
const intQuery = (max: number) => z.coerce.number().int().min(0).max(max).optional();
const csvEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .string()
    .max(300)
    .optional()
    .transform((v, ctx) => {
      if (!v) return undefined;
      const parts = v.split(',').filter(Boolean);
      for (const p of parts)
        if (!(values as readonly string[]).includes(p)) {
          ctx.addIssue({ code: 'custom', message: 'invalid' });
          return z.NEVER;
        }
      return parts as T[number][];
    });

// ------------------------------------------------------------------ categories

export const attributeOption = z.object({
  value: text(1, 60),
  label_en: text(1, 80),
  label_ar: text(1, 80),
});
export const categoryAttributeResponse = z.object({
  id: uuid,
  category_id: uuid,
  key: z.string(),
  label_en: z.string(),
  label_ar: z.string(),
  type: z.enum(ATTRIBUTE_TYPES),
  options: z.array(attributeOption),
  unit: z.string().nullable(),
  required: z.boolean(),
  filterable: z.boolean(),
  position: z.number().int(),
  active: z.boolean(),
});
export type CategoryAttributeResponse = z.infer<typeof categoryAttributeResponse>;

const categoryBase = {
  id: uuid,
  parent_id: uuid.nullable(),
  slug: z.string(),
  name_en: z.string(),
  name_ar: z.string(),
  description_en: z.string().nullable(),
  description_ar: z.string().nullable(),
  image_url: z.string().nullable(),
  priority: z.boolean(),
  restriction: categoryRestriction,
  requirements_en: z.string().nullable(),
  requirements_ar: z.string().nullable(),
  position: z.number().int(),
  /** Number of publicly visible products in this category and its subcategories. */
  product_count: z.number().int(),
};
export const categoryNode = z.object({
  ...categoryBase,
  children: z.array(z.object(categoryBase)),
});
export type CategoryNode = z.infer<typeof categoryNode>;
export const categoryDetail = z.object({
  ...categoryBase,
  parent: z.object({ id: uuid, name_en: z.string(), name_ar: z.string() }).nullable(),
  children: z.array(z.object(categoryBase)),
  /** Active attributes of the category and (for a subcategory) its parent. */
  attributes: z.array(categoryAttributeResponse),
});
export type CategoryDetail = z.infer<typeof categoryDetail>;

export const adminCategoryItem = z.object({
  ...categoryBase,
  visible: z.boolean(),
  archived_at: isoDateTime.nullable(),
  version: z.number().int(),
  listing_count: z.number().int(),
  attribute_count: z.number().int(),
});
export type AdminCategoryItem = z.infer<typeof adminCategoryItem>;
export const adminCategoryDetail = adminCategoryItem.extend({
  parent: z.object({ id: uuid, name_en: z.string(), name_ar: z.string() }).nullable(),
  children: z.array(adminCategoryItem),
  attributes: z.array(categoryAttributeResponse),
});

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug')
  .max(80, 'max');
export const categoryCreateRequest = z.object({
  parent_id: uuid.nullish(),
  slug,
  name_en: text(2, 80),
  name_ar: text(2, 80),
  description_en: optText(500),
  description_ar: optText(500),
  position: z.number().int().min(0).max(10000).default(0),
  visible: z.boolean().default(true),
  priority: z.boolean().default(false),
  restriction: categoryRestriction.default('OPEN'),
  requirements_en: optText(1000),
  requirements_ar: optText(1000),
  reason: optText(2000),
});
export const categoryUpdateRequest = z
  .object({
    name_en: text(2, 80).optional(),
    name_ar: text(2, 80).optional(),
    description_en: optText(500).optional(),
    description_ar: optText(500).optional(),
    position: z.number().int().min(0).max(10000).optional(),
    visible: z.boolean().optional(),
    priority: z.boolean().optional(),
    restriction: categoryRestriction.optional(),
    requirements_en: optText(1000).optional(),
    requirements_ar: optText(1000).optional(),
    archived: z.boolean().optional(),
    reason: optText(2000),
    expected_version: z.number().int().positive(),
  })
  .strict();

export const attributeCreateRequest = z
  .object({
    key: z
      .string()
      .trim()
      .regex(/^[a-z][a-z0-9_]{0,39}$/, 'key'),
    label_en: text(1, 80),
    label_ar: text(1, 80),
    type: z.enum(ATTRIBUTE_TYPES),
    options: z.array(attributeOption).max(50, 'max').default([]),
    unit: optText(20),
    required: z.boolean().default(false),
    filterable: z.boolean().default(false),
    position: z.number().int().min(0).max(1000).default(0),
  })
  .refine((v) => v.type !== 'SELECT' || v.options.length > 0, {
    message: 'options_required',
    path: ['options'],
  })
  .refine((v) => new Set(v.options.map((o) => o.value)).size === v.options.length, {
    message: 'duplicate',
    path: ['options'],
  });
export const attributeUpdateRequest = z
  .object({
    label_en: text(1, 80).optional(),
    label_ar: text(1, 80).optional(),
    options: z.array(attributeOption).max(50, 'max').optional(),
    unit: optText(20).optional(),
    required: z.boolean().optional(),
    filterable: z.boolean().optional(),
    position: z.number().int().min(0).max(1000).optional(),
    active: z.boolean().optional(),
  })
  .strict();

// ------------------------------------------------------------------ products (seller)

const attributeValue = z.union([z.string().trim().max(200), z.number().finite(), z.boolean()]);
const specification = z.object({
  label_en: text(1, 80),
  label_ar: optText(80),
  value: text(1, 300),
});
export const certification = z.object({
  name: text(2, 120),
  issuer: optText(120),
  number: optText(80),
  valid_until: isoDate.nullish(),
});
const VIDEO_HOSTS = ['youtube.com', 'www.youtube.com', 'youtu.be', 'vimeo.com', 'www.vimeo.com'];
export const videoUrl = z
  .string()
  .trim()
  .max(300)
  .refine((v) => {
    try {
      const u = new URL(v);
      return u.protocol === 'https:' && VIDEO_HOSTS.includes(u.hostname);
    } catch {
      return false;
    }
  }, 'video_url');

export const productContentFields = {
  title_en: text(3, 150),
  title_ar: optText(150),
  description_en: z.string().trim().max(8000, 'max'),
  description_ar: optText(8000),
  category_id: uuid,
  mode: fulfilmentMode,
  attributes: z
    .record(z.string().regex(/^[a-z][a-z0-9_]{0,39}$/), attributeValue)
    .refine((r) => Object.keys(r).length <= 60, 'max'),
  specifications: z.array(specification).max(40, 'max'),
  materials: optText(300),
  dimensions: optText(200),
  country_of_origin: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/, 'country')
    .nullish()
    .or(z.literal('').transform(() => null)),
  lead_time_min_days: z.number().int().min(0).max(365).nullish(),
  lead_time_max_days: z.number().int().min(0).max(365).nullish(),
  fulfilment_days: z.number().int().min(0).max(365).nullish(),
  custom_manufacturing: z.boolean(),
  private_label: z.boolean(),
  white_label: z.boolean(),
  samples_available: z.boolean(),
  sample_note: optText(300),
  certifications: z.array(certification).max(20, 'max'),
  video_url: videoUrl.nullish().or(z.literal('').transform(() => null)),
};

const skuCode = z
  .string()
  .trim()
  .regex(/^[A-Za-z0-9][A-Za-z0-9._-]{1,39}$/, 'sku_code');
const variantAttributes = z
  .record(text(1, 40), text(1, 60))
  .refine((r) => Object.keys(r).length <= 5, 'max');

export const productCreateRequest = z.object({
  title_en: productContentFields.title_en,
  title_ar: productContentFields.title_ar,
  category_id: uuid,
  mode: fulfilmentMode.default('READY_STOCK'),
  sku_code: skuCode,
  unit: quantityUnit.default('PIECE'),
});
export const productUpdateRequest = z
  .object({
    title_en: productContentFields.title_en.optional(),
    title_ar: productContentFields.title_ar.optional(),
    description_en: productContentFields.description_en.optional(),
    description_ar: productContentFields.description_ar.optional(),
    category_id: uuid.optional(),
    mode: fulfilmentMode.optional(),
    attributes: productContentFields.attributes.optional(),
    specifications: productContentFields.specifications.optional(),
    materials: productContentFields.materials.optional(),
    dimensions: productContentFields.dimensions.optional(),
    country_of_origin: productContentFields.country_of_origin.optional(),
    lead_time_min_days: productContentFields.lead_time_min_days.optional(),
    lead_time_max_days: productContentFields.lead_time_max_days.optional(),
    fulfilment_days: productContentFields.fulfilment_days.optional(),
    custom_manufacturing: z.boolean().optional(),
    private_label: z.boolean().optional(),
    white_label: z.boolean().optional(),
    samples_available: z.boolean().optional(),
    sample_note: productContentFields.sample_note.optional(),
    certifications: productContentFields.certifications.optional(),
    video_url: productContentFields.video_url.optional(),
    expected_version: z.number().int().positive(),
  })
  .strict()
  .refine(
    (v) =>
      typeof v.lead_time_min_days !== 'number' ||
      typeof v.lead_time_max_days !== 'number' ||
      v.lead_time_max_days >= v.lead_time_min_days,
    { message: 'lead_time_range', path: ['lead_time_max_days'] },
  );
export type ProductUpdateRequest = z.infer<typeof productUpdateRequest>;

export const expectedVersionRequest = z.object({ expected_version: z.number().int().positive() });

export const skuCreateRequest = z.object({
  code: skuCode,
  variant_attributes: variantAttributes.default({}),
  unit: quantityUnit.default('PIECE'),
});
export const skuUpdateRequest = z
  .object({
    code: skuCode.optional(),
    variant_attributes: variantAttributes.optional(),
    unit: quantityUnit.optional(),
    active: z.boolean().optional(),
  })
  .strict();

export const tierInput = z.object({
  min_qty: z.number().int(),
  unit_price_fils: filsString,
});
export const pricingRequest = z.object({
  price_type: priceType,
  skus: z
    .array(
      z.object({
        sku_id: uuid,
        moq: z.number().int(),
        order_increment: z.number().int(),
        tiers: z.array(tierInput).max(20, 'max'),
      }),
    )
    .min(1, 'min')
    .max(100, 'max'),
  expected_version: z.number().int().positive(),
});
export type PricingRequest = z.infer<typeof pricingRequest>;

export const mediaUploadFields = z.object({
  alt_en: optText(150).optional(),
  alt_ar: optText(150).optional(),
});
export const mediaReorderRequest = z.object({
  file_ids: z.array(uuid).min(1).max(12),
  expected_version: z.number().int().positive(),
});

export const mediaItem = z.object({
  id: uuid,
  file_id: uuid,
  url: z.string(),
  position: z.number().int(),
  alt_en: z.string().nullable(),
  alt_ar: z.string().nullable(),
  width: z.number().int().nullable(),
  height: z.number().int().nullable(),
});

export const autoFlag = z.object({ kind: z.string(), term: z.string(), field: z.string() });

export const versionDetail = z.object({
  id: uuid,
  version: z.number().int(),
  state: versionState,
  title_en: z.string(),
  title_ar: z.string().nullable(),
  description_en: z.string(),
  description_ar: z.string().nullable(),
  category: z.object({
    id: uuid,
    name_en: z.string(),
    name_ar: z.string(),
    parent: z.object({ id: uuid, name_en: z.string(), name_ar: z.string() }).nullable(),
    restriction: categoryRestriction,
  }),
  mode: fulfilmentMode,
  attributes: z.record(z.string(), attributeValue),
  specifications: z.array(
    z.object({ label_en: z.string(), label_ar: z.string().nullable(), value: z.string() }),
  ),
  materials: z.string().nullable(),
  dimensions: z.string().nullable(),
  country_of_origin: z.string().nullable(),
  lead_time_min_days: z.number().int().nullable(),
  lead_time_max_days: z.number().int().nullable(),
  fulfilment_days: z.number().int().nullable(),
  custom_manufacturing: z.boolean(),
  private_label: z.boolean(),
  white_label: z.boolean(),
  samples_available: z.boolean(),
  sample_note: z.string().nullable(),
  certifications: z.array(
    z.object({
      name: z.string(),
      issuer: z.string().nullable(),
      number: z.string().nullable(),
      valid_until: z.string().nullable(),
    }),
  ),
  video_url: z.string().nullable(),
  media: z.array(mediaItem),
  auto_flags: z.array(autoFlag),
  submitted_at: isoDateTime.nullable(),
  decided_at: isoDateTime.nullable(),
  decision_reason: z.string().nullable(),
  created_at: isoDateTime,
});
export type VersionDetail = z.infer<typeof versionDetail>;

export const tierResponse = z.object({ min_qty: z.number().int(), unit_price_fils: filsString });
export const inventoryResponse = z.object({
  on_hand: z.number().int(),
  reserved: z.number().int(),
  unavailable: z.number().int(),
  available: z.number().int(),
  sold: z.number().int(),
  version: z.number().int(),
});
export const skuDetail = z.object({
  id: uuid,
  code: z.string(),
  variant_attributes: z.record(z.string(), z.string()),
  unit: quantityUnit,
  moq: z.number().int(),
  order_increment: z.number().int(),
  active: z.boolean(),
  approved: z.boolean(),
  tiers: z.array(tierResponse),
  inventory: inventoryResponse,
  low_stock_threshold: z.number().int(),
  restock_at: isoDate.nullable(),
  low_stock: z.boolean(),
});
export type SkuDetail = z.infer<typeof skuDetail>;

export const moderationEventResponse = z.object({
  id: uuid,
  action: z.string(),
  from_state: z.string().nullable(),
  to_state: z.string().nullable(),
  reason: z.string().nullable(),
  actor_type: z.string(),
  version: z.number().int().nullable(),
  created_at: isoDateTime,
});

export const productActions = z.object({
  edit: z.boolean(),
  submit: z.boolean(),
  withdraw: z.boolean(),
  archive: z.boolean(),
  unpublish: z.boolean(),
  republish: z.boolean(),
  restore: z.boolean(),
  duplicate: z.boolean(),
  price: z.boolean(),
  adjust_stock: z.boolean(),
});

export const sellerProductDetail = z.object({
  id: uuid,
  workspace_id: uuid,
  status: productStatus,
  status_reason: z.string().nullable(),
  price_type: priceType,
  version: z.number().int(),
  public: z.boolean(),
  published_version: versionDetail.nullable(),
  working_version: versionDetail.nullable(),
  skus: z.array(skuDetail),
  history: z.array(moderationEventResponse),
  actions: productActions,
  created_at: isoDateTime,
  updated_at: isoDateTime,
});
export type SellerProductDetail = z.infer<typeof sellerProductDetail>;

export const sellerProductSummary = z.object({
  id: uuid,
  status: productStatus,
  price_type: priceType,
  title_en: z.string(),
  title_ar: z.string().nullable(),
  category_name_en: z.string(),
  category_name_ar: z.string(),
  thumbnail_url: z.string().nullable(),
  working_state: versionState.nullable(),
  has_published_version: z.boolean(),
  public: z.boolean(),
  sku_count: z.number().int(),
  min_price_fils: filsString.nullable(),
  min_moq: z.number().int().nullable(),
  low_stock_skus: z.number().int(),
  decision_reason: z.string().nullable(),
  updated_at: isoDateTime,
});
export type SellerProductSummary = z.infer<typeof sellerProductSummary>;

export const sellerProductsQuery = z.object({
  tab: z.enum(SELLER_PRODUCT_TABS).default('all'),
  q: z.string().trim().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().max(200).optional(),
});

export const sellerOverview = z.object({
  storefront: z.object({
    exists: z.boolean(),
    status: z.enum(['DRAFT', 'PUBLISHED']).nullable(),
    public: z.boolean(),
    admin_hidden: z.boolean(),
  }),
  products: z.object({
    total: z.number().int(),
    draft: z.number().int(),
    pending: z.number().int(),
    published: z.number().int(),
    public: z.number().int(),
    rejected: z.number().int(),
    suspended: z.number().int(),
    archived: z.number().int(),
  }),
  inventory: z.object({
    skus: z.number().int(),
    low_stock: z.number().int(),
    out_of_stock: z.number().int(),
  }),
  eligibility: z.object({
    can_list: z.boolean(),
    reason: z.string().nullable(),
  }),
  recent_decisions: z.array(
    z.object({
      product_id: uuid,
      title_en: z.string(),
      title_ar: z.string().nullable(),
      state: versionState,
      reason: z.string().nullable(),
      decided_at: isoDateTime,
    }),
  ),
});

// ------------------------------------------------------------------ inventory

export const inventoryAdjustRequest = z
  .object({
    kind: z.enum(STOCK_MOVEMENT_KINDS),
    quantity: z.number().int().min(0).max(10_000_000),
    reason: text(3, 300),
    /** Required for SET_ON_HAND (stock count): the inventory version the count was based on. */
    expected_version: z.number().int().positive().optional(),
  })
  .refine((v) => v.kind === 'SET_ON_HAND' || v.quantity > 0, {
    message: 'min',
    path: ['quantity'],
  })
  .refine((v) => v.kind !== 'SET_ON_HAND' || v.expected_version !== undefined, {
    message: 'required',
    path: ['expected_version'],
  });
export const inventorySettingsRequest = z
  .object({
    low_stock_threshold: z.number().int().min(0).max(10_000_000).optional(),
    restock_at: isoDate.nullish(),
  })
  .strict();
export const inventoryItem = z.object({
  sku_id: uuid,
  product_id: uuid,
  code: z.string(),
  variant_attributes: z.record(z.string(), z.string()),
  unit: quantityUnit,
  title_en: z.string(),
  title_ar: z.string().nullable(),
  product_status: productStatus,
  mode: fulfilmentMode,
  active: z.boolean(),
  approved: z.boolean(),
  inventory: inventoryResponse,
  low_stock_threshold: z.number().int(),
  restock_at: isoDate.nullable(),
  low_stock: z.boolean(),
});
export const inventoryQuery = z.object({
  q: z.string().trim().max(100).optional(),
  filter: z.enum(['all', 'low', 'out']).default('all'),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  cursor: z.string().max(200).optional(),
});
export const stockMovementItem = z.object({
  id: uuid,
  kind: z.enum(ALL_STOCK_MOVEMENT_KINDS),
  delta_on_hand: z.number().int(),
  delta_reserved: z.number().int(),
  delta_unavailable: z.number().int(),
  on_hand_after: z.number().int(),
  reserved_after: z.number().int(),
  unavailable_after: z.number().int(),
  reason: z.string(),
  actor_email: z.string().nullable(),
  created_at: isoDateTime,
});

// ------------------------------------------------------------------ storefront

export const deliveryRate = z.object({
  emirate,
  fee_fils: filsString,
  days: z.number().int().min(0, 'min').max(90, 'max').nullable(),
});
const storefrontFields = {
  business_type: businessType.nullish(),
  description_en: optText(4000),
  description_ar: optText(4000),
  year_established: z.number().int().min(1900).max(2100).nullish(),
  city: optText(80),
  specialization_en: optText(300),
  specialization_ar: optText(300),
  capabilities_en: optText(2000),
  capabilities_ar: optText(2000),
  production_capacity: optText(200),
  customization_services: z.boolean(),
  private_label: z.boolean(),
  white_label: z.boolean(),
  samples_available: z.boolean(),
  fulfilment_en: optText(1000),
  fulfilment_ar: optText(1000),
  certifications: z.array(certification).max(20, 'max'),
  /**
   * C-10: delivery fee per emirate served (all seven can be set; an emirate left out is not
   * served). Fee in fils per order, lead time in days.
   */
  delivery_rates: z
    .array(deliveryRate)
    .max(7, 'max')
    .refine((r) => new Set(r.map((x) => x.emirate)).size === r.length, 'duplicate'),
  /** FD-08: free buyer collection. Instructions are shown to the buyer only after payment. */
  collection_enabled: z.boolean(),
  collection_emirate: emirate.nullish(),
  collection_instructions_en: optText(1000),
  collection_instructions_ar: optText(1000),
  collection_days: z.number().int().min(0).max(90).nullish(),
  /** Disclosed change-of-mind return policy (C-11); shown to buyers before payment. */
  return_policy_en: optText(2000),
  return_policy_ar: optText(2000),
};
export type DeliveryRate = z.infer<typeof deliveryRate>;
export const storefrontUpdateRequest = z
  .object({
    ...Object.fromEntries(Object.entries(storefrontFields).map(([k, v]) => [k, v.optional()])),
    expected_version: z.number().int().positive().optional(),
  })
  .strict() as z.ZodType<
  Partial<{ [K in keyof typeof storefrontFields]: z.infer<(typeof storefrontFields)[K]> }> & {
    expected_version?: number;
  }
>;
export const storefrontMediaFields = z.object({
  kind: z.enum(STOREFRONT_MEDIA_KINDS),
  caption_en: optText(150).optional(),
  caption_ar: optText(150).optional(),
});
export const storefrontMediaItem = z.object({
  id: uuid,
  kind: z.enum(STOREFRONT_MEDIA_KINDS),
  url: z.string(),
  position: z.number().int(),
  caption_en: z.string().nullable(),
  caption_ar: z.string().nullable(),
});
export const storefrontResponse = z.object({
  id: uuid,
  workspace_id: uuid,
  company_name: z.string(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  public: z.boolean(),
  admin_hidden: z.boolean(),
  admin_hidden_reason: z.string().nullable(),
  business_type: businessType.nullable(),
  description_en: z.string().nullable(),
  description_ar: z.string().nullable(),
  year_established: z.number().int().nullable(),
  city: z.string().nullable(),
  specialization_en: z.string().nullable(),
  specialization_ar: z.string().nullable(),
  capabilities_en: z.string().nullable(),
  capabilities_ar: z.string().nullable(),
  production_capacity: z.string().nullable(),
  customization_services: z.boolean(),
  private_label: z.boolean(),
  white_label: z.boolean(),
  samples_available: z.boolean(),
  fulfilment_en: z.string().nullable(),
  fulfilment_ar: z.string().nullable(),
  certifications: z.array(
    z.object({
      name: z.string(),
      issuer: z.string().nullable(),
      number: z.string().nullable(),
      valid_until: z.string().nullable(),
    }),
  ),
  media: z.array(storefrontMediaItem),
  delivery_rates: z.array(deliveryRate),
  collection_enabled: z.boolean(),
  collection_emirate: emirate.nullable(),
  collection_instructions_en: z.string().nullable(),
  collection_instructions_ar: z.string().nullable(),
  collection_days: z.number().int().nullable(),
  return_policy_en: z.string().nullable(),
  return_policy_ar: z.string().nullable(),
  version: z.number().int(),
  published_at: isoDateTime.nullable(),
});
export type StorefrontResponse = z.infer<typeof storefrontResponse>;

// ------------------------------------------------------------------ marketplace (public)

export const supplierRef = z.object({
  storefront_id: uuid.nullable(),
  name: z.string(),
  emirate,
  business_type: businessType.nullable(),
  verified: z.literal(true),
});
export const priceSummary = z.object({
  /** False for guests: wholesale prices require an email-verified account (A12). */
  visible: z.boolean(),
  price_type: priceType,
  min_price_fils: filsString.nullable(),
});
export const productCard = z.object({
  id: uuid,
  title_en: z.string(),
  title_ar: z.string().nullable(),
  category_id: uuid,
  image_url: z.string().nullable(),
  mode: fulfilmentMode,
  in_stock: z.boolean(),
  price: priceSummary,
  min_moq: z.number().int().nullable(),
  lead_time_min_days: z.number().int().nullable(),
  lead_time_max_days: z.number().int().nullable(),
  custom_manufacturing: z.boolean(),
  private_label: z.boolean(),
  white_label: z.boolean(),
  samples_available: z.boolean(),
  supplier: supplierRef,
  published_at: isoDateTime.nullable(),
});
export type ProductCard = z.infer<typeof productCard>;

export const marketplaceSearchQuery = z.object({
  q: z.string().trim().max(100).optional(),
  category_id: uuid.optional(),
  storefront_id: uuid.optional(),
  mode: fulfilmentMode.optional(),
  business_type: csvEnum(BUSINESS_TYPES),
  emirate: csvEnum([
    'ABU_DHABI',
    'DUBAI',
    'SHARJAH',
    'AJMAN',
    'UMM_AL_QUWAIN',
    'RAS_AL_KHAIMAH',
    'FUJAIRAH',
  ] as const),
  /** Price filters and price sorts are available to verified users only (A12). */
  price_min: filsString.optional(),
  price_max: filsString.optional(),
  moq_max: intQuery(10_000_000),
  lead_time_max: intQuery(365),
  delivery_max: intQuery(365),
  in_stock: boolQuery,
  custom: boolQuery,
  private_label: boolQuery,
  white_label: boolQuery,
  samples: boolQuery,
  /** Category attribute filters: "key:value,key2:value2" (exact match on filterable attributes). */
  attrs: z
    .string()
    .max(500)
    .regex(/^([a-z][a-z0-9_]{0,39}:[^,]{1,60})(,[a-z][a-z0-9_]{0,39}:[^,]{1,60}){0,9}$/, 'attrs')
    .optional(),
  sort: z.enum(MARKETPLACE_SORTS).default('relevance'),
  limit: z.coerce.number().int().min(1).max(48).default(24),
  cursor: z.string().max(200).optional(),
});
export type MarketplaceSearchQuery = z.infer<typeof marketplaceSearchQuery>;

export const searchResponse = z.object({
  items: z.array(productCard),
  total: z.number().int(),
  price_visible: z.boolean(),
  facets: z.object({
    categories: z.array(z.object({ id: uuid, count: z.number().int() })),
  }),
});
export type SearchResponse = z.infer<typeof searchResponse>;

export const suggestQuery = z.object({ q: z.string().trim().min(2, 'min').max(100) });
export const suggestResponse = z.object({
  products: z.array(z.object({ id: uuid, title_en: z.string(), title_ar: z.string().nullable() })),
  suppliers: z.array(z.object({ id: uuid, name: z.string() })),
  categories: z.array(z.object({ id: uuid, name_en: z.string(), name_ar: z.string() })),
});

export const viewerInfo = z.object({
  tier: z.enum(['guest', 'verified']),
  saved: z.boolean(),
  compared: z.boolean(),
  /** RFQ / purchase availability for this viewer; never a fake transaction. */
  trading: z.object({
    available: z.boolean(),
    /** Why the viewer cannot add to cart; null when available (Phase 4 cart). */
    reason: z
      .enum([
        'sign_in',
        'requires_approved_buyer',
        'phase_unavailable',
        'quote_only',
        'made_to_order',
        'checkout_disabled',
      ])
      .nullable(),
    /** Phase 3: an approved trading buyer may request a quotation for this product. */
    rfq: z.boolean(),
  }),
});

export const publicSku = z.object({
  id: uuid,
  code: z.string(),
  variant_attributes: z.record(z.string(), z.string()),
  unit: quantityUnit,
  moq: z.number().int(),
  order_increment: z.number().int(),
  /** Null for guests (A12). */
  tiers: z.array(tierResponse).nullable(),
  availability: z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'MADE_TO_ORDER']),
});

export const publicProductDetail = z.object({
  id: uuid,
  title_en: z.string(),
  title_ar: z.string().nullable(),
  description_en: z.string(),
  description_ar: z.string().nullable(),
  category: z.object({
    id: uuid,
    name_en: z.string(),
    name_ar: z.string(),
    parent: z.object({ id: uuid, name_en: z.string(), name_ar: z.string() }).nullable(),
  }),
  media: z.array(mediaItem),
  mode: fulfilmentMode,
  attributes: z.array(
    z.object({
      key: z.string(),
      label_en: z.string(),
      label_ar: z.string(),
      value: z.string(),
      unit: z.string().nullable(),
    }),
  ),
  specifications: versionDetail.shape.specifications,
  materials: z.string().nullable(),
  dimensions: z.string().nullable(),
  country_of_origin: z.string().nullable(),
  lead_time_min_days: z.number().int().nullable(),
  lead_time_max_days: z.number().int().nullable(),
  fulfilment_days: z.number().int().nullable(),
  custom_manufacturing: z.boolean(),
  private_label: z.boolean(),
  white_label: z.boolean(),
  samples_available: z.boolean(),
  sample_note: z.string().nullable(),
  certifications: versionDetail.shape.certifications,
  video_url: z.string().nullable(),
  price_visible: z.boolean(),
  price_type: priceType,
  skus: z.array(publicSku),
  supplier: supplierRef.extend({
    verified_since: isoDateTime.nullable(),
    year_established: z.number().int().nullable(),
    logo_url: z.string().nullable(),
  }),
  viewer: viewerInfo,
  published_at: isoDateTime.nullable(),
});
export type PublicProductDetail = z.infer<typeof publicProductDetail>;

export const estimateQuery = z.object({
  sku_id: uuid,
  quantity: z.coerce.number().int().min(1).max(10_000_000),
});
export const estimateResponse = z.object({
  sku_id: uuid,
  quantity: z.number().int(),
  unit_price_fils: filsString,
  line_total_fils: filsString,
  tier_min_qty: z.number().int(),
  currency: z.literal('AED'),
});

export const supplierCard = z.object({
  id: uuid,
  name: z.string(),
  emirate,
  business_type: businessType.nullable(),
  logo_url: z.string().nullable(),
  cover_url: z.string().nullable(),
  year_established: z.number().int().nullable(),
  specialization_en: z.string().nullable(),
  specialization_ar: z.string().nullable(),
  categories: z.array(z.object({ id: uuid, name_en: z.string(), name_ar: z.string() })),
  product_count: z.number().int(),
  verified_since: isoDateTime.nullable(),
  customization_services: z.boolean(),
  private_label: z.boolean(),
  white_label: z.boolean(),
  samples_available: z.boolean(),
});
export type SupplierCard = z.infer<typeof supplierCard>;
export const supplierDirectoryQuery = z.object({
  q: z.string().trim().max(100).optional(),
  category_id: uuid.optional(),
  emirate: csvEnum([
    'ABU_DHABI',
    'DUBAI',
    'SHARJAH',
    'AJMAN',
    'UMM_AL_QUWAIN',
    'RAS_AL_KHAIMAH',
    'FUJAIRAH',
  ] as const),
  business_type: csvEnum(BUSINESS_TYPES),
  custom: boolQuery,
  private_label: boolQuery,
  white_label: boolQuery,
  samples: boolQuery,
  limit: z.coerce.number().int().min(1).max(48).default(24),
  cursor: z.string().max(200).optional(),
});
export const supplierDirectoryResponse = z.object({
  items: z.array(supplierCard),
  total: z.number().int(),
});
export const supplierDetail = supplierCard.extend({
  description_en: z.string().nullable(),
  description_ar: z.string().nullable(),
  city: z.string().nullable(),
  capabilities_en: z.string().nullable(),
  capabilities_ar: z.string().nullable(),
  production_capacity: z.string().nullable(),
  fulfilment_en: z.string().nullable(),
  fulfilment_ar: z.string().nullable(),
  certifications: storefrontResponse.shape.certifications,
  gallery: z.array(storefrontMediaItem),
  viewer: z.object({ tier: z.enum(['guest', 'verified']), saved: z.boolean() }),
});
export type SupplierDetail = z.infer<typeof supplierDetail>;

export const homeResponse = z.object({
  totals: z.object({ products: z.number().int(), suppliers: z.number().int() }),
  priority_categories: z.array(categoryNode),
  categories: z.array(categoryNode),
  featured_products: z.array(productCard),
  featured_suppliers: z.array(supplierCard),
  manufacturers: z.array(supplierCard),
  new_products: z.array(productCard),
  /** From the signed-in user's marketplace preferences; empty for guests. */
  for_you: z.array(productCard),
  price_visible: z.boolean(),
});
export type HomeResponse = z.infer<typeof homeResponse>;

// ------------------------------------------------------------------ buyer lists (verified users)

export const savedProductItem = z.object({
  product_id: uuid,
  saved_at: isoDateTime,
  /** Null when the listing is no longer public (shown as unavailable). */
  product: productCard.nullable(),
});
export const savedSupplierItem = z.object({
  storefront_id: uuid,
  saved_at: isoDateTime,
  supplier: supplierCard.nullable(),
});
export const compareRow = z.object({
  product_id: uuid,
  added_at: isoDateTime,
  product: productCard
    .extend({
      category_name_en: z.string(),
      category_name_ar: z.string(),
      materials: z.string().nullable(),
      dimensions: z.string().nullable(),
      country_of_origin: z.string().nullable(),
      fulfilment_days: z.number().int().nullable(),
      certifications: z.array(z.string()),
      attributes: z.array(
        z.object({
          key: z.string(),
          label_en: z.string(),
          label_ar: z.string(),
          value: z.string(),
        }),
      ),
    })
    .nullable(),
});
export const MAX_COMPARE = 4;
export const recentItem = z.object({
  product_id: uuid,
  viewed_at: isoDateTime,
  product: productCard.nullable(),
});
export const preferencesResponse = z.object({
  category_ids: z.array(uuid),
  emirates: z.array(emirate),
  default_view: z.enum(['GRID', 'LIST']),
  default_sort: z.enum(MARKETPLACE_SORTS),
});
export const preferencesRequest = z
  .object({
    category_ids: z.array(uuid).max(12, 'max').optional(),
    emirates: z.array(emirate).max(7).optional(),
    default_view: z.enum(['GRID', 'LIST']).optional(),
    default_sort: z.enum(MARKETPLACE_SORTS).optional(),
  })
  .strict();

// ------------------------------------------------------------------ admin catalog

export const catalogQueueQuery = z.object({
  state: z.enum(['PENDING_REVIEW', 'CHANGES_REQUESTED', 'REJECTED', 'APPROVED']).optional(),
  q: z.string().trim().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().max(200).optional(),
});
export const catalogQueueItem = z.object({
  version_id: uuid,
  product_id: uuid,
  version: z.number().int(),
  state: versionState,
  title_en: z.string(),
  title_ar: z.string().nullable(),
  company: z.object({ id: uuid, display_name: z.string() }),
  category: z.object({
    id: uuid,
    name_en: z.string(),
    name_ar: z.string(),
    restriction: categoryRestriction,
  }),
  is_update: z.boolean(),
  auto_flags: z.array(autoFlag),
  submitted_at: isoDateTime.nullable(),
  decided_at: isoDateTime.nullable(),
});
export const catalogReviewDetail = z.object({
  version: versionDetail,
  published_version: versionDetail.nullable(),
  changed_fields: z.array(z.string()),
  product: z.object({
    id: uuid,
    status: productStatus,
    price_type: priceType,
    workspace_id: uuid,
  }),
  skus: z.array(skuDetail),
  company: z.object({
    id: uuid,
    display_name: z.string(),
    status: z.string(),
    licence_expiry: isoDate,
    licence_expired: z.boolean(),
    emirate,
  }),
  storefront: z
    .object({ id: uuid, status: z.string(), business_type: businessType.nullable() })
    .nullable(),
  category_requirements_en: z.string().nullable(),
  category_requirements_ar: z.string().nullable(),
  history: z.array(moderationEventResponse),
});
export const catalogDecisionRequest = z
  .object({
    decision: z.enum(['APPROVED', 'REJECTED', 'CHANGES_REQUESTED']),
    reason: z.string().trim().max(2000).optional(),
    expected_state: versionState,
  })
  .refine((v) => v.decision === 'APPROVED' || (v.reason !== undefined && v.reason.length >= 5), {
    message: 'reason_required',
    path: ['reason'],
  });

export const adminProductsQuery = z.object({
  status: productStatus.optional(),
  q: z.string().trim().max(100).optional(),
  company_id: uuid.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().max(200).optional(),
});
export const adminProductItem = z.object({
  id: uuid,
  status: productStatus,
  title_en: z.string(),
  title_ar: z.string().nullable(),
  company: z.object({ id: uuid, display_name: z.string() }),
  category_name_en: z.string(),
  public: z.boolean(),
  working_state: versionState.nullable(),
  updated_at: isoDateTime,
});
export const adminProductDetail = sellerProductDetail.omit({ actions: true }).extend({
  company: z.object({ id: uuid, display_name: z.string(), status: z.string() }),
  actions: z.object({ suspend: z.boolean(), restore: z.boolean(), remove: z.boolean() }),
});

export const adminStorefrontItem = z.object({
  id: uuid,
  company: z.object({ id: uuid, display_name: z.string(), status: z.string() }),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  business_type: businessType.nullable(),
  public: z.boolean(),
  admin_hidden: z.boolean(),
  admin_hidden_reason: z.string().nullable(),
  product_count: z.number().int(),
  updated_at: isoDateTime,
});
export const adminStorefrontsQuery = z.object({
  q: z.string().trim().max(100).optional(),
  hidden: boolQuery,
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().max(200).optional(),
});

export const restrictedTermItem = z.object({
  id: uuid,
  term: z.string(),
  action: z.enum(['BLOCK', 'REVIEW']),
  category: z.object({ id: uuid, name_en: z.string(), name_ar: z.string() }).nullable(),
  note: z.string().nullable(),
  active: z.boolean(),
  created_at: isoDateTime,
});
export const restrictedTermCreateRequest = z.object({
  term: text(2, 60),
  action: z.enum(['BLOCK', 'REVIEW']),
  category_id: uuid.nullish(),
  note: optText(300),
});
export const restrictedTermUpdateRequest = z
  .object({
    action: z.enum(['BLOCK', 'REVIEW']).optional(),
    note: optText(300).optional(),
    active: z.boolean().optional(),
  })
  .strict();

export const featuredItem = z.object({
  id: uuid,
  kind: z.enum(['PRODUCT', 'SUPPLIER']),
  target_id: uuid,
  title: z.string(),
  position: z.number().int(),
  starts_at: isoDateTime.nullable(),
  ends_at: isoDateTime.nullable(),
  reason: z.string(),
  /** Whether the target is currently public (ineligible placements are not shown to buyers). */
  eligible: z.boolean(),
  active_now: z.boolean(),
  created_at: isoDateTime,
});
export const featuredCreateRequest = z
  .object({
    kind: z.enum(['PRODUCT', 'SUPPLIER']),
    target_id: uuid,
    position: z.number().int().min(0).max(1000).default(0),
    starts_at: isoDateTime.nullish(),
    ends_at: isoDateTime.nullish(),
    reason: text(5, 500),
  })
  .refine((v) => !v.starts_at || !v.ends_at || v.ends_at > v.starts_at, {
    message: 'window',
    path: ['ends_at'],
  });

export const catalogOverview = z.object({
  pending_reviews: z.number().int(),
  pending_updates: z.number().int(),
  flagged_pending: z.number().int(),
  public_products: z.number().int(),
  suspended_products: z.number().int(),
  public_suppliers: z.number().int(),
  hidden_storefronts: z.number().int(),
  categories: z.number().int(),
  blocked_categories: z.number().int(),
  oldest_pending_at: isoDateTime.nullable(),
});
