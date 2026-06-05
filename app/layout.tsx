import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'DelegAI Guardian',
  description: 'Permissioned AI Finance Copilot',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
