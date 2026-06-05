'use client';

import { useState } from 'react';

interface DelegationFormProps {
  sessionAddress: string | null;
  onRulesSaved: (rules: { spendLimit: string; allowedAddress: string; expiryDays: number }) => void;
}

export default function DelegationForm({ sessionAddress, onRulesSaved }: DelegationFormProps) {
  const [spendLimit, setSpendLimit] = useState('100');
  const [allowedAddress, setAllowedAddress] = useState('0x9ec4248858C5f4df2B82Ff4ee81df33A89736cAb'); // Mock Yield/Vault target
  const [expiryDays, setExpiryDays] = useState(30);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!allowedAddress.startsWith('0x') || allowedAddress.length !== 42) {
      alert('Please enter a valid EVM contract address.');
      return;
    }

    onRulesSaved({
      spendLimit,
      allowedAddress,
      expiryDays,
    });
    
    setIsSaved(true);
  };

  if (!sessionAddress) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-xl p-6 text-center text-slate-500 font-mono text-sm">
        Waiting for AI Session Account generation to configure rules...
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold tracking-tight text-violet-400">Step 2: Define ERC-7715 Permissions</h2>
        <span className="bg-violet-950 text-violet-400 border border-violet-800/60 rounded-full px-2 py-0.5 text-[10px] font-mono">
          State Saved
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">SPEND LIMIT</label>
          <div className="relative">
            <input
              type="number"
              value={spendLimit}
              onChange={(e) => { setSpendLimit(e.target.value); setIsSaved(false); }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-violet-500"
              required
              min="1"
            />
            <span className="absolute right-3 top-2 text-xs font-bold text-slate-600 font-mono">USDC</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">ALLOWED TARGET CONTRACT (WHITELIST)</label>
          <input
            type="text"
            value={allowedAddress}
            onChange={(e) => { setAllowedAddress(e.target.value); setIsSaved(false); }}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-violet-500"
            required
          />
          <p className="text-[10px] text-slate-500 mt-1 italic">The AI agent will be cryptographically locked out of all other addresses.</p>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">SESSION EXPIRY</label>
          <select
            value={expiryDays}
            onChange={(e) => { setExpiryDays(Number(e.target.value)); setIsSaved(false); }}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-violet-500"
          >
            <option value={1}>1 Day</option>
            <option value={7}>7 Days</option>
            <option value={30}>30 Days</option>
            <option value={90}>90 Days</option>
          </select>
        </div>

        <button
          type="submit"
          className={`w-full font-medium py-2.5 px-4 rounded-lg shadow-md transition-all text-sm font-mono ${
            isSaved 
              ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
              : 'bg-violet-600 text-white hover:bg-violet-500'
          }`}
        >
          {isSaved ? '✓ Rules Saved Locally' : 'Lock Rules into Agent Context'}
        </button>
      </form>

      {isSaved && (
        <div className="mt-4 bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1 text-slate-400 animate-fadeIn">
          <div><span className="text-slate-600">Delegated Agent:</span> {sessionAddress}</div>
          <div><span className="text-slate-600">Max Capacity:</span> {spendLimit} USDC</div>
          <div><span className="text-slate-600">Allowed Destination:</span> {allowedAddress}</div>
          <div><span className="text-slate-600">Session Lifecycle:</span> {expiryDays} Days</div>
        </div>
      )}
    </div>
  );
}