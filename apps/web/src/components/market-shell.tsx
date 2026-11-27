'use client';
import type { MeResponse } from '@app/contracts';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { api } from '@/lib/client';
import { useResource } from '@/lib/use-resource';
import { useApp, useT } from './app-context';
import { useLocalized } from './catalog-ui';
import { LocaleSwitch } from './locale-switch';

type Viewer = { status: 'loading' } | { status: 'guest' } | { status: 'user'; me: MeResponse };
const ViewerCtx = createContext<Viewer>({ status: 'loading' });
/** Who is browsing, for UI hints only. Every permission is enforced by the API. */
export function useViewer(): Viewer {
  return useContext(ViewerCtx);
}

type Suggest = {
  products: { id: string; title_en: string; title_ar: string | null }[];
  suppliers: { id: string; name: string }[];
  categories: { id: string; name_en: string; name_ar: string }[];
};

function SearchBox() {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname() ?? '';
  const [q, setQ] = useState(pathname.endsWith('/search') ? (params?.get('q') ?? '') : '');
  const [sug, setSug] = useState<Suggest | null>(null);
  const [open, setOpen] = useState(false);
  const listId = useId();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const term = q.trim();
    if (term.length < 2) {
      setSug(null);
      return;
    }
    const ctrl = new AbortController();
    timer.current = setTimeout(() => {
      api<Suggest>('/marketplace/suggest', { query: { q: term }, signal: ctrl.signal })
        .then((r) => {
          if (r.ok) setSug(r.data);
        })
        .catch(() => undefined);
    }, 200);
    return () => ctrl.abort();
  }, [q]);

  const any = sug && (sug.products.length || sug.suppliers.length || sug.categories.length);
  return (
    <form
      role="search"
      className="mkt-search"
      onSubmit={(e) => {
        e.preventDefault();
        setOpen(false);
        router.push(`/${locale}/search?q=${encodeURIComponent(q.trim())}`);
      }}
    >
      <label className="sr-only" htmlFor={`${listId}-input`}>
        {t('mkt.search_label')}
      </label>
      <input
        id={`${listId}-input`}
        type="search"
        value={q}
        maxLength={100}
        placeholder={t('mkt.search_placeholder')}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        aria-controls={listId}
        aria-expanded={!!(open && any)}
        aria-autocomplete="list"
        role="combobox"
        autoComplete="off"
      />
      <button type="submit" className="btn btn-primary">
        {t('mkt.search')}
      </button>
      {open && any ? (
        <div id={listId} className="suggest" role="listbox" aria-label={t('mkt.suggestions')}>
          {sug!.categories.map((c) => (
            <Link
              key={c.id}
              role="option"
              aria-selected={false}
              href={`/${locale}/categories/${c.id}`}
            >
              <span className="muted small">{t('mkt.categories')} · </span>
              {L(c.name_en, c.name_ar)}
            </Link>
          ))}
          {sug!.products.map((p) => (
            <Link
              key={p.id}
              role="option"
              aria-selected={false}
              href={`/${locale}/products/${p.id}`}
            >
              {L(p.title_en, p.title_ar)}
            </Link>
          ))}
          {sug!.suppliers.map((s) => (
            <Link
              key={s.id}
              role="option"
              aria-selected={false}
              href={`/${locale}/suppliers/${s.id}`}
            >
              <span className="muted small">{t('mkt.suppliers')} · </span>
              {s.name}
            </Link>
          ))}
        </div>
      ) : null}
    </form>
  );
}

/** Public marketplace shell: search, category and supplier navigation, account links. */
export function MarketShell({ children }: { children: ReactNode }) {
  const { locale, appName } = useApp();
  const t = useT();
  const pathname = usePathname() ?? '';
  const { state } = useResource<MeResponse>('/me');
  const viewer: Viewer =
    state.status === 'loading'
      ? { status: 'loading' }
      : state.status === 'ready'
        ? { status: 'user', me: state.data }
        : { status: 'guest' };
  const base = `/${locale}`;
  const links = [
    { href: `${base}/categories`, label: t('mkt.categories') },
    { href: `${base}/suppliers`, label: t('mkt.suppliers') },
    { href: `${base}/saved`, label: t('mkt.saved') },
    { href: `${base}/compare`, label: t('mkt.compare') },
  ];
  const sellerWs =
    viewer.status === 'user' ? viewer.me.workspaces.find((w) => w.kind === 'SELLER') : undefined;
  return (
    <ViewerCtx.Provider value={viewer}>
      <header className="site-header mkt-header">
        <Link href={base} className="brand">
          {appName}
        </Link>
        <Suspense>
          <SearchBox />
        </Suspense>
        <div className="header-links">
          {viewer.status === 'user' ? (
            <>
              {sellerWs ? (
                <Link href={`${base}/app/seller/${sellerWs.id}`}>{t('seller.go_seller')}</Link>
              ) : null}
              <Link href={`${base}/preferences`}>{t('mkt.preferences')}</Link>
              <Link href={`${base}/app`}>{t('mkt.my_account')}</Link>
            </>
          ) : viewer.status === 'guest' ? (
            <>
              <Link href={`${base}/login?next=${encodeURIComponent(pathname)}`}>
                {t('nav.sign_in')}
              </Link>
              <Link href={`${base}/register`}>{t('nav.register')}</Link>
            </>
          ) : null}
          <Suspense>
            <LocaleSwitch />
          </Suspense>
        </div>
      </header>
      <nav className="mkt-nav" aria-label={t('nav.main')}>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={pathname.startsWith(l.href) ? 'page' : undefined}
          >
            {l.label}
          </Link>
        ))}
        <Link
          href={`${base}/recent`}
          aria-current={pathname.startsWith(`${base}/recent`) ? 'page' : undefined}
        >
          {t('mkt.recent')}
        </Link>
      </nav>
      <main id="main" className="container container-wide">
        {children}
      </main>
    </ViewerCtx.Provider>
  );
}
