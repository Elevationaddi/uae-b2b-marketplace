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
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  companyCreateRequest,
  companyUpdateRequest,
  documentUploadFields,
  renewalRequest,
  submitVerificationRequest,
  uuid,
} from '@app/contracts';
import type { Request, Response } from 'express';
import { requestMeta } from '../common/request-context';
import { parse } from '../common/validation';
import { Auth, CompanyAuthGuard, type AuthContext } from '../auth/guards';
import { CompaniesService } from './companies.service';

const ok = <T>(data: T) => ({ data, meta: { next_cursor: null } });
/** Hard ceiling for the multipart parser; the configured UPLOAD_MAX_BYTES is enforced by multer below. */
const MAX_UPLOAD = Number(process.env.UPLOAD_MAX_BYTES ?? 10 * 1024 * 1024);

@Controller()
@UseGuards(CompanyAuthGuard)
export class CompaniesController {
  constructor(private readonly companies: CompaniesService) {}

  @Get('companies')
  async list(@Auth() a: AuthContext) {
    return ok(await this.companies.listMine(a.user));
  }

  @Post('companies')
  async create(@Auth() a: AuthContext, @Body() body: unknown, @Req() req: Request) {
    return ok(
      await this.companies.create(a.user, parse(companyCreateRequest, body), requestMeta(req)),
    );
  }

  @Get('companies/:id')
  async get(@Auth() a: AuthContext, @Param('id') id: string) {
    return ok(await this.companies.get(a.user, parse(uuid, id)));
  }

  @Patch('companies/:id')
  async update(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.companies.update(
        a.user,
        parse(uuid, id),
        parse(companyUpdateRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Get('companies/:id/verification')
  async verification(@Auth() a: AuthContext, @Param('id') id: string) {
    return ok(await this.companies.verification(a.user, parse(uuid, id)));
  }

  @Post('companies/:id/verification')
  @HttpCode(200)
  async submit(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.companies.submit(
        a.user,
        parse(uuid, id),
        parse(submitVerificationRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Post('companies/:id/renewal')
  async renewal(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return ok(
      await this.companies.startRenewal(
        a.user,
        parse(uuid, id),
        parse(renewalRequest, body),
        requestMeta(req),
      ),
    );
  }

  @Post('companies/:id/documents')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_UPLOAD, files: 1, fields: 5 } }),
  )
  async upload(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    const fields = parse(documentUploadFields, body);
    return ok(
      await this.companies.uploadDocument(a.user, parse(uuid, id), file, fields, requestMeta(req)),
    );
  }

  @Delete('companies/:id/documents/:documentId')
  async removeDocument(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Param('documentId') documentId: string,
    @Req() req: Request,
  ) {
    await this.companies.deleteDocument(
      a.user,
      parse(uuid, id),
      parse(uuid, documentId),
      requestMeta(req),
    );
    return ok({ ok: true as const });
  }

  @Get('files/:id/download')
  async download(
    @Auth() a: AuthContext,
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const f = await this.companies.download(a.user, id, requestMeta(req));
    res.setHeader('Content-Type', f.mime);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(f.name)}`,
    );
    res.setHeader('Cache-Control', 'private, no-store');
    return new StreamableFile(f.stream);
  }
}
