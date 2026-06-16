// components/landing/FloatingTags.tsx
'use client';

import { motion } from 'framer-motion';

const TAGS = [
  { label: 'AI AGENTS', glow: 'shadow-[0_0_15px_rgba(0,245,212,0.15)] border-guardian-cyan/15 hover:border-guardian-cyan/40' },
  { label: 'SCOPED AUTHORITY', glow: 'shadow-[0_0_15px_rgba(0,0,0,0.3)] border-guardian-slate/50 hover:border-guardian-cyan/40' },
  { label: 'ZERO CUSTODY', glow: 'shadow-[0_0_15px_rgba(0,245,212,0.1)] border-guardian-cyan/10 hover:border-guardian-cyan/30' },
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
          className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.15em] font-mono text-guardian-pearl/70 backdrop-blur-xl bg-guardian-charcoal/40 border transition-all duration-300 cursor-default select-none ${tag.glow}`}
        >
          {tag.label}
        </motion.div>
      ))}
    </div>
  );
}
