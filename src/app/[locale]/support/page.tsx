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
            <h2 className="text-lg font-semibold">{isZh ? '最快的使用方式（推荐流程）' : 'Fastest way to use (recommended)'}</h2>
            <p className="mt-2">
              {isZh
                ? '进入工具页，选择一个指南/模板，上传 .docx。建议先运行“格式检查”（评分 + 问题列表），再运行“格式化”，最后按清单快速自查。'
                : 'Go to the tool page, pick a guide/template, upload a .docx. We recommend Check (score + issues) first, then Format, then a quick manual review.'}{' '}
              <Link className="text-cyan-700 underline hover:text-cyan-900" href={`/${locale}/tool`}>
                {isZh ? '打开工具页' : 'Open tool'}
              </Link>
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              <li>{isZh ? '选择对应的指南/模板（例如 APA、MLA、IEEE，或你的学校/期刊）。' : 'Pick the right guide/template (APA/MLA/IEEE, or your school/journal).'}</li>
              <li>{isZh ? '上传 `.docx`。' : 'Upload your `.docx`.'}</li>
              <li>{isZh ? '先运行“格式检查”（评分 + 问题列表）。' : 'Run a format check (score + issues).'}</li>
              <li>{isZh ? '再运行“格式化”。' : 'Run formatting.'}</li>
              <li>{isZh ? '下载结果并按检查清单快速自查。' : 'Download and do a quick manual checklist review.'}</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{isZh ? '我能自动修复哪些问题（常见）' : 'What can be fixed automatically (common)'}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                {isZh
                  ? '正文段落：字体/字号/对齐/行距/缩进/段前段后（以模板为准）'
                  : 'Body paragraphs: font/size/alignment/spacing/indent (template-dependent)'}
              </li>
              <li>{isZh ? '标题层级：把常见的标题段落应用到对应样式（以模板为准）' : 'Headings: apply target styles by level (template-dependent)'}</li>
              <li>{isZh ? '基础的页面级设置（部分模板）：例如页边距、纸张大小等' : 'Basic page-level settings (some templates): margins, page size, etc.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{isZh ? '哪些问题通常需要你在 Word 里手动确认' : 'What usually needs manual checks in Word'}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>{isZh ? '目录（TOC）：更新与局部样式微调' : 'Table of contents (TOC): update and minor style tweaks'}</li>
              <li>{isZh ? '分节页码：例如“正文从第 1 页开始”、前置部分罗马数字等' : 'Section-based page numbering (e.g., main text starts at 1)'}</li>
              <li>{isZh ? '复杂页眉页脚：不同节不同规则、奇偶页不同等' : 'Complex headers/footers across sections or odd/even pages'}</li>
              <li>{isZh ? '特殊排版：单双栏混排、复杂表格、跨页图表布局等' : 'Special layout: mixed columns, complex tables, multi-page figures, etc.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{isZh ? '常见失败原因与处理办法' : 'Common issues & fixes'}</h2>
            <h3 className="mt-3 font-semibold text-slate-900">{isZh ? '1) 检查分数很低 / 问题很多' : '1) Low score / too many issues'}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>{isZh ? '先确认你选择的模板是否正确（学校/期刊/会议可能差异很大）' : 'Make sure the selected template matches your requirement (they differ a lot).'}</li>
              <li>{isZh ? '如果文档里存在大量手工空格/Tab 对齐，建议先做一次简单清理（尤其是段首缩进）' : 'If your doc uses lots of manual spaces/tabs for alignment, do a quick cleanup first.'}</li>
            </ul>

            <h3 className="mt-3 font-semibold text-slate-900">{isZh ? '2) 格式化后看起来“变化不大”' : '2) “Not much changed” after formatting'}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>{isZh ? '可能是原文档已经接近目标模板' : 'Your document may already be close to the target template.'}</li>
              <li>{isZh ? '也可能是段落类型标注不足，导致部分段落未应用到目标样式' : 'Or paragraph typing/annotation was insufficient, so some paragraphs didn’t get the target style.'}</li>
            </ul>

            <h3 className="mt-3 font-semibold text-slate-900">{isZh ? '3) 图表与公式看起来不对' : '3) Tables/figures/formulas look wrong'}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>{isZh ? '图表、题注、公式的排版在不同文档里差异很大；建议把“图表题注样式”当作优先检查项' : 'These vary a lot; treat caption styles as a top priority check item.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{isZh ? '如何提交问题（我需要哪些信息）' : 'How to report a problem (what I need)'}</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>{isZh ? '你使用的指南/模板（或页面链接）' : 'Guide/template used (or guide page link)'}</li>
              <li>{isZh ? '你的原始 `.docx`（如果可以分享；不方便可提供截图）' : 'Original `.docx` (or screenshots if you can’t share files)'}</li>
              <li>{isZh ? '检查报告（评分与问题列表截图/JSON）' : 'Check report (score + issues screenshot/JSON)'}</li>
              <li>{isZh ? '你期望的结果（例如“标题应该是黑体小三居中”）' : 'Expected result (e.g., “Heading should be centered, bold, 16pt”)'}</li>
            </ol>
            <p className="mt-3">
              {isZh ? '邮箱：' : 'Email: '}about@freeformat.app{' '}
              {isZh ? '（也可以走站内反馈）：' : '(or use the feedback form): '}{' '}
              <Link className="text-cyan-700 underline hover:text-cyan-900" href={`/${locale}/feedback`}>
                {isZh ? '提交反馈' : 'Submit feedback'}
              </Link>
            </p>
          </section>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
