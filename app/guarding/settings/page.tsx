// app/guarding/settings/page.tsx
'use client';

import SectionHeader from '@/components/guarding/shared/SectionHeader';
import Panel from '@/components/guarding/shared/Panel';
import StatusPill from '@/components/guarding/shared/StatusPill';
import { useState } from 'react';

export default function SettingsPage() {
  const [useLocalSimulation, setUseLocalSimulation] = useState(true);
  const [sandboxMode, setSandboxMode] = useState(true);

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Developer Settings" 
        description="Configure local simulation endpoints, toggle sandbox settings, and audit secure workspace metadata." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* API Gateway Configuration */}
        <Panel className="space-y-4">
          <h3 className="text-lg font-bold text-[#050816] font-heading uppercase tracking-wide">
            API Gateway Configurations
          </h3>

          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/85 border border-slate-800">
              <div>
                <span className="text-slate-300 block font-bold">Local Simulator Fallback</span>
                <span className="text-[10px] text-slate-500 font-sans mt-0.5 block">Use local parser when API is unreachable.</span>
              </div>
              <input
                type="checkbox"
                checked={useLocalSimulation}
                onChange={() => setUseLocalSimulation(!useLocalSimulation)}
                className="w-4 h-4 cursor-pointer accent-primary-accent"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/85 border border-slate-800">
              <div>
                <span className="text-slate-300 block font-bold">Execution Sandbox Mode</span>
                <span className="text-[10px] text-slate-500 font-sans mt-0.5 block">Intercept transactions without broadcasting to mainnet.</span>
              </div>
              <input
                type="checkbox"
                checked={sandboxMode}
                onChange={() => setSandboxMode(!sandboxMode)}
                className="w-4 h-4 cursor-pointer accent-primary-accent"
              />
            </div>
          </div>
        </Panel>

        {/* System & Workspace Metadata Panel */}
        <Panel className="space-y-4">
          <h3 className="text-lg font-bold text-[#050816] font-heading uppercase tracking-wide">
            Workspace Audits
          </h3>

          <div className="space-y-2.5 font-mono text-xs text-slate-400">
            <div className="flex justify-between border-b border-[#050816]/5 pb-2">
              <span>ENVIRONMENT</span>
              <span className="text-[#050816] font-bold">DEVELOPMENT (LOCAL)</span>
            </div>
            <div className="flex justify-between border-b border-[#050816]/5 pb-2">
              <span>ACTIVE CHAIN</span>
              <span className="text-indigo-400 font-bold">MANTLE SEPOLIA (5003)</span>
            </div>
            <div className="flex justify-between border-b border-[#050816]/5 pb-2">
              <span>CORE GATEWAY</span>
              <span className="text-emerald-400 font-bold">1SHOT BROADCASTER</span>
            </div>
            <div className="flex justify-between">
              <span>VERSION LOG</span>
              <span className="text-slate-500">v0.1.0-ALPHA-BUILD</span>
            </div>
          </div>
        </Panel>

      </div>
    </div>
  );
}
