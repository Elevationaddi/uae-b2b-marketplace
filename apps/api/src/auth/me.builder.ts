import {
  effectiveCapabilities,
  type MeResponse,
  type MembershipRole,
  type WorkspaceKind,
} from '@app/contracts';
import type { PrismaClient, User } from '@app/db';

export async function buildMe(prisma: PrismaClient, user: User): Promise<MeResponse> {
  const memberships = await prisma.membership.findMany({
    where: { userId: user.id, status: 'ACTIVE' },
    include: { workspace: { include: { company: true } } },
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
  });
  return {
    user: {
      id: user.id,
      email: user.email,
      full_name: user.fullName,
      locale: user.locale,
      email_verified: user.emailVerifiedAt !== null,
    },
    workspaces: memberships.map((m) => ({
      id: m.workspace.id,
      kind: m.workspace.kind,
      status: m.workspace.status,
      role: m.role,
      company: {
        id: m.workspace.company.id,
        display_name: m.workspace.company.displayName,
        status: m.workspace.company.status,
      },
      capabilities: effectiveCapabilities(
        m.workspace.kind as WorkspaceKind,
        m.role as MembershipRole,
        m.workspace.status === 'ACTIVE' && m.workspace.company.status === 'APPROVED',
      ),
    })),
    can_create_company: user.emailVerifiedAt !== null,
  };
}
