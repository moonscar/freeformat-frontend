'use client';

import * as React from 'react';

type CheckItem = {
  code: string;
  title: string;
  strength: 'strong' | 'medium' | 'weak';
  status: 'pass' | 'warn' | 'fail' | 'unknown';
  confidence: number;
  weight: number;
  expected?: any;
  actual?: any;
  evidence?: any;
  recommendation?: string | null;
};

type CheckReport = {
  meta?: any;
  summary: {
    score: number;
    confidence: number;
    counts?: Record<string, number>;
  };
  items: CheckItem[];
};

type UploadResult = {
  file_id: string;
  filename: string;
  url: string;
};

type CheckResponse = {
  created_at: string;
  report: CheckReport;
  report_key: string;
  report_url?: string | null;
  docjson_key: string;
  docjson_url?: string | null;
};

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || '/api').replace(/\/$/, '');

function resolveApiUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return url;
}

function formatPercent01(value: number): string {
  if (!Number.isFinite(value)) return '-';
  return `${Math.round(value * 100)}%`;
}

export default function GuideCheckModule({
  locale,
  templateId,
  guideTitle,
}: {
  locale: 'zh' | 'en' | string;
  templateId: string;
  guideTitle: string;
}) {
  const isZh = locale === 'zh';
  const [file, setFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string>('');
  const [result, setResult] = React.useState<CheckResponse | null>(null);

  async function uploadDocx(): Promise<UploadResult> {
    if (!file) {
      throw new Error(isZh ? '请先选择 .docx 文件' : 'Please choose a .docx file first.');
    }
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: fd });
    if (!res.ok) {
      let msg = `upload failed: ${res.status}`;
      try {
        const j = await res.json();
        if (j?.detail) msg += ` - ${j.detail}`;
      } catch {}
      throw new Error(msg);
    }
    return (await res.json()) as UploadResult;
  }

  async function runCheck() {
    if (!templateId) return;
    setSubmitting(true);
    setError('');
    setResult(null);
    try {
      const up = await uploadDocx();
      const body = {
        file_id: up.file_id,
        template_id: templateId,
        force_regen_docjson: false,
      };
      const res = await fetch(`${API_BASE}/check`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        let msg = `check failed: ${res.status}`;
        try {
          const j = await res.json();
          if (j?.detail) msg += ` - ${j.detail}`;
        } catch {}
        throw new Error(msg);
      }
      const json = (await res.json()) as CheckResponse;
      setResult(json);
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setSubmitting(false);
    }
  }

  const summary = result?.report?.summary;
  const items = Array.isArray(result?.report?.items) ? (result?.report?.items as CheckItem[]) : [];
  const actionable = items.filter((it) => it.status === 'fail' || it.status === 'warn');
  const topIssues = actionable.slice(0, 8);

  return (
    <section className="mt-8 mx-auto max-w-[840px]">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{isZh ? '格式检查' : 'Format Check'}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {isZh
                ? `上传你的 Word（.docx），我们会基于「${guideTitle}」模板生成评分与问题列表。`
                : `Upload your Word (.docx). We will check it against the “${guideTitle}” template and return a score and issues.`}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="file"
            accept=".docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-800 hover:file:bg-slate-200"
          />
          <button
            type="button"
            onClick={runCheck}
            disabled={!file || submitting}
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-cyan-700 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (isZh ? '检查中…' : 'Checking…') : isZh ? '开始检查' : 'Run check'}
          </button>
        </div>

        {error ? (
          <p className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        ) : null}

        {summary ? (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-end gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {isZh ? '评分' : 'Score'}
                  </div>
                  <div className="text-3xl font-semibold text-slate-900">{Math.round(summary.score)}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {isZh ? '置信度' : 'Confidence'}
                  </div>
                  <div className="text-lg font-semibold text-slate-900">{formatPercent01(summary.confidence)}</div>
                </div>
              </div>
              {result?.report_url ? (
                <a
                  href={resolveApiUrl(result.report_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-cyan-800 underline hover:text-cyan-900"
                >
                  {isZh ? '下载检查报告（JSON）' : 'Download report (JSON)'}
                </a>
              ) : null}
            </div>

            {topIssues.length ? (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-slate-900">{isZh ? '关键问题' : 'Key issues'}</h3>
                <ul className="mt-2 space-y-2">
                  {topIssues.map((it) => (
                    <li key={it.code} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-900">{it.title}</div>
                          {it.recommendation ? (
                            <div className="mt-1 text-xs text-slate-600">{it.recommendation}</div>
                          ) : null}
                        </div>
                        <span
                          className={
                            it.status === 'fail'
                              ? 'shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700'
                              : 'shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800'
                          }
                        >
                          {it.status === 'fail' ? (isZh ? '失败' : 'Fail') : isZh ? '警告' : 'Warn'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                {actionable.length > topIssues.length ? (
                  <p className="mt-2 text-xs text-slate-500">
                    {isZh
                      ? `已显示 ${topIssues.length} 条，共 ${actionable.length} 条。`
                      : `Showing ${topIssues.length} of ${actionable.length}.`}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-700">
                {isZh ? '未发现明显问题（或当前检查项未覆盖到）。' : 'No obvious issues found (or not covered by current checks).'}
              </p>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

