import { z } from 'zod';
import { companyStatus } from './auth';
import { email, isoDateTime, uuid } from './common';
import { MEMBERSHIP_ROLES, WORKSPACE_KINDS } from './permissions';

export const memberItem = z.object({
  membership_id: uuid,
  user: z.object({ id: uuid, email: z.string(), full_name: z.string().nullable() }),
  role: z.enum(MEMBERSHIP_ROLES),
  status: z.enum(['ACTIVE', 'REVOKED']),
  is_self: z.boolean(),
  created_at: isoDateTime,
});

export const invitationCreateRequest = z.object({ email, role: z.enum(MEMBERSHIP_ROLES) });

export const invitationItem = z.object({
  id: uuid,
  email: z.string(),
  role: z.enum(MEMBERSHIP_ROLES),
  state: z.enum(['PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED']),
  expires_at: isoDateTime,
  created_at: isoDateTime,
});

export const invitationPreviewResponse = z.object({
  company_display_name: z.string(),
  company_status: companyStatus,
  workspace_kind: z.enum(WORKSPACE_KINDS),
  role: z.enum(MEMBERSHIP_ROLES),
  email: z.string(),
  state: z.enum(['PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED']),
});

export const invitationAcceptResponse = z.object({ workspace_id: uuid, membership_id: uuid });

export const membershipUpdateRequest = z
  .object({
    role: z.enum(MEMBERSHIP_ROLES).optional(),
    status: z.enum(['ACTIVE', 'REVOKED']).optional(),
  })
  .refine((v) => v.role !== undefined || v.status !== undefined, 'empty');
