import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import { stagingMailboxQuery, type CaughtEmailItem } from '@app/contracts';
import type { PrismaClient } from '@app/db';
import { AdminAuthGuard, RequireAdmin } from '../auth/guards';
import { decodeOffset, encodeOffset } from '../catalog/access';
import { ApiError } from '../common/api-error';
import { parse } from '../common/validation';
import { APP_ENV, PRISMA } from '../infra/tokens';

const PAGE = 20;

/**
 * Staging mail catcher (C-20): emails the platform would have sent, kept 7 days and shown to
 * support staff so testers can follow verification and invitation links. Exists only while
 * EMAIL_PROVIDER=catcher, which production refuses; otherwise every route is 404.
 */
@Controller('admin/staging')
@UseGuards(AdminAuthGuard)
export class StagingMailboxController {
  constructor(
    @Inject(APP_ENV) private readonly env: AppEnv,
    @Inject(PRISMA) private readonly prisma: PrismaClient,
  ) {}

  @Get('emails')
  @RequireAdmin('admin.support.read')
  async emails(@Query() q: unknown) {
    if (this.env.EMAIL_PROVIDER !== 'catcher') throw new ApiError('NOT_FOUND', 'common.not_found');
    const query = parse(stagingMailboxQuery, q);
    const offset = decodeOffset(query.cursor);
    const rows = await this.prisma.caughtEmail.findMany({
      where: query.to ? { toAddress: { contains: query.to, mode: 'insensitive' } } : {},
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: offset,
      take: PAGE + 1,
    });
    const items: CaughtEmailItem[] = rows.slice(0, PAGE).map((r) => ({
      id: r.id,
      to: r.toAddress,
      subject: r.subject,
      body: r.body,
      template: r.template,
      locale: r.locale,
      created_at: r.createdAt.toISOString(),
    }));
    return {
      data: items,
      meta: { next_cursor: rows.length > PAGE ? encodeOffset(offset + PAGE) : null },
    };
  }
}
