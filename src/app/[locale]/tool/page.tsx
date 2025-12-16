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
  const dict = getT(locale as any);
  const t = dict.tool;
  const from = (searchParams?.from as string) || '';
  const guideSlug = (searchParams?.slug as string) || '';
  const templateId = (searchParams?.template_id as string) || '';
  const isFromGuide = from === 'guide' && !!guideSlug;
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
        {/* Anchor nav + 说明与 FAQ，与反馈页保持一致布局 */}
        <AnchorNav
          items={[
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
