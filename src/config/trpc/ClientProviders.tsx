// app/ClientProviders.tsx
'use client'; // This makes it a client component

import { SessionProvider } from 'next-auth/react';
import { TrpcProvider } from '@/config/trpc/Provider';
import { Session } from 'next-auth';

export function ClientProviders({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <TrpcProvider>{children}</TrpcProvider>
    </SessionProvider>
  );
}
