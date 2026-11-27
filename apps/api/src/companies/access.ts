import {
  hasCapability,
  type Capability,
  type MembershipRole,
  type WorkspaceKind,
} from '@app/contracts';
import type { Company, Membership, PrismaClient, Workspace } from '@app/db';
import { ApiError } from '../common/api-error';

export type MembershipWithWorkspace = Membership & { workspace: Workspace & { company: Company } };

/**
 * Loads the caller's ACTIVE memberships in the company's workspaces.
 * No membership -> 404 (never reveal that another tenant's company exists).
 */
export async function loadCompanyAccess(
  prisma: PrismaClient,
  userId: string,
  companyId: string,
): Promise<MembershipWithWorkspace[]> {
  if (!/^[0-9a-f-]{36}$/i.test(companyId)) throw new ApiError('NOT_FOUND', 'common.not_found');
  const memberships = await prisma.membership.findMany({
    where: { userId, status: 'ACTIVE', workspace: { companyId } },
    include: { workspace: { include: { company: true } } },
  });
  if (memberships.length === 0) throw new ApiError('NOT_FOUND', 'common.not_found');
  return memberships;
}

/** True when any of the caller's memberships in the company grants the capability. */
export function anyCapability(memberships: MembershipWithWorkspace[], cap: Capability): boolean {
  return memberships.some((m) =>
    hasCapability(
      m.workspace.kind as WorkspaceKind,
      m.role as MembershipRole,
      m.workspace.status === 'ACTIVE' && m.workspace.company.status === 'APPROVED',
      cap,
    ),
  );
}

export function requireCapability(memberships: MembershipWithWorkspace[], cap: Capability): void {
  if (!anyCapability(memberships, cap)) throw new ApiError('FORBIDDEN', 'common.forbidden');
}
