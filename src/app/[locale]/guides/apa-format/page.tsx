import AnchorNav from '@/components/sections/AnchorNav';
import InfoSections from '@/components/sections/InfoSections';
import FAQ from '@/components/sections/FAQ';

export const metadata = {
  title: 'APA Paper Format (7th Edition) — Guide + .docx Template',
  description:
    'Learn APA 7: title page, headings, spacing, margins, fonts, page numbers, and references layout. Download a .docx template or format your paper automatically.',
};

export default function Page({ params }: { params: { locale: string } }) {
  const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '') || '/api';
  const what = {
    title: 'What is APA Format?',
    paragraphs: [
      'APA (7th) is a common style for social sciences. This guide covers student paper layout: title page, headings, spacing, margins, fonts, and references layout.',
      'Use our template for a quick start or upload your .docx and apply APA styles automatically.',
    ] as const,
  };
  const how = {
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
  const use = {
    title: 'Download template or auto‑format',
    items: [
      'Download the .docx template (placeholder).',
      'Or open the tool to auto‑apply APA styles to your .docx.',
    ] as const,
  };
  const subheads = { overview: 'Overview', steps: 'Steps', cases: 'Get started' } as const;
  const faq = {
    title: 'FAQ',
    items: [
      { q: 'Do you generate citations?', a: 'No. We only format the References section layout, not citation content.' },
      { q: 'Is the template free?', a: 'Yes. The downloadable template here is free to use for education.' },
    ] as const,
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">APA Paper Format (7th) — Guide + Template</h1>
      <p className="mt-2 text-slate-600">A concise, practical guide with a ready .docx template.</p>
      <div className="mt-4 flex gap-3">
        <a className="rounded-full border px-4 py-2 text-sm text-slate-700" href={`${API_BASE}/guides/apa-format/template.docx`}>
          Download .docx (placeholder)
        </a>
        <a className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white" href={`/${params.locale}/tool`}>
          Auto‑format my paper
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
    </main>
  );
}
