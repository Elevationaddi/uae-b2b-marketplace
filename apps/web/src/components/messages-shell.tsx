'use client';
import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { useApp } from './app-context';
import { AppShell, useSession, type Workspace } from './session';
import { NotFound } from './ui';

function MessagesFrame({ children }: { children: (ws: Workspace) => ReactNode }) {
  const { locale } = useApp();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { me } = useSession();
  const ws = me.workspaces.find((w) => w.id === workspaceId);
  // Not a member of this workspace: same response as a missing resource (no enumeration).
  if (!ws) return <NotFound backHref={`/${locale}/app`} />;
  return <>{children(ws)}</>;
}

/** Messages for one workspace (buyer or seller side). Access is enforced by the API. */
export function MessagesShell({ children }: { children: (ws: Workspace) => ReactNode }) {
  return (
    <AppShell>
      <MessagesFrame>{children}</MessagesFrame>
    </AppShell>
  );
}
