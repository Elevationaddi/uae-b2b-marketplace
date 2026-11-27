'use client';
import type { CategoryDetail, SellerProductDetail, SkuDetail, VersionDetail } from '@app/contracts';
import { filsToDecimal, parseAedToFils, QUANTITY_UNITS } from '@app/contracts';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, type FormEvent, type ReactNode } from 'react';
import { fieldText, useApp, useT } from '@/components/app-context';
import { MediaImg, Money, useLocalized } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import { sellerApi, SellerShell } from '@/components/seller-shell';
import type { Workspace } from '@/components/session';
import {
  Alert,
  ApiErrorAlert,
  Button,
  ConfirmDialog,
  DefinitionList,
  Field,
  PageHeader,
  SelectField,
  StatusBadge,
  TextArea,
} from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import type { ApiError } from '@/lib/client';
import { useMutation, useResource } from '@/lib/use-resource';

type Ctx = {
  ws: Workspace;
  base: string;
  p: SellerProductDetail;
  path: string;
  /** Replace the product with the server's response (every mutation returns the full detail). */
  apply: (p: SellerProductDetail) => void;
  reload: () => void;
};

const num = (v: FormDataEntryValue | null): number | null => {
  const s = String(v ?? '').trim();
  return s === '' ? null : Number(s);
};

// ------------------------------------------------------------------ content

function ContentForm({ c, v }: { c: Ctx; v: VersionDetail }) {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const m = useMutation();
  const [saved, setSaved] = useState(false);
  const [categoryId, setCategoryId] = useState(v.category.id);
  const cat = useResource<CategoryDetail>(`/marketplace/categories/${categoryId}`);
  const cats = useResource<
    {
      id: string;
      name_en: string;
      name_ar: string;
      children: { id: string; name_en: string; name_ar: string }[];
    }[]
  >('/marketplace/categories');
  const [specs, setSpecs] = useState(
    v.specifications.map((s) => ({ ...s, label_ar: s.label_ar ?? '' })),
  );
  const [certs, setCerts] = useState(
    v.certifications.map((x) => ({
      name: x.name,
      issuer: x.issuer ?? '',
      number: x.number ?? '',
      valid_until: x.valid_until ?? '',
    })),
  );
  const fe = (k: string) => fieldText(locale, m.error?.fieldErrors[k]);
  const disabled = !c.p.actions.edit;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaved(false);
    const fd = new FormData(e.currentTarget);
    const s = (k: string) => String(fd.get(k) ?? '').trim();
    const attributes: Record<string, string | number | boolean> = {};
    if (cat.state.status === 'ready')
      for (const a of cat.state.data.attributes) {
        const raw = fd.get(`attr_${a.key}`);
        if (a.type === 'BOOLEAN') attributes[a.key] = raw === 'true';
        else if (raw !== null && String(raw).trim() !== '')
          attributes[a.key] = a.type === 'NUMBER' ? Number(raw) : String(raw).trim();
      }
    const r = await m.run<SellerProductDetail>(c.path, {
      method: 'PATCH',
      body: {
        expected_version: c.p.version,
        title_en: s('title_en'),
        title_ar: s('title_ar') || null,
        description_en: s('description_en'),
        description_ar: s('description_ar') || null,
        category_id: categoryId,
        mode: s('mode'),
        attributes,
        specifications: specs
          .filter((x) => x.label_en.trim() && x.value.trim())
          .map((x) => ({
            label_en: x.label_en.trim(),
            label_ar: x.label_ar.trim() || null,
            value: x.value.trim(),
          })),
        materials: s('materials') || null,
        dimensions: s('dimensions') || null,
        country_of_origin: s('country_of_origin') || null,
        lead_time_min_days: num(fd.get('lead_time_min_days')),
        lead_time_max_days: num(fd.get('lead_time_max_days')),
        fulfilment_days: num(fd.get('fulfilment_days')),
        custom_manufacturing: fd.get('custom_manufacturing') === 'on',
        private_label: fd.get('private_label') === 'on',
        white_label: fd.get('white_label') === 'on',
        samples_available: fd.get('samples_available') === 'on',
        sample_note: s('sample_note') || null,
        certifications: certs
          .filter((x) => x.name.trim())
          .map((x) => ({
            name: x.name.trim(),
            issuer: x.issuer.trim() || null,
            number: x.number.trim() || null,
            valid_until: x.valid_until || null,
          })),
        video_url: s('video_url') || null,
      },
    });
    if (r.ok) {
      c.apply(r.data);
      setSaved(true);
    }
  };

  return (
    <form className="card" onSubmit={submit} aria-labelledby="sec-content" noValidate>
      <h2 id="sec-content" className="h3">
        {t('seller.content')}
      </h2>
      <p className="muted small">{t('seller.content_hint')}</p>
      <fieldset disabled={disabled}>
        <div className="grid-2">
          <Field
            label={t('seller.title_en')}
            name="title_en"
            defaultValue={v.title_en}
            maxLength={150}
            error={fe('title_en')}
          />
          <Field
            label={t('seller.title_ar')}
            name="title_ar"
            defaultValue={v.title_ar ?? ''}
            dir="rtl"
            lang="ar"
            maxLength={150}
            optional
            error={fe('title_ar')}
          />
        </div>
        <TextArea
          label={t('seller.desc_en')}
          name="description_en"
          defaultValue={v.description_en}
          rows={6}
          maxLength={8000}
          hint={t('field.min_description')}
          error={fe('description_en')}
        />
        <TextArea
          label={t('seller.desc_ar')}
          name="description_ar"
          defaultValue={v.description_ar ?? ''}
          rows={6}
          dir="rtl"
          lang="ar"
          maxLength={8000}
          error={fe('description_ar')}
        />
        <div className="grid-2">
          <div className={`field ${fe('category_id') ? 'field-invalid' : ''}`}>
            <label htmlFor="pe-cat">{t('seller.category')}</label>
            <select id="pe-cat" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {cats.state.status === 'ready' ? (
                cats.state.data.map((x) =>
                  x.children.length ? (
                    <optgroup key={x.id} label={L(x.name_en, x.name_ar)}>
                      {x.children.map((s) => (
                        <option key={s.id} value={s.id}>
                          {L(s.name_en, s.name_ar)}
                        </option>
                      ))}
                    </optgroup>
                  ) : (
                    <option key={x.id} value={x.id}>
                      {L(x.name_en, x.name_ar)}
                    </option>
                  ),
                )
              ) : (
                <option value={v.category.id}>{L(v.category.name_en, v.category.name_ar)}</option>
              )}
            </select>
            {fe('category_id') ? <p className="field-error">{fe('category_id')}</p> : null}
          </div>
          <SelectField
            label={t('seller.mode')}
            name="mode"
            defaultValue={v.mode}
            options={[
              { value: 'READY_STOCK', label: t('mode.READY_STOCK') },
              { value: 'MADE_TO_ORDER', label: t('mode.MADE_TO_ORDER') },
            ]}
          />
        </div>
        {cat.state.status === 'ready' && cat.state.data.restriction === 'REVIEW_REQUIRED' ? (
          <Alert kind="info" title={t('mkt.category_requirements')}>
            {L(cat.state.data.requirements_en, cat.state.data.requirements_ar)}
          </Alert>
        ) : null}

        {cat.state.status === 'ready' && cat.state.data.attributes.length ? (
          <fieldset>
            <legend>{t('seller.attributes')}</legend>
            <div className="grid-2">
              {cat.state.data.attributes.map((a) => {
                const cur = v.attributes[a.key];
                const label = `${L(a.label_en, a.label_ar)}${a.unit ? ` (${a.unit})` : ''}`;
                const err = fe(`attributes.${a.key}`);
                if (a.type === 'BOOLEAN')
                  return (
                    <label key={a.id} className="check">
                      <input
                        type="checkbox"
                        name={`attr_${a.key}`}
                        value="true"
                        defaultChecked={cur === true}
                      />
                      {label}
                    </label>
                  );
                if (a.type === 'SELECT')
                  return (
                    <SelectField
                      key={a.id}
                      label={label}
                      name={`attr_${a.key}`}
                      defaultValue={cur === undefined ? '' : String(cur)}
                      error={err}
                      options={[
                        { value: '', label: a.required ? t('seller.choose') : t('common.none') },
                        ...a.options.map((o) => ({
                          value: o.value,
                          label: L(o.label_en, o.label_ar),
                        })),
                      ]}
                    />
                  );
                return (
                  <Field
                    key={a.id}
                    label={label}
                    name={`attr_${a.key}`}
                    type={a.type === 'NUMBER' ? 'number' : 'text'}
                    defaultValue={cur === undefined ? '' : String(cur)}
                    optional={!a.required}
                    error={err}
                  />
                );
              })}
            </div>
          </fieldset>
        ) : null}

        <fieldset>
          <legend>{t('seller.details')}</legend>
          <div className="grid-3">
            <Field
              label={t('seller.lead_min')}
              name="lead_time_min_days"
              type="number"
              min={0}
              max={365}
              defaultValue={v.lead_time_min_days ?? ''}
              optional
            />
            <Field
              label={t('seller.lead_max')}
              name="lead_time_max_days"
              type="number"
              min={0}
              max={365}
              defaultValue={v.lead_time_max_days ?? ''}
              optional
              error={fe('lead_time_max_days')}
            />
            <Field
              label={t('seller.fulfilment_days')}
              name="fulfilment_days"
              type="number"
              min={0}
              max={365}
              defaultValue={v.fulfilment_days ?? ''}
              optional
            />
          </div>
          <div className="grid-3">
            <Field
              label={t('seller.materials')}
              name="materials"
              defaultValue={v.materials ?? ''}
              maxLength={300}
              optional
            />
            <Field
              label={t('seller.dimensions')}
              name="dimensions"
              defaultValue={v.dimensions ?? ''}
              maxLength={200}
              optional
            />
            <Field
              label={t('seller.country')}
              name="country_of_origin"
              defaultValue={v.country_of_origin ?? ''}
              maxLength={2}
              dir="ltr"
              optional
              error={fe('country_of_origin')}
            />
          </div>
          <Field
            label={t('seller.video')}
            name="video_url"
            type="url"
            dir="ltr"
            defaultValue={v.video_url ?? ''}
            optional
            error={fe('video_url')}
          />
        </fieldset>

        <fieldset>
          <legend>{t('seller.customisation')}</legend>
          {(
            [
              ['custom_manufacturing', 'mkt.custom', v.custom_manufacturing],
              ['private_label', 'mkt.private_label', v.private_label],
              ['white_label', 'mkt.white_label', v.white_label],
              ['samples_available', 'mkt.samples', v.samples_available],
            ] as [string, MessageKey, boolean][]
          ).map(([k, l, d]) => (
            <label key={k} className="check">
              <input type="checkbox" name={k} defaultChecked={d} />
              {t(l)}
            </label>
          ))}
          <Field
            label={t('seller.sample_note')}
            name="sample_note"
            defaultValue={v.sample_note ?? ''}
            maxLength={300}
            optional
          />
        </fieldset>

        <fieldset>
          <legend>{t('pd.specifications')}</legend>
          {specs.map((s, i) => (
            <div key={i} className="grid-3 row-with-remove">
              <Field
                label={`${t('seller.spec_label_en')} ${i + 1}`}
                value={s.label_en}
                onChange={(e) =>
                  setSpecs(specs.map((x, j) => (j === i ? { ...x, label_en: e.target.value } : x)))
                }
              />
              <Field
                label={`${t('seller.spec_label_ar')} ${i + 1}`}
                dir="rtl"
                value={s.label_ar}
                onChange={(e) =>
                  setSpecs(specs.map((x, j) => (j === i ? { ...x, label_ar: e.target.value } : x)))
                }
              />
              <Field
                label={`${t('seller.spec_value')} ${i + 1}`}
                value={s.value}
                onChange={(e) =>
                  setSpecs(specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))
                }
              />
              <Button
                type="button"
                variant="link"
                onClick={() => setSpecs(specs.filter((_, j) => j !== i))}
              >
                {t('common.remove')}
              </Button>
            </div>
          ))}
          {specs.length < 40 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSpecs([...specs, { label_en: '', label_ar: '', value: '' }])}
            >
              {t('seller.add_spec')}
            </Button>
          ) : null}
        </fieldset>

        <fieldset>
          <legend>{t('seller.certifications')}</legend>
          {certs.map((x, i) => (
            <div key={i} className="grid-4 row-with-remove">
              <Field
                label={`${t('seller.cert_name')} ${i + 1}`}
                value={x.name}
                onChange={(e) =>
                  setCerts(certs.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)))
                }
              />
              <Field
                label={t('seller.cert_issuer')}
                value={x.issuer}
                optional
                onChange={(e) =>
                  setCerts(certs.map((y, j) => (j === i ? { ...y, issuer: e.target.value } : y)))
                }
              />
              <Field
                label={t('seller.cert_number')}
                value={x.number}
                optional
                onChange={(e) =>
                  setCerts(certs.map((y, j) => (j === i ? { ...y, number: e.target.value } : y)))
                }
              />
              <Field
                label={t('seller.cert_valid_until')}
                type="date"
                value={x.valid_until}
                optional
                onChange={(e) =>
                  setCerts(
                    certs.map((y, j) => (j === i ? { ...y, valid_until: e.target.value } : y)),
                  )
                }
              />
              <Button
                type="button"
                variant="link"
                onClick={() => setCerts(certs.filter((_, j) => j !== i))}
              >
                {t('common.remove')}
              </Button>
            </div>
          ))}
          {certs.length < 20 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setCerts([...certs, { name: '', issuer: '', number: '', valid_until: '' }])
              }
            >
              {t('seller.add_cert')}
            </Button>
          ) : null}
        </fieldset>
      </fieldset>
      {m.error ? <ApiErrorAlert error={m.error} /> : null}
      {saved ? <Alert kind="success">{t('seller.saved')}</Alert> : null}
      {disabled ? null : (
        <Button type="submit" busy={m.busy}>
          {t('seller.save_draft')}
        </Button>
      )}
    </form>
  );
}

// ------------------------------------------------------------------ media

function MediaSection({ c, v }: { c: Ctx; v: VersionDetail }) {
  const t = useT();
  const L = useLocalized();
  const m = useMutation();
  const edit = c.p.actions.edit;
  const upload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get('file');
    if (!(file instanceof File) || file.size === 0) return;
    const r = await m.run<SellerProductDetail>(`${c.path}/media`, { method: 'POST', form: fd });
    if (r.ok) {
      form.reset();
      c.apply(r.data);
    }
  };
  const move = async (i: number, dir: -1 | 1) => {
    const ids = v.media.map((x) => x.file_id);
    const j = i + dir;
    [ids[i], ids[j]] = [ids[j]!, ids[i]!];
    const r = await m.run<SellerProductDetail>(`${c.path}/media/reorder`, {
      method: 'POST',
      body: { file_ids: ids, expected_version: c.p.version },
    });
    if (r.ok) c.apply(r.data);
  };
  const remove = async (fileId: string) => {
    const r = await m.run<SellerProductDetail>(`${c.path}/media/${fileId}`, { method: 'DELETE' });
    if (r.ok) c.apply(r.data);
  };
  return (
    <section className="card" aria-labelledby="sec-media">
      <h2 id="sec-media" className="h3">
        {t('seller.media')}
      </h2>
      <p className="muted small">{t('seller.media_hint')}</p>
      {v.media.length ? (
        <ul className="media-grid">
          {v.media.map((x, i) => (
            <li key={x.id}>
              <MediaImg
                src={x.url}
                alt={L(x.alt_en, x.alt_ar) || t('pd.image_n', { n: i + 1, total: v.media.length })}
              />
              {edit ? (
                <div className="media-actions">
                  <Button
                    type="button"
                    variant="link"
                    disabled={i === 0 || m.busy}
                    onClick={() => move(i, -1)}
                  >
                    {t('seller.move_up')}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    disabled={i === v.media.length - 1 || m.busy}
                    onClick={() => move(i, 1)}
                  >
                    {t('seller.move_down')}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    disabled={m.busy}
                    onClick={() => remove(x.file_id)}
                  >
                    {t('seller.remove_image')}
                  </Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      {edit && v.media.length < 12 ? (
        <form onSubmit={upload} className="upload-form">
          <div className="field">
            <label htmlFor="pm-file">{t('seller.upload_image')}</label>
            <input
              id="pm-file"
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
            />
          </div>
          <div className="grid-2">
            <Field label={t('seller.alt_en')} name="alt_en" maxLength={150} optional />
            <Field label={t('seller.alt_ar')} name="alt_ar" maxLength={150} dir="rtl" optional />
          </div>
          <Button type="submit" variant="secondary" busy={m.busy}>
            {t('seller.upload_image')}
          </Button>
        </form>
      ) : null}
      {m.error ? <ApiErrorAlert error={m.error} /> : null}
    </section>
  );
}

// ------------------------------------------------------------------ SKUs

function SkuSection({ c }: { c: Ctx }) {
  const { locale } = useApp();
  const t = useT();
  const m = useMutation();
  const [variant, setVariant] = useState('');
  const fe = (k: string) => fieldText(locale, m.error?.fieldErrors[k]);
  const add = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const attrs: Record<string, string> = {};
    for (const part of variant.split(',')) {
      const [k, ...rest] = part.split(/[:=]/);
      if (k?.trim() && rest.join(':').trim()) attrs[k.trim()] = rest.join(':').trim();
    }
    const r = await m.run<SellerProductDetail>(`${c.path}/skus`, {
      method: 'POST',
      body: {
        code: String(fd.get('code') ?? '').trim(),
        unit: String(fd.get('unit')),
        variant_attributes: attrs,
      },
    });
    if (r.ok) {
      form.reset();
      setVariant('');
      c.apply(r.data);
    }
  };
  const patch = async (s: SkuDetail, body: Record<string, unknown>) => {
    const r = await m.run<SellerProductDetail>(`${c.path}/skus/${s.id}`, { method: 'PATCH', body });
    if (r.ok) c.apply(r.data);
  };
  const del = async (s: SkuDetail) => {
    const r = await m.run<SellerProductDetail>(`${c.path}/skus/${s.id}`, { method: 'DELETE' });
    if (r.ok) c.apply(r.data);
  };
  return (
    <section className="card" aria-labelledby="sec-skus">
      <h2 id="sec-skus" className="h3">
        {t('seller.skus')}
      </h2>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">{t('pd.sku')}</th>
              <th scope="col">{t('seller.variant_attrs')}</th>
              <th scope="col">{t('seller.unit')}</th>
              <th scope="col">{t('common.status')}</th>
              <th scope="col">{t('seller.available')}</th>
              <th scope="col">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {c.p.skus.map((s) => (
              <tr key={s.id}>
                <td>
                  <bdi>{s.code}</bdi>
                </td>
                <td>
                  {Object.entries(s.variant_attributes)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(', ') || '—'}
                </td>
                <td>{t(`unit.${s.unit}` as MessageKey)}</td>
                <td>
                  {!s.approved
                    ? t('seller.sku_pending')
                    : s.active
                      ? t('seller.sku_active')
                      : t('seller.sku_inactive')}
                </td>
                <td>{s.inventory.available}</td>
                <td>
                  {c.p.actions.edit ? (
                    <>
                      <Button
                        type="button"
                        variant="link"
                        disabled={m.busy}
                        onClick={() => patch(s, { active: !s.active })}
                      >
                        {s.active ? t('seller.deactivate') : t('seller.activate')}
                      </Button>
                      {!s.approved ? (
                        <Button
                          type="button"
                          variant="link"
                          disabled={m.busy}
                          onClick={() => del(s)}
                        >
                          {t('seller.delete_sku')}
                        </Button>
                      ) : null}
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {c.p.actions.edit ? (
        <form onSubmit={add} className="grid-4 inline-add" noValidate>
          <Field label={t('pd.sku')} name="code" required dir="ltr" error={fe('code')} />
          <Field
            label={t('seller.variant_attrs')}
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            hint={t('seller.variant_hint')}
            optional
          />
          <SelectField
            label={t('seller.unit')}
            name="unit"
            defaultValue={c.p.skus[0]?.unit ?? 'PIECE'}
            options={QUANTITY_UNITS.map((u) => ({ value: u, label: t(`unit.${u}` as MessageKey) }))}
          />
          <Button type="submit" variant="secondary" busy={m.busy}>
            {t('seller.add_sku')}
          </Button>
        </form>
      ) : null}
      {m.error ? <ApiErrorAlert error={m.error} /> : null}
    </section>
  );
}

// ------------------------------------------------------------------ pricing

type TierDraft = { min_qty: string; price: string };
type SkuDraft = {
  sku_id: string;
  code: string;
  moq: string;
  order_increment: string;
  tiers: TierDraft[];
};

function PricingEditor({ c }: { c: Ctx }) {
  const { locale } = useApp();
  const t = useT();
  const m = useMutation();
  const [saved, setSaved] = useState(false);
  const [priceType, setPriceType] = useState(c.p.price_type);
  const [rows, setRows] = useState<SkuDraft[]>(() =>
    c.p.skus.map((s) => ({
      sku_id: s.id,
      code: s.code,
      moq: String(s.moq),
      order_increment: String(s.order_increment),
      tiers: s.tiers.length
        ? s.tiers.map((x) => ({
            min_qty: String(x.min_qty),
            price: filsToDecimal(x.unit_price_fils),
          }))
        : [{ min_qty: String(s.moq), price: '' }],
    })),
  );
  const [localError, setLocalError] = useState<string | null>(null);
  const setRow = (i: number, r: Partial<SkuDraft>) =>
    setRows(rows.map((x, j) => (j === i ? { ...x, ...r } : x)));
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setLocalError(null);
    const skus = [];
    for (const r of rows) {
      const tiers = [];
      if (priceType !== 'QUOTE_ONLY')
        for (const x of r.tiers) {
          const fils = parseAedToFils(x.price);
          if (fils === null) {
            setLocalError(t('field.money'));
            return;
          }
          tiers.push({ min_qty: Number(x.min_qty), unit_price_fils: fils.toString() });
        }
      skus.push({
        sku_id: r.sku_id,
        moq: Number(r.moq),
        order_increment: Number(r.order_increment),
        tiers,
      });
    }
    const res = await m.run<SellerProductDetail>(`${c.path}/pricing`, {
      method: 'POST',
      body: { price_type: priceType, skus, expected_version: c.p.version },
    });
    if (res.ok) {
      c.apply(res.data);
      setSaved(true);
    }
  };
  const fieldErr = (k: string) => fieldText(locale, m.error?.fieldErrors[k]);
  return (
    <form className="card" onSubmit={submit} aria-labelledby="sec-pricing" noValidate>
      <h2 id="sec-pricing" className="h3">
        {t('seller.pricing')}
      </h2>
      <p className="muted small">{t('seller.pricing_hint')}</p>
      <fieldset disabled={!c.p.actions.price}>
        <SelectField
          label={t('seller.price_type')}
          value={priceType}
          onChange={(e) => setPriceType(e.target.value as typeof priceType)}
          options={(['FIXED', 'TIERED', 'QUOTE_ONLY'] as const).map((p) => ({
            value: p,
            label: t(`ptype.${p}` as MessageKey),
          }))}
        />
        {rows.map((r, i) => (
          <fieldset key={r.sku_id} className="sku-pricing">
            <legend>
              <bdi>{r.code}</bdi>
            </legend>
            <div className="grid-2">
              <Field
                label={t('seller.moq')}
                type="number"
                min={1}
                value={r.moq}
                onChange={(e) => setRow(i, { moq: e.target.value })}
                error={fieldErr(`skus.${i}.moq`)}
              />
              <Field
                label={t('seller.increment')}
                type="number"
                min={1}
                value={r.order_increment}
                onChange={(e) => setRow(i, { order_increment: e.target.value })}
                error={fieldErr(`skus.${i}.order_increment`)}
              />
            </div>
            {priceType !== 'QUOTE_ONLY' ? (
              <>
                {(priceType === 'FIXED' ? r.tiers.slice(0, 1) : r.tiers).map((x, k) => (
                  <div key={k} className="grid-3 row-with-remove">
                    <Field
                      label={`${t('seller.tier_qty')} ${k + 1}`}
                      type="number"
                      min={1}
                      value={x.min_qty}
                      onChange={(e) =>
                        setRow(i, {
                          tiers: r.tiers.map((y, j) =>
                            j === k ? { ...y, min_qty: e.target.value } : y,
                          ),
                        })
                      }
                      error={fieldErr(`skus.${i}.tiers.${k}.min_qty`)}
                    />
                    <Field
                      label={`${t('seller.tier_price')} ${k + 1}`}
                      inputMode="decimal"
                      dir="ltr"
                      value={x.price}
                      onChange={(e) =>
                        setRow(i, {
                          tiers: r.tiers.map((y, j) =>
                            j === k ? { ...y, price: e.target.value } : y,
                          ),
                        })
                      }
                      error={fieldErr(`skus.${i}.tiers.${k}.unit_price_fils`)}
                    />
                    {priceType === 'TIERED' && r.tiers.length > 1 ? (
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setRow(i, { tiers: r.tiers.filter((_, j) => j !== k) })}
                      >
                        {t('seller.remove_tier')}
                      </Button>
                    ) : null}
                  </div>
                ))}
                {priceType === 'TIERED' && r.tiers.length < 10 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setRow(i, { tiers: [...r.tiers, { min_qty: '', price: '' }] })}
                  >
                    {t('seller.add_tier')}
                  </Button>
                ) : null}
              </>
            ) : null}
          </fieldset>
        ))}
      </fieldset>
      {localError ? <Alert kind="error">{localError}</Alert> : null}
      {m.error ? <ApiErrorAlert error={m.error} /> : null}
      {saved ? <Alert kind="success">{t('seller.saved')}</Alert> : null}
      {c.p.actions.price ? (
        <Button type="submit" busy={m.busy}>
          {t('seller.save_pricing')}
        </Button>
      ) : null}
    </form>
  );
}

// ------------------------------------------------------------------ lifecycle

type Act = 'submit' | 'withdraw' | 'archive' | 'unpublish' | 'republish' | 'restore' | 'duplicate';

function Lifecycle({ c }: { c: Ctx }) {
  const t = useT();
  const router = useRouter();
  const m = useMutation();
  const [pending, setPending] = useState<Act | null>(null);
  const acts: Act[] = (
    ['submit', 'withdraw', 'unpublish', 'republish', 'restore', 'archive', 'duplicate'] as Act[]
  ).filter((a) => c.p.actions[a]);
  const run = async () => {
    if (!pending) return;
    const r = await m.run<SellerProductDetail>(`${c.path}/${pending}`, {
      method: 'POST',
      body: pending === 'duplicate' ? undefined : { expected_version: c.p.version },
    });
    if (r.ok) {
      setPending(null);
      if (pending === 'duplicate') router.push(`${c.base}/products/${r.data.id}`);
      else c.apply(r.data);
    }
  };
  if (!acts.length) return null;
  return (
    <div className="actions" aria-label={t('seller.actions')} role="group">
      {acts.map((a) => (
        <Button
          key={a}
          type="button"
          variant={a === 'submit' ? 'primary' : 'secondary'}
          onClick={() => setPending(a)}
        >
          {t(`seller.${a}` as MessageKey)}
        </Button>
      ))}
      <ConfirmDialog
        open={pending !== null}
        title={pending ? t(`seller.${pending}` as MessageKey) : ''}
        body={pending ? t(`seller.confirm.${pending}` as MessageKey) : ''}
        confirmLabel={pending ? t(`seller.${pending}` as MessageKey) : ''}
        danger={pending === 'archive' || pending === 'unpublish'}
        busy={m.busy}
        error={m.error as ApiError | null}
        onConfirm={run}
        onClose={() => {
          setPending(null);
          m.setError(null);
        }}
      />
    </div>
  );
}

function Editor({ ws, base, id }: { ws: Workspace; base: string; id: string }) {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const path = `${sellerApi(ws)}/products/${id}`;
  const { state, reload, setData } = useResource<SellerProductDetail>(path);
  return (
    <Resource state={state} reload={reload} backHref={`${base}/products`} lines={10}>
      {(p) => {
        const v = p.working_version ?? p.published_version;
        const c: Ctx = { ws, base, p, path, apply: setData, reload };
        if (!v) return null;
        return (
          <>
            <p className="small">
              <Link href={`${base}/products`}>← {t('seller.nav.products')}</Link>
            </p>
            <PageHeader title={L(v.title_en, v.title_ar)}>
              {p.public ? (
                <Link href={`/${locale}/products/${p.id}`} className="btn btn-secondary">
                  {t('seller.preview')}
                </Link>
              ) : null}
            </PageHeader>
            <div className="status-row">
              <StatusBadge value={p.status} label={t(`pstatus.${p.status}` as MessageKey)} />
              {p.working_version ? (
                <StatusBadge
                  value={p.working_version.state}
                  label={t(`vstate.${p.working_version.state}` as MessageKey)}
                />
              ) : null}
              {p.public ? <span className="pill pill-ok">{t('seller.public_badge')}</span> : null}
            </div>
            {p.status_reason ? (
              <Alert kind="warning" title={t('seller.status_reason')}>
                {p.status_reason}
              </Alert>
            ) : null}
            {p.working_version?.decision_reason &&
            (p.working_version.state === 'REJECTED' ||
              p.working_version.state === 'CHANGES_REQUESTED') ? (
              <Alert kind="warning" title={t('seller.decision_reason')}>
                {p.working_version.decision_reason}
              </Alert>
            ) : null}
            {!p.actions.edit && p.working_version?.state === 'PENDING_REVIEW' ? (
              <Alert kind="info">{t('error.catalog.pending_review_locked')}</Alert>
            ) : null}
            {p.working_version && p.published_version ? (
              <Alert kind="info">{t('seller.live_note')}</Alert>
            ) : null}
            <Lifecycle c={c} />
            <ContentForm key={v.id} c={c} v={v} />
            <MediaSection c={c} v={v} />
            <SkuSection c={c} />
            <PricingEditor key={`pr-${p.skus.map((s) => s.id).join()}`} c={c} />
            <section className="card" aria-labelledby="sec-hist">
              <h2 id="sec-hist" className="h3">
                {t('seller.history')}
              </h2>
              {p.history.length ? (
                <ol className="timeline-list">
                  {p.history.map((h) => (
                    <li key={h.id}>
                      <span className="small muted">{formatDubaiTime(h.created_at, locale)}</span>{' '}
                      <strong>{h.action}</strong>
                      {h.to_state ? ` → ${t(`vstate.${h.to_state}` as MessageKey)}` : ''}
                      {h.version ? <span className="muted small"> · v{h.version}</span> : null}
                      {h.reason ? <p className="small">{h.reason}</p> : null}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="muted">{t('common.none')}</p>
              )}
              <DefinitionList
                items={[
                  [t('common.created'), formatDubaiTime(p.created_at, locale)],
                  [t('common.updated_at'), formatDubaiTime(p.updated_at, locale)],
                  ...(p.skus[0]?.tiers[0]
                    ? [
                        [
                          t('mkt.price_from', { price: '' }).trim(),
                          <Money key="m" fils={p.skus[0].tiers[0].unit_price_fils} />,
                        ] as [string, ReactNode],
                      ]
                    : []),
                ]}
              />
            </section>
          </>
        );
      }}
    </Resource>
  );
}

export default function SellerProductPage() {
  const { productId } = useParams<{ productId: string }>();
  return <SellerShell>{(ws, base) => <Editor ws={ws} base={base} id={productId} />}</SellerShell>;
}
