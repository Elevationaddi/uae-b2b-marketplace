import 'reflect-metadata';
import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { AppEnv } from '@app/config';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

export const API_PREFIX = 'api/v1';

/** Builds the configured Nest application (shared by main.ts and integration tests). */
export async function createApp(
  env: AppEnv,
  opts: { bufferLogs?: boolean } = {},
): Promise<INestApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule.forRoot(env), {
    bufferLogs: opts.bufferLogs ?? true,
    bodyParser: false,
  });
  app.useLogger(app.get(Logger));
  app.disable('x-powered-by');
  app.set('trust proxy', env.isProduction ? 1 : false);
  app.useBodyParser('json', { limit: '1mb' });
  app.use(
    helmet({
      contentSecurityPolicy: { directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] } },
      crossOriginResourcePolicy: { policy: 'same-site' },
    }),
  );
  app.enableCors({ origin: [env.WEB_ORIGIN], credentials: true });
  app.setGlobalPrefix(API_PREFIX);
  app.enableShutdownHooks();
  await app.init();
  return app;
}
