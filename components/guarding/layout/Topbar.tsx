'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { useGuardingState } from '../GuardingContext';
import StatusPill from '../shared/StatusPill';
import { useState } from 'react';
import Link from 'next/link';

interface TopbarProps {
  onToggleMobileSidebar: () => void;
}

export default function Topbar({ onToggleMobileSidebar }: TopbarProps) {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { smartAccount, sessionAddress } = useGuardingState();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="h-16 border-b border-[#050816]/10 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between relative z-20 w-full select-none">
      
      {/* Left: Mobile hamburger menu toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 hover:bg-[#050816]/5 rounded-xl border border-transparent hover:border-[#050816]/10 text-slate-500 hover:text-[#050816] transition-all cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Back Link to Landing */}
        <Link href="/" className="no-underline flex items-center gap-1.5 text-slate-400 hover:text-[#050816] transition-colors text-xs font-mono font-bold">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Portal Home
        </Link>
      </div>

      {/* Center/Right: Network/Account info */}
      <div className="flex items-center gap-4">
        {/* Network status pill */}
        <StatusPill 
          status={isConnected ? "success" : "idle"} 
          label={isConnected ? "Mantle Sepolia Network" : "Offline"} 
          className="hidden sm:inline-flex"
        />

        {/* EOA Signer Connection */}
        {isConnected && address ? (
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-3 py-1.5 flex items-center gap-2 text-xs font-mono">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#050816] font-semibold">EOA:</span>
              <span className="text-slate-400 select-all">{truncateAddress(address)}</span>
              <button
                onClick={() => disconnect()}
                className="text-rose-400 hover:text-rose-500 ml-1.5 transition-colors font-bold uppercase text-[9px] cursor-pointer"
              >
                Exit
              </button>
            </div>

            {smartAccount && (
              <div className="hidden lg:flex bg-slate-900 border border-slate-800 rounded-2xl px-3 py-1.5 items-center gap-2 text-xs font-mono animate-fadeIn">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-pulse" />
                <span className="text-[#050816] font-semibold">Smart Account:</span>
                <span className="text-slate-400 select-all">{truncateAddress(smartAccount)}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-2xl">
            🔒 Signer Wallet Locked
          </div>
        )}
      </div>

    </header>
  );
}
