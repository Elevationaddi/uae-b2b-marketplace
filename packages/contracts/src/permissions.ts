/**
 * Role and permission matrix (docs/10-security.md, approved in full by A04).
 * Single source of truth for API enforcement and UI capability display.
 * The server always re-checks; the client only uses this to hide unavailable actions.
 */
export const WORKSPACE_KINDS = ['BUYER', 'SELLER'] as const;
export type WorkspaceKind = (typeof WORKSPACE_KINDS)[number];

export const BUYER_ROLES = ['OWNER', 'PROCUREMENT', 'VIEWER'] as const;
export const SELLER_ROLES = ['OWNER', 'SALES', 'WAREHOUSE', 'FINANCE', 'VIEWER'] as const;
export const MEMBERSHIP_ROLES = [
  'OWNER',
  'PROCUREMENT',
  'VIEWER',
  'SALES',
  'WAREHOUSE',
  'FINANCE',
] as const;
export type MembershipRole = (typeof MEMBERSHIP_ROLES)[number];

export const ADMIN_ROLES = [
  'COMPLIANCE',
  'SUPPORT',
  'FINANCE',
  'FINANCE_APPROVER',
  'SUPER_ADMIN',
] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const CAPABILITIES = [
  'marketplace.browse',
  'buyer.purchase', // RFQ, cart, pay
  'buyer.orders.read',
  'buyer.orders.act', // receipt, dispute, review
  'seller.catalog.read', // view own listings, storefront, inventory (read-only roles included)
  'seller.catalog.edit', // catalog, storefront, pricing and quotes
  'seller.inventory.ship',
  'seller.orders.read',
  'seller.finance',
  'company.manage', // team, legal details, verification
  'messaging',
  'legal_documents.read', // download licence / representative evidence
] as const;
export type Capability = (typeof CAPABILITIES)[number];

const MATRIX: Record<WorkspaceKind, Partial<Record<MembershipRole, readonly Capability[]>>> = {
  BUYER: {
    OWNER: [
      'marketplace.browse',
      'buyer.purchase',
      'buyer.orders.read',
      'buyer.orders.act',
      'company.manage',
      'messaging',
      'legal_documents.read',
    ],
    PROCUREMENT: [
      'marketplace.browse',
      'buyer.purchase',
      'buyer.orders.read',
      'buyer.orders.act',
      'messaging',
    ],
    VIEWER: ['marketplace.browse', 'buyer.orders.read'],
  },
  SELLER: {
    OWNER: [
      'seller.catalog.read',
      'seller.catalog.edit',
      'seller.inventory.ship',
      'seller.orders.read',
      'seller.finance',
      'company.manage',
      'messaging',
      'legal_documents.read',
    ],
    SALES: ['seller.catalog.read', 'seller.catalog.edit', 'seller.orders.read', 'messaging'],
    WAREHOUSE: ['seller.catalog.read', 'seller.inventory.ship', 'seller.orders.read'],
    FINANCE: ['seller.catalog.read', 'seller.orders.read', 'seller.finance'],
    VIEWER: ['seller.catalog.read', 'seller.orders.read'],
  },
};

/**
 * Marketplace access by viewer tier (A12), enforced server-side:
 * - guest: approved public listings and storefronts, no wholesale prices;
 * - verified (email-verified signed-in user): wholesale prices, saved items, comparison, history;
 * - trading (approved ACTIVE buyer workspace with buyer.purchase): RFQ, cart, checkout (Phases 3–4).
 */
export const VIEWER_TIERS = ['guest', 'verified'] as const;
export type ViewerTier = (typeof VIEWER_TIERS)[number];

/** Capabilities that additionally require an ACTIVE workspace of an APPROVED company (A08). */
export const TRADING_CAPABILITIES: readonly Capability[] = [
  'marketplace.browse',
  'buyer.purchase',
  'buyer.orders.act',
  'seller.catalog.edit',
  'seller.inventory.ship',
  'messaging',
];

export function isRoleAllowedForKind(kind: WorkspaceKind, role: MembershipRole): boolean {
  return MATRIX[kind][role] !== undefined;
}

export function rolesForKind(kind: WorkspaceKind): readonly MembershipRole[] {
  return kind === 'BUYER' ? BUYER_ROLES : SELLER_ROLES;
}

/** Capabilities granted by role alone (before workspace/company status is considered). */
export function roleCapabilities(kind: WorkspaceKind, role: MembershipRole): readonly Capability[] {
  return MATRIX[kind][role] ?? [];
}

/**
 * Effective capabilities: role grants, minus trading capabilities when the workspace is
 * not ACTIVE (pending verification, suspended or licence expired).
 */
export function effectiveCapabilities(
  kind: WorkspaceKind,
  role: MembershipRole,
  workspaceActive: boolean,
): Capability[] {
  return roleCapabilities(kind, role).filter(
    (c) => workspaceActive || !TRADING_CAPABILITIES.includes(c),
  );
}

export function hasCapability(
  kind: WorkspaceKind,
  role: MembershipRole,
  workspaceActive: boolean,
  capability: Capability,
): boolean {
  return effectiveCapabilities(kind, role, workspaceActive).includes(capability);
}

/** Admin capabilities by role (docs/04-admin.md, docs/10-security.md). */
export const ADMIN_CAPABILITIES = [
  'admin.verification.review',
  'admin.companies.read',
  'admin.companies.suspend',
  'admin.users.read',
  'admin.users.revoke_sessions',
  'admin.audit.read',
  'admin.staff.manage',
  'admin.catalog.read',
  'admin.catalog.review',
  'admin.catalog.enforce',
  'admin.categories.manage',
  'admin.restricted.manage',
  'admin.featured.manage',
  'admin.rfqs.read',
  'admin.rfqs.moderate',
  /** Phase 4: order details (support cases) and read-only payments, ledger and reconciliation. */
  'admin.orders.read',
  'admin.finance.read',
  /** Phase 5: disputes (support), refunds and payouts with dual control, review moderation. */
  'admin.disputes.read',
  'admin.disputes.manage',
  'admin.refunds.request',
  'admin.refunds.approve',
  'admin.payouts.request',
  'admin.payouts.approve',
  'admin.reviews.moderate',
  /** Phase 6: support tickets and scoped CSV report exports. */
  'admin.support.read',
  'admin.support.manage',
  'admin.reports.export',
] as const;
export type AdminCapability = (typeof ADMIN_CAPABILITIES)[number];

const ADMIN_MATRIX: Record<AdminRole, readonly AdminCapability[]> = {
  COMPLIANCE: [
    'admin.verification.review',
    'admin.companies.read',
    'admin.companies.suspend',
    'admin.users.read',
    'admin.users.revoke_sessions',
    'admin.audit.read',
    'admin.catalog.read',
    'admin.catalog.review',
    'admin.catalog.enforce',
    'admin.categories.manage',
    'admin.restricted.manage',
    'admin.featured.manage',
    'admin.rfqs.read',
    'admin.rfqs.moderate',
    'admin.reviews.moderate',
  ],
  SUPPORT: [
    'admin.companies.read',
    'admin.users.read',
    'admin.catalog.read',
    'admin.rfqs.read',
    'admin.orders.read',
    'admin.disputes.read',
    'admin.disputes.manage',
    'admin.support.read',
    'admin.support.manage',
    'admin.reports.export',
  ],
  FINANCE: [
    'admin.companies.read',
    'admin.orders.read',
    'admin.finance.read',
    'admin.disputes.read',
    'admin.refunds.request',
    'admin.payouts.request',
    'admin.reports.export',
  ],
  // Independent approver (dual control): never the requester of the same refund or payout.
  FINANCE_APPROVER: [
    'admin.companies.read',
    'admin.orders.read',
    'admin.finance.read',
    'admin.disputes.read',
    'admin.refunds.approve',
    'admin.payouts.approve',
    'admin.reports.export',
  ],
  // Super-admin manages roles/config/system; no implicit compliance or financial approval.
  SUPER_ADMIN: [
    'admin.companies.read',
    'admin.users.read',
    'admin.users.revoke_sessions',
    'admin.audit.read',
    'admin.staff.manage',
    'admin.catalog.read',
    'admin.categories.manage',
    'admin.featured.manage',
    'admin.rfqs.read',
  ],
};

export function adminCapabilities(roles: readonly AdminRole[]): AdminCapability[] {
  return [...new Set(roles.flatMap((r) => ADMIN_MATRIX[r]))].sort();
}
