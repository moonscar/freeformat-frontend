import AnchorNav from '@/components/sections/AnchorNav';
import InfoSections from '@/components/sections/InfoSections';
import FAQ from '@/components/sections/FAQ';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isZh = params.locale === 'zh';
  return {
    title: isZh
      ? 'APA 论文格式（第 7 版）— 指南与 .docx 模板'
      : 'APA Paper Format (7th Edition) — Guide + .docx Template',
    description: isZh
      ? '掌握 APA 第 7 版：标题页、页眉与页码、标题层级、行距与页边距、字体字号，以及参考文献列表的版式。可下载 .docx 模板或一键自动排版。'
      : 'Learn APA 7: title page, headings, spacing, margins, fonts, page numbers, and references layout. Download a .docx template or format your paper automatically.',
  };
}

function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export default function Page({ params }: { params: { locale: string } }) {
  const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '') || '/api';
  const isZh = params.locale === 'zh';
  const what = isZh
    ? {
        title: '什么是 APA 格式？',
        paragraphs: [
          'APA（第 7 版）广泛应用于社会科学领域。本页聚焦学生论文的排版要点：标题页、页眉与页码、标题层级、行距与页边距、字体字号，以及参考文献列表的版式。',
          '你可以先下载我们的 .docx 模板，或上传现有 .docx，由 AI Formatter 自动应用 APA 样式。',
        ] as const,
      }
    : {
        title: 'What is APA Format?',
        paragraphs: [
          'APA (7th) is a common style for social sciences. This guide covers student paper layout: title page, headings, spacing, margins, fonts, and references layout.',
          'Use our template for a quick start or upload your .docx and apply APA styles automatically.',
        ] as const,
      };
  const how = isZh
    ? {
        title: '如何按 APA 格式排版',
        steps: [
          '标题页（学生论文）：标题、作者、所属机构、课程、导师、日期。',
          '页眉与页码：右上角页码。',
          '标题层级：1–5 级，句首字母大写（sentence case）。',
          '双倍行距；1 英寸页边距；段落首行缩进 0.5 英寸。',
          '字体：Times New Roman 12 号（或允许的等效字体）。',
          '参考文献列表：悬挂缩进 0.5 英寸，按字母顺序排列。',
        ] as const,
      }
    : {
        title: 'How to format an APA paper',
        steps: [
          'Title page: student paper (title, author, affiliation, course, instructor, date).',
          'Running head & page numbers on top right.',
          'Headings: Levels 1–5, sentence case.',
          'Double spacing; 1-inch margins; 0.5-inch first-line indent for paragraphs.',
          'Font: Times New Roman 12 pt (or permitted alternatives).',
          'References list: hanging indent (0.5 inch), alphabetical order.',
        ] as const,
      };
  const use = isZh
    ? {
        title: '下载模板或一键排版',
        items: ['下载 .docx 模板（占位版）', '或打开工具，对你的 .docx 一键应用 APA 样式'] as const,
      }
    : {
        title: 'Download template or auto‑format',
        items: ['Download the .docx template (placeholder).', 'Or open the tool to auto‑apply APA styles to your .docx.'] as const,
      };
  const subheads = isZh
    ? ({ overview: '概览', steps: '步骤', cases: '快速开始' } as const)
    : ({ overview: 'Overview', steps: 'Steps', cases: 'Get started' } as const);
  const faq = isZh
    ? ({
        title: '常见问题',
        items: [
          { q: '是否会自动生成引用（citation）？', a: '不会。我们只格式化参考文献列表的“版式”，不生成或校对引用条目。' },
          { q: '模板是否免费？', a: '是。当前提供的模板仅用于教学演示，后续会替换为更完善的版本。' },
        ] as const,
      })
    : ({
        title: 'FAQ',
        items: [
          { q: 'Do you generate citations?', a: 'No. We only format the References section layout, not citation content.' },
          { q: 'Is the template free?', a: 'Yes. The downloadable template here is free to use for education.' },
        ] as const,
      });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">
        {isZh ? 'APA 论文格式（第 7 版）— 指南与模板' : 'APA Paper Format (7th) — Guide + Template'}
      </h1>
      <p className="mt-2 text-slate-600">
        {isZh ? '精炼且实用的排版要点，附 .docx 模板。' : 'A concise, practical guide with a ready .docx template.'}
      </p>
      <div className="mt-4 flex gap-3">
        <a className="rounded-full border px-4 py-2 text-sm text-slate-700" href={`${API_BASE}/guides/apa-format/template.docx`}>
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

      {/* JSON-LD */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: isZh ? 'APA 论文格式' : 'APA Paper Format',
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
