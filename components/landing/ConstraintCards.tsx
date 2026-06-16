// components/landing/ConstraintCards.tsx
'use client';

import { motion } from 'framer-motion';

interface ConstraintCardsProps {
  isActive: boolean;
}

const CONSTRAINTS = [
  {
    title: 'Amount Limits',
    desc: 'Max allowed volume per transaction',
    value: '500.00 USDC',
    icon: (
      <svg className="w-4 h-4 text-guardian-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    badge: 'STRICT LIMIT',
    badgeColor: 'text-guardian-pearl/75 bg-slate-900 border-guardian-slate/60',
  },
  {
    title: 'Token Restrictions',
    desc: 'Approved smart contract tokens only',
    tokens: ['USDC', 'USDT', 'WETH'],
    icon: (
      <svg className="w-4 h-4 text-guardian-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    badge: 'WHITELIST',
    badgeColor: 'text-guardian-cyan bg-slate-900 border-guardian-cyan/20',
  },
  {
    title: 'Expiry Rules',
    desc: 'Automatic delegation revocation',
    value: 'Expires in 23:59:45',
    icon: (
      <svg className="w-4 h-4 text-guardian-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    badge: 'TIME-LOCKED',
    badgeColor: 'text-guardian-pearl/75 bg-slate-900 border-guardian-slate/60',
  },
  {
    title: 'Target Restrictions',
    desc: 'Allowed destination smart contracts',
    value: 'Uniswap V3, Aave V3',
    icon: (
      <svg className="w-4 h-4 text-guardian-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    badge: 'DEFI ONLY',
    badgeColor: 'text-guardian-cyan bg-slate-900 border-guardian-cyan/20',
  },
  {
    title: 'Session Permissions',
    desc: 'Allowed methods (withdraw is blocked)',
    value: 'approve(), transfer(), swap()',
    icon: (
      <svg className="w-4 h-4 text-guardian-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    badge: 'NON-CUSTODIAL',
    badgeColor: 'text-guardian-cyan bg-slate-900 border-guardian-cyan/20',
  },
];

export default function ConstraintCards({ isActive }: ConstraintCardsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isActive ? 'show' : 'hidden'}
      className="flex flex-col gap-1.5 w-full max-w-[320px] mx-auto py-2"
    >
      {CONSTRAINTS.map((item, index) => (
        <motion.div
          key={item.title}
          variants={itemVariants}
          whileHover={{
            y: -2,
            transition: { duration: 0.2, ease: 'easeOut' },
          }}
          className="relative bg-slate-900 border border-guardian-slate/40 px-4 py-2 rounded-xl flex items-center justify-between gap-4 backdrop-blur-md shadow-sm h-[54px] w-full overflow-hidden"
        >
          {/* Accent glow on top left */}
          <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-primary-accent/10 to-transparent blur-[10px] pointer-events-none" />

          {/* Left Column: Icon + Title & Desc */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-2 rounded-lg bg-slate-950/40 border border-guardian-slate/50 shrink-0">
              {item.icon}
            </div>
            <div className="text-left min-w-0">
              <h4 className="text-xs font-bold text-slate-50 font-heading leading-tight truncate">
                {item.title}
              </h4>
              <p className="text-[9.5px] text-guardian-ash font-sans font-medium mt-0.5 truncate max-w-[155px]">
                {item.desc}
              </p>
            </div>
          </div>

          {/* Right Column: Badge + Value */}
          <div className="flex flex-col items-end shrink-0 gap-1.5 text-right">
            <span className={`text-[8px] font-bold tracking-[0.08em] px-2 py-0.5 rounded border shrink-0 font-mono ${item.badgeColor}`}>
              {item.badge}
            </span>
            {item.tokens ? (
              <div className="flex gap-1 items-center">
                {item.tokens.map((token) => (
                  <span
                    key={token}
                    className="text-[9px] font-bold bg-slate-950/60 border border-guardian-slate text-slate-100 px-1.5 py-0.5 rounded shadow-sm shrink-0"
                  >
                    {token}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] font-extrabold text-guardian-pearl tracking-tight font-sans truncate">
                {item.value}
              </p>
            )}
          </div>

          {/* Progress bar at the bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-800/5 overflow-hidden rounded-b-xl">
            <motion.div
              initial={{ width: 0 }}
              animate={isActive ? { width: '70%' } : { width: 0 }}
              transition={{ duration: 1.2, delay: 0.3 + index * 0.1 }}
              className={`h-full ${
                index % 2 === 0 ? 'bg-guardian-cyan' : 'bg-guardian-slate/50'
              }`}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
