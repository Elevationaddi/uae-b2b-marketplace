import { Inject, Injectable, type NestMiddleware } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import type { NextFunction, Request, Response } from 'express';
import { cookieName } from '../auth/cookies';
import { APP_ENV } from '../infra/tokens';
import { ApiError } from './api-error';
import { safeEqual } from './crypto';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * CSRF defence for every state-changing request (docs/10-security.md):
 * 1. Origin (or Referer) must match the expected origin: ADMIN_ORIGIN for /admin routes,
 *    WEB_ORIGIN for everything else. Requests with neither header are rejected.
 * 2. Double-submit token: X-CSRF-Token header must equal the csrf cookie.
 * SameSite cookies are an additional layer, not the only one.
 */
@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private readonly webOrigin: string;
  private readonly adminOrigin: string;

  constructor(@Inject(APP_ENV) private readonly env: AppEnv) {
    this.webOrigin = new URL(env.WEB_ORIGIN).origin;
    this.adminOrigin = new URL(env.ADMIN_ORIGIN).origin;
  }

  use(req: Request, _res: Response, next: NextFunction): void {
    if (SAFE_METHODS.has(req.method)) return next();
    const path = req.originalUrl.split('?')[0] ?? '';
    const expected = /^\/api\/v1\/admin(\/|$)/.test(path) ? this.adminOrigin : this.webOrigin;

    let origin = req.headers.origin;
    if (!origin && typeof req.headers.referer === 'string') {
      try {
        origin = new URL(req.headers.referer).origin;
      } catch {
        origin = undefined;
      }
    }
    if (origin !== expected) return next(new ApiError('FORBIDDEN', 'common.csrf_origin'));

    const cookie = req.cookies?.[cookieName(this.env, 'csrf')] as string | undefined;
    const header = req.headers['x-csrf-token'];
    if (!cookie || typeof header !== 'string' || !safeEqual(cookie, header)) {
      return next(new ApiError('FORBIDDEN', 'common.csrf_token'));
    }
    next();
  }
}
