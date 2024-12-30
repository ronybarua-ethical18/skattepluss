'use client';
import { useEffect } from 'react';
import Sidebar from '../Sidebar';
import { useRouter } from 'next/navigation';
import Topbar from '../Topbar';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { trpc } from '@/utils/trpc';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const isGreaterThan1600: boolean = useMediaQuery('(min-width: 1601px)');
  const { data: session, status } = useSession();
  const { data: loggedUser } = trpc.users.getUserByEmail.useQuery();

  useEffect(() => {
    if (!session?.user?.role) {
      router.push('/login');
    }
  }, [router, session]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">Wait a sec...</p>
      </div>
    );
  }

  return (
    <div className="h-screen fixed w-full">
      <div>
        <Topbar role={session?.user?.role || loggedUser?.role || ''} />
        <div
          className={cn(
            'grid bg-[#EEF0F4]  h-[calc(100vh-60px)] gap-8 w-full md:grid-cols-[250px_1fr] lg:grid-cols-[250px_1fr]  px-8 ',
            isGreaterThan1600 && 'px-[128px]'
          )}
        >
          <Sidebar role={session?.user?.role || loggedUser?.role || ''} />
          <main className="flex-1 overflow-y-auto my-6 lg:mt-8 [&::-webkit-scrollbar]:hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
