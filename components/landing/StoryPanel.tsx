// components/landing/StoryPanel.tsx
'use client';

import { motion } from 'framer-motion';
import React from 'react';
import RobotShowcase from './RobotShowcase';

interface StoryPanelProps {
  panelIndex: number;
  heading: string;
  description: string;
  labels?: string[];
  children?: React.ReactNode;
  isActive: boolean;
}

export default function StoryPanel({
  panelIndex,
  heading,
  description,
  labels = [],
  children,
  isActive,
}: StoryPanelProps) {
  // Split heading by newline to render structured lines
  const headingLines = heading.split('\n');

  return (
    <div className="w-screen h-screen flex flex-col lg:flex-row shrink-0 items-center justify-between select-none relative overflow-hidden bg-transparent">
      {/* Left Column: Heading, Description, and Interactive Visual Widget */}
      <div className="w-full lg:w-[55vw] h-full flex flex-col justify-center px-6 sm:px-12 lg:pl-24 lg:pr-12 py-16 lg:py-0 z-10">
        {/* Step Number Tracker */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="text-[10px] font-black font-mono tracking-[0.2em] text-secondary-accent uppercase">
            STEP 0{panelIndex + 1}
          </span>
          <div className="w-8 h-[1px] bg-secondary-accent/40" />
        </motion.div>

        {/* Large Editorial Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl font-black font-heading leading-[0.95] tracking-tighter text-guardian-pearl mb-4"
        >
          {headingLines.map((line, idx) => (
            <span key={idx} className="block">
              {line}
            </span>
          ))}
        </motion.h2>

        {/* Description Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm text-guardian-ash font-sans font-semibold leading-relaxed tracking-wide max-w-lg mb-6"
        >
          {description}
        </motion.p>

        {/* Small Badges / Pill Labels (Panel 1 specific) */}
        {labels.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-2.5 mb-8"
          >
            {labels.map((lbl) => (
              <span
                key={lbl}
                className="text-[9px] font-bold tracking-[0.12em] bg-slate-900 border border-guardian-slate/50 text-guardian-pearl/75 px-3 py-1 rounded-full shadow-sm"
              >
                {lbl}
              </span>
            ))}
          </motion.div>
        )}

        {/* Visual Indicator Container (Slot for custom cards/timeline/diagrams) */}
        <div className="w-full">
          {children}
        </div>
      </div>

      {/* Right Column Space reservation (Desktop: empty/transparent, Mobile: Inline Robot Showcase) */}
      <div className="w-full lg:w-[45vw] flex items-center justify-center lg:h-full z-0 px-6 pb-16 lg:pb-0">
        {/* On mobile screens, render the RobotShowcase directly inline inside the panel */}
        <div className="block lg:hidden w-full max-w-[280px]">
          <RobotShowcase activePanel={panelIndex} />
        </div>
      </div>
    </div>
  );
}
