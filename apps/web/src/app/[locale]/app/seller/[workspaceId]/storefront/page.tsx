'use client';
import type { StorefrontResponse } from '@app/contracts';
import { BUSINESS_TYPES, STOREFRONT_MEDIA_KINDS } from '@app/contracts';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { fieldText, useApp, useT } from '@/components/app-context';
import { MediaImg, useLocalized } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import { sellerApi, SellerShell } from '@/components/seller-shell';
import type { Workspace } from '@/components/session';
import {
  Alert,
  ApiErrorAlert,
  Button,
  ConfirmDialog,
  Field,
  PageHeader,
  SelectField,
  TextArea,
} from '@/components/ui';
import type { MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

function Storefront({ ws }: { ws: Workspace }) {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const path = `${sellerApi(ws)}/storefront`;
  const { state, reload, setData } = useResource<StorefrontResponse>(path);
  const save = useMutation();
  const act = useMutation();
  const media = useMutation();
  const [saved, setSaved] = useState(false);
  const [confirm, setConfirm] = useState<'publish' | 'unpublish' | null>(null);
  const fe = (k: string) => fieldText(locale, save.error?.fieldErrors[k]);

  return (
    <Resource state={state} reload={reload} lines={10}>
      {(s) => {
        const exists = s.version > 0;
        const submit = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setSaved(false);
          const fd = new FormData(e.currentTarget);
          const v = (k: string) => String(fd.get(k) ?? '').trim() || null;
          const year = v('year_established');
          const r = await save.run<StorefrontResponse>(path, {
            method: 'PATCH',
            body: {
              ...(exists ? { expected_version: s.version } : {}),
              business_type: v('business_type'),
              description_en: v('description_en'),
              description_ar: v('description_ar'),
              year_established: year ? Number(year) : null,
              city: v('city'),
              specialization_en: v('specialization_en'),
              specialization_ar: v('specialization_ar'),
              capabilities_en: v('capabilities_en'),
              capabilities_ar: v('capabilities_ar'),
              production_capacity: v('production_capacity'),
              fulfilment_en: v('fulfilment_en'),
              fulfilment_ar: v('fulfilment_ar'),
              customization_services: fd.get('customization_services') === 'on',
              private_label: fd.get('private_label') === 'on',
              white_label: fd.get('white_label') === 'on',
              samples_available: fd.get('samples_available') === 'on',
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
          const r = await media.run<StorefrontResponse>(`${path}/media`, {
            method: 'POST',
            form: fd,
          });
          if (r.ok) {
            form.reset();
            setData(r.data);
          }
        };
        const removeMedia = async (id: string) => {
          const r = await media.run<StorefrontResponse>(`${path}/media/${id}`, {
            method: 'DELETE',
          });
          if (r.ok) setData(r.data);
        };
        const runAct = async () => {
          if (!confirm) return;
          const r = await act.run<StorefrontResponse>(`${path}/${confirm}`, { method: 'POST' });
          if (r.ok) {
            setData(r.data);
            setConfirm(null);
          }
        };
        return (
          <>
            <PageHeader title={t('seller.storefront_title')}>
              {s.public ? (
                <Link className="btn btn-secondary" href={`/${locale}/suppliers/${s.id}`}>
                  {t('seller.preview')}
                </Link>
              ) : null}
              {exists && s.status === 'PUBLISHED' ? (
                <Button type="button" variant="secondary" onClick={() => setConfirm('unpublish')}>
                  {t('seller.unpublish_storefront')}
                </Button>
              ) : exists ? (
                <Button type="button" onClick={() => setConfirm('publish')}>
                  {t('seller.publish')}
                </Button>
              ) : null}
            </PageHeader>
            <p className="muted">{t('seller.storefront_hint')}</p>
            {s.admin_hidden ? (
              <Alert kind="warning" title={t('seller.storefront_hidden')}>
                {s.admin_hidden_reason}
              </Alert>
            ) : (
              <p>
                <span className={`pill ${s.public ? 'pill-ok' : ''}`}>
                  {s.public ? t('seller.storefront_public') : t('seller.storefront_not_public')}
                </span>
              </p>
            )}
            <form className="card" onSubmit={submit} noValidate>
              <div className="grid-3">
                <SelectField
                  label={t('seller.business_type')}
                  name="business_type"
                  defaultValue={s.business_type ?? ''}
                  error={fe('business_type')}
                  options={[
                    { value: '', label: t('seller.choose') },
                    ...BUSINESS_TYPES.map((b) => ({
                      value: b,
                      label: t(`btype.${b}` as MessageKey),
                    })),
                  ]}
                />
                <Field
                  label={t('seller.city')}
                  name="city"
                  defaultValue={s.city ?? ''}
                  maxLength={80}
                  error={fe('city')}
                />
                <Field
                  label={t('seller.year')}
                  name="year_established"
                  type="number"
                  min={1900}
                  max={2100}
                  defaultValue={s.year_established ?? ''}
                  optional
                  error={fe('year_established')}
                />
              </div>
              <TextArea
                label={t('seller.description_en')}
                name="description_en"
                rows={5}
                defaultValue={s.description_en ?? ''}
                maxLength={4000}
                error={fe('description_en')}
              />
              <TextArea
                label={t('seller.description_ar')}
                name="description_ar"
                rows={5}
                dir="rtl"
                lang="ar"
                defaultValue={s.description_ar ?? ''}
                maxLength={4000}
              />
              <div className="grid-2">
                <Field
                  label={t('seller.spec_en')}
                  name="specialization_en"
                  defaultValue={s.specialization_en ?? ''}
                  maxLength={300}
                  optional
                />
                <Field
                  label={t('seller.spec_ar')}
                  name="specialization_ar"
                  dir="rtl"
                  defaultValue={s.specialization_ar ?? ''}
                  maxLength={300}
                  optional
                />
              </div>
              <div className="grid-2">
                <TextArea
                  label={t('seller.cap_en')}
                  name="capabilities_en"
                  rows={3}
                  defaultValue={s.capabilities_en ?? ''}
                  maxLength={2000}
                />
                <TextArea
                  label={t('seller.cap_ar')}
                  name="capabilities_ar"
                  rows={3}
                  dir="rtl"
                  defaultValue={s.capabilities_ar ?? ''}
                  maxLength={2000}
                />
              </div>
              <Field
                label={t('seller.capacity')}
                name="production_capacity"
                defaultValue={s.production_capacity ?? ''}
                maxLength={200}
                optional
              />
              <div className="grid-2">
                <TextArea
                  label={t('seller.fulfil_en')}
                  name="fulfilment_en"
                  rows={3}
                  defaultValue={s.fulfilment_en ?? ''}
                  maxLength={1000}
                />
                <TextArea
                  label={t('seller.fulfil_ar')}
                  name="fulfilment_ar"
                  rows={3}
                  dir="rtl"
                  defaultValue={s.fulfilment_ar ?? ''}
                  maxLength={1000}
                />
              </div>
              <fieldset>
                <legend>{t('seller.customisation')}</legend>
                {(
                  [
                    ['customization_services', 'mkt.custom', s.customization_services],
                    ['private_label', 'mkt.private_label', s.private_label],
                    ['white_label', 'mkt.white_label', s.white_label],
                    ['samples_available', 'mkt.samples', s.samples_available],
                  ] as [string, MessageKey, boolean][]
                ).map(([k, l, d]) => (
                  <label key={k} className="check">
                    <input type="checkbox" name={k} defaultChecked={d} />
                    {t(l)}
                  </label>
                ))}
              </fieldset>
              {save.error ? <ApiErrorAlert error={save.error} /> : null}
              {saved ? <Alert kind="success">{t('seller.saved')}</Alert> : null}
              <Button type="submit" busy={save.busy}>
                {t('common.save')}
              </Button>
            </form>
            <section className="card" aria-labelledby="sf-media">
              <h2 id="sf-media" className="h3">
                {t('seller.media')}
              </h2>
              {s.media.length ? (
                <ul className="media-grid">
                  {s.media.map((m) => (
                    <li key={m.id}>
                      <MediaImg
                        src={m.url}
                        alt={L(m.caption_en, m.caption_ar) || t(`mkind.${m.kind}` as MessageKey)}
                      />
                      <p className="small">{t(`mkind.${m.kind}` as MessageKey)}</p>
                      <Button
                        type="button"
                        variant="link"
                        disabled={media.busy}
                        onClick={() => removeMedia(m.id)}
                      >
                        {t('seller.remove_image')}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : null}
              {exists ? (
                <form onSubmit={upload} className="upload-form">
                  <div className="grid-2">
                    <div className="field">
                      <label htmlFor="sf-file">{t('seller.upload_image')}</label>
                      <input
                        id="sf-file"
                        name="file"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        required
                      />
                    </div>
                    <SelectField
                      label={t('seller.image_kind')}
                      name="kind"
                      defaultValue="LOGO"
                      options={STOREFRONT_MEDIA_KINDS.map((k) => ({
                        value: k,
                        label: t(`mkind.${k}` as MessageKey),
                      }))}
                    />
                  </div>
                  <div className="grid-2">
                    <Field
                      label={`${t('seller.caption')} (EN)`}
                      name="caption_en"
                      maxLength={150}
                      optional
                    />
                    <Field
                      label={`${t('seller.caption')} (AR)`}
                      name="caption_ar"
                      maxLength={150}
                      dir="rtl"
                      optional
                    />
                  </div>
                  <Button type="submit" variant="secondary" busy={media.busy}>
                    {t('seller.upload_image')}
                  </Button>
                </form>
              ) : (
                <p className="muted small">{t('seller.save_first')}</p>
              )}
              {media.error ? <ApiErrorAlert error={media.error} /> : null}
            </section>
            <ConfirmDialog
              open={confirm !== null}
              title={confirm === 'publish' ? t('seller.publish') : t('seller.unpublish_storefront')}
              confirmLabel={
                confirm === 'publish' ? t('seller.publish') : t('seller.unpublish_storefront')
              }
              danger={confirm === 'unpublish'}
              busy={act.busy}
              error={act.error}
              onConfirm={runAct}
              onClose={() => {
                setConfirm(null);
                act.setError(null);
              }}
            />
          </>
        );
      }}
    </Resource>
  );
}

export default function StorefrontPage() {
  return <SellerShell>{(ws) => <Storefront ws={ws} />}</SellerShell>;
}
