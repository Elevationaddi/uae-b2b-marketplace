/**
 * DEVELOPMENT SEED: fictional companies, users for every role, and platform admins.
 * Refuses to run in production. All accounts share one development-only password and
 * admins have fixed development TOTP secrets (see docs/TEST_ACCOUNTS.md). Idempotent.
 */
import {
  PutObjectCommand,
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { parseEnv } from '@app/config';
import {
  createPrismaClient,
  writeAudit,
  type AdminRole,
  type MembershipRole,
  type PrismaClient,
  type WorkspaceKind,
} from '@app/db';
import argon2 from 'argon2';
import { createHash, randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { encryptSecret } from '../common/crypto';

import { seedCatalog } from './seed-catalog';
import { DEV_ADMIN_TOTP, DEV_PASSWORD } from './seed-secrets';

const file = resolve(__dirname, '../../../../.env');
if (process.env.NODE_ENV !== 'production' && existsSync(file)) process.loadEnvFile(file);
const env = parseEnv(process.env);
if (env.isProduction) {
  console.error('[seed] Refusing to seed a production environment.');
  process.exit(1);
}

const ARGON = { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1 } as const;

async function user(
  prisma: PrismaClient,
  hash: string,
  email: string,
  fullName: string,
  opts: { admin?: boolean; verified?: boolean; locale?: 'en' | 'ar' } = {},
) {
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      fullName,
      passwordHash: hash,
      locale: opts.locale ?? 'en',
      accountType: opts.admin ? 'PLATFORM_ADMIN' : 'COMPANY',
      emailVerifiedAt: opts.verified === false ? null : new Date(),
    },
  });
}

function pdf(label: string): Buffer {
  // Minimal valid PDF with a text label (fictional sample document).
  const body = `BT /F1 18 Tf 72 720 Td (${label}) Tj ET`;
  return Buffer.from(
    `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n` +
      `3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n` +
      `4 0 obj<</Length ${body.length}>>stream\n${body}\nendstream endobj\n5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n` +
      `trailer<</Root 1 0 R>>\n%%EOF\n`,
  );
}

async function main() {
  const prisma = createPrismaClient(env.DATABASE_URL);
  const s3 =
    env.STORAGE_ENDPOINT && env.STORAGE_BUCKET
      ? new S3Client({
          endpoint: env.STORAGE_ENDPOINT,
          region: env.STORAGE_REGION,
          forcePathStyle: true,
          credentials: {
            accessKeyId: env.STORAGE_ACCESS_KEY ?? 'x',
            secretAccessKey: env.STORAGE_SECRET_KEY ?? 'x',
          },
        })
      : null;
  if (s3) {
    try {
      await s3.send(new HeadBucketCommand({ Bucket: env.STORAGE_BUCKET }));
    } catch {
      await s3.send(new CreateBucketCommand({ Bucket: env.STORAGE_BUCKET }));
    }
  }
  const hash = await argon2.hash(DEV_PASSWORD, ARGON);
  const in2y = new Date(Date.UTC(new Date().getUTCFullYear() + 2, 5, 30));

  async function company(spec: {
    legal: string;
    display: string;
    licence: string;
    emirate: 'DUBAI' | 'ABU_DHABI' | 'SHARJAH';
    activity: string;
    status: 'APPROVED' | 'SUBMITTED' | 'DRAFT';
    kinds: WorkspaceKind[];
    owner: string;
    members: { email: string; name: string; kind: WorkspaceKind; role: MembershipRole }[];
    ownerName: string;
  }) {
    const existing = await prisma.company.findUnique({
      where: {
        licenceIssuer_licenceNumber: {
          licenceIssuer: 'Fictional Economic Department',
          licenceNumber: spec.licence,
        },
      },
    });
    if (existing) return existing;
    const owner = await user(prisma, hash, spec.owner, spec.ownerName);
    const approved = spec.status === 'APPROVED';
    const c = await prisma.company.create({
      data: {
        legalName: spec.legal,
        displayName: spec.display,
        licenceNumber: spec.licence,
        licenceIssuer: 'Fictional Economic Department',
        licenceExpiry: in2y,
        activity: spec.activity,
        emirate: spec.emirate,
        status: spec.status,
        contactEmail: spec.owner,
        contactPhone: '+971500000000',
        createdById: owner.id,
        termsVersion: spec.status === 'DRAFT' ? null : 'dev-1',
        termsAcceptedAt: spec.status === 'DRAFT' ? null : new Date(),
      },
    });
    const ws: Record<string, string> = {};
    for (const kind of spec.kinds) {
      const w = await prisma.workspace.create({
        data: { companyId: c.id, kind, status: approved ? 'ACTIVE' : 'PENDING' },
      });
      ws[kind] = w.id;
      await prisma.membership.create({
        data: { workspaceId: w.id, userId: owner.id, role: 'OWNER' },
      });
    }
    for (const m of spec.members) {
      const u = await user(prisma, hash, m.email, m.name);
      await prisma.membership.create({
        data: { workspaceId: ws[m.kind]!, userId: u.id, role: m.role },
      });
    }
    const caseState =
      spec.status === 'APPROVED' ? 'APPROVED' : spec.status === 'SUBMITTED' ? 'SUBMITTED' : 'DRAFT';
    const vc = await prisma.verificationCase.create({
      data: {
        companyId: c.id,
        state: caseState,
        submittedAt: caseState === 'DRAFT' ? null : new Date(),
        decidedAt: caseState === 'APPROVED' ? new Date() : null,
      },
    });
    await prisma.verificationCaseEvent.create({
      data: { caseId: vc.id, actorId: owner.id, toState: 'DRAFT' },
    });
    if (caseState !== 'DRAFT') {
      await prisma.verificationCaseEvent.create({
        data: { caseId: vc.id, actorId: owner.id, fromState: 'DRAFT', toState: 'SUBMITTED' },
      });
      for (const [type, label] of [
        ['TRADE_LICENCE', `SAMPLE trade licence - ${spec.display} (fictional)`],
        ['AUTHORIZED_REPRESENTATIVE', `SAMPLE authorisation letter - ${spec.display} (fictional)`],
      ] as const) {
        const content = pdf(label);
        const key = `companies/${c.id}/${randomUUID()}`;
        if (s3)
          await s3.send(
            new PutObjectCommand({
              Bucket: env.STORAGE_BUCKET,
              Key: key,
              Body: content,
              ContentType: 'application/pdf',
            }),
          );
        const f = await prisma.file.create({
          data: {
            ownerCompanyId: c.id,
            uploaderId: owner.id,
            objectKey: key,
            originalName: `${type.toLowerCase()}.pdf`,
            mime: 'application/pdf',
            bytes: content.length,
            sha256: createHash('sha256').update(content).digest('hex'),
            scanState: s3 ? 'CLEAN' : 'PENDING',
          },
        });
        await prisma.verificationDocument.create({ data: { caseId: vc.id, fileId: f.id, type } });
      }
    }
    if (caseState === 'APPROVED') {
      await prisma.verificationCaseEvent.create({
        data: {
          caseId: vc.id,
          actorId: null,
          fromState: 'SUBMITTED',
          toState: 'APPROVED',
          reason: 'Seeded as approved (development data)',
        },
      });
    }
    await writeAudit(prisma, {
      actorType: 'system',
      action: 'dev.seeded_company',
      resourceType: 'company',
      resourceId: c.id,
      companyId: c.id,
    });
    return c;
  }

  await company({
    legal: 'Falcon Trading LLC (Fictional)',
    display: 'Falcon Trading',
    licence: 'DEV-100001',
    emirate: 'DUBAI',
    activity: 'General trading',
    status: 'APPROVED',
    kinds: ['BUYER'],
    owner: 'buyer.owner@falcon-trading.test',
    ownerName: 'Aisha Buyer-Owner',
    members: [
      {
        email: 'buyer.procurement@falcon-trading.test',
        name: 'Omar Procurement',
        kind: 'BUYER',
        role: 'PROCUREMENT',
      },
      {
        email: 'buyer.viewer@falcon-trading.test',
        name: 'Lina Viewer',
        kind: 'BUYER',
        role: 'VIEWER',
      },
    ],
  });
  await company({
    legal: 'Desert Packaging Industries LLC (Fictional)',
    display: 'Desert Packaging',
    licence: 'DEV-200002',
    emirate: 'SHARJAH',
    activity: 'Manufacture of paper and plastic packaging',
    status: 'APPROVED',
    kinds: ['SELLER'],
    owner: 'seller.owner@desert-pack.test',
    ownerName: 'Khalid Seller-Owner',
    members: [
      {
        email: 'seller.sales@desert-pack.test',
        name: 'Mariam Sales',
        kind: 'SELLER',
        role: 'SALES',
      },
      {
        email: 'seller.warehouse@desert-pack.test',
        name: 'Yousef Warehouse',
        kind: 'SELLER',
        role: 'WAREHOUSE',
      },
      {
        email: 'seller.finance@desert-pack.test',
        name: 'Noura Finance',
        kind: 'SELLER',
        role: 'FINANCE',
      },
      {
        email: 'seller.viewer@desert-pack.test',
        name: 'Hamad Viewer',
        kind: 'SELLER',
        role: 'VIEWER',
      },
    ],
  });
  await company({
    legal: 'Oasis Textiles Manufacturing FZ-LLC (Fictional)',
    display: 'Oasis Textiles',
    licence: 'DEV-300003',
    emirate: 'ABU_DHABI',
    activity: 'Textile manufacturing and trading',
    status: 'SUBMITTED',
    kinds: ['BUYER', 'SELLER'],
    owner: 'dual.owner@oasis-textiles.test',
    ownerName: 'Fatima Dual-Owner',
    members: [],
  });
  await company({
    legal: 'Palm Office Supplies LLC (Fictional)',
    display: 'Palm Office Supplies',
    licence: 'DEV-400004',
    emirate: 'DUBAI',
    activity: 'Office supplies trading',
    status: 'DRAFT',
    kinds: ['BUYER'],
    owner: 'draft.owner@palm-office.test',
    ownerName: 'Saeed Draft-Owner',
    members: [],
  });
  await company({
    legal: 'Gulf Weave Textiles Factory LLC (Fictional)',
    display: 'Gulf Weave Textiles',
    licence: 'DEV-500005',
    emirate: 'DUBAI',
    activity: 'Garment and uniform manufacturing',
    status: 'APPROVED',
    kinds: ['SELLER'],
    owner: 'seller.owner@gulf-weave.test',
    ownerName: 'Rashid Textile-Owner',
    members: [],
  });
  await company({
    legal: 'Emirates Pantry Foods Trading LLC (Fictional)',
    display: 'Emirates Pantry Foods',
    licence: 'DEV-600006',
    emirate: 'ABU_DHABI',
    activity: 'Foodstuff distribution',
    status: 'APPROVED',
    kinds: ['SELLER'],
    owner: 'seller.owner@emirates-pantry.test',
    ownerName: 'Huda Food-Owner',
    members: [],
  });
  await user(prisma, hash, 'unverified@example.test', 'Unverified Person', { verified: false });

  const admins: [string, string, AdminRole][] = [
    ['compliance@admin.test', 'Compliance Reviewer', 'COMPLIANCE'],
    ['support@admin.test', 'Support Agent', 'SUPPORT'],
    ['finance@admin.test', 'Finance Analyst', 'FINANCE'],
    ['approver@admin.test', 'Finance Approver', 'FINANCE_APPROVER'],
    ['superadmin@admin.test', 'Super Admin', 'SUPER_ADMIN'],
  ];
  for (const [email, name, role] of admins) {
    const u = await user(prisma, hash, email, name, { admin: true });
    const secret = DEV_ADMIN_TOTP[email]!;
    await prisma.user.update({
      where: { id: u.id },
      data: { mfaEnabled: true, mfaSecretEnc: encryptSecret(secret, env.MFA_ENCRYPTION_KEY) },
    });
    await prisma.adminMembership.upsert({
      where: { userId_role: { userId: u.id, role } },
      update: { active: true },
      create: { userId: u.id, role },
    });
  }
  // An admin without MFA, to exercise mandatory enrolment.
  const fresh = await user(prisma, hash, 'new.admin@admin.test', 'New Admin (MFA not enrolled)', {
    admin: true,
  });
  await prisma.adminMembership.upsert({
    where: { userId_role: { userId: fresh.id, role: 'COMPLIANCE' } },
    update: {},
    create: { userId: fresh.id, role: 'COMPLIANCE' },
  });

  const owners: Record<string, string> = {
    'DEV-200002': 'seller.owner@desert-pack.test',
    'DEV-500005': 'seller.owner@gulf-weave.test',
    'DEV-600006': 'seller.owner@emirates-pantry.test',
  };
  await seedCatalog(prisma, s3, env, (licence) => owners[licence]!);

  console.log('[seed] Development data ready. Accounts are listed in docs/TEST_ACCOUNTS.md.');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
