import { Inject, Injectable } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import {
  CURRENT_TERMS_VERSION,
  type companyCreateRequest,
  type companyUpdateRequest,
  type renewalRequest,
} from '@app/contracts';
import {
  Prisma,
  enqueueEmail,
  isLicenceExpired,
  todayUtc,
  writeAudit,
  type DocumentType,
  type PrismaClient,
  type User,
  type VerificationState,
} from '@app/db';
import { randomUUID } from 'node:crypto';
import type { Readable } from 'node:stream';
import type { z } from 'zod';
import { ApiError } from '../common/api-error';
import { sha256 } from '../common/crypto';
import { RateLimitService } from '../common/rate-limit.service';
import type { RequestMeta } from '../common/request-context';
import { ScannerService, sanitizeFilename, sniffMime } from '../files/scanner.service';
import { StorageService } from '../files/storage.service';
import { APP_ENV, PRISMA } from '../infra/tokens';
import { loadCompanyAccess, requireCapability } from './access';
import {
  CASE_INCLUDE,
  EDITABLE_CASE_STATES,
  adminActorIds,
  companyEditable,
  mapCase,
  mapCompany,
  mapDocument,
} from './mappers';

const REQUIRED_DOCUMENTS: DocumentType[] = ['TRADE_LICENCE', 'AUTHORIZED_REPRESENTATIVE'];
const ACTIVE_CASE_WHERE = { state: { notIn: ['APPROVED', 'CLOSED'] as VerificationState[] } };

function dateFromIso(d: string): Date {
  return new Date(`${d}T00:00:00.000Z`);
}

function assertFutureExpiry(iso: string, field = 'licence_expiry'): void {
  const d = dateFromIso(iso);
  if (Number.isNaN(d.getTime()) || isLicenceExpired(d) || d.getTime() === todayUtc().getTime()) {
    throw new ApiError('VALIDATION_FAILED', 'company.licence_expiry_future', { [field]: 'future' });
  }
}

function isUniqueViolation(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
}

@Injectable()
export class CompaniesService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
    private readonly storage: StorageService,
    private readonly scanner: ScannerService,
    private readonly limits: RateLimitService,
  ) {}

  async listMine(user: User) {
    const companies = await this.prisma.company.findMany({
      where: {
        workspaces: { some: { memberships: { some: { userId: user.id, status: 'ACTIVE' } } } },
      },
      include: { workspaces: true },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      take: 50,
    });
    return companies.map(mapCompany);
  }

  async create(user: User, input: z.infer<typeof companyCreateRequest>, meta: RequestMeta) {
    await this.limits.consume('company_create_user', user.id);
    assertFutureExpiry(input.licence_expiry);
    try {
      const company = await this.prisma.$transaction(async (tx) => {
        const c = await tx.company.create({
          data: {
            legalName: input.legal_name,
            displayName: input.display_name,
            licenceNumber: input.licence_number,
            licenceIssuer: input.licence_issuer,
            licenceExpiry: dateFromIso(input.licence_expiry),
            activity: input.activity,
            emirate: input.emirate,
            trn: input.trn ?? null,
            contactEmail: input.contact_email,
            contactPhone: input.contact_phone,
            createdById: user.id,
          },
        });
        for (const kind of input.kinds) {
          const ws = await tx.workspace.create({ data: { companyId: c.id, kind } });
          await tx.membership.create({
            data: { workspaceId: ws.id, userId: user.id, role: 'OWNER' },
          });
        }
        const vc = await tx.verificationCase.create({ data: { companyId: c.id, kind: 'INITIAL' } });
        await tx.verificationCaseEvent.create({
          data: { caseId: vc.id, actorId: user.id, toState: 'DRAFT' },
        });
        await writeAudit(tx, {
          actorId: user.id,
          actorType: 'user',
          action: 'company.created',
          resourceType: 'company',
          resourceId: c.id,
          companyId: c.id,
          details: { kinds: input.kinds },
          requestId: meta.requestId,
          ip: meta.ip,
        });
        return tx.company.findUniqueOrThrow({ where: { id: c.id }, include: { workspaces: true } });
      });
      return mapCompany(company);
    } catch (err) {
      if (isUniqueViolation(err)) {
        throw new ApiError('CONFLICT', 'company.licence_exists', { licence_number: 'exists' });
      }
      throw err;
    }
  }

  async get(user: User, companyId: string) {
    await loadCompanyAccess(this.prisma, user.id, companyId);
    const c = await this.prisma.company.findUniqueOrThrow({
      where: { id: companyId },
      include: { workspaces: true },
    });
    return mapCompany(c);
  }

  async update(
    user: User,
    companyId: string,
    input: z.infer<typeof companyUpdateRequest>,
    meta: RequestMeta,
  ) {
    const access = await loadCompanyAccess(this.prisma, user.id, companyId);
    requireCapability(access, 'company.manage');
    if (input.licence_expiry) assertFutureExpiry(input.licence_expiry);
    const { expected_version, ...fields } = input;
    const data: Prisma.CompanyUpdateManyMutationInput = {
      ...(fields.legal_name !== undefined && { legalName: fields.legal_name }),
      ...(fields.display_name !== undefined && { displayName: fields.display_name }),
      ...(fields.licence_number !== undefined && { licenceNumber: fields.licence_number }),
      ...(fields.licence_issuer !== undefined && { licenceIssuer: fields.licence_issuer }),
      ...(fields.licence_expiry !== undefined && {
        licenceExpiry: dateFromIso(fields.licence_expiry),
      }),
      ...(fields.activity !== undefined && { activity: fields.activity }),
      ...(fields.emirate !== undefined && { emirate: fields.emirate }),
      ...(fields.trn !== undefined && { trn: fields.trn ?? null }),
      ...(fields.contact_email !== undefined && { contactEmail: fields.contact_email }),
      ...(fields.contact_phone !== undefined && { contactPhone: fields.contact_phone }),
      version: { increment: 1 },
    };
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Conditional update: only editable statuses and only the expected version (stale -> 409).
        const res = await tx.company.updateMany({
          where: {
            id: companyId,
            version: expected_version,
            status: { in: ['DRAFT', 'NEEDS_INFO', 'REJECTED'] },
          },
          data,
        });
        if (res.count === 0) {
          const current = await tx.company.findUniqueOrThrow({ where: { id: companyId } });
          if (!companyEditable(current)) throw new ApiError('CONFLICT', 'company.not_editable');
          throw new ApiError('CONFLICT', 'common.stale_version');
        }
        await writeAudit(tx, {
          actorId: user.id,
          actorType: 'user',
          action: 'company.updated',
          resourceType: 'company',
          resourceId: companyId,
          companyId,
          details: { fields: Object.keys(fields) },
          requestId: meta.requestId,
          ip: meta.ip,
        });
        return mapCompany(
          await tx.company.findUniqueOrThrow({
            where: { id: companyId },
            include: { workspaces: true },
          }),
        );
      });
    } catch (err) {
      if (isUniqueViolation(err))
        throw new ApiError('CONFLICT', 'company.licence_exists', { licence_number: 'exists' });
      throw err;
    }
  }

  async verification(user: User, companyId: string) {
    await loadCompanyAccess(this.prisma, user.id, companyId);
    const cases = await this.prisma.verificationCase.findMany({
      where: { companyId },
      include: CASE_INCLUDE,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: 20,
    });
    const adminIds = await adminActorIds(
      this.prisma,
      cases.flatMap((c) => c.events),
    );
    const mapped = cases.map((c) => mapCase(c, adminIds));
    const currentIdx = cases.findIndex((c) => c.state !== 'APPROVED' && c.state !== 'CLOSED');
    return {
      current: currentIdx >= 0 ? mapped[currentIdx]! : null,
      history: mapped.filter((_, i) => i !== currentIdx),
    };
  }

  async uploadDocument(
    user: User,
    companyId: string,
    file: { buffer: Buffer; originalname: string; mimetype: string; size: number } | undefined,
    fields: { type: DocumentType; expires_at?: string },
    meta: RequestMeta,
  ) {
    const access = await loadCompanyAccess(this.prisma, user.id, companyId);
    requireCapability(access, 'company.manage');
    await this.limits.consume('upload_user', user.id);
    if (!file || file.size === 0)
      throw new ApiError('VALIDATION_FAILED', 'file.required', { file: 'required' });
    if (!this.scanner.enabled || !this.storage.configured) {
      throw new ApiError('PROVIDER_UNAVAILABLE', 'file.scanning_unavailable');
    }
    const sniffed = sniffMime(file.buffer);
    if (!sniffed)
      throw new ApiError('VALIDATION_FAILED', 'file.type_not_allowed', { file: 'type' });
    const activeCase = await this.prisma.verificationCase.findFirst({
      where: { companyId, ...ACTIVE_CASE_WHERE },
    });
    if (!activeCase || !(EDITABLE_CASE_STATES as readonly string[]).includes(activeCase.state)) {
      throw new ApiError('CONFLICT', 'verification.not_editable');
    }
    const digest = sha256(file.buffer);
    const scan = await this.scanner.scan(file.buffer);
    const objectKey = `companies/${companyId}/${randomUUID()}`;
    // Infected files are recorded (for the audit trail) but never stored in the bucket.
    if (scan === 'CLEAN') await this.storage.put(objectKey, file.buffer, sniffed, digest);
    const doc = await this.prisma.$transaction(async (tx) => {
      const f = await tx.file.create({
        data: {
          ownerCompanyId: companyId,
          uploaderId: user.id,
          objectKey,
          originalName: sanitizeFilename(file.originalname),
          mime: sniffed,
          bytes: file.size,
          sha256: digest,
          scanState: scan,
        },
      });
      const d = await tx.verificationDocument.create({
        data: {
          caseId: activeCase.id,
          fileId: f.id,
          type: fields.type,
          expiresAt: fields.expires_at ? dateFromIso(fields.expires_at) : null,
        },
        include: { file: true },
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: scan === 'CLEAN' ? 'document.uploaded' : 'document.quarantined',
        resourceType: 'file',
        resourceId: f.id,
        companyId,
        details: { type: fields.type, mime: sniffed, bytes: file.size, scan },
        requestId: meta.requestId,
        ip: meta.ip,
      });
      return d;
    });
    return mapDocument(doc);
  }

  async deleteDocument(user: User, companyId: string, documentId: string, meta: RequestMeta) {
    const access = await loadCompanyAccess(this.prisma, user.id, companyId);
    requireCapability(access, 'company.manage');
    await this.prisma.$transaction(async (tx) => {
      const doc = await tx.verificationDocument.findFirst({
        where: { id: documentId, case: { companyId } },
        include: { case: true },
      });
      if (!doc) throw new ApiError('NOT_FOUND', 'common.not_found');
      if (!(EDITABLE_CASE_STATES as readonly string[]).includes(doc.case.state)) {
        throw new ApiError('CONFLICT', 'verification.not_editable');
      }
      await tx.verificationDocument.delete({ where: { id: doc.id } });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'document.removed',
        resourceType: 'file',
        resourceId: doc.fileId,
        companyId,
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
  }

  async submit(
    user: User,
    companyId: string,
    input: { terms_version: string; expected_version: number },
    meta: RequestMeta,
  ) {
    const access = await loadCompanyAccess(this.prisma, user.id, companyId);
    requireCapability(access, 'company.manage');
    if (input.terms_version !== CURRENT_TERMS_VERSION) {
      throw new ApiError('VALIDATION_FAILED', 'verification.terms_outdated', {
        terms_version: 'outdated',
      });
    }
    await this.prisma.$transaction(async (tx) => {
      // Lock the company row so concurrent submits/edits serialise.
      await tx.$queryRaw`SELECT id FROM companies WHERE id = ${companyId}::uuid FOR UPDATE`;
      const company = await tx.company.findUniqueOrThrow({ where: { id: companyId } });
      if (company.version !== input.expected_version)
        throw new ApiError('CONFLICT', 'common.stale_version');
      const vc = await tx.verificationCase.findFirst({
        where: { companyId, ...ACTIVE_CASE_WHERE },
        include: { documents: { include: { file: true } } },
      });
      if (!vc || !(EDITABLE_CASE_STATES as readonly string[]).includes(vc.state)) {
        throw new ApiError('CONFLICT', 'verification.not_editable');
      }
      const fieldErrors: Record<string, string> = {};
      for (const type of REQUIRED_DOCUMENTS) {
        if (!vc.documents.some((d) => d.type === type && d.file.scanState === 'CLEAN'))
          fieldErrors[type] = 'required';
      }
      if (vc.documents.some((d) => d.file.scanState !== 'CLEAN'))
        fieldErrors.documents = 'infected';
      const expiry =
        vc.kind === 'RENEWAL'
          ? dateFromIso(
              String(
                (vc.proposed as Record<string, string> | null)?.licence_expiry ?? '1970-01-01',
              ),
            )
          : company.licenceExpiry;
      if (expiry.getTime() <= todayUtc().getTime()) fieldErrors.licence_expiry = 'future';
      if (Object.keys(fieldErrors).length) {
        throw new ApiError('VALIDATION_FAILED', 'verification.incomplete', fieldErrors);
      }
      const now = new Date();
      await tx.verificationCase.update({
        where: { id: vc.id },
        data: { state: 'SUBMITTED', submittedAt: now, reason: null, assignedAdminId: null },
      });
      await tx.verificationCaseEvent.create({
        data: { caseId: vc.id, actorId: user.id, fromState: vc.state, toState: 'SUBMITTED' },
      });
      await tx.company.update({
        where: { id: companyId },
        data: {
          ...(vc.kind === 'INITIAL' ? { status: 'SUBMITTED' } : {}),
          termsVersion: input.terms_version,
          termsAcceptedAt: now,
          version: { increment: 1 },
        },
      });
      await enqueueEmail(tx, {
        template: 'verification_submitted',
        to: user.email,
        locale: user.locale,
        vars: { company: company.displayName },
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: vc.state === 'DRAFT' ? 'verification.submitted' : 'verification.resubmitted',
        resourceType: 'verification_case',
        resourceId: vc.id,
        companyId,
        details: { kind: vc.kind, terms_version: input.terms_version },
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
    return this.verification(user, companyId);
  }

  /** Opens a renewal case for an approved company, or one suspended because its licence expired. */
  async startRenewal(
    user: User,
    companyId: string,
    input: z.infer<typeof renewalRequest>,
    meta: RequestMeta,
  ) {
    const access = await loadCompanyAccess(this.prisma, user.id, companyId);
    requireCapability(access, 'company.manage');
    assertFutureExpiry(input.licence_expiry);
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT id FROM companies WHERE id = ${companyId}::uuid FOR UPDATE`;
        const company = await tx.company.findUniqueOrThrow({ where: { id: companyId } });
        const eligible =
          company.status === 'APPROVED' ||
          (company.status === 'SUSPENDED' && company.suspensionKind === 'LICENCE_EXPIRED');
        if (!eligible) throw new ApiError('CONFLICT', 'verification.renewal_not_allowed');
        const active = await tx.verificationCase.findFirst({
          where: { companyId, ...ACTIVE_CASE_WHERE },
        });
        if (active) throw new ApiError('CONFLICT', 'verification.case_open');
        const vc = await tx.verificationCase.create({
          data: { companyId, kind: 'RENEWAL', proposed: { ...input } },
        });
        await tx.verificationCaseEvent.create({
          data: { caseId: vc.id, actorId: user.id, toState: 'DRAFT' },
        });
        await writeAudit(tx, {
          actorId: user.id,
          actorType: 'user',
          action: 'verification.renewal_started',
          resourceType: 'verification_case',
          resourceId: vc.id,
          companyId,
          details: { proposed_expiry: input.licence_expiry },
          requestId: meta.requestId,
          ip: meta.ip,
        });
      });
    } catch (err) {
      if (isUniqueViolation(err)) throw new ApiError('CONFLICT', 'verification.case_open');
      throw err;
    }
    return this.verification(user, companyId);
  }

  /** Company-side download of a private file: owner of that company (legal_documents.read), clean files only. */
  async download(
    user: User,
    fileId: string,
    meta: RequestMeta,
  ): Promise<{ stream: Readable; mime: string; name: string }> {
    if (!/^[0-9a-f-]{36}$/i.test(fileId)) throw new ApiError('NOT_FOUND', 'common.not_found');
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!file?.ownerCompanyId) throw new ApiError('NOT_FOUND', 'common.not_found');
    const access = await loadCompanyAccess(this.prisma, user.id, file.ownerCompanyId); // 404 for other tenants
    requireCapability(access, 'legal_documents.read');
    if (file.scanState !== 'CLEAN') throw new ApiError('CONFLICT', 'file.not_clean');
    await writeAudit(this.prisma, {
      actorId: user.id,
      actorType: 'user',
      action: 'document.downloaded',
      resourceType: 'file',
      resourceId: file.id,
      companyId: file.ownerCompanyId,
      requestId: meta.requestId,
      ip: meta.ip,
    });
    return {
      stream: await this.storage.get(file.objectKey),
      mime: file.mime,
      name: file.originalName,
    };
  }
}
