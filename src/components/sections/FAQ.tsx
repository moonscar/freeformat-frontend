export type FAQItem = { q: string; a: string };

export default function FAQ({ title, items }: { title: string; items: ReadonlyArray<FAQItem> }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl shadow-slate-200/70">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <dl className="mt-4 divide-y">
          {items.map((it, idx) => (
            <div key={idx} className="py-3">
              <dt className="text-sm font-medium text-slate-900">{it.q}</dt>
              <dd className="mt-1 text-sm text-slate-600">{it.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
