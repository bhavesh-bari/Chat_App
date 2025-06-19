// components/ClientProviders.tsx
"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { initializeSocket } from '@/lib/socket';

const PROTECTED_PATHS = ['/chat', '/profile']; // Define your protected paths

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    // If on a protected path and no token exists, redirect to login
    if (PROTECTED_PATHS.some(path => pathname.startsWith(path)) && !authToken) {
      console.log('ClientProviders: No auth token found on protected path. Redirecting to /login.');
      router.replace('/login'); // Use router.replace to avoid adding to history
      return; // Stop further execution
    }

    // If on a public path (login/register) and token exists, redirect to chat
    // This handles cases where user tries to go to /login while already authenticated
    if (['/login', '/register', '/'].includes(pathname) && authToken) {
      console.log('ClientProviders: Auth token found on public path. Redirecting to /chat.');
      router.replace('/chat');
      return; // Stop further execution
    }

    // Initialize socket only if a token exists
    if (authToken) {
      initializeSocket();
    } else {
      // If no token and not on protected path, ensure socket is disconnected
      // (e.g., if user logged out or token expired)
      // import socket from '@/socket';
      // socket.disconnect();
      // console.log('Socket disconnected due to missing token.');
    }

    return () => {
      // Cleanup if needed (e.g., if component unmounts and you want to explicitly disconnect)
    };
  }, [router, pathname]); // Re-run effect if router or pathname changes

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
}