

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClientProviders } from '@/components/ClientProviders'; // ✅ IMPORT your new client component

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Chat App',
  description: 'A modern chat application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>

        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}