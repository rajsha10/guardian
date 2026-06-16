'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroContent() {
  return (
    <div className="flex flex-col justify-center text-left relative">
      {/* Floating Coin - Positioned to float elegantly near the header text */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1,
          scale: 1,
          y: [0, -12, 0],
          rotate: [-8, 8, -8]
        }}
        transition={{
          opacity: { duration: 0.8, ease: 'easeOut' },
          scale: { duration: 0.8, ease: 'easeOut' },
          y: {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          rotate: {
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        }}
        className="absolute -left-4 sm:-left-12 lg:-left-20 top-[20%] sm:top-[25%] lg:top-[30%] w-16 h-16 sm:w-22 sm:h-22 lg:w-26 lg:h-26 filter drop-shadow-[0_8px_16px_rgba(0,245,212,0.25)] pointer-events-none z-20"
      >
        <img
          src="/coin.png"
          alt="Floating AI Coin"
          className="w-full h-full object-contain"
        />
      </motion.div>
      {/* Massive Editorial Heading - Exact density and leading from reference */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-[2.2rem] sm:text-[3.2rem] lg:text-[3.6rem] font-extrabold leading-[0.9] tracking-tighter font-heading text-white select-none whitespace-pre-line"
      >
        Give AI
        {`\n`}Financial
        {`\n`}
        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
          Freedom
          {/* Subtle custom vector arrow mimicking the reference swirl */}
          <svg
            className="absolute -right-12 sm:-right-16 md:-right-20 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 md:w-14 h-14 text-guardian-cyan opacity-90 hidden sm:block pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 text-guardian-ash text-xs sm:text-sm max-w-xs sm:max-w-[320px] font-sans font-semibold leading-relaxed tracking-wide select-none"
      >
        Securely delegate cryptographic constraints to autonomous AI agents, unlocking on-chain execution with zero-trust safety bounds.
      </motion.p>

      {/* Tilted CTA button matching the thin border, rotated text layout of the reference "Join Now" */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 self-start"
      >
        <Link href="/guarding">
          <div className="relative group cursor-pointer select-none w-32 h-32 flex items-center justify-center">
            {/* The thin outline circle with an exact gap where the text is placed */}
            <svg 
              viewBox="0 0 100 100" 
              className="absolute w-24 h-24 stroke-guardian-cyan/70 group-hover:stroke-guardian-cyan transition-all duration-350 ease-out group-hover:scale-105 fill-none"
            >
              <path
                d="M 10 27 A 46 46 0 1 1 27 90"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            
            {/* The tilted text intersecting the bottom-left gap of the circle */}
            <div className="absolute -left-2 bottom-8 -rotate-[12deg] flex flex-col items-start transition-all duration-350 ease-out group-hover:scale-105 origin-center">
              <span className="text-sm font-extrabold tracking-[0.08em] font-sans text-guardian-pearl group-hover:text-guardian-cyan transition-colors duration-300">
                LAUNCH
              </span>
              <span className="text-[10px] font-bold tracking-[0.12em] font-mono text-guardian-ash group-hover:text-guardian-pearl/90 mt-0.5">
                SHIELD
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
