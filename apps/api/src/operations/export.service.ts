import { Inject, Injectable } from '@nestjs/common';
import {
  OPERATIONS_LIMITS,
  adminCapabilities,
  type AdminRole,
  type ExportItem,
  type exportCreateRequest,
  type ReportType,
} from '@app/contracts';
import { writeAudit, type ExportJob, type PrismaClient, type User } from '@app/db';
import { createHash } from 'node:crypto';
import type { z } from 'zod';
import { assertUuid, decodeOffset, encodeOffset } from '../catalog/access';
import { ApiError } from '../common/api-error';
import type { RequestMeta } from '../common/request-context';
import { companyNames } from '../commerce/commerce-common';
import { MfaService } from '../admin/mfa.service';
import { PRISMA } from '../infra/tokens';
import { dubaiRange, rangeDays } from './overview.service';

type Req = z.infer<typeof exportCreateRequest>;
type Cell = string | number | bigint | boolean | Date | null | undefined;
const PAGE = 20;
const FINANCE_TYPES: ReportType[] = ['orders', 'refunds', 'payouts'];

/**
 * Which admin may export what (docs/04-admin.md, docs/10-security.md, T41). Finance reports need
 * finance read access and cover everything; support may export only the disputes and tickets
 * assigned to them. Nobody exports every support ticket (P6-4).
 */
export function exportAllowed(
  roles: readonly AdminRole[],
  type: ReportType,
  scope: 'assigned' | 'all',
) {
  const caps = new Set(adminCapabilities(roles));
  if (!caps.has('admin.reports.export')) return false;
  if (FINANCE_TYPES.includes(type)) return scope === 'all' && caps.has('admin.finance.read');
  if (type === 'disputes')
    return scope === 'all' ? caps.has('admin.finance.read') : caps.has('admin.disputes.manage');
  return scope === 'assigned' && caps.has('admin.support.manage');
}

/** Integer fils as an AED decimal string, without floating point. */
export function aed(fils: bigint): string {
  const neg = fils < 0n;
  const v = neg ? -fils : fils;
  return `${neg ? '-' : ''}${v / 100n}.${String(v % 100n).padStart(2, '0')}`;
}

/**
 * RFC 4180 CSV cell. Cells a spreadsheet would treat as a formula (=, +, -, @, tab, CR) are
 * prefixed with an apostrophe so exported user text cannot execute (CSV injection). Plain
 * numbers (such as a negative amount) are left as they are.
 */
export function csvCell(v: Cell): string {
  if (v === null || v === undefined) return '';
  let s = v instanceof Date ? v.toISOString() : String(v);
  if (typeof v === 'string' && /^[=+\-@\t\r]/.test(s) && !/^-?\d+(\.\d+)?$/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(header: string[], rows: Cell[][]): Buffer {
  const lines = [header, ...rows].map((r) => r.map(csvCell).join(','));
  // UTF-8 BOM so spreadsheet tools read Arabic company names correctly.
  return Buffer.from(`\uFEFF${lines.join('\r\n')}\r\n`, 'utf8');
}

/**
 * Scoped CSV report exports. Each export needs a stated reason and a fresh TOTP code (step-up),
 * is audited when created, denied or downloaded, is downloadable only by its creator, and its
 * bytes are deleted after 24 hours (the audit row stays).
 */
@Injectable()
export class ExportService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly mfa: MfaService,
  ) {}

  private async auditDenied(admin: User, b: Req, why: string, meta: RequestMeta) {
    await this.prisma.$transaction((tx) =>
      writeAudit(tx, {
        actorId: admin.id,
        actorType: 'admin',
        action: 'export.denied',
        resourceType: 'export',
        resourceId: null,
        reason: b.reason,
        details: { report_type: b.report_type, scope: b.scope, from: b.from, to: b.to, why },
        requestId: meta.requestId,
        ip: meta.ip,
      }),
    );
  }

  async create(
    admin: User,
    roles: readonly AdminRole[],
    b: Req,
    meta: RequestMeta,
  ): Promise<ExportItem> {
    if (!exportAllowed(roles, b.report_type, b.scope)) {
      await this.auditDenied(admin, b, 'scope', meta);
      throw new ApiError('FORBIDDEN', 'export.scope_forbidden');
    }
    if (rangeDays(b.from, b.to) > OPERATIONS_LIMITS.exportMaxDays)
      throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', {
        from: 'range_too_long',
      });
    if (!(await this.mfa.verifyTotp(admin.id, admin.mfaSecretEnc, b.totp_code))) {
      await this.auditDenied(admin, b, 'step_up', meta);
      throw new ApiError('VALIDATION_FAILED', 'admin.mfa_code_invalid', { totp_code: 'invalid' });
    }
    const { header, rows } = await this.build(admin, b);
    if (rows.length > OPERATIONS_LIMITS.exportMaxRows)
      throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', { to: 'too_many_rows' });
    const content = toCsv(header, rows);
    const sha256 = createHash('sha256').update(content).digest('hex');
    const job = await this.prisma.$transaction(async (tx) => {
      const j = await tx.exportJob.create({
        data: {
          requestedById: admin.id,
          reportType: b.report_type,
          scope: b.scope,
          filters: { from: b.from, to: b.to },
          reason: b.reason,
          rowCount: rows.length,
          content: new Uint8Array(content),
          sha256,
          expiresAt: new Date(Date.now() + OPERATIONS_LIMITS.exportTtlHours * 3600_000),
        },
      });
      await writeAudit(tx, {
        actorId: admin.id,
        actorType: 'admin',
        action: 'export.created',
        resourceType: 'export',
        resourceId: j.id,
        reason: b.reason,
        details: {
          report_type: b.report_type,
          scope: b.scope,
          from: b.from,
          to: b.to,
          row_count: rows.length,
          sha256,
        },
        requestId: meta.requestId,
        ip: meta.ip,
      });
      return j;
    });
    return this.item(job);
  }

  async list(admin: User, cursor: string | undefined) {
    const offset = decodeOffset(cursor);
    const rows = await this.prisma.exportJob.findMany({
      where: { requestedById: admin.id },
      omit: { content: true },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: offset,
      take: PAGE + 1,
    });
    return {
      items: rows.slice(0, PAGE).map((j) => this.item(j)),
      next: rows.length > PAGE ? encodeOffset(offset + PAGE) : null,
    };
  }

  async download(admin: User, id: string, meta: RequestMeta) {
    assertUuid(id);
    return this.prisma.$transaction(async (tx) => {
      const j = await tx.exportJob.findFirst({ where: { id, requestedById: admin.id } });
      // Another admin's export does not exist for the caller.
      if (!j) throw new ApiError('NOT_FOUND', 'common.not_found');
      if (j.state !== 'READY' || !j.content || j.expiresAt <= new Date())
        throw new ApiError('CONFLICT', 'export.expired');
      await tx.exportJob.update({ where: { id }, data: { downloadedAt: new Date() } });
      await writeAudit(tx, {
        actorId: admin.id,
        actorType: 'admin',
        action: 'export.downloaded',
        resourceType: 'export',
        resourceId: j.id,
        details: { report_type: j.reportType, sha256: j.sha256 },
        requestId: meta.requestId,
        ip: meta.ip,
      });
      const f = j.filters as { from?: string; to?: string };
      return {
        content: Buffer.from(j.content),
        name: `${j.reportType}_${f.from ?? ''}_${f.to ?? ''}.csv`,
      };
    });
  }

  private item(j: Omit<ExportJob, 'content'>): ExportItem {
    const f = j.filters as { from: string; to: string };
    const expired = j.state !== 'READY' || j.expiresAt <= new Date();
    return {
      id: j.id,
      report_type: j.reportType as ReportType,
      scope: j.scope as 'assigned' | 'all',
      from: f.from,
      to: f.to,
      row_count: j.rowCount,
      state: expired ? 'EXPIRED' : 'READY',
      expires_at: j.expiresAt.toISOString(),
      downloaded_at: j.downloadedAt?.toISOString() ?? null,
      created_at: j.createdAt.toISOString(),
    };
  }

  // ---------------------------------------------------------------- report builders

  private async build(admin: User, b: Req): Promise<{ header: string[]; rows: Cell[][] }> {
    const { start, end } = dubaiRange(b.from, b.to);
    const createdAt = { gte: start, lt: end };
    const take = OPERATIONS_LIMITS.exportMaxRows + 1;
    switch (b.report_type) {
      case 'orders': {
        const rows = await this.prisma.order.findMany({
          where: { createdAt },
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          take,
        });
        const names = await companyNames(
          this.prisma,
          rows.flatMap((o) => [o.buyerCompanyId, o.sellerCompanyId]),
        );
        return {
          header: [
            'order_number',
            'state',
            'created_at_utc',
            'confirmed_at_utc',
            'buyer_company',
            'seller_company',
            'currency',
            'merchandise_aed',
            'shipping_aed',
            'tax_aed',
            'total_aed',
            'commission_aed',
            'seller_payable_aed',
            'refunded_aed',
            'settlement_state',
          ],
          rows: rows.map((o) => [
            o.number,
            o.state,
            o.createdAt,
            o.confirmedAt,
            names.get(o.buyerCompanyId),
            names.get(o.sellerCompanyId),
            'AED',
            aed(o.merchandiseFils),
            aed(o.shippingFils),
            aed(o.taxFils),
            aed(o.totalFils),
            aed(o.commissionFils),
            aed(o.sellerPayableFils),
            aed(o.refundedFils),
            o.settlementState,
          ]),
        };
      }
      case 'refunds': {
        const rows = await this.prisma.refund.findMany({
          where: { createdAt },
          include: { order: { select: { number: true } }, dispute: { select: { number: true } } },
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          take,
        });
        return {
          header: [
            'refund_number',
            'order_number',
            'dispute_number',
            'state',
            'currency',
            'amount_aed',
            'commission_reversed_aed',
            'reason',
            'created_at_utc',
            'completed_at_utc',
            'failure_code',
          ],
          rows: rows.map((r) => [
            r.number,
            r.order.number,
            r.dispute?.number,
            r.state,
            r.currency,
            aed(r.amountFils),
            aed(r.commissionFils),
            r.reason,
            r.createdAt,
            r.completedAt,
            r.failureCode,
          ]),
        };
      }
      case 'payouts': {
        const rows = await this.prisma.payout.findMany({
          where: { createdAt },
          include: { _count: { select: { allocations: true } } },
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          take,
        });
        const names = await companyNames(
          this.prisma,
          rows.map((p) => p.sellerCompanyId),
        );
        return {
          header: [
            'payout_number',
            'seller_company',
            'state',
            'currency',
            'amount_aed',
            'orders',
            'created_at_utc',
            'paid_at_utc',
            'failure_code',
          ],
          rows: rows.map((p) => [
            p.number,
            names.get(p.sellerCompanyId),
            p.state,
            p.currency,
            aed(p.amountFils),
            p._count.allocations,
            p.createdAt,
            p.paidAt,
            p.failureCode,
          ]),
        };
      }
      case 'disputes': {
        const rows = await this.prisma.dispute.findMany({
          where: { createdAt, ...(b.scope === 'assigned' ? { assignedAdminId: admin.id } : {}) },
          include: { order: true },
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          take,
        });
        const names = await companyNames(
          this.prisma,
          rows.flatMap((d) => [d.order.buyerCompanyId, d.order.sellerCompanyId]),
        );
        return {
          header: [
            'dispute_number',
            'order_number',
            'type',
            'state',
            'opened_side',
            'buyer_company',
            'seller_company',
            'assigned',
            'created_at_utc',
            'updated_at_utc',
          ],
          rows: rows.map((d) => [
            d.number,
            d.order.number,
            d.type,
            d.state,
            d.openedSide,
            names.get(d.order.buyerCompanyId),
            names.get(d.order.sellerCompanyId),
            !!d.assignedAdminId,
            d.createdAt,
            d.updatedAt,
          ]),
        };
      }
      case 'support_tickets': {
        const rows = await this.prisma.supportTicket.findMany({
          where: { createdAt, assignedAdminId: admin.id },
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          take,
        });
        const names = await companyNames(
          this.prisma,
          rows.map((t) => t.companyId),
        );
        return {
          header: [
            'ticket_number',
            'company',
            'category',
            'state',
            'subject',
            'created_at_utc',
            'resolved_at_utc',
            'closed_at_utc',
          ],
          rows: rows.map((t) => [
            t.number,
            names.get(t.companyId),
            t.category,
            t.state,
            t.subject,
            t.createdAt,
            t.resolvedAt,
            t.closedAt,
          ]),
        };
      }
    }
  }
}
