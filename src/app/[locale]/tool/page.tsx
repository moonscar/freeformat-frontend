import Link from 'next/link';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/layout/HeroSection';
import Footer from '@/components/layout/Footer';
import { getT } from '@/i18n';
import InfoSections from '@/components/sections/InfoSections';
import FAQ from '@/components/sections/FAQ';
import AnchorNav from '@/components/sections/AnchorNav';
import ToolWorkArea from '@/components/ToolWorkArea';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  const canonical = `/${localeKey}/tool`;
  const title =
    localeKey === 'zh'
      ? '论文 Word 格式化工具（.docx 自动排版）'
      : 'Thesis & Word Formatting Tool (.docx Auto‑format)';
  const description =
    localeKey === 'zh'
      ? 'FreeFormat 是一款论文 Word（.docx）格式化与排版工具：选择已有模板（如 APA/MLA/学校论文格式），一键应用字体字号、行距、页边距、标题层级等格式。'
      : 'FreeFormat formats Word (.docx) theses and academic papers: pick a template (APA/MLA/school) and auto‑apply fonts, spacing, margins, headings and more.';
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: '/en/tool',
        zh: '/zh/tool',
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
  };
}

export default function ToolPage({ params, searchParams }: { params: { locale: string }; searchParams?: Record<string, string | string[] | undefined> }) {
  const isProd = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
  const adsEnabled = isProd && process.env.NEXT_PUBLIC_ADSENSE_ENABLED === '1';
  const adsClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
  const locale = params.locale === 'en' ? 'en' : 'zh';
  const isZh = locale === 'zh';
  const dict = getT(locale as any);
  const t = dict.tool;
  const info = t.info || dict.landing.info;
  const from = (searchParams?.from as string) || '';
  const guideSlug = (searchParams?.slug as string) || '';
  const templateId = (searchParams?.template_id as string) || '';
  const isFromGuide = from === 'guide' && !!guideSlug;

  const popularGuides = isZh
    ? [
        { slug: 'ustc-edu', label: 'USTC 中国科学技术大学（本科毕业论文）' },
        { slug: 'pku-edu', label: 'PKU 北京大学（研究生学位论文）' },
        { slug: 'tsinghua-edu', label: '清华大学（本科论文写作指南）' },
        { slug: 'zju-edu', label: '浙江大学（研究生学位论文）' },
        { slug: 'hit-edu', label: '哈尔滨工业大学（研究生学位论文）' },
        { slug: 'sjtu-edu', label: '上海交通大学（本科毕业设计/论文）' },
        { slug: 'xjtu-edu', label: '西安交通大学（硕士、博士学位论文）' },
      ]
    : [
        { slug: 'apa-org', label: 'APA (paper format)' },
        { slug: 'mla-org', label: 'MLA (general format)' },
        { slug: 'ieee-org', label: 'IEEE (general paper format)' },
        { slug: 'ama-style-org', label: 'AMA (HSL guide)' },
        { slug: 'berkeley-edu', label: 'UC Berkeley (dissertation format)' },
        { slug: 'harvard-edu', label: 'Harvard GSAS (dissertation format)' },
        { slug: 'stanford-edu', label: 'Stanford (thesis/dissertation)' },
      ];
  return (
    <>
      {adsEnabled && adsClient ? (
        <>
          <meta name="google-adsense-account" content={adsClient} />
          <script
            async
            crossOrigin="anonymous"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            data-ad-client={adsClient}
          />
        </>
      ) : null}
      <Header locale={locale} />
      <HeroSection title={t.heroTitle} desc={t.heroDesc} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        {/* Deliverables & evidence (above the fold) */}
        <section className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">{isZh ? '格式检查报告' : 'Format check report'}</div>
            <div className="mt-1 text-xs text-slate-600">
              {isZh ? '评分 + 问题列表，先知道会改什么。' : 'Score + issues so you know what will change.'}
            </div>
            <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
              <div className="font-semibold">{isZh ? '示例输出' : 'Example'}</div>
              <div className="mt-1">
                {isZh ? 'Score: 78 · Issues: 6' : 'Score: 78 · Issues: 6'}
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">{isZh ? '格式化后的 .docx' : 'A formatted .docx'}</div>
            <div className="mt-1 text-xs text-slate-600">
              {isZh ? '应用模板样式，下载后即可提交或微调。' : 'Template styles applied. Download and submit or fine‑tune.'}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">{isZh ? '2 分钟自查清单' : '2‑minute checklist'}</div>
            <div className="mt-1 text-xs text-slate-600">
              {isZh ? '把“不支持”变成可控步骤。' : 'Turn “not supported” into a predictable workflow.'}
            </div>
          </div>
        </section>

        <section id="tool-workarea" className="rounded-2xl border border-dashed p-6 text-slate-700">
        {isFromGuide ? (
          <div className="mb-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <div className="font-medium text-slate-900">
                  {locale === 'zh' ? '已从指南跳转' : 'Came from guide'}
                </div>
                <div className="text-slate-700">
                  {locale === 'zh' ? '指南' : 'Guide'}: <span className="font-mono">{guideSlug}</span>
                </div>
                <a
                  className="text-cyan-700 underline"
                  href={`/${params.locale}/guides/${guideSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {locale === 'zh' ? '查看关联指南' : 'View related guide'}
                </a>
                <a
                  className="text-cyan-700 underline"
                  href={`/${params.locale}/guides?from=tool&slug=${encodeURIComponent(guideSlug)}&action=change-template#search`}
                >
                  {locale === 'zh' ? '更换模板' : 'Change template'}
                </a>
              </div>
            </div>
          ) : null}
          <ToolWorkArea
            locale={locale as any}
            guideSlug={guideSlug}
            initialTemplateId={templateId}
            popularGuides={popularGuides}
          />
        </section>

        {/* Taskified scope: what we fix vs. what you do in Word */}
        <section id="scope" className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">{isZh ? '范围与自查（先交付，再验证）' : 'Scope & self‑check (deliver + verify)'}</h2>
          <div className="mt-4 grid gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">{isZh ? '我们会检查/修复（可自动化）' : 'We check & fix (auto)'}</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                <li>{isZh ? '行距 / 段距 / 首行缩进（含清理空格与 Tab）' : 'Spacing & indents (including removing extra spaces/tabs)'}</li>
                <li>{isZh ? '正文与标题样式统一（多级标题；三级标题尽力而为）' : 'Consistent body & heading styles (multi‑level; level‑3 best effort)'}</li>
                <li>{isZh ? '参考文献版式、图表题注段落样式' : 'Reference list layout and caption paragraph styles'}</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-900">{isZh ? '你仍需要在 Word 手动做（通常 1–2 分钟）' : 'You still do in Word (usually 1–2 minutes)'}</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                <li>{isZh ? '更新目录（TOC）与域（fields）' : 'Update TOC and fields'}</li>
                <li>{isZh ? '复杂分节页码（正文从 1 开始、罗马/阿拉伯混用）' : 'Complex section‑based page numbering (front matter vs body)'}</li>
                <li>{isZh ? '复杂多级编号体系的重建/纠错（如有）' : 'Rebuild/fix multi‑level numbering systems (if needed)'}</li>
              </ul>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-600">
            {isZh
              ? '提示：当前暂不支持“上传指南自动生成模板”，请使用已有模板或从指南页进入后再检查/格式化。'
              : 'Note: we currently support existing templates only (no template building from uploaded guidelines yet).'}
          </div>
        </section>

        {/* Anchor nav + 说明与 FAQ，与反馈页保持一致布局 */}
        <AnchorNav
          items={[
            { href: '#what', label: info.what.title },
            { href: '#how', label: info.how.title },
            { href: '#use', label: info.use.title },
            { href: '#faq', label: info.faq.title },
          ]}
        />
        <InfoSections
          what={info.what}
          how={info.how}
          use={info.use}
          subheads={info.subheads}
        />

        <div id="faq" className="mt-10">
          <FAQ title={info.faq.title} items={info.faq.items} />
        </div>

        {/* Internal links: popular guides (SEO / navigation) */}
        <section id="popular-guides" className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            {isZh ? '热门指南' : 'Popular guides'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isZh
              ? '常用模板与学校论文格式的快速入口：'
              : 'Quick links to commonly used templates and thesis formats:'}
          </p>
          <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            {popularGuides.map((g) => (
              <li key={g.slug}>
                <Link className="text-cyan-700 underline hover:text-cyan-900" href={`/${locale}/guides/${g.slug}`}>
                  {g.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-sm">
            <Link className="text-cyan-700 underline hover:text-cyan-900" href={`/${locale}/guides`}>
              {isZh ? '查看全部指南' : 'Browse all guides'}
            </Link>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
