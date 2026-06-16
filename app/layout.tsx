import './globals.css';
import { Providers } from './providers';
import LandingNavbar from '@/components/landing/LandingNavbar';

export const metadata = {
  title: 'DelegAI Guardian',
  description: 'Permissioned AI Finance Copilot',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 min-h-screen antialiased">
        <Providers>
          <LandingNavbar />
          {children}
          
          {/* Floating Sentinel Active Badge in bottom-left corner to cover watermark logos */}
          <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3 py-1.5 bg-guardian-charcoal border border-guardian-slate rounded-full backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)] select-none pointer-events-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-mono font-black tracking-[0.18em] text-guardian-cyan uppercase">
              Sentinel Active
            </span>
          </div>
        </Providers>
      </body>
    </html>
  );
}
