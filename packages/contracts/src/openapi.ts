/**
 * OpenAPI 3.1 document generated from the shared zod contracts (the same schemas the API uses to
 * validate requests), so the published spec cannot drift from the implementation's validation.
 * Regenerate with `pnpm --filter @app/contracts openapi`; a unit test fails when docs/api/openapi.json is stale.
 */
import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from '@asteasolutions/zod-to-openapi';
import { z, type ZodTypeAny } from 'zod';
import * as admin from './admin';
import * as auth from './auth';
import { okSchema, uuid } from './common';
import * as companies from './companies';
import { errorBodySchema, metaSchema } from './envelope';
import { livenessSchema, readinessSchema } from './health';
import * as team from './team';

extendZodWithOpenApi(z);

type Method = 'get' | 'post' | 'patch' | 'delete';
type Security = 'none' | 'company' | 'admin' | 'admin_pending_mfa';

type Route = {
  method: Method;
  path: string;
  summary: string;
  tag: string;
  security: Security;
  body?: ZodTypeAny;
  multipart?: boolean;
  query?: z.ZodObject;
  response?: ZodTypeAny;
  list?: boolean;
  status?: 200 | 202;
  binary?: boolean;
  errors?: number[];
  capability?: string;
};

const envelope = (data: ZodTypeAny, list = false) =>
  z.object({ data: list ? z.array(data) : data, meta: metaSchema });
const accepted = auth.acceptedResponse;

const ERROR_TEXT: Record<number, string> = {
  401: 'Not signed in (or admin MFA not completed: message_key admin.mfa_required)',
  403: 'Forbidden: missing capability, or CSRF check failed (common.csrf_origin / common.csrf_token)',
  404: 'Not found, or not visible to the caller (cross-tenant access is always 404)',
  409: 'Conflict: stale version/state, duplicate, or business rule',
  422: 'Validation failed; field_errors maps field -> code',
  429: 'Rate limited',
  503: 'Dependency unavailable (e.g. file scanning disabled)',
};

const id = { id: uuid };

const ROUTES: Route[] = [
  {
    method: 'get',
    path: '/health',
    summary: 'Liveness',
    tag: 'Health',
    security: 'none',
    response: livenessSchema,
  },
  {
    method: 'get',
    path: '/health/ready',
    summary: 'Readiness (database, Redis)',
    tag: 'Health',
    security: 'none',
    response: readinessSchema,
  },
  {
    method: 'get',
    path: '/auth/csrf',
    summary: 'Issue CSRF cookie and token (double submit)',
    tag: 'Auth',
    security: 'none',
    response: auth.csrfResponse,
  },
  {
    method: 'get',
    path: '/public/config',
    summary: 'Public configuration: product name (A06), sandbox flag, upload limit',
    tag: 'Auth',
    security: 'none',
    response: auth.publicConfigResponse,
  },
  {
    method: 'post',
    path: '/auth/register',
    summary:
      'Register a company user. Always 202 (no account enumeration); sends verification email',
    tag: 'Auth',
    security: 'none',
    body: auth.registerRequest,
    response: accepted,
    status: 202,
    errors: [422, 429],
  },
  {
    method: 'post',
    path: '/auth/verify-email',
    summary: 'Verify email with one-time token (24h)',
    tag: 'Auth',
    security: 'none',
    body: auth.tokenRequest,
    response: okSchema,
    errors: [422, 429],
  },
  {
    method: 'post',
    path: '/auth/resend-verification',
    summary: 'Resend verification email. Always 202',
    tag: 'Auth',
    security: 'none',
    body: auth.emailRequest,
    response: accepted,
    status: 202,
    errors: [422, 429],
  },
  {
    method: 'post',
    path: '/auth/login',
    summary: 'Sign in (company users). Sets session cookie; rotates session',
    tag: 'Auth',
    security: 'none',
    body: auth.loginRequest,
    response: auth.meResponse,
    errors: [401, 422, 429],
  },
  {
    method: 'post',
    path: '/auth/logout',
    summary: 'Sign out and revoke the current session',
    tag: 'Auth',
    security: 'company',
    response: okSchema,
  },
  {
    method: 'post',
    path: '/auth/password-reset/request',
    summary: 'Request password reset email. Always 202',
    tag: 'Auth',
    security: 'none',
    body: auth.emailRequest,
    response: accepted,
    status: 202,
    errors: [422, 429],
  },
  {
    method: 'post',
    path: '/auth/password-reset/confirm',
    summary: 'Set a new password with one-time token (1h); revokes all sessions',
    tag: 'Auth',
    security: 'none',
    body: auth.passwordResetConfirmRequest,
    response: okSchema,
    errors: [422, 429],
  },
  {
    method: 'get',
    path: '/me',
    summary: 'Current user, workspaces and effective capabilities',
    tag: 'Account',
    security: 'company',
    response: auth.meResponse,
  },
  {
    method: 'patch',
    path: '/me',
    summary: 'Update profile (name, preferred language)',
    tag: 'Account',
    security: 'company',
    body: auth.updateProfileRequest,
    response: auth.meResponse,
    errors: [422],
  },
  {
    method: 'get',
    path: '/me/sessions',
    summary: 'List active sessions',
    tag: 'Account',
    security: 'company',
    response: auth.sessionItem,
    list: true,
  },
  {
    method: 'delete',
    path: '/me/sessions/{id}',
    summary: 'Revoke one session',
    tag: 'Account',
    security: 'company',
    response: okSchema,
    errors: [404],
  },
  {
    method: 'post',
    path: '/me/sessions/revoke-others',
    summary: 'Revoke all other sessions',
    tag: 'Account',
    security: 'company',
    response: okSchema,
  },
  {
    method: 'post',
    path: '/me/password',
    summary: 'Change password; revokes other sessions',
    tag: 'Account',
    security: 'company',
    body: auth.passwordChangeRequest,
    response: okSchema,
    errors: [422, 429],
  },
  {
    method: 'get',
    path: '/companies',
    summary: 'Companies the caller is a member of',
    tag: 'Companies',
    security: 'company',
    response: companies.companyResponse,
    list: true,
  },
  {
    method: 'post',
    path: '/companies',
    summary: 'Register a company (caller becomes owner of each requested workspace)',
    tag: 'Companies',
    security: 'company',
    body: companies.companyCreateRequest,
    response: companies.companyResponse,
    errors: [409, 422, 429],
  },
  {
    method: 'get',
    path: '/companies/{id}',
    summary: 'Company details',
    tag: 'Companies',
    security: 'company',
    response: companies.companyResponse,
    errors: [404],
  },
  {
    method: 'patch',
    path: '/companies/{id}',
    summary: 'Edit legal details (DRAFT / NEEDS_INFO / REJECTED only; optimistic version)',
    tag: 'Companies',
    security: 'company',
    capability: 'company.manage',
    body: companies.companyUpdateRequest,
    response: companies.companyResponse,
    errors: [403, 404, 409, 422],
  },
  {
    method: 'get',
    path: '/companies/{id}/verification',
    summary: 'Current verification case and history',
    tag: 'Verification',
    security: 'company',
    response: companies.verificationOverviewResponse,
    errors: [404],
  },
  {
    method: 'post',
    path: '/companies/{id}/verification',
    summary: 'Submit or resubmit for verification (accepts terms version)',
    tag: 'Verification',
    security: 'company',
    capability: 'company.manage',
    body: companies.submitVerificationRequest,
    response: companies.verificationCaseResponse,
    errors: [403, 404, 409, 422],
  },
  {
    method: 'post',
    path: '/companies/{id}/renewal',
    summary: 'Start licence renewal (APPROVED, or SUSPENDED for licence expiry)',
    tag: 'Verification',
    security: 'company',
    capability: 'company.manage',
    body: companies.renewalRequest,
    response: companies.verificationCaseResponse,
    errors: [403, 404, 409, 422],
  },
  {
    method: 'post',
    path: '/companies/{id}/documents',
    summary:
      'Upload a verification document (PDF/PNG/JPEG; magic bytes sniffed; malware scanned; private storage)',
    tag: 'Verification',
    security: 'company',
    capability: 'company.manage',
    multipart: true,
    body: companies.documentUploadFields.extend({ file: z.string().meta({ format: 'binary' }) }),
    response: companies.verificationDocument,
    errors: [403, 404, 409, 422, 429, 503],
  },
  {
    method: 'delete',
    path: '/companies/{id}/documents/{documentId}',
    summary: 'Remove a document from an editable case',
    tag: 'Verification',
    security: 'company',
    capability: 'company.manage',
    response: okSchema,
    errors: [403, 404, 409],
  },
  {
    method: 'get',
    path: '/files/{id}/download',
    summary: 'Download a clean document (streamed after authorization; audited)',
    tag: 'Verification',
    security: 'company',
    capability: 'legal_documents.read',
    binary: true,
    errors: [403, 404],
  },
  {
    method: 'get',
    path: '/workspaces/{id}/members',
    summary: 'Workspace members',
    tag: 'Team',
    security: 'company',
    response: team.memberItem,
    list: true,
    errors: [404],
  },
  {
    method: 'get',
    path: '/workspaces/{id}/invitations',
    summary: 'Workspace invitations (owners)',
    tag: 'Team',
    security: 'company',
    capability: 'role OWNER',
    response: team.invitationItem,
    list: true,
    errors: [403, 404],
  },
  {
    method: 'post',
    path: '/workspaces/{id}/invitations',
    summary: 'Invite by email with a role valid for the workspace kind (7-day token)',
    tag: 'Team',
    security: 'company',
    capability: 'role OWNER',
    body: team.invitationCreateRequest,
    response: team.invitationItem,
    errors: [403, 404, 409, 422, 429],
  },
  {
    method: 'delete',
    path: '/workspaces/{id}/invitations/{invitationId}',
    summary: 'Revoke a pending invitation',
    tag: 'Team',
    security: 'company',
    capability: 'role OWNER',
    response: okSchema,
    errors: [403, 404, 409],
  },
  {
    method: 'post',
    path: '/invitations/preview',
    summary: 'Preview an invitation by token (public)',
    tag: 'Team',
    security: 'none',
    body: auth.tokenRequest,
    response: team.invitationPreviewResponse,
    errors: [422, 429],
  },
  {
    method: 'post',
    path: '/invitations/accept',
    summary: 'Accept an invitation (signed-in user whose email matches)',
    tag: 'Team',
    security: 'company',
    body: auth.tokenRequest,
    response: team.invitationAcceptResponse,
    errors: [403, 409, 422],
  },
  {
    method: 'patch',
    path: '/memberships/{id}',
    summary: 'Change role or revoke/restore access (last owner protected)',
    tag: 'Team',
    security: 'company',
    capability: 'role OWNER',
    body: team.membershipUpdateRequest,
    response: team.memberItem,
    errors: [403, 404, 409, 422],
  },
  {
    method: 'post',
    path: '/admin/auth/login',
    summary: 'Admin password step (admin origin only). Returns which MFA step is required',
    tag: 'Admin auth',
    security: 'none',
    body: admin.adminLoginRequest,
    response: admin.adminLoginResponse,
    errors: [401, 422, 429],
  },
  {
    method: 'post',
    path: '/admin/auth/mfa/enroll/start',
    summary: 'Start mandatory TOTP enrolment',
    tag: 'Admin auth',
    security: 'admin_pending_mfa',
    response: admin.mfaEnrollStartResponse,
    errors: [401, 409],
  },
  {
    method: 'post',
    path: '/admin/auth/mfa/enroll/confirm',
    summary: 'Confirm TOTP; returns 10 one-time recovery codes; rotates session',
    tag: 'Admin auth',
    security: 'admin_pending_mfa',
    body: admin.mfaCodeRequest,
    response: admin.recoveryCodesResponse,
    errors: [401, 409, 422, 429],
  },
  {
    method: 'post',
    path: '/admin/auth/mfa/verify',
    summary: 'Verify TOTP (replay-protected) or a recovery code; rotates session',
    tag: 'Admin auth',
    security: 'admin_pending_mfa',
    body: admin.mfaVerifyRequest,
    response: okSchema,
    errors: [401, 409, 422, 429],
  },
  {
    method: 'post',
    path: '/admin/auth/logout',
    summary: 'Admin sign out',
    tag: 'Admin auth',
    security: 'admin',
    response: okSchema,
  },
  {
    method: 'get',
    path: '/admin/me',
    summary: 'Admin identity, roles and capabilities',
    tag: 'Admin auth',
    security: 'admin',
    response: admin.adminMeResponse,
  },
  {
    method: 'get',
    path: '/admin/overview',
    summary: 'Live counts for the admin overview',
    tag: 'Admin',
    security: 'admin',
    capability: 'admin.companies.read',
    response: admin.adminOverviewResponse,
  },
  {
    method: 'get',
    path: '/admin/verification',
    summary: 'Verification queue (cursor paginated)',
    tag: 'Admin',
    security: 'admin',
    capability: 'admin.verification.review',
    query: admin.verificationQueueQuery,
    response: admin.verificationQueueItem,
    list: true,
  },
  {
    method: 'get',
    path: '/admin/verification/{id}',
    summary: 'Verification case detail',
    tag: 'Admin',
    security: 'admin',
    capability: 'admin.verification.review',
    response: admin.adminCaseDetail,
    errors: [404],
  },
  {
    method: 'post',
    path: '/admin/verification/{id}/start-review',
    summary: 'Assign to self and move SUBMITTED -> UNDER_REVIEW',
    tag: 'Admin',
    security: 'admin',
    capability: 'admin.verification.review',
    body: admin.startReviewRequest,
    response: admin.adminCaseDetail,
    errors: [404, 409],
  },
  {
    method: 'post',
    path: '/admin/verification/{id}/decision',
    summary: 'Approve, request information or reject (reason required unless approving)',
    tag: 'Admin',
    security: 'admin',
    capability: 'admin.verification.review',
    body: admin.decisionRequest,
    response: admin.adminCaseDetail,
    errors: [404, 409, 422],
  },
  {
    method: 'get',
    path: '/admin/files/{id}/download',
    summary: 'Download a case document (audited)',
    tag: 'Admin',
    security: 'admin',
    capability: 'admin.verification.review',
    binary: true,
    errors: [404],
  },
  {
    method: 'get',
    path: '/admin/companies',
    summary: 'Companies (filter by status, search)',
    tag: 'Admin',
    security: 'admin',
    capability: 'admin.companies.read',
    query: admin.adminCompaniesQuery,
    response: admin.adminCompanySummary,
    list: true,
  },
  {
    method: 'get',
    path: '/admin/companies/{id}',
    summary: 'Company detail with members and cases',
    tag: 'Admin',
    security: 'admin',
    capability: 'admin.companies.read',
    response: admin.adminCompanyDetail,
    errors: [404],
  },
  {
    method: 'post',
    path: '/admin/companies/{id}/suspend',
    summary: 'Suspend a company (compliance); restricts workspaces',
    tag: 'Admin',
    security: 'admin',
    capability: 'admin.companies.suspend',
    body: admin.reasonRequest,
    response: admin.adminCompanyDetail,
    errors: [404, 409, 422],
  },
  {
    method: 'post',
    path: '/admin/companies/{id}/reactivate',
    summary: 'Reactivate a compliance-suspended company',
    tag: 'Admin',
    security: 'admin',
    capability: 'admin.companies.suspend',
    body: admin.reasonRequest,
    response: admin.adminCompanyDetail,
    errors: [404, 409, 422],
  },
  {
    method: 'get',
    path: '/admin/users',
    summary: 'Users (search, account type)',
    tag: 'Admin',
    security: 'admin',
    capability: 'admin.users.read',
    query: admin.adminUsersQuery,
    response: admin.adminUserItem,
    list: true,
  },
  {
    method: 'post',
    path: '/admin/users/{id}/revoke-sessions',
    summary: 'Revoke all sessions of a user',
    tag: 'Admin',
    security: 'admin',
    capability: 'admin.users.revoke_sessions',
    body: admin.reasonRequest,
    response: z.object({ revoked: z.number().int() }),
    errors: [404, 422],
  },
  {
    method: 'get',
    path: '/admin/audit',
    summary: 'Append-only audit log (filters, cursor paginated)',
    tag: 'Admin',
    security: 'admin',
    capability: 'admin.audit.read',
    query: admin.auditQuery,
    response: admin.auditItem,
    list: true,
  },
  {
    method: 'get',
    path: '/admin/staff',
    summary: 'Platform staff and roles',
    tag: 'Admin',
    security: 'admin',
    capability: 'admin.staff.manage',
    response: admin.staffItem,
    list: true,
  },
  {
    method: 'post',
    path: '/admin/staff/{id}/roles',
    summary: 'Set staff roles (last super-admin protected)',
    tag: 'Admin',
    security: 'admin',
    capability: 'admin.staff.manage',
    body: admin.staffRolesRequest,
    response: admin.staffItem,
    errors: [404, 409, 422],
  },
];

export const API_ROUTES = ROUTES.map((r) => ({ method: r.method, path: r.path }));

export function buildOpenApiDocument(): Record<string, unknown> {
  const registry = new OpenAPIRegistry();
  registry.registerComponent('securitySchemes', 'companySession', {
    type: 'apiKey',
    in: 'cookie',
    name: 'sid',
    description: 'Company session cookie (__Host-sid in production). HttpOnly, SameSite=Lax.',
  });
  registry.registerComponent('securitySchemes', 'adminSession', {
    type: 'apiKey',
    in: 'cookie',
    name: 'asid',
    description:
      'Admin session cookie on the admin origin only (__Host-asid in production). SameSite=Strict. Requires completed TOTP.',
  });
  registry.registerComponent('securitySchemes', 'csrfToken', {
    type: 'apiKey',
    in: 'header',
    name: 'X-CSRF-Token',
    description:
      'Must equal the csrf cookie on every POST/PATCH/DELETE; Origin must be the web origin (admin origin for /admin).',
  });
  const errorRef = errorBodySchema;

  for (const r of ROUTES) {
    const params = [...r.path.matchAll(/\{(\w+)\}/g)].map((m) => m[1]!);
    const paramsSchema = params.length
      ? z.object(Object.fromEntries(params.map((p) => [p, id.id])))
      : undefined;
    const write = r.method !== 'get';
    const security: Record<string, string[]>[] = [];
    if (r.security === 'company')
      security.push(write ? { companySession: [], csrfToken: [] } : { companySession: [] });
    if (r.security === 'admin' || r.security === 'admin_pending_mfa')
      security.push(write ? { adminSession: [], csrfToken: [] } : { adminSession: [] });
    if (r.security === 'none' && write) security.push({ csrfToken: [] });

    const responses: Record<string, unknown> = {};
    const status = r.status ?? 200;
    responses[String(status)] = r.binary
      ? {
          description: 'File content',
          content: { 'application/octet-stream': { schema: { type: 'string', format: 'binary' } } },
        }
      : {
          description: 'Success',
          content: { 'application/json': { schema: envelope(r.response ?? okSchema, r.list) } },
        };
    const errs = new Set([
      ...(r.errors ?? []),
      ...(r.security !== 'none' ? [401] : []),
      ...(write ? [403] : []),
    ]);
    for (const e of [...errs].sort())
      responses[String(e)] = {
        description: ERROR_TEXT[e] ?? 'Error',
        content: { 'application/json': { schema: errorRef } },
      };

    const notes = [
      r.capability ? `Requires: ${r.capability}.` : '',
      r.security === 'admin_pending_mfa'
        ? 'Allowed for an admin session that has passed the password step but not MFA.'
        : '',
    ]
      .filter(Boolean)
      .join(' ');

    registry.registerPath({
      method: r.method,
      path: `/api/v1${r.path}`,
      summary: r.summary,
      description: notes || undefined,
      tags: [r.tag],
      security: security.length ? security : [],
      request: {
        ...(paramsSchema ? { params: paramsSchema } : {}),
        ...(r.query ? { query: r.query } : {}),
        ...(r.body
          ? {
              body: {
                required: true,
                content: {
                  [r.multipart ? 'multipart/form-data' : 'application/json']: { schema: r.body },
                },
              },
            }
          : {}),
      },
      responses: responses as never,
    });
  }

  const doc = new OpenApiGeneratorV31(registry.definitions).generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'UAE B2B Marketplace API',
      version: '1.0.0-phase1',
      description:
        'Phase 1: identity, sessions, companies, verification, team and admin. Money is integer fils (AED); timestamps are UTC ISO-8601. Successful responses use { data, meta }; errors use { error: { code, message_key, field_errors?, request_id } }. Cross-tenant resources return 404.',
    },
    servers: [{ url: '/' }],
  });
  return doc as unknown as Record<string, unknown>;
}
