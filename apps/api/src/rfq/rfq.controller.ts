import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  adminRfqQuery,
  conversationStartRequest,
  inviteCandidateQuery,
  messageCreateRequest,
  notificationListQuery,
  notificationPreferencesRequest,
  quoteAcceptRequest,
  quoteDraftRequest,
  quoteExpectedRequest,
  quoteReviseRequest,
  quoteUpdateRequest,
  quoteVersionActionRequest,
  readRequest,
  reasonRequest,
  rfqCancelRequest,
  rfqCreateRequest,
  rfqListQuery,
  rfqUpdateRequest,
  sellerQuoteListQuery,
  sellerRfqListQuery,
  uuid,
} from '@app/contracts';
import type { Request, Response } from 'express';
import type { Readable } from 'node:stream';
import { z } from 'zod';
import {
  AdminAuthGuard,
  Auth,
  CompanyAuthGuard,
  RequireAdmin,
  type AuthContext,
} from '../auth/guards';
import { withIdempotency } from '../common/idempotency';
import { requestMeta } from '../common/request-context';
import { parse } from '../common/validation';
import { PRISMA } from '../infra/tokens';
import { Inject } from '@nestjs/common';
import type { PrismaClient } from '@app/db';
import { AdminRfqService } from './admin-rfq.service';
import { ConversationService } from './conversation.service';
import { NotificationService } from './notification.service';
import { QuoteService } from './quote.service';
import { RfqService } from './rfq.service';

const ok = <T>(data: T, next: string | null = null) => ({ data, meta: { next_cursor: next } });
const ATTACHMENT_MAX = 10 * 1024 * 1024;
const attachment = () =>
  UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: ATTACHMENT_MAX, files: 1, fields: 2 } }),
  );
const cursorQuery = z.object({ cursor: z.string().max(200).optional() });

function sendFile(res: Response, f: { stream: Readable; mime: string; name: string }) {
  res.setHeader('Content-Type', f.mime);
  res.setHeader(
    'Content-Disposition',
    `attachment; filename*=UTF-8''${encodeURIComponent(f.name)}`,
  );
  res.setHeader('Cache-Control', 'private, no-store');
  return new StreamableFile(f.stream);
}

/** Buyer RFQs, attachments and quote decisions (docs/02-buyer.md). */
@Controller('buyer/workspaces/:ws')
@UseGuards(CompanyAuthGuard)
export class BuyerRfqController {
  constructor(
    private readonly rfqs: RfqService,
    @Inject(PRISMA) private readonly prisma: PrismaClient,
  ) {}

  @Get('rfqs')
  async list(@Auth() a: AuthContext, @Param('ws') ws: string, @Query() q: unknown) {
    const r = await this.rfqs.list(a.user, ws, parse(rfqListQuery, q));
    return ok(r.items, r.next);
  }

  @Post('rfqs')
  async create(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(await this.rfqs.create(a.user, ws, parse(rfqCreateRequest, b), requestMeta(req)));
  }

  @Get('invite-candidates')
  async candidates(@Auth() a: AuthContext, @Param('ws') ws: string, @Query() q: unknown) {
    return ok(await this.rfqs.inviteCandidates(a.user, ws, parse(inviteCandidateQuery, q)));
  }

  @Get('rfqs/:id')
  async detail(@Auth() a: AuthContext, @Param('ws') ws: string, @Param('id') id: string) {
    return ok(await this.rfqs.detail(a.user, ws, id));
  }

  @Patch('rfqs/:id')
  async update(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(await this.rfqs.update(a.user, ws, id, parse(rfqUpdateRequest, b), requestMeta(req)));
  }

  @Post('rfqs/:id/publish')
  @HttpCode(200)
  async publish(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    const { expected_version } = parse(quoteExpectedRequest, b);
    return ok(await this.rfqs.publish(a.user, ws, id, expected_version, requestMeta(req)));
  }

  @Post('rfqs/:id/cancel')
  @HttpCode(200)
  async cancel(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(await this.rfqs.cancel(a.user, ws, id, parse(rfqCancelRequest, b), requestMeta(req)));
  }

  @Post('rfqs/:id/files')
  @attachment()
  async addFile(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: Request,
  ) {
    return ok(await this.rfqs.addFile(a.user, ws, id, file, requestMeta(req)));
  }

  @Delete('rfqs/:id/files/:fileId')
  async removeFile(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Param('fileId') fileId: string,
    @Req() req: Request,
  ) {
    return ok(await this.rfqs.removeFile(a.user, ws, id, parse(uuid, fileId), requestMeta(req)));
  }

  @Get('rfqs/:id/files/:fileId')
  async download(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Param('fileId') fileId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return sendFile(
      res,
      await this.rfqs.download(a.user, ws, id, parse(uuid, fileId), requestMeta(req)),
    );
  }

  @Post('quotes/:quoteId/request-revision')
  @HttpCode(200)
  async requestRevision(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('quoteId') quoteId: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.rfqs.requestRevision(
        a.user,
        ws,
        quoteId,
        parse(quoteVersionActionRequest, b),
        requestMeta(req),
      ),
    );
  }

  @Post('quotes/:quoteId/decline')
  @HttpCode(200)
  async decline(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('quoteId') quoteId: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.rfqs.decline(
        a.user,
        ws,
        quoteId,
        parse(quoteVersionActionRequest, b),
        requestMeta(req),
      ),
    );
  }

  /** Award: requires Idempotency-Key (docs/07-api.md). */
  @Post('quotes/:quoteId/accept')
  @HttpCode(200)
  async accept(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('quoteId') quoteId: string,
    @Body() b: unknown,
    @Headers('idempotency-key') key: string | undefined,
    @Req() req: Request,
  ) {
    const body = parse(quoteAcceptRequest, b);
    return ok(
      await withIdempotency(this.prisma, a.user.id, key, `accept:${ws}:${quoteId}`, body, () =>
        this.rfqs.accept(a.user, ws, quoteId, body, requestMeta(req)),
      ),
    );
  }
}

/** Seller RFQ inbox and quotes (docs/03-seller.md). */
@Controller('seller/workspaces/:ws')
@UseGuards(CompanyAuthGuard)
export class SellerRfqController {
  constructor(private readonly quotes: QuoteService) {}

  @Get('rfqs')
  async list(@Auth() a: AuthContext, @Param('ws') ws: string, @Query() q: unknown) {
    const r = await this.quotes.listRfqs(a.user, ws, parse(sellerRfqListQuery, q));
    return ok(r.items, r.next);
  }

  @Get('rfqs/:id')
  async detail(@Auth() a: AuthContext, @Param('ws') ws: string, @Param('id') id: string) {
    return ok(await this.quotes.rfqDetail(a.user, ws, id));
  }

  @Get('rfqs/:id/files/:fileId')
  async download(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Param('fileId') fileId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return sendFile(
      res,
      await this.quotes.downloadRfqFile(a.user, ws, id, parse(uuid, fileId), requestMeta(req)),
    );
  }

  @Post('rfqs/:id/quote')
  async createQuote(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.quotes.createDraft(a.user, ws, id, parse(quoteDraftRequest, b), requestMeta(req)),
    );
  }

  @Get('quotes')
  async listQuotes(@Auth() a: AuthContext, @Param('ws') ws: string, @Query() q: unknown) {
    const r = await this.quotes.listQuotes(a.user, ws, parse(sellerQuoteListQuery, q));
    return ok(r.items, r.next);
  }

  @Patch('quotes/:id')
  async updateQuote(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.quotes.updateDraft(a.user, ws, id, parse(quoteUpdateRequest, b), requestMeta(req)),
    );
  }

  @Post('quotes/:id/submit')
  @HttpCode(200)
  async submit(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    const { expected_version } = parse(quoteExpectedRequest, b);
    return ok(await this.quotes.submit(a.user, ws, id, expected_version, requestMeta(req)));
  }

  @Post('quotes/:id/revise')
  @HttpCode(200)
  async revise(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.quotes.revise(a.user, ws, id, parse(quoteReviseRequest, b), requestMeta(req)),
    );
  }

  @Post('quotes/:id/withdraw')
  @HttpCode(200)
  async withdraw(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    const { expected_version } = parse(quoteExpectedRequest, b);
    return ok(await this.quotes.withdraw(a.user, ws, id, expected_version, requestMeta(req)));
  }

  @Post('quotes/:id/files')
  @attachment()
  async addFile(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: Request,
  ) {
    return ok(await this.quotes.addFile(a.user, ws, id, file, requestMeta(req)));
  }

  @Delete('quotes/:id/files/:fileId')
  async removeFile(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Param('fileId') fileId: string,
    @Req() req: Request,
  ) {
    return ok(await this.quotes.removeFile(a.user, ws, id, parse(uuid, fileId), requestMeta(req)));
  }
}

/** Conversations for either workspace kind; participant checks in the service. */
@Controller('workspaces/:ws/conversations')
@UseGuards(CompanyAuthGuard)
export class ConversationController {
  constructor(private readonly conversations: ConversationService) {}

  @Get()
  async list(@Auth() a: AuthContext, @Param('ws') ws: string, @Query() q: unknown) {
    const r = await this.conversations.list(a.user, ws, parse(cursorQuery, q).cursor);
    return ok(r.items, r.next);
  }

  @Post()
  async start(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.conversations.start(
        a.user,
        ws,
        parse(conversationStartRequest, b),
        requestMeta(req),
      ),
    );
  }

  @Get(':id')
  async detail(@Auth() a: AuthContext, @Param('ws') ws: string, @Param('id') id: string) {
    return ok(await this.conversations.detail(a.user, ws, id));
  }

  @Get(':id/messages')
  async messages(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Query() q: unknown,
  ) {
    const r = await this.conversations.messages(a.user, ws, id, parse(cursorQuery, q).cursor);
    return ok(r.items, r.next);
  }

  @Post(':id/messages')
  async send(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.conversations.send(
        a.user,
        ws,
        id,
        parse(messageCreateRequest, b).body,
        requestMeta(req),
      ),
    );
  }

  @Post(':id/read')
  @HttpCode(200)
  async read(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
  ) {
    return ok(await this.conversations.read(a.user, ws, id, parse(readRequest, b).last_message_id));
  }
}

/** Per-user notifications and email preferences. */
@Controller('notifications')
@UseGuards(CompanyAuthGuard)
export class NotificationController {
  constructor(private readonly notifications: NotificationService) {}

  @Get()
  async list(@Auth() a: AuthContext, @Query() q: unknown) {
    const r = await this.notifications.list(a.user, parse(notificationListQuery, q));
    return ok(r.items, r.next);
  }

  @Get('unread')
  async unread(@Auth() a: AuthContext) {
    return ok(await this.notifications.unread(a.user));
  }

  @Get('preferences')
  async preferences(@Auth() a: AuthContext) {
    return ok(await this.notifications.preferences(a.user));
  }

  @Patch('preferences')
  async updatePreferences(@Auth() a: AuthContext, @Body() b: unknown) {
    return ok(
      await this.notifications.updatePreferences(a.user, parse(notificationPreferencesRequest, b)),
    );
  }

  @Post('read-all')
  @HttpCode(200)
  async readAll(@Auth() a: AuthContext) {
    return ok(await this.notifications.markAllRead(a.user));
  }

  @Post(':id/read')
  @HttpCode(200)
  async read(@Auth() a: AuthContext, @Param('id') id: string) {
    return ok(await this.notifications.markRead(a.user, id));
  }
}

/** Admin RFQ moderation (docs/04-admin.md). */
@Controller('admin/rfqs')
@UseGuards(AdminAuthGuard)
export class AdminRfqController {
  constructor(private readonly admin: AdminRfqService) {}

  @Get()
  @RequireAdmin('admin.rfqs.read')
  async list(@Query() q: unknown) {
    const r = await this.admin.list(parse(adminRfqQuery, q));
    return ok(r.items, r.next);
  }

  @Get(':id')
  @RequireAdmin('admin.rfqs.read')
  async detail(@Param('id') id: string) {
    return ok(await this.admin.detail(id));
  }

  @Post(':id/hide')
  @HttpCode(200)
  @RequireAdmin('admin.rfqs.moderate')
  async hide(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.admin.setHidden(
        a.user,
        id,
        true,
        parse(reasonRequest, b).reason,
        requestMeta(req),
      ),
    );
  }

  @Post(':id/unhide')
  @HttpCode(200)
  @RequireAdmin('admin.rfqs.moderate')
  async unhide(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.admin.setHidden(
        a.user,
        id,
        false,
        parse(reasonRequest, b).reason,
        requestMeta(req),
      ),
    );
  }
}
