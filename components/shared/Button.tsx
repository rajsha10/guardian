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
    primary: 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold tracking-wide font-mono',
    secondary: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium',
    outline: 'bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white',
    ghost: 'bg-transparent hover:bg-slate-900/40 text-slate-400 hover:text-white border border-transparent',
    circle: 'rounded-full aspect-square border border-slate-400 hover:border-primary-accent text-slate-100 hover:text-primary-accent bg-transparent hover:scale-105 transition-transform'
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
