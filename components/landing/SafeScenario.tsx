// components/landing/SafeScenario.tsx
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedNodes from './AnimatedNodes';

interface SafeScenarioProps {
  currentStep: number;
  incrementSuccessful?: () => void;
  incrementRelayed?: () => void;
}

export default function SafeScenario({ currentStep, incrementSuccessful, incrementRelayed }: SafeScenarioProps) {
  useEffect(() => {
    if (currentStep === 3) {
      incrementSuccessful?.();
    } else if (currentStep === 5) {
      incrementRelayed?.();
    }
  }, [currentStep, incrementSuccessful, incrementRelayed]);
  return (
    <div className="w-full flex flex-col justify-start relative text-left py-6 select-none">
      
      {/* Dynamic Background Glow Layer */}
      <div className="absolute top-[20%] left-[-20px] w-64 h-64 rounded-full bg-slate-900/[0.02] blur-[80px] pointer-events-none z-0 animate-pulse" />

      {/* Strong Safe Header Label */}
      <div className="flex flex-col items-start gap-1 relative z-10 mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-guardian-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-guardian-cyan shadow-[0_0_8px_rgba(56,189,248,0.4)]"></span>
          </div>
          <h3 className="text-sm font-bold font-heading text-guardian-pearl uppercase tracking-wider leading-none">
            SAFE EXECUTION
          </h3>
        </div>
      </div>

      {/* Flowing Vertical Nodes (Whitespace generous) */}
      <div className="relative z-10 w-full pl-2">
        <AnimatedNodes isSafe={true} currentStep={currentStep} />
      </div>

    </div>
  );
}
