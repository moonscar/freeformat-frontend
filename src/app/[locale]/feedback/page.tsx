import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeedbackForm from '@/components/FeedbackForm';
import { getT } from '@/i18n';
import type { Metadata } from 'next';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  const canonical = `/${localeKey}/feedback`;
  return {
    alternates: {
      canonical,
      languages: {
        en: '/en/feedback',
        zh: '/zh/feedback',
      },
    },
    openGraph: {
      url: canonical,
      type: 'website',
    },
  };
}

export default function FeedbackPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  const dict = getT(locale as any);
  const isZh = locale === 'zh';

  return (
    <>
      <Header locale={locale} />
      <main className="mx-auto max-w-3xl px-4 py-10 text-slate-900">
        <section className="space-y-3 mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            {isZh ? '意见与格式反馈' : 'Feedback & Formatting Issues'}
          </h1>
          <p className="text-sm text-slate-600">
            {isZh
              ? '这里是 FreeFormat 的统一反馈入口。你可以报告格式化结果的问题、提交新的格式需求，或提出功能建议与 Bug 反馈。我们会优先处理与格式结果和已有模板质量相关的问题。'
              : 'This is the unified feedback entry for FreeFormat. You can report formatting issues, request new guides/templates, or share feature suggestions and bug reports. We prioritise issues related to formatting results and existing templates.'}
          </p>
          <p className="text-xs text-slate-500">
            {isZh
              ? '目前只接受文本反馈，请尽量提供具体的学校/期刊名称、指南链接以及格式不符合要求的具体位置。'
              : 'We currently accept text feedback only. Please include specific institution/journal names, guide URLs, and where the formatting does not match the official requirements when possible.'}
          </p>
        </section>
        <FeedbackForm locale={locale as any} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
