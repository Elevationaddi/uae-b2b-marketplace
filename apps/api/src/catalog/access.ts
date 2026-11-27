import { hasCapability, TRADING_CAPABILITIES, type Capability } from '@app/contracts';
import { isLicenceExpired, type Company, type Membership, type PrismaClient, type Workspace } from '@app/db';
import { ApiError } from '../common/api-error';

export interface SellerContext {
  membership: Membership;
  workspace: Workspace;
  company: Company;
  /** ACTIVE seller workspace of an APPROVED company with an unexpired licence (A08, A10). */
  eligible: boolean;
  ineligibleReason: string | null;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function assertUuid(id: string): void {
  if (!UUID.test(id)) throw new ApiError('NOT_FOUND', 'common.not_found');
}

export function sellerEligibility(
  workspace: Workspace,
  company: Company,
): { eligible: boolean; reason: string | null } {
  if (company.status === 'SUSPENDED')
    return {
      eligible: false,
      reason:
        company.suspensionKind === 'LICENCE_EXPIRED'
          ? 'catalog.licence_expired'
          : 'catalog.company_suspended',
    };
  if (company.status !== 'APPROVED') return { eligible: false, reason: 'catalog.company_not_approved' };
  if (isLicenceExpired(company.licenceExpiry))
    return { eligible: false, reason: 'catalog.licence_expired' };
  if (workspace.status !== 'ACTIVE') return { eligible: false, reason: 'catalog.workspace_inactive' };
  return { eligible: true, reason: null };
}

/**
 * Resolve the caller's ACTIVE membership in a SELLER workspace. Anything else (other tenant,
 * buyer workspace, revoked membership, malformed id) is 404: existence is never revealed.
 */
export async function loadSellerContext(
  prisma: PrismaClient,
  userId: string,
  workspaceId: string,
): Promise<SellerContext> {
  assertUuid(workspaceId);
  const m = await prisma.membership.findFirst({
    where: { userId, workspaceId, status: 'ACTIVE', workspace: { kind: 'SELLER' } },
    include: { workspace: { include: { company: true } } },
  });
  if (!m) throw new ApiError('NOT_FOUND', 'common.not_found');
  const { company, ...workspace } = m.workspace;
  const e = sellerEligibility(workspace, company);
  return { membership: m, workspace, company, eligible: e.eligible, ineligibleReason: e.reason };
}

export function sellerCan(ctx: SellerContext, cap: Capability): boolean {
  return hasCapability('SELLER', ctx.membership.role, ctx.eligible, cap);
}

/**
 * Role check first (403 common.forbidden), then trading eligibility for trading capabilities
 * (403 with the specific reason, e.g. catalog.licence_expired) so the UI can explain it.
 */
export function requireSeller(ctx: SellerContext, cap: Capability): void {
  if (!hasCapability('SELLER', ctx.membership.role, true, cap))
    throw new ApiError('FORBIDDEN', 'common.forbidden');
  if (TRADING_CAPABILITIES.includes(cap) && !ctx.eligible)
    throw new ApiError('FORBIDDEN', ctx.ineligibleReason ?? 'catalog.seller_not_eligible');
}

/** Opaque offset cursor for multi-sort listings (stable tie-breaker on id). Capped depth. */
export function encodeOffset(offset: number): string {
  return Buffer.from(JSON.stringify({ o: offset })).toString('base64url');
}
export function decodeOffset(cursor: string | undefined): number {
  if (!cursor) return 0;
  try {
    const v = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')) as { o?: unknown };
    if (typeof v.o === 'number' && Number.isInteger(v.o) && v.o >= 0 && v.o <= 5000) return v.o;
  } catch {
    /* fall through */
  }
  throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', { cursor: 'invalid' });
}

/** Escape LIKE wildcards in user input. */
export function likeEscape(s: string): string {
  return s.replace(/[\\%_]/g, (m) => `\\${m}`);
}

export function searchTokens(q: string | undefined): string[] {
  if (!q) return [];
  return q
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .slice(0, 6)
    .map((t) => likeEscape(t.slice(0, 40)));
}
