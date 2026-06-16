// components/landing/PersistentRobot.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface PersistentRobotProps {
  activePanel: number;
}

const PANEL_STATES = [
  {
    id: 0,
    status: 'AI GUARD: ACTIVE',
    glowColor: 'var(--color-amber-950)', // Teal Glow
    badgeBg: 'bg-slate-900 text-guardian-cyan border-guardian-cyan/20',
    description: 'Scoping local session authority...',
  },
  {
    id: 1,
    status: 'SESSION BOUNDARIES: LOCKED',
    glowColor: 'var(--color-indigo-950)', // Purple Glow
    badgeBg: 'bg-slate-900 text-guardian-ash border-guardian-slate/50',
    description: 'Cryptographic limits defined',
  },
  {
    id: 2,
    status: 'INTENT PARSER: RESOLVED',
    glowColor: 'var(--color-amber-950)', // Cyan/Teal Glow
    badgeBg: 'bg-slate-900 text-guardian-cyan border-guardian-cyan/20',
    description: 'Converting prompts to parameters',
  },
  {
    id: 3,
    status: 'SHIELD VALIDATOR: VERIFIED',
    glowColor: 'var(--color-emerald-950)', // Green Glow
    badgeBg: 'bg-slate-900 text-guardian-cyan border-guardian-cyan/20',
    description: 'Sanitized transaction payloads',
  },
  {
    id: 4,
    status: 'RELAY ROUTER: READY',
    glowColor: 'var(--color-indigo-950)', // Purple/Mixed Glow
    badgeBg: 'bg-slate-900 text-guardian-cyan border-guardian-cyan/20',
    description: 'Gasless broadcast pipeline active',
  },
];

export default function PersistentRobot({ activePanel }: PersistentRobotProps) {
  const currentState = PANEL_STATES[activePanel] || PANEL_STATES[0];

  return (
    <div className="relative w-full aspect-square max-w-[420px] flex flex-col items-center justify-center select-none pointer-events-none">
      
      {/* 1. Ambient Energy Field (Glow behind the robot) */}
      <motion.div
        animate={{
          backgroundColor: currentState.glowColor,
          scale: [1, 1.1, 0.95, 1],
          opacity: [0.75, 0.9, 0.8, 0.75],
          boxShadow: `0 0 70px 25px ${currentState.glowColor}`,
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-72 h-72 rounded-full blur-2xl z-0 transition-all duration-700"
      />

      {/* 2. Soft circular base grid behind robot */}
      <div className="absolute w-60 h-60 rounded-full border border-guardian-slate/20 bg-guardian-charcoal/10 backdrop-blur-[2px] shadow-inner z-0 flex items-center justify-center">
        {/* Faint target lines */}
        <div className="absolute w-[90%] h-[90%] rounded-full border border-dashed border-guardian-slate/20" />
        <div className="absolute w-[60%] h-[60%] rounded-full border border-dotted border-guardian-slate/20" />
      </div>

      {/* 3. 3D Orbital Rings (Tilted rings with orbiting beads) */}
      {/* Outer Cyan Ring */}
      <div 
        className="absolute w-80 h-80 pointer-events-none z-10" 
        style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      >
        <motion.div
          className="relative w-full h-full rounded-full border border-guardian-cyan/25 border-dashed"
          style={{
            transform: 'rotateX(72deg) rotateY(12deg)',
            transformStyle: 'preserve-3d',
          }}
          animate={{ rotateZ: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        >
          {/* Glowing Bead */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-guardian-cyan shadow-[0_0_8px_var(--color-primary-accent)]" />
        </motion.div>
      </div>

      {/* Inner Purple Ring */}
      <div 
        className="absolute w-[290px] h-[290px] pointer-events-none z-10" 
        style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      >
        <motion.div
          className="relative w-full h-full rounded-full border border-guardian-slate/40"
          style={{
            transform: 'rotateX(68deg) rotateY(-18deg)',
            transformStyle: 'preserve-3d',
          }}
          animate={{ rotateZ: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          {/* Glowing Bead */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-guardian-cyan shadow-[0_0_8px_var(--color-primary-accent)]" />
        </motion.div>
      </div>

      {/* 4. Rising energy particles from base */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-guardian-cyan/30"
          initial={{ y: 80, x: Math.random() * 80 - 40, opacity: 0 }}
          animate={{
            y: [-20, -100],
            opacity: [0, 0.7, 0],
            scale: [0.6, 1, 0.4],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* 5. Main Robot Character (Integrated floating & breathing) */}
      <motion.div
        animate={{
          y: [0, -12, 0],
          scale: [1, 1.015, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative z-20 w-64 h-64 flex flex-col items-center justify-center"
      >
        <img
          src="/robot_hro.gif"
          alt="DelegAI Robot Guide"
          className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(5,8,22,0.12)]"
        />

        {/* Small floating holographic halo above robot */}
        <motion.div
          animate={{
            y: [0, 3, 0],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-4 w-12 h-1 rounded-full bg-guardian-cyan/40 blur-[2px] filter drop-shadow-[0_0_4px_var(--color-primary-accent)]"
        />
      </motion.div>

      {/* 6. Dynamic status badge & context details */}
      <div className="absolute -bottom-8 flex flex-col items-center gap-1.5 w-full text-center z-30">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentState.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className={`inline-block px-3 py-1 text-[9px] font-bold tracking-[0.15em] uppercase border rounded-full backdrop-blur-md ${currentState.badgeBg}`}
          >
            {currentState.status}
          </motion.span>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.span
            key={`desc-${currentState.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-[10px] text-guardian-ash font-sans font-medium"
          >
            {currentState.description}
          </motion.span>
        </AnimatePresence>
      </div>

    </div>
  );
}
