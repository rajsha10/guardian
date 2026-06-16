// components/landing/AnimatedConnection.tsx
'use client';

import { motion } from 'framer-motion';

interface AnimatedConnectionProps {
  type: 'vertical' | 'left-to-center' | 'center-to-right';
  delay?: number;
  duration?: number;
}

export default function AnimatedConnection({
  type,
  delay = 0,
  duration = 2.5,
}: AnimatedConnectionProps) {
  if (type === 'vertical') {
    return (
      <div className="h-10 w-full relative flex items-center justify-center">
        {/* Background dotted line */}
        <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#050816]/15 via-[#050816]/5 to-[#050816]/15" />
        
        <svg className="w-4 h-full relative z-10" viewBox="0 0 16 40" fill="none">
          {/* Pulsing signal dot */}
          <motion.circle
            cx="8"
            cy="-5"
            r="3"
            fill="#7B61FF"
            className="filter drop-shadow-[0_0_6px_#7B61FF]"
            animate={{
              cy: [-5, 45],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: delay,
            }}
          />
          
          <motion.circle
            cx="8"
            cy="-5"
            r="2"
            fill="#00F5D4"
            className="filter drop-shadow-[0_0_4px_#00F5D4]"
            animate={{
              cy: [-5, 45],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: delay + duration / 2,
            }}
          />
        </svg>
      </div>
    );
  }

  if (type === 'left-to-center') {
    // Desktop horizontal connector from left editorial text to center wallet card
    return (
      <div className="hidden lg:block absolute left-[22%] top-[30%] w-[18%] h-[120px] pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="left-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7B61FF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#00F5D4" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          {/* Curved connection path */}
          <path
            d="M 10 10 Q 120 10, 190 110"
            stroke="rgba(5, 8, 22, 0.05)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <path
            d="M 10 10 Q 120 10, 190 110"
            stroke="url(#left-flow-grad)"
            strokeWidth="1.5"
            opacity="0.6"
          />

          {/* Animated pulse moving along path */}
          <motion.circle
            r="3.5"
            fill="#00F5D4"
            className="filter drop-shadow-[0_0_8px_#00F5D4]"
            animate={{
              offsetDistance: ['0%', '100%'],
            }}
            style={{
              offsetPath: "path('M 10 10 Q 120 10, 190 110')",
              offsetRotate: 'auto',
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.5,
            }}
          />
        </svg>
      </div>
    );
  }

  // center-to-right
  // Desktop horizontal connector from bottom center (Delegated AI) to Right Robot
  return (
    <div className="hidden lg:block absolute right-[18%] bottom-[20%] w-[20%] h-[140px] pointer-events-none z-0">
      <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="right-flow-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F5D4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7B61FF" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Curved connection path */}
        <path
          d="M 10 10 Q 90 130, 190 130"
          stroke="rgba(5, 8, 22, 0.05)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <path
          d="M 10 10 Q 90 130, 190 130"
          stroke="url(#right-flow-grad)"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Animated pulse moving along path */}
        <motion.circle
          r="3.5"
          fill="#7B61FF"
          className="filter drop-shadow-[0_0_8px_#7B61FF]"
          animate={{
            offsetDistance: ['0%', '100%'],
          }}
          style={{
            offsetPath: "path('M 10 10 Q 90 130, 190 130')",
            offsetRotate: 'auto',
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: 'linear',
            delay: 1.2,
          }}
        />
      </svg>
    </div>
  );
}
