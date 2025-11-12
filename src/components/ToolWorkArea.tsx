"use client";

import React from "react";

type Props = {
  locale: "en" | "zh";
  guideSlug?: string;
  initialTemplateId?: string;
};

type UploadResult = { file_id: string; filename: string; url: string };
type JobStatus = { job_id: string; status: string; result?: { formatted_doc_url?: string; format_map_url?: string } | null; error?: string | null };

export default function ToolWorkArea({ locale, guideSlug, initialTemplateId }: Props) {
  const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || '/api').replace(/\/$/, '');
  const [templateId] = React.useState<string>(initialTemplateId || "");
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [formatting, setFormatting] = React.useState(false);
  const [jobId, setJobId] = React.useState<string>("");
  const [jobStatus, setJobStatus] = React.useState<JobStatus | null>(null);
  const [error, setError] = React.useState<string>("");
  const [previewError, setPreviewError] = React.useState<string>("");
  const previewRef = React.useRef<HTMLDivElement | null>(null);
  const previewedJobRef = React.useRef<string>("");

  const t = (s: string) => {
    const zh: Record<string, string> = {
      selectTemplate: "关联信息",
      usingTemplate: "",
      change: "",
      noTemplate: "未检测到模板，请返回指南页或稍后重试",
      uploadDoc: "上传 .docx",
      start: "开始格式化",
      uploading: "正在上传…",
      formatting: "正在格式化…",
      job: "任务",
      error: "错误",
      result: "结果",
      downloadDoc: "下载格式化文档",
      downloadMap: "下载格式映射",
    };
    const en: Record<string, string> = {
      selectTemplate: "Context",
      usingTemplate: "",
      change: "",
      noTemplate: "No template detected. Please go back to guide or try later.",
      uploadDoc: "Upload .docx",
      start: "Start Formatting",
      uploading: "Uploading…",
      formatting: "Formatting…",
      job: "Job",
      error: "Error",
      result: "Result",
      downloadDoc: "Download formatted doc",
      downloadMap: "",
    };
    return (locale === "zh" ? zh : en)[s] || s;
  };

  const isDev = process.env.NODE_ENV !== 'production';
  React.useEffect(() => {
    if (isDev) {
      // Initial debug snapshot
      // eslint-disable-next-line no-console
      console.debug('[tool] init', { API_BASE, locale, guideSlug, initialTemplateId, templateId });
    }
  }, []);

  async function handleUpload(): Promise<UploadResult> {
    if (!file) throw new Error(locale === "zh" ? "请先选择 .docx 文件" : "Please choose a .docx file first");
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);
    setError("");
    try {
      if (isDev) console.debug('[tool] upload -> POST', `${API_BASE}/upload`, { file: file?.name, size: file?.size });
      const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: fd });
      if (!res.ok) {
        let msg = `upload failed: ${res.status}`;
        try {
          const j = await res.json();
          if (j?.detail) msg += ` - ${j.detail}`;
        } catch {}
        throw new Error(msg);
      }
      const json = (await res.json()) as UploadResult;
      if (isDev) console.debug('[tool] upload <- OK', json);
      return json;
    } finally {
      setUploading(false);
    }
  }

  async function pollJob(id: string) {
    let attempts = 0;
    setJobStatus({ job_id: id, status: "queued" });
    const poll = async () => {
      const r = await fetch(`${API_BASE}/jobs/${id}`);
      if (!r.ok) throw new Error(`job status failed: ${r.status}`);
      const js = (await r.json()) as JobStatus;
      setJobStatus(js);
      if (isDev) console.debug('[tool] job <-', js);
      // trigger preview on success
      if (js.status === "succeeded" && js.result?.formatted_doc_url) {
        if (previewedJobRef.current !== js.job_id) {
          try {
            await renderPreview(js.result.formatted_doc_url);
            previewedJobRef.current = js.job_id;
          } catch (e: any) {
            setPreviewError(String(e?.message || e));
            if (isDev) console.debug('[tool] preview error', e);
          }
        }
      }
      if (js.status === "succeeded" || js.status === "failed") return;
      attempts += 1;
      if (attempts < 300) setTimeout(poll, 1500);
    };
    poll().catch((e) => setError(String(e)));
  }

  // Fallback: react to jobStatus changes (in case we missed inside poll loop)
  React.useEffect(() => {
    const js = jobStatus;
    if (!js) return;
    if (js.status === 'succeeded' && js.result?.formatted_doc_url) {
      if (previewedJobRef.current !== js.job_id) {
        renderPreview(js.result.formatted_doc_url)
          .then(() => {
            previewedJobRef.current = js.job_id;
          })
          .catch((e: any) => setPreviewError(String(e?.message || e)));
      }
    }
  }, [jobStatus]);

  function resolveDocUrl(url: string): string {
    if (!url) return url;
    if (url.startsWith("/")) {
      // backend returned a relative download path; prefix API base to leverage proxy
      return `${API_BASE}${url}`;
    }
    return url;
  }

  async function renderPreview(url: string) {
    const container = previewRef.current;
    if (!container) return;
    setPreviewError("");
    // clear previous content
    container.innerHTML = "";
    // ensure runtime styles are present (load from CDN once)
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (!document.getElementById('docx-preview-css')) {
        const link = document.createElement('link');
        link.id = 'docx-preview-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/docx-preview/dist/docx-preview.css';
        document.head.appendChild(link);
        if (isDev) console.debug('[tool] injected docx-preview css');
      }
    }
    const docUrl = resolveDocUrl(url);
    if (isDev) console.debug('[tool] preview fetch', { url, resolved: docUrl });
    const res = await fetch(docUrl);
    if (!res.ok) throw new Error(`preview fetch failed: ${res.status}`);
    const buf = await res.arrayBuffer();
    // dynamic import to avoid SSR issues and optional dependency
    const mod: any = await import('docx-preview').catch((e) => { if (isDev) console.debug('[tool] import docx-preview failed', e); return null; });
    const renderAsync = (mod && mod.renderAsync) || (mod && mod.default && mod.default.renderAsync);
    if (typeof renderAsync !== 'function') {
      throw new Error(locale === 'zh' ? 'docx-preview 未提供 renderAsync，请确认版本或依赖安装。' : 'docx-preview renderAsync not found. Check version/installation.');
    }
    if (isDev) console.debug('[tool] renderAsync start');
    await renderAsync(buf, container, undefined, {
      className: 'docx-preview',
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
    });
    if (isDev) console.debug('[tool] renderAsync done');
  }

  async function handleStart() {
    setError("");
    if (!templateId) {
      setError(t("noTemplate"));
      return;
    }
    try {
      if (isDev) console.debug('[tool] start formatting', { templateId, guideSlug });
      const up = await handleUpload();
      setFormatting(true);
      const body = { file_id: up.file_id, template_id: templateId } as any;
      if (isDev) console.debug('[tool] format -> POST', `${API_BASE}/format`, body);
      const res = await fetch(`${API_BASE}/format`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) {
        let msg = `format failed: ${res.status}`;
        try {
          const j = await res.json();
          if (j?.detail) msg += ` - ${j.detail}`;
        } catch {}
        throw new Error(msg);
      }
      const data = (await res.json()) as { job_id: string };
      setJobId(data.job_id);
      if (isDev) console.debug('[tool] format <- OK job', data);
      await pollJob(data.job_id);
    } catch (e: any) {
      setError(String(e?.message || e));
      if (isDev) console.debug('[tool] start error', e);
    } finally {
      setFormatting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Context / related guide link (do not display template_id) */}
      <section className="rounded-lg border p-4">
        <div className="text-sm font-medium text-slate-900">{t("selectTemplate")}</div>
        <div className="mt-2 text-sm text-slate-700">
          {guideSlug ? (
            <a className="text-cyan-700 underline" href={`/${locale}/guides/${guideSlug}`}>
              {locale === 'zh' ? '查看关联指南' : 'View related guide'}
            </a>
          ) : (
            <span className="text-xs text-slate-500">{locale === 'zh' ? '无关联指南' : 'No related guide'}</span>
          )}
        </div>
        {!templateId ? (
          <div className="mt-2 text-xs text-rose-600">{t("noTemplate")}</div>
        ) : null}
      </section>

      {/* Upload */}
      <section className="rounded-lg border p-4">
        <div className="text-sm font-medium text-slate-900">{t("uploadDoc")}</div>
        <div className="mt-2 flex items-center gap-3">
          <input type="file" accept=".docx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          {file ? <span className="text-xs text-slate-600">{file.name}</span> : null}
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleStart}
          disabled={uploading || formatting}
          className={`rounded-md px-4 py-2 text-sm text-white ${uploading || formatting ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800'}`}
        >
          {uploading ? t("uploading") : formatting ? t("formatting") : t("start")}
        </button>
        {jobId ? <span className="text-xs text-slate-600">{t("job")}: {jobId}</span> : null}
      </div>

      {/* Status */}
      {error ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{t("error")}: {error}</div>
      ) : null}
      {jobStatus ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <div className="font-medium text-slate-900">{t("result")}</div>
          <div className="mt-1 text-slate-700">status: {jobStatus.status}</div>
          {jobStatus.result ? (
            <div className="mt-2 flex items-center gap-4">
              {jobStatus.result.formatted_doc_url ? (
                <a className="text-cyan-700 underline" href={resolveDocUrl(jobStatus.result.formatted_doc_url)} target="_blank" rel="noopener noreferrer">{t("downloadDoc")}</a>
              ) : null}
              {/* No format map download per requirement */}
            </div>
          ) : null}
          {jobStatus.error ? <div className="mt-1 text-rose-600">{jobStatus.error}</div> : null}
          {jobStatus?.status === 'succeeded' && jobStatus.result?.formatted_doc_url ? (
            <div className="mt-4">
              <div className="mb-2 text-sm font-medium text-slate-900">{locale === 'zh' ? '预览' : 'Preview'}</div>
              {previewError ? (
                <div className="mb-2 text-xs text-rose-600">{previewError}</div>
              ) : null}
              <div ref={previewRef} className="docx-container overflow-auto rounded-md border p-3"></div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
