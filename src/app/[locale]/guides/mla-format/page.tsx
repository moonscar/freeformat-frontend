import AnchorNav from '@/components/sections/AnchorNav';
import InfoSections from '@/components/sections/InfoSections';
import FAQ from '@/components/sections/FAQ';

export const metadata = {
  title: 'MLA Paper Format — Guide + .docx Template',
  description:
    'MLA formatting rules for student papers: headers, spacing, margins, headings, fonts, and Works Cited layout. Download a .docx template or auto‑format.',
};

export default function Page({ params }: { params: { locale: string } }) {
  const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '') || '/api';
  const what = {
    title: 'What is MLA Format?',
    paragraphs: [
      'MLA (9th) is widely used in humanities. This guide focuses on page layout, headings, spacing, margins, fonts, and Works Cited layout.',
      'Use our template or upload your .docx and apply MLA styles automatically.',
    ] as const,
  };
  const how = {
    title: 'How to format an MLA paper',
    steps: [
      'Header: author last name + page number on top right.',
      'Double spacing; 1-inch margins; first‑line indent 0.5 inch.',
      'Font: Times New Roman 12 pt (or permitted alternatives).',
      'Headings as needed; centered title on first page.',
      'Works Cited: hanging indent (0.5 inch), alphabetical order.',
    ] as const,
  };
  const use = {
    title: 'Download template or auto‑format',
    items: [
      'Download the .docx template (placeholder).',
      'Or open the tool to auto‑apply MLA styles to your .docx.',
    ] as const,
  };
  const subheads = { overview: 'Overview', steps: 'Steps', cases: 'Get started' } as const;
  const faq = {
    title: 'FAQ',
    items: [
      { q: 'Do you generate citations?', a: 'No — we only format the Works Cited layout (hanging indent etc.).' },
      { q: 'Is the template free?', a: 'Yes, free for education; a polished version will ship soon.' },
    ] as const,
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">MLA Paper Format — Guide + Template</h1>
      <p className="mt-2 text-slate-600">Practical rules with a ready .docx template.</p>
      <div className="mt-4 flex gap-3">
        <a className="rounded-full border px-4 py-2 text-sm text-slate-700" href={`${API_BASE}/guides/mla-format/template.docx`}>
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
