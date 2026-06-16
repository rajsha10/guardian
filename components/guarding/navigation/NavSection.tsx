'use client';

interface NavSectionProps {
  label: string;
  collapsed?: boolean;
}

export default function NavSection({ label, collapsed = false }: NavSectionProps) {
  if (collapsed) {
    return (
      <div className="my-4 border-t border-guardian-slate/40 w-full" />
    );
  }

  return (
    <div className="mt-5 mb-2 px-3">
      <span className="text-[9px] font-bold tracking-[0.2em] font-mono text-guardian-ash uppercase">
        {label}
      </span>
    </div>
  );
}
