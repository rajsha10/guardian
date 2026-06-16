// components/landing/UnsafeScenario.tsx
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedNodes from './AnimatedNodes';

interface UnsafeScenarioProps {
  currentStep: number;
  incrementBlocked?: () => void;
}

export default function UnsafeScenario({ currentStep, incrementBlocked }: UnsafeScenarioProps) {
  useEffect(() => {
    if (currentStep === 3) {
      incrementBlocked?.();
    }
  }, [currentStep, incrementBlocked]);
  const isAlarmState = currentStep >= 2;

  return (
    <div className="w-full flex flex-col justify-start relative text-left py-6 select-none">
      
      {/* Unstable warning background glows */}
      <div className={`absolute top-[20%] right-[-20px] w-64 h-64 rounded-full pointer-events-none z-0 transition-colors duration-500 ${
        isAlarmState 
          ? 'bg-slate-900/[0.04] blur-[80px] animate-pulse'
          : 'bg-slate-900/[0.01] blur-[80px]'
      }`} />

      {/* Strong Unsafe Header Label */}
      <div className="flex flex-col items-start gap-1 relative z-10 mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2 shrink-0">
            {isAlarmState && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-guardian-crimson opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 transition-all duration-300 ${
              isAlarmState ? 'bg-guardian-crimson shadow-[0_0_8px_rgba(255,0,13,0.8)]' : 'bg-guardian-ash'
            }`}></span>
          </div>
          <h3 className="text-sm font-bold font-heading text-guardian-pearl uppercase tracking-wider leading-none">
            UNSAFE EXECUTION
          </h3>
        </div>
      </div>

      {/* Unstable Flowing Vertical Nodes */}
      <div className="relative z-10 w-full pl-2">
        <AnimatedNodes isSafe={false} currentStep={currentStep} />
      </div>

    </div>
  );
}
