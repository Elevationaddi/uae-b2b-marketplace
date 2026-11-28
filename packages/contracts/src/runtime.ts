import { z } from 'zod';

/**
 * Browsers run under a strict Content Security Policy without 'unsafe-eval' (SR-2). Zod decides
 * whether to compile validators with `Function` when each schema is created, so this must run
 * before any schema module: it is the first export of the package index. In the browser the
 * validators run interpreted (same results); servers keep the compiled fast path.
 */
export const VALIDATOR_COMPILATION =
  typeof (globalThis as { window?: unknown }).window === 'undefined' ? 'enabled' : 'disabled';
if (VALIDATOR_COMPILATION === 'disabled') z.config({ jitless: true });
