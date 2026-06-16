// components/landing/DelegationFlow.tsx
'use client';

import { motion } from 'framer-motion';
import AnimatedConnection from './AnimatedConnection';

export default function DelegationFlow() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto relative z-10 py-4">
      
      {/* 1. USER WALLET */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-full bg-slate-900 border border-guardian-slate p-4 rounded-xl flex items-center gap-4 backdrop-blur-xl shadow-md"
      >
        <div className="p-2.5 rounded-lg bg-slate-950/40 border border-guardian-slate/40 shrink-0">
          <svg className="w-5 h-5 text-guardian-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <div className="flex-grow text-left">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-bold text-slate-200 font-heading uppercase tracking-wider">USER WALLET</h4>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-[10px] text-guardian-ash font-mono mt-0.5">0x7b69...e2f0</p>
        </div>
      </motion.div>

      {/* Connection line 1 */}
      <AnimatedConnection type="vertical" duration={2} delay={0} />

      {/* 2. SESSION PERMISSIONS */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="w-full bg-slate-900 border border-guardian-slate p-4 rounded-xl flex items-center gap-4 backdrop-blur-xl shadow-md"
      >
        <div className="p-2.5 rounded-lg bg-slate-950/40 border border-guardian-slate/40 shrink-0">
          <svg className="w-5 h-5 text-guardian-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="flex-grow text-left">
          <h4 className="text-[11px] font-bold text-slate-200 font-heading uppercase tracking-wider">SESSION PERMISSIONS</h4>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="text-[8px] font-mono bg-slate-950/50 text-guardian-pearl px-1.5 py-0.5 rounded border border-guardian-slate/5">Daily Limit: 500 USDC</span>
            <span className="text-[8px] font-mono bg-slate-950/50 text-guardian-pearl px-1.5 py-0.5 rounded border border-guardian-slate/5">Methods: Swap, Approve</span>
          </div>
        </div>
      </motion.div>

      {/* Connection line 2 */}
      <AnimatedConnection type="vertical" duration={2.2} delay={0.6} />

      {/* 3. VALIDATION LAYER */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="w-full bg-slate-900 border border-guardian-slate p-4 rounded-xl flex items-center gap-4 backdrop-blur-xl shadow-md"
      >
        <div className="p-2.5 rounded-lg bg-slate-950/40 border border-guardian-slate/40 shrink-0">
          <svg className="w-5 h-5 text-guardian-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="flex-grow text-left">
          <h4 className="text-[11px] font-bold text-slate-200 font-heading uppercase tracking-wider">VALIDATION SHIELD</h4>
          <p className="text-[9px] text-guardian-ash font-sans font-medium mt-0.5">Scanning payloads, sanitizing natural language inputs</p>
        </div>
      </motion.div>

      {/* Connection line 3 */}
      <AnimatedConnection type="vertical" duration={2} delay={1.2} />

      {/* 4. DELEGATED AI */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="w-full bg-slate-900 border border-guardian-slate p-4 rounded-xl flex items-center gap-4 backdrop-blur-xl shadow-md"
      >
        <div className="p-2.5 rounded-lg bg-slate-950/40 border border-guardian-slate/40 shrink-0">
          <svg className="w-5 h-5 text-guardian-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex-grow text-left">
          <h4 className="text-[11px] font-bold text-slate-200 font-heading uppercase tracking-wider">DELEGATED AI</h4>
          <p className="text-[9px] text-guardian-cyan font-mono font-bold mt-0.5">CRYPTO BOUNDARIES VERIFIED</p>
        </div>
      </motion.div>

    </div>
  );
}
