// components/landing/HorizontalScroller.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, animate } from 'framer-motion';
import ConstraintCards from './ConstraintCards';
import ValidatorSteps from './ValidatorSteps';
import FlowDiagram from './FlowDiagram';
import DelegationFlow from './DelegationFlow';
import FloatingTags from './FloatingTags';
import AmbientBackground from './AmbientBackground';
import PersistentRobot from './PersistentRobot';
import AnimatedConnection from './AnimatedConnection';

export default function HorizontalScroller() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);
  const isSnappingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [activePanel, setActivePanel] = useState(0);

  // Track the vertical scroll of the parent container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Reactive state hook to detect active panel index (0 to 4)
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const index = Math.min(Math.max(Math.round(latest * 4), 0), 4);
    if (index !== activePanel) {
      setActivePanel(index);
    }
  });

  // Handle user interruptions (stop snapping if user scrolls or touches screen)
  useEffect(() => {
    const stopSnapping = () => {
      if (isSnappingRef.current && animationRef.current) {
        animationRef.current.stop();
        isSnappingRef.current = false;
      }
    };

    window.addEventListener('wheel', stopSnapping, { passive: true });
    window.addEventListener('touchmove', stopSnapping, { passive: true });
    window.addEventListener('mousedown', stopSnapping, { passive: true });

    return () => {
      window.removeEventListener('wheel', stopSnapping);
      window.removeEventListener('touchmove', stopSnapping);
      window.removeEventListener('mousedown', stopSnapping);
    };
  }, []);

  // Handle vertical scroll snapping when user stops scrolling
  useEffect(() => {
    const handleScrollSnap = () => {
      if (!containerRef.current) return;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      if (isSnappingRef.current) return;

      scrollTimeoutRef.current = setTimeout(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const scrollStart = window.scrollY + rect.top;
        const scrollEnd = scrollStart + container.offsetHeight - window.innerHeight;
        const currentScroll = window.scrollY;

        // Snapping threshold buffer
        const buffer = 40;
        if (currentScroll >= scrollStart + buffer && currentScroll <= scrollEnd - buffer) {
          const totalHeight = scrollEnd - scrollStart;
          const progress = (currentScroll - scrollStart) / totalHeight;
          const nearestIndex = Math.min(Math.max(Math.round(progress * 4), 0), 4);
          const targetScrollY = scrollStart + (nearestIndex / 4) * totalHeight;

          if (Math.abs(currentScroll - targetScrollY) > 8) {
            isSnappingRef.current = true;

            const scrollObj = { y: currentScroll };
            animationRef.current = animate(scrollObj.y, targetScrollY, {
              type: 'spring',
              damping: 35,
              stiffness: 160,
              mass: 0.9,
              onUpdate: (latest) => {
                window.scrollTo(0, latest);
              },
              onComplete: () => {
                isSnappingRef.current = false;
              },
              onStop: () => {
                isSnappingRef.current = false;
              },
            });
          }
        }
      }, 250); // Snaps 250ms after scroll events stop
    };

    window.addEventListener('scroll', handleScrollSnap, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollSnap);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Cinematic content transition variants
  const panelVariants = {
    initial: {
      opacity: 0,
      scale: 0.97,
      filter: 'blur(6px)',
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: 'easeInOut' as const,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      filter: 'blur(6px)',
      transition: {
        duration: 0.4,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-transparent">
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center bg-[#F4F4F4] select-none">
        
        {/* Continuous Background Layer */}
        <AmbientBackground activePanel={activePanel} />

        {/* Curved connections for Panel 1 bridging text -> flow -> robot (Desktop only) */}
        <AnimatePresence>
          {activePanel === 0 && (
            <motion.div
              key="panel-1-connections"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 pointer-events-none z-10"
            >
              <AnimatedConnection type="left-to-center" />
              <AnimatedConnection type="center-to-right" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Three Column Grid Container */}
        <div className="relative w-full max-w-7xl h-full mx-auto px-6 sm:px-12 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 z-10 py-12 lg:py-0">
          
          {/* LEFT/CENTER COLUMN CONTENT WRAPPER: Fade-dissolving progressive layouts */}
          <div className="w-full lg:w-[58vw] h-full flex flex-col justify-center relative">
            <AnimatePresence mode="wait">
              
              {/* PANEL 1: Permissioned AI Autonomy */}
              {activePanel === 0 && (
                <motion.div
                  key="panel-1"
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 lg:gap-8 text-left"
                >
                  <div className="w-full lg:w-[48%] flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-semibold font-mono tracking-[0.2em] text-[#050816]/60 uppercase">
                        STEP 01
                      </span>
                      <div className="w-8 h-[1px] bg-[#050816]/20" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold font-heading leading-[0.9] tracking-tighter text-[#050816] mb-4 select-none">
                      <span className="block">Permissioned</span>
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
                        AI Autonomy
                      </span>
                    </h2>
                    <p className="text-xs sm:text-[13px] text-slate-400 font-sans font-semibold leading-relaxed tracking-wide mb-6">
                      DelegAI enables autonomous financial execution through permission-scoped AI agents protected by cryptographic safety boundaries.
                    </p>
                    <FloatingTags />
                  </div>
                  <div className="w-full lg:w-[48%] flex items-center justify-center">
                    <DelegationFlow />
                  </div>
                </motion.div>
              )}

              {/* PANEL 2: Create Safe Boundaries */}
              {activePanel === 1 && (
                <motion.div
                  key="panel-2"
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 lg:gap-8 text-left"
                >
                  <div className="w-full lg:w-[48%] flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-semibold font-mono tracking-[0.2em] text-[#050816]/60 uppercase">
                        STEP 02
                      </span>
                      <div className="w-8 h-[1px] bg-[#050816]/20" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold font-heading leading-[0.9] tracking-tighter text-[#050816] mb-4 select-none">
                      <span className="block">Create Safe</span>
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
                        Boundaries
                      </span>
                    </h2>
                    <p className="text-xs sm:text-[13px] text-slate-400 font-sans font-semibold leading-relaxed tracking-wide">
                      Users generate delegated session accounts with cryptographic constraints that define exactly what AI is allowed to do.
                    </p>
                  </div>
                  <div className="w-full lg:w-[48%] flex items-center justify-center">
                    <ConstraintCards isActive={activePanel === 1} />
                  </div>
                </motion.div>
              )}

              {/* PANEL 3: AI Makes Decisions */}
              {activePanel === 2 && (
                <motion.div
                  key="panel-3"
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 lg:gap-8 text-left"
                >
                  <div className="w-full lg:w-[48%] flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-semibold font-mono tracking-[0.2em] text-[#050816]/60 uppercase">
                        STEP 03
                      </span>
                      <div className="w-8 h-[1px] bg-[#050816]/20" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold font-heading leading-[0.9] tracking-tighter text-[#050816] mb-4 select-none">
                      <span className="block">AI Makes</span>
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
                        Decisions
                      </span>
                    </h2>
                    <p className="text-xs sm:text-[13px] text-slate-400 font-sans font-semibold leading-relaxed tracking-wide">
                      Users provide natural language instructions while the AI converts them into structured financial actions.
                    </p>
                  </div>
                  <div className="w-full lg:w-[48%] flex items-center justify-center">
                    <div className="w-full max-w-sm flex flex-col gap-3 relative z-10">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-slate-900 border border-slate-800/20 p-3.5 rounded-xl flex flex-col items-start gap-1 relative backdrop-blur-md"
                      >
                        <span className="text-[8px] font-black font-mono tracking-widest text-[#050816]/50 uppercase">USER NATURAL INPUT</span>
                        <p className="text-xs font-bold text-[#050816] font-sans">
                          "Move 50 USDC to savings"
                        </p>
                        <div className="absolute right-4 top-4 flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-accent animate-pulse" />
                          <span className="text-[8px] font-mono font-bold tracking-[0.1em] text-slate-500">PROMPTED</span>
                        </div>
                      </motion.div>

                      <div className="flex justify-center items-center w-full py-0.5">
                        <motion.div
                          animate={{ y: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="p-1 bg-slate-950/40 rounded-full border border-slate-800/10"
                        >
                          <svg className="w-4 h-4 text-primary-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-slate-950 border border-[#050816]/8 p-3.5 rounded-xl flex flex-col gap-2 relative backdrop-blur-lg"
                      >
                        <div className="flex items-center justify-between border-b border-[#050816]/5 pb-1.5">
                          <span className="text-[8px] font-black font-mono tracking-widest text-[#050816]/50 uppercase">STRUCTURED DELEGATION ACTIONS</span>
                          <span className="text-[8px] font-mono font-bold tracking-[0.1em] text-[#050816]/75 border border-[#050816]/10 bg-slate-900 px-2 py-0.5 rounded-full">
                            RESOLVED
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-left">
                          <div className="flex flex-col">
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Amount</span>
                            <span className="text-xs font-black text-[#050816] mt-0.5 font-heading">50 USDC</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Action</span>
                            <span className="text-xs font-extrabold text-[#050816] mt-0.5 font-heading">Transfer</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Destination</span>
                            <span className="text-xs font-black text-[#050816] mt-0.5 font-heading truncate">Savings Wallet</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PANEL 4: Every Action Gets Verified */}
              {activePanel === 3 && (
                <motion.div
                  key="panel-4"
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 lg:gap-8 text-left"
                >
                  <div className="w-full lg:w-[48%] flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-semibold font-mono tracking-[0.2em] text-[#050816]/60 uppercase">
                        STEP 04
                      </span>
                      <div className="w-8 h-[1px] bg-[#050816]/20" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold font-heading leading-[0.9] tracking-tighter text-[#050816] mb-4 select-none">
                      <span className="block">Every Action</span>
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
                        Gets Verified
                      </span>
                    </h2>
                    <p className="text-xs sm:text-[13px] text-slate-400 font-sans font-semibold leading-relaxed tracking-wide">
                      DelegAI validates every transaction before execution to prevent prompt injection, malicious outputs, and unsafe behavior.
                    </p>
                  </div>
                  <div className="w-full lg:w-[48%] flex items-center justify-center">
                    <ValidatorSteps isActive={activePanel === 3} />
                  </div>
                </motion.div>
              )}

              {/* PANEL 5: Autonomy Without Custody */}
              {activePanel === 4 && (
                <motion.div
                  key="panel-5"
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 lg:gap-8 text-left"
                >
                  <div className="w-full lg:w-[48%] flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-semibold font-mono tracking-[0.2em] text-[#050816]/60 uppercase">
                        STEP 05
                      </span>
                      <div className="w-8 h-[1px] bg-[#050816]/20" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold font-heading leading-[0.9] tracking-tighter text-[#050816] mb-4 select-none">
                      <span className="block">Autonomy</span>
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
                        Without Custody
                      </span>
                    </h2>
                    <p className="text-xs sm:text-[13px] text-slate-400 font-sans font-semibold leading-relaxed tracking-wide">
                      Only transactions that satisfy all permission constraints are executed through gasless relayers.
                    </p>
                  </div>
                  <div className="w-full lg:w-[48%] flex items-center justify-center">
                    <FlowDiagram isActive={activePanel === 4} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT PERSISTENT ROBOT LAYER (Always sticky/fixed across scroll states) */}
          <div className="w-full lg:w-[42vw] flex items-center justify-center z-20">
            <PersistentRobot activePanel={activePanel} />
          </div>

        </div>

      </div>
    </div>
  );
}
