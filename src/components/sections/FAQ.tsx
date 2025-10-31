export type FAQItem = { q: string; a: string };

export default function FAQ({ title, items }: { title: string; items: FAQItem[] }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="mb-4 text-2xl font-semibold text-slate-900">{title}</h2>
      <div className="divide-y rounded-2xl border bg-white/90">
        {items.map((it, idx) => (
          <div key={idx} className="p-4">
            <p className="font-medium text-slate-900">{it.q}</p>
            <p className="mt-1 text-sm text-slate-600">{it.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

