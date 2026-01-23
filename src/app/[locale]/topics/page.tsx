import Link from 'next/link';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type TopicItem = { slug: string; locale: string; title?: string | null; guide_type?: string | null; version?: string | null };

const RUNTIME_API_BASE = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '') || '/api';

function resolveApiBaseAbsolute(): string {
  if (RUNTIME_API_BASE && !RUNTIME_API_BASE.startsWith('/')) return RUNTIME_API_BASE;
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'http';
  if (!host) return RUNTIME_API_BASE;
  return `${proto}://${host}${RUNTIME_API_BASE}`.replace(/\/$/, '');
}

async function fetchTopics(locale: string): Promise<TopicItem[]> {
  const base = resolveApiBaseAbsolute();
  if (!base || base.startsWith('/')) return [];
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const url = `${base}/guides?locale=${encodeURIComponent(locale)}&guide_type=topic&limit=200`;
    const res = await fetch(url, isProd ? { next: { revalidate: 300 } } : { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as TopicItem[];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  const canonical = `/${localeKey}/topics`;
  const title = localeKey === 'zh' ? '排版专题' : 'Formatting Topics';
  const description =
    localeKey === 'zh'
      ? '面向论文与投稿的 Word 排版专题：常见问题、检查清单与可操作步骤。'
      : 'Word formatting topics for theses and submissions: common issues, checklists, and actionable steps.';
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: '/en/topics',
        zh: '/zh/topics',
      },
    },
    openGraph: {
      url: canonical,
      type: 'website',
    },
  };
}

export default async function TopicsIndex({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  const isZh = locale === 'zh';
  const items = await fetchTopics(locale);

  return (
    <>
      <Header locale={locale} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-semibold text-slate-900">{isZh ? '排版专题' : 'Formatting Topics'}</h1>
        <p className="mt-2 text-slate-600">
          {isZh ? '面向高意图 Word 排版问题的教程与清单' : 'Tutorials and checklists for high-intent Word formatting problems'}
        </p>

        {!items.length ? (
          <div className="mt-6 rounded border p-4 text-sm text-slate-600">{isZh ? '暂无专题' : 'No topics yet.'}</div>
        ) : (
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {items.map((t) => (
              <li key={`${t.locale}:${t.slug}`} className="rounded border p-4">
                <div className="font-medium text-slate-900">{t.title || t.slug}</div>
                <div className="mt-3">
                  <Link href={`/${locale}/topics/${t.slug}`} className="text-sm text-cyan-700 underline hover:text-cyan-900">
                    {isZh ? '阅读' : 'Read'}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer locale={locale} />
    </>
  );
}

export const revalidate = 300;
