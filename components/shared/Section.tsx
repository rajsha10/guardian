import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export default function Section({
  children,
  containerSize = 'lg',
  className = '',
  ...props
}: SectionProps) {
  const containerClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <section className={`w-full py-16 md:py-24 px-4 md:px-8 ${className}`} {...props}>
      <div className={`mx-auto ${containerClasses[containerSize]}`}>
        {children}
      </div>
    </section>
  );
}
