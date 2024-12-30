// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { Locale, i18n } from '../i18n.config';

function getLocale(request: NextRequest): string | undefined {
  const preferredLanguage = request.cookies.get('preferred-language')
    ?.value as Locale;

  if (preferredLanguage && i18n.locales.includes(preferredLanguage)) {
    return preferredLanguage;
  }

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-expect-error locales are readonly
  const locales: string[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}

const protectedRoutes = [
  '/customer/dashboard',
  '/customer/categories',
  '/customer/rules',
  '/customer/expenses',
  '/customer/write-off',
  '/customer/settings',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // Check for locale first
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Handle locale redirect while preserving query parameters
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    const url = new URL(
      `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
      request.url
    );

    // Add back all original query parameters
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    const response = NextResponse.redirect(url);
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    return response;
  }

  // Check if the current path (without locale) matches any protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    i18n.locales.some(
      (locale) =>
        pathname === `/${locale}${route}` || pathname === `/${locale}${route}/`
    )
  );

  // If it's a protected route, check for authentication
  if (isProtectedRoute) {
    const sessionToken =
      request.cookies.get('next-auth.session-token')?.value ||
      request.cookies.get('__Secure-next-auth.session-token')?.value;

    if (!sessionToken) {
      const locale = pathname.split('/')[1];
      const response = NextResponse.redirect(
        new URL(`/${locale}/login`, request.url)
      );

      // Add cache control headers
      response.headers.set(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      );
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');

      return response;
    }

    // Add cache headers for authenticated requests
    const response = NextResponse.next();
    response.headers.set(
      'Cache-Control',
      'private, no-cache, no-store, must-revalidate'
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
