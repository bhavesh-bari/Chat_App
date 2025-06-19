// app/layout.tsx
// REMOVE "use client" from here

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import { ThemeProvider } from '@/components/theme-provider'; // REMOVE: Move inside ClientProviders
// import { Toaster } from '@/components/ui/toaster'; // REMOVE: Move inside ClientProviders

import { ClientProviders } from '@/components/ClientProviders'; // ✅ IMPORT your new client component

const inter = Inter({ subsets: ['latin'] });

// ✅ Keep metadata here, as RootLayout is now a Server Component
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
        {/* ✅ Wrap children and other client-side elements with ClientProviders */}
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}