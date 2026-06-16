// components/landing/AnimatedNodes.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface NodeData {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

interface AnimatedNodesProps {
  isSafe: boolean;
  currentStep: number;
}

export default function AnimatedNodes({ isSafe, currentStep }: AnimatedNodesProps) {
  // Define vertical node list
  const safeNodes: NodeData[] = [
    {
      id: 0,
      title: 'Intent Decoded',
      subtitle: '"Move 50 USDC to savings"',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      id: 1,
      title: 'AI Action Formed',
      subtitle: 'transfer(Savings, 50 USDC)',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Constraints Check',
      subtitle: 'Validating limits & whitelist',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'Permissions Validated',
      subtitle: 'Session signature approved',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: 'Relay Broadcast',
      subtitle: 'Gasless execution live',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 5,
      title: 'Success',
      subtitle: 'Tokens safely deposited',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
  ];

  const unsafeNodes: NodeData[] = [
    {
      id: 0,
      title: 'Threat Intent Decoded',
      subtitle: '"Send 5000 USDC"',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      id: 1,
      title: 'Unsafe AI Action Mapped',
      subtitle: 'transfer(0xUnknown, 5000 USDC)',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Constraints Check',
      subtitle: 'Exceeds limit & forbidden target',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'Intrusion Blocked',
      subtitle: 'Execution vector insulated',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
    },
    {
      id: 4,
      title: 'Protected Funds',
      subtitle: 'Custody remains completely safe',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  const targetNodes = isSafe ? safeNodes : unsafeNodes;

  return (
    <div className="relative w-full flex flex-col items-start select-none py-4">
      
      {/* 1. Unified vertical track connector (aligned exactly to 24px center of w-12 column) */}
      <div className="absolute left-[24px] top-6 bottom-6 w-[2px] bg-slate-800/10 z-[-10] overflow-hidden -translate-x-1/2">
        
        {/* Active connection line overlay */}
        {isSafe ? (
          <motion.div
            initial={{ height: '0%' }}
            animate={{
              height: `${(Math.min(currentStep, 5) / 5) * 100}%`,
            }}
            className="w-full bg-guardian-cyan"
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ) : (
          <motion.div
            initial={{ height: '0%' }}
            animate={{
              height: `${(Math.min(currentStep, 2) / 4) * 100}%`, // Stops at validator (node index 2)
            }}
            className="w-full bg-slate-400"
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}

        {/* Broken connection indicator for Unsafe Side */}
        {!isSafe && currentStep >= 3 && (
          <div className="absolute top-[50%] bottom-0 w-full bg-gradient-to-b from-slate-400/20 via-transparent to-transparent border-t border-dashed border-slate-500/50" />
        )}
      </div>

      {/* 2. Flowing Particles (aligned exactly to 24px center) */}
      <AnimatePresence>
        {isSafe && currentStep > 0 && currentStep < 5 && (
          <motion.div
            key="safe-particle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            className="absolute left-[24px] w-2 h-2 rounded-full bg-guardian-cyan shadow-[0_0_10px_rgba(56,189,248,0.4)] z-10 -translate-x-1/2"
            style={{
              top: `${16 + (currentStep - 1) * 16}%`, // Interpolates progress
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />
        )}

        {!isSafe && currentStep > 0 && currentStep < 3 && (
          <motion.div
            key="unsafe-particle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            className="absolute left-[24px] w-2 h-2 rounded-full bg-slate-400 shadow-[0_0_8px_rgba(5,8,22,0.15)] z-10 -translate-x-1/2"
            style={{
              top: `${16 + (currentStep - 1) * 22}%`, // Interpolates progress
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />
        )}
      </AnimatePresence>

      {/* 3. Node list */}
      <div className="flex flex-col gap-12 relative z-10 w-full">
        {targetNodes.map((node, index) => {
          const isActive = currentStep === node.id;
          const isCompleted = currentStep > node.id;
          const isFailed = !isSafe && node.id >= 3 && currentStep >= 3;
          
          let borderClass = 'border-guardian-slate/40 bg-guardian-charcoal';
          let iconColor = 'text-guardian-ash/90';
          let glowColor = '';
          
          if (isActive) {
            borderClass = isSafe ? 'border-guardian-cyan bg-guardian-charcoal' : 'border-guardian-crimson bg-guardian-charcoal';
            iconColor = isSafe ? 'text-guardian-cyan' : 'text-guardian-crimson animate-pulse';
            glowColor = isSafe ? 'shadow-[0_0_12px_rgba(56,189,248,0.25)]' : 'shadow-[0_0_12px_rgba(255,0,13,0.15)]';
          } else if (isCompleted && !isFailed) {
            borderClass = isSafe ? 'border-guardian-cyan bg-guardian-cyan' : 'border-guardian-crimson bg-guardian-crimson';
            iconColor = 'text-guardian-obsidian font-bold';
          } else if (isFailed) {
            borderClass = 'border-guardian-slate/20 bg-guardian-obsidian opacity-40';
            iconColor = 'text-guardian-ash/90';
          }

          // Trigger collision feedback at node 2 (Validator) in unsafe path at step 3
          const isCollision = !isSafe && node.id === 2 && currentStep >= 3;

          return (
            <div key={node.id} className="flex items-center gap-6 text-left relative w-full">
              
              {/* Column 1: Centered Circle & Wave Container */}
              <div className="w-12 h-12 flex justify-center items-center shrink-0 z-10 relative">
                
                {/* Outer visual aura/waves for active nodes */}
                {isActive && (
                  <motion.div
                    layoutId={isSafe ? 'safe-wave' : 'unsafe-wave'}
                    className={`absolute w-14 h-14 rounded-full border ${
                      isSafe ? 'border-guardian-slate/60 bg-guardian-charcoal/40' : 'border-slate-400/20 bg-slate-400/5'
                    } z-0`}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Constraint Collision visual overlay at unsafe validator */}
                {isCollision && (
                  <motion.div
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute w-14 h-14 rounded-full bg-guardian-obsidian0/10 z-0 border border-slate-400/40"
                  />
                )}

                {/* Node Circle */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.08 : 1,
                    borderColor: isCollision ? 'var(--color-guardian-crimson)' : undefined,
                    backgroundColor: isCollision ? 'var(--color-guardian-charcoal)' : undefined,
                  }}
                  className={`w-10 h-10 md:w-11 md:h-11 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${borderClass} ${glowColor}`}
                >
                  <div className={iconColor}>
                    {node.icon}
                  </div>
                </motion.div>

              </div>

              {/* Column 2: Text HUD Overlay */}
              <div className={`flex flex-col justify-center transition-all duration-300 ${
                isFailed ? 'opacity-30' : 'opacity-100'
              }`}>
                <h4 className={`text-xs md:text-sm font-extrabold font-heading tracking-tight ${
                  isActive
                    ? isSafe ? 'text-guardian-cyan' : 'text-guardian-crimson'
                    : isCompleted && !isFailed
                    ? 'text-guardian-pearl/75 font-bold'
                    : 'text-guardian-ash'
                }`}>
                  {node.title}
                </h4>
                <p className="text-[10px] md:text-xs text-guardian-ash font-mono mt-0.5 max-w-[180px] md:max-w-xs truncate">
                  {node.subtitle}
                </p>
              </div>

              {/* Dynamic Mini Pass/Fail HUD Badges */}
              <AnimatePresence>
                {isCompleted && node.id === 2 && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`absolute right-[-40px] md:right-[-60px] top-1/2 -translate-y-1/2 text-[7px] font-mono font-bold tracking-widest px-2 py-0.5 rounded border ${
                      isSafe
                        ? 'bg-guardian-cyan/15 text-guardian-cyan border-guardian-cyan/30'
                        : 'bg-slate-950/5 text-slate-600 border-slate-500/20'
                    }`}
                  >
                    {isSafe ? 'PASS' : 'FAIL'}
                  </motion.span>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>

    </div>
  );
}
