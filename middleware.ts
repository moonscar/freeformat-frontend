import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const DEFAULT_LOCALE = 'zh';
const SUPPORTED_LOCALES = ['zh', 'en'] as const;

function detectPreferredLocale(request: NextRequest): (typeof SUPPORTED_LOCALES)[number] {
  const header = request.headers.get('accept-language');
  if (!header) return DEFAULT_LOCALE;

  const ordered = header
    .split(',')
    .map((item) => item.split(';')[0]?.trim().toLowerCase())
    .filter(Boolean);

  for (const candidate of ordered) {
    if (!candidate) continue;
    if (candidate.startsWith('zh')) return 'zh';
    if (candidate.startsWith('en')) return 'en';
  }
  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap')
  ) {
    return;
  }

  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0];
  if (locale && SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])) return;

  const preferred = detectPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${preferred}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
