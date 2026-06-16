// components/landing/ValidatorSteps.tsx
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ValidatorStepsProps {
  isActive: boolean;
}

const STEPS = [
  { id: 1, title: 'Check Limits', desc: 'Validating requested transaction volume against session caps' },
  { id: 2, title: 'Verify Destination', desc: 'Checking target address against whitelisted contract registries' },
  { id: 3, title: 'Confirm Permissions', desc: 'Verifying session key signature and allowed method scopes' },
  { id: 4, title: 'Validate Expiry', desc: 'Confirming session state is active and non-expired' },
  { id: 5, title: 'Approve Execution', desc: 'Signing transaction payload for gasless relay broadcast' },
];

export default function ValidatorSteps({ isActive }: ValidatorStepsProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(-1);

  useEffect(() => {
    if (!isActive) {
      setActiveStepIndex(-1);
      return;
    }

    // Trigger step animations sequentially
    const timeouts: NodeJS.Timeout[] = [];
    STEPS.forEach((_, index) => {
      const t = setTimeout(() => {
        setActiveStepIndex(index);
      }, (index + 1) * 800); // 800ms per step
      timeouts.push(t);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isActive]);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6 py-4">
      {STEPS.map((step, index) => {
        const isCompleted = activeStepIndex > index;
        const isCurrent = activeStepIndex === index;
        const isPending = activeStepIndex < index;

        return (
          <div key={step.id} className="relative flex items-start gap-4">
            {/* Connecting Vertical Line */}
            {index < STEPS.length - 1 && (
              <div className="absolute left-4 top-9 bottom-0 w-[2px] bg-slate-800/20 -translate-x-1/2 z-0">
                <motion.div
                  initial={{ height: '0%' }}
                  animate={{
                    height: isCompleted ? '100%' : isCurrent ? '50%' : '0%',
                  }}
                  transition={{ duration: 0.5 }}
                  className="bg-primary-accent w-full"
                />
              </div>
            )}

            {/* Step Icon Indicator */}
            <motion.div
              animate={{
                scale: isCurrent ? 1.1 : 1,
                borderColor: isCompleted
                  ? '#00F5D4'
                  : isCurrent
                  ? '#00F5D4'
                  : 'rgba(5, 8, 22, 0.15)',
                backgroundColor: isCompleted
                  ? 'rgba(0, 245, 212, 0.1)'
                  : isCurrent
                  ? 'rgba(0, 245, 212, 0.05)'
                  : 'rgba(255, 255, 255, 0.6)',
              }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 font-mono text-xs font-bold shadow-sm"
            >
              {isCompleted ? (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-4.5 h-4.5 text-primary-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>
              ) : isCurrent ? (
                <span className="text-primary-accent relative">
                  {step.id}
                  {/* Subtle breathing dot */}
                  <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-primary-accent rounded-full animate-ping" />
                </span>
              ) : (
                <span className="text-slate-400 font-sans">{step.id}</span>
              )}
            </motion.div>

            {/* Step Info */}
            <motion.div
              animate={{
                opacity: isPending ? 0.45 : 1,
                x: isCurrent ? 4 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="flex flex-col text-left"
            >
              <h4
                className={`text-xs sm:text-sm font-bold font-heading leading-tight transition-colors duration-300 ${
                  isCompleted
                    ? 'text-[#050816]/75'
                    : isCurrent
                    ? 'text-[#050816]'
                    : 'text-slate-500'
                }`}
              >
                {step.title}
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-400 font-sans font-medium mt-0.5 leading-relaxed max-w-[280px]">
                {step.desc}
              </p>
            </motion.div>

            {/* Glowing Scanline for currently executing step */}
            {isCurrent && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.8, x: 0 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full border border-primary-accent/20 bg-slate-900 text-primary-accent font-mono text-[8px] font-bold tracking-[0.1em]"
              >
                CHECKING
              </motion.div>
            )}

            {isCompleted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full border border-primary-accent/20 bg-slate-900 text-primary-accent font-mono text-[8px] font-bold tracking-[0.1em]"
              >
                PASS
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}
