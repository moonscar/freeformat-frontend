type Item = { href: string; label: string };

export default function AnchorNav({ items }: { items: Item[] }) {
  if (!items?.length) return null;
  return (
    <nav className="mx-auto max-w-3xl px-4 pt-6">
      <ul className="flex flex-wrap gap-2">
        {items.map((it) => (
          <li key={it.href}>
            <a
              href={it.href}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm hover:border-cyan-300 hover:text-cyan-700"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

