"use client";

import React from 'react';

function slugifyId(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function Toc({ md }: { md: string }) {
  const items = React.useMemo(() => {
    const out: { id: string; text: string; level: number }[] = [];
    for (const line of md.split(/\r?\n/)) {
      const m = line.match(/^(#{2,3})\s+(.*)$/); // H2/H3 only
      if (m) {
        const level = m[1].length;
        const text = m[2].trim();
        const id = slugifyId(text);
        out.push({ id, text, level });
      }
    }
    return out;
  }, [md]);
  if (!items.length) return null;
  return (
    <nav className="rounded-lg border p-4 text-sm">
      <div className="mb-2 font-medium text-slate-900">Contents</div>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.id} className={it.level === 2 ? '' : 'pl-4'}>
            <a href={`#${it.id}`} className="text-slate-700 hover:text-slate-900">
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

