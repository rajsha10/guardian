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
    <div className="w-full max-w-[320px] mx-auto flex flex-col gap-3.5 py-2">
      {STEPS.map((step, index) => {
        const isCompleted = activeStepIndex > index;
        const isCurrent = activeStepIndex === index;
        const isPending = activeStepIndex < index;

        return (
          <div key={step.id} className="relative flex items-start gap-4 w-full pr-14">
            {/* Connecting Vertical Line */}
            {index < STEPS.length - 1 && (
              <div className="absolute left-4 top-9 bottom-0 w-[2px] bg-slate-800/20 -translate-x-1/2 z-0">
                <motion.div
                  initial={{ height: '0%' }}
                  animate={{
                    height: isCompleted ? '100%' : isCurrent ? '50%' : '0%',
                  }}
                  transition={{ duration: 0.5 }}
                  className="bg-guardian-cyan w-full"
                />
              </div>
            )}

            {/* Step Icon Indicator */}
            <motion.div
            animate={{
              scale: isCurrent ? 1.1 : 1,
              borderColor: isCompleted
                ? 'var(--color-guardian-cyan)'
                : isCurrent
                ? 'var(--color-guardian-cyan)'
                : 'var(--color-guardian-slate)',
              backgroundColor: isCompleted
                ? 'var(--color-guardian-cyan-glow)'
                : isCurrent
                ? 'rgba(56, 189, 248, 0.05)'
                : 'var(--color-guardian-charcoal)',
            }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 font-mono text-xs font-bold shadow-sm"
            >
              {isCompleted ? (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-4.5 h-4.5 text-guardian-cyan"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>
              ) : isCurrent ? (
                <span className="text-guardian-cyan relative">
                  {step.id}
                  {/* Subtle breathing dot */}
                  <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-guardian-cyan rounded-full animate-ping" />
                </span>
              ) : (
                <span className="text-guardian-ash font-sans">{step.id}</span>
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
                    ? 'text-guardian-pearl/75'
                    : isCurrent
                    ? 'text-guardian-pearl'
                    : 'text-guardian-ash'
                }`}
              >
                {step.title}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-guardian-ash font-sans font-medium mt-0.5 leading-normal max-w-[170px]">
                {step.desc}
              </p>
            </motion.div>

            {/* Glowing Scanline for currently executing step */}
            {isCurrent && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.8, x: 0 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full border border-guardian-cyan/20 bg-slate-900 text-guardian-cyan font-mono text-[8px] font-bold tracking-[0.1em]"
              >
                CHECKING
              </motion.div>
            )}

            {isCompleted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full border border-guardian-cyan/20 bg-slate-900 text-guardian-cyan font-mono text-[8px] font-bold tracking-[0.1em]"
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
