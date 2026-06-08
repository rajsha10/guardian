'use client';

import { useGuardingState } from '../GuardingContext';
import NavItem from '../navigation/NavItem';
import NavSection from '../navigation/NavSection';
import { motion } from 'framer-motion';

// Premium SVG Icons with 1.5 stroke width
const Icons = {
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
  ),
  DoubleArrowLeft: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
    </svg>
  ),
  DoubleArrowRight: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
    </svg>
  )
};

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, smartAccount, sessionAddress } = useGuardingState();

  const handleToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 70 : 250 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-screen border-r border-[#050816]/10 bg-slate-950 flex-shrink-0 select-none overflow-hidden relative z-30"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#050816]/10">
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-6 rounded-lg bg-[#050816] flex items-center justify-center text-primary-accent font-heading font-black text-sm shadow-[0_0_8px_rgba(0,245,212,0.3)]">
              G
            </div>
            <span className="text-sm font-black font-heading tracking-tight text-[#050816] uppercase">
              DelegAI Guardian
            </span>
          </motion.div>
        )}
        {sidebarCollapsed && (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-[#050816] flex items-center justify-center text-primary-accent font-heading font-black text-lg shadow-[0_0_8px_rgba(0,245,212,0.3)]">
              G
            </div>
          </div>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        <NavSection label="Security Center" collapsed={sidebarCollapsed} />
        
        <NavItem 
          href="/guarding/dashboard" 
          label="Mission Control" 
          icon={Icons.Dashboard} 
          collapsed={sidebarCollapsed} 
        />
        <NavItem 
          href="/guarding/permissions" 
          label="Permission Caveats" 
          icon={Icons.Permissions} 
          collapsed={sidebarCollapsed} 
          badge={smartAccount ? 'Active' : null}
        />
        <NavItem 
          href="/guarding/sessions" 
          label="Session Keys" 
          icon={Icons.Sessions} 
          collapsed={sidebarCollapsed}
          badge={sessionAddress ? 'Ready' : null}
        />

        <NavSection label="Automation Suite" collapsed={sidebarCollapsed} />
        
        <NavItem 
          href="/guarding/simulator" 
          label="Security Simulator" 
          icon={Icons.Simulation} 
          collapsed={sidebarCollapsed} 
        />
        <NavItem 
          href="/guarding/transactions" 
          label="Transaction Relayer" 
          icon={Icons.Transactions} 
          collapsed={sidebarCollapsed} 
        />

        <NavSection label="System Configuration" collapsed={sidebarCollapsed} />
        
        <NavItem 
          href="/guarding/settings" 
          label="Developer Settings" 
          icon={Icons.Settings} 
          collapsed={sidebarCollapsed} 
        />
      </div>

      {/* Footer / Toggle Button */}
      <div className="p-3 border-t border-[#050816]/10 flex items-center justify-center">
        <button
          onClick={handleToggle}
          className="w-full py-2 hover:bg-[#050816]/5 rounded-xl border border-transparent hover:border-[#050816]/10 text-slate-500 hover:text-[#050816] flex items-center justify-center transition-all cursor-pointer"
        >
          {sidebarCollapsed ? Icons.DoubleArrowRight : Icons.DoubleArrowLeft}
        </button>
      </div>
    </motion.aside>
  );
}
