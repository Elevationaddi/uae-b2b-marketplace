'use client';
import type { AdminCategoryItem } from '@app/contracts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { fieldText, useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import { ApiErrorAlert, Button, Empty, Field, PageHeader, SelectField } from '@/components/ui';
import type { MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

function Categories() {
  const { locale } = useApp();
  const t = useT();
  const me = useAdmin();
  const router = useRouter();
  const { state, reload } = useResource<AdminCategoryItem[]>('/admin/categories');
  const [creating, setCreating] = useState(false);
  const m = useMutation();
  const fe = (k: string) => fieldText(locale, m.error?.fieldErrors[k]);
  const canManage = me.capabilities.includes('admin.categories.manage');
  const create = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const s = (k: string) => String(fd.get(k) ?? '').trim();
    const r = await m.run<{ id: string }>('/admin/categories', {
      method: 'POST',
      body: {
        parent_id: s('parent_id') || null,
        slug: s('slug'),
        name_en: s('name_en'),
        name_ar: s('name_ar'),
        position: Number(s('position') || 0),
        visible: fd.get('visible') === 'on',
        priority: fd.get('priority') === 'on',
        restriction: s('restriction'),
      },
    });
    if (r.ok) router.push(`/${locale}/admin/catalog/categories/${r.data.id}`);
  };
  return (
    <>
      <PageHeader title={t('acat.categories_title')}>
        {canManage ? (
          <Button
            type="button"
            variant="secondary"
            aria-expanded={creating}
            onClick={() => setCreating((v) => !v)}
          >
            {t('acat.new_category')}
          </Button>
        ) : null}
      </PageHeader>
      <Resource state={state} reload={reload}>
        {(cats) => {
          const top = cats.filter((c) => !c.parent_id);
          const childrenOf = (id: string) => cats.filter((c) => c.parent_id === id);
          const row = (c: AdminCategoryItem, child: boolean) => (
            <tr key={c.id} className={child ? 'row-child' : undefined}>
              <td>
                <Link href={`/${locale}/admin/catalog/categories/${c.id}`}>
                  {child ? '↳ ' : ''}
                  {locale === 'ar' ? c.name_ar : c.name_en}
                </Link>
                <span className="muted small block">
                  <bdi>{c.slug}</bdi>
                </span>
              </td>
              <td>
                {c.archived_at ? (
                  <span className="pill">{t('acat.archived')}</span>
                ) : c.visible ? (
                  t('acat.visible')
                ) : (
                  <span className="pill pill-warn">{t('acat.hidden')}</span>
                )}
                {c.priority ? (
                  <span className="pill pill-info small">{t('acat.priority')}</span>
                ) : null}
              </td>
              <td>{t(`restriction.${c.restriction}` as MessageKey)}</td>
              <td>
                {c.product_count} / {c.listing_count}
              </td>
              <td>{c.attribute_count}</td>
            </tr>
          );
          return (
            <>
              {creating && canManage ? (
                <form className="card form-narrow" onSubmit={create} noValidate>
                  <SelectField
                    label={t('acat.parent')}
                    name="parent_id"
                    defaultValue=""
                    options={[
                      { value: '', label: t('acat.top_level') },
                      ...top.map((c) => ({ value: c.id, label: c.name_en })),
                    ]}
                  />
                  <Field label={t('acat.slug')} name="slug" dir="ltr" required error={fe('slug')} />
                  <Field label={t('acat.name_en')} name="name_en" required error={fe('name_en')} />
                  <Field
                    label={t('acat.name_ar')}
                    name="name_ar"
                    dir="rtl"
                    lang="ar"
                    required
                    error={fe('name_ar')}
                  />
                  <Field
                    label={t('acat.position')}
                    name="position"
                    type="number"
                    min={0}
                    defaultValue={0}
                  />
                  <SelectField
                    label={t('acat.restriction')}
                    name="restriction"
                    defaultValue="OPEN"
                    options={(['OPEN', 'REVIEW_REQUIRED', 'BLOCKED'] as const).map((r) => ({
                      value: r,
                      label: t(`restriction.${r}` as MessageKey),
                    }))}
                  />
                  <label className="check">
                    <input type="checkbox" name="visible" defaultChecked />
                    {t('acat.visible_label')}
                  </label>
                  <label className="check">
                    <input type="checkbox" name="priority" />
                    {t('acat.priority')}
                  </label>
                  {m.error ? <ApiErrorAlert error={m.error} /> : null}
                  <Button type="submit" busy={m.busy}>
                    {t('acat.new_category')}
                  </Button>
                </form>
              ) : null}
              {cats.length === 0 ? (
                <Empty>{t('common.empty')}</Empty>
              ) : (
                <div className="table-wrap">
                  <table className="table" data-testid="admin-categories">
                    <thead>
                      <tr>
                        <th scope="col">{t('common.name')}</th>
                        <th scope="col">{t('common.status')}</th>
                        <th scope="col">{t('acat.restriction')}</th>
                        <th scope="col">{t('acat.listings')}</th>
                        <th scope="col">{t('acat.attributes')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {top.flatMap((c) => [
                        row(c, false),
                        ...childrenOf(c.id).map((s) => row(s, true)),
                      ])}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          );
        }}
      </Resource>
    </>
  );
}

export default function AdminCategoriesPage() {
  return (
    <AdminShell require="admin.catalog.read">
      <Categories />
    </AdminShell>
  );
}
