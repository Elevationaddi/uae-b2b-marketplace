import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  invitationCreateRequest,
  membershipUpdateRequest,
  tokenRequest,
  uuid,
} from '@app/contracts';
import type { Request } from 'express';
import { requestMeta } from '../common/request-context';
import { parse } from '../common/validation';
import { Auth, CompanyAuthGuard, type AuthContext } from '../auth/guards';
import { TeamService } from './team.service';

const ok = <T>(data: T) => ({ data, meta: { next_cursor: null } });

@Controller()
export class TeamController {
  constructor(private readonly team: TeamService) {}

  @Get('workspaces/:id/members')
  @UseGuards(CompanyAuthGuard)
  async members(@Auth() a: AuthContext, @Param('id') id: string) {
    return ok(await this.team.members(a.user, parse(uuid, id)));
  }

  @Get('workspaces/:id/invitations')
  @UseGuards(CompanyAuthGuard)
  async invitations(@Auth() a: AuthContext, @Param('id') id: string) {
    return ok(await this.team.invitations(a.user, parse(uuid, id)));
  }

  @Post('workspaces/:id/invitations')
  @UseGuards(CompanyAuthGuard)
  async invite(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.team.invite(
        a.user,
        parse(uuid, id),
        parse(invitationCreateRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Delete('workspaces/:id/invitations/:invitationId')
  @UseGuards(CompanyAuthGuard)
  async revoke(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Param('invitationId') invitationId: string,
    @Req() req: Request,
  ) {
    await this.team.revokeInvitation(
      a.user,
      parse(uuid, id),
      parse(uuid, invitationId),
      requestMeta(req),
    );
    return ok({ ok: true as const });
  }

  /** Public: shows what an invitation is for, so the invitee can sign in or register with the right email. */
  @Post('invitations/preview')
  @HttpCode(200)
  async preview(@Body() body: unknown, @Req() req: Request) {
    return ok(await this.team.preview(parse(tokenRequest, body).token, requestMeta(req)));
  }

  @Post('invitations/accept')
  @HttpCode(200)
  @UseGuards(CompanyAuthGuard)
  async accept(@Auth() a: AuthContext, @Body() body: unknown, @Req() req: Request) {
    return ok(await this.team.accept(a.user, parse(tokenRequest, body).token, requestMeta(req)));
  }

  @Patch('memberships/:id')
  @UseGuards(CompanyAuthGuard)
  async update(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.team.updateMembership(
        a.user,
        parse(uuid, id),
        parse(membershipUpdateRequest, body),
        requestMeta(req),
      ),
    );
  }
}
