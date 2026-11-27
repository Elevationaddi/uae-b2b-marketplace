import { Module, type DynamicModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import type { AppEnv } from '@app/config';
import { LoggerModule } from 'nestjs-pino';
import { ErrorEnvelopeFilter } from './common/error.filter';
import { genRequestId } from './common/request-id';
import { HealthController } from './health/health.controller';
import { InfraModule } from './infra/infra.module';

/** Paths redacted from every log line (docs/10-security.md: no credentials or tokens in logs). */
export const LOG_REDACT_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.headers["x-csrf-token"]',
  'req.headers["idempotency-key"]',
  'res.headers["set-cookie"]',
  '*.password',
  '*.token',
  '*.secret',
];

@Module({})
export class AppModule {
  static forRoot(env: AppEnv): DynamicModule {
    return {
      module: AppModule,
      imports: [
        InfraModule.forRoot(env),
        LoggerModule.forRoot({
          pinoHttp: {
            level: env.LOG_LEVEL,
            genReqId: genRequestId,
            redact: { paths: LOG_REDACT_PATHS, censor: '[redacted]' },
            // Query strings may carry tokens; log the path only.
            serializers: {
              req: (req: { id: string; method: string; url: string }) => ({
                id: req.id,
                method: req.method,
                path: req.url.split('?')[0],
              }),
            },
            transport:
              env.NODE_ENV === 'development'
                ? { target: 'pino-pretty', options: { singleLine: true } }
                : undefined,
          },
        }),
      ],
      controllers: [HealthController],
      providers: [{ provide: APP_FILTER, useClass: ErrorEnvelopeFilter }],
    };
  }
}
