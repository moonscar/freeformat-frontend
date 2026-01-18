import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const DEFAULT_LOCALE = 'zh';
const SUPPORTED_LOCALES = ['zh', 'en'] as const;

function getCanonicalHost(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || '';
  if (!raw) return null;
  try {
    return new URL(raw).host;
  } catch {
    return null;
  }
}

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
  // P0: Enforce a single canonical host (non-www or www, based on NEXT_PUBLIC_SITE_URL).
  // Do not enforce in local dev (localhost) to avoid breaking DX.
  const canonicalHost = getCanonicalHost();
  const requestHost =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    request.nextUrl.host;
  if (
    process.env.NODE_ENV === 'production' &&
    canonicalHost &&
    requestHost &&
    !requestHost.includes('localhost') &&
    !requestHost.includes('127.0.0.1') &&
    requestHost !== canonicalHost
  ) {
    const url = request.nextUrl.clone();
    url.host = canonicalHost;
    return NextResponse.redirect(url, 308);
  }

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
