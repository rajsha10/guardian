// app/guarding/settings/page.tsx
'use client';

import SectionHeader from '@/components/guarding/shared/SectionHeader';
import Panel from '@/components/guarding/shared/Panel';
import StatusPill from '@/components/guarding/shared/StatusPill';
import { useGuarding } from '@/components/guarding/GuardingContext';

export default function SettingsPage() {
  const { sandboxMode, setSandboxMode, fallbackRelayer, setFallbackRelayer } = useGuarding();

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Developer Settings" 
        description="Configure local simulation endpoints, toggle sandbox settings, and audit secure workspace metadata." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* API Gateway Configuration */}
        <Panel className="space-y-4">
          <h3 className="text-lg font-bold text-guardian-pearl font-heading uppercase tracking-wide">
            API Gateway Configurations
          </h3>

          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/85 border border-guardian-slate">
              <div>
                <span className="text-guardian-ash/90 block font-bold">Local Simulator Fallback</span>
                <span className="text-[10px] text-guardian-ash font-sans mt-0.5 block">Use local parser when API is unreachable.</span>
              </div>
              <input
                type="checkbox"
                checked={fallbackRelayer}
                onChange={() => setFallbackRelayer(!fallbackRelayer)}
                className="w-4 h-4 cursor-pointer accent-primary-accent"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/85 border border-guardian-slate">
              <div>
                <span className="text-guardian-ash/90 block font-bold">Execution Sandbox Mode</span>
                <span className="text-[10px] text-guardian-ash font-sans mt-0.5 block">Intercept transactions without broadcasting to mainnet.</span>
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
          <h3 className="text-lg font-bold text-guardian-pearl font-heading uppercase tracking-wide">
            Workspace Audits
          </h3>

          <div className="space-y-2.5 font-mono text-xs text-guardian-ash">
            <div className="flex justify-between border-b border-guardian-slate/20 pb-2">
              <span>ENVIRONMENT</span>
              <span className="text-guardian-pearl font-bold">DEVELOPMENT (LOCAL)</span>
            </div>
            <div className="flex justify-between border-b border-guardian-slate/20 pb-2">
              <span>ACTIVE CHAIN</span>
              <span className="text-indigo-400 font-bold">ETHEREUM SEPOLIA (11155111)</span>
            </div>
            <div className="flex justify-between border-b border-guardian-slate/20 pb-2">
              <span>CORE GATEWAY</span>
              <span className="text-emerald-400 font-bold">1SHOT BROADCASTER</span>
            </div>
            <div className="flex justify-between">
              <span>VERSION LOG</span>
              <span className="text-guardian-ash">v0.1.0-ALPHA-BUILD</span>
            </div>
          </div>
        </Panel>

      </div>
    </div>
  );
}
