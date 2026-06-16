'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface NavItemProps {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: string | number | null;
  collapsed?: boolean;
}

export default function NavItem({ href, label, icon, badge, collapsed = false }: NavItemProps) {
  const pathname = usePathname();
  // Check if current route matches exactly or starts with href (except root /guarding)
  const isActive = href === '/guarding' 
    ? pathname === '/guarding'
    : pathname === href || pathname?.startsWith(href);

  return (
    <Link href={href} className="no-underline block">
      <div 
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 cursor-pointer select-none group relative border ${
          isActive 
            ? 'border-white/20 text-white font-bold bg-white/[0.02]' 
            : 'border-transparent text-guardian-ash hover:text-white hover:bg-white/[0.02]'
        }`}
        title={collapsed ? label : undefined}
      >
        {/* Active background layout highlight animation */}
        {isActive && (
          <motion.div
            layoutId="activeNavBackground"
            className="absolute inset-0 bg-white/[0.04] border border-white/10 rounded-xl pointer-events-none z-0"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}

        {/* Icon wrapper */}
        <div className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-105 relative z-10 ${
          isActive ? 'text-white' : 'text-guardian-ash group-hover:text-white'
        }`}>
          {icon}
        </div>

        {/* Label (hidden in collapsed mode) */}
        {!collapsed && (
          <span className="text-xs font-sans tracking-wide whitespace-nowrap flex-grow relative z-10">
            {label}
          </span>
        )}

        {/* Badge (hidden in collapsed mode, displayed as small dot or number) */}
        {badge !== undefined && badge !== null && (
          collapsed ? (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full relative z-10" />
          ) : (
            <span className="bg-transparent text-[9px] font-mono text-white border border-white/20 px-1.5 py-0.5 rounded-full relative z-10">
              {badge}
            </span>
          )
        )}
        
        {/* Hover glow line replaced with clean white line */}
        {isActive && (
          <motion.div 
            layoutId="activeNavIndicator"
            className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-white rounded-r-full z-10"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </div>
    </Link>
  );
}
