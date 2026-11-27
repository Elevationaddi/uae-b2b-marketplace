import { describe, expect, it } from 'vitest';
import {
  adminCapabilities,
  effectiveCapabilities,
  hasCapability,
  isRoleAllowedForKind,
  roleCapabilities,
} from './permissions';

describe('workspace permission matrix (docs/10-security.md)', () => {
  it.each([
    // [kind, role, capability, expected] for an ACTIVE workspace
    ['BUYER', 'OWNER', 'buyer.purchase', true],
    ['BUYER', 'PROCUREMENT', 'buyer.purchase', true],
    ['BUYER', 'VIEWER', 'buyer.purchase', false],
    ['BUYER', 'VIEWER', 'marketplace.browse', true],
    ['BUYER', 'VIEWER', 'buyer.orders.read', true],
    ['BUYER', 'VIEWER', 'buyer.orders.act', false],
    ['BUYER', 'PROCUREMENT', 'company.manage', false],
    ['BUYER', 'OWNER', 'company.manage', true],
    ['BUYER', 'VIEWER', 'messaging', false],
    ['SELLER', 'OWNER', 'seller.finance', true],
    ['SELLER', 'SALES', 'seller.catalog.edit', true],
    ['SELLER', 'SALES', 'seller.inventory.ship', false],
    ['SELLER', 'WAREHOUSE', 'seller.inventory.ship', true],
    ['SELLER', 'WAREHOUSE', 'seller.catalog.edit', false],
    ['SELLER', 'FINANCE', 'seller.finance', true],
    ['SELLER', 'FINANCE', 'messaging', false],
    ['SELLER', 'VIEWER', 'seller.orders.read', true],
    ['SELLER', 'VIEWER', 'seller.catalog.edit', false],
    ['SELLER', 'SALES', 'messaging', true],
    ['SELLER', 'WAREHOUSE', 'messaging', false],
    ['SELLER', 'OWNER', 'marketplace.browse', false],
  ] as const)('%s %s %s -> %s', (kind, role, cap, expected) => {
    expect(hasCapability(kind, role, true, cap)).toBe(expected);
  });

  it('viewers cannot download legal documents', () => {
    expect(roleCapabilities('BUYER', 'VIEWER')).not.toContain('legal_documents.read');
    expect(roleCapabilities('SELLER', 'VIEWER')).not.toContain('legal_documents.read');
  });

  it('rejects roles that do not belong to the workspace kind', () => {
    expect(isRoleAllowedForKind('BUYER', 'WAREHOUSE')).toBe(false);
    expect(isRoleAllowedForKind('SELLER', 'PROCUREMENT')).toBe(false);
    expect(isRoleAllowedForKind('SELLER', 'FINANCE')).toBe(true);
  });

  it('removes trading capabilities until the workspace is active (A08)', () => {
    const pending = effectiveCapabilities('BUYER', 'OWNER', false);
    expect(pending).not.toContain('buyer.purchase');
    expect(pending).not.toContain('marketplace.browse');
    expect(pending).toContain('company.manage');
    expect(pending).toContain('buyer.orders.read');
  });
});

describe('admin permission matrix', () => {
  it('only compliance reviews verification; super-admin has no implicit approval', () => {
    expect(adminCapabilities(['COMPLIANCE'])).toContain('admin.verification.review');
    expect(adminCapabilities(['SUPER_ADMIN'])).not.toContain('admin.verification.review');
    expect(adminCapabilities(['SUPPORT'])).not.toContain('admin.companies.suspend');
    expect(adminCapabilities(['SUPER_ADMIN'])).toContain('admin.staff.manage');
  });
});
