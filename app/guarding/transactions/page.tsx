// app/guarding/transactions/page.tsx
'use client';

import SectionHeader from '@/components/guarding/shared/SectionHeader';
import TransactionBuilder from '@/components/guarding/transactions/TransactionBuilder';
import RelayerBroadcast from '@/components/guarding/transactions/RelayerBroadcast';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Transaction Relayer" 
        description="Compile pre-approved transaction payloads into immutable raw EVM transaction block data and broadcast them gaslessly." 
      />

      <div className="grid grid-cols-1 gap-8">
        <TransactionBuilder />
        <RelayerBroadcast />
      </div>
    </div>
  );
}
