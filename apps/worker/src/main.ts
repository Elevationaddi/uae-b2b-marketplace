import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { EnvValidationError, describeEnv, parseEnv } from '@app/config';
import { startWorker } from './worker';

async function main(): Promise<void> {
  if (process.env.NODE_ENV !== 'production') {
    const file = resolve(__dirname, '../../../.env');
    if (existsSync(file)) process.loadEnvFile(file);
  }
  let env;
  try {
    env = parseEnv(process.env);
  } catch (err) {
    if (err instanceof EnvValidationError) {
      console.error(`[worker] Refusing to start. ${err.message}`);
      process.exit(1);
    }
    throw err;
  }
  console.log('[worker] config', JSON.stringify(describeEnv(env)));
  const running = await startWorker(env);
  const shutdown = async (signal: string) => {
    console.log(`[worker] ${signal} received, draining`);
    await running.stop();
    process.exit(0);
  };
  process.once('SIGTERM', () => void shutdown('SIGTERM'));
  process.once('SIGINT', () => void shutdown('SIGINT'));
}

void main();
