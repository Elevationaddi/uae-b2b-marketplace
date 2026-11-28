import {
  Module,
  type DynamicModule,
  type MiddlewareConsumer,
  type NestModule,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import type { AppEnv } from '@app/config';
import { LoggerModule } from 'nestjs-pino';
import { AdminAuthController } from './admin/admin-auth.controller';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { MfaService } from './admin/mfa.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AdminAuthGuard, CompanyAuthGuard } from './auth/guards';
import { PasswordService } from './auth/password.service';
import { SessionService } from './auth/session.service';
import { UserTokenService } from './auth/tokens.service';
import { CsrfMiddleware } from './common/csrf.middleware';
import { ErrorEnvelopeFilter } from './common/error.filter';
import { RateLimitService } from './common/rate-limit.service';
import { CompaniesController } from './companies/companies.controller';
import { CompaniesService } from './companies/companies.service';
import { ScannerService } from './files/scanner.service';
import { StorageService } from './files/storage.service';
import { TeamController } from './team/team.controller';
import { TeamService } from './team/team.service';
import { genRequestId } from './common/request-id';
import { HealthController } from './health/health.controller';
import { InfraModule } from './infra/infra.module';
import { AdminCatalogController } from './catalog/admin-catalog.controller';
import { AdminCatalogService } from './catalog/admin-catalog.service';
import { BuyerListsService } from './catalog/buyer-lists.service';
import { InventoryService } from './catalog/inventory.service';
import {
  BuyerListsController,
  MarketplaceController,
  PublicMediaController,
} from './catalog/marketplace.controller';
import { MarketplaceService } from './catalog/marketplace.service';
import { MediaAccessService } from './catalog/media-access.service';
import { MediaService } from './catalog/media.service';
import { SellerCatalogController } from './catalog/seller-catalog.controller';
import { SellerProductsService } from './catalog/seller-products.service';
import { StorefrontService } from './catalog/storefront.service';
import { AdminRfqService } from './rfq/admin-rfq.service';
import { AttachmentService } from './rfq/attachments';
import { ConversationService } from './rfq/conversation.service';
import { NotificationService } from './rfq/notification.service';
import { QuoteService } from './rfq/quote.service';
import {
  AdminRfqController,
  BuyerRfqController,
  ConversationController,
  NotificationController,
  SellerRfqController,
} from './rfq/rfq.controller';
import { RfqService } from './rfq/rfq.service';
import { AddressService } from './commerce/address.service';
import { CartService } from './commerce/cart.service';
import { CheckoutService } from './commerce/checkout.service';
import { CommerceConfig } from './commerce/commerce-common';
import {
  AdminCommerceController,
  BuyerCommerceController,
  PaymentWebhookController,
  SandboxPspController,
  SellerOrderController,
} from './commerce/commerce.controller';
import { OrderService } from './commerce/order.service';
import { PaymentWebhookService } from './commerce/payment-webhook.service';
import { DisputeService } from './fulfilment/dispute.service';
import { FinancialPolicyService } from './fulfilment/financial-policy.service';
import {
  AdminFinancialPolicyController,
  AdminFulfilmentController,
  BuyerFulfilmentController,
  SellerFulfilmentController,
} from './fulfilment/fulfilment.controller';
import { FulfilmentService } from './fulfilment/fulfilment.service';
import { SettlementService } from './fulfilment/settlement.service';
import { ExportService } from './operations/export.service';
import { AdminOperationsController, SupportController } from './operations/operations.controller';
import { OverviewService } from './operations/overview.service';
import { SupportService } from './operations/support.service';

/** Paths redacted from every log line (docs/10-security.md: no credentials or tokens in logs). */
export const LOG_REDACT_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.headers["x-csrf-token"]',
  'req.headers["idempotency-key"]',
  'res.headers["set-cookie"]',
  '*.password',
  '*.token',
  '*.secret',
];

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CsrfMiddleware).forRoutes('*');
  }

  static forRoot(env: AppEnv): DynamicModule {
    return {
      module: AppModule,
      imports: [
        InfraModule.forRoot(env),
        LoggerModule.forRoot({
          pinoHttp: {
            level: env.LOG_LEVEL,
            genReqId: genRequestId,
            redact: { paths: LOG_REDACT_PATHS, censor: '[redacted]' },
            // Query strings may carry tokens; log the path only.
            serializers: {
              req: (req: { id: string; method: string; url: string }) => ({
                id: req.id,
                method: req.method,
                path: req.url.split('?')[0],
              }),
            },
            transport:
              env.NODE_ENV === 'development'
                ? { target: 'pino-pretty', options: { singleLine: true } }
                : undefined,
          },
        }),
      ],
      controllers: [
        HealthController,
        AuthController,
        CompaniesController,
        TeamController,
        AdminAuthController,
        AdminController,
        MarketplaceController,
        BuyerListsController,
        PublicMediaController,
        SellerCatalogController,
        AdminCatalogController,
        BuyerRfqController,
        SellerRfqController,
        ConversationController,
        NotificationController,
        AdminRfqController,
        BuyerCommerceController,
        SellerOrderController,
        PaymentWebhookController,
        SandboxPspController,
        AdminCommerceController,
        SellerFulfilmentController,
        BuyerFulfilmentController,
        AdminFulfilmentController,
        AdminFinancialPolicyController,
        SupportController,
        AdminOperationsController,
      ],
      providers: [
        { provide: APP_FILTER, useClass: ErrorEnvelopeFilter },
        CsrfMiddleware,
        RateLimitService,
        PasswordService,
        SessionService,
        UserTokenService,
        AuthService,
        CompanyAuthGuard,
        AdminAuthGuard,
        StorageService,
        ScannerService,
        CompaniesService,
        TeamService,
        MfaService,
        AdminService,
        MediaService,
        MediaAccessService,
        SellerProductsService,
        InventoryService,
        StorefrontService,
        MarketplaceService,
        BuyerListsService,
        AdminCatalogService,
        AttachmentService,
        RfqService,
        QuoteService,
        ConversationService,
        NotificationService,
        AdminRfqService,
        CommerceConfig,
        AddressService,
        CartService,
        CheckoutService,
        OrderService,
        PaymentWebhookService,
        FulfilmentService,
        DisputeService,
        SettlementService,
        FinancialPolicyService,
        SupportService,
        OverviewService,
        ExportService,
      ],
    };
  }
}
