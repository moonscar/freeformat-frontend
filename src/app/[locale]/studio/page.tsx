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

export default function StudioPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  const sp = searchParams || {};
  const guideSlug =
    (typeof sp.slug === 'string' && sp.slug) ||
    (typeof sp.guide === 'string' && sp.guide) ||
    '';
  const templateId =
    (typeof sp.template_id === 'string' && sp.template_id) ||
    (typeof sp.templateId === 'string' && sp.templateId) ||
    (typeof sp.template === 'string' && sp.template) ||
    '';

  const fileId = (typeof sp.file_id === 'string' && sp.file_id) || '';
  const filename = (typeof sp.filename === 'string' && sp.filename) || '';
  const fileUrl = (typeof sp.file_url === 'string' && sp.file_url) || '';
  const formattedDocUrl = (typeof sp.formatted_doc_url === 'string' && sp.formatted_doc_url) || '';
  const docJsonUrl =
    (typeof sp.docjson_url === 'string' && sp.docjson_url) ||
    (typeof sp.format_map_url === 'string' && sp.format_map_url) ||
    '';

  const toolBase = `/${locale}/tool`;
  const toolParams = new URLSearchParams();
  if (guideSlug) toolParams.set('slug', guideSlug);
  if (templateId) toolParams.set('template_id', templateId);
  const toolHref = toolParams.toString() ? `${toolBase}?${toolParams.toString()}` : toolBase;
  const toolQuickHref = `${toolHref}#tool-workarea`;

  return (
    <>
      <Header locale={locale} />
      <main className="mx-auto max-w-6xl px-4 py-8 text-slate-900">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">{locale === 'zh' ? '格式工作台（预览版）' : 'Formatting Studio (Preview)'}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <a
              href={toolQuickHref}
              className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {locale === 'zh' ? '快速格式化（回到工具页）' : 'Quick format (back to tool)'}
            </a>
            <a
              href={toolHref}
              className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              {locale === 'zh' ? '返回快捷工具' : 'Back to quick tool'}
            </a>
          </div>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            {locale === 'zh'
              ? '这个页面用于“看得见地”反复格式化：选择模板并上传 .docx，预览结果；通过搜索/定位选择要修改的段落类型，然后调整参数并重新格式化。参数仅在当前会话中有效。'
              : 'This page is for visible iteration: select a template and upload a .docx, preview the result, then adjust parameters for the selected block type and reformat. Changes are session-only.'}
          </p>
        </div>
        <StudioWorkArea
          locale={locale}
          initialGuideSlug={guideSlug}
          initialTemplateId={templateId}
          initialUpload={fileId ? { file_id: fileId, filename, url: fileUrl } : null}
          initialFormattedUrl={formattedDocUrl}
          initialDocJsonUrl={docJsonUrl}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
