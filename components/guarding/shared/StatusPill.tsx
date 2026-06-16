'use client';

interface StatusPillProps {
  status: 'success' | 'warning' | 'info' | 'danger' | 'idle';
  label: string;
  className?: string;
}

export default function StatusPill({ status, label, className = '' }: StatusPillProps) {
  const styles = {
    success: "bg-white/5 text-white border border-guardian-pearl/25",
    warning: "bg-white/5 text-white/80 border border-guardian-pearl/15",
    info: "bg-white/10 text-white border border-guardian-pearl/30",
    danger: "bg-white/5 text-white border border-guardian-pearl/40",
    idle: "bg-transparent text-white/40 border border-guardian-pearl/10"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase select-none ${styles[status]} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'success' ? 'bg-white animate-pulse' :
        status === 'warning' ? 'bg-white/80 animate-pulse' :
        status === 'info' ? 'bg-white' :
        status === 'danger' ? 'bg-white animate-ping' : 'bg-white/40'
      }`} />
      {label}
    </span>
  );
}
