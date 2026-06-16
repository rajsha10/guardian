// components/landing/HowItWorksSection.tsx
'use client';

import HorizontalScroller from './HorizontalScroller';

export default function HowItWorksSection() {
  return (
    <section 
      id="how-it-works" 
      className="relative w-full overflow-visible z-20"
      aria-label="How DelegAI Guardian Works"
    >
      <HorizontalScroller />
    </section>
  );
}
