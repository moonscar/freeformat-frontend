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
      ? 'FreeFormat 是一款论文 Word（.docx）格式化与排版工具：选择已有模板或按学校/期刊规范生成模板，一键应用字体字号、行距、页边距、标题层级等格式。'
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
        <section className="mb-4 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
          {locale === 'zh' ? (
            <p>根据指南自定义模板功能即将上线，目前请先使用已提供的模板进行格式化。</p>
          ) : (
            <p>Custom templates based on your own guideline will be available soon. For now, please use the existing templates.</p>
          )}
        </section>
        {/* 工具区占位：后续接入 GuidelineBox / Upload / Templates */}
        <section className="rounded-2xl border border-dashed p-6 text-slate-700">
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
              {!templateId ? (
                <div className="mt-1 text-xs text-rose-600">
                  {locale === 'zh' ? '未检测到模板，请下方选择/生成或返回指南页。' : 'No template detected. Select/create below or go back to guide.'}
                </div>
              ) : null}
            </div>
          ) : null}
          <ToolWorkArea locale={locale as any} guideSlug={guideSlug} initialTemplateId={templateId} />
        </section>

        {/* P2: SEO-friendly sections (Word + thesis) */}
        <section id="fixes" className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            {isZh ? 'Word 论文排版常见问题（可自动修复）' : 'Common Word thesis formatting issues we can fix'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isZh
              ? '上传你的 Word（.docx）论文并选择模板后，我们会尽量把文档对齐到常见论文版式规范。'
              : 'Upload your Word (.docx) and pick a template; we will try to align your document to the required thesis/paper layout.'}
          </p>
          <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <li>{isZh ? '页边距、纸张尺寸（A4/Letter）' : 'Margins & paper size (A4/Letter)'}</li>
            <li>{isZh ? '行距、段前段后、对齐方式' : 'Line spacing, paragraph spacing & alignment'}</li>
            <li>{isZh ? '首行缩进（并清理多余空格/Tab）' : 'First-line indent (and remove extra spaces/tabs)'}</li>
            <li>{isZh ? '标题层级与章节标题样式' : 'Headings hierarchy and section title styles'}</li>
            <li>{isZh ? '页眉/页脚与页码样式' : 'Header/footer and page numbers'}</li>
            <li>{isZh ? '图表题注与编号（版式层面）' : 'Captions and numbering (layout only)'}</li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            {isZh
              ? '说明：我们主要处理“版式/排版”（字体、字号、间距、页边距等）；不会改写正文内容。'
              : 'Note: FreeFormat focuses on layout (fonts, sizes, spacing, margins). We do not rewrite your content.'}
          </p>
        </section>

        <section id="checklist" className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            {isZh ? '提交前检查清单（Checklist）' : 'Pre‑submission checklist'}
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>{isZh ? '纸张与页边距：是否符合学校/期刊要求' : 'Paper size & margins match the requirement'}</li>
            <li>{isZh ? '正文行距与缩进：是否统一' : 'Body spacing & indentation are consistent'}</li>
            <li>{isZh ? '标题层级：一级/二级标题样式是否区分清楚' : 'Headings: levels are consistent and distinguishable'}</li>
            <li>{isZh ? '页码：是否从指定页开始、位置是否正确' : 'Pagination: starts correctly and is placed correctly'}</li>
            <li>{isZh ? '图表题注：与正文间距与字体是否一致' : 'Captions: spacing and fonts are consistent'}</li>
          </ul>
        </section>

        {/* P3: Internal links to popular guides/templates */}
        <section id="popular" className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            {isZh ? '热门指南与模板（快速开始）' : 'Popular guides & templates (quick start)'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isZh
              ? '如果你需要按学校论文格式或常见规范排版，可以先从这些指南开始：'
              : 'If you need a ready-to-use thesis/Word template, start from these guides:'}
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

        {/* Anchor nav + 说明与 FAQ，与反馈页保持一致布局 */}
        <AnchorNav
          items={[
            { href: '#fixes', label: isZh ? '可修复项' : 'Fixes' },
            { href: '#checklist', label: isZh ? '检查清单' : 'Checklist' },
            { href: '#popular', label: isZh ? '热门模板' : 'Popular' },
            { href: '#what', label: dict.landing.info.what.title },
            { href: '#how', label: dict.landing.info.how.title },
            { href: '#use', label: dict.landing.info.use.title },
            { href: '#faq', label: dict.landing.info.faq.title },
          ]}
        />
        <InfoSections what={dict.landing.info.what} how={dict.landing.info.how} use={dict.landing.info.use} subheads={dict.landing.info.subheads} />
        <div id="faq">
          <FAQ title={dict.landing.info.faq.title} items={dict.landing.info.faq.items} />
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
