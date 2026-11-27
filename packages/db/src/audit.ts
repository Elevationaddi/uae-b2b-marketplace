import type { Prisma, PrismaClient } from '@prisma/client';

export type Tx = Prisma.TransactionClient | PrismaClient;

export interface AuditEntry {
  actorId?: string | null;
  actorType: 'user' | 'admin' | 'system' | 'anonymous';
  action: string;
  resourceType: string;
  resourceId?: string | null;
  companyId?: string | null;
  reason?: string | null;
  /** Must not contain secrets, tokens, passwords or document contents. */
  details?: Record<string, unknown> | null;
  requestId?: string | null;
  ip?: string | null;
}

const SENSITIVE_KEY = /pass|secret|token|hash|code|cookie|authorization/i;

/** Drops values for keys that look sensitive, as a safety net on top of careful callers. */
export function redact(details: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(details)) {
    if (SENSITIVE_KEY.test(k)) out[k] = '[redacted]';
    else if (v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date))
      out[k] = redact(v as Record<string, unknown>);
    else out[k] = v;
  }
  return out;
}

/** Append an audit event. Call inside the same transaction as the business mutation. */
export async function writeAudit(tx: Tx, e: AuditEntry): Promise<void> {
  await tx.auditEvent.create({
    data: {
      actorId: e.actorId ?? null,
      actorType: e.actorType,
      action: e.action,
      resourceType: e.resourceType,
      resourceId: e.resourceId ?? null,
      companyId: e.companyId ?? null,
      reason: e.reason ?? null,
      redactedDiff: e.details ? (redact(e.details) as Prisma.InputJsonValue) : undefined,
      requestId: e.requestId ?? null,
      ip: e.ip ?? null,
    },
  });
}
