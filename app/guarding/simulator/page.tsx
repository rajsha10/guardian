// app/guarding/simulator/page.tsx
'use client';

import SectionHeader from '@/components/guarding/shared/SectionHeader';
import AgentIntent from '@/components/guarding/simulator/AgentIntent';
import ExecutionSimulator from '@/components/guarding/simulator/ExecutionSimulator';

export default function SimulatorPage() {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Security Simulator" 
        description="Verify AI-driven execution paths in real-time. The sandbox simulates NLP intent parsing and on-chain limit validation." 
      />

      <div className="grid grid-cols-1 gap-8">
        <AgentIntent />
        <ExecutionSimulator />
      </div>
    </div>
  );
}
