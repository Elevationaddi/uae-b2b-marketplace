'use client';
import { useT } from '@/components/app-context';
import { WorkspaceDisputes } from '@/components/dispute-pages';
import { SellerShell } from '@/components/seller-shell';

function List({ wsId, base }: { wsId: string; base: string }) {
  const t = useT();
  return (
    <WorkspaceDisputes
      apiBase={`/seller/workspaces/${wsId}`}
      base={base}
      title={t('seller.nav.disputes')}
    />
  );
}

export default function SellerDisputesPage() {
  return <SellerShell>{(ws, base) => <List wsId={ws.id} base={base} />}</SellerShell>;
}
