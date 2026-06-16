'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import FrameSequenceBackground from './FrameSequenceBackground';

interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
  titleClassName?: string;
  hoverBorderClassName?: string;
  isLit?: boolean;
  glowDirection?: 'bottom-right' | 'bottom-left';
}

function FeatureCard({
  number,
  title,
  description,
  titleClassName = 'text-slate-100',
  hoverBorderClassName = 'hover:border-guardian-cyan/40',
  isLit = false,
  glowDirection = 'bottom-right',
}: FeatureCardProps) {
  // Split number and category label
  const hasSplit = number.includes(' / ');
  const numOnly = hasSplit ? number.split(' / ')[0] : number;
  const category = hasSplit ? number.split(' / ')[1] : '';

  // Glow styles mapping
  const borderStyle = isLit
    ? (hoverBorderClassName.includes('#38bdf8')
        ? 'border-[#38bdf8]/60 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
        : 'border-guardian-cyan/60 shadow-[0_0_20px_rgba(56,189,248,0.25)]')
    : 'border-guardian-slate/40';

  const gradientOpacity = isLit 
    ? 'opacity-100' 
    : 'opacity-60 group-hover:opacity-85';

  // Glow gradient direction (Left cards glow bottom-right, Right cards glow bottom-left)
  const glowGradient = glowDirection === 'bottom-right'
    ? 'bg-gradient-to-tl from-guardian-crimson/15 via-transparent to-transparent'
    : 'bg-gradient-to-tr from-guardian-crimson/15 via-transparent to-transparent';

  const floatDelay = numOnly === '01' ? 0 : numOnly === '02' ? 1.2 : numOnly === '03' ? 2.4 : 3.6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-auto lg:h-[180px] select-none"
    >
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: floatDelay,
        }}
        className={`relative group overflow-hidden bg-guardian-charcoal/50 border backdrop-blur-md rounded-xl p-6 transition-all duration-500 shadow-lg h-full w-full flex flex-col justify-between ${borderStyle} ${hoverBorderClassName}`}
      >
        {/* Background Gradient Glow */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${glowGradient} ${gradientOpacity}`} />
        
        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col justify-between h-full w-full">
          {/* Top Row: Large Red Number */}
          <div>
            <span className={`text-[22px] font-black font-mono leading-none transition-colors duration-500 ${isLit ? 'text-guardian-cyan' : 'text-guardian-crimson'}`}>
              {numOnly}
            </span>
          </div>
          
          {/* Bottom Row: Inline Text Content */}
          <div className="mt-8 text-left">
            {category && (
              <span className={`text-[9px] font-bold font-mono tracking-widest uppercase transition-colors duration-500 mb-1.5 block ${isLit ? 'text-guardian-cyan/90' : 'text-guardian-ash/60'}`}>
                {category}
              </span>
            )}
            <p className={`text-[11px] font-semibold font-sans leading-relaxed tracking-wide transition-colors duration-500 ${isLit ? 'text-guardian-pearl' : 'text-guardian-ash'}`}>
              <span className={`font-extrabold font-heading transition-all duration-500 mr-2 ${isLit ? 'text-white' : titleClassName}`}>
                {title}
              </span>
              {description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection() {
  const [activeGlowCard, setActiveGlowCard] = useState<number | null>(null);
  const [isPastHero, setIsPastHero] = useState(false);

  // Track page scroll to drive exit scale and opacity animations
  const { scrollY } = useScroll();

  // Transform scale, translation, blur and opacity dynamically as the page scrolls down
  const scale = useTransform(scrollY, [0, 450], [1, 0.92]);
  const opacity = useTransform(scrollY, [0, 380], [1, 0]);
  const y = useTransform(scrollY, [0, 450], [0, -100]);
  const blurValue = useTransform(scrollY, [0, 350], [0, 12]);
  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

  useEffect(() => {
    // Reset scroll positions on mount to guarantee landing at the exact top
    window.scrollTo(0, 0);

    const handleScroll = () => {
      setIsPastHero(window.scrollY > window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFrameChange = (frameIndex: number) => {
    // 234 frames total. Map them to cards:
    // Card 01 (Autonomous Autonomy): frames 0 to 58
    // Card 02 (Professional Infrastructure): frames 59 to 117
    // Card 03 (Instant Zero-Gas Execution): frames 118 to 175
    // Card 04 (Trust Boundary Enforcement): frames 176 to 233
    const cardIndex = Math.floor(frameIndex / 58.5) + 1; // 1, 2, 3, or 4
    setActiveGlowCard(cardIndex);
  };

  return (
    <div className="relative w-full h-screen bg-transparent z-10">
      {/* Fixed viewport container that fades out as a whole on scroll */}
      <motion.div 
        style={{ opacity, display: isPastHero ? 'none' : 'flex' }}
        className="fixed top-0 left-0 h-screen w-full overflow-hidden bg-guardian-obsidian select-none flex flex-col justify-between z-10"
      >
        
        {/* Full-Screen Looping Frame Sequence Background (fades naturally with parent sticky container) */}
        <div className="absolute inset-0 z-0">
          <FrameSequenceBackground onFrameChange={handleFrameChange} />
        </div>

        {/* Background Ambient Glows (fade naturally with parent sticky container) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Left red/pink glow */}
          <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-guardian-crimson/10 blur-[130px] mix-blend-screen" />
          {/* Center intense teal glow behind video */}
          <div className="absolute top-[25%] left-[25%] w-[50vw] h-[50vw] max-w-[650px] rounded-full bg-guardian-cyan/10 blur-[150px] mix-blend-screen" />
          {/* Right subtle teal glow */}
          <div className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-guardian-cyan/10 blur-[130px] mix-blend-screen" />
        </div>

        {/* Content Container (Grid) scaling, translating, and blurring on scroll while parent handles fade */}
        <motion.div 
          style={{ scale, y, filter }}
          className="relative z-10 w-full h-full flex flex-col justify-center"
        >
          {/* Main Grid Content */}
          <main id="why-guardian" className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-center py-4 lg:py-6">
            
            {/* Mobile Heading */}
            <div className="block lg:hidden text-center mb-8">
              <span className="text-[10px] font-semibold font-mono tracking-[0.2em] text-guardian-cyan uppercase block mb-2">
                SYSTEM OVERVIEW
              </span>
              <h2 className="text-4xl font-black font-heading text-guardian-pearl leading-none tracking-tight">
                Why Choose Guardian?
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center w-full">
              {/* Left Column - Card 01 & Card 03 */}
              <div className="order-2 lg:order-1 lg:col-span-3 flex flex-col gap-6 w-full">
                <FeatureCard
                  number="01 / Autonomous Autonomy"
                  title="Cryptographic Delegation"
                  description="Delegate secure, non-custodial transaction authority to background AI agents."
                  titleClassName="text-slate-100"
                  isLit={activeGlowCard === 1}
                  glowDirection="bottom-right"
                />
                <FeatureCard
                  number="03 / Instant Zero-Gas Execution"
                  title="Gasless 1Shot Relayer"
                  description="Bypass network gas barriers via sponsored ERC-4337 transaction payloads."
                  titleClassName="text-slate-100"
                  isLit={activeGlowCard === 3}
                  glowDirection="bottom-right"
                />
              </div>

              {/* Center Column - Empty spacer to let the background video centerpiece shine through */}
              <div className="order-1 lg:order-2 lg:col-span-6 min-h-[280px] lg:min-h-0 pointer-events-none" />

              {/* Right Column - Card 02 & Card 04 */}
              <div className="order-3 lg:order-3 lg:col-span-3 flex flex-col gap-6 w-full text-left">
                {/* Desktop Heading */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="hidden lg:block select-none mb-2"
                >
                  <span className="text-[10px] font-semibold font-mono tracking-[0.2em] text-guardian-cyan uppercase block mb-2">
                    SYSTEM OVERVIEW
                  </span>
                  <h2 className="text-4xl xl:text-[45px] font-black font-heading text-guardian-pearl leading-[0.95] tracking-tight">
                    Why
                    <br />
                    Choose
                    <br />
                    Guardian?
                  </h2>
                </motion.div>

                <FeatureCard
                  number="02 / Professional Infrastructure"
                  title="Enterprise-Grade Security"
                  description="Intent-parsing pipelines backed by real-time monitoring and RPC relays."
                  titleClassName="text-slate-100"
                  isLit={activeGlowCard === 2}
                  glowDirection="bottom-left"
                />
                <FeatureCard
                  number="04 / Trust Boundary Enforcement"
                  title="Real-Time Interception"
                  description="An autonomous sentinel immediately blocks any boundary deviation."
                  titleClassName="text-[#38bdf8]"
                  hoverBorderClassName="hover:border-[#38bdf8]/30"
                  isLit={activeGlowCard === 4}
                  glowDirection="bottom-left"
                />
              </div>
            </div>
          </main>
        </motion.div>
      </motion.div>
    </div>
  );
}
