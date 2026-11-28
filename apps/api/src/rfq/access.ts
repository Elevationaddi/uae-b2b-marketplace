import { hasCapability, TRADING_CAPABILITIES, type Capability } from '@app/contracts';
import type { Company, Membership, PrismaClient, Workspace } from '@app/db';
import { assertUuid, sellerEligibility } from '../catalog/access';
import { ApiError } from '../common/api-error';

export interface WorkspaceContext {
  membership: Membership;
  workspace: Workspace;
  company: Company;
  /** ACTIVE workspace of an APPROVED company with an unexpired licence (A08). */
  eligible: boolean;
  ineligibleReason: string | null;
}

/**
 * Resolve the caller's ACTIVE membership in a workspace of the given kind. Anything else (other
 * tenant, other kind, revoked membership, malformed id) is 404: existence is never revealed.
 */
export async function loadWorkspaceContext(
  prisma: PrismaClient,
  userId: string,
  workspaceId: string,
  kind?: 'BUYER' | 'SELLER',
): Promise<WorkspaceContext> {
  assertUuid(workspaceId);
  const m = await prisma.membership.findFirst({
    where: { userId, workspaceId, status: 'ACTIVE', ...(kind ? { workspace: { kind } } : {}) },
    include: { workspace: { include: { company: true } } },
  });
  if (!m) throw new ApiError('NOT_FOUND', 'common.not_found');
  const { company, ...workspace } = m.workspace;
  const e = sellerEligibility(workspace, company);
  return {
    membership: m,
    workspace,
    company,
    eligible: e.eligible,
    ineligibleReason: e.reason ? e.reason.replace(/^catalog\./, 'trading.') : null,
  };
}

export function can(ctx: WorkspaceContext, cap: Capability): boolean {
  return hasCapability(ctx.workspace.kind, ctx.membership.role, ctx.eligible, cap);
}

/**
 * Role first (403 common.forbidden), then trading eligibility for trading capabilities (403 with
 * the specific reason, e.g. trading.licence_expired) so the UI can explain why.
 */
export function requireCap(ctx: WorkspaceContext, cap: Capability): void {
  if (!hasCapability(ctx.workspace.kind, ctx.membership.role, true, cap))
    throw new ApiError('FORBIDDEN', 'common.forbidden');
  if (TRADING_CAPABILITIES.includes(cap) && !ctx.eligible)
    throw new ApiError('FORBIDDEN', ctx.ineligibleReason ?? 'trading.not_eligible');
}

/** Roles in a workspace that act on RFQs/quotes (receive their notifications). */
export const BUYER_ACTING_ROLES = ['OWNER', 'PROCUREMENT'] as const;
export const SELLER_ACTING_ROLES = ['OWNER', 'SALES'] as const;
