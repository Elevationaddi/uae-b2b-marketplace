import { z } from 'zod';

export const dependencyStatusSchema = z.enum(['up', 'down']);

export const livenessSchema = z.object({
  status: z.literal('ok'),
  service: z.enum(['api', 'worker', 'web']),
  version: z.string(),
  time: z.string().datetime(),
});
export type Liveness = z.infer<typeof livenessSchema>;

export const readinessSchema = z.object({
  status: z.enum(['ready', 'not_ready']),
  service: z.enum(['api', 'worker']),
  checks: z.record(
    z.string(),
    z.object({ status: dependencyStatusSchema, latency_ms: z.number().int().nonnegative() }),
  ),
  sandbox: z.boolean(),
  trading_enabled: z.boolean(),
  time: z.string().datetime(),
});
export type Readiness = z.infer<typeof readinessSchema>;
