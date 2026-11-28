/**
 * Phase 6 routes (customer support, admin support queue, operations overview, scoped report
 * exports) for the generated OpenAPI document.
 */
import * as o from './operations';
import type { CatalogRoute } from './openapi-catalog';

const W = '/workspaces/{ws}/support';
const member = 'any workspace member (buyer or seller)';
const writer = 'any workspace member except VIEWER';

const customer = (
  method: CatalogRoute['method'],
  p: string,
  summary: string,
  x: Partial<CatalogRoute> = {},
): CatalogRoute => ({
  method,
  path: `${W}${p}`,
  summary,
  tag: 'Support',
  security: 'company',
  errors: [403, 404, 409, 422],
  ...x,
});
const admin = (
  method: CatalogRoute['method'],
  p: string,
  summary: string,
  capability: string,
  x: Partial<CatalogRoute> = {},
): CatalogRoute => ({
  method,
  path: `/admin${p}`,
  summary,
  tag: 'Admin support, overview and exports',
  security: 'admin',
  capability,
  errors: [403, 404, 409, 422],
  ...x,
});

export const OPERATIONS_ROUTES: CatalogRoute[] = [
  customer('get', '', 'Support tickets of this workspace', {
    query: o.supportListQuery,
    response: o.supportTicketSummary,
    list: true,
    capability: member,
    errors: [404, 422, 429],
  }),
  customer('post', '', 'Open a ticket (optionally linked to an own order or RFQ)', {
    body: o.supportCreateRequest,
    response: o.supportTicketDetail,
    capability: writer,
    errors: [403, 404, 409, 422, 429],
  }),
  customer('get', '/{id}', 'Ticket detail with messages', {
    response: o.supportTicketDetail,
    capability: member,
  }),
  customer('post', '/{id}/messages', 'Reply on a live ticket', {
    body: o.supportReplyRequest,
    response: o.supportTicketDetail,
    capability: writer,
    errors: [403, 404, 409, 422, 429],
  }),
  customer('post', '/{id}/close', 'Close the ticket', {
    response: o.supportTicketDetail,
    capability: writer,
  }),
  customer('post', '/{id}/reopen', 'Reopen a resolved ticket', {
    response: o.supportTicketDetail,
    capability: writer,
  }),

  admin(
    'get',
    '/operations/overview',
    'Operations overview (commerce figures need admin.finance.read)',
    'admin.companies.read',
    {
      query: o.overviewQuery,
      response: o.operationsOverview,
      errors: [403, 422],
    },
  ),
  admin('get', '/support', 'Support queue', 'admin.support.read', {
    query: o.adminSupportListQuery,
    response: o.supportTicketSummary,
    list: true,
    errors: [403, 422],
  }),
  admin(
    'get',
    '/support/{id}',
    'Ticket detail (limited order details only)',
    'admin.support.read',
    {
      response: o.supportTicketDetail,
    },
  ),
  admin('post', '/support/{id}/assign', 'Take (or take over) a ticket', 'admin.support.manage', {
    response: o.supportTicketDetail,
  }),
  admin('post', '/support/{id}/messages', 'Reply as the assigned agent', 'admin.support.manage', {
    body: o.supportReplyRequest,
    response: o.supportTicketDetail,
  }),
  admin('post', '/support/{id}/resolve', 'Resolve with an optional note', 'admin.support.manage', {
    body: o.supportResolveRequest,
    response: o.supportTicketDetail,
  }),
  admin(
    'post',
    '/support/{id}/reopen',
    'Reopen a resolved ticket and take it',
    'admin.support.manage',
    {
      response: o.supportTicketDetail,
    },
  ),
  admin('get', '/exports', "The caller's own report exports", 'admin.reports.export', {
    query: o.exportListQuery,
    response: o.exportItem,
    list: true,
    errors: [403, 422],
  }),
  admin(
    'post',
    '/exports',
    'Create a scoped CSV export (reason and TOTP step-up; denied attempts are audited)',
    'admin.reports.export (finance types need admin.finance.read; support may export only assigned disputes and tickets)',
    { body: o.exportCreateRequest, response: o.exportItem, errors: [403, 422, 429] },
  ),
  admin(
    'get',
    '/exports/{id}/download',
    'Download an export (creator only, before expiry; audited)',
    'admin.reports.export',
    {
      binary: true,
    },
  ),
];
