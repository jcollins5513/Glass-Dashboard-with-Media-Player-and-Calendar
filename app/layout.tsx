import '../styles/globals.css';
import React from 'react';
import type { Metadata } from 'next';
import AuthProvider from '../components/AuthProvider';

export const metadata: Metadata = {
  title: 'Glass Dashboard',
  description: 'Glass Dashboard with Media Player and Calendar',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

