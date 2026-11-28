/**
 * Phase 4 routes (addresses, cart, checkout, sandbox payments, orders, admin finance) for the
 * generated OpenAPI document.
 */
import { z } from 'zod';
import * as m from './commerce';
import type { CatalogRoute } from './openapi-catalog';

const ok = z.object({ ok: z.literal(true) });
const B = '/buyer/workspaces/{ws}';
const S = '/seller/workspaces/{ws}';
const purchase = 'buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12)';
const read = 'buyer.orders.read (any buyer workspace member)';
const idem = ' Header Idempotency-Key required.';

const route = (
  tag: string,
  security: CatalogRoute['security'],
  method: CatalogRoute['method'],
  path: string,
  summary: string,
  extra: Partial<CatalogRoute> = {},
): CatalogRoute => ({
  method,
  path,
  summary,
  tag,
  security,
  errors: [403, 404, 409, 422],
  ...extra,
});
const buyer = (mt: CatalogRoute['method'], p: string, s: string, x: Partial<CatalogRoute> = {}) =>
  route('Buyer orders and checkout', 'company', mt, `${B}${p}`, s, { capability: purchase, ...x });
const admin = (
  mt: CatalogRoute['method'],
  p: string,
  s: string,
  cap: string,
  x: Partial<CatalogRoute> = {},
) => route('Admin orders and finance', 'admin', mt, `/admin${p}`, s, { capability: cap, ...x });

export const COMMERCE_ROUTES: CatalogRoute[] = [
  buyer('get', '/addresses', 'Delivery addresses (UAE only)', {
    response: m.addressItem,
    list: true,
    capability: read,
  }),
  buyer('post', '/addresses', 'Add a delivery address', {
    body: m.addressRequest,
    response: m.addressItem,
  }),
  buyer('patch', '/addresses/{id}', 'Replace a delivery address', {
    body: m.addressRequest,
    response: m.addressItem,
  }),
  buyer('delete', '/addresses/{id}', 'Archive an address (checkouts keep their snapshot)', {
    response: ok,
  }),
  buyer('get', '/cart', 'Cart grouped by seller, priced from live data with line issues', {
    response: m.cartView,
  }),
  buyer('post', '/cart/items', 'Add a ready-stock SKU (MOQ, increment, stock, no self-trade)', {
    body: m.cartAddRequest,
    response: m.cartView,
  }),
  buyer('patch', '/cart/items/{id}', 'Change a cart line quantity', {
    body: m.cartUpdateRequest,
    response: m.cartView,
  }),
  buyer('delete', '/cart/items/{id}', 'Remove a cart line', { response: m.cartView }),
  buyer('post', '/checkout/preview', 'Per-seller delivery, tax and totals with a preview hash', {
    body: m.checkoutPreviewRequest,
    response: m.checkoutPreview,
  }),
  buyer(
    'post',
    '/checkouts',
    `Create checkout: re-price, 409 checkout.changed if anything differs from the preview, reserve stock (409 checkout.insufficient_stock), one order per seller.${idem}`,
    {
      body: m.checkoutCreateRequest,
      response: m.checkoutResponse,
      errors: [403, 404, 409, 422, 429],
    },
  ),
  buyer('get', '/checkouts/{id}', 'Checkout with orders and payment attempts', {
    response: m.checkoutResponse,
    capability: read,
  }),
  buyer(
    'post',
    '/checkouts/{id}/pay',
    `Start or resume a payment session (sandbox adapter only). Returns the hosted page URL; payment is confirmed only by a verified webhook.${idem}`,
    {
      body: m.paymentStartRequest,
      response: m.paymentStartResponse,
      errors: [403, 404, 409, 422, 429],
    },
  ),
  buyer('post', '/checkouts/{id}/cancel', 'Cancel an unpaid cart checkout and release stock', {
    response: m.checkoutResponse,
  }),
  buyer('get', '/orders', 'Buyer orders (offset cursor)', {
    query: m.orderListQuery,
    response: m.orderSummary,
    list: true,
    capability: read,
  }),
  buyer('get', '/orders/{id}', 'Buyer order detail (no commission figures)', {
    response: m.orderDetail,
    capability: read,
  }),
  route('Seller orders', 'company', 'get', `${S}/orders`, 'Seller orders (offset cursor)', {
    query: m.orderListQuery,
    response: m.orderSummary,
    list: true,
    capability: 'seller.orders.read (any seller workspace member)',
  }),
  route('Seller orders', 'company', 'get', `${S}/orders/{id}`, 'Seller order detail with payable', {
    response: m.orderDetail,
    capability: 'seller.orders.read (any seller workspace member)',
  }),
  route(
    'Payments',
    'signature',
    'post',
    '/payments/webhooks/{provider}',
    'Provider webhook intake (sandbox provider only). Verified, stored once per event id, processed by the worker. Invalid signature: 422 payment.invalid_signature and quarantined.',
    {
      response: z.object({ received: z.boolean(), duplicate: z.boolean() }),
      errors: [404, 422, 429],
    },
  ),
  route(
    'Sandbox payments',
    'company',
    'get',
    '/sandbox/psp/sessions/{id}',
    'Sandbox hosted page session (PAYMENT_MODE=mock only)',
    {
      response: m.sandboxSession,
      capability: 'owner/procurement member of the paying buyer workspace',
    },
  ),
  route(
    'Sandbox payments',
    'company',
    'post',
    '/sandbox/psp/sessions/{id}/complete',
    'Simulate the customer completing or failing the sandbox payment; queues a signed webhook (no money moves)',
    {
      body: m.sandboxCompleteRequest,
      response: z.object({ id: z.string(), state: z.string(), return_url: z.string() }),
      capability: 'owner/procurement member of the paying buyer workspace',
    },
  ),
  admin('get', '/orders', 'All orders (support)', 'admin.orders.read', {
    query: m.orderListQuery,
    response: m.orderSummary,
    list: true,
  }),
  admin('get', '/orders/{id}', 'Order detail', 'admin.orders.read', { response: m.orderDetail }),
  admin(
    'get',
    '/finance/summary',
    'Ledger balances, payment states, open cases',
    'admin.finance.read',
    {
      response: m.adminFinanceSummary,
    },
  ),
  admin('get', '/finance/payments', 'Payment attempts', 'admin.finance.read', {
    query: m.adminPaymentQuery,
    response: m.adminPaymentItem,
    list: true,
  }),
  admin('get', '/finance/reconciliation', 'Reconciliation cases', 'admin.finance.read', {
    query: m.reconciliationQuery,
    response: m.reconciliationItem,
    list: true,
  }),
];
