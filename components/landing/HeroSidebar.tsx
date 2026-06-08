'use client';

import { motion } from 'framer-motion';

interface HeroSidebarProps {
  items?: string[];
  activeIndex?: number;
  onItemClick?: (index: number) => void;
  className?: string;
}

const DEFAULT_LABELS = [
  'SAFE EXECUTION',
  'PERMISSIONS',
  'VALIDATION',
  'SMART ACCOUNTS',
  'GASLESS',
];

export default function HeroSidebar({
  items = DEFAULT_LABELS,
  activeIndex = 0,
  onItemClick,
  className = '',
}: HeroSidebarProps) {
  return (
    <div className={`select-none w-full ${className}`}>
      {/* Sidebar with no background card, row text on a single line */}
      <ul className="space-y-4 text-left w-full">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * index }}
              className={`flex items-center gap-2.5 text-xs md:text-sm font-sans tracking-wide whitespace-nowrap ${
                onItemClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onItemClick && onItemClick(index)}
            >
              {/* Active Indicator Bullet Dot matching reference positioning and space preservation */}
              <span
                className={`w-2 h-2 rounded-full bg-black shrink-0 transition-all duration-300 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}
              />
              <span
                className={`transition-colors duration-300 ${
                  isActive
                    ? 'text-black font-semibold'
                    : 'text-black/40 font-medium hover:text-black/60'
                }`}
              >
                {item}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

