import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import SecuritySimulationSection from '@/components/landing/SecuritySimulationSection';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#F4F4F4]">
      <HeroSection />
      <HowItWorksSection />
      <SecuritySimulationSection />
    </main>
  );
}
