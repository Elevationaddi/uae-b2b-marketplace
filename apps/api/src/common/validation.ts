import type { ZodType, z } from 'zod';
import { ApiError } from './api-error';

/** Parse untrusted input with a shared contract; failures become 422 with field errors. */
export function parse<S extends ZodType>(schema: S, input: unknown): z.infer<S> {
  const result = schema.safeParse(input ?? {});
  if (result.success) return result.data;
  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.length ? issue.path.join('.') : '_';
    if (!fieldErrors[key])
      fieldErrors[key] =
        issue.code === 'custom' || /^[a-z_]+$/.test(issue.message) ? issue.message : issue.code;
  }
  throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', fieldErrors);
}
