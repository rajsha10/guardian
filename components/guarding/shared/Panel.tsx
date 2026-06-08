'use client';

import { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  className?: string;
  variant?: 'surface' | 'elevated' | 'dashed';
}

export default function Panel({ children, className = '', variant = 'surface' }: PanelProps) {
  const baseStyle = "rounded-xl p-6 shadow-xl transition-all duration-300 backdrop-blur-md";
  
  const variantStyles = {
    surface: "bg-slate-900 border border-slate-800",
    elevated: "bg-slate-950 border border-slate-800",
    dashed: "bg-slate-900/40 border border-dashed border-slate-800"
  };

  return (
    <div className={`${baseStyle} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
