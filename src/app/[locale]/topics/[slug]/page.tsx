import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { permanentRedirect } from 'next/navigation';
import Markdown from '@/components/Markdown';
import ValueModules from '@/components/ValueModules';

type Guide = {
  slug: string;
  locale: string;
  title?: string;
  meta_title?: string;
  meta_desc?: string;
  keywords?: { items?: string[] };
  version?: string | null;
  guide_type?: string | null;
  sections?: Record<string, any>;
  source?: { url?: string | null; title?: string | null } | null;
};

const RUNTIME_API_BASE = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '') || '/api';

function resolveApiBaseAbsolute(): string {
  if (RUNTIME_API_BASE && !RUNTIME_API_BASE.startsWith('/')) return RUNTIME_API_BASE;
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'http';
  if (!host) return RUNTIME_API_BASE;
  return `${proto}://${host}${RUNTIME_API_BASE}`.replace(/\/$/, '');
}

async function fetchGuide(slug: string, locale: string): Promise<Guide | null> {
  try {
    const base = resolveApiBaseAbsolute();
    if (!base || base.startsWith('/')) return null;
    const url = `${base}/guides/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`;
    const isProd = process.env.NODE_ENV === 'production';
    const res = await fetch(url, isProd ? { next: { revalidate: 300 } } : { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as Guide;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  const g = await fetchGuide(params.slug, localeKey);
  if (!g) return { title: 'Topic Not Found' };
  return {
    title: g.meta_title || g.title || `${g.slug} — Topic`,
    description: g.meta_desc || undefined,
    keywords: g.keywords?.items,
    alternates: {
      canonical: `/${localeKey}/topics/${encodeURIComponent(params.slug)}`,
      languages: {
        en: `/en/topics/${encodeURIComponent(params.slug)}`,
        zh: `/zh/topics/${encodeURIComponent(params.slug)}`,
      },
    },
    openGraph: {
      url: `/${localeKey}/topics/${encodeURIComponent(params.slug)}`,
      type: 'article',
    },
  };
}

export default async function TopicPage({ params }: { params: { locale: string; slug: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  const isZh = locale === 'zh';
  const g = await fetchGuide(params.slug, locale);

  if (!g) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">{isZh ? '未找到专题' : 'Topic Not Found'}</h1>
        <p className="mt-2 text-slate-600">{isZh ? '请检查链接或稍后重试。' : 'Please check the link or try again later.'}</p>
      </main>
    );
  }

  if ((g.guide_type || '').toLowerCase() !== 'topic') {
    permanentRedirect(`/${locale}/guides/${encodeURIComponent(g.slug)}`);
  }

  const blocks = Array.isArray((g.sections as any)?.blocks)
    ? ((g.sections as any).blocks as { title?: string; md?: string }[])
    : [];
  const valueModules = ((g.sections as any)?.value_modules || []) as any[];
  const hasValueModules = Array.isArray(valueModules) && valueModules.some((m) => (m?.title || m?.md));

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">{g.title || g.slug}</h1>
        {g.meta_desc ? <p className="mt-2 text-slate-600">{g.meta_desc}</p> : null}
      </div>

      {hasValueModules ? (
        <section className="mb-10">
          <ValueModules locale={locale} modules={valueModules} />
        </section>
      ) : null}

      {blocks.length ? (
        <article className="space-y-10">
          {blocks.map((b, idx) => (
            <section key={idx}>
              {b.title ? <h2 className="mb-3 text-2xl font-semibold text-slate-900">{b.title}</h2> : null}
              {b.md ? <Markdown md={b.md} /> : null}
            </section>
          ))}
        </article>
      ) : (
        <div className="rounded border p-4 text-sm text-slate-600">{isZh ? '暂无内容。' : 'No content yet.'}</div>
      )}
    </main>
  );
}

export const revalidate = 300;

