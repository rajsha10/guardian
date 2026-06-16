'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LandingNavbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      // Simple active section detection
      const sections = ['why-guardian', 'how-it-works', 'security-simulation'];
      let currentActive = 'overview';
      
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 150) {
            currentActive = sectionId;
            break;
          }
        }
      }
      
      if (window.scrollY < 150) {
        currentActive = 'overview';
      }
      
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  if (pathname !== '/') return null;

  const scrollTo = (id: string) => {
    if (id === 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-transparent py-6 select-none"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex items-center justify-between">
        {/* Left: Brand Logo with Custom Red/Cyan Icon */}
        <div 
          onClick={() => scrollTo('overview')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          {/* Custom logo mark matching reference image */}
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Dots (cyan) */}
            <circle cx="4" cy="4" r="1.5" fill="#38bdf8" />
            <circle cx="10" cy="2" r="1.5" fill="#38bdf8" />
            <circle cx="16" cy="4" r="1.5" fill="#38bdf8" />
            
            {/* Bars (red) */}
            <rect x="2.5" y="8" width="3" height="9" rx="1.5" fill="#ff000d" />
            <rect x="8.5" y="6" width="3" height="11" rx="1.5" fill="#ff000d" />
            <rect x="14.5" y="8" width="3" height="9" rx="1.5" fill="#ff000d" />
          </svg>
          
          <span className="text-[17px] font-black font-heading tracking-tight text-white lowercase transition-colors duration-300 group-hover:text-guardian-cyan">
            guardian
          </span>
        </div>

        {/* Center: Capsule-shaped Navigation Links */}
        <nav className="hidden md:flex items-center bg-[#0a0c14]/60 backdrop-blur-md rounded-full px-1.5 py-1 border border-white/5 shadow-lg shadow-black/20">
          <button
            onClick={() => scrollTo('overview')}
            className={`cursor-pointer border-none outline-none py-1.5 px-4 rounded-full text-[11px] font-bold tracking-wide transition-all duration-300 ${
              activeSection === 'overview' 
                ? 'bg-slate-800/80 text-white font-bold' 
                : 'text-slate-400 font-medium hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            className={`cursor-pointer border-none outline-none py-1.5 px-4 rounded-full text-[11px] font-bold tracking-wide transition-all duration-300 ${
              activeSection === 'how-it-works' 
                ? 'bg-slate-800/80 text-white font-bold' 
                : 'text-slate-400 font-medium hover:text-white'
            }`}
          >
            Technology
          </button>
          <button
            onClick={() => scrollTo('security-simulation')}
            className={`cursor-pointer border-none outline-none py-1.5 px-4 rounded-full text-[11px] font-bold tracking-wide transition-all duration-300 ${
              activeSection === 'security-simulation' 
                ? 'bg-slate-800/80 text-white font-bold' 
                : 'text-slate-400 font-medium hover:text-white'
            }`}
          >
            About
          </button>
        </nav>

        {/* Right: Capsule buttons (Learn more & Join us style) */}
        <div className="flex items-center gap-3">
          <Link href="/guarding/dashboard" className="no-underline">
            <button className="bg-white text-guardian-obsidian font-sans font-bold text-[11px] tracking-wide px-5 py-2 rounded-full shadow-md hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer border-none outline-none">
              Launch Dashboard
            </button>
          </Link>
          
          <Link href="/guarding/dashboard" className="no-underline hidden sm:block">
            <button className="bg-transparent text-slate-300 hover:text-white font-sans font-bold text-[11px] tracking-wide px-4 py-2 transition-all duration-300 cursor-pointer border-none outline-none">
              Join us
            </button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
