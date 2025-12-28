'use client';

import * as React from 'react';
import Markdown from '@/components/Markdown';

export type ValueModule = {
  id?: string;
  kind?: string;
  title?: string;
  md?: string;
};

function kindLabel(kind: string | undefined, isZh: boolean): string | null {
  const k = (kind || '').toLowerCase();
  if (!k) return null;
  if (k === 'top_mistakes') return isZh ? '易错点' : 'Top mistakes';
  if (k === 'checklist') return isZh ? '清单' : 'Checklist';
  if (k === 'how_to') return isZh ? '操作步骤' : 'How-to';
  if (k === 'example_docx') return isZh ? '示例文件' : 'Example file';
  if (k === 'before_after') return isZh ? '对照' : 'Before/after';
  return kind || null;
}

export default function ValueModules({
  locale,
  modules,
}: {
  locale: 'zh' | 'en' | string;
  modules: ValueModule[];
}) {
  const isZh = locale === 'zh';
  const items = Array.isArray(modules) ? modules.filter((m) => (m?.title || m?.md)) : [];
  if (!items.length) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">{isZh ? '要点与自查' : 'Key notes & self-check'}</h2>
      <div className="mt-4 space-y-6">
        {items.map((m, idx) => {
          const tag = kindLabel(m.kind, isZh);
          return (
            <div key={m.id || `${m.kind || 'module'}-${idx}`} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-slate-900">{m.title || (isZh ? '未命名模块' : 'Untitled')}</h3>
                {tag ? (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    {tag}
                  </span>
                ) : null}
              </div>
              {m.md ? (
                <div className="mt-2">
                  <Markdown md={m.md} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
