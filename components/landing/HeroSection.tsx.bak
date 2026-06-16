'use client';

import HeroContent from './HeroContent';
import HeroVisual from './HeroVisual';
import HeroSidebar from './HeroSidebar';

export default function HeroSection() {
  return (
    <div className="relative w-full min-h-screen bg-slate-950 flex flex-col justify-between overflow-hidden select-none">
      {/* Background Ambient Glows - Left purple, right teal, center dark */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Left subtle purple glow */}
        <div className="absolute top-[15%] left-[-15%] w-[60vw] h-[60vw] max-w-[700px] rounded-full bg-secondary-accent/10 blur-[140px] mix-blend-screen" />
        {/* Right subtle teal glow */}
        <div className="absolute bottom-[10%] right-[-15%] w-[60vw] h-[60vw] max-w-[700px] rounded-full bg-primary-accent/8 blur-[140px] mix-blend-screen" />
      </div>

      {/* Main Grid Content Container */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center justify-between px-6 sm:px-12 lg:px-24 flex-grow w-full max-w-7xl mx-auto py-6">
        {/* Left Column: Heading & Paragraph & CTA (width aligned to reference) */}
        <div className="lg:col-span-5 flex flex-col justify-center w-full z-10">
          <HeroContent />
        </div>

        {/* Center Column: Floating Transparent GIF Artwork (centered vertically & horizontally) */}
        <div className="lg:col-span-5 flex justify-center items-center w-full z-0">
          <HeroVisual />
        </div>

        {/* Right Column: Reusable Vertical Sidebar Labels */}
        <div className="lg:col-span-2 flex justify-start lg:justify-end items-center h-full z-10">
          <HeroSidebar className="w-full lg:pl-10" />
        </div>
      </div>

      {/* Bottom Row - Perfectly aligning Delegated Shield and How It Works on the exact same line */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 pb-8 pt-4 flex flex-row justify-between items-end gap-12">
        {/* Left: Delegated Shield */}
        <div className="flex flex-row gap-6 items-start max-w-lg">
          <div className="flex-shrink-0 min-w-[120px]">
            <h4 className="text-[9px] tracking-[0.2em] font-mono text-[#050816]/60 uppercase font-semibold">DELEGATED SHIELD</h4>
            <h3 className="text-xs font-bold text-[#050816] mt-0.5 font-heading tracking-tight leading-tight">Zero-Trust Boundaries</h3>
          </div>
          
          {/* Vertical divider */}
          <div className="w-[1px] h-10 bg-[#050816]/15 self-stretch" />
          
          <p className="text-[10px] text-[#050816]/70 leading-relaxed font-sans font-medium max-w-xs">
            Secure local execution contexts with fine-grained cryptographic caveats. Strip asset custody entirely while maintaining high-frequency sovereign transaction automation.
          </p>
        </div>

        {/* Right: How It Works Play Button */}
        <div 
          onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-4 group cursor-pointer select-none"
        >
          {/* Circular play icon */}
          <div className="w-10 h-10 rounded-full border border-slate-800 group-hover:border-primary-accent flex items-center justify-center transition-all duration-300 bg-slate-900/20 backdrop-blur-md flex-shrink-0">
            <svg
              className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-accent ml-0.5 transition-colors duration-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="block text-[10px] font-semibold tracking-widest font-mono text-slate-200 uppercase whitespace-nowrap">HOW IT WORKS</span>
            <div className="text-[10px] text-slate-500 mt-0.5 font-light leading-snug whitespace-nowrap">
              Watch cryptographic
              <br />
              session delegation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
