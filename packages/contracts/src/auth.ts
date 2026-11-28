import { z } from 'zod';
import { email, isoDateTime, locale, password, uuid } from './common';
import { CAPABILITIES, MEMBERSHIP_ROLES, WORKSPACE_KINDS } from './permissions';

export const registerRequest = z.object({
  email,
  password,
  full_name: z.string().trim().min(1, 'required').max(120, 'max'),
  locale: locale.default('en'),
});
export const loginRequest = z.object({ email, password: z.string().min(1, 'required').max(128) });
export const tokenRequest = z.object({ token: z.string().min(20).max(200) });
export const emailRequest = z.object({ email });
export const passwordResetConfirmRequest = z.object({
  token: z.string().min(20).max(200),
  new_password: password,
});
export const passwordChangeRequest = z.object({
  current_password: z.string().min(1, 'required').max(128),
  new_password: password,
});
export const updateProfileRequest = z
  .object({ full_name: z.string().trim().min(1).max(120).optional(), locale: locale.optional() })
  .refine((v) => v.full_name !== undefined || v.locale !== undefined, 'empty');

/** Generic acknowledgement used where responses must not reveal whether an account exists. */
export const acceptedResponse = z.object({ accepted: z.literal(true) });

export const COMPANY_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'NEEDS_INFO',
  'REJECTED',
  'APPROVED',
  'SUSPENDED',
] as const;
export const companyStatus = z.enum(COMPANY_STATUSES);
export const workspaceStatus = z.enum(['PENDING', 'ACTIVE', 'RESTRICTED']);

export const meWorkspace = z.object({
  id: uuid,
  kind: z.enum(WORKSPACE_KINDS),
  status: workspaceStatus,
  role: z.enum(MEMBERSHIP_ROLES),
  company: z.object({ id: uuid, display_name: z.string(), status: companyStatus }),
  capabilities: z.array(z.enum(CAPABILITIES)),
});

export const meResponse = z.object({
  user: z.object({
    id: uuid,
    email: z.string(),
    full_name: z.string().nullable(),
    locale,
    email_verified: z.boolean(),
  }),
  workspaces: z.array(meWorkspace),
  /** Companies the user created that have no workspace membership issue; drives onboarding. */
  can_create_company: z.boolean(),
});
export type MeResponse = z.infer<typeof meResponse>;

export const sessionItem = z.object({
  id: uuid,
  current: z.boolean(),
  created_at: isoDateTime,
  last_seen_at: isoDateTime,
  expires_at: isoDateTime,
  ip: z.string().nullable(),
  user_agent: z.string().nullable(),
});

export const csrfResponse = z.object({ csrf_token: z.string() });
export const publicConfigResponse = z.object({
  app_name: z.string(),
  sandbox: z.boolean(),
  upload_max_bytes: z.number().int(),
  /** Protected staging profile: fictional data only, registration limited to these domains. */
  staging: z.boolean(),
  staging_email_domains: z.array(z.string()),
});

/** Staging mail catcher (C-20). */
export const stagingMailboxQuery = z.object({
  to: z.string().trim().max(200).optional(),
  cursor: z.string().max(200).optional(),
});
export const caughtEmailItem = z.object({
  id: z.string(),
  to: z.string(),
  subject: z.string(),
  body: z.string(),
  template: z.string(),
  locale: z.string(),
  created_at: z.string(),
});
export type CaughtEmailItem = z.infer<typeof caughtEmailItem>;
