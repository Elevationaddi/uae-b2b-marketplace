import {
  Body,
  Controller,
  Delete,
  Get,
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
  expectedVersionRequest,
  inventoryAdjustRequest,
  inventoryQuery,
  inventorySettingsRequest,
  mediaReorderRequest,
  mediaUploadFields,
  pricingRequest,
  productCreateRequest,
  productUpdateRequest,
  sellerProductsQuery,
  skuCreateRequest,
  skuUpdateRequest,
  storefrontMediaFields,
  storefrontUpdateRequest,
  uuid,
} from '@app/contracts';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { Auth, CompanyAuthGuard, type AuthContext } from '../auth/guards';
import { requestMeta } from '../common/request-context';
import { parse } from '../common/validation';
import { InventoryService } from './inventory.service';
import { MediaAccessService } from './media-access.service';
import { SellerProductsService } from './seller-products.service';
import { StorefrontService } from './storefront.service';

const ok = <T>(data: T, next: string | null = null) => ({ data, meta: { next_cursor: next } });
const IMAGE_MAX = 10 * 1024 * 1024;
const imageUpload = () =>
  UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: IMAGE_MAX, files: 1, fields: 5 } }),
  );
const cursorQuery = z.object({ cursor: z.string().max(200).optional() });

/** Seller catalog, storefront and inventory (docs/03-seller.md). Every route re-resolves membership. */
@Controller('seller/workspaces/:ws')
@UseGuards(CompanyAuthGuard)
export class SellerCatalogController {
  constructor(
    private readonly products: SellerProductsService,
    private readonly storefronts: StorefrontService,
    private readonly inventory: InventoryService,
    private readonly mediaAccess: MediaAccessService,
  ) {}

  @Get('overview')
  async overview(@Auth() a: AuthContext, @Param('ws') ws: string) {
    return ok(await this.products.overview(a.user, ws));
  }

  // ---------------------------------------------------------------- storefront

  @Get('storefront')
  async storefront(@Auth() a: AuthContext, @Param('ws') ws: string) {
    return ok(await this.storefronts.get(a.user, ws));
  }

  @Patch('storefront')
  async updateStorefront(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.storefronts.update(
        a.user,
        ws,
        parse(storefrontUpdateRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Post('storefront/publish')
  @HttpCode(200)
  async publishStorefront(@Auth() a: AuthContext, @Param('ws') ws: string, @Req() req: Request) {
    return ok(await this.storefronts.publish(a.user, ws, requestMeta(req)));
  }

  @Post('storefront/unpublish')
  @HttpCode(200)
  async unpublishStorefront(@Auth() a: AuthContext, @Param('ws') ws: string, @Req() req: Request) {
    return ok(await this.storefronts.unpublish(a.user, ws, requestMeta(req)));
  }

  @Post('storefront/media')
  @imageUpload()
  async addStorefrontMedia(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.storefronts.addMedia(
        a.user,
        ws,
        file,
        parse(storefrontMediaFields, body),
        requestMeta(req),
      ),
    );
  }

  @Delete('storefront/media/:mediaId')
  async removeStorefrontMedia(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('mediaId') mediaId: string,
    @Req() req: Request,
  ) {
    return ok(await this.storefronts.removeMedia(a.user, ws, mediaId, requestMeta(req)));
  }

  // ---------------------------------------------------------------- products

  @Get('products')
  list(@Auth() a: AuthContext, @Param('ws') ws: string, @Query() q: unknown) {
    return this.products.list(a.user, ws, parse(sellerProductsQuery, q));
  }

  @Post('products')
  async create(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.products.create(a.user, ws, parse(productCreateRequest, body), requestMeta(req)),
    );
  }

  @Get('products/:id')
  async detail(@Auth() a: AuthContext, @Param('ws') ws: string, @Param('id') id: string) {
    return ok(await this.products.detail(a.user, ws, id));
  }

  @Patch('products/:id')
  async update(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.products.update(
        a.user,
        ws,
        id,
        parse(productUpdateRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Post('products/:id/media')
  @imageUpload()
  async addMedia(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.products.addMedia(
        a.user,
        ws,
        id,
        file,
        parse(mediaUploadFields, body),
        requestMeta(req),
      ),
    );
  }

  @Post('products/:id/media/reorder')
  @HttpCode(200)
  async reorder(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.products.reorderMedia(
        a.user,
        ws,
        id,
        parse(mediaReorderRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Delete('products/:id/media/:fileId')
  async removeMedia(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Param('fileId') fileId: string,
    @Req() req: Request,
  ) {
    return ok(await this.products.removeMedia(a.user, ws, id, fileId, requestMeta(req)));
  }

  @Post('products/:id/skus')
  async addSku(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.products.addSku(a.user, ws, id, parse(skuCreateRequest, body), requestMeta(req)),
    );
  }

  @Patch('products/:id/skus/:skuId')
  async updateSku(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Param('skuId') skuId: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.products.updateSku(
        a.user,
        ws,
        id,
        skuId,
        parse(skuUpdateRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Delete('products/:id/skus/:skuId')
  async deleteSku(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Param('skuId') skuId: string,
    @Req() req: Request,
  ) {
    return ok(await this.products.deleteSku(a.user, ws, id, skuId, requestMeta(req)));
  }

  @Post('products/:id/pricing')
  @HttpCode(200)
  async pricing(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.products.setPricing(a.user, ws, id, parse(pricingRequest, body), requestMeta(req)),
    );
  }

  @Post('products/:id/duplicate')
  async duplicate(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return ok(await this.products.duplicate(a.user, ws, id, requestMeta(req)));
  }

  @Post('products/:id/submit')
  @HttpCode(200)
  async submit(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    const { expected_version: v } = parse(expectedVersionRequest, body);
    return ok(await this.products.submit(a.user, ws, id, v, requestMeta(req)));
  }

  @Post('products/:id/withdraw')
  @HttpCode(200)
  async withdraw(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    const { expected_version: v } = parse(expectedVersionRequest, body);
    return ok(await this.products.withdraw(a.user, ws, id, v, requestMeta(req)));
  }

  @Post('products/:id/archive')
  @HttpCode(200)
  async archive(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    const { expected_version: v } = parse(expectedVersionRequest, body);
    return ok(await this.products.archive(a.user, ws, id, v, requestMeta(req)));
  }

  @Post('products/:id/unpublish')
  @HttpCode(200)
  async unpublish(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    const { expected_version: v } = parse(expectedVersionRequest, body);
    return ok(await this.products.unpublish(a.user, ws, id, v, requestMeta(req)));
  }

  @Post('products/:id/republish')
  @HttpCode(200)
  async republish(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    const { expected_version: v } = parse(expectedVersionRequest, body);
    return ok(await this.products.republish(a.user, ws, id, v, requestMeta(req)));
  }

  @Post('products/:id/restore')
  @HttpCode(200)
  async restore(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    const { expected_version: v } = parse(expectedVersionRequest, body);
    return ok(await this.products.restore(a.user, ws, id, v, requestMeta(req)));
  }

  // ---------------------------------------------------------------- inventory

  @Get('inventory')
  async inventoryList(@Auth() a: AuthContext, @Param('ws') ws: string, @Query() q: unknown) {
    const r = await this.inventory.list(a.user, ws, parse(inventoryQuery, q));
    return ok(r.items, r.next_cursor);
  }

  @Post('inventory/:skuId/adjust')
  @HttpCode(200)
  async adjust(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('skuId') skuId: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.inventory.adjust(
        a.user,
        ws,
        skuId,
        parse(inventoryAdjustRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Patch('inventory/:skuId')
  async settings(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('skuId') skuId: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.inventory.settings(
        a.user,
        ws,
        skuId,
        parse(inventorySettingsRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Get('inventory/:skuId/movements')
  async movements(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('skuId') skuId: string,
    @Query() q: unknown,
  ) {
    const r = await this.inventory.movements(a.user, ws, skuId, parse(cursorQuery, q).cursor);
    return ok(r.items, r.next_cursor);
  }

  // ---------------------------------------------------------------- media

  @Get('media/:fileId')
  async media(
    @Auth() a: AuthContext,
    @Param('ws') ws: string,
    @Param('fileId') fileId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const m = await this.mediaAccess.seller(a.user.id, ws, parse(uuid, fileId));
    res.setHeader('Content-Type', m.mime);
    res.setHeader('Cache-Control', m.cache);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return new StreamableFile(m.stream);
  }
}
