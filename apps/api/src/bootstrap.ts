import 'reflect-metadata';
import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { AppEnv } from '@app/config';
import cookieParser from 'cookie-parser';
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
    ...(env.LOG_LEVEL === 'silent' ? { logger: false as const } : {}),
    bodyParser: false,
  });
  app.useLogger(app.get(Logger));
  app.disable('x-powered-by');
  // The web app proxies /api/v1 to the API; trust only the configured proxy hops for client IPs.
  const hops = Number(env.TRUST_PROXY);
  app.set('trust proxy', Number.isInteger(hops) ? hops : env.TRUST_PROXY);
  app.use(cookieParser());
  app.useBodyParser('json', { limit: '1mb' });
  app.use(
    helmet({
      contentSecurityPolicy: { directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] } },
      crossOriginResourcePolicy: { policy: 'same-site' },
    }),
  );
  app.enableCors({
    origin: [new URL(env.WEB_ORIGIN).origin, new URL(env.ADMIN_ORIGIN).origin],
    credentials: true,
  });
  app.setGlobalPrefix(API_PREFIX);
  app.enableShutdownHooks();
  await app.init();
  return app;
}
