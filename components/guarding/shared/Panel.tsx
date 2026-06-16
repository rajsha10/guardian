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
    surface: "bg-[#14161e] border border-guardian-pearl/10",
    elevated: "bg-[#090a0f] border border-guardian-pearl/10",
    dashed: "bg-transparent border border-dashed border-guardian-pearl/10"
  };

  return (
    <div className={`${baseStyle} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
