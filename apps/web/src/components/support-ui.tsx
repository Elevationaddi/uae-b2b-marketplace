'use client';
import {
  OPERATIONS_LIMITS,
  SUPPORT_CATEGORIES,
  SUPPORT_STATES,
  type OrderDetail,
  type SupportTicketDetail,
  type SupportTicketSummary,
} from '@app/contracts';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useCursor, useMutation, useResource } from '@/lib/use-resource';
import { useApp, useT } from './app-context';
import { Money } from './catalog-ui';
import { Resource } from './resource';
import {
  Alert,
  ApiErrorAlert,
  Button,
  ConfirmDialog,
  DefinitionList,
  Empty,
  Field,
  PageHeader,
  Pager,
  SelectField,
  StatusBadge,
  TextArea,
  useFieldError,
} from './ui';

type Kind = 'BUYER' | 'SELLER';

/** Ticket state as text plus colour; admins read "waiting for customer" instead of "for you". */
export function SupportBadge({ value, admin }: { value: string; admin?: boolean }) {
  const t = useT();
  const key =
    admin && value === 'WAITING_CUSTOMER'
      ? 'support.admin_state.WAITING_CUSTOMER'
      : `support.state.${value}`;
  return <StatusBadge value={value} label={t(key as MessageKey)} />;
}

export function SupportStateTabs({
  value,
  onChange,
  admin,
}: {
  value: string;
  onChange: (v: string) => void;
  admin?: boolean;
}) {
  const t = useT();
  return (
    <div className="tabs" role="tablist">
      {['', ...SUPPORT_STATES].map((k) => (
        <button
          key={k || 'all'}
          type="button"
          role="tab"
          aria-selected={value === k}
          onClick={() => onChange(k)}
        >
          {!k
            ? t('support.filter_all')
            : admin && k === 'WAITING_CUSTOMER'
              ? t('support.admin_state.WAITING_CUSTOMER')
              : t(`support.state.${k}` as MessageKey)}
        </button>
      ))}
    </div>
  );
}

export function SupportTable({
  items,
  hrefFor,
  admin,
}: {
  items: SupportTicketSummary[];
  hrefFor: (s: SupportTicketSummary) => string;
  admin?: boolean;
}) {
  const t = useT();
  const { locale } = useApp();
  return (
    <div className="table-wrap">
      <table className="table" data-testid="support-tickets">
        <thead>
          <tr>
            <th scope="col">{t('support.col')}</th>
            <th scope="col">{t('support.category')}</th>
            <th scope="col">{t('common.status')}</th>
            {admin ? <th scope="col">{t('support.assigned')}</th> : null}
            <th scope="col">{t('support.updated')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.id}>
              <td>
                <Link href={hrefFor(s)}>
                  <bdi>{s.number}</bdi>
                </Link>
                <span className="block" dir="auto">
                  {s.subject}
                </span>
                {admin ? (
                  <span className="muted small block">
                    {s.company_name} · {t(`support.kind.${s.workspace_kind}`)}
                  </span>
                ) : null}
              </td>
              <td>{t(`support.category.${s.category}`)}</td>
              <td>
                <SupportBadge value={s.state} admin={admin} />
              </td>
              {admin ? (
                <td>
                  {s.assigned_to_me
                    ? t('support.assigned_mine')
                    : s.assigned
                      ? t('support.assigned')
                      : t('support.unassigned')}
                </td>
              ) : null}
              <td>{formatDubaiTime(s.updated_at, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Conversation, reply box and ticket facts (customer or admin view). */
export function SupportView({
  s,
  admin,
  replyPath,
  orderHref,
  onUpdated,
  note,
}: {
  s: SupportTicketDetail;
  admin?: boolean;
  replyPath: string;
  orderHref?: string;
  onUpdated: (s: SupportTicketDetail) => void;
  note?: string | null;
}) {
  const t = useT();
  const { locale } = useApp();
  return (
    <div className="two-col">
      <div>
        <section className="card" aria-labelledby="sup-msgs">
          <h2 id="sup-msgs" className="h3">
            {t('support.messages')}
          </h2>
          <ol className="thread" data-testid="support-messages">
            {s.messages.map((m) => (
              <li
                key={m.id}
                className={`thread-msg thread-${m.author_side === 'CUSTOMER' ? 'buyer' : 'admin'}`}
              >
                <p className="small">
                  <strong>{t(`support.author.${m.author_side}`)}</strong>
                  {m.author_name && (m.author_side !== 'ADMIN' || admin) ? (
                    <>
                      {' · '}
                      <bdi>{m.author_name}</bdi>
                    </>
                  ) : null}
                  {' · '}
                  <time dateTime={m.created_at}>
                    <bdi>{formatDubaiTime(m.created_at, locale)}</bdi>
                  </time>
                </p>
                <p className="pre-wrap" dir="auto">
                  {m.body}
                </p>
              </li>
            ))}
          </ol>
          {s.can_reply ? (
            <ReplyForm path={replyPath} onDone={onUpdated} />
          ) : note ? (
            <p className="muted">{note}</p>
          ) : null}
        </section>
      </div>
      <div>
        <section className="card" aria-labelledby="sup-info">
          <h2 id="sup-info" className="h3">
            {t('order.details')}
          </h2>
          <DefinitionList
            items={
              [
                [t('common.status'), <SupportBadge key="s" value={s.state} admin={admin} />],
                [t('support.category'), t(`support.category.${s.category}`)],
                ...(admin
                  ? ([
                      [t('support.company'), s.company_name],
                      ['', t(`support.kind.${s.workspace_kind}`)],
                    ] as [string, string][])
                  : []),
                ...(s.order
                  ? ([
                      [
                        t('support.linked_order'),
                        orderHref ? (
                          <Link key="o" href={orderHref}>
                            <bdi>{s.order.number}</bdi>
                          </Link>
                        ) : (
                          <bdi key="o">{s.order.number}</bdi>
                        ),
                      ],
                      [t('checkout.total'), <Money key="t" fils={s.order.total_fils} />],
                    ] as [string, React.ReactNode][])
                  : []),
                ...(s.rfq
                  ? ([
                      [
                        t('support.linked_rfq'),
                        <span key="r">
                          <bdi>{s.rfq.number}</bdi> · {s.rfq.title}
                        </span>,
                      ],
                    ] as [string, React.ReactNode][])
                  : []),
                [t('order.created'), formatDubaiTime(s.created_at, locale)],
                [t('support.updated'), formatDubaiTime(s.updated_at, locale)],
              ].filter(([k]) => k !== '') as [string, React.ReactNode][]
            }
          />
        </section>
      </div>
    </div>
  );
}

function ReplyForm({ path, onDone }: { path: string; onDone: (s: SupportTicketDetail) => void }) {
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [sent, setSent] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(false);
    const form = e.currentTarget;
    const body = String(new FormData(form).get('body') ?? '');
    const r = await m.run<SupportTicketDetail>(path, { method: 'POST', body: { body } });
    if (r.ok) {
      form.reset();
      setSent(true);
      onDone(r.data);
    }
  }
  return (
    <form onSubmit={submit} data-testid="support-reply-form" noValidate>
      <TextArea
        label={t('support.reply')}
        name="body"
        required
        maxLength={4000}
        rows={3}
        error={fe('body')}
      />
      {m.error && Object.keys(m.error.fieldErrors).length === 0 ? (
        <ApiErrorAlert error={m.error} />
      ) : null}
      {sent ? (
        <p role="status" className="muted small">
          {t('support.sent')}
        </p>
      ) : null}
      <Button type="submit" busy={m.busy}>
        {t('support.send')}
      </Button>
    </form>
  );
}

/** Ticket list for a buyer or seller workspace (members only; the API scopes every row). */
export function WorkspaceSupportList({
  wsId,
  base,
  canWrite,
}: {
  wsId: string;
  base: string;
  canWrite: boolean;
}) {
  const t = useT();
  const c = useCursor();
  const [state, setState] = useState('');
  const res = useResource<SupportTicketSummary[]>(`/workspaces/${wsId}/support`, {
    state: state || undefined,
    cursor: c.cursor || undefined,
  });
  return (
    <>
      <PageHeader title={t('support.title')}>
        {canWrite ? (
          <Link className="button" href={`${base}/support/new`}>
            {t('support.new')}
          </Link>
        ) : null}
      </PageHeader>
      <p className="muted">{t('support.intro')}</p>
      <p className="muted small" data-testid="support-limit-note">
        {t('support.limit_note', { limit: OPERATIONS_LIMITS.openTicketsPerCompany })}
      </p>
      <SupportStateTabs value={state} onChange={(v) => (setState(v), c.first())} />
      <Resource state={res.state} reload={res.reload} lines={5}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('support.empty')}</p>
              {canWrite ? (
                <Link className="button" href={`${base}/support/new`}>
                  {t('support.new')}
                </Link>
              ) : null}
            </Empty>
          ) : (
            <>
              <SupportTable items={items} hrefFor={(s) => `${base}/support/${s.id}`} />
              <Pager hasPrev={c.hasPrev} nextCursor={next} onFirst={c.first} onNext={c.next} />
            </>
          )
        }
      </Resource>
    </>
  );
}

/** New ticket form; `?order=<id>` links one of the workspace's own orders. */
export function WorkspaceSupportNew({
  wsId,
  base,
  kind,
  canWrite,
}: {
  wsId: string;
  base: string;
  kind: Kind;
  canWrite: boolean;
}) {
  const t = useT();
  const router = useRouter();
  const search = useSearchParams();
  const orderId = search.get('order');
  const order = useResource<OrderDetail>(
    orderId
      ? `/${kind === 'BUYER' ? 'buyer' : 'seller'}/workspaces/${wsId}/orders/${orderId}`
      : null,
  );
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [category, setCategory] = useState<string>(orderId ? 'ORDER' : 'ACCOUNT');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const r = await m.run<SupportTicketDetail>(`/workspaces/${wsId}/support`, {
      method: 'POST',
      body: {
        category,
        subject: String(fd.get('subject') ?? ''),
        body: String(fd.get('body') ?? ''),
        ...(orderId && order.state.status === 'ready' ? { order_id: orderId } : {}),
      },
    });
    if (r.ok) router.push(`${base}/support/${r.data.id}`);
  }
  return (
    <>
      <PageHeader title={t('support.new_title')} />
      {!canWrite ? (
        <Alert kind="info">{t('support.readonly_note')}</Alert>
      ) : (
        <form className="card narrow" onSubmit={submit} noValidate data-testid="support-new-form">
          {orderId && order.state.status === 'ready' ? (
            <p>
              {t('support.linked_order')}: <bdi>{order.state.data.number}</bdi>
            </p>
          ) : null}
          <SelectField
            label={t('support.category')}
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={SUPPORT_CATEGORIES.map((c) => ({
              value: c,
              label: t(`support.category.${c}`),
            }))}
            error={fe('category')}
          />
          <Field
            label={t('support.subject')}
            name="subject"
            required
            maxLength={160}
            error={fe('subject')}
          />
          <TextArea
            label={t('support.body')}
            name="body"
            required
            rows={6}
            maxLength={4000}
            hint={t('support.body_hint')}
            error={fe('body')}
          />
          {m.error && Object.keys(m.error.fieldErrors).length === 0 ? (
            <ApiErrorAlert error={m.error} />
          ) : null}
          <div className="actions">
            <Button type="submit" busy={m.busy}>
              {t('support.submit')}
            </Button>
            <Link href={`${base}/support`}>{t('common.cancel')}</Link>
          </div>
        </form>
      )}
    </>
  );
}

/** Ticket detail for a workspace member: reply, reopen a resolved ticket, or close it. */
export function WorkspaceSupportDetail({
  wsId,
  base,
  canWrite,
}: {
  wsId: string;
  base: string;
  canWrite: boolean;
}) {
  const t = useT();
  const { ticketId } = useParams<{ ticketId: string }>();
  const path = `/workspaces/${wsId}/support/${ticketId}`;
  const res = useResource<SupportTicketDetail>(path);
  const m = useMutation();
  const [confirm, setConfirm] = useState(false);
  const step = async (s: 'close' | 'reopen') => {
    const r = await m.run<SupportTicketDetail>(`${path}/${s}`, { method: 'POST' });
    if (r.ok) {
      res.setData(r.data);
      setConfirm(false);
    }
  };
  return (
    <Resource state={res.state} reload={res.reload} backHref={`${base}/support`}>
      {(s) => (
        <>
          <PageHeader title={t('support.number_title', { number: s.number })}>
            <SupportBadge value={s.state} />
            {s.can_reopen ? (
              <Button variant="secondary" busy={m.busy} onClick={() => step('reopen')}>
                {t('support.reopen')}
              </Button>
            ) : null}
            {s.can_close ? (
              <Button variant="secondary" onClick={() => setConfirm(true)}>
                {t('support.close')}
              </Button>
            ) : null}
          </PageHeader>
          <h2 className="h3" dir="auto">
            {s.subject}
          </h2>
          {m.error && !confirm ? <ApiErrorAlert error={m.error} /> : null}
          <SupportView
            s={s}
            replyPath={`${path}/messages`}
            orderHref={s.order ? `${base}/orders/${s.order.id}` : undefined}
            onUpdated={res.setData}
            note={
              s.state === 'CLOSED'
                ? t('support.closed_note')
                : s.state === 'RESOLVED'
                  ? t('support.resolved_note')
                  : !canWrite
                    ? t('support.readonly_note')
                    : null
            }
          />
          <ConfirmDialog
            open={confirm}
            title={t('support.close_title')}
            body={t('support.close_body')}
            confirmLabel={t('support.close')}
            busy={m.busy}
            error={m.error}
            onConfirm={() => step('close')}
            onClose={() => setConfirm(false)}
          />
        </>
      )}
    </Resource>
  );
}
