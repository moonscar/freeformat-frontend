type WhatData = { title: string; paragraphs: string[] };
type HowData = { title: string; steps: string[] };
type UseData = { title: string; items: string[] };

function SectionCard({ children, title, id }: { children: React.ReactNode; title: string; id: string }) {
  return (
    <section id={id} className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl shadow-slate-200/70">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-4 text-slate-700">{children}</div>
    </section>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

export default function InfoSections({ what, how, use }: { what: WhatData; how: HowData; use: UseData }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-6 md:grid-cols-2">
        <SectionCard title={what.title} id={slugify(what.title)}>
          <div className="space-y-3 text-sm leading-7">
            {what.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </SectionCard>
        <SectionCard title={how.title} id={slugify(how.title)}>
          <ol className="space-y-3 text-sm text-slate-700">
            {how.steps.map((s, index) => (
              <li key={s} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-200">
                  {index + 1}
                </span>
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard title={use.title} id={slugify(use.title)}>
          <ul className="space-y-2 text-sm">
            {use.items.map((s) => (
              <li key={s} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
