'use client';
import {
  DISPUTE_TYPES,
  type DisputeDetail,
  type DisputeSummary,
  type OrderDetail,
} from '@app/contracts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, type ReactNode } from 'react';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useMutation } from '@/lib/use-resource';
import { useApp, useT } from './app-context';
import { Money } from './catalog-ui';
import {
  Alert,
  ApiErrorAlert,
  Button,
  ConfirmDialog,
  DefinitionList,
  Field,
  SelectField,
  StatusBadge,
  TextArea,
  useFieldError,
} from './ui';

/** Status badge for any Phase 5 state namespace (text plus colour, never colour alone). */
export function StateBadge({
  ns,
  value,
}: {
  ns: 'settlement' | 'shipment' | 'dispute' | 'refund' | 'payout' | 'review';
  value: string;
}) {
  const t = useT();
  return <StatusBadge value={value} label={t(`${ns}.state.${value}` as MessageKey)} />;
}

type Row = [string, ReactNode];

/** Shipment, settlement and the next actions for one order (buyer, seller or admin view). */
export function FulfilmentCard({
  o,
  side,
  apiBase,
  disputesBase,
  onUpdated,
}: {
  o: OrderDetail;
  side: 'buyer' | 'seller' | 'admin';
  /** Workspace API base for this side, e.g. /buyer/workspaces/{ws}; omitted for admin. */
  apiBase?: string;
  /** Web base for this side's dispute pages. */
  disputesBase: string;
  onUpdated: (o: OrderDetail) => void;
}) {
  const t = useT();
  const { locale } = useApp();
  const f = o.fulfilment;
  const s = f.shipment;
  const a = f.actions;
  const orderApi = apiBase ? `${apiBase}/orders/${o.id}` : null;
  const rows: Row[] = s
    ? [
        [t('common.status'), <StateBadge key="st" ns="shipment" value={s.state} />],
        [t('ful.carrier'), s.carrier],
        ...(s.tracking_code
          ? ([[t('ful.tracking'), <bdi key="tr">{s.tracking_code}</bdi>]] as Row[])
          : []),
        ...(s.expected_delivery_date
          ? ([[t('ful.expected'), s.expected_delivery_date]] as Row[])
          : []),
        [t('ful.dispatched_at'), formatDubaiTime(s.dispatched_at, locale)],
        ...(s.delivered_at
          ? ([[t('ful.delivered_at'), formatDubaiTime(s.delivered_at, locale)]] as Row[])
          : []),
        ...(s.delivery_note ? ([[t('ful.delivery_note'), s.delivery_note]] as Row[]) : []),
        ...(s.has_proof && orderApi
          ? ([
              [
                t('ful.proof'),
                <a key="pf" href={`/api/v1${orderApi}/proof`}>
                  {t('ful.download_proof')}
                </a>,
              ],
            ] as Row[])
          : []),
      ]
    : [];
  if (f.completed_at) rows.push([t('ful.completed_at'), formatDubaiTime(f.completed_at, locale)]);
  if (f.settlement_state)
    rows.push([
      t('ful.settlement'),
      <StateBadge key="se" ns="settlement" value={f.settlement_state} />,
    ]);
  if (f.refunded_fils !== '0')
    rows.push([t('ful.refunded'), <Money key="rf" fils={f.refunded_fils} />]);

  return (
    <section className="card" aria-labelledby="ful-title" data-testid="fulfilment">
      <h2 id="ful-title" className="h3">
        {t('ful.title')}
      </h2>
      <NextStep o={o} side={side} />
      {s ? null : <p className="muted">{t('ful.no_shipment')}</p>}
      {rows.length ? <DefinitionList items={rows} /> : null}
      {f.dispute ? (
        <p>
          <Link href={`${disputesBase}/${f.dispute.id}`} data-testid="dispute-link">
            {t('dispute.view', { number: f.dispute.number })}
          </Link>{' '}
          <StateBadge ns="dispute" value={f.dispute.state} />
        </p>
      ) : null}
      {orderApi ? (
        <div className="stack">
          {a.can_process ? <ProcessButton path={`${orderApi}/process`} onDone={onUpdated} /> : null}
          {a.can_dispatch ? (
            <DispatchForm path={`${orderApi}/dispatch`} onDone={onUpdated} />
          ) : null}
          {a.can_deliver ? <DeliverForm path={`${orderApi}/deliver`} onDone={onUpdated} /> : null}
          {a.can_confirm_receipt ? (
            <ConfirmReceipt path={`${orderApi}/confirm-receipt`} onDone={onUpdated} />
          ) : null}
          {a.can_review ? <ReviewForm path={`${orderApi}/review`} onDone={onUpdated} /> : null}
          {a.can_dispute ? (
            <OpenDisputeForm path={`${orderApi}/disputes`} disputesBase={disputesBase} />
          ) : null}
        </div>
      ) : null}
      {f.review ? (
        <div className="review-own" data-testid="own-review">
          <h3 className="h4">{t('review.yours')}</h3>
          <p>
            <Stars rating={f.review.rating} /> <StateBadge ns="review" value={f.review.state} />
          </p>
          {f.review.comment ? <p>{f.review.comment}</p> : null}
        </div>
      ) : null}
    </section>
  );
}

function NextStep({ o, side }: { o: OrderDetail; side: string }) {
  const t = useT();
  if (side === 'buyer' && (o.state === 'DISPATCHED' || o.state === 'DELIVERED'))
    return <Alert kind="info">{t('ful.buyer_next_dispatched')}</Alert>;
  if (side === 'seller' && (o.state === 'CONFIRMED' || o.state === 'PROCESSING'))
    return <Alert kind="info">{t('ful.seller_next_confirmed')}</Alert>;
  if (side === 'seller' && (o.state === 'DISPATCHED' || o.state === 'DELIVERED'))
    return <Alert kind="info">{t('ful.seller_waiting_receipt')}</Alert>;
  if (side !== 'buyer' && o.fulfilment.settlement_state === 'ELIGIBLE')
    return <p className="muted small">{t('ful.payout_note')}</p>;
  return null;
}

export function Stars({ rating }: { rating: number }) {
  const t = useT();
  return (
    <span className="stars" role="img" aria-label={t('review.rating_n', { count: rating })}>
      {'★'.repeat(rating)}
      <span className="stars-off">{'★'.repeat(5 - rating)}</span>
    </span>
  );
}

function ProcessButton({ path, onDone }: { path: string; onDone: (o: OrderDetail) => void }) {
  const t = useT();
  const m = useMutation();
  return (
    <div>
      <Button
        variant="secondary"
        busy={m.busy}
        onClick={async () => {
          const r = await m.run<OrderDetail>(path, { method: 'POST' });
          if (r.ok) onDone(r.data);
        }}
      >
        {t('ful.process')}
      </Button>
      {m.error ? <ApiErrorAlert error={m.error} /> : null}
    </div>
  );
}

function DispatchForm({ path, onDone }: { path: string; onDone: (o: OrderDetail) => void }) {
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const r = await m.run<OrderDetail>(path, {
      method: 'POST',
      body: {
        carrier: String(fd.get('carrier') ?? ''),
        tracking_code: String(fd.get('tracking_code') ?? ''),
        ...(fd.get('expected_delivery_date')
          ? { expected_delivery_date: String(fd.get('expected_delivery_date')) }
          : {}),
      },
    });
    if (r.ok) onDone(r.data);
  }
  return (
    <form className="subcard" onSubmit={submit} data-testid="dispatch-form" noValidate>
      <h3 className="h4">{t('ful.dispatch_title')}</h3>
      <p className="muted small">{t('ful.full_shipment')}</p>
      <Field
        label={t('ful.carrier')}
        name="carrier"
        required
        maxLength={80}
        error={fe('carrier')}
      />
      <Field
        label={t('ful.tracking')}
        name="tracking_code"
        optional
        maxLength={80}
        error={fe('tracking_code')}
      />
      <Field
        label={t('ful.expected')}
        name="expected_delivery_date"
        type="date"
        optional
        error={fe('expected_delivery_date')}
      />
      {m.error && Object.keys(m.error.fieldErrors).length === 0 ? (
        <ApiErrorAlert error={m.error} />
      ) : null}
      <Button type="submit" busy={m.busy}>
        {t('ful.dispatch')}
      </Button>
    </form>
  );
}

function DeliverForm({ path, onDone }: { path: string; onDone: (o: OrderDetail) => void }) {
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get('file');
    if (file instanceof File && file.size === 0) fd.delete('file');
    const r = await m.run<OrderDetail>(path, { method: 'POST', form: fd });
    if (r.ok) onDone(r.data);
  }
  return (
    <form className="subcard" onSubmit={submit} data-testid="deliver-form" noValidate>
      <h3 className="h4">{t('ful.deliver_title')}</h3>
      <TextArea
        label={t('ful.delivery_note')}
        name="note"
        maxLength={500}
        rows={2}
        error={fe('note')}
      />
      <Field
        label={t('ful.proof_file')}
        name="file"
        type="file"
        accept="application/pdf,image/png,image/jpeg"
        optional
        error={fe('file')}
      />
      {m.error && Object.keys(m.error.fieldErrors).length === 0 ? (
        <ApiErrorAlert error={m.error} />
      ) : null}
      <Button type="submit" busy={m.busy}>
        {t('ful.deliver')}
      </Button>
    </form>
  );
}

function ConfirmReceipt({ path, onDone }: { path: string; onDone: (o: OrderDetail) => void }) {
  const t = useT();
  const m = useMutation();
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>{t('ful.confirm_receipt')}</Button>
      <p className="muted small">{t('ful.no_auto_complete')}</p>
      <ConfirmDialog
        open={open}
        title={t('ful.confirm_receipt_title')}
        body={t('ful.confirm_receipt_body')}
        confirmLabel={t('ful.confirm_receipt')}
        busy={m.busy}
        error={m.error}
        onClose={() => {
          setOpen(false);
          m.setError(null);
        }}
        onConfirm={async () => {
          const r = await m.run<OrderDetail>(path, { method: 'POST' });
          if (r.ok) {
            setOpen(false);
            onDone(r.data);
          }
        }}
      />
    </div>
  );
}

function ReviewForm({ path, onDone }: { path: string; onDone: (o: OrderDetail) => void }) {
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const comment = String(fd.get('comment') ?? '').trim();
    const r = await m.run<OrderDetail>(path, {
      method: 'POST',
      body: { rating: Number(fd.get('rating')), ...(comment ? { comment } : {}) },
    });
    if (r.ok) onDone(r.data);
  }
  return (
    <form className="subcard" onSubmit={submit} data-testid="review-form" noValidate>
      <h3 className="h4">{t('review.title')}</h3>
      <SelectField
        label={t('review.rating')}
        name="rating"
        defaultValue="5"
        options={[5, 4, 3, 2, 1].map((n) => ({
          value: String(n),
          label: t('review.rating_n', { count: n }),
        }))}
        error={fe('rating')}
      />
      <TextArea
        label={t('review.comment')}
        name="comment"
        maxLength={1000}
        rows={3}
        error={fe('comment')}
      />
      <p className="muted small">{t('review.public_note')}</p>
      {m.error && Object.keys(m.error.fieldErrors).length === 0 ? (
        <ApiErrorAlert error={m.error} />
      ) : null}
      <Button type="submit" busy={m.busy}>
        {t('review.submit')}
      </Button>
    </form>
  );
}

function OpenDisputeForm({ path, disputesBase }: { path: string; disputesBase: string }) {
  const t = useT();
  const router = useRouter();
  const m = useMutation();
  const fe = useFieldError(m.error);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const r = await m.run<DisputeDetail>(path, {
      method: 'POST',
      body: { type: String(fd.get('type')), reason: String(fd.get('reason') ?? '') },
    });
    if (r.ok) router.push(`${disputesBase}/${r.data.id}`);
  }
  return (
    <details className="subcard" data-testid="dispute-form">
      <summary>{t('dispute.open')}</summary>
      <form onSubmit={submit} noValidate>
        <p className="muted small">{t('dispute.window_note')}</p>
        <SelectField
          label={t('dispute.type')}
          name="type"
          options={DISPUTE_TYPES.map((v) => ({ value: v, label: t(`dispute.type.${v}`) }))}
          error={fe('type')}
        />
        <TextArea
          label={t('dispute.reason')}
          name="reason"
          required
          maxLength={2000}
          error={fe('reason')}
        />
        {m.error && Object.keys(m.error.fieldErrors).length === 0 ? (
          <ApiErrorAlert error={m.error} />
        ) : null}
        <Button type="submit" variant="danger" busy={m.busy}>
          {t('dispute.open')}
        </Button>
      </form>
    </details>
  );
}

// ------------------------------------------------------------------ disputes

export function DisputesTable({
  items,
  hrefFor,
  admin,
}: {
  items: DisputeSummary[];
  hrefFor: (d: DisputeSummary) => string;
  admin?: boolean;
}) {
  const t = useT();
  const { locale } = useApp();
  return (
    <div className="table-wrap">
      <table className="table" data-testid="disputes">
        <thead>
          <tr>
            <th scope="col">{t('dispute.col')}</th>
            <th scope="col">{t('dispute.order')}</th>
            <th scope="col">{t('dispute.type')}</th>
            <th scope="col">{t('common.status')}</th>
            {admin ? <th scope="col">{t('dispute.assigned')}</th> : null}
            <th scope="col">{t('order.created')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((d) => (
            <tr key={d.id}>
              <td>
                <Link href={hrefFor(d)}>
                  <bdi>{d.number}</bdi>
                </Link>
                <span className="muted small block">
                  {d.buyer_company_name} · {d.seller_company_name}
                </span>
              </td>
              <td>
                <bdi>{d.order_number}</bdi>
              </td>
              <td>{t(`dispute.type.${d.type}`)}</td>
              <td>
                <StateBadge ns="dispute" value={d.state} />
              </td>
              {admin ? (
                <td>
                  {d.assigned_to_me
                    ? t('dispute.filter_mine')
                    : d.assigned
                      ? t('dispute.assigned')
                      : t('dispute.unassigned')}
                </td>
              ) : null}
              <td>{formatDubaiTime(d.created_at, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Dispute summary, proposal, refunds and the message thread with evidence. */
export function DisputeView({
  d,
  orderHref,
  postPath,
  fileHref,
  allowFiles,
  onUpdated,
}: {
  d: DisputeDetail;
  orderHref?: string;
  postPath: string;
  fileHref: (fileId: string) => string;
  allowFiles: boolean;
  onUpdated: (d: DisputeDetail) => void;
}) {
  const t = useT();
  const { locale } = useApp();
  return (
    <div className="two-col">
      <div>
        <section className="card" aria-labelledby="dsp-msgs">
          <h2 id="dsp-msgs" className="h3">
            {t('dispute.messages')}
          </h2>
          {d.messages.length === 0 ? (
            <p className="muted">{t('dispute.no_messages')}</p>
          ) : (
            <ol className="thread" data-testid="dispute-messages">
              {d.messages.map((msg) => (
                <li key={msg.id} className={`thread-msg thread-${msg.author_side.toLowerCase()}`}>
                  <p className="small">
                    <strong>{t(`dispute.author.${msg.author_side}`)}</strong>
                    {msg.author_name ? ` · ${msg.author_name}` : ''} ·{' '}
                    <time dateTime={msg.created_at}>{formatDubaiTime(msg.created_at, locale)}</time>
                  </p>
                  <p className="pre-wrap">{msg.body}</p>
                  {msg.file ? (
                    <p className="small">
                      <a href={`/api/v1${fileHref(msg.file.id)}`}>{msg.file.name}</a>
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
          {d.can_message ? (
            <MessageForm path={postPath} allowFiles={allowFiles} onDone={onUpdated} />
          ) : d.state === 'CLOSED' ? (
            <p className="muted">{t('dispute.closed_note')}</p>
          ) : null}
        </section>
      </div>
      <div>
        <section className="card" aria-labelledby="dsp-info">
          <h2 id="dsp-info" className="h3">
            {t('order.details')}
          </h2>
          <DefinitionList
            items={[
              [t('common.status'), <StateBadge key="s" ns="dispute" value={d.state} />],
              [t('dispute.type'), t(`dispute.type.${d.type}`)],
              [
                t('dispute.order'),
                orderHref ? (
                  <Link key="o" href={orderHref}>
                    <bdi>{d.order_number}</bdi>
                  </Link>
                ) : (
                  <bdi key="o">{d.order_number}</bdi>
                ),
              ],
              [t('order.buyer'), d.buyer_company_name],
              [t('order.supplier'), d.seller_company_name],
              [t('dispute.opened_by'), t(`dispute.author.${d.opened_side}`)],
              [t('checkout.total'), <Money key="t" fils={d.order_total_fils} />],
              ...(d.order_refunded_fils !== '0'
                ? ([[t('ful.refunded'), <Money key="r" fils={d.order_refunded_fils} />]] as Row[])
                : []),
              [t('order.created'), formatDubaiTime(d.created_at, locale)],
            ]}
          />
          <h3 className="h4">{t('dispute.reason')}</h3>
          <p className="pre-wrap">{d.reason}</p>
          {d.state !== 'CLOSED' ? <p className="muted small">{t('dispute.held_note')}</p> : null}
        </section>
        {d.proposal ? (
          <section className="card" aria-labelledby="dsp-prop">
            <h2 id="dsp-prop" className="h3">
              {t('dispute.proposal')}
            </h2>
            <p>
              <strong>{t(`dispute.proposal.${d.proposal}`)}</strong>
              {d.proposal_amount_fils ? (
                <>
                  {' '}
                  · <Money fils={d.proposal_amount_fils} />
                </>
              ) : null}
            </p>
            {d.proposal_note ? <p className="pre-wrap">{d.proposal_note}</p> : null}
          </section>
        ) : null}
        {d.refunds.length ? (
          <section className="card" aria-labelledby="dsp-ref">
            <h2 id="dsp-ref" className="h3">
              {t('dispute.refunds')}
            </h2>
            <ul className="plain">
              {d.refunds.map((r) => (
                <li key={r.id}>
                  <bdi>{r.number}</bdi> · <Money fils={r.amount_fils} />{' '}
                  <StateBadge ns="refund" value={r.state} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {d.resolution ? (
          <section className="card" aria-labelledby="dsp-res">
            <h2 id="dsp-res" className="h3">
              {t('dispute.resolution')}
            </h2>
            <p className="pre-wrap">{d.resolution}</p>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function MessageForm({
  path,
  allowFiles,
  onDone,
}: {
  path: string;
  allowFiles: boolean;
  onDone: (d: DisputeDetail) => void;
}) {
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [sent, setSent] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(false);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get('file');
    if (file instanceof File && file.size === 0) fd.delete('file');
    const r = allowFiles
      ? await m.run<DisputeDetail>(path, { method: 'POST', form: fd })
      : await m.run<DisputeDetail>(path, {
          method: 'POST',
          body: { body: String(fd.get('body') ?? '') },
        });
    if (r.ok) {
      form.reset();
      setSent(true);
      onDone(r.data);
    }
  }
  return (
    <form onSubmit={submit} data-testid="dispute-message-form" noValidate>
      <TextArea
        label={t('dispute.message')}
        name="body"
        required
        maxLength={2000}
        rows={3}
        error={fe('body')}
      />
      {allowFiles ? (
        <Field
          label={t('dispute.evidence_file')}
          name="file"
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          optional
          error={fe('file')}
        />
      ) : null}
      {m.error && Object.keys(m.error.fieldErrors).length === 0 ? (
        <ApiErrorAlert error={m.error} />
      ) : null}
      {sent ? (
        <p role="status" className="muted small">
          {t('dispute.sent')}
        </p>
      ) : null}
      <Button type="submit" busy={m.busy}>
        {t('dispute.send')}
      </Button>
    </form>
  );
}
