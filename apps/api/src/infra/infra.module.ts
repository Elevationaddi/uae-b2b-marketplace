import {
  Global,
  Inject,
  Injectable,
  Logger,
  Module,
  OnApplicationShutdown,
  type DynamicModule,
} from '@nestjs/common';
import type { AppEnv } from '@app/config';
import { createPrismaClient, type PrismaClient } from '@app/db';
import Redis from 'ioredis';
import { APP_ENV, PRISMA, REDIS } from './tokens';

const logger = new Logger('Infra');

@Injectable()
class InfraShutdown implements OnApplicationShutdown {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(REDIS) private readonly redis: Redis,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    await Promise.allSettled([this.prisma.$disconnect(), this.redis.quit()]);
  }
}

/** Provides validated env, a Prisma client and a Redis connection to the whole API. */
@Global()
@Module({})
export class InfraModule {
  static forRoot(env: AppEnv): DynamicModule {
    return {
      module: InfraModule,
      providers: [
        { provide: APP_ENV, useValue: env },
        { provide: PRISMA, useFactory: () => createPrismaClient(env.DATABASE_URL) },
        {
          provide: REDIS,
          useFactory: () => {
            const redis = new Redis(env.REDIS_URL, {
              // Commands queue briefly while (re)connecting; readiness probes add their own timeout.
              maxRetriesPerRequest: 1,
              connectTimeout: 2_000,
            });
            // Connection failures surface through readiness checks; log without crashing.
            redis.on('error', (err: Error) =>
              logger.warn(`redis connection error: ${err.message}`),
            );
            return redis;
          },
        },
        InfraShutdown,
      ],
      exports: [APP_ENV, PRISMA, REDIS],
    };
  }
}
