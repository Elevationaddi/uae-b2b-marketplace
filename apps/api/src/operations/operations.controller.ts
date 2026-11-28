import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  adminCapabilities,
  adminSupportListQuery,
  exportCreateRequest,
  exportListQuery,
  overviewQuery,
  supportCreateRequest,
  supportListQuery,
  supportReplyRequest,
  supportResolveRequest,
} from '@app/contracts';
import type { Request, Response } from 'express';
import {
  AdminAuthGuard,
  Auth,
  CompanyAuthGuard,
  RequireAdmin,
  type AuthContext,
} from '../auth/guards';
import { RateLimitService } from '../common/rate-limit.service';
import { requestMeta } from '../common/request-context';
import { parse } from '../common/validation';
import { ExportService } from './export.service';
import { OverviewService } from './overview.service';
import { SupportService } from './support.service';

const ok = <T>(data: T, next: string | null = null) => ({ data, meta: { next_cursor: next } });

/** Customer support tickets for any workspace the caller belongs to (buyer or seller). */
@Controller('workspaces/:ws/support')
@UseGuards(CompanyAuthGuard)
export class SupportController {
  constructor(
    private readonly support: SupportService,
    private readonly limits: RateLimitService,
  ) {}

  @Get()
  async list(@Auth() a: AuthContext, @Param('ws') ws: string, @Query() q: unknown) {
    await this.limits.consume('lists_user', a.user.id);
    const r = await this.support.list(a.user, ws, parse(supportListQuery, q));
    return ok(r.items, r.next);
  }

  @Post()
  async create(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    const body = parse(supportCreateRequest, b);
    await this.limits.consume('support_create_user', a.user.id);
    return ok(await this.support.create(a.user, ws, body, requestMeta(req)));
  }

  @Get(':id')
  async detail(@Auth() a: AuthContext, @Param('ws') ws: string, @Param('id') id: string) {
    return ok(await this.support.customerDetail(a.user, ws, id));
  }

  @Post(':id/messages')
  async reply(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    const body = parse(supportReplyRequest, b);
    await this.limits.consume('message_user', a.user.id);
    return ok(await this.support.reply(a.user, ws, id, body.body, requestMeta(req)));
  }

  @Post(':id/close')
  @HttpCode(200)
  async close(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return ok(await this.support.close(a.user, ws, id, requestMeta(req)));
  }

  @Post(':id/reopen')
  @HttpCode(200)
  async reopen(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return ok(await this.support.reopen(a.user, ws, id, requestMeta(req)));
  }
}

/** Admin support queue, operations overview and scoped report exports. */
@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminOperationsController {
  constructor(
    private readonly support: SupportService,
    private readonly overviewService: OverviewService,
    private readonly exports: ExportService,
    private readonly limits: RateLimitService,
  ) {}

  @Get('operations/overview')
  @RequireAdmin('admin.companies.read')
  async overview(@Auth() a: AuthContext, @Query() q: unknown) {
    const finance = adminCapabilities(a.adminRoles ?? []).includes('admin.finance.read');
    return ok(await this.overviewService.overview(parse(overviewQuery, q), finance));
  }

  @Get('support')
  @RequireAdmin('admin.support.read')
  async supportList(@Auth() a: AuthContext, @Query() q: unknown) {
    const r = await this.support.adminList(a.user, parse(adminSupportListQuery, q));
    return ok(r.items, r.next);
  }

  @Get('support/:id')
  @RequireAdmin('admin.support.read')
  async supportDetail(@Auth() a: AuthContext, @Param('id') id: string) {
    const manage = adminCapabilities(a.adminRoles ?? []).includes('admin.support.manage');
    return ok(await this.support.adminDetail(a.user, id, manage));
  }

  @Post('support/:id/assign')
  @HttpCode(200)
  @RequireAdmin('admin.support.manage')
  async assign(@Auth() a: AuthContext, @Param('id') id: string, @Req() req: Request) {
    return ok(await this.support.assign(a.user, id, requestMeta(req)));
  }

  @Post('support/:id/messages')
  @RequireAdmin('admin.support.manage')
  async reply(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    const body = parse(supportReplyRequest, b);
    return ok(await this.support.adminReply(a.user, id, body.body, requestMeta(req)));
  }

  @Post('support/:id/resolve')
  @HttpCode(200)
  @RequireAdmin('admin.support.manage')
  async resolve(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    const body = parse(supportResolveRequest, b ?? {});
    return ok(await this.support.resolve(a.user, id, body.body, requestMeta(req)));
  }

  @Post('support/:id/reopen')
  @HttpCode(200)
  @RequireAdmin('admin.support.manage')
  async reopen(@Auth() a: AuthContext, @Param('id') id: string, @Req() req: Request) {
    return ok(await this.support.adminReopen(a.user, id, requestMeta(req)));
  }

  @Get('exports')
  @RequireAdmin('admin.reports.export')
  async exportList(@Auth() a: AuthContext, @Query() q: unknown) {
    const r = await this.exports.list(a.user, parse(exportListQuery, q).cursor);
    return ok(r.items, r.next);
  }

  @Post('exports')
  @RequireAdmin('admin.reports.export')
  async createExport(@Auth() a: AuthContext, @Body() b: unknown, @Req() req: Request) {
    const body = parse(exportCreateRequest, b);
    await this.limits.consume('export_user', a.user.id);
    return ok(await this.exports.create(a.user, a.adminRoles ?? [], body, requestMeta(req)));
  }

  @Get('exports/:id/download')
  @RequireAdmin('admin.reports.export')
  async download(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const f = await this.exports.download(a.user, id, requestMeta(req));
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(f.name)}`,
    );
    res.setHeader('Cache-Control', 'private, no-store');
    return new StreamableFile(f.content);
  }
}
