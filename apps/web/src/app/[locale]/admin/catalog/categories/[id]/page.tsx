'use client';
import type { AdminCategoryItem, CategoryAttributeResponse } from '@app/contracts';
import { ATTRIBUTE_TYPES } from '@app/contracts';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { fieldText, useApp, useT } from '@/components/app-context';
import { MediaImg } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import {
  Alert,
  ApiErrorAlert,
  Button,
  Field,
  PageHeader,
  SelectField,
  TextArea,
} from '@/components/ui';
import type { MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

type Detail = AdminCategoryItem & {
  parent: { id: string; name_en: string; name_ar: string } | null;
  children: AdminCategoryItem[];
  attributes: CategoryAttributeResponse[];
};

/** "value | English | Arabic" per line. */
function parseOptions(text: string) {
  return text
    .split('\n')
    .map((l) => l.split('|').map((x) => x.trim()))
    .filter((p) => p[0])
    .map(([value, en, ar]) => ({
      value: value!,
      label_en: en || value!,
      label_ar: ar || en || value!,
    }));
}

function CategoryView({ id }: { id: string }) {
  const { locale } = useApp();
  const t = useT();
  const me = useAdmin();
  const path = `/admin/categories/${id}`;
  const { state, reload, setData } = useResource<Detail>(path);
  const save = useMutation();
  const img = useMutation();
  const attr = useMutation();
  const [saved, setSaved] = useState(false);
  const can = me.capabilities.includes('admin.categories.manage');
  const fe = (k: string) => fieldText(locale, save.error?.fieldErrors[k]);
  const ae = (k: string) => fieldText(locale, attr.error?.fieldErrors[k]);
  return (
    <Resource
      state={state}
      reload={reload}
      backHref={`/${locale}/admin/catalog/categories`}
      lines={10}
    >
      {(c) => {
        const submit = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setSaved(false);
          const fd = new FormData(e.currentTarget);
          const s = (k: string) => String(fd.get(k) ?? '').trim();
          const r = await save.run<Detail>(path, {
            method: 'PATCH',
            body: {
              expected_version: c.version,
              name_en: s('name_en'),
              name_ar: s('name_ar'),
              description_en: s('description_en') || null,
              description_ar: s('description_ar') || null,
              position: Number(s('position') || 0),
              visible: fd.get('visible') === 'on',
              priority: fd.get('priority') === 'on',
              restriction: s('restriction'),
              requirements_en: s('requirements_en') || null,
              requirements_ar: s('requirements_ar') || null,
              archived: fd.get('archived') === 'on',
              reason: s('reason') || null,
            },
          });
          if (r.ok) {
            setData(r.data);
            setSaved(true);
          }
        };
        const upload = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const form = e.currentTarget;
          const fd = new FormData(form);
          const f = fd.get('file');
          if (!(f instanceof File) || f.size === 0) return;
          const r = await img.run<Detail>(`${path}/image`, { method: 'POST', form: fd });
          if (r.ok) {
            form.reset();
            setData(r.data);
          }
        };
        const addAttr = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const form = e.currentTarget;
          const fd = new FormData(form);
          const s = (k: string) => String(fd.get(k) ?? '').trim();
          const r = await attr.run<Detail>(`${path}/attributes`, {
            method: 'POST',
            body: {
              key: s('key'),
              label_en: s('label_en'),
              label_ar: s('label_ar'),
              type: s('type'),
              options: parseOptions(s('options')),
              unit: s('unit') || null,
              required: fd.get('required') === 'on',
              filterable: fd.get('filterable') === 'on',
              position: c.attributes.length,
            },
          });
          if (r.ok) {
            form.reset();
            setData(r.data);
          }
        };
        const toggleAttr = async (a: CategoryAttributeResponse) => {
          const r = await attr.run<Detail>(`/admin/category-attributes/${a.id}`, {
            method: 'PATCH',
            body: { active: !a.active },
          });
          if (r.ok) setData(r.data);
        };
        return (
          <>
            <p className="small">
              <Link href={`/${locale}/admin/catalog/categories`}>
                ← {t('acat.categories_title')}
              </Link>
              {c.parent ? (
                <>
                  {' · '}
                  <Link href={`/${locale}/admin/catalog/categories/${c.parent.id}`}>
                    {locale === 'ar' ? c.parent.name_ar : c.parent.name_en}
                  </Link>
                </>
              ) : null}
            </p>
            <PageHeader title={locale === 'ar' ? c.name_ar : c.name_en} />
            <p className="muted small">
              <bdi>{c.slug}</bdi> · {t('acat.listings')}: {c.product_count} / {c.listing_count}
            </p>
            <form className="card" onSubmit={submit} noValidate>
              <fieldset disabled={!can}>
                <div className="grid-2">
                  <Field
                    label={t('acat.name_en')}
                    name="name_en"
                    defaultValue={c.name_en}
                    error={fe('name_en')}
                  />
                  <Field
                    label={t('acat.name_ar')}
                    name="name_ar"
                    defaultValue={c.name_ar}
                    dir="rtl"
                    lang="ar"
                    error={fe('name_ar')}
                  />
                </div>
                <div className="grid-2">
                  <TextArea
                    label={t('acat.desc_en')}
                    name="description_en"
                    rows={2}
                    defaultValue={c.description_en ?? ''}
                    maxLength={500}
                  />
                  <TextArea
                    label={t('acat.desc_ar')}
                    name="description_ar"
                    rows={2}
                    dir="rtl"
                    defaultValue={c.description_ar ?? ''}
                    maxLength={500}
                  />
                </div>
                <div className="grid-3">
                  <Field
                    label={t('acat.position')}
                    name="position"
                    type="number"
                    min={0}
                    defaultValue={c.position}
                  />
                  <SelectField
                    label={t('acat.restriction')}
                    name="restriction"
                    defaultValue={c.restriction}
                    options={(['OPEN', 'REVIEW_REQUIRED', 'BLOCKED'] as const).map((r) => ({
                      value: r,
                      label: t(`restriction.${r}` as MessageKey),
                    }))}
                  />
                </div>
                <div className="grid-2">
                  <TextArea
                    label={t('acat.req_en')}
                    name="requirements_en"
                    rows={2}
                    defaultValue={c.requirements_en ?? ''}
                    maxLength={1000}
                  />
                  <TextArea
                    label={t('acat.req_ar')}
                    name="requirements_ar"
                    rows={2}
                    dir="rtl"
                    defaultValue={c.requirements_ar ?? ''}
                    maxLength={1000}
                  />
                </div>
                <label className="check">
                  <input type="checkbox" name="visible" defaultChecked={c.visible} />
                  {t('acat.visible_label')}
                </label>
                <label className="check">
                  <input type="checkbox" name="priority" defaultChecked={c.priority} />
                  {t('acat.priority')}
                </label>
                <label className="check">
                  <input type="checkbox" name="archived" defaultChecked={!!c.archived_at} />
                  {t('acat.archived')}
                </label>
                <TextArea
                  label={t('acat.change_reason')}
                  name="reason"
                  rows={2}
                  maxLength={2000}
                  error={fe('reason')}
                />
              </fieldset>
              {save.error ? <ApiErrorAlert error={save.error} /> : null}
              {saved ? <Alert kind="success">{t('seller.saved')}</Alert> : null}
              {can ? (
                <Button type="submit" busy={save.busy}>
                  {t('common.save')}
                </Button>
              ) : null}
            </form>
            <section className="card" aria-labelledby="cimg">
              <h2 id="cimg" className="h3">
                {t('acat.image')}
              </h2>
              <MediaImg src={c.image_url} alt="" className="cat-dir-img" />
              {can ? (
                <form onSubmit={upload} className="upload-form">
                  <label className="sr-only" htmlFor="cimg-file">
                    {t('acat.image')}
                  </label>
                  <input
                    id="cimg-file"
                    name="file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required
                  />
                  <Button type="submit" variant="secondary" busy={img.busy}>
                    {t('seller.upload_image')}
                  </Button>
                </form>
              ) : null}
              {img.error ? <ApiErrorAlert error={img.error} /> : null}
            </section>
            {c.children.length ? (
              <section className="card">
                <h2 className="h3">{t('mkt.subcategories')}</h2>
                <ul className="cat-chips">
                  {c.children.map((s) => (
                    <li key={s.id}>
                      <Link href={`/${locale}/admin/catalog/categories/${s.id}`}>
                        {locale === 'ar' ? s.name_ar : s.name_en}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            <section className="card" aria-labelledby="cattr">
              <h2 id="cattr" className="h3">
                {t('acat.attributes')}
              </h2>
              {c.attributes.length ? (
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">{t('acat.attr_key')}</th>
                        <th scope="col">{t('common.name')}</th>
                        <th scope="col">{t('acat.attr_type')}</th>
                        <th scope="col">{t('acat.attr_required')}</th>
                        <th scope="col">{t('acat.attr_filterable')}</th>
                        <th scope="col">{t('common.status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {c.attributes.map((a) => (
                        <tr key={a.id}>
                          <td>
                            <bdi>{a.key}</bdi>
                          </td>
                          <td>
                            {a.label_en} / {a.label_ar}
                            {a.options.length ? (
                              <span className="muted small block">
                                {a.options.map((o) => o.value).join(', ')}
                              </span>
                            ) : null}
                          </td>
                          <td>{a.type}</td>
                          <td>{a.required ? t('common.yes') : t('common.no')}</td>
                          <td>{a.filterable ? t('common.yes') : t('common.no')}</td>
                          <td>
                            {a.active ? t('acat.active') : t('acat.inactive')}
                            {can ? (
                              <Button
                                type="button"
                                variant="link"
                                disabled={attr.busy}
                                onClick={() => toggleAttr(a)}
                              >
                                {a.active ? t('seller.deactivate') : t('seller.activate')}
                              </Button>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              {can ? (
                <form onSubmit={addAttr} noValidate>
                  <h3 className="h4">{t('acat.add_attribute')}</h3>
                  <div className="grid-3">
                    <Field
                      label={t('acat.attr_key')}
                      name="key"
                      dir="ltr"
                      required
                      error={ae('key')}
                    />
                    <Field
                      label={t('acat.name_en')}
                      name="label_en"
                      required
                      error={ae('label_en')}
                    />
                    <Field
                      label={t('acat.name_ar')}
                      name="label_ar"
                      dir="rtl"
                      required
                      error={ae('label_ar')}
                    />
                  </div>
                  <div className="grid-3">
                    <SelectField
                      label={t('acat.attr_type')}
                      name="type"
                      defaultValue="TEXT"
                      options={ATTRIBUTE_TYPES.map((x) => ({ value: x, label: x }))}
                    />
                    <Field label={t('acat.attr_unit')} name="unit" maxLength={20} optional />
                  </div>
                  <TextArea
                    label={t('acat.attr_options')}
                    name="options"
                    rows={3}
                    error={ae('options')}
                  />
                  <label className="check">
                    <input type="checkbox" name="required" />
                    {t('acat.attr_required')}
                  </label>
                  <label className="check">
                    <input type="checkbox" name="filterable" />
                    {t('acat.attr_filterable')}
                  </label>
                  {attr.error ? <ApiErrorAlert error={attr.error} /> : null}
                  <Button type="submit" variant="secondary" busy={attr.busy}>
                    {t('acat.add_attribute')}
                  </Button>
                </form>
              ) : null}
            </section>
          </>
        );
      }}
    </Resource>
  );
}

export default function AdminCategoryPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <AdminShell require="admin.catalog.read">
      <CategoryView id={id} />
    </AdminShell>
  );
}
