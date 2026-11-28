/**
 * Phase 5 routes (fulfilment, receipt, disputes, refunds, payouts, reviews) for the generated
 * OpenAPI document. Refunds and payouts go through the sandbox provider adapter only.
 */
import { z } from 'zod';
import { orderDetail } from './commerce';
import * as fp from './financial-policy';
import * as f from './fulfilment';
import type { CatalogRoute } from './openapi-catalog';

const moderated = z.object({ id: z.string(), state: z.enum(f.REVIEW_STATES) });
const file = { file: z.string().meta({ format: 'binary' }) };
const B = '/buyer/workspaces/{ws}';
const S = '/seller/workspaces/{ws}';
const ship =
  'seller.inventory.ship (OWNER, WAREHOUSE; role only, works while trading is restricted)';
const buyerAct = 'buyer.orders.act (OWNER, PROCUREMENT)';
const sellerDispute = 'seller.inventory.ship or seller.catalog.edit (OWNER, SALES, WAREHOUSE)';
const memberB = 'any buyer workspace member';
const memberS = 'any seller workspace member';

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
  route('Buyer fulfilment and disputes', 'company', mt, `${B}${p}`, s, x);
const seller = (mt: CatalogRoute['method'], p: string, s: string, x: Partial<CatalogRoute> = {}) =>
  route('Seller fulfilment and disputes', 'company', mt, `${S}${p}`, s, x);
const admin = (
  mt: CatalogRoute['method'],
  p: string,
  s: string,
  cap: string,
  x: Partial<CatalogRoute> = {},
) =>
  route('Admin disputes, refunds, payouts, reviews', 'admin', mt, `/admin${p}`, s, {
    capability: cap,
    ...x,
  });

export const FULFILMENT_ROUTES: CatalogRoute[] = [
  // ---------------------------------------------------------------- seller
  seller(
    'post',
    '/orders/{id}/cancel',
    'Cancel a paid, undispatched order; requests a full refund for finance approval (C-07)',
    { body: f.sellerCancelRequest, response: orderDetail, capability: ship },
  ),
  seller('post', '/orders/{id}/process', 'Start processing a confirmed order', {
    response: orderDetail,
    capability: ship,
  }),
  seller(
    'post',
    '/orders/{id}/dispatch',
    'Record dispatch or collection handover (paid orders only; full shipment; optional proof of dispatch)',
    {
      multipart: true,
      body: f.shipmentDispatchRequest.extend({ file: file.file.optional() }),
      response: orderDetail,
      capability: ship,
      errors: [403, 404, 409, 422, 429, 503],
    },
  ),
  seller(
    'post',
    '/orders/{id}/deliver',
    'Report delivery with optional proof (PDF/PNG/JPEG; scanned)',
    {
      multipart: true,
      body: f.shipmentDeliverRequest.extend({ file: file.file.optional() }),
      response: orderDetail,
      capability: ship,
      errors: [403, 404, 409, 422, 429, 503],
    },
  ),
  seller('get', '/orders/{id}/proof', 'Download the delivery proof (audited)', {
    binary: true,
    capability: memberS,
  }),
  seller('get', '/orders/{id}/dispatch-proof', 'Download the proof of dispatch (audited)', {
    binary: true,
    capability: memberS,
  }),
  seller('post', '/orders/{id}/disputes', 'Open a dispute on the order', {
    body: f.disputeOpenRequest,
    response: f.disputeDetail,
    capability: sellerDispute,
  }),
  seller('get', '/disputes', "Disputes on this workspace's orders", {
    query: f.disputeListQuery,
    response: f.disputeSummary,
    list: true,
    capability: memberS,
  }),
  seller('get', '/disputes/{id}', 'Dispute detail with messages and evidence', {
    response: f.disputeDetail,
    capability: memberS,
  }),
  seller('post', '/disputes/{id}/messages', 'Add a message, optionally with evidence', {
    multipart: true,
    body: f.disputeMessageRequest.extend({ file: file.file.optional() }),
    response: f.disputeDetail,
    capability: sellerDispute,
    errors: [403, 404, 409, 422, 429, 503],
  }),
  seller('get', '/disputes/{id}/files/{fileId}', 'Download dispute evidence (audited)', {
    binary: true,
    capability: memberS,
  }),
  seller('get', '/finance', 'Seller settlement summary: eligible, held, in payout, paid out', {
    response: f.sellerFinanceSummary,
    capability: 'seller.finance (OWNER, FINANCE)',
  }),

  // ---------------------------------------------------------------- buyer
  buyer('post', '/orders/{id}/confirm-receipt', 'Confirm receipt; completes the order', {
    response: orderDetail,
    capability: buyerAct,
  }),
  buyer('post', '/orders/{id}/review', 'Rate the supplier once the order is completed', {
    body: f.reviewCreateRequest,
    response: orderDetail,
    capability: buyerAct,
  }),
  buyer('get', '/orders/{id}/proof', 'Download the delivery proof (audited)', {
    binary: true,
    capability: memberB,
  }),
  buyer('get', '/orders/{id}/dispatch-proof', 'Download the proof of dispatch (audited)', {
    binary: true,
    capability: memberB,
  }),
  buyer('post', '/orders/{id}/disputes', 'Open a dispute (within 14 days of completion)', {
    body: f.disputeOpenRequest,
    response: f.disputeDetail,
    capability: buyerAct,
  }),
  buyer('get', '/disputes', "Disputes on this workspace's orders", {
    query: f.disputeListQuery,
    response: f.disputeSummary,
    list: true,
    capability: memberB,
  }),
  buyer('get', '/disputes/{id}', 'Dispute detail with messages and evidence', {
    response: f.disputeDetail,
    capability: memberB,
  }),
  buyer('post', '/disputes/{id}/messages', 'Add a message, optionally with evidence', {
    multipart: true,
    body: f.disputeMessageRequest.extend({ file: file.file.optional() }),
    response: f.disputeDetail,
    capability: buyerAct,
    errors: [403, 404, 409, 422, 429, 503],
  }),
  buyer('get', '/disputes/{id}/files/{fileId}', 'Download dispute evidence (audited)', {
    binary: true,
    capability: memberB,
  }),

  // ---------------------------------------------------------------- public
  route(
    'Marketplace',
    'none',
    'get',
    '/marketplace/suppliers/{id}/reviews',
    'Published reviews of a public storefront (buyers anonymised)',
    {
      response: f.storefrontReviews,
      errors: [404, 429],
    },
  ),

  // ---------------------------------------------------------------- admin
  admin('get', '/disputes', 'Dispute queue', 'admin.disputes.read', {
    query: f.disputeListQuery,
    response: f.disputeSummary,
    list: true,
  }),
  admin('get', '/disputes/{id}', 'Dispute detail', 'admin.disputes.read', {
    response: f.disputeDetail,
  }),
  admin(
    'post',
    '/disputes/{id}/assign',
    'Assign the dispute to yourself',
    'admin.disputes.manage',
    {
      response: f.disputeDetail,
    },
  ),
  admin(
    'post',
    '/disputes/{id}/request-evidence',
    'Ask both parties for evidence',
    'admin.disputes.manage',
    {
      body: f.adminDisputeEvidenceRequest,
      response: f.disputeDetail,
    },
  ),
  admin(
    'post',
    '/disputes/{id}/propose',
    'Propose a resolution (refund proposals go to finance)',
    'admin.disputes.manage',
    {
      body: f.adminDisputeProposeRequest,
      response: f.disputeDetail,
    },
  ),
  admin('post', '/disputes/{id}/close', 'Close without financial action', 'admin.disputes.manage', {
    body: f.adminDisputeCloseRequest,
    response: f.disputeDetail,
  }),
  admin('post', '/disputes/{id}/messages', 'Message both parties', 'admin.disputes.manage', {
    body: f.disputeMessageRequest,
    response: f.disputeDetail,
  }),
  admin(
    'get',
    '/disputes/{id}/files/{fileId}',
    'Download dispute evidence (audited)',
    'admin.disputes.read',
    {
      binary: true,
    },
  ),
  admin('get', '/refunds', 'Refunds', 'admin.finance.read', {
    query: f.refundListQuery,
    response: f.refundItem,
    list: true,
  }),
  admin(
    'post',
    '/refunds',
    'Request a refund (up to the remaining refundable amount)',
    'admin.refunds.request',
    {
      body: f.refundCreateRequest,
      response: f.refundItem,
    },
  ),
  admin(
    'post',
    '/refunds/{id}/approve',
    'Approve a refund (a different finance user; dual control)',
    'admin.refunds.approve',
    {
      body: f.financeDecisionRequest,
      response: f.refundItem,
    },
  ),
  admin('post', '/refunds/{id}/reject', 'Reject a refund request', 'admin.refunds.approve', {
    body: f.financeDecisionRequest,
    response: f.refundItem,
  }),
  admin(
    'get',
    '/payouts/eligible',
    'Sellers with orders past the dispute window after verified delivery, with no dispute, hold, open reconciliation case or pending refund',
    'admin.finance.read',
    {
      response: z.array(f.payoutEligibleSeller),
    },
  ),
  admin('get', '/payouts', 'Payouts', 'admin.finance.read', {
    query: f.payoutListQuery,
    response: f.payoutItem,
    list: true,
  }),
  admin(
    'post',
    '/payouts',
    "Request this week's payout of all eligible orders for one seller (one live payout per seller per Dubai week)",
    'admin.payouts.request',
    {
      body: f.payoutCreateRequest,
      response: f.payoutItem,
    },
  ),
  admin(
    'post',
    '/payouts/{id}/approve',
    'Approve a payout (a different finance user; dual control). Refused when an order is held or disputed, or the provider balance is insufficient',
    'admin.payouts.approve',
    {
      body: f.financeDecisionRequest,
      response: f.payoutItem,
    },
  ),
  admin('post', '/payouts/{id}/reject', 'Reject a payout request', 'admin.payouts.approve', {
    body: f.financeDecisionRequest,
    response: f.payoutItem,
  }),
  admin(
    'post',
    '/payouts/{id}/confirm',
    'Confirm a payout proposed by the weekly schedule; it becomes a request that a different finance approver must approve',
    'admin.payouts.request',
    {
      response: f.payoutItem,
    },
  ),
  admin(
    'post',
    '/payouts/{id}/withdraw',
    'Withdraw a payout proposed by the weekly schedule (reason recorded; its orders are released)',
    'admin.payouts.request',
    {
      body: f.financeDecisionRequest,
      response: f.payoutItem,
    },
  ),
  admin(
    'get',
    '/payouts/holidays',
    'UAE public holidays that move the weekly payout run',
    'admin.finance.read',
    {
      response: z.array(fp.payoutHolidayItem),
    },
  ),
  admin(
    'post',
    '/payouts/holidays',
    'Record a UAE public holiday (a payout run due that day moves to the next working day)',
    'admin.payouts.request',
    {
      body: fp.payoutHolidayCreateRequest,
      response: fp.payoutHolidayItem,
    },
  ),
  admin(
    'delete',
    '/payouts/holidays/{date}',
    'Remove a recorded holiday',
    'admin.payouts.request',
    {
      response: z.object({ date: z.string() }),
    },
  ),
  admin(
    'post',
    '/sandbox/operations/{ref}/complete',
    'SANDBOX ONLY: simulate the provider finishing a refund or payout',
    'admin.finance.read',
    {
      body: f.sandboxOperationCompleteRequest,
      response: z.object({ provider_ref: z.string(), outcome: z.enum(['success', 'failure']) }),
    },
  ),
  admin('get', '/reviews', 'Reviews for moderation', 'admin.reviews.moderate', {
    query: f.reviewListQuery,
    response: f.adminReviewItem,
    list: true,
  }),
  admin('post', '/reviews/{id}/hide', 'Hide a review (reason recorded)', 'admin.reviews.moderate', {
    body: f.reviewHideRequest,
    response: moderated,
  }),
  admin('post', '/reviews/{id}/unhide', 'Publish a hidden review again', 'admin.reviews.moderate', {
    body: f.reviewHideRequest,
    response: moderated,
  }),
  admin(
    'get',
    '/payouts/run',
    'Current weekly payout run and available provider balance',
    'admin.finance.read',
    {
      response: fp.payoutRunSummary,
    },
  ),
  admin('get', '/holds', 'Settlement holds on orders', 'admin.holds.manage', {
    query: fp.orderHoldListQuery,
    response: fp.orderHoldItem,
    list: true,
  }),
  admin(
    'post',
    '/holds',
    'Place a compliance, fraud, reconciliation or payment-investigation hold',
    'admin.holds.manage',
    {
      body: fp.orderHoldCreateRequest,
      response: fp.orderHoldItem,
    },
  ),
  admin('post', '/holds/{id}/release', 'Release a hold (reason recorded)', 'admin.holds.manage', {
    body: fp.orderHoldReleaseRequest,
    response: fp.orderHoldItem,
  }),
  admin(
    'get',
    '/finance/commission',
    'Current commission policy and its history',
    'admin.finance.read',
    {
      response: fp.commissionSettings,
    },
  ),
  admin(
    'post',
    '/finance/commission',
    'Record a new commission policy version (TOTP step-up; applies to new checkouts from its effective date, at least 30 days ahead; suppliers are notified)',
    'admin.commission.manage',
    {
      body: fp.commissionPolicyCreateRequest,
      response: fp.commissionSettings,
    },
  ),
  admin(
    'post',
    '/finance/reconciliation/{id}/resolve',
    'Resolve an open reconciliation case (reason recorded)',
    'admin.reconciliation.resolve',
    {
      body: fp.reconciliationResolveRequest,
      response: z.object({ id: z.string(), state: z.literal('RESOLVED') }),
    },
  ),
];
