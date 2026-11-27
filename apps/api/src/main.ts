import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { EnvValidationError, describeEnv, parseEnv } from '@app/config';
import { createApp } from './bootstrap';

function loadLocalEnvFile(): void {
  // Local development convenience only; production injects env from a secret manager.
  if (process.env.NODE_ENV === 'production') return;
  const file = resolve(__dirname, '../../../.env');
  if (existsSync(file)) process.loadEnvFile(file);
}

async function main(): Promise<void> {
  loadLocalEnvFile();
  let env;
  try {
    env = parseEnv(process.env);
  } catch (err) {
    if (err instanceof EnvValidationError) {
      console.error(`[api] Refusing to start. ${err.message}`);
      process.exit(1);
    }
    throw err;
  }
  const app = await createApp(env);
  await app.listen(env.API_PORT);
  console.log(`[api] listening on :${env.API_PORT}`, JSON.stringify(describeEnv(env)));
}

void main();
