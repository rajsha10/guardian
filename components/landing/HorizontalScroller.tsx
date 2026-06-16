// components/landing/HorizontalScroller.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, animate } from 'framer-motion';
import ConstraintCards from './ConstraintCards';
import ValidatorSteps from './ValidatorSteps';
import DelegationFlow from './DelegationFlow';
import FloatingTags from './FloatingTags';
import TechFrameSequenceBackground from './TechFrameSequenceBackground';

const TABS = [
  {
    id: 0,
    num: '01',
    label: 'AI Delegation',
    title: 'Permissioned AI Autonomy',
    desc: 'DelegAI enables autonomous financial execution through permission-scoped AI agents protected by cryptographic safety boundaries.',
  },
  {
    id: 1,
    num: '02',
    label: 'Safety Boundaries',
    title: 'Create Safe Boundaries',
    desc: 'Users generate delegated session accounts with cryptographic constraints that define exactly what AI is allowed to do.',
  },
  {
    id: 2,
    num: '03',
    label: 'Intent Parser',
    title: 'AI Makes Decisions',
    desc: 'Users provide natural language instructions while the AI converts them into structured financial actions.',
  },
  {
    id: 3,
    num: '04',
    label: 'Shield Validator',
    title: 'Every Action Gets Verified',
    desc: 'DelegAI validates every transaction before execution to prevent prompt injection, malicious outputs, and unsafe behavior.',
  },
];

export default function HorizontalScroller() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);
  const isSnappingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [activePanel, setActivePanel] = useState(0);

  // Track global page scroll to drive entry transition
  const { scrollY } = useScroll();

  // Transform entry of the scroller section as the page scrolls down (from 0 to 500px)
  const entryOpacity = useTransform(scrollY, [0, 450], [0, 1]);
  const entryScale = useTransform(scrollY, [0, 500], [0.95, 1]);
  const entryY = useTransform(scrollY, [0, 500], [80, 0]);
  const entryBlur = useTransform(scrollY, [0, 400], [8, 0]);
  const entryFilter = useTransform(entryBlur, (v) => `blur(${v}px)`);

  // Track the vertical scroll of the parent container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Reactive state hook to detect active tab index (0 to 3) based on scroll bands
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const index = Math.min(Math.max(Math.floor(latest * 4), 0), 3);
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

        // Snapping threshold buffer (only snap when inside container scroll space)
        const buffer = 45;
        if (currentScroll >= scrollStart + buffer && currentScroll <= scrollEnd - buffer) {
          const totalHeight = scrollEnd - scrollStart;
          const progress = (currentScroll - scrollStart) / totalHeight;
          const nearestIndex = Math.min(Math.max(Math.round(progress * 3), 0), 3);
          const targetScrollY = scrollStart + (nearestIndex / 3) * totalHeight;

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
      y: 15,
      scale: 0.99,
      filter: 'blur(5px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as const, // premium out-quint easing
      },
    },
    exit: {
      opacity: 0,
      y: -15,
      scale: 0.99,
      filter: 'blur(5px)',
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const,
      },
    },
  };

  // Exit transforms driven by container scroll progress
  const exitOpacity = useTransform(scrollYProgress, [0.85, 0.97], [1, 0]);
  const exitScale = useTransform(scrollYProgress, [0.85, 0.97], [1, 0.92]);
  const exitY = useTransform(scrollYProgress, [0.85, 0.97], [0, -80]);
  const exitBlur = useTransform(scrollYProgress, [0.85, 0.97], [0, 8]);
  const exitFilter = useTransform(exitBlur, (v) => `blur(${v}px)`);

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-transparent">
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center bg-guardian-obsidian select-none">
        
        {/* Exit transition wrapper for the entire sticky viewport */}
        <motion.div
          style={{
            opacity: exitOpacity,
            scale: exitScale,
            y: exitY,
            filter: exitFilter,
          }}
          className="absolute inset-0 w-full h-full flex items-center"
        >
          {/* Continuous 138-Frame Technical 3D Sequence Background */}
          <TechFrameSequenceBackground scrollYProgress={scrollYProgress} />

          {/* Animated Inner Wrapper for smooth entry */}
          <motion.div
            style={{
              opacity: entryOpacity,
              scale: entryScale,
              y: entryY,
              filter: entryFilter
            }}
            className="absolute inset-0 flex flex-col justify-center items-center w-full h-full z-10"
          >
            {/* Main Content Layout */}
            <div className="relative z-10 w-full flex flex-col items-start px-6 sm:px-10 lg:px-10 pt-28 lg:pt-32 pb-12">
            
              {/* Heading Details */}
              <div className="text-left mb-5 select-none">
                <span className="text-[10px] font-bold font-mono tracking-[0.25em] text-guardian-cyan uppercase block mb-1">
                  SYSTEM PIPELINE
                </span>
                <h2 className="text-3xl sm:text-4xl font-black font-heading text-guardian-pearl leading-none tracking-tight">
                  How Guardian Works
                </h2>
              </div>

              {/* Glassmorphic Panel Content Box */}
              <div className="w-full lg:max-w-[680px] bg-transparent border border-white/5 backdrop-blur-[2px] rounded-2xl p-6 lg:p-10 relative min-h-[360px] lg:h-[440px] flex items-center overflow-hidden">
                {/* Animated White Borders Tracing */}
                <div className="absolute top-0 left-0 w-full h-[1.5px] animate-border-h" />
                <div className="absolute top-0 right-0 w-[1.5px] h-full animate-border-v" style={{ animationDelay: '1.25s' }} />
                <div className="absolute bottom-0 left-0 w-full h-[1.5px] animate-border-h" style={{ animationDelay: '2.5s' }} />
                <div className="absolute top-0 left-0 w-[1.5px] h-full animate-border-v" style={{ animationDelay: '3.75s' }} />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePanel}
                    variants={panelVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                  >
                    {/* Left Column: Descriptions */}
                    <div className="lg:col-span-6 flex flex-col justify-center text-left">
                      <h3 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold font-heading leading-tight text-guardian-pearl mb-4 select-none">
                        {TABS[activePanel].title}
                      </h3>
                      
                      <p className="text-xs sm:text-[13.5px] text-guardian-ash font-sans font-semibold leading-relaxed tracking-wide mb-6">
                        {TABS[activePanel].desc}
                      </p>

                      {activePanel === 0 && <FloatingTags />}
                    </div>

                    {/* Right Column: Visual Widgets */}
                    <div className="lg:col-span-6 flex items-center justify-center w-full">
                      {activePanel === 1 && <ConstraintCards isActive={activePanel === 1} />}
                      {activePanel === 2 && (
                        <div className="w-full max-w-sm flex flex-col gap-3 relative z-10">
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-slate-900 border border-guardian-slate/50 p-3.5 rounded-xl flex flex-col items-start gap-1 relative backdrop-blur-md"
                          >
                            <span className="text-[8px] font-black font-mono tracking-widest text-guardian-ash/80 uppercase">USER NATURAL INPUT</span>
                            <p className="text-xs font-bold text-guardian-pearl font-sans text-left">
                              "Move 50 USDC to savings"
                            </p>
                            <div className="absolute right-4 top-4 flex gap-1 items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-guardian-cyan animate-pulse" />
                              <span className="text-[8px] font-mono font-bold tracking-[0.1em] text-guardian-ash">PROMPTED</span>
                            </div>
                          </motion.div>

                          <div className="flex justify-center items-center w-full py-0.5">
                            <motion.div
                              animate={{ y: [0, 4, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="p-1 bg-slate-950/40 rounded-full border border-guardian-slate/40"
                            >
                              <svg className="w-4 h-4 text-guardian-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
                              </svg>
                            </motion.div>
                          </div>

                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-slate-950 border border-guardian-slate/30 p-3.5 rounded-xl flex flex-col gap-2 relative backdrop-blur-lg"
                          >
                            <div className="flex items-center justify-between border-b border-guardian-slate/20 pb-1.5">
                              <span className="text-[8px] font-black font-mono tracking-widest text-guardian-ash/80 uppercase">STRUCTURED DELEGATION ACTIONS</span>
                              <span className="text-[8px] font-mono font-bold tracking-[0.1em] text-guardian-pearl/75 border border-guardian-slate/40 bg-slate-900 px-2 py-0.5 rounded-full">
                                RESOLVED
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-left">
                              <div className="flex flex-col">
                                <span className="text-[8px] text-guardian-ash font-bold uppercase tracking-wider">Amount</span>
                                <span className="text-xs font-black text-guardian-pearl mt-0.5 font-heading">50 USDC</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[8px] text-guardian-ash font-bold uppercase tracking-wider">Action</span>
                                <span className="text-xs font-extrabold text-guardian-pearl mt-0.5 font-heading">Transfer</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[8px] text-guardian-ash font-bold uppercase tracking-wider">Destination</span>
                                <span className="text-xs font-black text-guardian-pearl mt-0.5 font-heading truncate">Savings Wallet</span>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )}
                      {activePanel === 3 && <ValidatorSteps isActive={activePanel === 3} />}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
