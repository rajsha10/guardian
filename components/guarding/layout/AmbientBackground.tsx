'use client';

import { motion } from 'framer-motion';

export default function AmbientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#F4F4F4]">
      {/* Subtle Mesh Grid lines */}
      <div 
        className="absolute inset-0 opacity-[0.025]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(5, 8, 22, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(5, 8, 22, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Radial dot patterns for command center feel */}
      <div 
        className="absolute inset-0 opacity-[0.035]" 
        style={{
          backgroundImage: 'radial-gradient(#050816 1.2px, transparent 1.2px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Left Top Teal/Mint Ambient Glow */}
      <motion.div
        animate={{
          x: [0, 20, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[10%] left-[10%] w-[350px] h-[350px] rounded-full bg-primary-accent/5 blur-[90px] mix-blend-multiply"
      />

      {/* Right Bottom Purple/Violet Ambient Glow */}
      <motion.div
        animate={{
          x: [0, -30, 15, 0],
          y: [0, 20, -30, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-secondary-accent/5 blur-[100px] mix-blend-multiply"
      />

      {/* Subtle white center light for depth */}
      <div className="absolute top-[30%] left-[35%] w-[300px] h-[300px] rounded-full bg-white/20 blur-[80px]" />
    </div>
  );
}
