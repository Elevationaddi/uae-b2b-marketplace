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
  adminCompaniesQuery,
  adminVatStatusRequest,
  adminUsersQuery,
  auditQuery,
  decisionRequest,
  reasonRequest,
  staffRolesRequest,
  startReviewRequest,
  uuid,
  verificationQueueQuery,
} from '@app/contracts';
import type { Request, Response } from 'express';
import { AdminAuthGuard, Auth, RequireAdmin, type AuthContext } from '../auth/guards';
import { requestMeta } from '../common/request-context';
import { parse } from '../common/validation';
import { AdminService } from './admin.service';

const ok = <T>(data: T) => ({ data, meta: { next_cursor: null } });

@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('overview')
  @RequireAdmin('admin.companies.read')
  async overview() {
    return ok(await this.admin.overview());
  }

  @Get('verification')
  @RequireAdmin('admin.verification.review')
  queue(@Query() query: unknown) {
    return this.admin.queue(parse(verificationQueueQuery, query));
  }

  @Get('verification/:id')
  @RequireAdmin('admin.verification.review')
  async caseDetail(@Param('id') id: string) {
    return ok(await this.admin.caseDetail(parse(uuid, id)));
  }

  @Post('verification/:id/start-review')
  @HttpCode(200)
  @RequireAdmin('admin.verification.review')
  async startReview(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    const input = parse(startReviewRequest, body);
    return ok(
      await this.admin.startReview(a.user, parse(uuid, id), input.expected_state, requestMeta(req)),
    );
  }

  @Post('verification/:id/decision')
  @HttpCode(200)
  @RequireAdmin('admin.verification.review')
  async decide(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.admin.decide(
        a.user,
        parse(uuid, id),
        parse(decisionRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Get('files/:id/download')
  @RequireAdmin('admin.verification.review')
  async download(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const f = await this.admin.downloadFile(a.user, id, requestMeta(req));
    res.setHeader('Content-Type', f.mime);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(f.name)}`,
    );
    res.setHeader('Cache-Control', 'private, no-store');
    return new StreamableFile(f.stream);
  }

  @Get('companies')
  @RequireAdmin('admin.companies.read')
  companies(@Query() query: unknown) {
    return this.admin.companies(parse(adminCompaniesQuery, query));
  }

  @Get('companies/:id')
  @RequireAdmin('admin.companies.read')
  async company(@Param('id') id: string) {
    return ok(await this.admin.company(parse(uuid, id)));
  }

  @Post('companies/:id/suspend')
  @HttpCode(200)
  @RequireAdmin('admin.companies.suspend')
  async suspend(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.admin.suspend(
        a.user,
        parse(uuid, id),
        parse(reasonRequest, body).reason,
        requestMeta(req),
      ),
    );
  }

  /** F05: compliance confirms the company's VAT registration status, with a reason (audited). */
  @Post('companies/:id/vat-status')
  @HttpCode(200)
  @RequireAdmin('admin.verification.review')
  async confirmVat(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.admin.confirmVatStatus(
        a.user,
        parse(uuid, id),
        parse(adminVatStatusRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Post('companies/:id/reactivate')
  @HttpCode(200)
  @RequireAdmin('admin.companies.suspend')
  async reactivate(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.admin.reactivate(
        a.user,
        parse(uuid, id),
        parse(reasonRequest, body).reason,
        requestMeta(req),
      ),
    );
  }

  @Get('users')
  @RequireAdmin('admin.users.read')
  users(@Query() query: unknown) {
    return this.admin.users(parse(adminUsersQuery, query));
  }

  @Post('users/:id/revoke-sessions')
  @HttpCode(200)
  @RequireAdmin('admin.users.revoke_sessions')
  async revokeSessions(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.admin.revokeUserSessions(
        a.user,
        parse(uuid, id),
        parse(reasonRequest, body).reason,
        requestMeta(req),
      ),
    );
  }

  @Get('audit')
  @RequireAdmin('admin.audit.read')
  audit(@Query() query: unknown) {
    return this.admin.audit(parse(auditQuery, query));
  }

  @Get('staff')
  @RequireAdmin('admin.staff.manage')
  async staff() {
    return ok(await this.admin.staff());
  }

  @Post('staff/:id/roles')
  @HttpCode(200)
  @RequireAdmin('admin.staff.manage')
  async setRoles(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    const input = parse(staffRolesRequest, body);
    return ok(
      await this.admin.setStaffRoles(
        a.user,
        parse(uuid, id),
        input.roles,
        input.reason,
        requestMeta(req),
      ),
    );
  }
}
