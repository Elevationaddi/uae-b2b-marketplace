import { Inject, Injectable } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import { APP_ENV } from '../infra/tokens';

/** EICAR anti-malware test signature (public test string, not malware). */
const EICAR = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';

export type ScanResult = 'CLEAN' | 'INFECTED';

/**
 * Malware scanning adapter.
 * - sandbox-eicar: DEVELOPMENT ONLY. Detects the EICAR test file so the quarantine path can be
 *   exercised end to end. It is not a malware scanner and is refused in production.
 * - disabled: uploads are refused (no file is accepted unscanned).
 * - live: not implemented in Phase 1; startup fails rather than silently skipping scans.
 */
@Injectable()
export class ScannerService {
  constructor(@Inject(APP_ENV) private readonly env: AppEnv) {
    if (env.FILE_SCANNER === 'live') {
      throw new Error(
        'FILE_SCANNER=live has no adapter yet (Phase 7 provider selection). Refusing to start.',
      );
    }
  }

  get enabled(): boolean {
    return this.env.FILE_SCANNER === 'sandbox-eicar';
  }

  async scan(content: Buffer): Promise<ScanResult> {
    if (!this.enabled) throw new Error('scanner disabled');
    return content.includes(EICAR) ? 'INFECTED' : 'CLEAN';
  }
}

/** Identify allowed file types by magic bytes; never trust the client-declared type. */
export function sniffMime(buf: Buffer): 'application/pdf' | 'image/png' | 'image/jpeg' | null {
  if (buf.length >= 5 && buf.subarray(0, 5).toString('latin1') === '%PDF-')
    return 'application/pdf';
  if (
    buf.length >= 8 &&
    buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  )
    return 'image/png';
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  return null;
}

export function sanitizeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? 'file';
  const cleaned = base
    .replace(/[^\p{L}\p{N}._ -]/gu, '_')
    .replace(/^\.+/, '')
    .slice(0, 150)
    .trim();
  return cleaned || 'file';
}
