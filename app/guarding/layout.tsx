// app/guarding/layout.tsx
import { GuardingProvider } from '@/components/guarding/GuardingContext';
import GuardianShell from '@/components/guarding/layout/GuardianShell';

export const metadata = {
  title: 'DelegAI Guardian - Mission Control',
  description: 'AI Cryptographic Caveats and Transaction Shield Monitor',
};

export default function GuardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuardingProvider>
      <GuardianShell>{children}</GuardianShell>
    </GuardingProvider>
  );
}
