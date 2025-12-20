import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  const canonical = `/${localeKey}/about`;
  return {
    title: localeKey === 'zh' ? '关于 FreeFormat（工作原理）' : 'About FreeFormat (How it works)',
    description:
      localeKey === 'zh'
        ? 'FreeFormat 是一个论文 Word（.docx）自动排版工具：选择模板，上传文档，一键应用样式并下载结果。'
        : 'FreeFormat auto‑formats Word (.docx) theses and academic papers: pick a template, upload your file, apply styles and download the result.',
    alternates: {
      canonical,
      languages: {
        en: '/en/about',
        zh: '/zh/about',
      },
    },
    openGraph: {
      url: canonical,
      type: 'website',
    },
  };
}

export default function AboutPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  const isZh = locale === 'zh';
  return (
    <>
      <Header locale={locale} />
      <main className="mx-auto max-w-3xl px-4 py-10 text-slate-900">
        <h1 className="mb-4 text-3xl font-semibold">{isZh ? '关于 FreeFormat' : 'About FreeFormat'}</h1>
        <p className="mb-6 text-sm text-slate-600">
          {isZh
            ? 'FreeFormat 是一个文档排版工具：把已有模板的版式规则应用到你的 Word（.docx）文档，帮你省掉重复、机械、容易出错的排版工作。'
            : 'FreeFormat is a document formatter: it applies an existing style template to your Word (.docx) file to remove repetitive, error‑prone formatting work.'}
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-slate-800">
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '如何工作（3 步）' : 'How it works (3 steps)'}</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>{isZh ? '选择一个指南/模板（如 APA、MLA 或学校论文模板）。' : 'Pick a guide/template (e.g., APA, MLA, or a school thesis template).'}</li>
              <li>{isZh ? '上传你的 Word（.docx）文档并开始格式化。' : 'Upload your Word (.docx) document and start formatting.'}</li>
              <li>{isZh ? '下载排版后的文档，并按学校/期刊要求做最终检查。' : 'Download the formatted document and cross‑check against official requirements.'}</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{isZh ? '我们能做什么' : 'What we do'}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>{isZh ? '统一行距、段前段后、首行缩进（并清理多余空格/Tab）。' : 'Unify spacing and indents (and remove extra spaces/tabs).'}</li>
              <li>{isZh ? '统一正文与多级标题样式。' : 'Apply consistent body and multi‑level heading styles.'}</li>
              <li>{isZh ? '统一参考文献列表的版式（如悬挂缩进）。' : 'Format reference list layout (e.g., hanging indents).'}</li>
              <li>{isZh ? '统一表题/图题等题注样式。' : 'Format table/figure caption styles.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{isZh ? '我们不会做什么' : 'What we do not do'}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>{isZh ? '不改写或润色正文内容。' : 'We do not rewrite or proofread your content.'}</li>
              <li>{isZh ? '不保证复杂页眉页脚与分节页码完全一致。' : 'We do not guarantee complex headers/footers and section‑based page numbering.'}</li>
              <li>{isZh ? '不负责参考文献条目的内容规范（字段顺序/标点等）。' : 'We do not enforce citation/reference content rules (field order/punctuation).'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{isZh ? '需要帮助？' : 'Need help?'}</h2>
            <p className="mt-2">
              <Link className="text-cyan-700 underline hover:text-cyan-900" href={`/${locale}/support`}>
                {isZh ? '查看支持与常见问题' : 'Support & FAQ'}
              </Link>
            </p>
          </section>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}

