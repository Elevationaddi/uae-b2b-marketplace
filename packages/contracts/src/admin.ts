import { z } from 'zod';
import { companyStatus } from './auth';
import { email, emirate, isoDate, isoDateTime, uuid } from './common';
import {
  renewalProposal,
  verificationDocument,
  verificationEvent,
  verificationState,
} from './companies';
import { ADMIN_CAPABILITIES, ADMIN_ROLES, MEMBERSHIP_ROLES, WORKSPACE_KINDS } from './permissions';

export const adminLoginRequest = z.object({ email, password: z.string().min(1).max(128) });
export const adminLoginResponse = z.object({ mfa: z.enum(['ENROLL_REQUIRED', 'VERIFY_REQUIRED']) });
export const mfaEnrollStartResponse = z.object({
  otpauth_url: z.string(),
  secret: z.string(),
  qr_svg: z.string(),
});
export const mfaCodeRequest = z.object({ code: z.string().regex(/^\d{6}$/, 'code') });
export const mfaVerifyRequest = z
  .object({
    code: z
      .string()
      .regex(/^\d{6}$/, 'code')
      .optional(),
    recovery_code: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9]{4,5}-?[A-Za-z0-9]{4,5}$/, 'recovery_code')
      .optional(),
  })
  .refine((v) => (v.code === undefined) !== (v.recovery_code === undefined), 'one_of');
export const recoveryCodesResponse = z.object({ recovery_codes: z.array(z.string()) });

export const adminMeResponse = z.object({
  user: z.object({ id: uuid, email: z.string(), full_name: z.string().nullable() }),
  roles: z.array(z.enum(ADMIN_ROLES)),
  capabilities: z.array(z.enum(ADMIN_CAPABILITIES)),
  recovery_codes_remaining: z.number().int(),
});

export const adminCompanySummary = z.object({
  id: uuid,
  legal_name: z.string(),
  display_name: z.string(),
  licence_number: z.string(),
  licence_issuer: z.string(),
  licence_expiry: isoDate,
  licence_expired: z.boolean(),
  emirate,
  status: companyStatus,
  kinds: z.array(z.enum(WORKSPACE_KINDS)),
  created_at: isoDateTime,
});

export const verificationQueueItem = z.object({
  case_id: uuid,
  kind: z.enum(['INITIAL', 'RENEWAL']),
  state: verificationState,
  submitted_at: isoDateTime.nullable(),
  assigned_admin: z.object({ id: uuid, email: z.string() }).nullable(),
  company: adminCompanySummary,
});

export const verificationQueueQuery = z.object({
  state: z.enum(['SUBMITTED', 'UNDER_REVIEW', 'NEEDS_INFO', 'REJECTED', 'APPROVED']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().max(200).optional(),
});

export const adminCaseDetail = z.object({
  case_id: uuid,
  kind: z.enum(['INITIAL', 'RENEWAL']),
  state: verificationState,
  submitted_at: isoDateTime.nullable(),
  decided_at: isoDateTime.nullable(),
  reason: z.string().nullable(),
  proposed: renewalProposal.nullable(),
  assigned_admin: z.object({ id: uuid, email: z.string() }).nullable(),
  company: adminCompanySummary.extend({
    activity: z.string(),
    trn: z.string().nullable(),
    contact_email: z.string(),
    contact_phone: z.string(),
    terms_version: z.string().nullable(),
  }),
  documents: z.array(verificationDocument),
  events: z.array(verificationEvent),
});

export const startReviewRequest = z.object({ expected_state: verificationState });
export const decisionRequest = z
  .object({
    decision: z.enum(['APPROVED', 'NEEDS_INFO', 'REJECTED']),
    reason: z.string().trim().max(2000).optional(),
    expected_state: verificationState,
  })
  .refine((v) => v.decision === 'APPROVED' || (v.reason !== undefined && v.reason.length >= 5), {
    message: 'reason_required',
    path: ['reason'],
  });

export const reasonRequest = z.object({ reason: z.string().trim().min(5, 'min').max(2000) });

export const adminCompaniesQuery = z.object({
  status: z
    .enum(['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'NEEDS_INFO', 'REJECTED', 'APPROVED', 'SUSPENDED'])
    .optional(),
  q: z.string().trim().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().max(200).optional(),
});

export const adminCompanyDetail = adminCompanySummary.extend({
  activity: z.string(),
  trn: z.string().nullable(),
  vat_status: z.enum(['UNKNOWN', 'REGISTERED', 'NOT_REGISTERED']),
  vat_status_confirmed_at: isoDateTime.nullable(),
  contact_email: z.string(),
  contact_phone: z.string(),
  members: z.array(
    z.object({
      membership_id: uuid,
      workspace_kind: z.enum(WORKSPACE_KINDS),
      role: z.enum(MEMBERSHIP_ROLES),
      status: z.enum(['ACTIVE', 'REVOKED']),
      user: z.object({ id: uuid, email: z.string() }),
    }),
  ),
  cases: z.array(
    z.object({
      case_id: uuid,
      kind: z.enum(['INITIAL', 'RENEWAL']),
      state: verificationState,
      submitted_at: isoDateTime.nullable(),
    }),
  ),
});

export const adminUsersQuery = z.object({
  q: z.string().trim().max(100).optional(),
  account_type: z.enum(['COMPANY', 'PLATFORM_ADMIN']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().max(200).optional(),
});

export const adminUserItem = z.object({
  id: uuid,
  email: z.string(),
  full_name: z.string().nullable(),
  account_type: z.enum(['COMPANY', 'PLATFORM_ADMIN']),
  status: z.enum(['ACTIVE', 'DISABLED']),
  email_verified: z.boolean(),
  active_sessions: z.number().int(),
  memberships: z.number().int(),
  created_at: isoDateTime,
});

export const auditQuery = z.object({
  action: z.string().trim().max(80).optional(),
  resource_type: z.string().trim().max(80).optional(),
  resource_id: z.string().trim().max(80).optional(),
  actor_id: uuid.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  cursor: z.string().max(200).optional(),
});

export const auditItem = z.object({
  id: uuid,
  actor_id: uuid.nullable(),
  actor_email: z.string().nullable(),
  actor_type: z.string(),
  action: z.string(),
  resource_type: z.string(),
  resource_id: z.string().nullable(),
  company_id: uuid.nullable(),
  reason: z.string().nullable(),
  details: z.record(z.string(), z.unknown()).nullable(),
  request_id: z.string().nullable(),
  ip: z.string().nullable(),
  created_at: isoDateTime,
});

export const staffItem = z.object({
  id: uuid,
  email: z.string(),
  full_name: z.string().nullable(),
  roles: z.array(z.enum(ADMIN_ROLES)),
  mfa_enabled: z.boolean(),
  status: z.enum(['ACTIVE', 'DISABLED']),
});
export const staffRolesRequest = z.object({
  roles: z.array(z.enum(ADMIN_ROLES)).refine((r) => new Set(r).size === r.length, 'duplicate'),
  reason: z.string().trim().min(5).max(2000),
});

export const adminOverviewResponse = z.object({
  verification: z.object({
    submitted: z.number().int(),
    under_review: z.number().int(),
    needs_info: z.number().int(),
  }),
  companies: z.object({
    approved: z.number().int(),
    suspended: z.number().int(),
    draft: z.number().int(),
    licence_expiring_30d: z.number().int(),
  }),
  users: z.object({ company_users: z.number().int(), unverified_email: z.number().int() }),
  generated_at: isoDateTime,
});
