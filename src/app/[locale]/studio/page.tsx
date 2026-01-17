import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StudioWorkArea from '@/components/StudioWorkArea';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  const canonical = `/${localeKey}/studio`;
  return {
    title: localeKey === 'zh' ? '格式工作台（预览版）' : 'Formatting Studio (Preview)',
    description:
      localeKey === 'zh'
        ? '上传 Word（.docx），预览格式化结果，并按段落类型调整模板参数后重新格式化（仅本次会话有效）。'
        : 'Upload a Word (.docx), preview formatted output, and adjust template parameters by block type (session-only).',
    alternates: {
      canonical,
      languages: {
        en: '/en/studio',
        zh: '/zh/studio',
      },
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      url: canonical,
      type: 'website',
    },
  };
}

export default function StudioPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  return (
    <>
      <Header locale={locale} />
      <main className="mx-auto max-w-6xl px-4 py-8 text-slate-900">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">{locale === 'zh' ? '格式工作台（预览版）' : 'Formatting Studio (Preview)'}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            {locale === 'zh'
              ? '这个页面用于“看得见地”反复格式化：选择模板并上传 .docx，预览结果；通过搜索/定位选择要修改的段落类型，然后调整参数并重新格式化。参数仅在当前会话中有效。'
              : 'This page is for visible iteration: select a template and upload a .docx, preview the result, then adjust parameters for the selected block type and reformat. Changes are session-only.'}
          </p>
        </div>
        <StudioWorkArea locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}

