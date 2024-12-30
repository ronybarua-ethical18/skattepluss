// app/[lang]/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getServerSession } from 'next-auth';
import { Toaster } from 'react-hot-toast';
import Providers from '@/lib/StoreProviders';
import { getDictionary } from '@/lib/dictionary';
import { Locale, i18n } from '../../../i18n.config';
import {
  NestedTranslation,
  TranslationProvider,
} from '@/lib/TranslationProvider';
import { ClientProviders } from '@/config/trpc/ClientProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Skattepluss',
  description: 'Skattepluss is a tax saving application',
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  const session = await getServerSession();
  const dictionary = (await getDictionary(lang).catch((e) =>
    console.log(e)
  )) as NestedTranslation;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <TranslationProvider dict={dictionary}>
          <Providers>
            <ClientProviders session={session}>{children}</ClientProviders>
            <Toaster position="top-center" />
          </Providers>
        </TranslationProvider>
      </body>
    </html>
  );
}
