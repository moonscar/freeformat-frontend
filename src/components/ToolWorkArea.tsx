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

  async function handleUpload(): Promise<UploadResult> {
    if (!file) throw new Error(locale === "zh" ? "请先选择 .docx 文件" : "Please choose a .docx file first");
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: fd });
      if (!res.ok) {
        let msg = `upload failed: ${res.status}`;
        try {
          const j = await res.json();
          if (j?.detail) msg += ` - ${j.detail}`;
        } catch {}
        throw new Error(msg);
      }
      return (await res.json()) as UploadResult;
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
      if (js.status === "succeeded" || js.status === "failed") return;
      attempts += 1;
      if (attempts < 300) setTimeout(poll, 1500);
    };
    poll().catch((e) => setError(String(e)));
  }

  async function handleStart() {
    setError("");
    if (!templateId) {
      setError(t("noTemplate"));
      return;
    }
    try {
      const up = await handleUpload();
      setFormatting(true);
      const body = { file_id: up.file_id, template_id: templateId } as any;
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
      await pollJob(data.job_id);
    } catch (e: any) {
      setError(String(e?.message || e));
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
                <a className="text-cyan-700 underline" href={jobStatus.result.formatted_doc_url} target="_blank" rel="noopener noreferrer">{t("downloadDoc")}</a>
              ) : null}
              {/* No format map download per requirement */}
            </div>
          ) : null}
          {jobStatus.error ? <div className="mt-1 text-rose-600">{jobStatus.error}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
