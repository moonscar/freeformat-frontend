import type { Metadata } from 'next';
import Markdown from '@/components/Markdown';
import TocSidebar from '@/components/TocSidebar';
import { slugifyHeadingId } from '@/lib/headingIds';

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
  template_id?: string | null; // optional backend template reference
  source?: { url?: string | null; title?: string | null; version?: string | null; lastChecked?: string | null; sourceType?: string | null } | null;
  meta?: {
    entity_type?: string;
    entity_name?: string;
    degree_text?: string | null;
    guide_mode?: string | null;
    notes?: string | null;
    template_tier?: string | null;
    template_status?: string | null;
    template_quality?: string | null;
  } | null;
  isIntentOnly?: boolean;
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
  const guideMode = guide.meta?.guide_mode || 'full';
  const isIntentOnly = guide.isIntentOnly ?? guideMode === 'intent_only';
  const raw = guide.rawtext || '';
  const hasMd = (guide.rawtext_format || 'md') === 'md';
  const blocks = Array.isArray((guide.sections as any)?.blocks)
    ? ((guide.sections as any).blocks as { id?: string; title?: string; md?: string }[])
    : [];
  const hasBlocks = blocks.length > 0;
  const tocMd = hasBlocks
    ? blocks
        .map((b) => {
          const heading = b.title ? `## ${b.title}\n\n` : '';
          return `${heading}${b.md || ''}`.trim();
        })
        .filter(Boolean)
        .join('\n\n\n')
    : hasMd
    ? raw
    : '';
  const hasTemplate = !!guide.template_id;
  const toolHref = hasTemplate
    ? `/${params.locale}/tool?from=guide&slug=${encodeURIComponent(guide.slug)}&template_id=${encodeURIComponent(guide.template_id || '')}`
    : `/${params.locale}/tool?from=guide&slug=${encodeURIComponent(guide.slug)}`;

  const summaryCard = (guide.sections as any)?.summary?.card as
    | {
        overviewTitle?: string;
        overviewParagraphs?: string[];
        howTitle?: string;
        howSteps?: string[];
        sourceLabel?: string;
      }
    | null;

  const intentHref = `/${params.locale}/guides/${encodeURIComponent(
    guide.slug,
  )}?intent=need-template&pos=hero`;

  const templateTierRaw =
    guide.meta?.template_tier ||
    guide.meta?.template_status ||
    guide.meta?.template_quality ||
    null;
  const templateTier = (templateTierRaw || 'bronze').toLowerCase();
  const templateTierLabel =
    templateTier === 'gold'
      ? (isZh ? '★ Gold 模板（推荐）' : '★ Gold template (recommended)')
      : templateTier === 'silver'
      ? (isZh ? '◇ Silver 模板（可用）' : '◇ Silver template (good)')
      : isZh
      ? '• Bronze 模板（实验）'
      : '• Bronze template (experimental)';
  const templateTierClass =
    templateTier === 'gold'
      ? 'bg-amber-500/10 text-amber-800 border border-amber-300'
      : templateTier === 'silver'
      ? 'bg-slate-500/10 text-slate-800 border border-slate-300'
      : 'bg-orange-500/10 text-orange-800 border border-orange-300';

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-600">{sub}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {entity ? <Badge>{entity}</Badge> : null}
        {degreeText ? <Badge>{degreeText}</Badge> : null}
        {guide.guide_type ? <Badge>{guide.guide_type}</Badge> : null}
        {hasTemplate ? (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${templateTierClass}`}
          >
            {templateTierLabel}
          </span>
        ) : null}
      </div>

      {/* Actions (use template) + Source card */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {hasTemplate ? (
            <a
              href={toolHref}
              className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              {isZh ? '使用本模板格式化文档' : 'Format using this template'}
            </a>
          ) : (
            <a
              href={toolHref}
              className="inline-flex items-center rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200"
              title={isZh ? '未找到模板，前往工具页选择或生成' : 'No template found; go to tool to select or create'}
            >
              {isZh ? '前往工具页（选择/生成模板）' : 'Go to tool (select/create template)'}
            </a>
          )}
          {isIntentOnly ? (
            <a
              href={intentHref}
              className="inline-flex items-center rounded-md border border-cyan-600 px-3 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-50"
            >
              {isZh ? '我需要这份格式模板' : 'I need this formatting template'}
            </a>
          ) : null}
          {hasTemplate ? (
            <span className="text-xs text-slate-500">{isZh ? '已提供模板' : 'Template available'}</span>
          ) : (
            <span className="text-xs text-slate-500">{isZh ? '暂无模板，工具页可选择/生成' : 'No template; choose/create in tool'}</span>
          )}
        </div>
      </div>

      {/* Summary & how-to section (from backend summary.card) */}
      {summaryCard ? (
        <section className="mt-10 mx-auto max-w-[840px]">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md shadow-slate-200/70">
            <h2 className="mb-3 text-2xl font-semibold text-slate-900">{summaryCard.overviewTitle}</h2>
            <div className="space-y-3 text-slate-800">
              {(summaryCard.overviewParagraphs || []).map((p, idx) => (
                <p key={idx} className="leading-7">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-6">
              <h3 className="text-base font-semibold text-slate-900">{summaryCard.howTitle}</h3>
              <ol className="mt-2 space-y-2 text-sm text-slate-700">
                {(summaryCard.howSteps || []).map((s, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-[11px] font-semibold text-cyan-700 ring-1 ring-cyan-200">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{s}</span>
                  </li>
                ))}
              </ol>
              {guide.source?.url && summaryCard.sourceLabel ? (
                <p className="mt-4 text-xs text-slate-500">
                  {isZh ? '来源：' : 'Source: '}{' '}
                  <a
                    href={guide.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-700 hover:text-cyan-900 underline"
                  >
                    {summaryCard.sourceLabel}
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* Main content: prefer structured sections.blocks when available; fall back to raw full text */}
      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_minmax(0,840px)_280px]">
        {/* Left spacer for wider center column on large screens */}
        <div className="hidden lg:block" />
        <div>
          <div className="rounded-lg border p-4">
            {hasBlocks ? (
              <article className="space-y-8">
                {blocks.map((b, idx) => (
                  <section key={`${b.id || 'block'}-${idx}`}>
                    {b.title ? (
                      <h2 id={slugifyHeadingId(b.title)} className="mb-3 scroll-mt-24 text-2xl font-semibold text-slate-900">
                        {b.title}
                      </h2>
                    ) : null}
                    {b.md ? (
                      <Markdown md={b.md} />
                    ) : null}
                  </section>
                ))}
              </article>
            ) : hasMd ? (
              <>
                <h2 className="mb-3 text-2xl font-semibold text-slate-900">
                  {isZh ? '原文全文（已清洗）' : 'Original Guideline (cleaned)'}
                </h2>
                <Markdown md={raw} />
              </>
            ) : (
              <>
                <h2 className="mb-3 text-2xl font-semibold text-slate-900">
                  {isZh ? '原文全文（已清洗）' : 'Original Guideline (cleaned)'}
                </h2>
                <pre className="whitespace-pre-wrap text-slate-800">{raw}</pre>
              </>
            )}
          </div>
        </div>
        {/* Right sticky, collapsible TOC */}
        <div className="hidden lg:block">
          {tocMd ? (
            <TocSidebar md={tocMd} title={isZh ? '目录' : 'Contents'} label={isZh ? '目录' : 'Contents'} />
          ) : null}
        </div>
      </section>
    </main>
  );
}
