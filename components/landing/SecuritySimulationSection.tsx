// components/landing/SecuritySimulationSection.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import SafeScenario from './SafeScenario';
import UnsafeScenario from './UnsafeScenario';

export default function SecuritySimulationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of the section relative to viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start center"]
  });

  // Entry animation parameters
  const entryOpacity = useTransform(scrollYProgress, [0.1, 0.75], [0, 1]);
  const entryScale = useTransform(scrollYProgress, [0.1, 0.75], [0.96, 1]);
  const entryY = useTransform(scrollYProgress, [0.1, 0.75], [80, 0]);
  const entryBlur = useTransform(scrollYProgress, [0.1, 0.75], [8, 0]);
  const entryFilter = useTransform(entryBlur, (v) => `blur(${v}px)`);

  const [currentStep, setCurrentStep] = useState(0);
  const [metrics, setMetrics] = useState({
    blockedExecutions: 0,
    successfulTxs: 0, // Allowed by validator
    relayedTxs: 0     // Fully confirmed/mined on-chain
  });

  // Helper handlers to pass down the tree (memoized to prevent infinite update depth loops in children useEffects)
  const incrementBlocked = useCallback(() => setMetrics(m => ({ ...m, blockedExecutions: m.blockedExecutions + 1 })), []);
  const incrementSuccessful = useCallback(() => setMetrics(m => ({ ...m, successfulTxs: m.successfulTxs + 1 })), []);
  const incrementRelayed = useCallback(() => setMetrics(m => ({ ...m, relayedTxs: m.relayedTxs + 1 })), []);

  // Synchronized step loop state machine
  // Step 0: User Intent (inputs enter side streams)
  // Step 1: AI resolving (parameters pop up)
  // Step 2: Validator scanning (pulses shoot from both sides into the Center Security Core)
  // Step 3: Decision (Core pulses dark navy on left, muted slate warning on right)
  // Step 4: Execution (Safe relays gasless transfer, Unsafe gets blocked at Core boundary)
  // Step 5: Final Outcome (Safe success glow, Unsafe funds protected warning)
  useEffect(() => {
    const stepDurations = [3500, 3500, 4000, 3500, 3500, 4500]; // ms per step
    
    let timer: NodeJS.Timeout;
    
    const runStep = (step: number) => {
      timer = setTimeout(() => {
        const nextStep = step === 5 ? 0 : step + 1;
        setCurrentStep(nextStep);
        runStep(nextStep);
      }, stepDurations[step]);
    };

    runStep(0);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Center core visual variables
  const isScanning = currentStep === 2;
  const isApproved = currentStep >= 3; 
  
  return (
    <section 
      ref={sectionRef}
      id="security-simulation" 
      className="relative w-full py-28 bg-guardian-obsidian overflow-hidden select-none z-20"
      aria-label="Security Simulation Panel"
    >
      
      {/* 1. Immersive Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Dynamic mesh lines */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(5, 8, 22, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(5, 8, 22, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Shifting radial glows */}
        <motion.div
          animate={{
            scale: currentStep >= 2 ? [1, 1.1, 1] : 1,
            opacity: currentStep >= 2 ? [0.12, 0.18, 0.12] : 0.08,
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-slate-200/10 blur-[130px] mix-blend-multiply"
        />

        <motion.div
          animate={{
            scale: currentStep >= 2 ? [1, 1.15, 1] : 1,
            opacity: currentStep >= 2 ? [0.12, 0.18, 0.12] : 0.06,
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[10%] right-[10%] w-[55vw] h-[55vw] rounded-full bg-slate-300/10 blur-[130px] mix-blend-multiply"
        />

        {/* Tiny floating particle sparks */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full bg-slate-400/20`}
            style={{
              width: Math.random() * 3 + 2,
              height: Math.random() * 3 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main container */}
      <motion.div 
        style={{
          opacity: entryOpacity,
          scale: entryScale,
          y: entryY,
          filter: entryFilter,
        }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 flex flex-col items-center gap-8"
      >
        
        {/* Editorial Header */}
        <div className="w-full text-center max-w-3xl flex flex-col items-center select-none mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[9px] tracking-[0.25em] font-mono text-guardian-cyan uppercase font-bold">
              ZERO-TRUST EXECUTION SIMULATOR
            </span>
          </div>

          <h2 className="text-3xl sm:text-[40px] font-black font-heading text-white select-none leading-none tracking-tight">
            AI Can Act. Rules Decide.
          </h2>
        </div>

        {/* Cinematic Split environment layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-11 gap-8 lg:gap-4 items-stretch relative">
          
          {/* LEFT SIDE: Safe execution path */}
          <div className="lg:col-span-4 flex w-full relative z-10">
            <SafeScenario 
              currentStep={currentStep} 
              incrementSuccessful={incrementSuccessful}
              incrementRelayed={incrementRelayed}
            />
          </div>

          {/* CENTER SECURITY CORE */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center py-12 lg:py-0 relative min-h-[320px] z-20">
            
            {/* Horizontal scanline connectors from side flows into Center Core */}
            {/* Left permanent connector line */}
            <div className="hidden lg:block absolute left-[-120px] w-[145px] h-[2px] bg-slate-800/10 border-t border-dashed border-guardian-slate/20 top-1/2 -translate-y-1/2 z-0" />
            
            {/* Safe Flowing Pulse */}
            <motion.div
              animate={{ x: [-120, 25] }}
              transition={{
                duration: isScanning ? 1.4 : 2.8,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="hidden lg:block absolute w-1.5 h-1.5 rounded-full bg-guardian-cyan shadow-[0_0_8px_rgba(56,189,248,0.6)] top-1/2 -translate-y-1/2 z-10"
            />

            {/* Right permanent connector line */}
            <div className="hidden lg:block absolute right-[-120px] w-[145px] h-[2px] bg-slate-800/10 border-t border-dashed border-guardian-slate/20 top-1/2 -translate-y-1/2 z-0" />
            
            {/* Unsafe Flowing Pulse (flows from right to center core) */}
            <motion.div
              animate={{ x: [145, 0] }}
              style={{ right: 0 }}
              transition={{
                duration: isScanning ? 1.4 : 2.8,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="hidden lg:block absolute w-1.5 h-1.5 rounded-full bg-slate-400 shadow-[0_0_8px_rgba(100,116,139,0.4)] top-1/2 -translate-y-1/2 z-10"
            />
 
            {/* Core rotating rings & floating orb wrapper */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              
              {/* Core energy ambient light shadow */}
              <motion.div
                animate={{
                  scale: [1, 1.08, 0.95, 1],
                  backgroundColor: currentStep < 3 
                    ? 'rgba(9, 10, 15, 0.2)' 
                    : isApproved 
                    ? 'rgba(56, 189, 248, 0.15)' 
                    : 'rgba(255, 0, 13, 0.15)',
                  boxShadow: currentStep < 3
                    ? '0 0 60px 20px rgba(9, 10, 15, 0.3)'
                    : isApproved
                    ? '0 0 60px 20px rgba(56, 189, 248, 0.4)'
                    : '0 0 60px 20px rgba(255, 0, 13, 0.4)',
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-36 h-36 rounded-full blur-xl z-0 transition-all duration-500"
              />
 
              {/* Security Shield Ring 1 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                className="absolute w-44 h-44 rounded-full border-2 border-dashed border-guardian-slate/50 z-10"
              />
 
              {/* Security Shield Ring 2 */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute w-[150px] h-[150px] rounded-full border border-dashed border-guardian-slate/40 z-10"
              />
 
              {/* Dynamic core decision pulses */}
              <AnimatePresence>
                {currentStep === 3 && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className={`absolute w-32 h-32 rounded-full border z-0 ${
                      isApproved ? 'border-guardian-cyan bg-guardian-cyan/10' : 'border-guardian-crimson bg-guardian-crimson/10'
                    }`}
                  />
                )}
              </AnimatePresence>
 
              {/* Center floating security core orb */}
              <motion.div
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-32 h-32 rounded-full bg-guardian-charcoal border border-guardian-slate/40 shadow-md flex flex-col items-center justify-center p-4 z-20 text-center backdrop-blur-lg"
              >
                {/* Visual state icon inside orb */}
                <div className="mb-2 shrink-0">
                  {currentStep < 2 && (
                    <div className="w-5 h-5 rounded-full bg-guardian-slate border border-guardian-slate/50 flex items-center justify-center text-guardian-pearl">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  )}
                  {isScanning && (
                    <div className="relative w-5 h-5 flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                      <div className="w-4 h-4 rounded-full border-2 border-guardian-slate border-t-transparent animate-spin" />
                    </div>
                  )}
                  {currentStep >= 3 && (
                    isApproved ? (
                      <div className="w-5 h-5 rounded-full bg-guardian-charcoal flex items-center justify-center text-white shadow-md shadow-black/40">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-guardian-crimson flex items-center justify-center text-white shadow-md shadow-guardian-crimson-glow animate-bounce">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    )
                  )}
                </div>
 
                <span className="text-[10px] font-black font-heading text-guardian-pearl tracking-wider leading-none uppercase">
                  BOUNDARIES
                </span>
                <span className="text-[7px] font-mono text-guardian-ash font-bold leading-none mt-1 uppercase whitespace-nowrap">
                  Permission Core
                </span>
              </motion.div>
 
              {/* Orbiting particles around the Core */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute w-44 h-44 z-30 pointer-events-none"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-guardian-cyan shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
              </motion.div>
 
            </div>
          </div>
 
          {/* RIGHT SIDE: Unsafe threat path */}
          <div className="lg:col-span-4 flex w-full relative z-10">
            <UnsafeScenario 
              currentStep={currentStep} 
              incrementBlocked={incrementBlocked}
            />
          </div>
 
        </div>

      </motion.div>
    </section>
  );
}
