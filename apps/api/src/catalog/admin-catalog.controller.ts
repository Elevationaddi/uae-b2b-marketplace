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
  adminProductsQuery,
  adminStorefrontsQuery,
  attributeCreateRequest,
  attributeUpdateRequest,
  catalogDecisionRequest,
  catalogQueueQuery,
  categoryCreateRequest,
  categoryUpdateRequest,
  featuredCreateRequest,
  reasonRequest,
  restrictedTermCreateRequest,
  restrictedTermUpdateRequest,
  uuid,
} from '@app/contracts';
import type { Request, Response } from 'express';
import { AdminAuthGuard, Auth, RequireAdmin, type AuthContext } from '../auth/guards';
import { requestMeta } from '../common/request-context';
import { parse } from '../common/validation';
import { AdminCatalogService } from './admin-catalog.service';
import { MediaAccessService } from './media-access.service';

const ok = <T>(data: T) => ({ data, meta: { next_cursor: null } });

/** Admin catalog (docs/04-admin.md). Capabilities per role are in packages/contracts permissions. */
@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminCatalogController {
  constructor(
    private readonly catalog: AdminCatalogService,
    private readonly mediaAccess: MediaAccessService,
  ) {}

  @Get('catalog/overview')
  @RequireAdmin('admin.catalog.read')
  async overview() {
    return ok(await this.catalog.overview());
  }

  @Get('catalog/queue')
  @RequireAdmin('admin.catalog.read')
  queue(@Query() q: unknown) {
    return this.catalog.queue(parse(catalogQueueQuery, q));
  }

  @Get('catalog/reviews/:versionId')
  @RequireAdmin('admin.catalog.read')
  async review(@Param('versionId') id: string) {
    return ok(await this.catalog.review(parse(uuid, id)));
  }

  @Post('catalog/reviews/:versionId/decision')
  @HttpCode(200)
  @RequireAdmin('admin.catalog.review')
  async decide(
    @Auth() a: AuthContext,
    @Param('versionId') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.catalog.decide(
        a.user,
        parse(uuid, id),
        parse(catalogDecisionRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Get('catalog/products')
  @RequireAdmin('admin.catalog.read')
  products(@Query() q: unknown) {
    return this.catalog.products(parse(adminProductsQuery, q));
  }

  @Get('catalog/products/:id')
  @RequireAdmin('admin.catalog.read')
  async product(@Param('id') id: string) {
    return ok(await this.catalog.product(parse(uuid, id)));
  }

  @Post('catalog/products/:id/suspend')
  @HttpCode(200)
  @RequireAdmin('admin.catalog.enforce')
  async suspendProduct(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    const { reason } = parse(reasonRequest, body);
    return ok(
      await this.catalog.enforce(a.user, parse(uuid, id), 'suspend', reason, requestMeta(req)),
    );
  }

  @Post('catalog/products/:id/restore')
  @HttpCode(200)
  @RequireAdmin('admin.catalog.enforce')
  async restoreProduct(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    const { reason } = parse(reasonRequest, body);
    return ok(
      await this.catalog.enforce(a.user, parse(uuid, id), 'restore', reason, requestMeta(req)),
    );
  }

  @Post('catalog/products/:id/remove')
  @HttpCode(200)
  @RequireAdmin('admin.catalog.enforce')
  async removeProduct(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    const { reason } = parse(reasonRequest, body);
    return ok(
      await this.catalog.enforce(a.user, parse(uuid, id), 'remove', reason, requestMeta(req)),
    );
  }

  @Get('storefronts')
  @RequireAdmin('admin.catalog.read')
  storefronts(@Query() q: unknown) {
    return this.catalog.storefronts(parse(adminStorefrontsQuery, q));
  }

  @Get('storefronts/:id')
  @RequireAdmin('admin.catalog.read')
  async storefront(@Param('id') id: string) {
    return ok(await this.catalog.storefront(parse(uuid, id)));
  }

  @Post('storefronts/:id/hide')
  @HttpCode(200)
  @RequireAdmin('admin.catalog.enforce')
  async hideStorefront(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    const { reason } = parse(reasonRequest, body);
    return ok(
      await this.catalog.storefrontEnforce(
        a.user,
        parse(uuid, id),
        'hide',
        reason,
        requestMeta(req),
      ),
    );
  }

  @Post('storefronts/:id/restore')
  @HttpCode(200)
  @RequireAdmin('admin.catalog.enforce')
  async restoreStorefront(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    const { reason } = parse(reasonRequest, body);
    return ok(
      await this.catalog.storefrontEnforce(
        a.user,
        parse(uuid, id),
        'restore',
        reason,
        requestMeta(req),
      ),
    );
  }

  @Get('categories')
  @RequireAdmin('admin.catalog.read')
  async categories() {
    return ok(await this.catalog.categories());
  }

  @Post('categories')
  @RequireAdmin('admin.categories.manage')
  async createCategory(@Auth() a: AuthContext, @Body() body: unknown, @Req() req: Request) {
    return ok(
      await this.catalog.createCategory(
        a.user,
        parse(categoryCreateRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Get('categories/:id')
  @RequireAdmin('admin.catalog.read')
  async category(@Param('id') id: string) {
    return ok(await this.catalog.category(parse(uuid, id)));
  }

  @Patch('categories/:id')
  @RequireAdmin('admin.categories.manage')
  async updateCategory(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.catalog.updateCategory(
        a.user,
        parse(uuid, id),
        parse(categoryUpdateRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Post('categories/:id/image')
  @RequireAdmin('admin.categories.manage')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024, files: 1, fields: 2 } }),
  )
  async categoryImage(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: Request,
  ) {
    return ok(await this.catalog.setCategoryImage(a.user, parse(uuid, id), file, requestMeta(req)));
  }

  @Post('categories/:id/attributes')
  @RequireAdmin('admin.categories.manage')
  async createAttribute(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.catalog.createAttribute(
        a.user,
        parse(uuid, id),
        parse(attributeCreateRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Patch('category-attributes/:id')
  @RequireAdmin('admin.categories.manage')
  async updateAttribute(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.catalog.updateAttribute(
        a.user,
        parse(uuid, id),
        parse(attributeUpdateRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Get('restricted-terms')
  @RequireAdmin('admin.catalog.read')
  async restricted() {
    return ok(await this.catalog.restrictedTerms());
  }

  @Post('restricted-terms')
  @RequireAdmin('admin.restricted.manage')
  async createRestricted(@Auth() a: AuthContext, @Body() body: unknown, @Req() req: Request) {
    return ok(
      await this.catalog.createRestrictedTerm(
        a.user,
        parse(restrictedTermCreateRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Patch('restricted-terms/:id')
  @RequireAdmin('admin.restricted.manage')
  async updateRestricted(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.catalog.updateRestrictedTerm(
        a.user,
        parse(uuid, id),
        parse(restrictedTermUpdateRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Get('featured')
  @RequireAdmin('admin.catalog.read')
  async featured() {
    return ok(await this.catalog.featured());
  }

  @Post('featured')
  @RequireAdmin('admin.featured.manage')
  async addFeatured(@Auth() a: AuthContext, @Body() body: unknown, @Req() req: Request) {
    return ok(
      await this.catalog.addFeatured(a.user, parse(featuredCreateRequest, body), requestMeta(req)),
    );
  }

  @Delete('featured/:id')
  @RequireAdmin('admin.featured.manage')
  async removeFeatured(@Auth() a: AuthContext, @Param('id') id: string, @Req() req: Request) {
    return ok(await this.catalog.removeFeatured(a.user, parse(uuid, id), requestMeta(req)));
  }

  @Get('media/:id')
  @RequireAdmin('admin.catalog.read')
  async media(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const m = await this.mediaAccess.admin(parse(uuid, id));
    res.setHeader('Content-Type', m.mime);
    res.setHeader('Cache-Control', m.cache);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return new StreamableFile(m.stream);
  }
}
