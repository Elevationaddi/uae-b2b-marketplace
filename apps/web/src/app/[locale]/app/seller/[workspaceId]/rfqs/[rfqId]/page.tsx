'use client';
import type { ConversationDetail, QuoteResponse, RfqDetail } from '@app/contracts';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { errorText, useApp, useT } from '@/components/app-context';
import { QuoteForm, type QuoteFormValues } from '@/components/quote-form';
import { Resource } from '@/components/resource';
import {
  QuoteFigures,
  QuoteState,
  RfqState,
  RfqSummaryCard,
  RfqTimeline,
} from '@/components/rfq-ui';
import { sellerApi, SellerShell } from '@/components/seller-shell';
import type { Workspace } from '@/components/session';
import { Alert, Button, ConfirmDialog, PageHeader, Skeleton, TextArea } from '@/components/ui';
import { formatDubaiTime } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';
import { Money } from '@/components/catalog-ui';

function Detail({ ws, base }: { ws: Workspace; base: string }) {
  const t = useT();
  const { locale } = useApp();
  const { rfqId } = useParams<{ rfqId: string }>();
  const api = `${sellerApi(ws)}/rfqs/${rfqId}`;
  const { state, reload, setData } = useResource<RfqDetail>(api);
  const [notice, setNotice] = useState<string | null>(null);
  return (
    <Resource state={state} reload={reload} backHref={`${base}/rfqs`}>
      {(d) => {
        const mine = d.quotes[0] ?? null;
        return (
          <>
            <PageHeader title={d.title}>
              <RfqState value={d.state} />
              {d.invited ? <span className="pill pill-info">{t('seller.rfq.invited')}</span> : null}
            </PageHeader>
            <p className="muted">
              <Link href={`${base}/rfqs`}>{t('seller.nav.rfqs')}</Link> · <bdi>{d.number}</bdi>
            </p>
            {notice ? <Alert kind="success">{notice}</Alert> : null}
            {d.quote_blocked_reason && !mine ? (
              <Alert kind="info">{errorText(locale, { messageKey: d.quote_blocked_reason })}</Alert>
            ) : null}
            {d.state === 'CANCELLED' && d.cancel_reason ? (
              <Alert kind="info">{t('rfq.cancelled_reason', { reason: d.cancel_reason })}</Alert>
            ) : null}
            <div className="two-col">
              <RfqSummaryCard d={d} fileHref={(f) => `${api}/files/${f}`} />
              <MyQuote
                ws={ws}
                d={d}
                q={mine}
                fileHref={(f) => `${api}/files/${f}`}
                onChange={(x, msg) => {
                  setData(x);
                  setNotice(msg);
                }}
                onStale={reload}
              />
            </div>
            {d.can.message ? <AskBuyer ws={ws} rfqId={d.id} /> : null}
            <section className="card" aria-labelledby="rfq-tl">
              <h2 id="rfq-tl" className="h3">
                {t('rfq.timeline')}
              </h2>
              <RfqTimeline events={d.events} />
            </section>
          </>
        );
      }}
    </Resource>
  );
}

function MyQuote({
  ws,
  d,
  q,
  fileHref,
  onChange,
  onStale,
}: {
  ws: Workspace;
  d: RfqDetail;
  q: QuoteResponse | null;
  fileHref: (id: string) => string;
  onChange: (d: RfqDetail, notice: string) => void;
  onStale: () => void;
}) {
  const t = useT();
  const { locale } = useApp();
  const m = useMutation();
  const [mode, setMode] = useState<'view' | 'edit' | 'revise'>('view');
  const [dialog, setDialog] = useState<'submit' | 'withdraw' | null>(null);
  const qApi = q ? `${sellerApi(ws)}/quotes/${q.id}` : '';
  const v = q?.current ?? null;

  const save = async (
    path: string,
    method: 'POST' | 'PATCH' | 'DELETE',
    body: unknown,
    msg: string,
  ) => {
    const r = await m.run<RfqDetail>(path, { method, body });
    if (r.ok) {
      setMode('view');
      setDialog(null);
      onChange(r.data, msg);
    } else if (r.status === 409) onStale();
  };
  const close = () => {
    setDialog(null);
    m.setError(null);
  };

  return (
    <section className="card" aria-labelledby="my-quote" data-testid="my-quote">
      <h2 id="my-quote" className="h3">
        {t('seller.quote.title')} {q ? <QuoteState value={q.state} /> : null}
      </h2>
      {!q ? (
        d.can.quote ? (
          <>
            <p className="muted small">{t('seller.quote.intro')}</p>
            <QuoteForm
              rfq={d}
              busy={m.busy}
              error={m.error}
              submitLabel={t('seller.quote.save_draft')}
              onSubmit={(body: QuoteFormValues) =>
                save(
                  `${sellerApi(ws)}/rfqs/${d.id}/quote`,
                  'POST',
                  body,
                  t('seller.quote.draft_saved'),
                )
              }
            />
          </>
        ) : (
          <p className="muted">{t('seller.quote.none')}</p>
        )
      ) : (
        <>
          {q.revision_requested && q.state === 'SUBMITTED' ? (
            <Alert kind="warning">{t('seller.quote.revision_requested_body')}</Alert>
          ) : null}
          {q.state === 'ACCEPTED' ? (
            <Alert kind="success">{t('seller.quote.accepted_body')}</Alert>
          ) : null}
          {q.state === 'DECLINED' ? (
            <Alert kind="info">{t('seller.quote.declined_body')}</Alert>
          ) : null}
          {mode === 'view' && v ? (
            <>
              <p className="muted small">
                v{v.version}
                {v.submitted_at
                  ? ` · ${t('seller.quote.submitted_at', { at: formatDubaiTime(v.submitted_at, locale) })}`
                  : ''}
              </p>
              <QuoteFigures v={v} />
              <h3 className="h4">{t('quote.specs')}</h3>
              <p className="pre-wrap">{v.specs}</p>
              {v.deviations ? (
                <>
                  <h3 className="h4">{t('quote.deviations')}</h3>
                  <p className="pre-wrap">{v.deviations}</p>
                </>
              ) : null}
              {v.terms ? (
                <>
                  <h3 className="h4">{t('quote.terms')}</h3>
                  <p className="pre-wrap">{v.terms}</p>
                </>
              ) : null}
              <h3 className="h4">{t('rfq.attachments')}</h3>
              {v.files.length === 0 ? (
                <p className="muted">{t('common.none')}</p>
              ) : (
                <ul className="file-list">
                  {v.files.map((f) => (
                    <li key={f.id}>
                      <a href={`/api/v1${fileHref(f.id)}`}>{f.name}</a>
                      {q.state === 'DRAFT' ? (
                        <Button
                          type="button"
                          variant="link"
                          busy={m.busy}
                          onClick={() =>
                            save(
                              `${qApi}/files/${f.id}`,
                              'DELETE',
                              undefined,
                              t('seller.quote.file_removed'),
                            )
                          }
                        >
                          {t('common.remove')}
                        </Button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
              {q.state === 'DRAFT' ? (
                <QuoteFileUpload
                  api={qApi}
                  onDone={(x) => onChange(x, t('seller.quote.file_added'))}
                />
              ) : null}
              <div className="actions">
                {q.state === 'DRAFT' && d.can.quote ? (
                  <>
                    <Button type="button" variant="secondary" onClick={() => setMode('edit')}>
                      {t('seller.quote.edit')}
                    </Button>
                    <Button type="button" onClick={() => setDialog('submit')}>
                      {t('seller.quote.submit')}
                    </Button>
                  </>
                ) : null}
                {q.state === 'SUBMITTED' && d.state === 'OPEN' ? (
                  <>
                    <Button type="button" variant="secondary" onClick={() => setMode('revise')}>
                      {t('seller.quote.revise')}
                    </Button>
                    <Button type="button" variant="danger" onClick={() => setDialog('withdraw')}>
                      {t('seller.quote.withdraw')}
                    </Button>
                  </>
                ) : null}
              </div>
              {m.error && !dialog ? (
                <p className="field-error">{errorText(locale, m.error)}</p>
              ) : null}
            </>
          ) : null}
          {mode !== 'view' && v ? (
            <>
              <QuoteForm
                rfq={d}
                initial={v}
                busy={m.busy}
                error={m.error}
                submitLabel={t(mode === 'edit' ? 'common.save' : 'seller.quote.submit_revision')}
                onSubmit={(body) =>
                  mode === 'edit'
                    ? save(
                        qApi,
                        'PATCH',
                        { ...body, expected_version: q.version },
                        t('seller.quote.draft_saved'),
                      )
                    : save(
                        `${qApi}/revise`,
                        'POST',
                        { ...body, expected_version: q.version },
                        t('seller.quote.revised'),
                      )
                }
              />
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setMode('view');
                  m.setError(null);
                }}
              >
                {t('common.cancel')}
              </Button>
            </>
          ) : null}
          {q.history.length ? (
            <details>
              <summary>{t('quote.history', { count: q.history.length })}</summary>
              <ul>
                {q.history.map((h) => (
                  <li key={h.id}>
                    v{h.version} · <QuoteState value={h.state} /> · <Money fils={h.total_fils} />
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
          <ConfirmDialog
            open={dialog === 'submit'}
            title={t('seller.quote.submit_title')}
            body={t('seller.quote.submit_body')}
            confirmLabel={t('seller.quote.submit')}
            busy={m.busy}
            error={m.error}
            onClose={close}
            onConfirm={() =>
              save(
                `${qApi}/submit`,
                'POST',
                { expected_version: q.version },
                t('seller.quote.submitted'),
              )
            }
          >
            {v ? <QuoteFigures v={v} /> : null}
          </ConfirmDialog>
          <ConfirmDialog
            open={dialog === 'withdraw'}
            title={t('seller.quote.withdraw_title')}
            body={t('seller.quote.withdraw_body')}
            confirmLabel={t('seller.quote.withdraw')}
            danger
            busy={m.busy}
            error={m.error}
            onClose={close}
            onConfirm={() =>
              save(
                `${qApi}/withdraw`,
                'POST',
                { expected_version: q.version },
                t('seller.quote.withdrawn'),
              )
            }
          />
        </>
      )}
    </section>
  );
}

function QuoteFileUpload({ api, onDone }: { api: string; onDone: (d: RfqDetail) => void }) {
  const t = useT();
  const { locale } = useApp();
  const m = useMutation();
  return (
    <form
      className="inline-form"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const r = await m.run<RfqDetail>(`${api}/files`, {
          method: 'POST',
          form: new FormData(form),
        });
        if (r.ok) {
          onDone(r.data);
          form.reset();
        }
      }}
    >
      <label htmlFor="quote-file">{t('rfq.add_attachment')}</label>
      <input
        id="quote-file"
        name="file"
        type="file"
        accept="application/pdf,image/png,image/jpeg"
        required
      />
      <Button type="submit" variant="secondary" busy={m.busy}>
        {t('rfq.upload')}
      </Button>
      <p className="muted small">{t('rfq.attachment_hint')}</p>
      {m.error ? <p className="field-error">{errorText(locale, m.error)}</p> : null}
    </form>
  );
}

function AskBuyer({ ws, rfqId }: { ws: Workspace; rfqId: string }) {
  const t = useT();
  const { locale } = useApp();
  const router = useRouter();
  const m = useMutation();
  const [body, setBody] = useState('');
  return (
    <section className="card" aria-labelledby="ask-buyer">
      <h2 id="ask-buyer" className="h3">
        {t('seller.rfq.ask_title')}
      </h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const r = await m.run<ConversationDetail>(`/workspaces/${ws.id}/conversations`, {
            method: 'POST',
            body: { rfq_id: rfqId, body },
          });
          if (r.ok) router.push(`/${locale}/app/messages/${ws.id}/${r.data.id}`);
        }}
      >
        <TextArea
          label={t('messages.your_message')}
          value={body}
          required
          rows={3}
          maxLength={4000}
          hint={t('seller.rfq.ask_hint')}
          onChange={(e) => setBody(e.target.value)}
          error={m.error?.fieldErrors?.body ? errorText(locale, m.error) : undefined}
        />
        {m.error && !m.error.fieldErrors?.body ? (
          <p className="field-error">{errorText(locale, m.error)}</p>
        ) : null}
        <Button type="submit" variant="secondary" busy={m.busy} disabled={!body.trim()}>
          {t('messages.send')}
        </Button>
      </form>
    </section>
  );
}

export default function SellerRfqPage() {
  return (
    <SellerShell>
      {(ws, base) => (
        <Suspense fallback={<Skeleton />}>
          <Detail ws={ws} base={base} />
        </Suspense>
      )}
    </SellerShell>
  );
}
