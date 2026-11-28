import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  addressRequest,
  adminPaymentQuery,
  cartAddRequest,
  cartUpdateRequest,
  checkoutCreateRequest,
  checkoutPreviewRequest,
  orderListQuery,
  paymentStartRequest,
  reconciliationQuery,
  sandboxCompleteRequest,
} from '@app/contracts';
import type { AppEnv } from '@app/config';
import { completeSandboxSession, WEBHOOK_SIGNATURE_HEADER, type PrismaClient } from '@app/db';
import type { Request } from 'express';
import {
  AdminAuthGuard,
  Auth,
  CompanyAuthGuard,
  RequireAdmin,
  type AuthContext,
} from '../auth/guards';
import { ApiError } from '../common/api-error';
import { withIdempotency } from '../common/idempotency';
import { RateLimitService } from '../common/rate-limit.service';
import { requestMeta } from '../common/request-context';
import { parse } from '../common/validation';
import { APP_ENV, PRISMA } from '../infra/tokens';
import { AddressService } from './address.service';
import { CartService } from './cart.service';
import { CheckoutService } from './checkout.service';
import { OrderService } from './order.service';
import { PaymentWebhookService } from './payment-webhook.service';

const ok = <T>(data: T, next: string | null = null) => ({ data, meta: { next_cursor: next } });

/** Buyer addresses, cart, checkout and orders (docs/02-buyer.md). */
@Controller('buyer/workspaces/:ws')
@UseGuards(CompanyAuthGuard)
export class BuyerCommerceController {
  constructor(
    private readonly addresses: AddressService,
    private readonly cart: CartService,
    private readonly checkout: CheckoutService,
    private readonly orders: OrderService,
    private readonly limits: RateLimitService,
    @Inject(PRISMA) private readonly prisma: PrismaClient,
  ) {}

  @Get('addresses')
  async listAddresses(@Auth() a: AuthContext, @Param('ws') ws: string) {
    return ok(await this.addresses.list(a.user, ws));
  }

  @Post('addresses')
  async createAddress(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(await this.addresses.create(a.user, ws, parse(addressRequest, b), requestMeta(req)));
  }

  @Patch('addresses/:id')
  async updateAddress(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.addresses.update(a.user, ws, id, parse(addressRequest, b), requestMeta(req)),
    );
  }

  @Delete('addresses/:id')
  async archiveAddress(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return ok(await this.addresses.archive(a.user, ws, id, requestMeta(req)));
  }

  @Get('cart')
  async viewCart(@Auth() a: AuthContext, @Param('ws') ws: string) {
    return ok(await this.cart.view(a.user, ws));
  }

  @Post('cart/items')
  async addToCart(@Auth() a: AuthContext, @Param('ws') ws: string, @Body() b: unknown) {
    const body = parse(cartAddRequest, b);
    return ok(await this.cart.add(a.user, ws, body.sku_id, body.quantity));
  }

  @Patch('cart/items/:id')
  async updateCartItem(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
  ) {
    return ok(await this.cart.update(a.user, ws, id, parse(cartUpdateRequest, b).quantity));
  }

  @Delete('cart/items/:id')
  async removeCartItem(@Auth() a: AuthContext, @Param('ws') ws: string, @Param('id') id: string) {
    return ok(await this.cart.remove(a.user, ws, id));
  }

  @Post('checkout/preview')
  @HttpCode(200)
  async preview(@Auth() a: AuthContext, @Param('ws') ws: string, @Body() b: unknown) {
    return ok(await this.checkout.preview(a.user, ws, parse(checkoutPreviewRequest, b).address_id));
  }

  /** Create checkout and reserve stock: requires Idempotency-Key (docs/07-api.md). */
  @Post('checkouts')
  async createCheckout(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Body() b: unknown,
    @Headers('idempotency-key') key: string | undefined,
    @Req() req: Request,
  ) {
    const body = parse(checkoutCreateRequest, b);
    await this.limits.consume('checkout_user', a.user.id);
    return ok(
      await withIdempotency(this.prisma, a.user.id, key, `checkout:${ws}`, body, () =>
        this.checkout.create(a.user, ws, body, requestMeta(req)),
      ),
    );
  }

  @Get('checkouts/:id')
  async getCheckout(@Auth() a: AuthContext, @Param('ws') ws: string, @Param('id') id: string) {
    return ok(await this.checkout.get(a.user, ws, id));
  }

  /** Start or resume a payment session: requires Idempotency-Key. */
  @Post('checkouts/:id/pay')
  @HttpCode(200)
  async pay(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() b: unknown,
    @Headers('idempotency-key') key: string | undefined,
    @Req() req: Request,
  ) {
    const body = parse(paymentStartRequest, b ?? {});
    await this.limits.consume('checkout_user', a.user.id);
    return ok(
      await withIdempotency(this.prisma, a.user.id, key, `pay:${ws}:${id}`, body, () =>
        this.checkout.pay(a.user, ws, id, body, requestMeta(req)),
      ),
    );
  }

  @Post('checkouts/:id/cancel')
  @HttpCode(200)
  async cancel(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return ok(await this.checkout.cancel(a.user, ws, id, requestMeta(req)));
  }

  @Get('orders')
  async listOrders(@Auth() a: AuthContext, @Param('ws') ws: string, @Query() q: unknown) {
    const r = await this.orders.buyerList(a.user, ws, parse(orderListQuery, q));
    return ok(r.items, r.next);
  }

  @Get('orders/:id')
  async order(@Auth() a: AuthContext, @Param('ws') ws: string, @Param('id') id: string) {
    return ok(await this.orders.buyerDetail(a.user, ws, id));
  }
}

/** Seller orders (view only in Phase 4; fulfilment arrives in Phase 5). */
@Controller('seller/workspaces/:ws')
@UseGuards(CompanyAuthGuard)
export class SellerOrderController {
  constructor(private readonly orders: OrderService) {}

  @Get('orders')
  async list(@Auth() a: AuthContext, @Param('ws') ws: string, @Query() q: unknown) {
    const r = await this.orders.sellerList(a.user, ws, parse(orderListQuery, q));
    return ok(r.items, r.next);
  }

  @Get('orders/:id')
  async detail(@Auth() a: AuthContext, @Param('ws') ws: string, @Param('id') id: string) {
    return ok(await this.orders.sellerDetail(a.user, ws, id));
  }
}

/**
 * Provider webhooks. Authenticated by signature, not session, so the CSRF middleware excludes
 * this path. The raw request body is required for verification.
 */
@Controller('payments/webhooks')
export class PaymentWebhookController {
  constructor(
    private readonly webhooks: PaymentWebhookService,
    private readonly limits: RateLimitService,
  ) {}

  @Post(':provider')
  @HttpCode(200)
  async receive(
    @Param('provider') provider: string,
    @Headers(WEBHOOK_SIGNATURE_HEADER) signature: string | undefined,
    @Req() req: Request & { rawBody?: Buffer },
  ) {
    await this.limits.consume('payment_webhook_ip', req.ip ?? 'unknown');
    return ok(await this.webhooks.receive(provider, signature, req.rawBody, requestMeta(req)));
  }
}

/**
 * Sandbox hosted payment page backend (PAYMENT_MODE=mock only; 404 otherwise). Only a member of
 * the paying buyer workspace can view or complete the session. Nothing here marks an order paid:
 * completing queues a signed webhook that goes through the normal intake and worker.
 */
@Controller('sandbox/psp')
@UseGuards(CompanyAuthGuard)
export class SandboxPspController {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
  ) {}

  private async session(userId: string, id: string) {
    if (this.env.PAYMENT_MODE !== 'mock' || !/^ps_[0-9a-f]{32}$/.test(id))
      throw new ApiError('NOT_FOUND', 'common.not_found');
    const payment = await this.prisma.payment.findFirst({
      where: { providerRef: id, sandbox: true },
      include: { checkout: true },
    });
    if (!payment) throw new ApiError('NOT_FOUND', 'common.not_found');
    const member = await this.prisma.membership.findFirst({
      where: {
        userId,
        workspaceId: payment.checkout.buyerWorkspaceId,
        status: 'ACTIVE',
        role: { in: ['OWNER', 'PROCUREMENT'] },
      },
    });
    if (!member) throw new ApiError('NOT_FOUND', 'common.not_found');
    const s = await this.prisma.mockPspSession.findUnique({ where: { id } });
    if (!s) throw new ApiError('NOT_FOUND', 'common.not_found');
    return s;
  }

  @Get('sessions/:id')
  async get(@Auth() a: AuthContext, @Param('id') id: string) {
    const s = await this.session(a.user.id, id);
    return ok({
      id: s.id,
      amount_fils: s.amountFils.toString(),
      currency: s.currency,
      reference: s.reference,
      state: s.state,
      return_url: s.returnUrl,
    });
  }

  @Post('sessions/:id/complete')
  @HttpCode(200)
  async complete(@Auth() a: AuthContext, @Param('id') id: string, @Body() b: unknown) {
    const s = await this.session(a.user.id, id);
    const { outcome } = parse(sandboxCompleteRequest, b);
    const done = await completeSandboxSession(this.prisma, s.id, outcome);
    if (!done) throw new ApiError('CONFLICT', 'payment.session_closed');
    return ok({
      id: s.id,
      state: outcome === 'success' ? 'CAPTURED' : 'FAILED',
      return_url: s.returnUrl,
    });
  }
}

/** Admin orders, payments, ledger balances and reconciliation cases (read-only, Phase 4). */
@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminCommerceController {
  constructor(private readonly orders: OrderService) {}

  @Get('orders')
  @RequireAdmin('admin.orders.read')
  async list(@Query() q: unknown) {
    const r = await this.orders.adminList(parse(orderListQuery, q));
    return ok(r.items, r.next);
  }

  @Get('orders/:id')
  @RequireAdmin('admin.orders.read')
  async detail(@Param('id') id: string) {
    return ok(await this.orders.adminDetail(id));
  }

  @Get('finance/summary')
  @RequireAdmin('admin.finance.read')
  async summary() {
    return ok(await this.orders.adminFinanceSummary());
  }

  @Get('finance/payments')
  @RequireAdmin('admin.finance.read')
  async payments(@Query() q: unknown) {
    const r = await this.orders.adminPayments(parse(adminPaymentQuery, q));
    return ok(r.items, r.next);
  }

  @Get('finance/reconciliation')
  @RequireAdmin('admin.finance.read')
  async reconciliation(@Query() q: unknown) {
    const r = await this.orders.adminReconciliation(parse(reconciliationQuery, q));
    return ok(r.items, r.next);
  }
}
