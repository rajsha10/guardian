'use client';

import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  badge?: ReactNode;
  className?: string;
}

export default function SectionHeader({ title, description, badge, className = '' }: SectionHeaderProps) {
  return (
    <div className={`mb-6 border-b border-guardian-pearl/40 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${className}`}>
      <div>
        <h1 className="text-2xl font-black tracking-tight text-guardian-pearl sm:text-3xl font-heading">
          {title}
        </h1>
        {description && (
          <p className="text-guardian-ash mt-1 text-xs sm:text-sm font-sans font-medium max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {badge && (
        <div className="flex-shrink-0 self-start sm:self-center">
          {badge}
        </div>
      )}
    </div>
  );
}
