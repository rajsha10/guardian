'use client';

import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AmbientBackground from './AmbientBackground';
import RobotAssistant from '../shared/RobotAssistant';
import Panel from '../shared/Panel';
import { useGuardingState } from '../GuardingContext';
import NavItem from '../navigation/NavItem';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

// Icons for mobile navigation
const MobileMenuIcons = {
  Close: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Dashboard: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  Permissions: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  Sessions: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  ),
  Transactions: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  ),
  Simulation: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
    </svg>
  ),
  Settings: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.59 4.59A2 2 0 1111 8H2.25a2.25 2.25 0 01-2.25-2.25v-.518c0-.074.006-.148.017-.22a2.25 2.25 0 012.233-2.012h8.09zM14 11V2.25A2.25 2.25 0 0116.25 0h.518c.074 0 .148.006.22.017a2.25 2.25 0 012.012 2.233v8.09H14zM2.25 14H11a2 2 0 11-1.41 3.41L1.5 21V16.25A2.25 2.25 0 013.75 14h-.5zM14 13h6.25a2.25 2.25 0 012.25 2.25v.518c0 .074-.006.148-.017.22a2.25 2.25 0 01-2.233 2.012H14v-5z" />
    </svg>
  )
};

export default function GuardianShell({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { smartAccountAddress, sessionAddress, delegationRules, activeContextId, metrics, balances, recentTxs } = useGuardingState();

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden relative text-guardian-pearl bg-guardian-obsidian">
      {/* Background Layer */}
      <AmbientBackground />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileSidebar}
              className="md:hidden fixed inset-0 bg-black z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 bottom-0 left-0 w-[270px] bg-slate-950 border-r border-guardian-slate/40 z-50 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-guardian-charcoal flex items-center justify-center text-white border border-white/10 font-heading font-black text-sm">
                      G
                    </div>
                    <span className="text-sm font-black font-heading tracking-tight text-guardian-pearl uppercase">
                      Guardian
                    </span>
                  </div>
                  <button onClick={toggleMobileSidebar} className="text-guardian-ash hover:text-guardian-pearl cursor-pointer">
                    {MobileMenuIcons.Close}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="text-[9px] font-bold tracking-[0.2em] font-mono text-guardian-ash uppercase">
                    Security Center
                  </div>
                  <div className="space-y-1" onClick={toggleMobileSidebar}>
                    <NavItem href="/guarding/dashboard" label="Mission Control" icon={MobileMenuIcons.Dashboard} />
                    <NavItem href="/guarding/permissions" label="Permission Caveats" icon={MobileMenuIcons.Permissions} />
                    <NavItem href="/guarding/sessions" label="Session Keys" icon={MobileMenuIcons.Sessions} />
                  </div>

                  <div className="text-[9px] font-bold tracking-[0.2em] font-mono text-guardian-ash uppercase mt-6">
                    Automation Suite
                  </div>
                  <div className="space-y-1" onClick={toggleMobileSidebar}>
                    <NavItem href="/guarding/simulator" label="Security Simulator" icon={MobileMenuIcons.Simulation} />
                    <NavItem href="/guarding/transactions" label="Transaction Relayer" icon={MobileMenuIcons.Transactions} />
                  </div>

                  <div className="text-[9px] font-bold tracking-[0.2em] font-mono text-guardian-ash uppercase mt-6">
                    System Configuration
                  </div>
                  <div className="space-y-1" onClick={toggleMobileSidebar}>
                    <NavItem href="/guarding/settings" label="Developer Settings" icon={MobileMenuIcons.Settings} />
                  </div>
                </div>
              </div>

              <div className="text-[9px] font-mono text-guardian-ash text-center">
                DelegAI Shield System v0.1.0
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Core Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10">
        <Topbar onToggleMobileSidebar={toggleMobileSidebar} />

        {/* Content & Right Monitor Split */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 w-full overflow-hidden">

          {/* Main Dashboard Pages (Left scrollable area) */}
          <main className="flex-1 overflow-y-auto px-6 py-8 relative">
            <div className="max-w-4xl mx-auto w-full">
              {/* Live Local Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 font-mono">
                <div className="bg-slate-950 p-4 rounded-xl border border-guardian-pearl/15">
                  <div className="text-[10px] text-guardian-ash uppercase font-bold tracking-wider">AI Decisions</div>
                  <div className="text-2xl font-bold text-white mt-1">{metrics.aiDecisions}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-guardian-pearl/15">
                  <div className="text-[10px] text-guardian-ash uppercase font-bold tracking-wider">Approved Actions</div>
                  <div className="text-2xl font-bold text-white mt-1">{metrics.successfulTxs}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-guardian-pearl/15">
                  <div className="text-[10px] text-guardian-ash uppercase font-bold tracking-wider">Blocked Actions</div>
                  <div className="text-2xl font-bold text-white mt-1">{metrics.blockedExecutions}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-guardian-pearl/15">
                  <div className="text-[10px] text-guardian-ash uppercase font-bold tracking-wider">Gasless Relays</div>
                  <div className="text-2xl font-bold text-white mt-1">{metrics.relayedTxs}</div>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          {/* Right Status Monitor Panel (Desktop only, command center visualizer) */}
          <section className="hidden lg:flex w-[310px] xl:w-[340px] border-l border-guardian-slate/40 bg-[#000612] backdrop-blur-md flex-col p-6 overflow-y-auto space-y-6 flex-shrink-0 relative z-20">

            {/* Panel Heading */}
            <div className="border-b border-guardian-slate/40 pb-4">
              <span className="text-[9px] font-bold tracking-[0.2em] font-mono text-guardian-ash uppercase block">
                Command Shield
              </span>
              <h3 className="text-sm font-bold text-guardian-pearl mt-0.5 font-heading uppercase tracking-wide">
                AI Agent Observer
              </h3>
            </div>

            {/* Persistent Robot Widget Mount */}
            <div className="py-2">
              <RobotAssistant />
            </div>

            {/* Shield Parameters Ledger */}
            <Panel variant="elevated" className="p-4 space-y-3.5 select-none font-mono text-[10px] bg-slate-900/50 border border-white/5">
              <div className="text-[9px] font-bold uppercase text-guardian-pearl/70 border-b border-white/10 pb-1.5 flex justify-between">
                <span>Cryptographic Context</span>
                <span className="text-white/70 font-bold">● Active</span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <span className="text-guardian-ash block">SMART ACCOUNT (ERC-4337)</span>
                  <span className="text-guardian-pearl break-all block text-[9.5px]">
                    {smartAccountAddress ? smartAccountAddress : 'Awaiting initialization...'}
                  </span>
                  {smartAccountAddress && (
                    <span className="text-guardian-ash block text-[8.5px] mt-1">
                      ETH Balance: {balances.smartAccountETH || '0.0000'} | USDC Balance: {balances.smartAccountUSDC !== null ? `${balances.smartAccountUSDC.toFixed(2)} USDC` : '0.00 USDC'}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-guardian-ash block">SESSION SIGNER (EOA)</span>
                  <span className="text-guardian-pearl break-all block text-[9.5px]">
                    {sessionAddress ? sessionAddress : 'Not generated'}
                  </span>
                  {sessionAddress && (
                    <span className="text-guardian-ash block text-[8.5px] mt-1">
                      ETH Balance: {balances.sessionETH || '0.0000'}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-guardian-ash block">ACTIVE BOUNDARIES (RULES)</span>
                  {delegationRules ? (
                    <div className="mt-1 space-y-0.5 text-guardian-ash bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                      <div>Limit: {delegationRules.spendLimit} USDC</div>
                      <div className="truncate">Whitelisted: {delegationRules.allowedAddress}</div>
                      <div>Lifecycle: {delegationRules.expiryDays} Days</div>
                    </div>
                  ) : (
                    <span className="text-guardian-ash block">No rules registered</span>
                  )}
                </div>

                <div>
                  <span className="text-guardian-ash block">ERC-7715 CONTEXT HASH</span>
                  <span className="text-guardian-pearl break-all block text-[9.5px] truncate">
                    {activeContextId ? activeContextId : 'Awaiting signature'}
                  </span>
                </div>

                <div>
                  <span className="text-guardian-ash block">ACTIVE NETWORK</span>
                  <span className="text-guardian-pearl block text-[9.5px]">
                    Ethereum Sepolia Testnet (ID: 11155111)
                  </span>
                </div>
              </div>
            </Panel>

            {/* Recent Transactions Panel */}
            <Panel variant="elevated" className="p-4 space-y-3 select-none font-mono text-[10px] bg-slate-900/50 border border-white/5">
              <div className="text-[9px] font-bold uppercase text-guardian-pearl/70 border-b border-white/10 pb-1.5 flex justify-between">
                <span>Recent Transactions</span>
                <span className="text-white/50">● History</span>
              </div>
              {recentTxs && recentTxs.length > 0 ? (
                <div className="space-y-3.5 divide-y divide-white/5 max-h-[220px] overflow-y-auto pr-1">
                  {recentTxs.map((tx, idx) => (
                    <div key={tx.hash} className={`pt-2 ${idx === 0 ? 'pt-0' : ''} space-y-1`}>
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="text-white font-bold uppercase tracking-wide">✓ Relayed</span>
                        <span className="text-guardian-ash text-[8px]">{tx.timestamp}</span>
                      </div>
                      <div className="text-guardian-ash/90">
                        <span className="text-guardian-ash">Value:</span> {tx.amount} {tx.tokenSymbol}
                      </div>
                      <div className="text-guardian-ash/90 truncate">
                        <span className="text-guardian-ash">To:</span> {tx.target}
                      </div>
                      <div className="flex justify-between items-center text-[8.5px] pt-0.5">
                        <a
                          href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/70 hover:text-white underline font-semibold cursor-pointer"
                        >
                          View on Explorer
                        </a>
                        <span className="text-guardian-ash/80 select-all">
                          {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-guardian-ash italic py-1 text-center">
                  No transaction history recorded.
                </div>
              )}
            </Panel>

            {/* System logs tickers */}
            <div className="flex-1 flex flex-col justify-end text-[9px] font-mono text-guardian-ash space-y-1">
              <div className="flex justify-between border-t border-white/10 pt-2">
                <span>MEM INTEGRITY</span>
                <span className="text-white/70">100% SECURE</span>
              </div>
              <div className="flex justify-between">
                <span>GAS RELAY</span>
                <span className="text-white/70">PIPELINE READY</span>
              </div>
              <div className="flex justify-between">
                <span>SEPOLIA BLOCK</span>
                <span className="text-white">11155111-SEPOLIA</span>
              </div>
            </div>

          </section>

        </div>
      </div>
    </div>
  );
}
