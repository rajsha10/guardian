'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

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
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none group relative ${
          isActive 
            ? 'bg-slate-900 text-[#050816] font-bold border border-[#050816]/10' 
            : 'text-slate-400 hover:text-[#050816] hover:bg-slate-900/40 border border-transparent'
        }`}
        title={collapsed ? label : undefined}
      >
        {/* Icon wrapper */}
        <div className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${
          isActive ? 'text-primary-accent' : 'text-slate-500 group-hover:text-primary-accent'
        }`}>
          {icon}
        </div>

        {/* Label (hidden in collapsed mode) */}
        {!collapsed && (
          <span className="text-xs font-sans tracking-wide whitespace-nowrap flex-grow">
            {label}
          </span>
        )}

        {/* Badge (hidden in collapsed mode, displayed as small dot or number) */}
        {badge !== undefined && badge !== null && (
          collapsed ? (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary-accent rounded-full animate-pulse" />
          ) : (
            <span className="bg-slate-950 text-[9px] font-mono text-primary-accent border border-primary-accent/20 px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )
        )}
        
        {/* Hover glow line */}
        {isActive && (
          <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-primary-accent rounded-r-full" />
        )}
      </div>
    </Link>
  );
}
