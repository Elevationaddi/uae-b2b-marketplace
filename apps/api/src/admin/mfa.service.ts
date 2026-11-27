import { Inject, Injectable } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import type { PrismaClient, Tx } from '@app/db';
import Redis from 'ioredis';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { randomInt } from 'node:crypto';
import { decryptSecret, encryptSecret, sha256 } from '../common/crypto';
import { APP_ENV, PRISMA, REDIS } from '../infra/tokens';

// RFC 6238 TOTP via otplib: SHA-1, 6 digits, 30 s step, +/-1 step tolerance for clock drift.
authenticator.options = { window: 1 };

const RECOVERY_CODE_COUNT = 10;
const RECOVERY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I

function newRecoveryCode(): string {
  const pick = () =>
    Array.from({ length: 5 }, () => RECOVERY_ALPHABET[randomInt(RECOVERY_ALPHABET.length)]).join(
      '',
    );
  return `${pick()}-${pick()}`;
}

export function normaliseRecoveryCode(code: string): string {
  const c = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return `${c.slice(0, 5)}-${c.slice(5)}`;
}

/** Admin TOTP MFA (A02). Secrets are encrypted at rest; recovery codes stored only as hashes. */
@Injectable()
export class MfaService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
    @Inject(REDIS) private readonly redis: Redis,
  ) {}

  async startEnrolment(
    userId: string,
    email: string,
  ): Promise<{ otpauth_url: string; secret: string; qr_svg: string }> {
    const secret = authenticator.generateSecret(20); // 160-bit secret
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaSecretEnc: encryptSecret(secret, this.env.MFA_ENCRYPTION_KEY), mfaEnabled: false },
    });
    const otpauth = authenticator.keyuri(email, `${this.env.APP_NAME} Admin`, secret);
    const qr = await QRCode.toString(otpauth, {
      type: 'svg',
      margin: 1,
      errorCorrectionLevel: 'M',
    });
    return { otpauth_url: otpauth, secret, qr_svg: qr };
  }

  /** Verifies a TOTP code and blocks replay of the same code within its validity window. */
  async verifyTotp(userId: string, secretEnc: string | null, code: string): Promise<boolean> {
    if (!secretEnc) return false;
    const secret = decryptSecret(secretEnc, this.env.MFA_ENCRYPTION_KEY);
    if (!authenticator.check(code, secret)) return false;
    const fresh = await this.redis.set(`totp-used:${userId}:${code}`, '1', 'EX', 120, 'NX');
    return fresh === 'OK';
  }

  async issueRecoveryCodes(tx: Tx, userId: string): Promise<string[]> {
    const codes = Array.from({ length: RECOVERY_CODE_COUNT }, newRecoveryCode);
    await tx.mfaRecoveryCode.deleteMany({ where: { userId } });
    await tx.mfaRecoveryCode.createMany({
      data: codes.map((c) => ({ userId, codeHash: sha256(`${userId}:${c}`) })),
    });
    return codes;
  }

  /** Consumes an unused recovery code atomically. */
  async useRecoveryCode(userId: string, code: string): Promise<boolean> {
    const res = await this.prisma.mfaRecoveryCode.updateMany({
      where: { userId, codeHash: sha256(`${userId}:${normaliseRecoveryCode(code)}`), usedAt: null },
      data: { usedAt: new Date() },
    });
    return res.count === 1;
  }

  remaining(userId: string): Promise<number> {
    return this.prisma.mfaRecoveryCode.count({ where: { userId, usedAt: null } });
  }
}
