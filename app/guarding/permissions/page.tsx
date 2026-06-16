// app/guarding/permissions/page.tsx
'use client';

import SectionHeader from '@/components/guarding/shared/SectionHeader';
import DelegationForm from '@/components/guarding/permissions/DelegationForm';
import DelegationCard from '@/components/guarding/permissions/PermissionObject';

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Permission Caveats" 
        description="Establish rules (e.g. whitelists, caps) to cryptographically lock the AI agent session out of raw asset custody before signature." 
      />

      <div className="grid grid-cols-1 gap-8">
        <DelegationForm />
        <DelegationCard />
      </div>
    </div>
  );
}
