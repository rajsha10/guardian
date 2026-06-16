// components/landing/FloatingTags.tsx
'use client';

import { motion } from 'framer-motion';

const TAGS = [
  { label: 'AI AGENTS', glow: 'shadow-[0_0_15px_rgba(0,245,212,0.15)] border-primary-accent/15 hover:border-primary-accent/40' },
  { label: 'SCOPED AUTHORITY', glow: 'shadow-[0_0_15px_rgba(5,8,22,0.05)] border-slate-800/20 hover:border-[#050816]/35' },
  { label: 'ZERO CUSTODY', glow: 'shadow-[0_0_15px_rgba(0,245,212,0.1)] border-primary-accent/10 hover:border-primary-accent/30' },
];

export default function FloatingTags() {
  return (
    <div className="flex flex-wrap gap-3 my-6">
      {TAGS.map((tag, idx) => (
        <motion.div
          key={tag.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, -6, 0] }}
          whileHover={{
            y: -3,
            scale: 1.03,
            transition: { duration: 0.2, ease: 'easeOut' },
          }}
          transition={{
            opacity: { duration: 0.6, delay: 0.3 + idx * 0.1 },
            y: {
              duration: 4 + idx * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3 + idx * 0.1,
            }
          }}
          className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.15em] font-mono text-[#050816]/70 backdrop-blur-xl bg-white/40 border transition-all duration-300 cursor-default select-none ${tag.glow}`}
        >
          {tag.label}
        </motion.div>
      ))}
    </div>
  );
}
