'use client';

import * as React from 'react';
import Markdown from '@/components/Markdown';

export type ValueModule = {
  id?: string;
  kind?: string;
  title?: string;
  md?: string;
  files?: { key?: string; url?: string; label?: string; filetype?: string; size_bytes?: number }[];
  pairs?: {
    set?: string | null;
    topic?: string;
    topicLabel?: string;
    before?: { key?: string; url?: string; alt?: string; caption?: string };
    after?: { key?: string; url?: string; alt?: string; caption?: string };
  }[];
};

function kindLabel(kind: string | undefined, isZh: boolean): string | null {
  const k = (kind || '').toLowerCase();
  if (!k) return null;
  if (k === 'top_mistakes') return isZh ? '易错点' : 'Top mistakes';
  if (k === 'checklist') return isZh ? '清单' : 'Checklist';
  if (k === 'how_to') return isZh ? '操作步骤' : 'How-to';
  if (k === 'example_docx') return isZh ? '示例文件' : 'Example file';
  if (k === 'before_after') return isZh ? '对照' : 'Before/after';
  if (k === 'attachments') return isZh ? '附件' : 'Attachments';
  if (k === 'quick_params') return isZh ? '参数' : 'Quick params';
  if (k === 'scope') return isZh ? '边界' : 'Scope';
  return kind || null;
}

function humanFileSize(bytes: number | undefined, isZh: boolean): string | null {
  if (!bytes || bytes <= 0) return null;
  const units = ['B', 'KB', 'MB', 'GB'];
  let v = bytes;
  let idx = 0;
  while (v >= 1024 && idx < units.length - 1) {
    v /= 1024;
    idx += 1;
  }
  const num = idx === 0 ? String(Math.round(v)) : v.toFixed(1);
  return isZh ? `${num} ${units[idx]}` : `${num} ${units[idx]}`;
}

export default function ValueModules({
  locale,
  modules,
}: {
  locale: 'zh' | 'en' | string;
  modules: ValueModule[];
}) {
  const isZh = locale === 'zh';
  const items = Array.isArray(modules)
    ? modules.filter((m) => m?.title || m?.md || (m?.files && m.files.length) || (m?.pairs && m.pairs.length))
    : [];
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
              {m.md ? <div className="mt-2"><Markdown md={m.md} /></div> : null}

              {Array.isArray(m.files) && m.files.length ? (
                <div className="mt-3">
                  <ul className="space-y-2">
                    {m.files.map((f, j) => {
                      const size = humanFileSize(f.size_bytes, isZh);
                      return (
                        <li key={f.key || `${f.url || 'file'}-${j}`} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                          <div className="min-w-[220px]">
                            <div className="text-sm font-medium text-slate-900">{f.label || (isZh ? '下载文件' : 'Download file')}</div>
                            <div className="text-xs text-slate-600">
                              {[f.filetype ? f.filetype.toUpperCase() : null, size].filter(Boolean).join(' • ')}
                            </div>
                          </div>
                          {f.url ? (
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                            >
                              {isZh ? '下载' : 'Download'}
                            </a>
                          ) : (
                            <span className="text-xs text-slate-500">{isZh ? '暂无链接' : 'No link'}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              {Array.isArray(m.pairs) && m.pairs.length ? (
                <div className="mt-3 space-y-4">
                  {m.pairs.map((p, j) => (
                    <div key={`${p.topic || 'pair'}-${j}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="mb-2 text-sm font-semibold text-slate-900">
                        {p.topicLabel || p.topic || (isZh ? '对照' : 'Before/after')}
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-md border border-slate-200 bg-white p-2">
                          <div className="text-xs font-semibold text-slate-700">{isZh ? '格式化前' : 'Before'}</div>
                          {p.before?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.before.url}
                              alt={p.before.alt || 'before'}
                              className="mt-2 w-full rounded border border-slate-100"
                              loading="lazy"
                            />
                          ) : (
                            <div className="mt-2 text-xs text-slate-500">{isZh ? '暂无截图' : 'No image'}</div>
                          )}
                        </div>
                        <div className="rounded-md border border-slate-200 bg-white p-2">
                          <div className="text-xs font-semibold text-slate-700">{isZh ? '格式化后' : 'After'}</div>
                          {p.after?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.after.url}
                              alt={p.after.alt || 'after'}
                              className="mt-2 w-full rounded border border-slate-100"
                              loading="lazy"
                            />
                          ) : (
                            <div className="mt-2 text-xs text-slate-500">{isZh ? '暂无截图' : 'No image'}</div>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        {p.before?.url ? (
                          <a className="underline hover:text-slate-700" href={p.before.url} target="_blank" rel="noopener noreferrer">
                            {isZh ? '查看前图' : 'Open before'}
                          </a>
                        ) : null}
                        {p.before?.url && p.after?.url ? <span className="mx-2">•</span> : null}
                        {p.after?.url ? (
                          <a className="underline hover:text-slate-700" href={p.after.url} target="_blank" rel="noopener noreferrer">
                            {isZh ? '查看后图' : 'Open after'}
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
