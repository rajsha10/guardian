// components/landing/RobotShowcase.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface RobotShowcaseProps {
  activePanel: number;
}

// Defines statuses, colors, and secondary visual indicators for each step
const PANEL_STATES = [
  {
    id: 0,
    status: 'AI GUARD: IDLE',
    glowColor: 'rgba(0, 245, 212, 0.15)', // Teal
    borderColor: 'rgba(0, 245, 212, 0.3)',
    badgeBg: 'bg-emerald-950/10 text-emerald-600 border-emerald-500/20',
    description: 'Listening for secure session intent...',
  },
  {
    id: 1,
    status: 'SESSION BOUNDARIES: LOCKED',
    glowColor: 'rgba(123, 97, 255, 0.15)', // Purple/Violet
    borderColor: 'rgba(123, 97, 255, 0.3)',
    badgeBg: 'bg-indigo-950/10 text-indigo-500 border-indigo-500/20',
    description: 'Cryptographic limits defined',
  },
  {
    id: 2,
    status: 'INTENT PARSER: ACTIVE',
    glowColor: 'rgba(0, 245, 212, 0.15)', // Teal/Cyan
    borderColor: 'rgba(0, 245, 212, 0.3)',
    badgeBg: 'bg-emerald-950/10 text-emerald-600 border-emerald-500/20',
    description: 'Translating human intent to actions',
  },
  {
    id: 3,
    status: 'SHIELD VALIDATOR: SCANNING',
    glowColor: 'rgba(0, 230, 118, 0.15)', // Success Green
    borderColor: 'rgba(0, 230, 118, 0.3)',
    badgeBg: 'bg-emerald-950/10 text-emerald-600 border-emerald-500/20',
    description: 'Scanning for unsafe payloads',
  },
  {
    id: 4,
    status: 'RELAY ROUTER: READY',
    glowColor: 'rgba(123, 97, 255, 0.2)', // Mixed
    borderColor: 'rgba(123, 97, 255, 0.4)',
    badgeBg: 'bg-indigo-950/10 text-indigo-500 border-indigo-500/20',
    description: 'Awaiting execution broadcast',
  },
];

export default function RobotShowcase({ activePanel }: RobotShowcaseProps) {
  const currentState = PANEL_STATES[activePanel] || PANEL_STATES[0];

  return (
    <div className="relative w-full h-full max-w-[480px] aspect-square flex items-center justify-center select-none pointer-events-none">
      {/* Dynamic Background Glow Layer */}
      <motion.div
        animate={{
          backgroundColor: currentState.glowColor,
          borderColor: currentState.borderColor,
          boxShadow: `0 0 60px 20px ${currentState.glowColor}`,
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-dashed flex items-center justify-center transition-all duration-700"
      >
        {/* Orbiting particles/nodes */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute w-full h-full flex justify-between items-center pointer-events-none"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-primary-accent/80 blur-[1px]" />
          <div className="w-2.5 h-2.5 rounded-full bg-secondary-accent/80 blur-[1px]" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[80%] h-[80%] flex justify-between items-center pointer-events-none"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary-accent/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-secondary-accent/60" />
        </motion.div>
      </motion.div>

      {/* Main Floating Robot Character */}
      <motion.div
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 flex flex-col items-center justify-center"
      >
        <img
          src="/robot_hro.gif"
          alt="DelegAI Robot Guide"
          className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(5,8,22,0.15)]"
        />

        {/* Dynamic Badge & Context details under the robot */}
        <div className="absolute -bottom-8 flex flex-col items-center gap-1.5 w-full text-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentState.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className={`inline-block px-3 py-1 text-[9px] font-bold tracking-[0.15em] uppercase border rounded-full ${currentState.badgeBg}`}
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
              className="text-[10px] text-slate-500 font-sans font-medium"
            >
              {currentState.description}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
