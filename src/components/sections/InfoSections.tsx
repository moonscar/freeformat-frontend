type WhatData = { title: string; paragraphs: string[] };
type HowData = { title: string; steps: string[] };
type UseData = { title: string; items: string[] };

export default function InfoSections({ what, how, use }: { what: WhatData; how: HowData; use: UseData }) {
  return (
    <div className="prose prose-slate mx-auto max-w-3xl py-10">
      <section>
        <h2>{what.title}</h2>
        {what.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </section>
      <section>
        <h2>{how.title}</h2>
        <ol>
          {how.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>
      <section>
        <h2>{use.title}</h2>
        <ul>
          {use.items.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

