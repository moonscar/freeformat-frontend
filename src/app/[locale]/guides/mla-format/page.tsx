import AnchorNav from '@/components/sections/AnchorNav';
import InfoSections from '@/components/sections/InfoSections';
import FAQ from '@/components/sections/FAQ';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isZh = params.locale === 'zh';
  return {
    title: isZh ? 'MLA 论文格式 — 指南与 .docx 模板' : 'MLA Paper Format — Guide + .docx Template',
    description: isZh
      ? 'MLA 规范（第 9 版）常用于人文学科。本页覆盖页眉、行距、页边距、标题、字体，以及参考文献（Works Cited）列表的版式。可下载 .docx 模板或一键自动排版。'
      : 'MLA formatting rules for student papers: headers, spacing, margins, headings, fonts, and Works Cited layout. Download a .docx template or auto‑format.',
  };
}

function JsonLd({ data }: { data: Record<string, any> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function Page({ params }: { params: { locale: string } }) {
  const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '') || '/api';
  const isZh = params.locale === 'zh';
  const what = isZh
    ? {
        title: '什么是 MLA 格式？',
        paragraphs: [
          'MLA（第 9 版）常用于人文学科。本页聚焦页眉、行距、页边距、标题、字体，以及参考文献（Works Cited）列表的版式。',
          '你可以下载 .docx 模板，或上传 .docx 由 FreeFormat（AI 文档排版工具）自动应用 MLA 样式。',
        ] as const,
      }
    : {
        title: 'What is MLA Format?',
        paragraphs: [
          'MLA (9th) is widely used in humanities. This guide focuses on page layout, headings, spacing, margins, fonts, and Works Cited layout.',
          'Use our template or upload your .docx and apply MLA styles automatically.',
        ] as const,
      };
  const how = isZh
    ? {
        title: '如何按 MLA 格式排版',
        steps: [
          '页眉：作者姓氏 + 页码（右上角）。',
          '双倍行距；1 英寸页边距；首行缩进 0.5 英寸。',
          '字体：Times New Roman 12 号（或允许的等效字体）。',
          '按需要使用标题；首页标题居中。',
          '参考文献（Works Cited）：悬挂缩进 0.5 英寸，按字母顺序排列。',
        ] as const,
      }
    : {
        title: 'How to format an MLA paper',
        steps: [
          'Header: author last name + page number on top right.',
          'Double spacing; 1-inch margins; first‑line indent 0.5 inch.',
          'Font: Times New Roman 12 pt (or permitted alternatives).',
          'Headings as needed; centered title on first page.',
          'Works Cited: hanging indent (0.5 inch), alphabetical order.',
        ] as const,
      };
  const use = isZh
    ? { title: '下载模板或一键排版', items: ['下载 .docx 模板（占位版）', '或打开工具，对 .docx 一键应用 MLA 样式'] as const }
    : { title: 'Download template or auto‑format', items: ['Download the .docx template (placeholder).', 'Or open the tool to auto‑apply MLA styles to your .docx.'] as const };
  const subheads = isZh
    ? ({ overview: '概览', steps: '步骤', cases: '快速开始' } as const)
    : ({ overview: 'Overview', steps: 'Steps', cases: 'Get started' } as const);
  const faq = isZh
    ? ({
        title: '常见问题',
        items: [
          { q: '是否会自动生成引用（citation）？', a: '不会。我们仅格式化 Works Cited 的排版（如悬挂缩进），不生成引用条目。' },
          { q: '模板是否免费？', a: '是，当前模板用于教学演示，后续会更新更完善的版本。' },
        ] as const,
      })
    : ({
        title: 'FAQ',
        items: [
          { q: 'Do you generate citations?', a: 'No — we only format the Works Cited layout (hanging indent etc.).' },
          { q: 'Is the template free?', a: 'Yes, free for education; a polished version will ship soon.' },
        ] as const,
      });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">{isZh ? 'MLA 论文格式 — 指南与模板' : 'MLA Paper Format — Guide + Template'}</h1>
      <p className="mt-2 text-slate-600">{isZh ? '实用排版规则，附 .docx 模板。' : 'Practical rules with a ready .docx template.'}</p>
      <div className="mt-4 flex gap-3">
        <a className="rounded-full border px-4 py-2 text-sm text-slate-700" href={`${API_BASE}/guides/mla-format/template.docx`}>
          {isZh ? '下载 .docx（占位）' : 'Download .docx (placeholder)'}
        </a>
        <a className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white" href={`/${params.locale}/tool`}>
          {isZh ? '一键排版我的论文' : 'Auto‑format my paper'}
        </a>
      </div>

      <AnchorNav
        items={[
          { href: '#what', label: what.title },
          { href: '#how', label: how.title },
          { href: '#use', label: use.title },
          { href: '#faq', label: faq.title },
        ]}
      />

      <InfoSections what={what} how={how} use={use} subheads={subheads} />
      <div id="faq">
        <FAQ title={faq.title} items={faq.items} />
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: isZh ? 'MLA 论文格式' : 'MLA Paper Format',
          step: how.steps.map((s: string) => ({ '@type': 'HowToStep', name: s })),
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: (faq.items as readonly any[]).map((qa: any) => ({
            '@type': 'Question',
            name: qa.q,
            acceptedAnswer: { '@type': 'Answer', text: qa.a },
          })),
        }}
      />
    </main>
  );
}
