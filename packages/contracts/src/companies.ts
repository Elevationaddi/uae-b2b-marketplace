import { z } from 'zod';
import { companyStatus, workspaceStatus } from './auth';
import { email, emirate, isoDate, isoDateTime, phone, uuid } from './common';
import { WORKSPACE_KINDS } from './permissions';

const companyFields = {
  legal_name: z.string().trim().min(2, 'min').max(200, 'max'),
  display_name: z.string().trim().min(2, 'min').max(120, 'max'),
  licence_number: z.string().trim().min(3, 'min').max(60, 'max'),
  licence_issuer: z.string().trim().min(2, 'min').max(120, 'max'),
  licence_expiry: isoDate,
  activity: z.string().trim().min(2, 'min').max(200, 'max'),
  emirate,
  /** UAE Tax Registration Number: 15 digits. Optional. */
  trn: z
    .string()
    .trim()
    .regex(/^\d{15}$/, 'trn')
    .nullish()
    .or(z.literal('').transform(() => null)),
  contact_email: email,
  contact_phone: phone,
};

export const companyCreateRequest = z.object({
  ...companyFields,
  kinds: z
    .array(z.enum(WORKSPACE_KINDS))
    .min(1, 'min')
    .refine((k) => new Set(k).size === k.length, 'duplicate'),
});

export const companyUpdateRequest = z
  .object({
    legal_name: companyFields.legal_name.optional(),
    display_name: companyFields.display_name.optional(),
    licence_number: companyFields.licence_number.optional(),
    licence_issuer: companyFields.licence_issuer.optional(),
    licence_expiry: companyFields.licence_expiry.optional(),
    activity: companyFields.activity.optional(),
    emirate: companyFields.emirate.optional(),
    trn: companyFields.trn.optional(),
    contact_email: companyFields.contact_email.optional(),
    contact_phone: companyFields.contact_phone.optional(),
    expected_version: z.number().int().positive(),
  })
  .strict();

export const companyResponse = z.object({
  id: uuid,
  legal_name: z.string(),
  display_name: z.string(),
  licence_number: z.string(),
  licence_issuer: z.string(),
  licence_expiry: isoDate,
  licence_expired: z.boolean(),
  activity: z.string(),
  emirate,
  trn: z.string().nullable(),
  contact_email: z.string(),
  contact_phone: z.string(),
  status: companyStatus,
  version: z.number().int(),
  editable: z.boolean(),
  workspaces: z.array(
    z.object({ id: uuid, kind: z.enum(WORKSPACE_KINDS), status: workspaceStatus }),
  ),
  created_at: isoDateTime,
});
export type CompanyResponse = z.infer<typeof companyResponse>;

export const DOCUMENT_TYPES = ['TRADE_LICENCE', 'AUTHORIZED_REPRESENTATIVE', 'OTHER'] as const;
export const documentType = z.enum(DOCUMENT_TYPES);
export const scanState = z.enum(['PENDING', 'CLEAN', 'INFECTED']);
export const ALLOWED_UPLOAD_MIME = ['application/pdf', 'image/png', 'image/jpeg'] as const;

/** Multipart form fields accompanying the file part named "file". */
export const documentUploadFields = z.object({
  type: documentType,
  expires_at: isoDate.optional().or(z.literal('').transform(() => undefined)),
});

export const fileSummary = z.object({
  id: uuid,
  original_name: z.string(),
  mime: z.string(),
  bytes: z.number().int(),
  scan_state: scanState,
});

export const verificationDocument = z.object({
  id: uuid,
  type: documentType,
  expires_at: isoDate.nullable(),
  file: fileSummary,
  created_at: isoDateTime,
});

export const VERIFICATION_STATES = [
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'NEEDS_INFO',
  'REJECTED',
  'APPROVED',
  'CLOSED',
] as const;
export const verificationState = z.enum(VERIFICATION_STATES);

export const verificationEvent = z.object({
  from_state: verificationState.nullable(),
  to_state: verificationState,
  reason: z.string().nullable(),
  actor: z.enum(['company', 'admin', 'system']),
  created_at: isoDateTime,
});

export const renewalProposal = z.object({
  licence_number: z.string(),
  licence_issuer: z.string(),
  licence_expiry: isoDate,
});

export const verificationCaseResponse = z.object({
  id: uuid,
  kind: z.enum(['INITIAL', 'RENEWAL']),
  state: verificationState,
  editable: z.boolean(),
  submitted_at: isoDateTime.nullable(),
  decided_at: isoDateTime.nullable(),
  reason: z.string().nullable(),
  proposed: renewalProposal.nullable(),
  documents: z.array(verificationDocument),
  events: z.array(verificationEvent),
});
export type VerificationCaseResponse = z.infer<typeof verificationCaseResponse>;

export const verificationOverviewResponse = z.object({
  current: verificationCaseResponse.nullable(),
  history: z.array(verificationCaseResponse),
});

export const submitVerificationRequest = z.object({
  terms_version: z.string().trim().min(1).max(20),
  expected_version: z.number().int().positive(),
});

export const renewalRequest = z.object({
  licence_number: companyFields.licence_number,
  licence_issuer: companyFields.licence_issuer,
  licence_expiry: isoDate,
});

/** Current terms version shown at submission. Legal text itself is pending legal review (D15). */
export const CURRENT_TERMS_VERSION = 'dev-1';
