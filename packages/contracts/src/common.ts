import { z } from 'zod';

export const uuid = z.string().uuid();
export const isoDateTime = z.string().datetime();
/** Calendar date YYYY-MM-DD (licence expiry etc.). */
export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date');
export const locale = z.enum(['en', 'ar']);
export const email = z
  .string()
  .trim()
  .max(254)
  .email('email')
  .transform((v) => v.toLowerCase());

/** Password policy: length-based (NIST 800-63B); max bound protects the hasher. */
export const password = z.string().min(12, 'min').max(128, 'max');

/** UAE or international phone in E.164 form, e.g. +971501234567. Eligibility policy is separate. */
export const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s()-]/g, ''))
  .pipe(z.string().regex(/^\+[1-9]\d{7,14}$/, 'phone'));

export const paginationQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().max(200).optional(),
});
export type PaginationQuery = z.infer<typeof paginationQuery>;

export const listMeta = z.object({ next_cursor: z.string().nullable() });

export function listOf<T extends z.ZodTypeAny>(item: T) {
  return z.object({ data: z.array(item), meta: listMeta });
}

export const okSchema = z.object({ ok: z.literal(true) });

export const EMIRATES = [
  'ABU_DHABI',
  'DUBAI',
  'SHARJAH',
  'AJMAN',
  'UMM_AL_QUWAIN',
  'RAS_AL_KHAIMAH',
  'FUJAIRAH',
] as const;
export const emirate = z.enum(EMIRATES);
