'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGuardingState } from '../GuardingContext';

interface StateDetails {
  status: string;
  glowColor: string;
  badgeBg: string;
  description: string;
}

const ROBOT_STATES: Record<string, StateDetails> = {
  idle: {
    status: 'AI SHIELD: STANDBY',
    glowColor: 'rgba(123, 97, 255, 0.05)', 
    badgeBg: 'bg-slate-900 text-slate-500 border-slate-800/20',
    description: 'Awaiting connection or directive...',
  },
  listening: {
    status: 'AI SHIELD: MONITORING',
    glowColor: 'var(--color-amber-950)', // Teal Glow
    badgeBg: 'bg-slate-900 text-primary-accent border-primary-accent/20',
    description: 'Scoping cryptographic keys...',
  },
  processing: {
    status: 'INTENT PARSER: RESOLVING',
    glowColor: 'var(--color-indigo-950)', // Purple Glow
    badgeBg: 'bg-slate-900 text-indigo-400 border-indigo-800/20',
    description: 'Converting directive to transaction...',
  },
  validating: {
    status: 'VALIDATOR: SANITIZING',
    glowColor: 'var(--color-emerald-950)', // Green Glow
    badgeBg: 'bg-slate-900 text-emerald-400 border-emerald-800/20',
    description: 'Evaluating execution rules...',
  },
  warning: {
    status: 'VALIDATOR: VIOLATION BLOCKED',
    glowColor: 'var(--color-rose-950)', // Red Glow
    badgeBg: 'bg-slate-900 text-rose-400 border-rose-800/20',
    description: 'Access violation! Fund custody shielded.',
  },
};

export default function RobotAssistant() {
  const { robotState } = useGuardingState();
  const currentState = ROBOT_STATES[robotState] || ROBOT_STATES.idle;

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
      <div className="absolute w-44 h-44 rounded-full border border-[#050816]/5 bg-white/5 backdrop-blur-[1px] shadow-inner z-0 flex items-center justify-center">
        {/* Faint target lines */}
        <div className="absolute w-[90%] h-[90%] rounded-full border border-dashed border-[#050816]/5" />
        <div className="absolute w-[60%] h-[60%] rounded-full border border-dotted border-[#050816]/5" />
      </div>

      {/* 3. 3D Orbital Rings (Tilted rings with orbiting beads) */}
      {/* Outer Cyan Ring */}
      <div 
        className="absolute w-56 h-56 pointer-events-none z-10" 
        style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      >
        <motion.div
          className="relative w-full h-full rounded-full border border-primary-accent/15 border-dashed"
          style={{
            transform: 'rotateX(72deg) rotateY(12deg)',
            transformStyle: 'preserve-3d',
          }}
          animate={{ rotateZ: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        >
          {/* Glowing Bead */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary-accent shadow-[0_0_6px_var(--color-primary-accent)]" />
        </motion.div>
      </div>

      {/* Inner Purple Ring */}
      <div 
        className="absolute w-[200px] h-[200px] pointer-events-none z-10" 
        style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      >
        <motion.div
          className="relative w-full h-full rounded-full border border-[#050816]/5"
          style={{
            transform: 'rotateX(68deg) rotateY(-18deg)',
            transformStyle: 'preserve-3d',
          }}
          animate={{ rotateZ: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {/* Glowing Bead */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary-accent shadow-[0_0_6px_var(--color-primary-accent)]" />
        </motion.div>
      </div>

      {/* 4. Rising energy particles from base */}
      {robotState !== 'idle' && Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary-accent/20"
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
        <img
          src="/robot_hro.gif"
          alt="DelegAI Robot Guide"
          className={`w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(5,8,22,0.08)] transition-all duration-300 ${
            robotState === 'warning' ? 'hue-rotate-[120deg] saturate-200' : 
            robotState === 'validating' ? 'hue-rotate-[45deg]' : ''
          }`}
        />

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
          className={`absolute -top-2 w-8 h-0.5 rounded-full blur-[1px] filter drop-shadow-[0_0_3px_var(--color-primary-accent)] ${
            robotState === 'warning' ? 'bg-rose-400/40' : 'bg-primary-accent/40'
          }`}
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
            className="text-[9px] text-slate-500 font-sans font-medium max-w-[200px]"
          >
            {currentState.description}
          </motion.span>
        </AnimatePresence>
      </div>

    </div>
  );
}
