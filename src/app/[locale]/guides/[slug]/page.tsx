import type { Metadata } from 'next';
import Markdown from '@/components/Markdown';
import TocSidebar from '@/components/TocSidebar';
import ValueModules from '@/components/ValueModules';
import { slugifyHeadingId } from '@/lib/headingIds';
import { permanentRedirect } from 'next/navigation';

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
  try {
    const base = resolveApiBaseAbsolute();
    // During build there is no request host; avoid throwing/attempting a bad fetch.
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

function extractMetaDescriptionFromMarkdown(md: string, maxLen = 160): string | undefined {
  if (!md) return undefined;

  const clip = (s: string): string | undefined => {
    const t = s.replace(/\s+/g, ' ').trim();
    if (!t) return undefined;
    if (t.length <= maxLen) return t;
    const clipped = t.slice(0, maxLen - 1).trimEnd();
    return `${clipped}…`;
  };

  const toPlain = (src: string): string => {
    let text = src;
    text = text.replace(/```[\s\S]*?```/g, '\n');
    text = text.replace(/<[^>]+>/g, ' ');
    text = text
      .split('\n')
      .filter((line) => {
        const t = line.trim();
        if (!t) return true;
        if (/^#{1,6}\s+/.test(t)) return false;
        if (/^---+$/.test(t)) return false;
        return true;
      })
      .join('\n');
    text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    text = text
      .replace(/`([^`]+)`/g, '$1')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/^\s*>\s?/gm, '')
      .replace(/["“”]/g, '');
    return text;
  };

  const isSentenceLike = (t: string): boolean => {
    const s = t.trim();
    if (!s) return false;
    if (s.length < 30) return false;
    if (/[。！？.!?]/.test(s)) return true;
    if (/[:;；：]/.test(s) && s.length >= 40) return true;
    if (s.length >= 80) return true;
    return false;
  };

  const isListLabel = (t: string): boolean => {
    const s = t.trim();
    if (!s) return true;
    if (/[。！？.!?:;；：]/.test(s)) return false;
    const words = s.split(/\s+/).filter(Boolean);
    if (words.length <= 4 && s.length <= 32) return true;
    if (s.length <= 12) return true;
    return false;
  };

  const pre = md.replace(/```[\s\S]*?```/g, '\n').replace(/<[^>]+>/g, ' ');
  const rawBlocks = pre
    .split(/\n\s*\n/g)
    .map((b) => b.trim())
    .filter(Boolean);

  for (const rawBlock of rawBlocks) {
    const lines = rawBlock
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    const listLines = lines.filter((l) => /^\s*([-*+]|(\d+\.))\s+/.test(l));
    const looksLikeListBlock = listLines.length >= 2;

    if (looksLikeListBlock) {
      for (const l of lines) {
        if (!/^\s*([-*+]|(\d+\.))\s+/.test(l)) continue;
        const withoutMarker = l.replace(/^\s*([-*+]|(\d+\.))\s+/, '');
        const plain = clip(toPlain(withoutMarker));
        if (!plain) continue;
        if (isListLabel(plain)) continue;
        if (!isSentenceLike(plain)) continue;
        return plain;
      }
      continue;
    }

    const plain = clip(toPlain(rawBlock));
    if (!plain) continue;
    if (!isSentenceLike(plain)) continue;
    return plain;
  }

  const first = rawBlocks[0] ? clip(toPlain(rawBlocks[0])) : undefined;
  return first;
}

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  const otherLocale = localeKey === 'en' ? 'zh' : 'en';

  // Deindex thin/placeholder pages (keep follow for internal discovery).
  if (localeKey === 'en' && (params.slug === 'proquest' || params.slug === 'ucl-edu')) {
    return {
      title: params.slug,
      robots: { index: false, follow: true },
      alternates: {
        canonical: `/${localeKey}/guides/${encodeURIComponent(params.slug)}`,
        languages: {
          en: `/en/guides/${encodeURIComponent(params.slug)}`,
          zh: `/zh/guides/${encodeURIComponent(params.slug)}`,
        },
      },
    };
  }

  // Legacy duplicate: prefer apa-org.
  if (localeKey === 'en' && params.slug === 'apa-format') {
    return {
      title: 'APA Style — Paper format (7th edition)',
      robots: { index: false, follow: true },
      alternates: {
        canonical: '/en/guides/apa-org',
        languages: {
          en: '/en/guides/apa-org',
          zh: '/zh/guides/apa-org',
        },
      },
    };
  }

  const g = await fetchGuide(params.slug, localeKey);
  if (!g) return { title: 'Guide Not Found' };

  const other = await fetchGuide(params.slug, otherLocale);
  const otherAvailable = !!other && other.locale === otherLocale;
  const languages = otherAvailable
    ? {
        [localeKey]: `/${localeKey}/guides/${encodeURIComponent(params.slug)}`,
        [otherLocale]: `/${otherLocale}/guides/${encodeURIComponent(params.slug)}`,
      }
    : {
        [localeKey]: `/${localeKey}/guides/${encodeURIComponent(params.slug)}`,
      };

  const blocks = Array.isArray((g.sections as any)?.blocks)
    ? ((g.sections as any).blocks as { md?: string }[])
    : [];
  const firstMd = blocks.find((b) => !!b?.md)?.md || '';
  const fallbackDesc =
    extractMetaDescriptionFromMarkdown(firstMd) ||
    extractMetaDescriptionFromMarkdown(g.rawtext || '') ||
    undefined;
  const description = g.meta_desc || fallbackDesc;

  return {
    title: g.meta_title || g.title || `${g.slug} — Guide`,
    description,
    keywords: g.keywords?.items,
    alternates: {
      canonical: `/${localeKey}/guides/${encodeURIComponent(params.slug)}`,
      languages,
    },
    openGraph: {
      title: g.meta_title || g.title || `${g.slug} — Guide`,
      description,
      url: `/${localeKey}/guides/${encodeURIComponent(params.slug)}`,
      type: 'article',
    },
  };
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{children}</span>;
}

export default async function Page({ params }: { params: { locale: string; slug: string } }) {
  const isZh = params.locale === 'zh';

  // Legacy slugs (previous static pages): keep URLs working without maintaining duplicate/placeholder pages.
  if (params.slug === 'apa-format') {
    permanentRedirect(`/${isZh ? 'zh' : 'en'}/guides/apa-org`);
  }
  if (params.slug === 'mla-format') {
    permanentRedirect(`/${isZh ? 'zh' : 'en'}/guides/mla-org`);
  }

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
  const hasTemplate = !!guide.template_id;

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
      ? '• Bronze 模板'
      : '• Bronze template';
  const templateTierClass =
    templateTier === 'gold'
      ? 'bg-amber-500/10 text-amber-800 border border-amber-300'
      : templateTier === 'silver'
      ? 'bg-slate-500/10 text-slate-800 border border-slate-300'
      : 'bg-orange-500/10 text-orange-800 border border-orange-300';

  const guideType = (guide.guide_type || '').toLowerCase();
  const guideTypeLabel =
    guideType === 'thesis'
      ? isZh
        ? '论文格式'
        : 'Thesis format'
      : guideType === 'journal'
      ? isZh
        ? '期刊/会议'
        : 'Journal / conference'
      : guideType === 'style'
      ? isZh
        ? '写作/格式规范'
        : 'Style guide'
      : isZh
      ? '指南'
      : 'Guide';
  const metaSourceTitle = guide.source?.title || guide.meta?.entity_name || '';
  const metaLine = [
    metaSourceTitle,
    guideTypeLabel,
    guide.version || guide.source?.version,
  ]
    .filter(Boolean)
    .join(' • ');
  const entity = guide.meta?.entity_name || '';
  const degreeText = guide.meta?.degree_text || '';
  const showEntityBadge =
    !!entity &&
    entity.toLowerCase() !== title.toLowerCase() &&
    (!!metaSourceTitle ? entity.toLowerCase() !== metaSourceTitle.toLowerCase() : true);
  const guideMode = guide.meta?.guide_mode || 'full';
  const isIntentOnly = guide.isIntentOnly ?? guideMode === 'intent_only';
  const blocks = Array.isArray((guide.sections as any)?.blocks)
    ? ((guide.sections as any).blocks as { id?: string; title?: string; md?: string }[])
    : [];
  const hasBlocks = blocks.length > 0;
  const hasMainContent = hasBlocks;
  const tocMd = hasBlocks
    ? blocks
        .map((b) => {
          const heading = b.title ? `## ${b.title}\n\n` : '';
          return `${heading}${b.md || ''}`.trim();
        })
        .filter(Boolean)
        .join('\n\n\n')
    : '';
  const toolHref = hasTemplate
    ? `/${params.locale}/tool?from=guide&slug=${encodeURIComponent(guide.slug)}&template_id=${encodeURIComponent(guide.template_id || '')}`
    : `/${params.locale}/tool?from=guide&slug=${encodeURIComponent(guide.slug)}`;
  const studioHref = hasTemplate
    ? `/${params.locale}/studio?from=guide&slug=${encodeURIComponent(guide.slug)}&template_id=${encodeURIComponent(guide.template_id || '')}`
    : `/${params.locale}/studio?from=guide&slug=${encodeURIComponent(guide.slug)}`;
  const valueModules = ((guide.sections as any)?.value_modules || []) as any[];
  const hasValueModules = Array.isArray(valueModules) && valueModules.some((m) => (m?.title || m?.md));

  const summaryCard = (guide.sections as any)?.summary?.card as
    | {
        overviewTitle?: string;
        overviewParagraphs?: string[];
        howTitle?: string;
        howSteps?: string[];
        sourceLabel?: string;
      }
    | null;

  const isGenericSummary = (card: typeof summaryCard): boolean => {
    if (!card) return true;
    const p0 = (card.overviewParagraphs || [])[0] || '';
    if (!p0) return true;
    if (p0.includes('本页基于官方格式指南')) return true;
    if (p0.includes('This page summarizes the main layout rules')) return true;
    if (p0.includes('This page is based on the APA Style')) return true;
    return false;
  };

  const effectiveSummaryCard: NonNullable<typeof summaryCard> | null = (() => {
    const base = summaryCard || null;
    if (base && !isGenericSummary(base)) return base;

    const pageTitle = guide.title || guide.slug;
    const sourceLabel = base?.sourceLabel || guide.source?.title || (isZh ? '官方格式指南来源' : 'Official guideline source');

    const overviewParagraphs = isZh
      ? [`本页用于将「${pageTitle}」的版式要求落地到 Word（.docx）：你可以直接使用模板格式化，也可以上传文档做一次格式检查。`]
      : [
          `Use this page to apply “${pageTitle}” formatting to Word (.docx): format with the template, or upload a document to run a format check.`,
        ];

    const howSteps = isZh
      ? [
          `点击上方“使用本模板格式化文档”，进入工具页（已选中「${pageTitle}」模板）。`,
          '上传你的 .docx：可先点击“检查格式”获取评分与问题列表，再执行格式化。',
          '下载结果，并结合下方正文与自查要点核对关键格式。',
        ]
      : [
          'Click “Format using this template” to open the tool with this template pre-selected.',
          'Upload your .docx: you can run “Check formatting” first to get a score and issues, then format.',
          'Download the result and verify key rules using the sections and self-check notes below.',
        ];

    return {
      overviewTitle: isZh ? '速览' : 'At a glance',
      overviewParagraphs,
      howTitle: isZh ? '如何格式化 / 如何检查格式' : 'How to format / how to check formatting',
      howSteps,
      sourceLabel,
    };
  })();

  const intentHref = `/${params.locale}/guides/${encodeURIComponent(
    guide.slug,
  )}?intent=need-template&pos=hero`;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span>{metaLine || (isZh ? '格式指南' : 'Formatting guide')}</span>
          {hasTemplate ? (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${templateTierClass}`}
            >
              {templateTierLabel}
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {showEntityBadge ? <Badge>{entity}</Badge> : null}
          {degreeText ? <Badge>{degreeText}</Badge> : null}
        </div>
      </div>

      {/* Actions (use template) + Source card */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {hasTemplate ? (
            <a
              href={studioHref}
              className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              {isZh ? '在工作台上传并检查/格式化' : 'Upload & check/format in Studio'}
            </a>
          ) : (
            <a
              href={toolHref}
              className="inline-flex items-center rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200"
              title={isZh ? '前往工具页选择模板并格式化文档' : 'Go to tool to pick a template and format your document'}
            >
              {isZh ? '前往工具页' : 'Go to tool'}
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
            <span className="text-xs text-slate-500">{isZh ? '暂无模板，可在工具页选择其他模板' : 'No template yet; pick another template in the tool'}</span>
          )}
        </div>
      </div>

      {/* Summary & how-to section (from backend summary.card) */}
      {effectiveSummaryCard ? (
        <section className="mt-10 mx-auto max-w-[840px]">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md shadow-slate-200/70">
            <h2 className="mb-3 text-2xl font-semibold text-slate-900">{effectiveSummaryCard.overviewTitle}</h2>
            <div className="space-y-3 text-slate-800">
              {(effectiveSummaryCard.overviewParagraphs || []).map((p, idx) => (
                <p key={idx} className="leading-7">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-6">
              <h3 className="text-base font-semibold text-slate-900">{effectiveSummaryCard.howTitle}</h3>
              <ol className="mt-2 space-y-2 text-sm text-slate-700">
                {(effectiveSummaryCard.howSteps || []).map((s, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-[11px] font-semibold text-cyan-700 ring-1 ring-cyan-200">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{s}</span>
                  </li>
                ))}
              </ol>
              {guide.source?.url && effectiveSummaryCard.sourceLabel ? (
                <p className="mt-4 text-xs text-slate-500">
                  {isZh ? '来源：' : 'Source: '}{' '}
                  <a
                    href={guide.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-700 hover:text-cyan-900 underline"
                  >
                    {effectiveSummaryCard.sourceLabel}
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* Value modules (single column) */}
      {hasValueModules ? (
        <section className="mt-8 mx-auto max-w-5xl space-y-6">
          <ValueModules locale={params.locale} modules={valueModules} />
        </section>
      ) : null}

      {/* Main content: optional (we may omit long-form guideline text for landing-page quality) */}
      {hasMainContent ? (
        <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_minmax(0,840px)_280px]">
          {/* Left spacer for wider center column on large screens */}
          <div className="hidden lg:block" />
          <div>
            <div className="rounded-lg border p-4">
              <article className="space-y-8">
                {blocks.map((b, idx) => (
                  <section key={`${b.id || 'block'}-${idx}`}>
                    {b.title ? (
                      <h2
                        id={slugifyHeadingId(b.title)}
                        className="mb-3 scroll-mt-24 text-2xl font-semibold text-slate-900"
                      >
                        {b.title}
                      </h2>
                    ) : null}
                    {b.md ? <Markdown md={b.md} /> : null}
                  </section>
                ))}
              </article>
            </div>
          </div>
          {/* Right sticky, collapsible TOC */}
          <div className="hidden lg:block">
            {tocMd ? <TocSidebar md={tocMd} title={isZh ? '目录' : 'Contents'} label={isZh ? '目录' : 'Contents'} /> : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}
