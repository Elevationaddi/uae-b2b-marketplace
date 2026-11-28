import type { CompanyResponse, VerificationCaseResponse } from '@app/contracts';
import {
  isLicenceExpired,
  toIsoDate,
  type Company,
  type File,
  type VerificationCase,
  type VerificationCaseEvent,
  type VerificationDocument,
  type Workspace,
} from '@app/db';

export const EDITABLE_CASE_STATES = ['DRAFT', 'NEEDS_INFO', 'REJECTED'] as const;
export const EDITABLE_COMPANY_STATUSES = ['DRAFT', 'NEEDS_INFO', 'REJECTED'] as const;

export function companyEditable(c: Company): boolean {
  return (EDITABLE_COMPANY_STATUSES as readonly string[]).includes(c.status);
}

export function mapCompany(c: Company & { workspaces: Workspace[] }): CompanyResponse {
  return {
    id: c.id,
    legal_name: c.legalName,
    display_name: c.displayName,
    licence_number: c.licenceNumber,
    licence_issuer: c.licenceIssuer,
    licence_expiry: toIsoDate(c.licenceExpiry),
    licence_expired: isLicenceExpired(c.licenceExpiry),
    activity: c.activity,
    emirate: c.emirate,
    trn: c.trn,
    vat_status: c.vatStatus,
    vat_status_confirmed_at: c.vatStatusConfirmedAt?.toISOString() ?? null,
    contact_email: c.contactEmail,
    contact_phone: c.contactPhone,
    status: c.status,
    version: c.version,
    editable: companyEditable(c),
    workspaces: [...c.workspaces]
      .sort((a, b) => a.kind.localeCompare(b.kind))
      .map((w) => ({ id: w.id, kind: w.kind, status: w.status })),
    created_at: c.createdAt.toISOString(),
  };
}

type DocWithFile = VerificationDocument & { file: File };

export function mapDocument(d: DocWithFile) {
  return {
    id: d.id,
    type: d.type,
    expires_at: d.expiresAt ? toIsoDate(d.expiresAt) : null,
    file: {
      id: d.file.id,
      original_name: d.file.originalName,
      mime: d.file.mime,
      bytes: d.file.bytes,
      scan_state: d.file.scanState,
    },
    created_at: d.createdAt.toISOString(),
  };
}

export function mapEvent(e: VerificationCaseEvent, adminIds: Set<string>) {
  return {
    from_state: e.fromState,
    to_state: e.toState,
    reason: e.reason,
    actor:
      e.actorId === null
        ? ('system' as const)
        : adminIds.has(e.actorId)
          ? ('admin' as const)
          : ('company' as const),
    created_at: e.createdAt.toISOString(),
  };
}

export function mapProposal(p: unknown): VerificationCaseResponse['proposed'] {
  if (!p || typeof p !== 'object') return null;
  const o = p as Record<string, string>;
  if (!o.licence_number || !o.licence_issuer || !o.licence_expiry) return null;
  return {
    licence_number: o.licence_number,
    licence_issuer: o.licence_issuer,
    licence_expiry: o.licence_expiry,
  };
}

export function mapCase(
  c: VerificationCase & { documents: DocWithFile[]; events: VerificationCaseEvent[] },
  adminIds: Set<string>,
): VerificationCaseResponse {
  return {
    id: c.id,
    kind: c.kind,
    state: c.state,
    editable: (EDITABLE_CASE_STATES as readonly string[]).includes(c.state),
    submitted_at: c.submittedAt?.toISOString() ?? null,
    decided_at: c.decidedAt?.toISOString() ?? null,
    reason: c.reason,
    proposed: mapProposal(c.proposed),
    documents: [...c.documents]
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .map(mapDocument),
    events: [...c.events]
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .map((e) => mapEvent(e, adminIds)),
  };
}

export const CASE_INCLUDE = {
  documents: { include: { file: true } },
  events: true,
} as const;

/** Ids of platform admins among event actors, so the timeline can label actors without exposing identities. */
export async function adminActorIds(
  prisma: { user: { findMany: (a: object) => Promise<{ id: string }[]> } },
  events: { actorId: string | null }[],
): Promise<Set<string>> {
  const ids = [...new Set(events.map((e) => e.actorId).filter((x): x is string => !!x))];
  if (ids.length === 0) return new Set();
  const admins = await prisma.user.findMany({
    where: { id: { in: ids }, accountType: 'PLATFORM_ADMIN' },
    select: { id: true },
  });
  return new Set(admins.map((a) => a.id));
}
