'use client';
import {
  filsToDecimal,
  parseAedToFils,
  QUANTITY_UNITS,
  TAX_CODES,
  type QuoteVersionResponse,
  type RfqDetail,
} from '@app/contracts';
import { useState, type FormEvent } from 'react';
import type { MessageKey } from '@/i18n/messages';
import type { ApiError } from '@/lib/client';
import { fieldText, useApp, useT } from './app-context';
import { dubaiLocalFromNow, dubaiLocalToIso, isoToDubaiLocal } from './rfq-ui';
import { ApiErrorAlert, Button, Field, SelectField, TextArea } from './ui';

export type QuoteFormValues = Record<string, unknown>;

/**
 * Quote draft or revision. Prices are entered in AED and sent as integer fils; tax and totals
 * are always computed by the server from the tax code (the preview here excludes tax).
 */
export function QuoteForm({
  rfq,
  initial,
  busy,
  error,
  submitLabel,
  onSubmit,
}: {
  rfq: RfqDetail;
  initial?: QuoteVersionResponse | null;
  busy: boolean;
  error: ApiError | null;
  submitLabel: string;
  onSubmit: (body: QuoteFormValues) => void;
}) {
  const t = useT();
  const { locale } = useApp();
  const [localErr, setLocalErr] = useState<Record<string, string>>({});
  const fe = (k: string) => fieldText(locale, localErr[k] ?? error?.fieldErrors?.[k]);
  const [qty, setQty] = useState(String(initial?.quantity ?? rfq.quantity));
  const [price, setPrice] = useState(initial ? filsToDecimal(initial.unit_price_fils) : '');
  const [ship, setShip] = useState(initial ? filsToDecimal(initial.shipping_fils) : '0');

  const preview = (() => {
    const p = parseAedToFils(price);
    const s = parseAedToFils(ship || '0');
    const n = Number(qty);
    if (p === null || s === null || !Number.isInteger(n) || n < 1) return null;
    return (p * BigInt(n) + s).toString();
  })();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const s = (k: string) => String(fd.get(k) ?? '').trim();
    const unitPrice = parseAedToFils(price);
    const shipping = parseAedToFils(ship || '0');
    const errs: Record<string, string> = {};
    if (unitPrice === null) errs.unit_price_fils = 'money';
    if (shipping === null) errs.shipping_fils = 'money';
    setLocalErr(errs);
    if (Object.keys(errs).length) return;
    onSubmit({
      quantity: Number(qty),
      unit: s('unit'),
      unit_price_fils: unitPrice!.toString(),
      shipping_fils: shipping!.toString(),
      tax_code: s('tax_code'),
      specs: s('specs'),
      deviations: s('deviations') || null,
      lead_days: Number(s('lead_days')),
      delivery_date: s('delivery_date'),
      valid_until: s('valid_until') ? dubaiLocalToIso(s('valid_until')) : '',
      terms: s('terms') || null,
    });
  };

  return (
    <form onSubmit={submit} className="form-grid" noValidate data-testid="quote-form">
      {error ? <ApiErrorAlert error={error} /> : null}
      <div className="field-row">
        <Field
          label={t('quote.quantity')}
          name="quantity"
          type="number"
          min={1}
          step={1}
          required
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          error={fe('quantity')}
        />
        <SelectField
          label={t('rfq.unit')}
          name="unit"
          defaultValue={initial?.unit ?? rfq.unit}
          options={QUANTITY_UNITS.map((u) => ({ value: u, label: t(`unit.${u}` as MessageKey) }))}
        />
      </div>
      <div className="field-row">
        <Field
          label={t('quote.unit_price_aed')}
          name="unit_price"
          inputMode="decimal"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          error={fe('unit_price_fils')}
        />
        <Field
          label={t('quote.shipping_aed')}
          name="shipping"
          inputMode="decimal"
          value={ship}
          onChange={(e) => setShip(e.target.value)}
          error={fe('shipping_fils')}
        />
      </div>
      <SelectField
        label={t('quote.tax_code')}
        name="tax_code"
        defaultValue={initial?.tax_code ?? 'STANDARD'}
        hint={t('quote.tax_hint')}
        options={TAX_CODES.map((c) => ({ value: c, label: t(`tax.${c}` as MessageKey) }))}
        error={fe('tax_code')}
      />
      <p className="muted small" aria-live="polite">
        {preview !== null
          ? t('quote.preview_before_tax', { amount: filsToDecimal(preview) })
          : t('quote.preview_unavailable')}
      </p>
      <TextArea
        label={t('quote.specs')}
        name="specs"
        required
        rows={5}
        maxLength={5000}
        defaultValue={initial?.specs ?? ''}
        error={fe('specs')}
      />
      <TextArea
        label={t('quote.deviations')}
        name="deviations"
        optional
        rows={3}
        maxLength={2000}
        hint={t('quote.deviations_hint')}
        defaultValue={initial?.deviations ?? ''}
        error={fe('deviations')}
      />
      <div className="field-row">
        <Field
          label={t('quote.lead_days')}
          name="lead_days"
          type="number"
          min={0}
          max={730}
          step={1}
          required
          defaultValue={initial?.lead_days ?? 7}
          error={fe('lead_days')}
        />
        <Field
          label={t('quote.delivery_date')}
          name="delivery_date"
          type="date"
          required
          defaultValue={initial?.delivery_date ?? rfq.target_date}
          error={fe('delivery_date')}
        />
      </div>
      <Field
        label={t('quote.valid_until_dubai')}
        name="valid_until"
        type="datetime-local"
        required
        defaultValue={initial ? isoToDubaiLocal(initial.valid_until) : dubaiLocalFromNow(24 * 7)}
        error={fe('valid_until')}
      />
      <TextArea
        label={t('quote.terms')}
        name="terms"
        optional
        rows={3}
        maxLength={3000}
        defaultValue={initial?.terms ?? ''}
        error={fe('terms')}
      />
      <div className="actions">
        <Button type="submit" busy={busy}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
