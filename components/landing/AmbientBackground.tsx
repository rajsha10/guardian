// components/landing/AmbientBackground.tsx
'use client';

import { motion } from 'framer-motion';

interface AmbientBackgroundProps {
  activePanel?: number;
}

const GLOW_STATES = [
  { blob1: 'var(--color-amber-950)', blob2: 'var(--color-indigo-950)' }, // Teal & Purple
  { blob1: 'var(--color-indigo-950)', blob2: 'var(--color-amber-950)' }, // Purple & Teal
  { blob1: 'var(--color-amber-950)', blob2: 'var(--color-indigo-950)' }, // Teal & Purple
  { blob1: 'var(--color-emerald-950)', blob2: 'var(--color-amber-950)' }, // Green & Teal
  { blob1: 'var(--color-indigo-950)',  blob2: 'var(--color-emerald-950)' }, // Purple & Green
];

export default function AmbientBackground({ activePanel = 0 }: AmbientBackgroundProps) {
  const currentState = GLOW_STATES[activePanel] || GLOW_STATES[0];

  // Generate random particles coordinates and anim properties
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 2, // 2px to 5px
    x: Math.random() * 100, // percentage
    y: Math.random() * 100, // percentage
    duration: Math.random() * 15 + 10, // seconds
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Subtle Mesh Grid lines */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(244, 244, 246, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(244, 244, 246, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial dot patterns for high-end feel */}
      <div 
        className="absolute inset-0 opacity-[0.04]" 
        style={{
          backgroundImage: 'radial-gradient(rgba(244, 244, 246, 0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Ambient Glow Blob 1: Teal/Primary, morphs on scroll */}
      <motion.div
        animate={{
          backgroundColor: currentState.blob1,
          x: [0, 40, -20, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          backgroundColor: { duration: 0.8, ease: 'easeInOut' },
          x: { duration: 25, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 25, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 25, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-[10%] left-[15%] w-[45vw] h-[45vw] rounded-full blur-[120px] mix-blend-multiply"
      />

      {/* Ambient Glow Blob 2: Purple/Secondary, morphs on scroll */}
      <motion.div
        animate={{
          backgroundColor: currentState.blob2,
          x: [0, -30, 40, 0],
          y: [0, 40, -20, 0],
          scale: [1, 0.85, 1.1, 1],
        }}
        transition={{
          backgroundColor: { duration: 0.8, ease: 'easeInOut' },
          x: { duration: 30, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 30, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 30, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute bottom-[10%] right-[15%] w-[40vw] h-[40vw] rounded-full blur-[120px] mix-blend-multiply"
      />

      {/* Ambient Glow Blob 3: White center light for depth */}
      <div className="absolute top-[30%] left-[40%] w-[35vw] h-[35vw] rounded-full bg-guardian-charcoal/40 blur-[140px] mix-blend-screen" />

      {/* Faint Floating Motion Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-secondary-accent/25"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 0.6, 0.3, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
