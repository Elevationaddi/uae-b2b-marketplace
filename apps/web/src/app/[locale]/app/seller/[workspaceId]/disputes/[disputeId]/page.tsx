'use client';
import { WorkspaceDispute } from '@/components/dispute-pages';
import { SellerShell } from '@/components/seller-shell';

export default function SellerDisputePage() {
  return (
    <SellerShell>
      {(ws, base) => <WorkspaceDispute apiBase={`/seller/workspaces/${ws.id}`} base={base} />}
    </SellerShell>
  );
}
