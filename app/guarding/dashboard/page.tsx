// app/guarding/dashboard/page.tsx
'use client';

import SectionHeader from '@/components/guarding/shared/SectionHeader';
import WalletConnect from '@/components/guarding/dashboard/WalletConnect';
import ArchitectureGraph from '@/components/guarding/dashboard/ArchitectureGraph';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Mission Control" 
        description="Sovereign autonomous workflows command center. Initialize smart accounts and monitor visual security topology graphs." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <WalletConnect />
      </div>

      <div className="mt-8">
        <ArchitectureGraph />
      </div>
    </div>
  );
}
