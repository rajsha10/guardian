// app/providers.tsx
'use client';

import { createConfig, http, WagmiProvider } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { mantleSepolia } from '@/lib/chains';

export const config = createConfig({
  chains: [mantleSepolia],
  connectors: [
    injected({ target: 'metaMask' })
  ],
  transports: {
    [mantleSepolia.id]: http(), 
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
