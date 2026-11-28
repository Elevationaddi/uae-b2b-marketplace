#!/usr/bin/env node
// T38 process-level check: the built API and worker must refuse to start when NODE_ENV=production
// and any required live integration is missing or a sandbox adapter is configured. There must be
// no silent mock fallback. Run after `pnpm build`: `pnpm check:production-refusal`.
// Uses development or CI values as the base, so no real secrets are involved.
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envFile = resolve(root, '.env');
// Base: the local .env, or the CI job environment when there is no .env file.
const base = existsSync(envFile) ? parseEnv(readFileSync(envFile, 'utf8')) : { ...process.env };
const strong = 'x9'.repeat(24);

const cases = [
  {
    name: 'sandbox payments and mail catcher in production',
    env: { PAYMENT_MODE: 'mock', EMAIL_PROVIDER: 'smtp-dev' },
    expect: ['PAYMENT_MODE=mock is not allowed in production'],
  },
  {
    name: 'trading enabled without a live payment provider',
    env: { PAYMENT_MODE: 'disabled', TRADING_ENABLED: 'true', SESSION_SECRET: strong },
    expect: ['TRADING_ENABLED=true in production requires a live payment provider'],
  },
  {
    name: 'live payments without provider keys or the approval flag',
    env: { PAYMENT_MODE: 'live', PSP_API_KEY: '', PSP_WEBHOOK_SECRET: '' },
    expect: ['PSP_API_KEY is required', 'FEATURE_REAL_PAYMENTS=true'],
  },
  {
    name: 'no live email provider (verification is mandatory)',
    env: { PAYMENT_MODE: 'disabled', EMAIL_PROVIDER: 'disabled' },
    expect: ['EMAIL_PROVIDER=live is required in production'],
  },
];

function run(app, env) {
  return new Promise((done) => {
    const child = spawn(process.execPath, [resolve(root, `apps/${app}/dist/main.js`)], {
      cwd: resolve(root, `apps/${app}`),
      env: { PATH: process.env.PATH, ...base, ...env, NODE_ENV: 'production' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let out = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (out += d));
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      done({ code: 'started', out });
    }, 20_000);
    child.on('exit', (code) => {
      clearTimeout(timer);
      done({ code, out });
    });
  });
}

let failed = 0;
for (const app of ['api', 'worker']) {
  if (!existsSync(resolve(root, `apps/${app}/dist/main.js`))) {
    console.error(`apps/${app}/dist/main.js is missing; run pnpm build first`);
    process.exit(2);
  }
  for (const c of cases) {
    const r = await run(app, c.env);
    const ok =
      r.code === 1 &&
      r.out.includes('Refusing to start') &&
      c.expect.every((e) => r.out.includes(e));
    console.log(`${ok ? 'PASS' : 'FAIL'} ${app}: ${c.name} (exit ${r.code})`);
    if (!ok) {
      failed++;
      console.log(r.out.slice(0, 2000));
    }
  }
}
process.exit(failed ? 1 : 0);
