import { Injectable } from '@nestjs/common';
import argon2 from 'argon2';

/**
 * Argon2id via the node-argon2 library (A01). Parameters follow the OWASP Password Storage
 * Cheat Sheet minimum (m=19 MiB, t=2, p=1) raised to m=64 MiB, t=3.
 */
const OPTIONS = { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1 } as const;

@Injectable()
export class PasswordService {
  /** Pre-computed hash used to equalise timing when the account does not exist. */
  private dummyHash: Promise<string> | undefined;

  hash(password: string): Promise<string> {
    return argon2.hash(password, OPTIONS);
  }

  async verify(hash: string | null | undefined, password: string): Promise<boolean> {
    if (!hash) {
      this.dummyHash ??= argon2.hash('timing-equaliser-not-a-password', OPTIONS);
      await argon2.verify(await this.dummyHash, password).catch(() => false);
      return false;
    }
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  }

  needsRehash(hash: string): boolean {
    return argon2.needsRehash(hash, OPTIONS);
  }
}
