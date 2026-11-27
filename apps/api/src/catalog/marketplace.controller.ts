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
  UseGuards,
} from '@nestjs/common';
import {
  estimateQuery,
  marketplaceSearchQuery,
  preferencesRequest,
  suggestQuery,
  supplierDirectoryQuery,
  uuid,
} from '@app/contracts';
import type { Request, Response } from 'express';
import { Auth, CompanyAuthGuard, type AuthContext } from '../auth/guards';
import { cookieName } from '../auth/cookies';
import { SessionService } from '../auth/session.service';
import { RateLimitService } from '../common/rate-limit.service';
import { parse } from '../common/validation';
import { BuyerListsService } from './buyer-lists.service';
import { MarketplaceService, type Viewer } from './marketplace.service';
import { MediaAccessService } from './media-access.service';

const ok = <T>(data: T, next: string | null = null) => ({ data, meta: { next_cursor: next } });

/**
 * Public marketplace (A12): guests browse approved listings; the session cookie, when present and
 * valid, upgrades the viewer (prices for email-verified users). Responses vary per viewer, so they
 * are marked private and never shared-cached.
 */
@Controller('marketplace')
export class MarketplaceController {
  constructor(
    private readonly market: MarketplaceService,
    private readonly sessions: SessionService,
    private readonly limits: RateLimitService,
  ) {}

  private async viewer(req: Request, res: Response): Promise<Viewer> {
    await this.limits.consume('search_ip', req.ip ?? 'unknown');
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('Vary', 'Cookie');
    const token = req.cookies?.[cookieName(this.sessions.appEnv, 'company')] as string | undefined;
    const resolved = token ? await this.sessions.resolve(token, 'COMPANY') : null;
    return this.market.viewerFor(resolved?.user ?? null);
  }

  @Get('home')
  async home(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return ok(await this.market.home(await this.viewer(req, res)));
  }

  @Get('categories')
  async categories(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.viewer(req, res);
    return ok(await this.market.categories());
  }

  @Get('categories/:id')
  async category(@Param('id') id: string, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.viewer(req, res);
    return ok(await this.market.category(id));
  }

  @Get('products')
  async search(@Query() q: unknown, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const viewer = await this.viewer(req, res);
    const r = await this.market.search(parse(marketplaceSearchQuery, q), viewer);
    const { next_cursor, ...data } = r;
    return ok(data, next_cursor);
  }

  @Get('suggest')
  async suggest(@Query() q: unknown, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.viewer(req, res);
    return ok(await this.market.suggest(parse(suggestQuery, q).q));
  }

  @Get('products/:id')
  async product(@Param('id') id: string, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return ok(await this.market.product(id, await this.viewer(req, res)));
  }

  @Get('products/:id/related')
  async related(@Param('id') id: string, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return ok((await this.market.related(id, await this.viewer(req, res))).items);
  }

  @Get('products/:id/estimate')
  async estimate(@Param('id') id: string, @Query() q: unknown, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const viewer = await this.viewer(req, res);
    const input = parse(estimateQuery, q);
    return ok(await this.market.estimate(id, input.sku_id, input.quantity, viewer));
  }

  @Get('suppliers')
  async suppliers(@Query() q: unknown, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.viewer(req, res);
    const r = await this.market.suppliers(parse(supplierDirectoryQuery, q));
    return ok({ items: r.items, total: r.total }, r.next_cursor);
  }

  @Get('suppliers/:id')
  async supplier(@Param('id') id: string, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return ok(await this.market.supplier(id, await this.viewer(req, res)));
  }
}

/** Per-user buyer lists: email-verified accounts only (CompanyAuthGuard enforces verification). */
@Controller('marketplace')
@UseGuards(CompanyAuthGuard)
export class BuyerListsController {
  constructor(
    private readonly lists: BuyerListsService,
    private readonly market: MarketplaceService,
    private readonly limits: RateLimitService,
  ) {}

  private async viewer(a: AuthContext): Promise<Viewer> {
    await this.limits.consume('lists_user', a.user.id);
    return this.market.viewerFor(a.user);
  }

  @Get('saved/products')
  async savedProducts(@Auth() a: AuthContext) {
    return ok((await this.lists.savedProducts(await this.viewer(a))).items);
  }

  @Get('saved/suppliers')
  async savedSuppliers(@Auth() a: AuthContext) {
    return ok((await this.lists.savedSuppliers(await this.viewer(a))).items);
  }

  @Post('saved/products/:id')
  @HttpCode(200)
  async saveProduct(@Auth() a: AuthContext, @Param('id') id: string) {
    return ok(await this.lists.save(await this.viewer(a), 'product', id));
  }

  @Delete('saved/products/:id')
  async unsaveProduct(@Auth() a: AuthContext, @Param('id') id: string) {
    return ok(await this.lists.unsave(await this.viewer(a), 'product', id));
  }

  @Post('saved/suppliers/:id')
  @HttpCode(200)
  async saveSupplier(@Auth() a: AuthContext, @Param('id') id: string) {
    return ok(await this.lists.save(await this.viewer(a), 'supplier', id));
  }

  @Delete('saved/suppliers/:id')
  async unsaveSupplier(@Auth() a: AuthContext, @Param('id') id: string) {
    return ok(await this.lists.unsave(await this.viewer(a), 'supplier', id));
  }

  @Get('compare')
  async compare(@Auth() a: AuthContext) {
    return ok((await this.lists.compare(await this.viewer(a))).items);
  }

  @Post('compare/:id')
  @HttpCode(200)
  async addCompare(@Auth() a: AuthContext, @Param('id') id: string) {
    return ok((await this.lists.addCompare(await this.viewer(a), id)).items);
  }

  @Delete('compare/:id')
  async removeCompare(@Auth() a: AuthContext, @Param('id') id: string) {
    return ok((await this.lists.removeCompare(await this.viewer(a), id)).items);
  }

  @Get('recent')
  async recent(@Auth() a: AuthContext) {
    return ok((await this.lists.recent(await this.viewer(a))).items);
  }

  @Post('recent/:id')
  @HttpCode(200)
  async recordView(@Auth() a: AuthContext, @Param('id') id: string) {
    return ok(await this.lists.recordView(await this.viewer(a), id));
  }

  @Delete('recent')
  async clearRecent(@Auth() a: AuthContext) {
    return ok((await this.lists.clearRecent(await this.viewer(a))).items);
  }

  @Get('preferences')
  async preferences(@Auth() a: AuthContext) {
    return ok(await this.lists.preferences(await this.viewer(a)));
  }

  @Patch('preferences')
  async updatePreferences(@Auth() a: AuthContext, @Body() body: unknown) {
    return ok(await this.lists.updatePreferences(await this.viewer(a), parse(preferencesRequest, body)));
  }
}

/** Public marketplace images (re-checked on every request; see MediaAccessService). */
@Controller('media')
export class PublicMediaController {
  constructor(
    private readonly mediaAccess: MediaAccessService,
    private readonly limits: RateLimitService,
  ) {}

  @Get(':id')
  async get(@Param('id') id: string, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.limits.consume('search_ip', req.ip ?? 'unknown');
    const m = await this.mediaAccess.public(parse(uuid, id));
    res.setHeader('Content-Type', m.mime);
    res.setHeader('Cache-Control', m.cache);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    return new StreamableFile(m.stream);
  }
}
