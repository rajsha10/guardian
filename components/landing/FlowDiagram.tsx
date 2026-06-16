// components/landing/FlowDiagram.tsx
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FlowDiagramProps {
  isActive: boolean;
}

const NODES = [
  { id: 'req', label: 'AI Request', icon: '🤖', glow: 'shadow-[0_0_12px_var(--color-primary-accent)] border-guardian-cyan/40' },
  { id: 'val', label: 'Validator Check', icon: '🛡️', glow: 'shadow-[0_0_12px_var(--color-primary-accent)] border-guardian-cyan/40' },
  { id: 'bld', label: 'Tx Builder', icon: '⚙️', glow: 'shadow-[0_0_12px_rgba(56,189,248,0.25)] border-guardian-slate/60' },
  { id: 'rly', label: 'Gasless Relay', icon: '⚡', glow: 'shadow-[0_0_12px_var(--color-primary-accent)] border-guardian-cyan/40' },
  { id: 'chn', label: 'On-Chain Execution', icon: '⛓️', glow: 'shadow-[0_0_18px_var(--color-primary-accent)] border-guardian-cyan/50' },
];

export default function FlowDiagram({ isActive }: FlowDiagramProps) {
  const [pulseIndex, setPulseIndex] = useState(-1);

  useEffect(() => {
    if (!isActive) {
      setPulseIndex(-1);
      return;
    }

    // Animate a looping beam/pulse from node 0 to 4
    const interval = setInterval(() => {
      setPulseIndex((prev) => {
        if (prev >= NODES.length - 1) return 0;
        return prev + 1;
      });
    }, 900);

    setPulseIndex(0);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="w-full max-w-[280px] sm:max-w-xs mx-auto flex flex-col items-center justify-center relative z-10 py-2">
      {/* Vertical Node Layout */}
      <div className="flex flex-col items-center w-full relative">
        {NODES.map((node, index) => {
          const isGlowing = pulseIndex === index || (node.id === 'chn' && pulseIndex === 4);
          
          return (
            <div
              key={node.id}
              className="flex flex-col items-center w-full relative"
            >
              {/* Node Card */}
              <motion.div
                animate={{
                  scale: isGlowing ? 1.03 : 1,
                  borderColor: isGlowing ? 'inherit' : 'rgba(5, 8, 22, 0.08)',
                }}
                className={`relative px-4 py-2.5 rounded-xl border flex items-center gap-3.5 z-10 w-full transition-all duration-500 backdrop-blur-md ${
                  node.id === 'chn' && isGlowing
                    ? 'bg-guardian-obsidian border-guardian-cyan/40 text-white shadow-[0_0_18px_rgba(0,245,212,0.3)]'
                    : `bg-slate-900 border-guardian-slate/40 text-guardian-pearl/75 shadow-sm ${isGlowing ? node.glow : ''}`
                }`}
              >
                <span className="text-sm shrink-0">{node.icon}</span>
                <span className="text-[11px] font-extrabold tracking-wide font-heading uppercase whitespace-nowrap">
                  {node.label}
                </span>

                {/* Ring Indicator */}
                {isGlowing && (
                  <span className="absolute -inset-[2px] rounded-xl border border-guardian-cyan/20 animate-ping opacity-60 pointer-events-none" />
                )}
              </motion.div>

              {/* Connecting vertical path indicator */}
              {index < NODES.length - 1 && (
                <div className="h-6 w-full relative flex items-center justify-center">
                  <div className="absolute top-0 bottom-0 w-[2px] bg-guardian-slate/20" />
                  
                  <svg className="w-4 h-full relative z-10" viewBox="0 0 16 24" fill="none">
                    {pulseIndex === index && (
                      <motion.circle
                        cx="8"
                        cy="-4"
                        r="2.5"
                        fill="var(--color-primary-accent)"
                        className="filter drop-shadow-[0_0_4px_var(--color-primary-accent)]"
                        animate={{ cy: [-4, 28] }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                      />
                    )}
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cinematic Ending Statement */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center text-center mt-6 select-none"
      >
        <div className="text-xl font-black font-heading leading-none tracking-tighter text-guardian-pearl flex flex-col gap-1">
          <span className="relative pb-0.5">
            AI got autonomy.
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-accent to-transparent opacity-85" />
          </span>
          <span className="text-guardian-ash mt-1.5 font-medium text-sm tracking-normal">
            Users kept control.
          </span>
        </div>
      </motion.div>
    </div>
  );
}
