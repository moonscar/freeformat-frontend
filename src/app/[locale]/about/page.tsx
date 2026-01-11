import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/lib/siteConfig';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  const canonical = `/${localeKey}/about`;
  return {
    title: localeKey === 'zh' ? '关于 FreeFormat（开发者与产品目标）' : 'About FreeFormat (Developer & Mission)',
    description:
      localeKey === 'zh'
        ? 'FreeFormat 是一个论文 Word（.docx）排版与格式检查工具：基于模板给出可解释的检查报告与格式化结果。'
        : 'FreeFormat formats Word (.docx) theses and papers with templates, and provides an explainable format-check report and formatted output.',
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
            ? 'FreeFormat 是一个论文 Word（.docx）排版与格式检查工具：先检查给出评分与问题列表，再应用模板并下载结果。'
            : 'FreeFormat is a Word (.docx) formatting tool with a built-in format check: score & issues first, then apply a template and download the result.'}
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-slate-800">
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '产品目标' : 'Mission'}</h2>
            <p className="mt-2">
              {isZh
                ? '把“重复、机械、容易出错”的 Word 排版工作交给工具，并用可解释的检查报告让你知道：改了什么、还缺什么、下一步怎么做。'
                : 'Automate repetitive, error-prone Word layout work, and provide an explainable report so you know what changed, what still needs manual steps, and what to do next.'}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{isZh ? '开发者' : 'Developer'}</h2>
            <p className="mt-2">
              {isZh ? '这是一个由独立开发者维护的工具站点。' : 'This is a tool site maintained by an independent developer.'}{' '}
              {isZh ? '联系邮箱：' : 'Email: '}{' '}
              <a className="text-cyan-700 underline hover:text-cyan-900" href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{isZh ? '如何工作（3 步）' : 'How it works (3 steps)'}</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>{isZh ? '选择一个指南/模板（如 APA、MLA 或学校论文模板）。' : 'Pick a guide/template (e.g., APA, MLA, or a school thesis template).'}</li>
              <li>{isZh ? '上传你的 Word（.docx）并先做一次格式检查（评分 + 问题列表）。' : 'Upload your Word (.docx) and run a format check (score + issues).'}</li>
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
            <h2 className="text-lg font-semibold">{isZh ? '产品开发日志' : 'Product Dev Log'}</h2>
            <p className="mt-2">
              <Link className="text-cyan-700 underline hover:text-cyan-900" href={`/${locale}/devlog`}>
                {isZh ? '查看开发日志' : 'View the dev log'}
              </Link>
            </p>
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
