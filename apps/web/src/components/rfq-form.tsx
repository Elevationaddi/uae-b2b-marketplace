'use client';
import {
  EMIRATES,
  filsToDecimal,
  parseAedToFils,
  QUANTITY_UNITS,
  type CategoryNode,
  type InviteCandidate,
  type RfqDetail,
} from '@app/contracts';
import { useState, type FormEvent } from 'react';
import type { MessageKey } from '@/i18n/messages';
import { useResource } from '@/lib/use-resource';
import { fieldText, useApp, useT } from './app-context';
import { useLocalized } from './catalog-ui';
import { dateFromNow, dubaiLocalFromNow, dubaiLocalToIso, isoToDubaiLocal } from './rfq-ui';
import { ApiErrorAlert, Button, Field, SelectField, TextArea } from './ui';
import type { ApiError } from '@/lib/client';

export type RfqFormValues = Record<string, unknown>;

/**
 * Create or edit an RFQ draft. Dates are entered in Dubai time and sent in UTC; the budget is
 * entered in AED and sent as integer fils. The server validates everything again.
 */
export function RfqForm({
  wsApi,
  initial,
  prefill,
  busy,
  error,
  submitLabel,
  onSubmit,
}: {
  wsApi: string;
  initial?: RfqDetail;
  prefill?: { category_id?: string; invite?: string; title?: string };
  busy: boolean;
  error: ApiError | null;
  submitLabel: string;
  onSubmit: (body: RfqFormValues) => void;
}) {
  const t = useT();
  const { locale } = useApp();
  const L = useLocalized();
  const cats = useResource<CategoryNode[]>('/marketplace/categories');
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? prefill?.category_id ?? '');
  const [visibility, setVisibility] = useState<string>(
    initial?.visibility ?? (prefill?.invite ? 'INVITE' : 'POOL'),
  );
  const [invitees, setInvitees] = useState<Set<string>>(
    new Set(
      initial
        ? initial.invitees.map((i) => i.storefront_id).filter((x): x is string => !!x)
        : prefill?.invite
          ? [prefill.invite]
          : [],
    ),
  );
  const [q, setQ] = useState('');
  const cands = useResource<InviteCandidate[]>(`${wsApi}/invite-candidates`, {
    category_id: categoryId || undefined,
    q: q || undefined,
  });
  const [localErr, setLocalErr] = useState<Record<string, string>>({});
  const fe = (k: string) => fieldText(locale, localErr[k] ?? error?.fieldErrors?.[k]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const s = (k: string) => String(fd.get(k) ?? '').trim();
    const budget = s('budget');
    const budgetFils = budget ? parseAedToFils(budget) : null;
    if (budget && budgetFils === null) {
      setLocalErr({ budget_fils: 'money' });
      return;
    }
    setLocalErr({});
    onSubmit({
      title: s('title'),
      category_id: categoryId,
      specs: s('specs'),
      quantity: Number(s('quantity')),
      unit: s('unit'),
      target_date: s('target_date'),
      emirate: s('emirate'),
      budget_fils: budgetFils === null ? null : budgetFils.toString(),
      deadline: s('deadline') ? dubaiLocalToIso(s('deadline')) : '',
      visibility,
      invitee_storefront_ids: [...invitees],
    });
  };

  const catOptions = [{ value: '', label: t('rfq.choose_category') }];
  if (cats.state.status === 'ready')
    for (const c of cats.state.data) {
      catOptions.push({ value: c.id, label: L(c.name_en, c.name_ar) });
      for (const s of c.children)
        catOptions.push({ value: s.id, label: `— ${L(s.name_en, s.name_ar)}` });
    }

  return (
    <form onSubmit={submit} className="form-grid" noValidate>
      {error ? <ApiErrorAlert error={error} /> : null}
      <Field
        label={t('rfq.title')}
        name="title"
        required
        maxLength={160}
        defaultValue={initial?.title ?? prefill?.title ?? ''}
        error={fe('title')}
      />
      <SelectField
        label={t('rfq.category')}
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        options={catOptions}
        error={fe('category_id')}
      />
      <TextArea
        label={t('rfq.specs')}
        name="specs"
        required
        rows={6}
        maxLength={5000}
        hint={t('rfq.specs_hint')}
        defaultValue={initial?.specs ?? ''}
        error={fe('specs')}
      />
      <div className="field-row">
        <Field
          label={t('rfq.quantity')}
          name="quantity"
          type="number"
          min={1}
          step={1}
          required
          defaultValue={initial?.quantity ?? ''}
          error={fe('quantity')}
        />
        <SelectField
          label={t('rfq.unit')}
          name="unit"
          defaultValue={initial?.unit ?? 'PIECE'}
          options={QUANTITY_UNITS.map((u) => ({ value: u, label: t(`unit.${u}` as MessageKey) }))}
        />
      </div>
      <div className="field-row">
        <SelectField
          label={t('rfq.delivery_emirate')}
          name="emirate"
          defaultValue={initial?.emirate ?? 'DUBAI'}
          options={EMIRATES.map((e) => ({ value: e, label: t(`emirate.${e}` as MessageKey) }))}
        />
        <Field
          label={t('rfq.budget_aed')}
          name="budget"
          inputMode="decimal"
          optional
          hint={t('rfq.budget_hint')}
          defaultValue={initial?.budget_fils ? filsToDecimal(initial.budget_fils) : ''}
          error={fe('budget_fils')}
        />
      </div>
      <div className="field-row">
        <Field
          label={t('rfq.deadline_dubai')}
          name="deadline"
          type="datetime-local"
          required
          defaultValue={initial ? isoToDubaiLocal(initial.deadline) : dubaiLocalFromNow(72)}
          error={fe('deadline')}
        />
        <Field
          label={t('rfq.target_date')}
          name="target_date"
          type="date"
          required
          defaultValue={initial?.target_date ?? dateFromNow(30)}
          error={fe('target_date')}
        />
      </div>
      <fieldset>
        <legend>{t('rfq.visibility')}</legend>
        {(['POOL', 'INVITE'] as const).map((v) => (
          <label key={v} className="check">
            <input
              type="radio"
              name="visibility"
              value={v}
              checked={visibility === v}
              onChange={() => setVisibility(v)}
            />
            <span>
              {t(`rfq.visibility.${v}` as MessageKey)}
              <span className="muted small"> · {t(`rfq.visibility_hint.${v}` as MessageKey)}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>
          {t('rfq.invite_suppliers')}
          {visibility === 'POOL' ? <span className="muted"> ({t('common.optional')})</span> : null}
        </legend>
        <label className="sr-only" htmlFor="inv-q">
          {t('rfq.search_suppliers')}
        </label>
        <input
          id="inv-q"
          type="search"
          placeholder={t('rfq.search_suppliers')}
          value={q}
          maxLength={100}
          onChange={(e) => setQ(e.target.value)}
        />
        {cands.state.status === 'ready' ? (
          cands.state.data.length === 0 ? (
            <p className="muted small">{t('rfq.no_candidates')}</p>
          ) : (
            <ul className="check-list" data-testid="invite-candidates">
              {cands.state.data.map((c) => (
                <li key={c.storefront_id}>
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={invitees.has(c.storefront_id!)}
                      onChange={(e) => {
                        const n = new Set(invitees);
                        if (e.target.checked) n.add(c.storefront_id!);
                        else n.delete(c.storefront_id!);
                        setInvitees(n);
                      }}
                    />
                    {c.company_name}
                    <span className="muted small">
                      {' '}
                      · {t(`emirate.${c.emirate}` as MessageKey)}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )
        ) : null}
        {fe('invitee_storefront_ids') ? (
          <p className="field-error">{fe('invitee_storefront_ids')}</p>
        ) : null}
        <p className="muted small">{t('rfq.invited_count', { count: invitees.size })}</p>
      </fieldset>
      <div className="actions">
        <Button type="submit" busy={busy}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
