import type { Metadata } from 'next';
import Markdown from '@/components/Markdown';
import Toc from '@/components/Toc';

type Guide = {
  slug: string;
  locale: string;
  title?: string;
  meta_title?: string;
  meta_desc?: string;
  keywords?: { items?: string[] };
  version?: string | null;
  sections?: Record<string, any>;
  guide_type?: string | null; // thesis | journal | style | platform
  rawtext?: string | null; // markdown
  rawtext_format?: string | null; // md | txt | html
  source?: { url?: string | null; title?: string | null; version?: string | null; lastChecked?: string | null; sourceType?: string | null } | null;
  meta?: { entity_type?: string; entity_name?: string; degree_text?: string | null; notes?: string | null } | null;
  status?: string;
};

import { headers } from 'next/headers';

const RUNTIME_API_BASE = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '') || '/api';

function resolveApiBaseAbsolute(): string {
  // If configured with absolute base, use it
  if (RUNTIME_API_BASE && !RUNTIME_API_BASE.startsWith('/')) return RUNTIME_API_BASE;
  // Otherwise, build absolute from current request headers
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'http';
  if (!host) return RUNTIME_API_BASE; // fallback (may still fail in node fetch)
  return `${proto}://${host}${RUNTIME_API_BASE}`.replace(/\/$/, '');
}

async function fetchGuide(slug: string, locale: string): Promise<Guide | null> {
  const base = resolveApiBaseAbsolute();
  const url = `${base}/guides/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`;
  const isProd = process.env.NODE_ENV === 'production';
  const res = await fetch(url, isProd ? { next: { revalidate: 300 } } : { cache: 'no-store' });
  if (!res.ok) return null;
  return (await res.json()) as Guide;
}

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const g = await fetchGuide(params.slug, params.locale);
  if (!g) return { title: 'Guide Not Found' };
  return {
    title: g.meta_title || g.title || `${g.slug} — Guide`,
    description: g.meta_desc || undefined,
    keywords: g.keywords?.items,
  };
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{children}</span>;
}

export default async function Page({ params }: { params: { locale: string; slug: string } }) {
  const isZh = params.locale === 'zh';
  const guide = await fetchGuide(params.slug, params.locale);
  if (!guide) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">{isZh ? '未找到指南' : 'Guide Not Found'}</h1>
        <p className="mt-2 text-slate-600">{isZh ? '请检查链接或稍后重试。' : 'Please check the link or try again later.'}</p>
      </main>
    );
  }

  const title = guide.title || guide.slug;
  const sub = [guide.guide_type || 'guide', guide.version || guide.source?.version].filter(Boolean).join(' • ');
  const entity = guide.meta?.entity_name || '';
  const degreeText = guide.meta?.degree_text || '';
  const raw = guide.rawtext || '';
  const hasMd = (guide.rawtext_format || 'md') === 'md';

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-600">{sub}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {entity ? <Badge>{entity}</Badge> : null}
        {degreeText ? <Badge>{degreeText}</Badge> : null}
        {guide.guide_type ? <Badge>{guide.guide_type}</Badge> : null}
      </div>

      {/* Source card */}
      {guide.source ? (
        <div className="mt-6 rounded-lg border p-4 text-sm">
          <div className="font-medium text-slate-900">{isZh ? '来源信息' : 'Source'}</div>
          <div className="mt-1 text-slate-700">
            {guide.source.title ? <div>{guide.source.title}</div> : null}
            {guide.source.url ? (
              <div>
                <a className="text-cyan-700 hover:text-cyan-900 underline" href={guide.source.url} target="_blank" rel="noopener noreferrer">
                  {guide.source.url}
                </a>
              </div>
            ) : null}
            <div className="text-slate-500">
              {isZh ? '最近检查：' : 'Last checked: '} {guide.source.lastChecked || '—'}
            </div>
          </div>
        </div>
      ) : null}

      {/* Summary (sections) */}
{/*      {guide.sections?.fulltext?.paragraphs?.length ? (
        <section className="mt-10">
          <h2 className="mb-3 text-2xl font-semibold text-slate-900">{isZh ? '概览' : 'Overview'}</h2>
          <div className="space-y-3 text-slate-800">
            {guide.sections.fulltext.paragraphs.slice(0, 3).map((p: string, idx: number) => (
              <p key={idx} className="leading-7">
                {p}
              </p>
            ))}
          </div>
        </section>
      ) : null}*/}

      {/* Raw full text */}
      <section className="mt-12 grid gap-6 md:grid-cols-[240px_1fr]">
        <div>{hasMd ? <Toc md={raw} /> : null}</div>
        <div>
          <h2 className="mb-3 text-2xl font-semibold text-slate-900">{isZh ? '原文全文（已清洗）' : 'Original Guideline (cleaned)'}</h2>
          <div className="rounded-lg border p-4">
            {hasMd ? <Markdown md={raw} /> : <pre className="whitespace-pre-wrap text-slate-800">{raw}</pre>}
          </div>
        </div>
      </section>
    </main>
  );
}
