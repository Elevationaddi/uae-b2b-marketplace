#!/usr/bin/env node
// Read-path load check (docs/12-testing.md: proposed p95 < 500 ms for catalog/API reads under 50
// concurrent sandbox users, excluding external latency). Sends anonymous marketplace reads with N
// concurrent clients for D seconds against a running API and reports latency percentiles and
// errors per endpoint. Not a capacity test of production hardware.
// Run: `pnpm perf:check` (API_URL, PERF_CONCURRENCY, PERF_SECONDS override the defaults).
const API = (process.env.API_URL ?? 'http://localhost:4000').replace(/\/$/, '');
const CONCURRENCY = Number(process.env.PERF_CONCURRENCY ?? 50);
const SECONDS = Number(process.env.PERF_SECONDS ?? 20);
const TARGET_P95 = Number(process.env.PERF_P95_MS ?? 500);

async function json(path) {
  const r = await fetch(`${API}/api/v1${path}`);
  if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
  return (await r.json()).data;
}

// Discover real ids from the seeded catalogue rather than hardcoding them.
const products = (await json('/marketplace/products?q=carton')).items ?? [];
const suppliers = (await json('/marketplace/suppliers')).items ?? [];
const categories = await json('/marketplace/categories');
const productId = products[0]?.id;
const supplierId = suppliers[0]?.id;
if (!productId || !supplierId) {
  console.error('No seeded products or suppliers found; run pnpm db:seed first');
  process.exit(2);
}
const endpoints = {
  home: '/marketplace/home',
  categories: '/marketplace/categories',
  search: '/marketplace/products?q=carton',
  search_category: `/marketplace/products?category_id=${categories[0]?.id ?? ''}`,
  suggest: '/marketplace/suggest?q=car',
  product: `/marketplace/products/${productId}`,
  related: `/marketplace/products/${productId}/related`,
  suppliers: '/marketplace/suppliers',
  supplier: `/marketplace/suppliers/${supplierId}`,
  reviews: `/marketplace/suppliers/${supplierId}/reviews`,
};
const names = Object.keys(endpoints);
const stats = Object.fromEntries(names.map((n) => [n, { ms: [], errors: 0, statuses: {} }]));
const end = Date.now() + SECONDS * 1000;
let i = 0;

async function client() {
  while (Date.now() < end) {
    const name = names[i++ % names.length];
    const t = performance.now();
    try {
      const r = await fetch(`${API}/api/v1${endpoints[name]}`);
      await r.arrayBuffer();
      stats[name].statuses[r.status] = (stats[name].statuses[r.status] ?? 0) + 1;
      if (!r.ok) stats[name].errors++;
    } catch {
      stats[name].errors++;
    }
    stats[name].ms.push(performance.now() - t);
  }
}

const pct = (a, p) => a[Math.min(a.length - 1, Math.floor((p / 100) * a.length))] ?? 0;
await Promise.all(Array.from({ length: CONCURRENCY }, client));

let all = [];
let errors = 0;
console.log(`API ${API}, ${CONCURRENCY} concurrent clients, ${SECONDS} s`);
console.log('endpoint            requests   p50     p95     p99   errors');
for (const n of names) {
  const ms = stats[n].ms.sort((a, b) => a - b);
  all = all.concat(ms);
  errors += stats[n].errors;
  console.log(
    `${n.padEnd(18)} ${String(ms.length).padStart(8)} ${pct(ms, 50).toFixed(0).padStart(6)} ${pct(ms, 95).toFixed(0).padStart(7)} ${pct(ms, 99).toFixed(0).padStart(7)} ${String(stats[n].errors).padStart(7)}`,
  );
}
all.sort((a, b) => a - b);
const p95 = pct(all, 95);
console.log(
  `overall: ${all.length} requests, ${(all.length / SECONDS).toFixed(0)} req/s, p50 ${pct(all, 50).toFixed(0)} ms, p95 ${p95.toFixed(0)} ms, p99 ${pct(all, 99).toFixed(0)} ms, errors ${errors}`,
);
const ok = p95 < TARGET_P95 && errors === 0;
console.log(
  ok
    ? `PASS (p95 < ${TARGET_P95} ms, no errors)`
    : `FAIL (target p95 < ${TARGET_P95} ms, no errors)`,
);
process.exit(ok ? 0 : 1);
