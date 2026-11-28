'use client';
import type { AwardResponse, ConversationDetail, QuoteResponse, RfqDetail } from '@app/contracts';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { errorText, useApp, useT } from '@/components/app-context';
import { buyerApi, BuyerShell } from '@/components/buyer-shell';
import { Money } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import { RfqForm } from '@/components/rfq-form';
import {
  QuoteComparison,
  QuoteFigures,
  QuoteState,
  RfqState,
  RfqSummaryCard,
  RfqTimeline,
} from '@/components/rfq-ui';
import type { Workspace } from '@/components/session';
import {
  Alert,
  Button,
  ConfirmDialog,
  Field,
  PageHeader,
  Skeleton,
  TextArea,
} from '@/components/ui';
import { formatDubaiTime } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

type Dialog =
  | { kind: 'publish' }
  | { kind: 'cancel' }
  | { kind: 'accept'; q: QuoteResponse }
  | { kind: 'decline'; q: QuoteResponse }
  | { kind: 'revision'; q: QuoteResponse }
  | null;

function newKey() {
  return `accept-${crypto.randomUUID()}`;
}

function Detail({ ws, base }: { ws: Workspace; base: string }) {
  const t = useT();
  const { locale } = useApp();
  const router = useRouter();
  const params = useSearchParams();
  const { rfqId } = useParams<{ rfqId: string }>();
  const api = `${buyerApi(ws)}/rfqs/${rfqId}`;
  const { state, reload, setData } = useResource<RfqDetail>(api);
  const m = useMutation();
  const [dialog, setDialog] = useState<Dialog>(null);
  const [editing, setEditing] = useState(false);
  const [reason, setReason] = useState('');
  const [po, setPo] = useState('');
  const [idemKey, setIdemKey] = useState(newKey);
  const [notice, setNotice] = useState<string | null>(
    params?.get('created') ? t('rfq.created') : null,
  );
  const [award, setAward] = useState<AwardResponse | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const close = () => {
    setDialog(null);
    setReason('');
    setPo('');
    m.setError(null);
  };
  const act = async (path: string, body: unknown, ok: string) => {
    const r = await m.run<RfqDetail>(path, { method: 'POST', body });
    if (r.ok) {
      setData(r.data);
      setNotice(ok);
      close();
    } else if (r.status === 409) reload();
  };

  return (
    <Resource state={state} reload={reload} backHref={`${base}/rfqs`}>
      {(d) => (
        <>
          <PageHeader title={d.title}>
            <RfqState value={d.state} />
            {d.can.edit && !editing ? (
              <Button type="button" variant="secondary" onClick={() => setEditing(true)}>
                {t('rfq.edit_draft')}
              </Button>
            ) : null}
            {d.can.publish ? (
              <Button type="button" onClick={() => setDialog({ kind: 'publish' })}>
                {t('rfq.publish')}
              </Button>
            ) : null}
            {d.can.cancel ? (
              <Button type="button" variant="danger" onClick={() => setDialog({ kind: 'cancel' })}>
                {t('rfq.cancel')}
              </Button>
            ) : null}
          </PageHeader>
          <p className="muted">
            <Link href={`${base}/rfqs`}>{t('buyer.nav.rfqs')}</Link> · <bdi>{d.number}</bdi>
          </p>
          {notice ? <Alert kind="success">{notice}</Alert> : null}
          {d.admin_hidden ? <Alert kind="warning">{t('rfq.hidden_notice')}</Alert> : null}
          {d.state === 'AWARDED' ? (
            <Alert kind="success" title={t('rfq.awarded_title')}>
              <p>
                {t('rfq.awarded_body', {
                  due: d.payment_due_at ? formatDubaiTime(d.payment_due_at, locale) : '',
                })}
              </p>
              {d.award_order ? (
                <p>
                  <Link
                    className={
                      d.award_order.checkout_state === 'PENDING_PAYMENT'
                        ? 'btn btn-primary'
                        : 'btn btn-secondary'
                    }
                    href={
                      d.award_order.checkout_state === 'PENDING_PAYMENT'
                        ? `${base}/checkouts/${d.award_order.checkout_id}`
                        : `${base}/orders/${d.award_order.order_id}`
                    }
                    data-testid="award-order-link"
                  >
                    {d.award_order.checkout_state === 'PENDING_PAYMENT'
                      ? t('rfq.pay_order')
                      : t('rfq.view_order')}
                  </Link>
                </p>
              ) : (
                <p className="muted small">{t('rfq.order_unavailable')}</p>
              )}
              {award ? (
                <p className="muted small">
                  {t('rfq.award_total')} <Money fils={award.total_fils} />
                </p>
              ) : null}
            </Alert>
          ) : null}
          {d.state === 'CANCELLED' && d.cancel_reason ? (
            <Alert kind="info">{t('rfq.cancelled_reason', { reason: d.cancel_reason })}</Alert>
          ) : null}

          {editing ? (
            <section className="card">
              <h2 className="h3">{t('rfq.edit_draft')}</h2>
              <RfqForm
                wsApi={buyerApi(ws)}
                initial={d}
                busy={m.busy}
                error={m.error}
                submitLabel={t('common.save')}
                onSubmit={async (body) => {
                  const r = await m.run<RfqDetail>(api, {
                    method: 'PATCH',
                    body: { ...body, expected_version: d.version },
                  });
                  if (r.ok) {
                    setData(r.data);
                    setEditing(false);
                    setNotice(t('rfq.saved'));
                  }
                }}
              />
              <Button type="button" variant="link" onClick={() => setEditing(false)}>
                {t('common.cancel')}
              </Button>
            </section>
          ) : (
            <div className="two-col">
              <RfqSummaryCard d={d} fileHref={(f) => `${api}/files/${f}`} />
              <section className="card" aria-labelledby="rfq-inv">
                <h2 id="rfq-inv" className="h3">
                  {t('rfq.invited_suppliers')}
                </h2>
                {d.invitees.length === 0 ? (
                  <p className="muted">{t('rfq.no_invitees')}</p>
                ) : (
                  <ul>
                    {d.invitees.map((i) => (
                      <li key={i.workspace_id}>{i.company_name}</li>
                    ))}
                  </ul>
                )}
                {d.can.edit ? <FileUpload api={api} onDone={(x) => setData(x)} /> : null}
              </section>
            </div>
          )}

          {d.state !== 'DRAFT' ? (
            <section className="card" aria-labelledby="rfq-quotes">
              <h2 id="rfq-quotes" className="h3">
                {t('rfq.quotes')} ({d.quotes.length})
              </h2>
              <QuoteComparison
                quotes={d.quotes}
                actions={(q) => (
                  <div className="row-actions">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setOpen(open === q.id ? null : q.id)}
                      aria-expanded={open === q.id}
                    >
                      {t('quote.details')}
                    </Button>
                    {d.state === 'OPEN' && q.state === 'SUBMITTED' && d.can.cancel ? (
                      <>
                        <Button
                          type="button"
                          onClick={() => {
                            setIdemKey(newKey());
                            setDialog({ kind: 'accept', q });
                          }}
                        >
                          {t('quote.accept')}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setDialog({ kind: 'revision', q })}
                        >
                          {t('quote.request_revision')}
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => setDialog({ kind: 'decline', q })}
                        >
                          {t('quote.decline')}
                        </Button>
                      </>
                    ) : null}
                  </div>
                )}
              />
              {d.quotes
                .filter((q) => q.id === open && q.current)
                .map((q) => (
                  <QuoteDetail
                    key={q.id}
                    q={q}
                    fileHref={(f) => `${api}/files/${f}`}
                    ws={ws}
                    rfqId={d.id}
                    canMessage={d.can.message}
                  />
                ))}
            </section>
          ) : null}

          <section className="card" aria-labelledby="rfq-tl">
            <h2 id="rfq-tl" className="h3">
              {t('rfq.timeline')}
            </h2>
            <RfqTimeline events={d.events} />
          </section>

          <ConfirmDialog
            open={dialog?.kind === 'publish'}
            title={t('rfq.publish_title')}
            body={t(
              d.visibility === 'INVITE' ? 'rfq.publish_body_invite' : 'rfq.publish_body_pool',
            )}
            confirmLabel={t('rfq.publish')}
            busy={m.busy}
            error={m.error}
            onClose={close}
            onConfirm={() =>
              act(`${api}/publish`, { expected_version: d.version }, t('rfq.published'))
            }
          />
          <ConfirmDialog
            open={dialog?.kind === 'cancel'}
            title={t('rfq.cancel_title')}
            body={t('rfq.cancel_body')}
            confirmLabel={t('rfq.cancel')}
            danger
            busy={m.busy}
            error={m.error}
            onClose={close}
            onConfirm={() =>
              act(
                `${api}/cancel`,
                { expected_version: d.version, reason: reason || undefined },
                t('rfq.cancelled'),
              )
            }
          >
            <TextArea
              label={t('common.reason')}
              optional
              value={reason}
              maxLength={1000}
              onChange={(e) => setReason(e.target.value)}
            />
          </ConfirmDialog>
          {dialog?.kind === 'revision' || dialog?.kind === 'decline' ? (
            <ConfirmDialog
              open
              title={t(dialog.kind === 'revision' ? 'quote.request_revision' : 'quote.decline')}
              body={t(dialog.kind === 'revision' ? 'quote.revision_body' : 'quote.decline_body', {
                company: dialog.q.seller.company_name,
              })}
              confirmLabel={t(
                dialog.kind === 'revision' ? 'quote.request_revision' : 'quote.decline',
              )}
              danger={dialog.kind === 'decline'}
              busy={m.busy}
              error={m.error}
              onClose={close}
              onConfirm={() =>
                act(
                  `${buyerApi(ws)}/quotes/${dialog.q.id}/${dialog.kind === 'revision' ? 'request-revision' : 'decline'}`,
                  { version_id: dialog.q.current!.id, reason: reason || undefined },
                  t(dialog.kind === 'revision' ? 'quote.revision_sent' : 'quote.declined'),
                )
              }
            >
              <TextArea
                label={t('common.reason')}
                optional
                value={reason}
                maxLength={1000}
                onChange={(e) => setReason(e.target.value)}
              />
            </ConfirmDialog>
          ) : null}
          {dialog?.kind === 'accept' ? (
            <ConfirmDialog
              open
              title={t('quote.accept_title')}
              body={t('quote.accept_body', {
                company: dialog.q.seller.company_name,
                version: dialog.q.current!.version,
              })}
              confirmLabel={t('quote.accept_confirm')}
              busy={m.busy}
              error={m.error}
              onClose={close}
              onConfirm={async () => {
                const r = await m.run<AwardResponse>(
                  `${buyerApi(ws)}/quotes/${dialog.q.id}/accept`,
                  {
                    method: 'POST',
                    body: { version_id: dialog.q.current!.id, po_reference: po || undefined },
                    headers: { 'Idempotency-Key': idemKey },
                  },
                );
                if (r.ok) {
                  setAward(r.data);
                  close();
                  reload();
                  router.refresh();
                } else if (r.status === 409) {
                  // The quote changed (revised, expired or already awarded): show fresh data and ask again.
                  setNotice(null);
                  reload();
                }
              }}
            >
              <QuoteFigures v={dialog.q.current!} />
              <Field
                label={t('quote.po_reference')}
                optional
                value={po}
                maxLength={60}
                onChange={(e) => setPo(e.target.value)}
              />
              <p className="muted small">{t('quote.accept_note')}</p>
              {m.error && m.error.status === 409 ? (
                <p className="field-error">{errorText(locale, m.error)}</p>
              ) : null}
            </ConfirmDialog>
          ) : null}
        </>
      )}
    </Resource>
  );
}

function QuoteDetail({
  q,
  fileHref,
  ws,
  rfqId,
  canMessage,
}: {
  q: QuoteResponse;
  fileHref: (id: string) => string;
  ws: Workspace;
  rfqId: string;
  canMessage: boolean;
}) {
  const t = useT();
  const { locale } = useApp();
  const router = useRouter();
  const m = useMutation();
  const v = q.current!;
  return (
    <article className="card quote-detail" aria-label={q.seller.company_name}>
      <h3 className="h4">
        {q.seller.company_name} · v{v.version} <QuoteState value={q.state} />
      </h3>
      <QuoteFigures v={v} />
      <h4 className="h4">{t('quote.specs')}</h4>
      <p className="pre-wrap">{v.specs}</p>
      {v.deviations ? (
        <Alert kind="warning" title={t('quote.deviations')}>
          <p className="pre-wrap">{v.deviations}</p>
        </Alert>
      ) : null}
      {v.terms ? (
        <>
          <h4 className="h4">{t('quote.terms')}</h4>
          <p className="pre-wrap">{v.terms}</p>
        </>
      ) : null}
      {v.files.length ? (
        <ul className="file-list">
          {v.files.map((f) => (
            <li key={f.id}>
              <a href={`/api/v1${fileHref(f.id)}`}>{f.name}</a>
            </li>
          ))}
        </ul>
      ) : null}
      {q.history.length ? (
        <details>
          <summary>{t('quote.history', { count: q.history.length })}</summary>
          <ul>
            {q.history.map((h) => (
              <li key={h.id}>
                v{h.version} · <QuoteState value={h.state} /> · <Money fils={h.total_fils} /> ·{' '}
                {h.submitted_at ? formatDubaiTime(h.submitted_at, locale) : ''}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
      {canMessage && q.seller.storefront_id ? (
        <Button
          type="button"
          variant="secondary"
          busy={m.busy}
          onClick={async () => {
            const r = await m.run<ConversationDetail>(`/workspaces/${ws.id}/conversations`, {
              method: 'POST',
              body: {
                storefront_id: q.seller.storefront_id,
                rfq_id: rfqId,
                body: t('messages.rfq_opening'),
              },
            });
            if (r.ok) router.push(`/${locale}/app/messages/${ws.id}/${r.data.id}`);
          }}
        >
          {t('messages.message_supplier')}
        </Button>
      ) : null}
      {m.error ? <p className="field-error">{errorText(locale, m.error)}</p> : null}
    </article>
  );
}

function FileUpload({ api, onDone }: { api: string; onDone: (d: RfqDetail) => void }) {
  const t = useT();
  const m = useMutation();
  return (
    <form
      className="inline-form"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        const r = await m.run<RfqDetail>(`${api}/files`, { method: 'POST', form: fd });
        if (r.ok) {
          onDone(r.data);
          form.reset();
        }
      }}
    >
      <label htmlFor="rfq-file">{t('rfq.add_attachment')}</label>
      <input
        id="rfq-file"
        name="file"
        type="file"
        accept="application/pdf,image/png,image/jpeg"
        required
      />
      <Button type="submit" variant="secondary" busy={m.busy}>
        {t('rfq.upload')}
      </Button>
      <p className="muted small">{t('rfq.attachment_hint')}</p>
      {m.error ? (
        <Alert kind="error">
          {t(m.error.messageKey === 'file.infected' ? 'error.file.infected' : 'common.error_title')}
        </Alert>
      ) : null}
    </form>
  );
}

export default function BuyerRfqPage() {
  return (
    <BuyerShell>
      {(ws, base) => (
        <Suspense fallback={<Skeleton />}>
          <Detail ws={ws} base={base} />
        </Suspense>
      )}
    </BuyerShell>
  );
}
