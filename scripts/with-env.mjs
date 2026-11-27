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
if (existsSync(envFile)) process.loadEnvFile(envFile);

const [cmd, ...args] = process.argv.slice(2);
if (!cmd) {
  console.error('usage: with-env.mjs <command> [...args]');
  process.exit(2);
}
const result = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
process.exit(result.status ?? 1);
