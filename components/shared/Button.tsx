import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'circle';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none disabled:opacity-60 disabled:pointer-events-none rounded-full cursor-pointer';
  
  const variants = {
    primary: 'bg-gradient-to-r from-guardian-cyan to-guardian-cyan/80 hover:from-guardian-cyan/90 hover:to-guardian-cyan text-guardian-obsidian font-semibold tracking-wide font-mono shadow-md hover:shadow-cyan-500/20',
    secondary: 'bg-gradient-to-r from-guardian-platinum to-guardian-slate hover:from-guardian-slate hover:to-guardian-platinum text-guardian-pearl font-medium',
    outline: 'bg-transparent border border-guardian-slate hover:border-guardian-platinum text-guardian-ash hover:text-guardian-pearl',
    ghost: 'bg-transparent hover:bg-guardian-charcoal/40 text-guardian-ash hover:text-guardian-pearl border border-transparent',
    circle: 'rounded-full aspect-square border border-guardian-slate hover:border-guardian-cyan text-guardian-pearl hover:text-guardian-cyan bg-transparent hover:scale-105 transition-transform'
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
    xl: 'px-10 py-4 text-lg',
    icon: 'p-3 aspect-square'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${size === 'icon' ? '' : sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
