'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">{children}</main>
      </div>
    </SessionProvider>
  );
} 