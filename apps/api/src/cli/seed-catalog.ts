/**
 * DEVELOPMENT SEED (Phase 2): the 12 founder-approved categories (A09) with subcategories and
 * attributes, provisional restricted terms, storefronts and a fictional catalogue for the seeded
 * sellers, with generated (clearly synthetic) product images. Idempotent: skipped when categories
 * already exist. Never runs in production (guarded by seed.ts).
 */
import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  type S3Client,
} from '@aws-sdk/client-s3';
import type { AppEnv } from '@app/config';
import type { Prisma, PrismaClient } from '@app/db';
import { createHash, randomUUID } from 'node:crypto';
import sharp from 'sharp';

type Attr = {
  key: string;
  en: string;
  ar: string;
  type: 'TEXT' | 'NUMBER' | 'SELECT' | 'BOOLEAN';
  options?: [string, string, string][];
  unit?: string;
  filterable?: boolean;
  required?: boolean;
};
type CatSpec = {
  slug: string;
  en: string;
  ar: string;
  dEn: string;
  dAr: string;
  priority?: boolean;
  restriction?: 'OPEN' | 'REVIEW_REQUIRED' | 'BLOCKED';
  visible?: boolean;
  reqEn?: string;
  reqAr?: string;
  color: string;
  attrs?: Attr[];
  subs: [string, string, string][];
};

export const CATEGORIES: CatSpec[] = [
  {
    slug: 'fashion-textiles',
    en: 'Fashion & Textiles',
    ar: 'الأزياء والمنسوجات',
    dEn: 'Fabrics, garments, uniforms and textile accessories from UAE manufacturers and wholesalers.',
    dAr: 'الأقمشة والملابس والزي الموحد وإكسسوارات النسيج من المصنعين وتجار الجملة في الإمارات.',
    priority: true,
    color: '#7c3aed',
    attrs: [
      {
        key: 'material',
        en: 'Material',
        ar: 'الخامة',
        type: 'SELECT',
        filterable: true,
        options: [
          ['cotton', 'Cotton', 'قطن'],
          ['polyester', 'Polyester', 'بوليستر'],
          ['linen', 'Linen', 'كتان'],
          ['blend', 'Blend', 'مزيج'],
        ],
      },
      { key: 'gsm', en: 'Fabric weight', ar: 'وزن القماش', type: 'NUMBER', unit: 'g/m²' },
    ],
    subs: [
      ['fabrics', 'Fabrics', 'الأقمشة'],
      ['garments', 'Garments', 'الملابس'],
      ['uniforms-workwear', 'Uniforms & Workwear', 'الزي الموحد وملابس العمل'],
    ],
  },
  {
    slug: 'packaging-printing',
    en: 'Packaging & Printing',
    ar: 'التغليف والطباعة',
    dEn: 'Corrugated boxes, flexible packaging, labels and commercial printing.',
    dAr: 'الصناديق المموجة والتغليف المرن والملصقات والطباعة التجارية.',
    priority: true,
    color: '#b45309',
    attrs: [
      {
        key: 'material',
        en: 'Material',
        ar: 'الخامة',
        type: 'SELECT',
        filterable: true,
        options: [
          ['corrugated', 'Corrugated board', 'كرتون مموج'],
          ['kraft', 'Kraft paper', 'ورق كرافت'],
          ['plastic', 'Plastic film', 'غشاء بلاستيكي'],
        ],
      },
      {
        key: 'recyclable',
        en: 'Recyclable',
        ar: 'قابل لإعادة التدوير',
        type: 'BOOLEAN',
        filterable: true,
      },
    ],
    subs: [
      ['boxes-cartons', 'Boxes & Cartons', 'الصناديق والكراتين'],
      ['flexible-packaging', 'Flexible Packaging', 'التغليف المرن'],
      ['labels-printing', 'Labels & Printing', 'الملصقات والطباعة'],
    ],
  },
  {
    slug: 'food-beverage',
    en: 'Food & Beverage',
    ar: 'الأغذية والمشروبات',
    dEn: 'Dry food, beverages and food-service supplies. Listings are reviewed and need certification details.',
    dAr: 'الأغذية الجافة والمشروبات ومستلزمات خدمات الطعام. تتم مراجعة المنتجات وتتطلب بيانات الشهادات.',
    priority: true,
    restriction: 'REVIEW_REQUIRED',
    reqEn:
      'Provide food safety / halal certification details. Final regulatory requirements are pending legal approval.',
    reqAr:
      'يرجى تقديم بيانات شهادات سلامة الغذاء أو الحلال. المتطلبات التنظيمية النهائية بانتظار الموافقة القانونية.',
    color: '#15803d',
    attrs: [
      {
        key: 'shelf_life_days',
        en: 'Shelf life',
        ar: 'مدة الصلاحية',
        type: 'NUMBER',
        unit: 'days',
      },
      { key: 'halal', en: 'Halal certified', ar: 'شهادة حلال', type: 'BOOLEAN', filterable: true },
    ],
    subs: [
      ['dry-food', 'Dry Food & Staples', 'الأغذية الجافة والأساسية'],
      ['beverages', 'Beverages', 'المشروبات'],
      ['food-service', 'Food Service Supplies', 'مستلزمات خدمات الطعام'],
    ],
  },
  {
    slug: 'beauty-personal-care',
    en: 'Beauty & Personal Care',
    ar: 'التجميل والعناية الشخصية',
    dEn: 'Cosmetics, toiletries and personal care. Listings are reviewed.',
    dAr: 'مستحضرات التجميل ومستلزمات العناية الشخصية. تتم مراجعة المنتجات.',
    restriction: 'REVIEW_REQUIRED',
    reqEn:
      'Provide product registration or notification references. Final policy pending legal approval (A10).',
    reqAr: 'يرجى تقديم مراجع تسجيل المنتج أو الإخطار. السياسة النهائية بانتظار الموافقة القانونية.',
    color: '#be185d',
    subs: [
      ['skin-hair-care', 'Skin & Hair Care', 'العناية بالبشرة والشعر'],
      ['toiletries', 'Toiletries & Amenities', 'أدوات النظافة الشخصية'],
    ],
  },
  {
    slug: 'furniture-interiors',
    en: 'Furniture & Interiors',
    ar: 'الأثاث والديكور الداخلي',
    dEn: 'Office, hospitality and retail furniture and interiors.',
    dAr: 'أثاث وديكور المكاتب والضيافة ومحلات التجزئة.',
    color: '#9a3412',
    subs: [
      ['office-furniture', 'Office Furniture', 'أثاث المكاتب'],
      ['decor-lighting', 'Decor & Lighting', 'الديكور والإضاءة'],
    ],
  },
  {
    slug: 'hospitality-restaurant',
    en: 'Hospitality & Restaurant Supplies',
    ar: 'مستلزمات الضيافة والمطاعم',
    dEn: 'Tableware, kitchen equipment and hotel amenities.',
    dAr: 'أدوات المائدة ومعدات المطابخ ومستلزمات الفنادق.',
    color: '#b45309',
    subs: [
      ['tableware', 'Tableware', 'أدوات المائدة'],
      ['kitchen-equipment', 'Kitchen Equipment', 'معدات المطابخ'],
    ],
  },
  {
    slug: 'electronics-accessories',
    en: 'Electronics & Accessories',
    ar: 'الإلكترونيات والإكسسوارات',
    dEn: 'Consumer electronics, cables and accessories.',
    dAr: 'الإلكترونيات الاستهلاكية والكابلات والإكسسوارات.',
    color: '#ca8a04',
    subs: [
      ['cables-chargers', 'Cables & Chargers', 'الكابلات والشواحن'],
      ['device-accessories', 'Device Accessories', 'إكسسوارات الأجهزة'],
    ],
  },
  {
    slug: 'construction-hardware',
    en: 'Construction & Hardware',
    ar: 'البناء والعدد',
    dEn: 'Building materials, fixings and hardware.',
    dAr: 'مواد البناء وأدوات التثبيت والعدد.',
    color: '#475569',
    subs: [
      ['building-materials', 'Building Materials', 'مواد البناء'],
      ['fixings-hardware', 'Fixings & Hardware', 'أدوات التثبيت والعدد'],
    ],
  },
  {
    slug: 'office-stationery',
    en: 'Office & Stationery',
    ar: 'المكتب والقرطاسية',
    dEn: 'Stationery, paper and office consumables.',
    dAr: 'القرطاسية والورق والمستهلكات المكتبية.',
    color: '#0369a1',
    subs: [
      ['stationery', 'Stationery', 'القرطاسية'],
      ['paper-products', 'Paper Products', 'المنتجات الورقية'],
    ],
  },
  {
    slug: 'industrial-manufacturing',
    en: 'Industrial & Manufacturing',
    ar: 'الصناعة والتصنيع',
    dEn: 'Machinery, tools, raw materials and safety equipment.',
    dAr: 'الآلات والعدد والمواد الخام ومعدات السلامة.',
    color: '#334155',
    subs: [
      ['tools-machinery', 'Tools & Machinery', 'العدد والآلات'],
      ['safety-equipment', 'Safety Equipment', 'معدات السلامة'],
    ],
  },
  {
    slug: 'gifts-promotional',
    en: 'Gifts & Promotional Products',
    ar: 'الهدايا والمنتجات الترويجية',
    dEn: 'Corporate gifts and branded promotional items.',
    dAr: 'هدايا الشركات والمنتجات الترويجية المطبوعة.',
    color: '#7c3aed',
    subs: [
      ['corporate-gifts', 'Corporate Gifts', 'هدايا الشركات'],
      ['promotional-items', 'Promotional Items', 'المنتجات الترويجية'],
    ],
  },
  {
    slug: 'cleaning-facility',
    en: 'Cleaning & Facility Supplies',
    ar: 'مستلزمات التنظيف والمرافق',
    dEn: 'Janitorial supplies, tissues and facility consumables.',
    dAr: 'مستلزمات التنظيف والمناديل ومستهلكات المرافق.',
    color: '#0891b2',
    subs: [
      ['janitorial', 'Janitorial Supplies', 'مستلزمات التنظيف'],
      ['tissue-paper', 'Tissue & Paper Hygiene', 'المناديل والورق الصحي'],
    ],
  },
];

export const RESTRICTED_TERMS: { term: string; action: 'BLOCK' | 'REVIEW'; note: string }[] = [
  {
    term: 'counterfeit',
    action: 'BLOCK',
    note: 'Provisional (A10): counterfeit goods prohibited.',
  },
  { term: 'replica', action: 'BLOCK', note: 'Provisional (A10): replica branded goods.' },
  { term: 'narcotic', action: 'BLOCK', note: 'Provisional (A10).' },
  { term: 'weapon', action: 'BLOCK', note: 'Provisional (A10).' },
  { term: 'tobacco', action: 'REVIEW', note: 'Provisional (A10): licensed sellers only.' },
  { term: 'pharmaceutical', action: 'REVIEW', note: 'Provisional (A10).' },
  { term: 'مقلد', action: 'BLOCK', note: 'Provisional (A10): counterfeit (Arabic).' },
];

async function image(
  label: string,
  sub: string,
  color: string,
  w = 1200,
  h = 900,
): Promise<Buffer> {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="#0f172a"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="${w * 0.78}" cy="${h * 0.3}" r="${h * 0.22}" fill="#ffffff" fill-opacity="0.12"/>
    <rect x="${w * 0.08}" y="${h * 0.62}" width="${w * 0.5}" height="${h * 0.012}" fill="#ffffff" fill-opacity="0.5"/>
    <text x="${w * 0.08}" y="${h * 0.55}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${Math.round(h * 0.075)}" font-weight="700" fill="#ffffff">${esc(label)}</text>
    <text x="${w * 0.08}" y="${h * 0.72}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${Math.round(h * 0.04)}" fill="#e2e8f0">${esc(sub)}</text>
    <text x="${w * 0.08}" y="${h * 0.92}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${Math.round(h * 0.028)}" fill="#cbd5e1">Sample image - fictional development data</text>
  </svg>`;
  return sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer();
}

type ProductSpec = {
  cat: string;
  sub: string;
  en: string;
  ar: string;
  dEn: string;
  dAr: string;
  mode: 'READY_STOCK' | 'MADE_TO_ORDER';
  price: 'FIXED' | 'TIERED' | 'QUOTE_ONLY';
  unit: 'PIECE' | 'BOX' | 'CARTON' | 'ROLL' | 'PACK';
  moq: number;
  inc: number;
  tiers: [number, number][]; // [min_qty, AED price in fils]
  stock: number;
  attrs?: Record<string, string | number | boolean>;
  materials?: string;
  dims?: string;
  origin?: string;
  lead?: [number, number];
  fulfil?: number;
  custom?: boolean;
  privateLabel?: boolean;
  whiteLabel?: boolean;
  samples?: boolean;
  certs?: { name: string; issuer?: string }[];
  variants?: { code: string; attrs: Record<string, string>; stock: number }[];
  state?: 'APPROVED' | 'PENDING_REVIEW' | 'DRAFT' | 'REJECTED';
  featured?: boolean;
};

const SELLERS: {
  licence: string;
  storefront: Prisma.StorefrontUncheckedCreateInput extends infer T ? Partial<T> : never;
  color: string;
  products: ProductSpec[];
}[] = [
  {
    licence: 'DEV-200002',
    color: '#b45309',
    storefront: {
      businessType: 'MANUFACTURER',
      descriptionEn:
        'Desert Packaging manufactures corrugated cartons, kraft mailers and printed labels in Sharjah for retail, e-commerce and food-service brands across the UAE.',
      descriptionAr:
        'تصنّع ديزرت للتغليف الكراتين المموجة وأظرف الكرافت والملصقات المطبوعة في الشارقة لعلامات التجزئة والتجارة الإلكترونية وخدمات الطعام في الإمارات.',
      yearEstablished: 2009,
      city: 'Sharjah Industrial Area',
      specializationEn: 'Corrugated and kraft packaging, custom printing',
      specializationAr: 'التغليف المموج والكرافت والطباعة حسب الطلب',
      capabilitiesEn:
        'Die-cutting, flexographic printing up to 4 colours, lamination, in-house structural design.',
      capabilitiesAr:
        'القص بالقوالب، الطباعة الفلكسوغرافية حتى 4 ألوان، التغليف الحراري، التصميم الهيكلي الداخلي.',
      productionCapacity: '1.2 million cartons per month',
      customizationServices: true,
      privateLabel: true,
      whiteLabel: true,
      samplesAvailable: true,
      fulfilmentEn:
        'Dispatch from Sharjah within 3 working days for stock items; nationwide delivery by own fleet.',
      fulfilmentAr:
        'الشحن من الشارقة خلال 3 أيام عمل للمنتجات المتوفرة؛ التوصيل لجميع الإمارات بأسطولنا.',
      certifications: [{ name: 'ISO 9001:2015', issuer: 'Fictional Certification Body' }],
    },
    products: [
      {
        cat: 'packaging-printing',
        sub: 'boxes-cartons',
        en: 'Double-Wall Corrugated Shipping Carton 40x30x30 cm',
        ar: 'كرتون شحن مموج مزدوج الجدار 40×30×30 سم',
        dEn: 'Heavy-duty double-wall (BC flute) brown carton for shipping and storage. Supplied flat-packed in bundles of 25.',
        dAr: 'كرتون بني مزدوج الجدار شديد التحمل للشحن والتخزين. يورد مسطحاً في حزم من 25 قطعة.',
        mode: 'READY_STOCK',
        price: 'TIERED',
        unit: 'PIECE',
        moq: 100,
        inc: 25,
        tiers: [
          [100, 450],
          [500, 395],
          [2000, 340],
        ],
        stock: 18000,
        attrs: { material: 'corrugated', recyclable: true },
        dims: '40 x 30 x 30 cm',
        origin: 'AE',
        fulfil: 3,
        custom: true,
        privateLabel: true,
        samples: true,
        featured: true,
        variants: [
          { code: 'DP-CTN-403030-BR', attrs: { colour: 'Brown' }, stock: 18000 },
          { code: 'DP-CTN-403030-WH', attrs: { colour: 'White' }, stock: 6000 },
        ],
      },
      {
        cat: 'packaging-printing',
        sub: 'boxes-cartons',
        en: 'Kraft Mailer Box with Tuck Flap (E-commerce)',
        ar: 'صندوق بريدي كرافت بغطاء (للتجارة الإلكترونية)',
        dEn: 'Single-wall E-flute kraft mailer for e-commerce orders. Custom one-colour logo printing available.',
        dAr: 'صندوق بريدي كرافت أحادي الجدار للطلبات الإلكترونية. تتوفر طباعة الشعار بلون واحد.',
        mode: 'READY_STOCK',
        price: 'TIERED',
        unit: 'PIECE',
        moq: 250,
        inc: 50,
        tiers: [
          [250, 210],
          [1000, 180],
          [5000, 150],
        ],
        stock: 40000,
        attrs: { material: 'kraft', recyclable: true },
        dims: '25 x 18 x 8 cm',
        origin: 'AE',
        fulfil: 2,
        custom: true,
        privateLabel: true,
        whiteLabel: true,
        samples: true,
      },
      {
        cat: 'packaging-printing',
        sub: 'labels-printing',
        en: 'Custom Printed Paper Labels on Rolls',
        ar: 'ملصقات ورقية مطبوعة حسب الطلب على لفات',
        dEn: 'Made-to-order printed labels for food, cosmetics and retail packaging. Send artwork after quotation.',
        dAr: 'ملصقات مطبوعة حسب الطلب للأغذية ومستحضرات التجميل وتغليف التجزئة. أرسل التصميم بعد عرض السعر.',
        mode: 'MADE_TO_ORDER',
        price: 'QUOTE_ONLY',
        unit: 'ROLL',
        moq: 10,
        inc: 1,
        tiers: [],
        stock: 0,
        attrs: { material: 'kraft', recyclable: true },
        lead: [7, 14],
        custom: true,
        privateLabel: true,
        whiteLabel: true,
        samples: true,
      },
      {
        cat: 'packaging-printing',
        sub: 'flexible-packaging',
        en: 'Stand-Up Zip Pouch 500 g (Food Grade)',
        ar: 'كيس واقف بسحاب 500 غ (صالح للأغذية)',
        dEn: 'Food-grade laminated stand-up pouch with zip lock and tear notch, suitable for dry foods, nuts and coffee.',
        dAr: 'كيس واقف مصفح صالح للأغذية بسحاب وفتحة تمزيق، مناسب للأغذية الجافة والمكسرات والقهوة.',
        mode: 'READY_STOCK',
        price: 'FIXED',
        unit: 'PACK',
        moq: 10,
        inc: 5,
        tiers: [[10, 6500]],
        stock: 900,
        attrs: { material: 'plastic', recyclable: false },
        dims: '16 x 26 + 8 cm gusset',
        origin: 'AE',
        fulfil: 3,
        samples: true,
      },
      {
        cat: 'packaging-printing',
        sub: 'boxes-cartons',
        en: 'Rigid Gift Box with Magnetic Closure',
        ar: 'صندوق هدايا صلب بإغلاق مغناطيسي',
        dEn: 'Premium rigid box for corporate gifts. Pending first review.',
        dAr: 'صندوق صلب فاخر لهدايا الشركات. بانتظار المراجعة الأولى.',
        mode: 'MADE_TO_ORDER',
        price: 'TIERED',
        unit: 'PIECE',
        moq: 200,
        inc: 50,
        tiers: [
          [200, 1850],
          [1000, 1600],
        ],
        stock: 0,
        attrs: { material: 'kraft' },
        lead: [10, 21],
        custom: true,
        privateLabel: true,
        state: 'PENDING_REVIEW',
      },
    ],
  },
  {
    licence: 'DEV-500005',
    color: '#7c3aed',
    storefront: {
      businessType: 'FACTORY',
      descriptionEn:
        'Gulf Weave Textiles is a Dubai garment factory producing uniforms, workwear and cotton basics for hospitality, healthcare and corporate clients.',
      descriptionAr:
        'غلف ويف للمنسوجات مصنع ملابس في دبي ينتج الزي الموحد وملابس العمل والملابس القطنية الأساسية لقطاعات الضيافة والرعاية الصحية والشركات.',
      yearEstablished: 2014,
      city: 'Dubai Investments Park',
      specializationEn: 'Uniforms, workwear and cotton garments',
      specializationAr: 'الزي الموحد وملابس العمل والملابس القطنية',
      capabilitiesEn: 'Cutting, stitching, embroidery and screen printing under one roof.',
      capabilitiesAr: 'القص والخياطة والتطريز والطباعة بالشاشة تحت سقف واحد.',
      productionCapacity: '60,000 garments per month',
      customizationServices: true,
      privateLabel: true,
      whiteLabel: false,
      samplesAvailable: true,
      fulfilmentEn: 'Stock garments ship within 2 days; made-to-order runs 2-4 weeks.',
      fulfilmentAr: 'تشحن الملابس المتوفرة خلال يومين؛ الطلبات الخاصة من 2 إلى 4 أسابيع.',
      certifications: [{ name: 'OEKO-TEX Standard 100 (declared)', issuer: 'Fictional' }],
    },
    products: [
      {
        cat: 'fashion-textiles',
        sub: 'uniforms-workwear',
        en: 'Polo Shirt 220 GSM Pique (Corporate Uniform)',
        ar: 'قميص بولو 220 غ بيكيه (زي موحد للشركات)',
        dEn: 'Breathable cotton-rich pique polo for corporate and hospitality teams. Embroidery available.',
        dAr: 'قميص بولو بيكيه غني بالقطن للفرق المؤسسية والضيافة. يتوفر التطريز.',
        mode: 'READY_STOCK',
        price: 'TIERED',
        unit: 'PIECE',
        moq: 50,
        inc: 10,
        tiers: [
          [50, 2400],
          [250, 2100],
          [1000, 1850],
        ],
        stock: 0,
        attrs: { material: 'blend', gsm: 220 },
        materials: '65% cotton, 35% polyester',
        origin: 'AE',
        fulfil: 2,
        custom: true,
        privateLabel: true,
        samples: true,
        featured: true,
        variants: [
          { code: 'GW-POLO-NVY-M', attrs: { colour: 'Navy', size: 'M' }, stock: 1200 },
          { code: 'GW-POLO-NVY-L', attrs: { colour: 'Navy', size: 'L' }, stock: 900 },
          { code: 'GW-POLO-WHT-M', attrs: { colour: 'White', size: 'M' }, stock: 40 },
        ],
      },
      {
        cat: 'fashion-textiles',
        sub: 'uniforms-workwear',
        en: 'Chef Jacket Double-Breasted',
        ar: 'سترة طاهٍ مزدوجة الأزرار',
        dEn: 'Durable poly-cotton chef jacket with stud buttons, made to order with your logo.',
        dAr: 'سترة طاهٍ متينة من القطن والبوليستر بأزرار، تصنع حسب الطلب مع شعارك.',
        mode: 'MADE_TO_ORDER',
        price: 'TIERED',
        unit: 'PIECE',
        moq: 30,
        inc: 10,
        tiers: [
          [30, 6500],
          [200, 5800],
        ],
        stock: 0,
        attrs: { material: 'blend', gsm: 200 },
        materials: 'Poly-cotton twill',
        lead: [14, 28],
        custom: true,
        privateLabel: true,
        samples: true,
      },
      {
        cat: 'fashion-textiles',
        sub: 'fabrics',
        en: 'Cotton Poplin Fabric 150 cm Width',
        ar: 'قماش بوبلين قطني بعرض 150 سم',
        dEn: '100% cotton poplin for shirts and uniforms, supplied in 50-metre rolls. Multiple colours.',
        dAr: 'قماش بوبلين قطن 100% للقمصان والزي الموحد، يورد في لفات بطول 50 متراً. ألوان متعددة.',
        mode: 'READY_STOCK',
        price: 'TIERED',
        unit: 'ROLL',
        moq: 2,
        inc: 1,
        tiers: [
          [2, 62500],
          [20, 52500],
        ],
        stock: 0,
        attrs: { material: 'cotton', gsm: 120 },
        materials: '100% cotton',
        origin: 'IN',
        fulfil: 3,
        samples: true,
        variants: [
          { code: 'GW-POP-WHT', attrs: { colour: 'White' }, stock: 120 },
          { code: 'GW-POP-SKY', attrs: { colour: 'Sky blue' }, stock: 0 },
        ],
      },
      {
        cat: 'fashion-textiles',
        sub: 'garments',
        en: 'Plain Crew-Neck T-Shirt 180 GSM',
        ar: 'تيشيرت سادة برقبة دائرية 180 غ',
        dEn: 'Combed cotton tee for promotions and private-label apparel lines.',
        dAr: 'تيشيرت قطن ممشط للعروض الترويجية وخطوط الملابس بعلامة خاصة.',
        mode: 'READY_STOCK',
        price: 'TIERED',
        unit: 'PIECE',
        moq: 100,
        inc: 20,
        tiers: [
          [100, 1150],
          [500, 980],
        ],
        stock: 6000,
        attrs: { material: 'cotton', gsm: 180 },
        materials: '100% combed cotton',
        origin: 'AE',
        fulfil: 2,
        privateLabel: true,
        samples: true,
        state: 'REJECTED',
      },
    ],
  },
  {
    licence: 'DEV-600006',
    color: '#15803d',
    storefront: {
      businessType: 'DISTRIBUTOR',
      descriptionEn:
        'Emirates Pantry Foods distributes dry food staples and beverages to restaurants, hotels and caterers in Abu Dhabi and Dubai.',
      descriptionAr:
        'توزع إمارات بانتري للأغذية المواد الغذائية الجافة والمشروبات للمطاعم والفنادق وشركات التموين في أبوظبي ودبي.',
      yearEstablished: 2017,
      city: 'Mussafah, Abu Dhabi',
      specializationEn: 'Rice, pulses, spices and beverages for HoReCa',
      specializationAr: 'الأرز والبقوليات والتوابل والمشروبات لقطاع الفنادق والمطاعم',
      capabilitiesEn: 'Temperature-controlled warehouse, repacking under private label.',
      capabilitiesAr: 'مستودع بدرجة حرارة مضبوطة، وإعادة التعبئة بعلامة خاصة.',
      productionCapacity: '400 tonnes per month',
      customizationServices: false,
      privateLabel: true,
      whiteLabel: true,
      samplesAvailable: true,
      fulfilmentEn: 'Next-day delivery in Abu Dhabi and Dubai for orders confirmed by 2 pm.',
      fulfilmentAr: 'توصيل في اليوم التالي في أبوظبي ودبي للطلبات المؤكدة قبل الساعة 2 ظهراً.',
      certifications: [
        { name: 'HACCP (declared)', issuer: 'Fictional' },
        { name: 'Halal (declared)', issuer: 'Fictional' },
      ],
    },
    products: [
      {
        cat: 'food-beverage',
        sub: 'dry-food',
        en: 'Basmati Rice Extra Long Grain 25 kg',
        ar: 'أرز بسمتي حبة طويلة جداً 25 كغ',
        dEn: 'Aged extra-long-grain basmati rice in 25 kg woven bags, for restaurants and caterers.',
        dAr: 'أرز بسمتي معتق حبة طويلة جداً في أكياس منسوجة 25 كغ للمطاعم وشركات التموين.',
        mode: 'READY_STOCK',
        price: 'TIERED',
        unit: 'PIECE',
        moq: 10,
        inc: 5,
        tiers: [
          [10, 14500],
          [50, 13800],
          [200, 13200],
        ],
        stock: 2400,
        attrs: { shelf_life_days: 540, halal: true },
        origin: 'IN',
        fulfil: 1,
        privateLabel: true,
        samples: true,
        certs: [{ name: 'Halal', issuer: 'Fictional Halal Authority' }],
        featured: true,
      },
      {
        cat: 'food-beverage',
        sub: 'beverages',
        en: 'Bottled Drinking Water 330 ml (Carton of 24)',
        ar: 'مياه شرب معبأة 330 مل (كرتون 24)',
        dEn: 'Low-sodium drinking water for hotels, offices and events. Private-label sleeves available on request.',
        dAr: 'مياه شرب منخفضة الصوديوم للفنادق والمكاتب والفعاليات. تتوفر أغلفة بعلامة خاصة عند الطلب.',
        mode: 'READY_STOCK',
        price: 'TIERED',
        unit: 'CARTON',
        moq: 50,
        inc: 10,
        tiers: [
          [50, 1350],
          [500, 1180],
        ],
        stock: 8000,
        attrs: { shelf_life_days: 365, halal: true },
        origin: 'AE',
        fulfil: 1,
        privateLabel: true,
        whiteLabel: true,
        certs: [{ name: 'Food safety (declared)', issuer: 'Fictional' }],
      },
      {
        cat: 'food-beverage',
        sub: 'food-service',
        en: 'Disposable Kraft Food Containers 750 ml',
        ar: 'علب طعام كرافت للاستعمال مرة واحدة 750 مل',
        dEn: 'Grease-resistant kraft containers with lids for takeaway and delivery.',
        dAr: 'علب كرافت مقاومة للدهون مع أغطية للطلبات الخارجية والتوصيل.',
        mode: 'READY_STOCK',
        price: 'FIXED',
        unit: 'CARTON',
        moq: 5,
        inc: 1,
        tiers: [[5, 18500]],
        stock: 3,
        attrs: { halal: false },
        origin: 'CN',
        fulfil: 2,
        certs: [{ name: 'Food contact (declared)', issuer: 'Fictional' }],
      },
    ],
  },
];

export async function seedCatalog(
  prisma: PrismaClient,
  s3: S3Client | null,
  env: AppEnv,
  ownerEmailFor: (licence: string) => string,
) {
  // Keyed on a seeded slug, not on "any category": integration tests create their own
  // categories in the same database before the seed runs in CI.
  if (await prisma.category.findUnique({ where: { slug: CATEGORIES[0]!.slug } })) {
    console.log('[seed] Catalog already present; skipping catalog seed.');
    return;
  }
  const bucket =
    env.STORAGE_MEDIA_BUCKET ?? (env.STORAGE_BUCKET ? `${env.STORAGE_BUCKET}-media` : undefined);
  if (s3 && bucket) {
    try {
      await s3.send(new HeadBucketCommand({ Bucket: bucket }));
    } catch {
      await s3.send(new CreateBucketCommand({ Bucket: bucket }));
    }
  }
  async function storeImage(
    buf: Buffer,
    ownerCompanyId: string | null,
    uploaderId: string,
    purpose: 'PRODUCT_IMAGE' | 'STOREFRONT_IMAGE' | 'CATEGORY_IMAGE',
  ) {
    const meta = await sharp(buf).metadata();
    const key = `${purpose.toLowerCase()}/${ownerCompanyId ?? 'platform'}/${randomUUID()}`;
    if (s3 && bucket)
      await s3.send(
        new PutObjectCommand({ Bucket: bucket, Key: key, Body: buf, ContentType: 'image/jpeg' }),
      );
    const f = await prisma.file.create({
      data: {
        ownerCompanyId,
        uploaderId,
        objectKey: key,
        originalName: 'sample.jpg',
        mime: 'image/jpeg',
        bytes: buf.length,
        sha256: createHash('sha256').update(buf).digest('hex'),
        scanState: s3 ? 'CLEAN' : 'PENDING',
        visibility: 'MEDIA',
        purpose,
        width: meta.width ?? null,
        height: meta.height ?? null,
      },
    });
    return f.id;
  }

  const adminUser = await prisma.user.findUniqueOrThrow({
    where: { email: 'superadmin@admin.test' },
  });
  const catIds = new Map<string, string>();
  const catColor = new Map<string, string>();
  let pos = 0;
  for (const c of CATEGORIES) {
    const img = await storeImage(
      await image(c.en, 'Category', c.color, 800, 600),
      null,
      adminUser.id,
      'CATEGORY_IMAGE',
    );
    const parent = await prisma.category.create({
      data: {
        slug: c.slug,
        nameEn: c.en,
        nameAr: c.ar,
        descriptionEn: c.dEn,
        descriptionAr: c.dAr,
        imageFileId: img,
        position: (pos += 10),
        visible: c.visible ?? true,
        priority: c.priority ?? false,
        restriction: c.restriction ?? 'OPEN',
        requirementsEn: c.reqEn ?? null,
        requirementsAr: c.reqAr ?? null,
      },
    });
    catIds.set(c.slug, parent.id);
    catColor.set(c.slug, c.color);
    let ap = 0;
    for (const a of c.attrs ?? []) {
      await prisma.categoryAttribute.create({
        data: {
          categoryId: parent.id,
          key: a.key,
          labelEn: a.en,
          labelAr: a.ar,
          type: a.type,
          options: (a.options ?? []).map(([value, label_en, label_ar]) => ({
            value,
            label_en,
            label_ar,
          })),
          unit: a.unit ?? null,
          required: a.required ?? false,
          filterable: a.filterable ?? false,
          position: (ap += 10),
        },
      });
    }
    let sp = 0;
    for (const [slug, en, ar] of c.subs) {
      const sub = await prisma.category.create({
        data: { parentId: parent.id, slug, nameEn: en, nameAr: ar, position: (sp += 10) },
      });
      catIds.set(slug, sub.id);
    }
  }
  for (const t of RESTRICTED_TERMS) {
    const n = await prisma.$queryRaw<{ v: string }[]>`SELECT mkt_normalize(${t.term}) AS v`;
    await prisma.restrictedTerm.create({
      data: {
        term: t.term,
        normalized: n[0]!.v,
        action: t.action,
        note: t.note,
        createdById: adminUser.id,
      },
    });
  }

  for (const s of SELLERS) {
    const company = await prisma.company.findFirst({
      where: { licenceNumber: s.licence },
      include: { workspaces: true },
    });
    if (!company) continue;
    const ws = company.workspaces.find((w) => w.kind === 'SELLER');
    if (!ws) continue;
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email: ownerEmailFor(s.licence) },
    });
    const sf = await prisma.storefront.create({
      data: {
        ...(s.storefront as object),
        sellerWorkspaceId: ws.id,
        companyId: company.id,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      } as Prisma.StorefrontUncheckedCreateInput,
    });
    const logo = await storeImage(
      await image(company.displayName.split(' ')[0]!, 'Logo', s.color, 400, 400),
      company.id,
      owner.id,
      'STOREFRONT_IMAGE',
    );
    const cover = await storeImage(
      await image(company.displayName, 'Verified supplier', s.color, 1600, 600),
      company.id,
      owner.id,
      'STOREFRONT_IMAGE',
    );
    const factory = await storeImage(
      await image('Production floor', company.displayName, s.color),
      company.id,
      owner.id,
      'STOREFRONT_IMAGE',
    );
    const warehouse = await storeImage(
      await image('Warehouse', company.displayName, s.color),
      company.id,
      owner.id,
      'STOREFRONT_IMAGE',
    );
    await prisma.storefrontMedia.createMany({
      data: [
        { storefrontId: sf.id, fileId: logo, kind: 'LOGO', position: 0 },
        { storefrontId: sf.id, fileId: cover, kind: 'COVER', position: 0 },
        {
          storefrontId: sf.id,
          fileId: factory,
          kind: 'FACTORY',
          position: 0,
          captionEn: 'Production floor',
          captionAr: 'خط الإنتاج',
        },
        {
          storefrontId: sf.id,
          fileId: warehouse,
          kind: 'WAREHOUSE',
          position: 0,
          captionEn: 'Warehouse',
          captionAr: 'المستودع',
        },
      ],
    });
    await prisma.moderationEvent.create({
      data: {
        storefrontId: sf.id,
        actorId: owner.id,
        actorType: 'system',
        action: 'publish',
        toState: 'PUBLISHED',
        reason: 'Seeded (development data)',
      },
    });
    if (s.licence === 'DEV-200002' || s.licence === 'DEV-500005') {
      await prisma.featuredListing.create({
        data: {
          kind: 'SUPPLIER',
          storefrontId: sf.id,
          reason: 'Development sample placement',
          createdById: adminUser.id,
        },
      });
    }

    let idx = 0;
    for (const p of s.products) {
      idx++;
      const state = p.state ?? 'APPROVED';
      const now = new Date(Date.now() - (s.products.length - idx) * 3600_000);
      const product = await prisma.product.create({
        data: {
          sellerWorkspaceId: ws.id,
          companyId: company.id,
          status: state === 'APPROVED' ? 'PUBLISHED' : 'DRAFT',
          priceType: p.price,
          createdById: owner.id,
          firstPublishedAt: state === 'APPROVED' ? now : null,
          publishedAt: state === 'APPROVED' ? now : null,
        },
      });
      const v = await prisma.productVersion.create({
        data: {
          productId: product.id,
          version: 1,
          state: 'DRAFT',
          titleEn: p.en,
          titleAr: p.ar,
          descriptionEn: p.dEn,
          descriptionAr: p.dAr,
          categoryId: catIds.get(p.sub)!,
          mode: p.mode,
          attributes: p.attrs ?? {},
          specifications: [
            { label_en: 'Unit', label_ar: 'الوحدة', value: p.unit.toLowerCase() },
            ...(p.dims ? [{ label_en: 'Dimensions', label_ar: 'الأبعاد', value: p.dims }] : []),
          ],
          materials: p.materials ?? null,
          dimensions: p.dims ?? null,
          countryOfOrigin: p.origin ?? null,
          leadTimeMinDays: p.lead?.[0] ?? null,
          leadTimeMaxDays: p.lead?.[1] ?? null,
          fulfilmentDays: p.fulfil ?? null,
          customManufacturing: p.custom ?? false,
          privateLabel: p.privateLabel ?? false,
          whiteLabel: p.whiteLabel ?? false,
          samplesAvailable: p.samples ?? false,
          sampleNote: p.samples ? 'Samples available on request (charges may apply).' : null,
          certifications: (p.certs ?? []).map((c) => ({
            name: c.name,
            issuer: c.issuer ?? null,
            number: null,
            valid_until: null,
          })),
          createdById: owner.id,
        },
      });
      const color = catColor.get(p.cat) ?? s.color;
      for (let i = 0; i < 2; i++) {
        const fid = await storeImage(
          await image(
            p.en.split(' ').slice(0, 3).join(' '),
            i === 0 ? company.displayName : 'Detail view',
            color,
          ),
          company.id,
          owner.id,
          'PRODUCT_IMAGE',
        );
        await prisma.productMedia.create({
          data: { productVersionId: v.id, fileId: fid, position: i, altEn: p.en, altAr: p.ar },
        });
      }
      const decided = state === 'APPROVED' || state === 'REJECTED';
      await prisma.productVersion.update({
        where: { id: v.id },
        data: {
          state,
          submittedAt: state === 'DRAFT' ? null : now,
          submittedById: state === 'DRAFT' ? null : owner.id,
          decidedAt: decided ? now : null,
          decidedById: decided ? adminUser.id : null,
          decisionReason:
            state === 'REJECTED'
              ? 'Please add clear size chart and care instructions to the description (sample rejection).'
              : null,
        },
      });
      await prisma.product.update({
        where: { id: product.id },
        data: state === 'APPROVED' ? { publishedVersionId: v.id } : { workingVersionId: v.id },
      });
      const variants = p.variants ?? [
        {
          code: `${s.licence.slice(4)}-${idx.toString().padStart(3, '0')}`,
          attrs: {},
          stock: p.stock,
        },
      ];
      let minPrice: bigint | null = null;
      for (const vr of variants) {
        const sku = await prisma.sku.create({
          data: {
            productId: product.id,
            sellerWorkspaceId: ws.id,
            code: vr.code,
            variantAttributes: vr.attrs,
            unit: p.unit,
            moq: p.moq,
            orderIncrement: p.inc,
            approvedAt: state === 'APPROVED' ? now : null,
            lowStockThreshold: p.mode === 'READY_STOCK' ? Math.max(p.moq, 50) : 0,
          },
        });
        for (const [minQty, fils] of p.tiers) {
          await prisma.priceTier.create({
            data: { skuId: sku.id, minQty, unitPriceFils: BigInt(fils) },
          });
          if (minPrice === null || BigInt(fils) < minPrice) minPrice = BigInt(fils);
        }
        await prisma.inventory.create({ data: { skuId: sku.id, onHand: vr.stock } });
        if (vr.stock > 0)
          await prisma.stockMovement.create({
            data: {
              skuId: sku.id,
              actorId: owner.id,
              kind: 'RECEIVE',
              deltaOnHand: vr.stock,
              onHandAfter: vr.stock,
              reservedAfter: 0,
              unavailableAfter: 0,
              reason: 'Opening stock (development seed)',
            },
          });
      }
      await prisma.product.update({
        where: { id: product.id },
        data: { minPriceFils: p.price === 'QUOTE_ONLY' ? null : minPrice, minMoq: p.moq },
      });
      await prisma.moderationEvent.create({
        data: {
          productId: product.id,
          productVersionId: v.id,
          actorId: null,
          actorType: 'system',
          action: 'seed',
          toState: state,
          reason: 'Seeded (development data)',
        },
      });
      if (p.featured)
        await prisma.featuredListing.create({
          data: {
            kind: 'PRODUCT',
            productId: product.id,
            position: idx,
            reason: 'Development sample placement',
            createdById: adminUser.id,
          },
        });
    }
  }
  console.log(
    '[seed] Catalog: 12 categories, restricted terms, 3 storefronts and sample products.',
  );
}
