'use client';
import { useT } from '@/components/app-context';
import { WorkspaceDisputes } from '@/components/dispute-pages';
import { BuyerShell } from '@/components/buyer-shell';

function List({ wsId, base }: { wsId: string; base: string }) {
  const t = useT();
  return (
    <WorkspaceDisputes
      apiBase={`/buyer/workspaces/${wsId}`}
      base={base}
      title={t('buyer.nav.disputes')}
    />
  );
}

export default function BuyerDisputesPage() {
  return <BuyerShell>{(ws, base) => <List wsId={ws.id} base={base} />}</BuyerShell>;
}
