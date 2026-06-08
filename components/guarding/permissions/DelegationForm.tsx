'use client';

import { useState } from 'react';
import { useGuardingState } from '../GuardingContext';
import Panel from '../shared/Panel';

export default function DelegationForm() {
  const { sessionAddress, delegationRules, setDelegationRules, setRobotState } = useGuardingState();
  const [spendLimit, setSpendLimit] = useState(delegationRules?.spendLimit || '100');
  const [allowedAddress, setAllowedAddress] = useState(delegationRules?.allowedAddress || '0x9ec4248858C5f4df2B82Ff4ee81df33A89736cAb'); // Mock Yield/Vault target
  const [expiryDays, setExpiryDays] = useState(delegationRules?.expiryDays || 30);
  const [isSaved, setIsSaved] = useState(!!delegationRules);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!allowedAddress.startsWith('0x') || allowedAddress.length !== 42) {
      alert('Please enter a valid EVM contract address.');
      return;
    }

    setDelegationRules({
      spendLimit,
      allowedAddress,
      expiryDays,
    });
    
    setIsSaved(true);
    setRobotState('listening');
  };

  if (!sessionAddress) {
    return (
      <Panel variant="dashed" className="text-center text-slate-500 font-mono text-sm">
        Waiting for AI Session Account generation to configure rules...
      </Panel>
    );
  }

  return (
    <Panel>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold tracking-tight text-violet-400 font-heading">
          Define ERC-7715 Permissions
        </h2>
        <span className="bg-violet-950 text-violet-400 border border-violet-800/60 rounded-full px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider uppercase">
          {isSaved ? 'State Locked' : 'Drafting'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono text-slate-400 mb-1 font-bold">SPEND LIMIT</label>
          <div className="relative">
            <input
              type="number"
              value={spendLimit}
              onChange={(e) => { setSpendLimit(e.target.value); setIsSaved(false); }}
              className="w-full guarding-input px-3 py-2 text-xs focus:outline-none"
              required
              min="1"
            />
            <span className="absolute right-3 top-2 text-xs font-bold text-slate-600 font-mono">USDC</span>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono text-slate-400 mb-1 font-bold">ALLOWED TARGET CONTRACT (WHITELIST)</label>
          <input
            type="text"
            value={allowedAddress}
            onChange={(e) => { setAllowedAddress(e.target.value); setIsSaved(false); }}
            className="w-full guarding-input px-3 py-2 text-xs focus:outline-none"
            required
          />
          <p className="text-[9px] text-slate-500 mt-1 italic font-medium">The AI agent will be cryptographically locked out of all other addresses.</p>
        </div>

        <div>
          <label className="block text-[10px] font-mono text-slate-400 mb-1 font-bold">SESSION EXPIRY</label>
          <select
            value={expiryDays}
            onChange={(e) => { setExpiryDays(Number(e.target.value)); setIsSaved(false); }}
            className="w-full guarding-input px-3 py-2 text-xs focus:outline-none"
          >
            <option value={1} className="text-[#050816] bg-white">1 Day</option>
            <option value={7} className="text-[#050816] bg-white">7 Days</option>
            <option value={30} className="text-[#050816] bg-white">30 Days</option>
            <option value={90} className="text-[#050816] bg-white">90 Days</option>
          </select>
        </div>

        <button
          type="submit"
          className={`w-full font-bold py-2.5 px-4 rounded-full shadow-md transition-all text-xs font-mono border-none cursor-pointer ${
            isSaved 
              ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
              : 'bg-violet-600 text-white hover:bg-violet-500'
          }`}
        >
          {isSaved ? '✓ Rules Locked in Context' : 'Lock Rules into Agent Context'}
        </button>
      </form>

      {isSaved && (
        <div className="mt-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[10px] font-mono space-y-1 text-slate-400 animate-fadeIn">
          <div><span className="text-slate-600">Delegated Agent:</span> {sessionAddress}</div>
          <div><span className="text-slate-600">Max Capacity:</span> {spendLimit} USDC</div>
          <div><span className="text-slate-600">Allowed Destination:</span> {allowedAddress}</div>
          <div><span className="text-slate-600">Session Lifecycle:</span> {expiryDays} Days</div>
        </div>
      )}
    </Panel>
  );
}
