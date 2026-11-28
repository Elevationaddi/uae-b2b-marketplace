#!/usr/bin/env node
// T37 restore drill (docs/13-roadmap.md): dump the database with pg_dump, restore it into a new,
// temporary database on the same server, and check that the restored copy passes schema and
// transaction-consistency checks. The source database is only read; the temporary database and
// dump file are removed afterwards. Never point this at production without approval.
// Run: `pnpm db:restore-check` (requires pg_dump, pg_restore and psql matching the server major).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (existsSync(resolve(root, '.env'))) process.loadEnvFile(resolve(root, '.env'));
const source = process.env.DATABASE_URL;
if (!source) {
  console.error('DATABASE_URL is not set');
  process.exit(2);
}
if (process.env.NODE_ENV === 'production' && process.env.ALLOW_RESTORE_CHECK !== 'yes') {
  console.error('Refusing to run against production without ALLOW_RESTORE_CHECK=yes');
  process.exit(2);
}
const url = new URL(source);
const sourceDb = url.pathname.slice(1).split('?')[0];
const target = `${sourceDb}_restore_check_${Date.now()}`;
const targetUrl = new URL(source);
targetUrl.pathname = `/${target}`;
targetUrl.search = '';
const adminUrl = new URL(source);
adminUrl.pathname = '/postgres';
adminUrl.search = '';
const plain = (u) => {
  const c = new URL(u);
  c.search = '';
  return c.toString();
};

const psql = (u, sql) =>
  execFileSync('psql', [u, '-X', '-A', '-t', '-v', 'ON_ERROR_STOP=1', '-c', sql], {
    encoding: 'utf8',
  }).trim();

const CHECKS = {
  migrations_applied: `SELECT count(*) FROM _prisma_migrations WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL`,
  // A failed attempt later marked rolled back (and re-applied) is normal history; a failed attempt
  // that was never resolved blocks deploys.
  migrations_unfinished: `SELECT count(*) FROM _prisma_migrations WHERE finished_at IS NULL AND rolled_back_at IS NULL`,
  migrations_rolled_back_attempts: `SELECT count(*) FROM _prisma_migrations WHERE rolled_back_at IS NOT NULL`,
  tables: `SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'`,
  triggers: `SELECT count(*) FROM pg_trigger WHERE NOT tgisinternal`,
  constraints: `SELECT count(*) FROM pg_constraint c JOIN pg_namespace n ON n.oid = c.connamespace WHERE n.nspname = 'public'`,
  companies: `SELECT count(*) FROM companies`,
  users: `SELECT count(*) FROM users`,
  orders: `SELECT count(*) FROM orders`,
  payments: `SELECT count(*) FROM payments`,
  ledger_entries: `SELECT count(*) FROM ledger_entries`,
  audit_events: `SELECT count(*) FROM audit_events`,
  refunds: `SELECT count(*) FROM refunds`,
  payouts: `SELECT count(*) FROM payouts`,
  support_tickets: `SELECT count(*) FROM support_tickets`,
  ledger_total_debit: `SELECT coalesce(sum(debit_fils), 0) FROM ledger_entries`,
  ledger_total_credit: `SELECT coalesce(sum(credit_fils), 0) FROM ledger_entries`,
  unbalanced_journals: `SELECT count(*) FROM (SELECT journal_id FROM ledger_entries GROUP BY journal_id HAVING sum(debit_fils) <> sum(credit_fils)) j`,
  over_refunded_orders: `SELECT count(*) FROM orders WHERE refunded_fils > total_fils OR refunded_fils < 0`,
  order_total_mismatch: `SELECT count(*) FROM orders WHERE total_fils <> merchandise_fils + shipping_fils + tax_fils`,
  payout_allocation_mismatch: `SELECT count(*) FROM payouts p WHERE p.amount_fils <> (SELECT coalesce(sum(a.amount_fils), 0) FROM payout_allocations a WHERE a.payout_id = p.id)`,
};
// Values that must be zero in a consistent database (in the source and in the restore).
const MUST_BE_ZERO = [
  'migrations_unfinished',
  'unbalanced_journals',
  'over_refunded_orders',
  'order_total_mismatch',
  'payout_allocation_mismatch',
];

const dir = mkdtempSync(join(tmpdir(), 'restore-check-'));
const dump = join(dir, `${sourceDb}.dump`);
let created = false;
let failed = 0;
try {
  const t0 = Date.now();
  // Snapshot the source checks first, then dump in one consistent transaction.
  const before = Object.fromEntries(
    Object.entries(CHECKS).map(([k, q]) => [k, psql(plain(source), q)]),
  );
  execFileSync('pg_dump', [
    '--format=custom',
    '--no-owner',
    '--no-privileges',
    '--file',
    dump,
    plain(source),
  ]);
  const dumpBytes = statSync(dump).size;
  psql(plain(adminUrl.toString()), `CREATE DATABASE "${target}"`);
  created = true;
  execFileSync('pg_restore', [
    '--no-owner',
    '--no-privileges',
    '--exit-on-error',
    '--dbname',
    targetUrl.toString(),
    dump,
  ]);
  const after = Object.fromEntries(
    Object.entries(CHECKS).map(([k, q]) => [k, psql(targetUrl.toString(), q)]),
  );
  const expectedMigrations = readdirSync(resolve(root, 'packages/db/prisma/migrations'), {
    withFileTypes: true,
  }).filter((d) => d.isDirectory()).length;

  const rows = [];
  for (const k of Object.keys(CHECKS)) {
    // Row counts can grow if the app writes during the dump; the restore must match the dump,
    // so compare restore against source only when nothing is running (the usual drill setup).
    let ok = after[k] === before[k];
    if (MUST_BE_ZERO.includes(k)) ok = ok && after[k] === '0';
    if (k === 'ledger_total_credit')
      ok = ok && after.ledger_total_credit === after.ledger_total_debit;
    if (k === 'migrations_applied') ok = ok && Number(after[k]) === expectedMigrations;
    if (!ok) failed++;
    rows.push(`${ok ? 'PASS' : 'FAIL'}  ${k.padEnd(28)} source=${before[k]}  restored=${after[k]}`);
  }
  console.log(`Restore drill: ${sourceDb} -> ${target}`);
  console.log(
    `dump ${(dumpBytes / 1024 / 1024).toFixed(1)} MiB, total ${((Date.now() - t0) / 1000).toFixed(1)} s`,
  );
  console.log(`expected migrations: ${expectedMigrations}`);
  for (const r of rows) console.log(r);
} finally {
  if (created) psql(plain(adminUrl.toString()), `DROP DATABASE IF EXISTS "${target}"`);
  rmSync(dir, { recursive: true, force: true });
}
console.log(failed ? `${failed} check(s) failed` : 'All restore checks passed');
process.exit(failed ? 1 : 0);
