/**
 * Phase 3 routes (RFQs, quotes and award, conversations, notifications, admin RFQ moderation) for
 * the generated OpenAPI document.
 */
import { z } from 'zod';
import { reasonRequest } from './admin';
import type { CatalogRoute } from './openapi-catalog';
import * as r from './rfq';

const file = { file: z.string().meta({ format: 'binary' }) };
const ok = z.object({ ok: z.literal(true) });
const B = '/buyer/workspaces/{ws}';
const S = '/seller/workspaces/{ws}';
const C = '/workspaces/{ws}/conversations';
const buyerEdit = 'buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12)';
const sellerEdit = 'seller.catalog.edit (OWNER, SALES; trading-gated)';

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
const buyer = (m: CatalogRoute['method'], p: string, s: string, x: Partial<CatalogRoute> = {}) =>
  route('Buyer RFQs', 'company', m, `${B}${p}`, s, { response: r.rfqDetail, ...x });
const seller = (m: CatalogRoute['method'], p: string, s: string, x: Partial<CatalogRoute> = {}) =>
  route('Seller RFQs and quotes', 'company', m, `${S}${p}`, s, { response: r.rfqDetail, ...x });
const conv = (m: CatalogRoute['method'], p: string, s: string, x: Partial<CatalogRoute> = {}) =>
  route('Messages', 'company', m, `${C}${p}`, s, {
    capability: 'messaging role (OWNER, PROCUREMENT, SALES); sending is trading-gated (A12)',
    ...x,
  });
const note = (m: CatalogRoute['method'], p: string, s: string, x: Partial<CatalogRoute> = {}) =>
  route('Notifications', 'company', m, `/notifications${p}`, s, { errors: [404, 422], ...x });
const admin = (
  m: CatalogRoute['method'],
  p: string,
  s: string,
  cap: string,
  x: Partial<CatalogRoute> = {},
) => route('Admin RFQs', 'admin', m, `/admin/rfqs${p}`, s, { capability: cap, ...x });

export const RFQ_ROUTES: CatalogRoute[] = [
  buyer('get', '/rfqs', 'List the workspace RFQs (offset cursor)', {
    query: r.rfqListQuery,
    response: r.rfqSummary,
    list: true,
    capability: 'member of the buyer workspace',
  }),
  buyer('post', '/rfqs', 'Create an RFQ draft (validated category, dates, invitees)', {
    body: r.rfqCreateRequest,
    capability: buyerEdit,
  }),
  buyer('get', '/invite-candidates', 'Public, trading-eligible suppliers the buyer may invite', {
    query: r.inviteCandidateQuery,
    response: r.inviteCandidate,
    list: true,
    capability: 'member of the buyer workspace',
  }),
  buyer('get', '/rfqs/{id}', 'RFQ detail with every quote, timeline and attachments', {
    capability: 'member of the buyer workspace',
  }),
  buyer('patch', '/rfqs/{id}', 'Edit a draft (expected_version)', {
    body: r.rfqUpdateRequest,
    capability: buyerEdit,
  }),
  buyer(
    'post',
    '/rfqs/{id}/publish',
    'Publish a draft; notifies invitees and eligible pool sellers',
    {
      body: r.quoteExpectedRequest,
      capability: buyerEdit,
    },
  ),
  buyer('post', '/rfqs/{id}/cancel', 'Cancel a draft or open RFQ without an award', {
    body: r.rfqCancelRequest,
    capability: buyerEdit,
  }),
  buyer('post', '/rfqs/{id}/files', 'Attach a file to a draft (PDF/PNG/JPEG; scanned; private)', {
    multipart: true,
    body: z.object(file),
    capability: buyerEdit,
    errors: [403, 404, 409, 422, 429, 503],
  }),
  buyer('delete', '/rfqs/{id}/files/{fileId}', 'Remove a draft attachment', {
    capability: buyerEdit,
  }),
  buyer(
    'get',
    '/rfqs/{id}/files/{fileId}',
    'Download an RFQ attachment or a submitted quote attachment (audited)',
    {
      binary: true,
      capability: 'member of the buyer workspace',
    },
  ),
  buyer(
    'post',
    '/quotes/{quoteId}/request-revision',
    'Ask the seller to revise the current version',
    {
      body: r.quoteVersionActionRequest,
      capability: buyerEdit,
    },
  ),
  buyer('post', '/quotes/{quoteId}/decline', 'Decline the current quote version', {
    body: r.quoteVersionActionRequest,
    capability: buyerEdit,
  }),
  buyer(
    'post',
    '/quotes/{quoteId}/accept',
    'Award: accept the exact current version (header Idempotency-Key required). 409 quote.superseded, quote.expired, rfq.already_awarded. Orders are created in Phase 4.',
    { body: r.quoteAcceptRequest, response: r.awardResponse, capability: buyerEdit },
  ),

  seller('get', '/rfqs', "Eligible pool and invitations (never another seller's quote)", {
    query: r.sellerRfqListQuery,
    response: r.sellerRfqItem,
    list: true,
    capability: 'member of the seller workspace',
  }),
  seller(
    'get',
    '/rfqs/{id}',
    "RFQ detail with only the caller's own quote (404 when not visible)",
    {
      capability: 'member of the seller workspace',
    },
  ),
  seller(
    'get',
    '/rfqs/{id}/files/{fileId}',
    'Download an RFQ attachment or an own quote attachment (audited)',
    {
      binary: true,
      capability: 'member of the seller workspace',
    },
  ),
  seller('post', '/rfqs/{id}/quote', 'Create a quote draft (one per seller per RFQ)', {
    body: r.quoteDraftRequest,
    capability: sellerEdit,
  }),
  seller('get', '/quotes', 'Own quotes', {
    query: r.sellerQuoteListQuery,
    response: r.sellerQuoteItem,
    list: true,
    capability: 'member of the seller workspace',
  }),
  seller('patch', '/quotes/{id}', 'Edit the draft version (server recomputes totals)', {
    body: r.quoteUpdateRequest,
    capability: sellerEdit,
  }),
  seller('post', '/quotes/{id}/submit', 'Submit the draft; the version becomes immutable', {
    body: r.quoteExpectedRequest,
    capability: sellerEdit,
  }),
  seller('post', '/quotes/{id}/revise', 'Submit a new version; the previous one is superseded', {
    body: r.quoteReviseRequest,
    capability: sellerEdit,
  }),
  seller('post', '/quotes/{id}/withdraw', 'Withdraw a submitted quote before acceptance', {
    body: r.quoteExpectedRequest,
    capability: sellerEdit,
  }),
  seller('post', '/quotes/{id}/files', 'Attach a file to the draft version (scanned; private)', {
    multipart: true,
    body: z.object(file),
    capability: sellerEdit,
    errors: [403, 404, 409, 422, 429, 503],
  }),
  seller('delete', '/quotes/{id}/files/{fileId}', 'Remove a draft attachment', {
    capability: sellerEdit,
  }),

  conv('get', '', 'Conversations of the workspace with unread counts', {
    query: z.object({ cursor: z.string().optional() }),
    response: r.conversationItem,
    list: true,
  }),
  conv(
    'post',
    '',
    'Start (or continue) a conversation: buyer from a storefront, seller from a visible RFQ',
    {
      body: r.conversationStartRequest,
      response: r.conversationDetail,
    },
  ),
  conv('get', '/{id}', 'Conversation detail', { response: r.conversationDetail }),
  conv('get', '/{id}/messages', 'Messages, newest first', {
    query: z.object({ cursor: z.string().optional() }),
    response: r.messageItem,
    list: true,
  }),
  conv('post', '/{id}/messages', 'Send a message', {
    body: r.messageCreateRequest,
    response: r.messageItem,
  }),
  conv('post', '/{id}/read', 'Move the read marker forward', { body: r.readRequest, response: ok }),

  note('get', '', 'Own notifications, newest first', {
    query: r.notificationListQuery,
    response: r.notificationItem,
    list: true,
  }),
  note('get', '/unread', 'Unread notification and message counts', { response: r.unreadCounts }),
  note('get', '/preferences', 'Email notification preferences', {
    response: r.notificationPreferences,
  }),
  note('patch', '/preferences', 'Update email notification preferences', {
    body: r.notificationPreferencesRequest,
    response: r.notificationPreferences,
  }),
  note('post', '/read-all', 'Mark all notifications read', { response: ok }),
  note('post', '/{id}/read', 'Mark one notification read', { response: ok }),

  admin('get', '', 'RFQs (metadata only)', 'admin.rfqs.read', {
    query: r.adminRfqQuery,
    response: r.adminRfqItem,
    list: true,
  }),
  admin('get', '/{id}', 'RFQ metadata and quote states (no quote contents)', 'admin.rfqs.read', {
    response: r.adminRfqDetail,
  }),
  admin(
    'post',
    '/{id}/hide',
    'Hide an abusive RFQ (sellers lose access; audited)',
    'admin.rfqs.moderate',
    {
      body: reasonRequest,
      response: r.adminRfqDetail,
    },
  ),
  admin('post', '/{id}/unhide', 'Restore a hidden RFQ (audited)', 'admin.rfqs.moderate', {
    body: reasonRequest,
    response: r.adminRfqDetail,
  }),
];
