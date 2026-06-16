'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuardingState } from '../GuardingContext';

interface StateDetails {
  status: string;
  glowColor: string;
  badgeBg: string;
  description: string;
}

const FRAMES = [
  '/dashboard_frames/frame_002.jpg',
  '/dashboard_frames/frame_012.jpg',
  '/dashboard_frames/frame_022.jpg',
  '/dashboard_frames/frame_031.jpg',
  '/dashboard_frames/frame_041.jpg',
  '/dashboard_frames/frame_052.jpg',
  '/dashboard_frames/frame_061.jpg',
  '/dashboard_frames/frame_072.jpg',
  '/dashboard_frames/frame_081.jpg',
  '/dashboard_frames/frame_091.jpg',
  '/dashboard_frames/frame_102.jpg',
  '/dashboard_frames/frame_111.jpg',
];

const ROBOT_STATES: Record<string, StateDetails> = {
  idle: {
    status: 'AI SHIELD: STANDBY',
    glowColor: 'rgba(255, 255, 255, 0.01)', 
    badgeBg: 'bg-white/5 text-white/60 border-white/10',
    description: 'Awaiting connection or directive...',
  },
  listening: {
    status: 'AI SHIELD: MONITORING',
    glowColor: 'rgba(255, 255, 255, 0.02)',
    badgeBg: 'bg-white/5 text-white border-white/20',
    description: 'Scoping cryptographic keys...',
  },
  processing: {
    status: 'INTENT PARSER: RESOLVING',
    glowColor: 'rgba(255, 255, 255, 0.02)',
    badgeBg: 'bg-white/5 text-white border-white/20',
    description: 'Converting directive to transaction...',
  },
  validating: {
    status: 'VALIDATOR: SANITIZING',
    glowColor: 'rgba(255, 255, 255, 0.02)',
    badgeBg: 'bg-white/5 text-white border-white/20',
    description: 'Evaluating execution rules...',
  },
  warning: {
    status: 'VALIDATOR: VIOLATION BLOCKED',
    glowColor: 'rgba(255, 255, 255, 0.03)',
    badgeBg: 'bg-white/5 text-white border-white/30',
    description: 'Access violation! Fund custody shielded.',
  },
};

export default function RobotAssistant() {
  const { robotState } = useGuardingState();
  const currentState = ROBOT_STATES[robotState] || ROBOT_STATES.idle;

  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    // Preload frames to browser cache to guarantee zero-flicker rendering
    FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    const frameDuration = 400; // 400ms per frame (2.5 FPS) for a very slow, calm animation pacing

    const tick = (now: number) => {
      if (now - lastTime >= frameDuration) {
        setFrameIndex((prev) => (prev + 1) % FRAMES.length);
        lastTime = now;
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[320px] flex flex-col items-center justify-center select-none pointer-events-none mx-auto py-4">
      
      {/* 1. Ambient Energy Field (Glow behind the robot) */}
      <motion.div
        animate={{
          backgroundColor: currentState.glowColor,
          scale: robotState === 'warning' ? [1, 1.15, 0.95, 1] : [1, 1.08, 0.96, 1],
          opacity: robotState === 'idle' ? 0.4 : 0.8,
          boxShadow: `0 0 50px 15px ${currentState.glowColor}`,
        }}
        transition={{
          duration: robotState === 'warning' ? 2 : 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-48 h-48 rounded-full blur-2xl z-0 transition-all duration-700"
      />

      {/* 2. Soft circular base grid behind robot */}
      <div className="absolute w-44 h-44 rounded-full border border-guardian-slate/20 bg-guardian-charcoal/5 backdrop-blur-[1px] shadow-inner z-0 flex items-center justify-center">
        {/* Faint target lines */}
        <div className="absolute w-[90%] h-[90%] rounded-full border border-dashed border-guardian-slate/20" />
        <div className="absolute w-[60%] h-[60%] rounded-full border border-dotted border-guardian-slate/20" />
      </div>



      {/* 4. Rising energy particles from base */}
      {robotState !== 'idle' && Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/10"
          initial={{ y: 50, x: Math.random() * 60 - 30, opacity: 0 }}
          animate={{
            y: [-10, -70],
            opacity: [0, 0.6, 0],
            scale: [0.6, 1, 0.4],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* 5. Main Robot Character (Integrated floating & breathing) */}
      <motion.div
        animate={{
          y: robotState === 'warning' ? [0, -4, 0, -4, 0] : [0, -8, 0],
          scale: robotState === 'warning' ? [1, 0.98, 1] : [1, 1.01, 1],
        }}
        transition={{
          duration: robotState === 'warning' ? 1.5 : 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative z-20 w-44 h-44 flex flex-col items-center justify-center"
      >
        {FRAMES.map((src, index) => (
          <img
            key={src}
            src={src}
            alt="DelegAI Robot Guide"
            style={{ display: index === frameIndex ? 'block' : 'none' }}
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(255,255,255,0.02)]"
          />
        ))}

        {/* Small floating holographic halo above robot */}
        <motion.div
          animate={{
            y: [0, 2, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-2 w-8 h-0.5 rounded-full bg-white/30 blur-[1px] filter drop-shadow-[0_0_3px_#fff]"
        />
      </motion.div>

      {/* 6. Dynamic status badge & context details */}
      <div className="absolute bottom-0 flex flex-col items-center gap-1 w-full text-center z-30">
        <AnimatePresence mode="wait">
          <motion.span
            key={robotState}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`inline-block px-2.5 py-0.5 text-[8px] font-bold tracking-[0.15em] uppercase border rounded-full backdrop-blur-md transition-colors ${currentState.badgeBg}`}
          >
            {currentState.status}
          </motion.span>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.span
            key={`desc-${robotState}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="text-[9px] text-guardian-ash font-sans font-medium max-w-[200px]"
          >
            {currentState.description}
          </motion.span>
        </AnimatePresence>
      </div>

    </div>
  );
}
