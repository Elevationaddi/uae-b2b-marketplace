import { Inject, Injectable } from '@nestjs/common';
import type { PrismaClient, TokenPurpose, Tx } from '@app/db';
import { randomToken, sha256 } from '../common/crypto';
import { PRISMA } from '../infra/tokens';

export const TOKEN_TTL_MS: Record<TokenPurpose, number> = {
  VERIFY_EMAIL: 24 * 3600_000,
  RESET_PASSWORD: 60 * 60_000,
};

/** Single-use, expiring, hashed one-time tokens for email verification and password reset. */
@Injectable()
export class UserTokenService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  /** Issues a new token and invalidates earlier unused tokens of the same purpose. */
  async issue(tx: Tx, userId: string, purpose: TokenPurpose): Promise<string> {
    const now = new Date();
    await tx.userToken.updateMany({
      where: { userId, purpose, usedAt: null },
      data: { usedAt: now },
    });
    const token = randomToken();
    await tx.userToken.create({
      data: {
        userId,
        purpose,
        tokenHash: sha256(token),
        expiresAt: new Date(now.getTime() + TOKEN_TTL_MS[purpose]),
      },
    });
    return token;
  }

  /** Atomically consumes a valid token. Returns the user id, or null if invalid/expired/used. */
  async consume(tx: Tx, token: string, purpose: TokenPurpose): Promise<string | null> {
    const row = await tx.userToken.findUnique({ where: { tokenHash: sha256(token) } });
    if (!row || row.purpose !== purpose || row.usedAt || row.expiresAt.getTime() <= Date.now())
      return null;
    const res = await tx.userToken.updateMany({
      where: { id: row.id, usedAt: null },
      data: { usedAt: new Date() },
    });
    return res.count === 1 ? row.userId : null;
  }
}
