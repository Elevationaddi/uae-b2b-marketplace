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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  adminDisputeCloseRequest,
  adminDisputeEvidenceRequest,
  adminDisputeProposeRequest,
  disputeListQuery,
  disputeMessageRequest,
  disputeOpenRequest,
  commissionPolicyCreateRequest,
  financeDecisionRequest,
  orderHoldCreateRequest,
  orderHoldListQuery,
  orderHoldReleaseRequest,
  payoutCreateRequest,
  payoutListQuery,
  refundCreateRequest,
  refundListQuery,
  reviewCreateRequest,
  reviewHideRequest,
  reviewListQuery,
  reconciliationResolveRequest,
  sandboxOperationCompleteRequest,
  shipmentDeliverRequest,
  shipmentDispatchRequest,
  sellerCancelRequest,
  uuid,
} from '@app/contracts';
import type { Request, Response } from 'express';
import type { Readable } from 'node:stream';
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
import { OrderService } from '../commerce/order.service';
import { DisputeService } from './dispute.service';
import { FinancialPolicyService } from './financial-policy.service';
import { FulfilmentService } from './fulfilment.service';
import { SettlementService } from './settlement.service';

const ok = <T>(data: T, next: string | null = null) => ({ data, meta: { next_cursor: next } });
const upload = () =>
  UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024, files: 1, fields: 2 } }),
  );

function sendFile(res: Response, f: { stream: Readable; mime: string; name: string }) {
  res.setHeader('Content-Type', f.mime);
  res.setHeader(
    'Content-Disposition',
    `attachment; filename*=UTF-8''${encodeURIComponent(f.name)}`,
  );
  res.setHeader('Cache-Control', 'private, no-store');
  return new StreamableFile(f.stream);
}

/** Seller fulfilment, disputes and finance (docs/03-seller.md). */
@Controller('seller/workspaces/:ws')
@UseGuards(CompanyAuthGuard)
export class SellerFulfilmentController {
  constructor(
    private readonly fulfilment: FulfilmentService,
    private readonly disputes: DisputeService,
    private readonly settlement: SettlementService,
    private readonly orders: OrderService,
    private readonly limits: RateLimitService,
  ) {}

  /** C-07: cancel a paid, undispatched order; a full refund goes to finance for approval. */
  @Post('orders/:id/cancel')
  @HttpCode(200)
  async cancel(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    await this.fulfilment.sellerCancel(
      a.user,
      ws,
      id,
      parse(sellerCancelRequest, b),
      requestMeta(req),
    );
    return ok(await this.orders.sellerDetail(a.user, ws, id));
  }

  @Post('orders/:id/process')
  @HttpCode(200)
  async process(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    await this.fulfilment.process(a.user, ws, id, requestMeta(req));
    return ok(await this.orders.sellerDetail(a.user, ws, id));
  }

  @Post('orders/:id/dispatch')
  @HttpCode(200)
  async dispatch(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    await this.fulfilment.dispatch(
      a.user,
      ws,
      id,
      parse(shipmentDispatchRequest, b),
      requestMeta(req),
    );
    return ok(await this.orders.sellerDetail(a.user, ws, id));
  }

  @Post('orders/:id/deliver')
  @HttpCode(200)
  @upload()
  async deliver(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: Request,
  ) {
    await this.limits.consume('upload_user', a.user.id);
    await this.fulfilment.deliver(
      a.user,
      ws,
      id,
      parse(shipmentDeliverRequest, b ?? {}),
      file,
      requestMeta(req),
    );
    return ok(await this.orders.sellerDetail(a.user, ws, id));
  }

  @Get('orders/:id/proof')
  async proof(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return sendFile(res, await this.fulfilment.proof(a.user, 'seller', ws, id, requestMeta(req)));
  }

  @Post('orders/:id/disputes')
  async openDispute(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    const r = await this.disputes.open(
      a.user,
      'seller',
      ws,
      id,
      parse(disputeOpenRequest, b),
      requestMeta(req),
    );
    return ok(await this.disputes.detail(a.user, 'seller', ws, r.id));
  }

  @Get('disputes')
  async listDisputes(@Auth() a: AuthContext, @Param('ws') ws: string, @Query() q: unknown) {
    const r = await this.disputes.list(a.user, 'seller', ws, parse(disputeListQuery, q));
    return ok(r.items, r.next);
  }

  @Get('disputes/:id')
  async dispute(@Auth() a: AuthContext, @Param('ws') ws: string, @Param('id') id: string) {
    return ok(await this.disputes.detail(a.user, 'seller', ws, id));
  }

  @Post('disputes/:id/messages')
  @upload()
  async message(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: Request,
  ) {
    await this.limits.consume('message_user', a.user.id);
    return ok(
      await this.disputes.message(
        a.user,
        'seller',
        ws,
        id,
        parse(disputeMessageRequest, b),
        file,
        requestMeta(req),
      ),
    );
  }

  @Get('disputes/:id/files/:fileId')
  async file(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Param('fileId') fileId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return sendFile(
      res,
      await this.disputes.download(a.user, 'seller', ws, id, parse(uuid, fileId), requestMeta(req)),
    );
  }

  @Get('finance')
  async finance(@Auth() a: AuthContext, @Param('ws') ws: string) {
    return ok(await this.settlement.sellerSummary(a.user, ws));
  }
}

/** Buyer receipt, disputes and reviews (docs/02-buyer.md). */
@Controller('buyer/workspaces/:ws')
@UseGuards(CompanyAuthGuard)
export class BuyerFulfilmentController {
  constructor(
    private readonly fulfilment: FulfilmentService,
    private readonly disputes: DisputeService,
    private readonly orders: OrderService,
    private readonly limits: RateLimitService,
  ) {}

  @Post('orders/:id/confirm-receipt')
  @HttpCode(200)
  async confirm(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    await this.fulfilment.confirmReceipt(a.user, ws, id, requestMeta(req));
    return ok(await this.orders.buyerDetail(a.user, ws, id));
  }

  @Post('orders/:id/review')
  async review(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    await this.fulfilment.review(a.user, ws, id, parse(reviewCreateRequest, b), requestMeta(req));
    return ok(await this.orders.buyerDetail(a.user, ws, id));
  }

  @Get('orders/:id/proof')
  async proof(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return sendFile(res, await this.fulfilment.proof(a.user, 'buyer', ws, id, requestMeta(req)));
  }

  @Post('orders/:id/disputes')
  async openDispute(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    const r = await this.disputes.open(
      a.user,
      'buyer',
      ws,
      id,
      parse(disputeOpenRequest, b),
      requestMeta(req),
    );
    return ok(await this.disputes.detail(a.user, 'buyer', ws, r.id));
  }

  @Get('disputes')
  async listDisputes(@Auth() a: AuthContext, @Param('ws') ws: string, @Query() q: unknown) {
    const r = await this.disputes.list(a.user, 'buyer', ws, parse(disputeListQuery, q));
    return ok(r.items, r.next);
  }

  @Get('disputes/:id')
  async dispute(@Auth() a: AuthContext, @Param('ws') ws: string, @Param('id') id: string) {
    return ok(await this.disputes.detail(a.user, 'buyer', ws, id));
  }

  @Post('disputes/:id/messages')
  @upload()
  async message(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: Request,
  ) {
    await this.limits.consume('message_user', a.user.id);
    return ok(
      await this.disputes.message(
        a.user,
        'buyer',
        ws,
        id,
        parse(disputeMessageRequest, b),
        file,
        requestMeta(req),
      ),
    );
  }

  @Get('disputes/:id/files/:fileId')
  async file(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Param('fileId') fileId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return sendFile(
      res,
      await this.disputes.download(a.user, 'buyer', ws, id, parse(uuid, fileId), requestMeta(req)),
    );
  }
}

/** Admin disputes (support), refunds and payouts (finance, dual control), review moderation. */
@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminFulfilmentController {
  constructor(
    private readonly fulfilment: FulfilmentService,
    private readonly disputes: DisputeService,
    private readonly settlement: SettlementService,
  ) {}

  @Get('disputes')
  @RequireAdmin('admin.disputes.read')
  async disputeList(@Auth() a: AuthContext, @Query() q: unknown) {
    const r = await this.disputes.adminList(a.user, parse(disputeListQuery, q));
    return ok(r.items, r.next);
  }

  @Get('disputes/:id')
  @RequireAdmin('admin.disputes.read')
  async dispute(@Auth() a: AuthContext, @Param('id') id: string) {
    return ok(
      await this.disputes.adminDetail(a.user, id, (a.adminRoles ?? []).includes('SUPPORT')),
    );
  }

  @Post('disputes/:id/assign')
  @HttpCode(200)
  @RequireAdmin('admin.disputes.manage')
  async assign(@Auth() a: AuthContext, @Param('id') id: string, @Req() req: Request) {
    return ok(await this.disputes.assign(a.user, id, requestMeta(req)));
  }

  @Post('disputes/:id/request-evidence')
  @HttpCode(200)
  @RequireAdmin('admin.disputes.manage')
  async evidence(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.disputes.requestEvidence(
        a.user,
        id,
        parse(adminDisputeEvidenceRequest, b),
        requestMeta(req),
      ),
    );
  }

  @Post('disputes/:id/propose')
  @HttpCode(200)
  @RequireAdmin('admin.disputes.manage')
  async propose(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.disputes.propose(
        a.user,
        id,
        parse(adminDisputeProposeRequest, b),
        requestMeta(req),
      ),
    );
  }

  @Post('disputes/:id/close')
  @HttpCode(200)
  @RequireAdmin('admin.disputes.manage')
  async close(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.disputes.close(a.user, id, parse(adminDisputeCloseRequest, b), requestMeta(req)),
    );
  }

  @Post('disputes/:id/messages')
  @RequireAdmin('admin.disputes.manage')
  async message(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.disputes.adminMessage(
        a.user,
        id,
        parse(disputeMessageRequest, b),
        requestMeta(req),
      ),
    );
  }

  @Get('disputes/:id/files/:fileId')
  @RequireAdmin('admin.disputes.read')
  async file(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Param('fileId') fileId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return sendFile(
      res,
      await this.disputes.download(
        a.user,
        'admin',
        null,
        id,
        parse(uuid, fileId),
        requestMeta(req),
      ),
    );
  }

  @Get('refunds')
  @RequireAdmin('admin.finance.read')
  async refunds(@Auth() a: AuthContext, @Query() q: unknown) {
    const r = await this.settlement.listRefunds(a.user, parse(refundListQuery, q));
    return ok(r.items, r.next);
  }

  @Post('refunds')
  @RequireAdmin('admin.refunds.request')
  async createRefund(@Auth() a: AuthContext, @Body() b: unknown, @Req() req: Request) {
    return ok(
      await this.settlement.createRefund(a.user, parse(refundCreateRequest, b), requestMeta(req)),
    );
  }

  @Post('refunds/:id/approve')
  @HttpCode(200)
  @RequireAdmin('admin.refunds.approve')
  async approveRefund(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.settlement.decideRefund(
        a.user,
        id,
        true,
        parse(financeDecisionRequest, b),
        requestMeta(req),
      ),
    );
  }

  @Post('refunds/:id/reject')
  @HttpCode(200)
  @RequireAdmin('admin.refunds.approve')
  async rejectRefund(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.settlement.decideRefund(
        a.user,
        id,
        false,
        parse(financeDecisionRequest, b),
        requestMeta(req),
      ),
    );
  }

  @Get('payouts/eligible')
  @RequireAdmin('admin.finance.read')
  async eligible() {
    return ok(await this.settlement.eligibleSellers());
  }

  @Get('payouts')
  @RequireAdmin('admin.finance.read')
  async payouts(@Auth() a: AuthContext, @Query() q: unknown) {
    const r = await this.settlement.listPayouts(a.user, parse(payoutListQuery, q));
    return ok(r.items, r.next);
  }

  @Post('payouts')
  @RequireAdmin('admin.payouts.request')
  async createPayout(@Auth() a: AuthContext, @Body() b: unknown, @Req() req: Request) {
    return ok(
      await this.settlement.createPayout(a.user, parse(payoutCreateRequest, b), requestMeta(req)),
    );
  }

  @Post('payouts/:id/approve')
  @HttpCode(200)
  @RequireAdmin('admin.payouts.approve')
  async approvePayout(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.settlement.decidePayout(
        a.user,
        id,
        true,
        parse(financeDecisionRequest, b),
        requestMeta(req),
      ),
    );
  }

  @Post('payouts/:id/reject')
  @HttpCode(200)
  @RequireAdmin('admin.payouts.approve')
  async rejectPayout(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.settlement.decidePayout(
        a.user,
        id,
        false,
        parse(financeDecisionRequest, b),
        requestMeta(req),
      ),
    );
  }

  /** Sandbox only: stands in for the provider finishing a refund or payout (labelled in the UI). */
  @Post('sandbox/operations/:ref/complete')
  @HttpCode(200)
  @RequireAdmin('admin.finance.read')
  async completeSandbox(
    @Auth() a: AuthContext,
    @Param('ref') ref: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    const { outcome } = parse(sandboxOperationCompleteRequest, b);
    return ok(await this.settlement.completeSandbox(a.user, ref, outcome, requestMeta(req)));
  }

  @Get('reviews')
  @RequireAdmin('admin.reviews.moderate')
  async reviews(@Query() q: unknown) {
    const r = await this.fulfilment.adminReviews(parse(reviewListQuery, q));
    return ok(r.items, r.next);
  }

  @Post('reviews/:id/hide')
  @HttpCode(200)
  @RequireAdmin('admin.reviews.moderate')
  async hide(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    await this.fulfilment.moderateReview(
      a.user,
      id,
      true,
      parse(reviewHideRequest, b),
      requestMeta(req),
    );
    return ok({ id, state: 'HIDDEN' });
  }

  @Post('reviews/:id/unhide')
  @HttpCode(200)
  @RequireAdmin('admin.reviews.moderate')
  async unhide(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    await this.fulfilment.moderateReview(
      a.user,
      id,
      false,
      parse(reviewHideRequest, b),
      requestMeta(req),
    );
    return ok({ id, state: 'PUBLISHED' });
  }
}

/** Phase 8: settlement holds, weekly payout run, commission policy, reconciliation resolution. */
@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminFinancialPolicyController {
  constructor(private readonly policy: FinancialPolicyService) {}

  @Get('holds')
  @RequireAdmin('admin.holds.manage')
  async holds(@Query() q: unknown) {
    const r = await this.policy.listHolds(parse(orderHoldListQuery, q));
    return ok(r.items, r.next);
  }

  @Post('holds')
  @RequireAdmin('admin.holds.manage')
  async placeHold(@Auth() a: AuthContext, @Body() b: unknown, @Req() req: Request) {
    return ok(
      await this.policy.placeHold(a.user, parse(orderHoldCreateRequest, b), requestMeta(req)),
    );
  }

  @Post('holds/:id/release')
  @HttpCode(200)
  @RequireAdmin('admin.holds.manage')
  async releaseHold(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.policy.releaseHold(
        a.user,
        id,
        parse(orderHoldReleaseRequest, b),
        requestMeta(req),
      ),
    );
  }

  @Get('payouts/run')
  @RequireAdmin('admin.finance.read')
  async payoutRun() {
    return ok(await this.policy.payoutRun());
  }

  @Get('finance/commission')
  @RequireAdmin('admin.finance.read')
  async commission(@Auth() a: AuthContext) {
    return ok(await this.policy.commission(a.adminRoles ?? []));
  }

  @Post('finance/commission')
  @HttpCode(200)
  @RequireAdmin('admin.commission.manage')
  async setCommission(@Auth() a: AuthContext, @Body() b: unknown, @Req() req: Request) {
    return ok(
      await this.policy.setCommission(
        a.user,
        a.adminRoles ?? [],
        parse(commissionPolicyCreateRequest, b),
        requestMeta(req),
      ),
    );
  }

  @Post('finance/reconciliation/:id/resolve')
  @HttpCode(200)
  @RequireAdmin('admin.reconciliation.resolve')
  async resolve(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.policy.resolveReconciliation(
        a.user,
        id,
        parse(reconciliationResolveRequest, b),
        requestMeta(req),
      ),
    );
  }
}
