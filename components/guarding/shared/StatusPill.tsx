'use client';

interface StatusPillProps {
  status: 'success' | 'warning' | 'info' | 'danger' | 'idle';
  label: string;
  className?: string;
}

export default function StatusPill({ status, label, className = '' }: StatusPillProps) {
  const styles = {
    success: "bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 shadow-[0_0_8px_rgba(0,230,118,0.15)]",
    warning: "bg-indigo-950/40 text-indigo-400 border border-indigo-800/60 shadow-[0_0_8px_rgba(123,97,255,0.15)]",
    info: "bg-sky-950/40 text-sky-400 border border-sky-800/60 shadow-[0_0_8px_rgba(0,245,212,0.15)]",
    danger: "bg-rose-950/40 text-rose-400 border border-rose-800/60 shadow-[0_0_8px_rgba(255,77,109,0.15)]",
    idle: "bg-slate-900/40 text-slate-500 border border-slate-800 shadow-none"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase select-none ${styles[status]} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'success' ? 'bg-emerald-400 animate-pulse' :
        status === 'warning' ? 'bg-indigo-400 animate-pulse' :
        status === 'info' ? 'bg-sky-400 animate-pulse' :
        status === 'danger' ? 'bg-rose-400 animate-ping' : 'bg-slate-500'
      }`} />
      {label}
    </span>
  );
}
