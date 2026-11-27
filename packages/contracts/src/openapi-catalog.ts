/**
 * Phase 2 routes (marketplace, buyer lists, seller catalog/storefront/inventory, admin catalog)
 * for the generated OpenAPI document. Kept beside openapi.ts so the coverage test can compare the
 * served routes with the documented ones.
 */
import { z, type ZodTypeAny } from 'zod';
import { reasonRequest } from './admin';
import * as c from './catalog';

type Method = 'get' | 'post' | 'patch' | 'delete';
export type CatalogRoute = {
  method: Method;
  path: string;
  summary: string;
  tag: string;
  security: 'none' | 'company' | 'admin';
  body?: ZodTypeAny;
  multipart?: boolean;
  query?: z.ZodObject;
  response?: ZodTypeAny;
  list?: boolean;
  binary?: boolean;
  errors?: number[];
  capability?: string;
};

const file = { file: z.string().meta({ format: 'binary' }) };
const savedResult = z.object({ saved: z.boolean() });
const S = '/seller/workspaces/{ws}';

const pub = (
  method: Method,
  path: string,
  summary: string,
  extra: Partial<CatalogRoute> = {},
): CatalogRoute => ({
  method,
  path,
  summary,
  tag: 'Marketplace',
  security: 'none',
  errors: [404, 422, 429],
  ...extra,
});
const buyer = (
  method: Method,
  path: string,
  summary: string,
  extra: Partial<CatalogRoute> = {},
): CatalogRoute => ({
  method,
  path,
  summary,
  tag: 'Buyer lists',
  security: 'company',
  capability: 'email-verified account (A12)',
  errors: [403, 404, 409, 422, 429],
  ...extra,
});
const seller = (
  method: Method,
  path: string,
  summary: string,
  capability: string,
  extra: Partial<CatalogRoute> = {},
): CatalogRoute => ({
  method,
  path: `${S}${path}`,
  summary,
  tag: 'Seller catalog',
  security: 'company',
  capability,
  errors: [403, 404, 409, 422],
  ...extra,
});
const admin = (
  method: Method,
  path: string,
  summary: string,
  capability: string,
  extra: Partial<CatalogRoute> = {},
): CatalogRoute => ({
  method,
  path: `/admin${path}`,
  summary,
  tag: 'Admin catalog',
  security: 'admin',
  capability,
  errors: [403, 404, 409, 422],
  ...extra,
});

const ev = { body: c.expectedVersionRequest, response: c.sellerProductDetail };

export const CATALOG_ROUTES: CatalogRoute[] = [
  // ------------------------------------------------------------ public marketplace
  pub(
    'get',
    '/marketplace/home',
    'Marketplace home (categories, featured, manufacturers, new; prices for verified viewers only)',
    { response: c.homeResponse },
  ),
  pub('get', '/marketplace/categories', 'Visible category tree with public product counts', {
    response: c.categoryNode,
    list: true,
  }),
  pub(
    'get',
    '/marketplace/categories/{id}',
    'Category with subcategories and filterable attributes',
    { response: c.categoryDetail },
  ),
  pub(
    'get',
    '/marketplace/products',
    'Search approved products (filters, sort, offset cursor). Price filters/sorts require a verified viewer (422 for guests).',
    {
      query: c.marketplaceSearchQuery as unknown as z.ZodObject,
      response: c.searchResponse,
    },
  ),
  pub(
    'get',
    '/marketplace/suggest',
    'Autocomplete over public products, suppliers and categories',
    { query: c.suggestQuery, response: c.suggestResponse },
  ),
  pub(
    'get',
    '/marketplace/products/{id}',
    'Public product detail (tiers only for verified viewers; trading actions permission-aware)',
    { response: c.publicProductDetail },
  ),
  pub('get', '/marketplace/products/{id}/related', 'Related public products', {
    response: c.productCard,
    list: true,
  }),
  pub(
    'get',
    '/marketplace/products/{id}/estimate',
    'Server-side unit price and line total for a quantity (verified viewers; not a commitment)',
    {
      query: c.estimateQuery,
      response: c.estimateResponse,
      errors: [403, 404, 422, 429],
    },
  ),
  pub(
    'get',
    '/marketplace/suppliers',
    'Supplier directory (published storefronts of eligible verified sellers)',
    {
      query: c.supplierDirectoryQuery as unknown as z.ZodObject,
      response: c.supplierDirectoryResponse,
    },
  ),
  pub('get', '/marketplace/suppliers/{id}', 'Supplier storefront', { response: c.supplierDetail }),
  pub('get', '/media/{id}', 'Public marketplace image (only while attached to public content)', {
    binary: true,
    errors: [404, 429],
  }),

  // ------------------------------------------------------------ buyer lists
  buyer('get', '/marketplace/saved/products', 'Saved products', {
    response: c.savedProductItem,
    list: true,
  }),
  buyer('post', '/marketplace/saved/products/{id}', 'Save a public product (idempotent)', {
    response: savedResult,
  }),
  buyer('delete', '/marketplace/saved/products/{id}', 'Remove a saved product', {
    response: savedResult,
  }),
  buyer('get', '/marketplace/saved/suppliers', 'Saved suppliers', {
    response: c.savedSupplierItem,
    list: true,
  }),
  buyer('post', '/marketplace/saved/suppliers/{id}', 'Save a public supplier (idempotent)', {
    response: savedResult,
  }),
  buyer('delete', '/marketplace/saved/suppliers/{id}', 'Remove a saved supplier', {
    response: savedResult,
  }),
  buyer('get', '/marketplace/compare', 'Comparison list (max 4)', {
    response: c.compareRow,
    list: true,
  }),
  buyer(
    'post',
    '/marketplace/compare/{id}',
    'Add a public product to comparison (409 marketplace.compare_limit)',
    { response: c.compareRow, list: true },
  ),
  buyer('delete', '/marketplace/compare/{id}', 'Remove from comparison', {
    response: c.compareRow,
    list: true,
  }),
  buyer('get', '/marketplace/recent', 'Recently viewed (last 30)', {
    response: c.recentItem,
    list: true,
  }),
  buyer('post', '/marketplace/recent/{id}', 'Record a product view', {
    response: z.object({ recorded: z.boolean() }),
  }),
  buyer('delete', '/marketplace/recent', 'Clear recently viewed', {
    response: c.recentItem,
    list: true,
  }),
  buyer('get', '/marketplace/preferences', 'Marketplace preferences', {
    response: c.preferencesResponse,
  }),
  buyer('patch', '/marketplace/preferences', 'Update marketplace preferences', {
    body: c.preferencesRequest,
    response: c.preferencesResponse,
  }),

  // ------------------------------------------------------------ seller
  seller('get', '/overview', 'Seller dashboard overview (real counts)', 'seller.catalog.read', {
    response: c.sellerOverview,
  }),
  seller(
    'get',
    '/storefront',
    'Own storefront (empty draft if not created yet)',
    'seller.catalog.read',
    { response: c.storefrontResponse },
  ),
  seller(
    'patch',
    '/storefront',
    'Update storefront profile',
    'seller.catalog.edit (trading-gated)',
    { body: c.storefrontUpdateRequest, response: c.storefrontResponse },
  ),
  seller(
    'post',
    '/storefront/publish',
    'Publish storefront (eligible sellers; required fields)',
    'seller.catalog.edit (trading-gated)',
    { response: c.storefrontResponse },
  ),
  seller('post', '/storefront/unpublish', 'Take storefront offline', 'owner or sales role', {
    response: c.storefrontResponse,
  }),
  seller(
    'post',
    '/storefront/media',
    'Upload storefront image (logo, cover, factory, warehouse, other; sanitised)',
    'seller.catalog.edit (trading-gated)',
    {
      multipart: true,
      body: c.storefrontMediaFields.extend(file),
      response: c.storefrontResponse,
      errors: [403, 404, 409, 422, 429, 503],
    },
  ),
  seller(
    'delete',
    '/storefront/media/{mediaId}',
    'Remove storefront image',
    'seller.catalog.edit (trading-gated)',
    { response: c.storefrontResponse },
  ),
  seller('get', '/products', 'Own products by tab (cursor paginated)', 'seller.catalog.read', {
    query: c.sellerProductsQuery,
    response: c.sellerProductSummary,
    list: true,
  }),
  seller(
    'post',
    '/products',
    'Create a draft product with its first SKU',
    'seller.catalog.edit (trading-gated)',
    { body: c.productCreateRequest, response: c.sellerProductDetail },
  ),
  seller(
    'get',
    '/products/{id}',
    'Product detail with working and published versions, SKUs, history and allowed actions',
    'seller.catalog.read',
    { response: c.sellerProductDetail },
  ),
  seller(
    'patch',
    '/products/{id}',
    'Edit content (creates a new draft version when the live one is approved)',
    'seller.catalog.edit (trading-gated)',
    {
      body: c.productUpdateRequest,
      response: c.sellerProductDetail,
    },
  ),
  seller(
    'post',
    '/products/{id}/media',
    'Upload product image (PNG/JPEG/WebP; scanned; re-encoded; max 12)',
    'seller.catalog.edit (trading-gated)',
    {
      multipart: true,
      body: c.mediaUploadFields.extend(file),
      response: c.sellerProductDetail,
      errors: [403, 404, 409, 422, 429, 503],
    },
  ),
  seller(
    'post',
    '/products/{id}/media/reorder',
    'Reorder images',
    'seller.catalog.edit (trading-gated)',
    { body: c.mediaReorderRequest, response: c.sellerProductDetail },
  ),
  seller(
    'delete',
    '/products/{id}/media/{fileId}',
    'Remove image from the draft',
    'seller.catalog.edit (trading-gated)',
    { response: c.sellerProductDetail },
  ),
  seller(
    'post',
    '/products/{id}/skus',
    'Add a variant SKU (pending until the version is approved)',
    'seller.catalog.edit (trading-gated)',
    { body: c.skuCreateRequest, response: c.sellerProductDetail },
  ),
  seller(
    'patch',
    '/products/{id}/skus/{skuId}',
    'Update SKU (identity locked once approved; active flag is live)',
    'seller.catalog.edit (trading-gated)',
    {
      body: c.skuUpdateRequest,
      response: c.sellerProductDetail,
    },
  ),
  seller(
    'delete',
    '/products/{id}/skus/{skuId}',
    'Delete a never-approved SKU without stock history',
    'seller.catalog.edit (trading-gated)',
    { response: c.sellerProductDetail },
  ),
  seller(
    'post',
    '/products/{id}/pricing',
    'Set live pricing: price type, MOQ, increments, tiers (validated, audited, no review)',
    'seller.catalog.edit (trading-gated)',
    {
      body: c.pricingRequest,
      response: c.sellerProductDetail,
    },
  ),
  seller(
    'post',
    '/products/{id}/submit',
    'Submit the draft for moderation (restricted-term screening)',
    'seller.catalog.edit (trading-gated)',
    ev,
  ),
  seller(
    'post',
    '/products/{id}/withdraw',
    'Withdraw a pending submission back to draft',
    'seller.catalog.edit (trading-gated)',
    ev,
  ),
  seller('post', '/products/{id}/archive', 'Archive', 'seller.catalog.edit (trading-gated)', ev),
  seller(
    'post',
    '/products/{id}/unpublish',
    'Unpublish (hide from buyers)',
    'seller.catalog.edit (trading-gated)',
    ev,
  ),
  seller(
    'post',
    '/products/{id}/republish',
    'Republish an unpublished approved listing',
    'seller.catalog.edit (trading-gated)',
    ev,
  ),
  seller(
    'post',
    '/products/{id}/restore',
    'Restore an archived product',
    'seller.catalog.edit (trading-gated)',
    ev,
  ),
  seller(
    'post',
    '/products/{id}/duplicate',
    'Duplicate as a new draft (zero stock)',
    'seller.catalog.edit (trading-gated)',
    { response: c.sellerProductDetail },
  ),
  seller('get', '/inventory', 'Variant stock (filters: low, out)', 'seller.catalog.read', {
    query: c.inventoryQuery,
    response: c.inventoryItem,
    list: true,
  }),
  seller(
    'post',
    '/inventory/{skuId}/adjust',
    'Atomic stock adjustment (never negative; logged with actor and reason)',
    'seller.inventory.ship or seller.catalog.edit (trading-gated)',
    {
      body: c.inventoryAdjustRequest,
      response: c.inventoryItem,
    },
  ),
  seller(
    'patch',
    '/inventory/{skuId}',
    'Low-stock threshold and restock date',
    'seller.inventory.ship or seller.catalog.edit (trading-gated)',
    {
      body: c.inventorySettingsRequest,
      response: c.inventoryItem,
    },
  ),
  seller(
    'get',
    '/inventory/{skuId}/movements',
    'Append-only stock movement history',
    'seller.catalog.read',
    { response: c.stockMovementItem, list: true },
  ),
  seller(
    'get',
    '/media/{fileId}',
    'Own marketplace image (drafts included)',
    'seller.catalog.read',
    { binary: true },
  ),

  // ------------------------------------------------------------ admin
  admin('get', '/catalog/overview', 'Catalog moderation overview', 'admin.catalog.read', {
    response: c.catalogOverview,
  }),
  admin('get', '/catalog/queue', 'Moderation queue (pending oldest first)', 'admin.catalog.read', {
    query: c.catalogQueueQuery,
    response: c.catalogQueueItem,
    list: true,
  }),
  admin(
    'get',
    '/catalog/reviews/{versionId}',
    'Review a submitted version (diff against live version)',
    'admin.catalog.read',
    { response: c.catalogReviewDetail },
  ),
  admin(
    'post',
    '/catalog/reviews/{versionId}/decision',
    'Approve, reject or request changes (reason required unless approving)',
    'admin.catalog.review',
    {
      body: c.catalogDecisionRequest,
      response: c.catalogReviewDetail,
    },
  ),
  admin('get', '/catalog/products', 'Search all listings', 'admin.catalog.read', {
    query: c.adminProductsQuery,
    response: c.adminProductItem,
    list: true,
  }),
  admin('get', '/catalog/products/{id}', 'Listing detail with history', 'admin.catalog.read', {
    response: c.adminProductDetail,
  }),
  admin(
    'post',
    '/catalog/products/{id}/suspend',
    'Suspend listing immediately (reason)',
    'admin.catalog.enforce',
    { body: reasonRequest, response: c.adminProductDetail },
  ),
  admin(
    'post',
    '/catalog/products/{id}/restore',
    'Restore a suspended listing (reason)',
    'admin.catalog.enforce',
    { body: reasonRequest, response: c.adminProductDetail },
  ),
  admin(
    'post',
    '/catalog/products/{id}/remove',
    'Remove listing (reason; irreversible for the seller)',
    'admin.catalog.enforce',
    { body: reasonRequest, response: c.adminProductDetail },
  ),
  admin('get', '/storefronts', 'Storefront oversight', 'admin.catalog.read', {
    query: c.adminStorefrontsQuery as unknown as z.ZodObject,
    response: c.adminStorefrontItem,
    list: true,
  }),
  admin('get', '/storefronts/{id}', 'Storefront detail', 'admin.catalog.read', {
    response: c.storefrontResponse,
  }),
  admin('post', '/storefronts/{id}/hide', 'Hide a storefront (reason)', 'admin.catalog.enforce', {
    body: reasonRequest,
    response: c.storefrontResponse,
  }),
  admin(
    'post',
    '/storefronts/{id}/restore',
    'Restore a hidden storefront (reason)',
    'admin.catalog.enforce',
    { body: reasonRequest, response: c.storefrontResponse },
  ),
  admin('get', '/categories', 'All categories (including hidden/archived)', 'admin.catalog.read', {
    response: c.adminCategoryItem,
    list: true,
  }),
  admin('post', '/categories', 'Create category or subcategory', 'admin.categories.manage', {
    body: c.categoryCreateRequest,
    response: c.adminCategoryDetail,
  }),
  admin('get', '/categories/{id}', 'Category detail with attributes', 'admin.catalog.read', {
    response: c.adminCategoryDetail,
  }),
  admin(
    'patch',
    '/categories/{id}',
    'Update category (reason required to hide, archive or change restriction)',
    'admin.categories.manage',
    {
      body: c.categoryUpdateRequest,
      response: c.adminCategoryDetail,
    },
  ),
  admin('post', '/categories/{id}/image', 'Upload category image', 'admin.categories.manage', {
    multipart: true,
    body: z.object(file),
    response: c.adminCategoryDetail,
    errors: [403, 404, 422, 429, 503],
  }),
  admin(
    'post',
    '/categories/{id}/attributes',
    'Add category attribute',
    'admin.categories.manage',
    { body: c.attributeCreateRequest, response: c.adminCategoryDetail },
  ),
  admin(
    'patch',
    '/category-attributes/{id}',
    'Update category attribute',
    'admin.categories.manage',
    { body: c.attributeUpdateRequest, response: c.adminCategoryDetail },
  ),
  admin(
    'get',
    '/restricted-terms',
    'Restricted and prohibited terms (provisional policy, A10)',
    'admin.catalog.read',
    { response: c.restrictedTermItem, list: true },
  ),
  admin('post', '/restricted-terms', 'Add restricted term', 'admin.restricted.manage', {
    body: c.restrictedTermCreateRequest,
    response: c.restrictedTermItem,
    list: true,
  }),
  admin('patch', '/restricted-terms/{id}', 'Update restricted term', 'admin.restricted.manage', {
    body: c.restrictedTermUpdateRequest,
    response: c.restrictedTermItem,
    list: true,
  }),
  admin(
    'get',
    '/featured',
    'Featured placements (labelled; never used for ranking)',
    'admin.catalog.read',
    { response: c.featuredItem, list: true },
  ),
  admin(
    'post',
    '/featured',
    'Add featured placement (public targets only)',
    'admin.featured.manage',
    { body: c.featuredCreateRequest, response: c.featuredItem, list: true },
  ),
  admin('delete', '/featured/{id}', 'Remove featured placement', 'admin.featured.manage', {
    response: c.featuredItem,
    list: true,
  }),
  admin('get', '/media/{id}', 'Any marketplace image (review)', 'admin.catalog.read', {
    binary: true,
  }),
];
