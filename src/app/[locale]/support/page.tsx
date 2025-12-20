import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  const canonical = `/${localeKey}/support`;
  return {
    title: localeKey === 'zh' ? '支持与常见问题' : 'Support & FAQ',
    description:
      localeKey === 'zh'
        ? 'FreeFormat 支持与常见问题：使用模板排版 Word（.docx）。'
        : 'Support and FAQ for FreeFormat: formatting Word (.docx) with templates.',
    alternates: {
      canonical,
      languages: {
        en: '/en/support',
        zh: '/zh/support',
      },
    },
    openGraph: {
      url: canonical,
      type: 'website',
    },
  };
}

export default function SupportPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  const isZh = locale === 'zh';
  return (
    <>
      <Header locale={locale} />
      <main className="mx-auto max-w-3xl px-4 py-10 text-slate-900">
        <h1 className="mb-4 text-3xl font-semibold">{isZh ? '支持与常见问题' : 'Support & FAQ'}</h1>
        <div className="space-y-6 text-sm leading-relaxed text-slate-800">
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '我该如何开始？' : 'How do I get started?'}</h2>
            <p className="mt-2">
              {isZh ? '进入工具页，搜索并选择一个模板，上传 .docx，然后下载格式化后的文档。' : 'Go to the tool page, pick a template, upload a .docx, and download the formatted document.'}{' '}
              <Link className="text-cyan-700 underline hover:text-cyan-900" href={`/${locale}/tool`}>
                {isZh ? '打开工具页' : 'Open tool'}
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{isZh ? '哪些问题最适合用 FreeFormat 修？' : 'What is FreeFormat best at?'}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>{isZh ? '行距、段前段后、首行缩进（含清理空格/Tab）。' : 'Spacing and indents (including removing extra spaces/tabs).'}</li>
              <li>{isZh ? '正文与多级标题样式统一。' : 'Consistent body and multi‑level heading styles.'}</li>
              <li>{isZh ? '参考文献列表版式（如悬挂缩进）。' : 'Reference list layout (e.g., hanging indents).'}</li>
              <li>{isZh ? '表题/图题等题注样式。' : 'Table/figure caption styles.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{isZh ? '效果不理想怎么办？' : 'What if results look wrong?'}</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>{isZh ? '先换一个模板再试。' : 'Try another template first.'}</li>
              <li>{isZh ? '确认原文档没有手动混用多套标题样式或大量空格缩进。' : 'Check your document for mixed manual styles and leading spaces/tabs.'}</li>
              <li>
                {isZh ? '提交反馈并说明“哪里不对”（如标题字号/行距/缩进），最好附上官方要求链接。' : 'Submit feedback with what is wrong (e.g., heading size/spacing/indent) and the official guideline link.'}{' '}
                <Link className="text-cyan-700 underline hover:text-cyan-900" href={`/${locale}/feedback`}>
                  {isZh ? '提交反馈' : 'Submit feedback'}
                </Link>
              </li>
            </ol>
          </section>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}

