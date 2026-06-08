'use client';
import { motion } from 'framer-motion';

export default function HeroVisual() {
  return (
    <div className="flex items-center justify-center w-full select-none pointer-events-none relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full flex items-center justify-center relative"
      >
        {/* Main Robot Image Container */}
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-full max-w-[340px] sm:max-w-[460px] lg:max-w-[520px] xl:max-w-[580px] aspect-square flex items-center justify-center relative"
        >
          {/* Main Robot */}
          <img
            src="/robo_hero.png"
            alt="DelegAI Guardian Floating Visual Shield"
            className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(5,8,22,0.15)] drop-shadow-[0_0_45px_rgba(123,97,255,0.35)]"
          />

          {/* Floating Wallet - Floating offset and rotating out of sync with main robot for organic motion */}
          <motion.div
            animate={{
              y: [0, -18, 0],
              rotate: [8, -8, 8],
            }}
            transition={{
              y: {
                duration: 6.8,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              rotate: {
                duration: 7.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            }}
            className="absolute right-[-4%] sm:right-[-8%] lg:right-[-12%] bottom-[12%] sm:bottom-[15%] w-18 h-18 sm:w-24 sm:h-24 lg:w-28 lg:h-28 filter drop-shadow-[0_12px_24px_rgba(123,97,255,0.3)]"
          >
            <img
              src="/wallet.png"
              alt="Floating Wallet"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

