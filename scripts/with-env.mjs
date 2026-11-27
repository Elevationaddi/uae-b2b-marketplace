#!/usr/bin/env node
// Loads the repository-root .env (if present) without overriding variables
// already set in the environment, then runs the given command.
// Used for CLI tools (Prisma) that do not read the root .env themselves.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envFile = resolve(root, '.env');
let argv = process.argv.slice(2);
// `--except NAME[,NAME]` leaves those variables out (e.g. NODE_ENV for `next build`, which
// must run as production regardless of the local development .env).
let except = [];
if (argv[0] === '--except') {
  except = (argv[1] ?? '').split(',').filter(Boolean);
  argv = argv.slice(2);
}
if (existsSync(envFile)) {
  const before = new Set(Object.keys(process.env));
  process.loadEnvFile(envFile);
  for (const name of except) if (!before.has(name)) delete process.env[name];
}

const [cmd, ...args] = argv;
if (!cmd) {
  console.error('usage: with-env.mjs <command> [...args]');
  process.exit(2);
}
const result = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
process.exit(result.status ?? 1);
