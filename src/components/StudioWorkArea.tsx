"use client";

import React from "react";

type Props = {
  locale: "en" | "zh";
};

type UploadResult = { file_id: string; filename: string; url: string };
type JobStatus = { job_id: string; status: string; result?: { formatted_doc_url?: string; format_map_url?: string } | null; error?: string | null };

type GuideSearchItem = {
  slug: string;
  locale: string;
  title?: string | null;
  templateId: string;
  templateTier?: string | null;
  status: string;
};

type CheckItem = {
  code: string;
  title: string;
  strength: "strong" | "medium" | "weak";
  status: "pass" | "warn" | "fail" | "unknown";
  confidence: number;
  weight: number;
  recommendation?: string | null;
};

type CheckReport = {
  summary: { score: number; confidence: number; counts?: Record<string, number> };
  items: CheckItem[];
};

type CheckResponse = {
  created_at: string;
  report: CheckReport;
  report_key: string;
  report_url?: string | null;
  docjson_key: string;
  docjson_url?: string | null;
};

type TemplateSpec = {
  metadata?: any;
  font_rules?: Record<string, any>;
  table_rules?: Record<string, any>;
  figure_rules?: Record<string, any>;
  custom_rules?: Record<string, any>;
};

type DocJsonBlock = {
  id: string;
  type: string;
  text: string;
};

type DocJson = {
  content?: DocJsonBlock[];
};

type EditableStyle = {
  font?: string;
  size?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  line_spacing?: number;
  align?: "left" | "center" | "right" | "justify";
  before_spacing?: number;
  after_spacing?: number;
  first_line_indent?: number;
};

const DEFAULT_ALIGN: Array<EditableStyle["align"] | ""> = ["", "left", "center", "right", "justify"];

function compactStyle(style: EditableStyle): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(style)) {
    if (v === undefined) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    out[k] = v;
  }
  return out;
}

function toNum(s: string): number | undefined {
  const t = s.trim();
  if (!t) return undefined;
  const n = Number(t);
  if (Number.isFinite(n)) return n;
  return undefined;
}

export default function StudioWorkArea({ locale }: Props) {
  const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "/api").replace(/\/$/, "");
  const isDev = process.env.NODE_ENV !== "production";

  const [file, setFile] = React.useState<File | null>(null);
  const [uploaded, setUploaded] = React.useState<UploadResult | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const [templateId, setTemplateId] = React.useState<string>("");
  const [currentGuideSlug, setCurrentGuideSlug] = React.useState<string>("");
  const [currentGuideTitle, setCurrentGuideTitle] = React.useState<string>("");

  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [searching, setSearching] = React.useState(false);
  const [searchError, setSearchError] = React.useState<string>("");
  const [searchResults, setSearchResults] = React.useState<GuideSearchItem[]>([]);

  const [templateSpec, setTemplateSpec] = React.useState<TemplateSpec | null>(null);
  const [templateLoading, setTemplateLoading] = React.useState(false);
  const [templateError, setTemplateError] = React.useState<string>("");

  const [selectedTypeQuery, setSelectedTypeQuery] = React.useState<string>("");
  const [selectedType, setSelectedType] = React.useState<string>("");

  // Patch state (session-only).
  const [patchFontRules, setPatchFontRules] = React.useState<Record<string, EditableStyle>>({});
  const [patchDirty, setPatchDirty] = React.useState(false);

  const [formatting, setFormatting] = React.useState(false);
  const [jobId, setJobId] = React.useState<string>("");
  const [jobStatus, setJobStatus] = React.useState<JobStatus | null>(null);
  const [error, setError] = React.useState<string>("");
  const [checking, setChecking] = React.useState(false);
  const [checkResult, setCheckResult] = React.useState<CheckResponse | null>(null);
  const [advancedOpen, setAdvancedOpen] = React.useState(false);

  const previewRef = React.useRef<HTMLDivElement | null>(null);
  const [previewError, setPreviewError] = React.useState<string>("");
  const [docJson, setDocJson] = React.useState<DocJson | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = React.useState<string>("");
  const [formattedPreviewUrl, setFormattedPreviewUrl] = React.useState<string>("");
  const [previewMode, setPreviewMode] = React.useState<"original" | "formatted">("original");

  // Find-by-text to help locate types quickly.
  const [findQuery, setFindQuery] = React.useState<string>("");
  const [findResults, setFindResults] = React.useState<Array<{ type: string; text: string }>>([]);

  const sessionKey = React.useMemo(() => {
    if (!templateId) return "";
    return `ff_studio_patch_v1::${templateId}`;
  }, [templateId]);

  React.useEffect(() => {
    if (!sessionKey) return;
    try {
      const raw = sessionStorage.getItem(sessionKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && parsed.font_rules && typeof parsed.font_rules === "object") {
        setPatchFontRules(parsed.font_rules);
        setPatchDirty(false);
      }
    } catch (e) {
      if (isDev) console.debug("[studio] load session patch failed", e);
    }
  }, [sessionKey, isDev]);

  // Load a default template list on first render (reduce friction).
  React.useEffect(() => {
    void handleSearch();
  }, []);

  // Default selection: preselect a recommended template to reduce friction.
  React.useEffect(() => {
    if (templateId) return;
    if (!searchResults.length) return;
    const preferredSlug = locale === "zh" ? "ustc-edu" : "apa-org";
    const preferred = searchResults.find((x) => x.slug === preferredSlug);
    if (preferred) {
      handleSelectGuide(preferred);
      return;
    }
    const gold = searchResults.find((x) => (x.templateTier || "").toLowerCase() === "gold");
    if (gold) {
      handleSelectGuide(gold);
      return;
    }
    handleSelectGuide(searchResults[0]);
  }, [searchResults, templateId, locale]);

  React.useEffect(() => {
    if (!sessionKey) return;
    try {
      const payload = { font_rules: patchFontRules };
      sessionStorage.setItem(sessionKey, JSON.stringify(payload));
    } catch (e) {
      if (isDev) console.debug("[studio] save session patch failed", e);
    }
  }, [sessionKey, patchFontRules, isDev]);

  const activePreviewUrl = React.useMemo(() => {
    return previewMode === "formatted" ? formattedPreviewUrl : originalPreviewUrl;
  }, [previewMode, formattedPreviewUrl, originalPreviewUrl]);

  // Progressive disclosure: only show preview after the "upload → check" attempt finishes.
  const canShowPreview = React.useMemo(() => {
    return Boolean(uploaded && originalPreviewUrl);
  }, [uploaded, originalPreviewUrl]);

  function resolveDocUrl(url: string): string {
    if (!url) return url;
    if (url.startsWith("/")) return `${API_BASE}${url}`;
    // If backend returns a storage key (e.g., results/xxx.docx), it should already be converted to a URL.
    return url;
  }

  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSearching(true);
    setSearchError("");
    try {
      const params = new URLSearchParams();
      params.set("locale", locale);
      const q = searchQuery.trim();
      if (q) params.set("q", q);
      params.set("limit", "20");
      const url = `${API_BASE}/guides/search?${params.toString()}`;
      if (isDev) console.debug("[studio] search ->", url);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`search failed: ${res.status}`);
      const js = (await res.json()) as any[];
      const items: GuideSearchItem[] = (js || []).map((it) => ({
        slug: it.slug,
        locale: it.locale,
        title: it.title,
        templateId: it.template_id,
        templateTier: it.template_tier,
        status: it.status,
      }));
      setSearchResults(items);
    } catch (e: any) {
      setSearchError(String(e?.message || e));
    } finally {
      setSearching(false);
    }
  }

  function handleSelectGuide(item: GuideSearchItem) {
    setTemplateId(item.templateId);
    setCurrentGuideSlug(item.slug);
    setCurrentGuideTitle(item.title || "");
    setTemplateSpec(null);
    setSelectedType("");
    setSelectedTypeQuery("");
    setFindQuery("");
    setFindResults([]);
    setDocJson(null);
    setError("");
  }

  React.useEffect(() => {
    if (!templateId) return;
    async function loadTemplate() {
      setTemplateLoading(true);
      setTemplateError("");
      try {
        const url = `${API_BASE}/templates/${templateId}?include_spec=true&include_guideline=false`;
        if (isDev) console.debug("[studio] template ->", url);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`template fetch failed: ${res.status}`);
        const j = await res.json();
        setTemplateSpec(j?.spec || null);
      } catch (e: any) {
        setTemplateError(String(e?.message || e));
      } finally {
        setTemplateLoading(false);
      }
    }
    void loadTemplate();
  }, [templateId, API_BASE, isDev]);

  const types = React.useMemo(() => {
    const rules = templateSpec?.font_rules || {};
    return Object.keys(rules).sort();
  }, [templateSpec]);

  const filteredTypes = React.useMemo(() => {
    const q = selectedTypeQuery.trim().toLowerCase();
    if (!q) return types.slice(0, 50);
    return types.filter((t) => t.toLowerCase().includes(q)).slice(0, 50);
  }, [types, selectedTypeQuery]);

  function baseStyleFor(type: string): EditableStyle {
    const raw = (templateSpec?.font_rules || {})[type] || {};
    return {
      font: typeof raw.font === "string" ? raw.font : undefined,
      size: typeof raw.size === "string" ? raw.size : undefined,
      bold: typeof raw.bold === "boolean" ? raw.bold : undefined,
      italic: typeof raw.italic === "boolean" ? raw.italic : undefined,
      underline: typeof raw.underline === "boolean" ? raw.underline : undefined,
      line_spacing: typeof raw.line_spacing === "number" ? raw.line_spacing : undefined,
      align: typeof raw.align === "string" ? raw.align : undefined,
      before_spacing: typeof raw.before_spacing === "number" ? raw.before_spacing : undefined,
      after_spacing: typeof raw.after_spacing === "number" ? raw.after_spacing : undefined,
      first_line_indent: typeof raw.first_line_indent === "number" ? raw.first_line_indent : undefined,
    };
  }

  function effectiveStyleFor(type: string): EditableStyle {
    return { ...baseStyleFor(type), ...(patchFontRules[type] || {}) };
  }

  function updateStyle(type: string, next: EditableStyle) {
    setPatchFontRules((prev) => ({ ...prev, [type]: next }));
    setPatchDirty(true);
  }

  function resetPatch() {
    setPatchFontRules({});
    setPatchDirty(true);
  }

  async function handleUploadOnce(): Promise<UploadResult> {
    if (!file) throw new Error(locale === "zh" ? "请先选择 .docx 文件" : "Please choose a .docx file first");
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);
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
      if (js.status === "succeeded") {
        const docUrl = js.result?.formatted_doc_url;
        const mapUrl = js.result?.format_map_url;
        if (docUrl) {
          setFormattedPreviewUrl(docUrl);
          setPreviewMode("formatted");
        }
        if (mapUrl) {
          await fetchDocJson(mapUrl);
        }
        setPatchDirty(false);
        return;
      }
      if (js.status === "failed") return;
      attempts += 1;
      if (attempts < 300) setTimeout(poll, 1500);
    };
    await poll();
  }

  async function fetchDocJson(url: string) {
    try {
      const resolved = resolveDocUrl(url);
      const res = await fetch(resolved);
      if (!res.ok) return;
      const j = (await res.json()) as DocJson;
      setDocJson(j);
    } catch (e) {
      if (isDev) console.debug("[studio] fetch doc.json failed", e);
    }
  }

  async function runCheckForFileId(fileId: string) {
    if (!templateId) throw new Error(locale === "zh" ? "请先选择一个模板" : "Please select a template first.");
    setChecking(true);
    setCheckResult(null);
    try {
      const body = { file_id: fileId, template_id: templateId } as any;
      const res = await fetch(`${API_BASE}/check`, {
        method: "POST",
        headers: { "content-type": "application/json" },
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
      const data = (await res.json()) as CheckResponse;
      setCheckResult(data);
      if (data.docjson_url) {
        await fetchDocJson(data.docjson_url);
      }
      return data;
    } finally {
      setChecking(false);
    }
  }

  async function handleUploadAndAutoCheck() {
    setError("");
    setPreviewError("");
    setCheckResult(null);
    setDocJson(null);
    setAdvancedOpen(false);
    if (!templateId) {
      setError(locale === "zh" ? "请先选择一个模板" : "Please select a template first.");
      return;
    }
    if (!file) {
      setError(locale === "zh" ? "请先选择 .docx 文件" : "Please choose a .docx file first");
      return;
    }
    let up: UploadResult | null = null;
    try {
      up = await handleUploadOnce();
      setUploaded(up);
      await runCheckForFileId(up.file_id);
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      // Show the original preview only after the check attempt finishes.
      if (up?.url) {
        setOriginalPreviewUrl(up.url || "");
        setFormattedPreviewUrl("");
        setPreviewMode("original");
      }
    }
  }

  async function renderPreview(url: string) {
    const container = previewRef.current;
    if (!container) return;
    setPreviewError("");
    container.innerHTML = "";

    // runtime style (CDN) – best-effort, same approach as /tool.
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      if (!document.getElementById("docx-preview-css")) {
        const link = document.createElement("link");
        link.id = "docx-preview-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/docx-preview/dist/docx-preview.css";
        document.head.appendChild(link);
      }
    }

    const docUrl = resolveDocUrl(url);
    const res = await fetch(docUrl);
    if (!res.ok) throw new Error(`preview fetch failed: ${res.status}`);
    const buf = await res.arrayBuffer();
    const mod: any = await import("docx-preview");
    const renderAsync = mod?.renderAsync || mod?.default?.renderAsync;
    if (typeof renderAsync !== "function") {
      throw new Error(locale === "zh" ? "docx-preview renderAsync 不可用" : "docx-preview renderAsync not available");
    }
    await renderAsync(buf, container, undefined, {
      className: "docx-preview",
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
    });
  }

  React.useEffect(() => {
    if (!activePreviewUrl) return;
    if (!canShowPreview) return;
    renderPreview(activePreviewUrl).catch((e: any) => setPreviewError(String(e?.message || e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePreviewUrl, canShowPreview]);

  function buildTemplatePatchPayload(): any {
    const fontRules: Record<string, any> = {};
    for (const [type, style] of Object.entries(patchFontRules)) {
      const compact = compactStyle(style);
      if (Object.keys(compact).length) fontRules[type] = compact;
    }
    if (!Object.keys(fontRules).length) return null;
    return { font_rules: fontRules };
  }

  async function runFormat() {
    setError("");
    setPreviewError("");
    // keep last check visible; users can re-run check by uploading again or changing template.
    if (!templateId) {
      setError(locale === "zh" ? "请先选择一个模板" : "Please select a template first.");
      return;
    }
    if (!file) {
      setError(locale === "zh" ? "请先选择 .docx 文件" : "Please choose a .docx file first");
      return;
    }
    try {
      let up = uploaded;
      if (!up) {
        // first-time: upload and auto-check, then allow formatting.
        up = await handleUploadOnce();
        setUploaded(up);
        await runCheckForFileId(up.file_id);
        // Align with progressive disclosure: show preview after check finishes.
        setOriginalPreviewUrl(up.url || "");
        setFormattedPreviewUrl("");
        setPreviewMode("original");
      }
      setFormatting(true);
      const body: any = {
        file_id: up.file_id,
        template_id: templateId,
      };
      const patch = buildTemplatePatchPayload();
      if (patch) body.template_patch = patch;
      const res = await fetch(`${API_BASE}/format`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
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

  React.useEffect(() => {
    const q = findQuery.trim();
    if (!q) {
      setFindResults([]);
      return;
    }
    const blocks = (docJson?.content || []).filter((b) => (b?.text || "").includes(q));
    const out = blocks.slice(0, 10).map((b) => ({ type: b.type, text: b.text }));
    setFindResults(out);
  }, [findQuery, docJson]);

  function pickType(type: string) {
    setSelectedType(type);
    setSelectedTypeQuery(type);
  }

  function scrollToText(text: string) {
    const container = previewRef.current;
    if (!container) return;
    const needle = text.trim().slice(0, 30);
    if (!needle) return;

    // naive: find the first element containing this text.
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);
    let node = walker.nextNode() as HTMLElement | null;
    while (node) {
      if ((node.textContent || "").includes(needle)) {
        node.scrollIntoView({ block: "center" });
        return;
      }
      node = walker.nextNode() as HTMLElement | null;
    }
  }

  const styleEditingType = selectedType && types.includes(selectedType) ? selectedType : "";
  const effectiveStyle = styleEditingType ? effectiveStyleFor(styleEditingType) : null;

  const actionableIssues = React.useMemo(() => {
    const items = checkResult?.report?.items || [];
    return items.filter((x) => x.status === "fail" || x.status === "warn");
  }, [checkResult]);

  const hasCheckAttempted = Boolean(originalPreviewUrl);

  return (
    <div className={`grid grid-cols-1 gap-6 ${canShowPreview ? "lg:grid-cols-12" : ""}`}>
      <section className={`${canShowPreview ? "lg:col-span-4" : "lg:col-span-12"} space-y-4`}>
        {/* Before upload/check: keep the UI focused on template + upload */}
        {!hasCheckAttempted ? (
          <div className="rounded-lg border bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">{locale === "zh" ? "开始使用" : "Get started"}</div>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
              <li>{locale === "zh" ? "确认模板（可搜索切换）。" : "Confirm a template (search/switch if needed)."}</li>
              <li>{locale === "zh" ? "选择并上传你的 .docx。" : "Choose and upload your .docx."}</li>
              <li>{locale === "zh" ? "上传后自动运行检查：评分 + 不符合项。" : "We auto-run a check: score + issues."}</li>
            </ol>
            <div className="mt-3 text-xs text-slate-600">
              {locale === "zh"
                ? "完成检查后会展示只读预览（原文/格式化后），并可选择是否展开高级调参。"
                : "After the check finishes, you’ll get a read-only preview (original/formatted) and an optional advanced tuning panel."}
            </div>
          </div>
        ) : null}

        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">{locale === "zh" ? "模板" : "Template"}</div>
          <div className="mt-1 text-xs text-slate-600">
            {templateId ? (
              <>
                <span className="font-mono">{currentGuideTitle || currentGuideSlug || templateId}</span>
              </>
            ) : (
              <span className="text-rose-600">{locale === "zh" ? "请先选择一个指南/模板" : "Select a guide/template first"}</span>
            )}
          </div>
          <form onSubmit={handleSearch} className="mt-3 flex items-center gap-2">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === "zh" ? "搜索指南/学校，例如：IEEE、USTC" : "Search guides, e.g. IEEE, USTC"}
              className="w-full rounded-md border px-2 py-1 text-sm"
            />
            <button
              type="submit"
              disabled={searching}
              className={`rounded-md px-3 py-1 text-sm text-white ${searching ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800"}`}
            >
              {searching ? (locale === "zh" ? "搜索中…" : "Searching…") : (locale === "zh" ? "搜索" : "Search")}
            </button>
          </form>
          {searchError ? <div className="mt-2 text-xs text-rose-600">{searchError}</div> : null}
          {searchResults.length ? (
            <div className="mt-3 max-h-56 space-y-1 overflow-auto text-sm">
              {searchResults.map((item) => (
                <button
                  key={`${item.slug}-${item.locale}`}
                  type="button"
                  onClick={() => handleSelectGuide(item)}
                  className={`w-full rounded border px-2 py-1 text-left hover:bg-slate-50 ${item.templateId === templateId ? "border-cyan-500 bg-cyan-50" : ""}`}
                >
                  <div className="font-medium text-slate-900">{item.title || item.slug}</div>
                  <div className="font-mono text-[11px] text-slate-500">{item.slug}</div>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">{locale === "zh" ? "文件" : "Document"}</div>
          <input
            type="file"
            accept=".docx"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setFile(f);
              setUploaded(null);
              setJobId("");
              setJobStatus(null);
              setDocJson(null);
              setFindQuery("");
              setFindResults([]);
              setCheckResult(null);
              setAdvancedOpen(false);
              setOriginalPreviewUrl("");
              setFormattedPreviewUrl("");
              setPreviewMode("original");
              setPreviewError("");
              setError("");
            }}
            className="mt-2 w-full text-sm"
          />
          <div className="mt-2 text-xs text-slate-600">
            {uploaded ? (
              <>
                {locale === "zh" ? "已上传：" : "Uploaded: "} <span className="font-mono">{uploaded.file_id}</span>
              </>
            ) : (
              <>{locale === "zh" ? "上传后会自动运行检查（评分 + 不符合项）。" : "After upload, we automatically run a check (score + issues)."}</>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={uploaded ? () => runCheckForFileId(uploaded.file_id).catch((e: any) => setError(String(e?.message || e))) : handleUploadAndAutoCheck}
              disabled={uploading || checking || !templateId || !file}
              className={`rounded-md px-3 py-1 text-sm text-white ${uploading || formatting ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800"}`}
            >
              {uploading
                ? (locale === "zh" ? "上传中…" : "Uploading…")
                : checking
                ? (locale === "zh" ? "检查中…" : "Checking…")
                : uploaded
                ? (locale === "zh" ? "重新运行检查" : "Re-run check")
                : (locale === "zh" ? "上传并自动检查" : "Upload & auto-check")}
            </button>
            <button
              type="button"
              onClick={runFormat}
              disabled={uploading || formatting || !templateId || !file || !uploaded}
              className={`rounded-md px-3 py-1 text-sm text-white ${uploading || formatting ? "bg-slate-400" : "bg-slate-700 hover:bg-slate-800"} disabled:opacity-50`}
            >
              {formatting ? (locale === "zh" ? "格式化中…" : "Formatting…") : (patchDirty ? (locale === "zh" ? "重新格式化并预览" : "Reformat & preview") : (locale === "zh" ? "格式化并预览" : "Format & preview"))}
            </button>
            {advancedOpen ? (
              <button
                type="button"
                onClick={resetPatch}
                disabled={!Object.keys(patchFontRules).length}
                className="rounded-md border px-3 py-1 text-sm hover:bg-slate-50 disabled:opacity-50"
              >
                {locale === "zh" ? "重置本次调参" : "Reset session changes"}
              </button>
            ) : null}
          </div>
          {error ? <div className="mt-2 text-sm text-rose-600">{error}</div> : null}
          {jobId ? (
            <div className="mt-2 text-xs text-slate-600">
              {locale === "zh" ? "任务：" : "Job: "} <span className="font-mono">{jobId}</span> {jobStatus ? `(${jobStatus.status})` : null}
            </div>
          ) : null}
        </div>

        {hasCheckAttempted ? (
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-semibold text-slate-900">{locale === "zh" ? "检查结果（自动生成）" : "Check report (auto)"}</div>
            {checkResult?.report?.summary ? (
              <div className="text-xs text-slate-700">
                <span className="font-semibold">{locale === "zh" ? "评分" : "Score"}:</span>{" "}
                <span className="font-mono">{Math.round(checkResult.report.summary.score)}</span>{" "}
                <span className="ml-2 font-semibold">{locale === "zh" ? "置信度" : "Confidence"}:</span>{" "}
                <span className="font-mono">{Math.round(checkResult.report.summary.confidence * 100)}%</span>
              </div>
            ) : null}
          </div>
          {checkResult ? (
            actionableIssues.length ? (
              <ul className="mt-3 space-y-2 text-sm">
                {actionableIssues.slice(0, 12).map((it) => (
                  <li key={`${it.code}-${it.title}`} className="rounded-md border bg-slate-50 p-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-medium text-slate-900">{it.title}</div>
                        {it.recommendation ? <div className="mt-1 text-xs text-slate-700">{it.recommendation}</div> : null}
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          it.status === "fail" ? "bg-rose-500/10 text-rose-700 border border-rose-200" : "bg-amber-500/10 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {it.status === "fail" ? (locale === "zh" ? "不合格" : "Fail") : (locale === "zh" ? "警告" : "Warn")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 text-sm text-slate-700">{locale === "zh" ? "未发现明显不符合项（或均为 pass）。" : "No obvious issues (or all pass)."}</div>
            )
          ) : (
            <div className="mt-3 text-sm text-slate-700">
              {locale === "zh"
                ? "上传文件后会自动运行检查，并在这里列出不符合当前模板的要点。"
                : "After uploading, we automatically run a check and list the mismatches here."}
            </div>
          )}
        </div>
        ) : null}

        {hasCheckAttempted ? (
          <div className="rounded-lg border bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-slate-900">{locale === "zh" ? "高级调参（可选）" : "Advanced tuning (optional)"}</div>
                <div className="mt-1 text-xs text-slate-600">
                  {locale === "zh"
                    ? "不展示“全量参数大全”。如果需要，再展开定位类型并微调样式参数。"
                    : "No giant parameter list. Expand only if you need to locate a type and tweak style parameters."}
                </div>
              </div>
              <button
                type="button"
                className="rounded-md border px-3 py-1 text-sm hover:bg-slate-50"
                onClick={() => setAdvancedOpen((v) => !v)}
              >
                {advancedOpen ? (locale === "zh" ? "收起" : "Collapse") : (locale === "zh" ? "展开" : "Expand")}
              </button>
            </div>
            <div className="mt-3 text-xs text-slate-600">
              {locale === "zh"
                ? "提示：修改参数后点击“重新格式化并预览”，任务完成后预览会自动刷新。参数仅在当前会话中保存。"
                : "Tip: change values then click Reformat & preview. Preview refreshes after the job finishes. Changes are session-only."}
            </div>
          </div>
        ) : null}

        {hasCheckAttempted && advancedOpen ? (
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">{locale === "zh" ? "定位段落类型（搜索/引导）" : "Locate a block type (search / guide)"}</div>
          <p className="mt-1 text-xs text-slate-600">
            {locale === "zh"
              ? "不展示“全量参数大全”。先在预览里发现问题，再用搜索定位到段落类型，然后只编辑该类型的样式参数。"
              : "No giant parameter list. Find an issue in preview, locate the block type, then edit only that type."}
          </p>

          <div className="mt-3">
            <div className="text-xs font-medium text-slate-700">{locale === "zh" ? "按类型名搜索" : "Search by type id"}</div>
            <input
              value={selectedTypeQuery}
              onChange={(e) => setSelectedTypeQuery(e.target.value)}
              placeholder={locale === "zh" ? "例如：paragraph / section_title" : "e.g. paragraph / section_title"}
              className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
            />
            <div className="mt-2 max-h-36 overflow-auto rounded border bg-slate-50 p-2 text-xs">
              {templateLoading ? (
                <div className="text-slate-600">{locale === "zh" ? "加载模板中…" : "Loading template…"}</div>
              ) : templateError ? (
                <div className="text-rose-600">{templateError}</div>
              ) : filteredTypes.length ? (
                <div className="flex flex-wrap gap-2">
                  {filteredTypes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => pickType(t)}
                      className={`rounded-full border px-2 py-0.5 font-mono ${t === selectedType ? "border-cyan-500 bg-cyan-50" : "hover:bg-white"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-slate-600">{locale === "zh" ? "暂无可选类型（请先选择模板）" : "No types yet (select a template first)."}</div>
              )}
            </div>
          </div>

          <div className="mt-3">
            <div className="text-xs font-medium text-slate-700">{locale === "zh" ? "按文本定位（基于 doc.json）" : "Find by text (from doc.json)"}</div>
            <input
              value={findQuery}
              onChange={(e) => setFindQuery(e.target.value)}
              placeholder={locale === "zh" ? "输入正文中的一段文字…" : "Type a snippet from your doc…"}
              className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
              disabled={!docJson?.content?.length}
            />
            {docJson?.content?.length ? (
              <div className="mt-2 max-h-40 overflow-auto rounded border bg-slate-50 p-2 text-xs">
                {findResults.length ? (
                  <ul className="space-y-2">
                    {findResults.map((r, idx) => (
                      <li key={`${r.type}-${idx}`} className="rounded bg-white p-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] text-slate-600">{r.type}</span>
                          <button
                            type="button"
                            className="rounded border px-2 py-0.5 text-[11px] hover:bg-slate-50"
                            onClick={() => {
                              pickType(r.type);
                              scrollToText(r.text);
                            }}
                          >
                            {locale === "zh" ? "定位" : "Locate"}
                          </button>
                        </div>
                        <div className="mt-1 line-clamp-3 text-slate-800">{r.text}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-slate-600">{locale === "zh" ? "未找到匹配段落。" : "No matches."}</div>
                )}
              </div>
            ) : (
            <div className="mt-2 text-xs text-slate-600">
              {locale === "zh" ? "完成一次格式化后，会自动加载 doc.json 以支持按文本定位段落类型。" : "After a successful format run, doc.json will be loaded to support text-based locating."}
            </div>
          )}
          </div>
        </div>
        ) : null}

        {hasCheckAttempted && advancedOpen ? (
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">{locale === "zh" ? "参数编辑（仅当前类型）" : "Edit parameters (current type only)"}</div>
          {!styleEditingType ? (
            <div className="mt-2 text-sm text-slate-600">{locale === "zh" ? "请选择一个段落类型后再编辑。" : "Select a block type to edit."}</div>
          ) : (
            <>
              <div className="mt-2 text-xs text-slate-600">
                {locale === "zh" ? "当前类型：" : "Type: "} <span className="font-mono">{styleEditingType}</span>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 text-sm">
                <label className="grid gap-1">
                  <span className="text-xs text-slate-600">{locale === "zh" ? "字体 font" : "Font"}</span>
                  <input
                    value={effectiveStyle?.font || ""}
                    onChange={(e) => updateStyle(styleEditingType, { ...effectiveStyleFor(styleEditingType), font: e.target.value })}
                    className="rounded-md border px-2 py-1"
                    placeholder={locale === "zh" ? "例如：宋体 / Times New Roman" : "e.g. Times New Roman"}
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs text-slate-600">{locale === "zh" ? "字号 size（字符串）" : "Size (string)"}</span>
                  <input
                    value={effectiveStyle?.size || ""}
                    onChange={(e) => updateStyle(styleEditingType, { ...effectiveStyleFor(styleEditingType), size: e.target.value })}
                    className="rounded-md border px-2 py-1"
                    placeholder={locale === "zh" ? "例如：12pt / 小四 / 五号" : "e.g. 12pt"}
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs text-slate-600">{locale === "zh" ? "对齐 align" : "Align"}</span>
                  <select
                    value={effectiveStyle?.align || ""}
                    onChange={(e) =>
                      updateStyle(styleEditingType, {
                        ...effectiveStyleFor(styleEditingType),
                        align: (e.target.value || undefined) as any,
                      })
                    }
                    className="rounded-md border px-2 py-1"
                  >
                    {DEFAULT_ALIGN.map((v) => (
                      <option key={v || "unset"} value={v || ""}>
                        {v ? v : (locale === "zh" ? "（不修改）" : "(no override)")}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="grid gap-1">
                    <span className="text-xs text-slate-600">{locale === "zh" ? "行距 line_spacing（倍数）" : "Line spacing (multiple)"}</span>
                    <input
                      value={effectiveStyle?.line_spacing ?? ""}
                      onChange={(e) => updateStyle(styleEditingType, { ...effectiveStyleFor(styleEditingType), line_spacing: toNum(e.target.value) })}
                      className="rounded-md border px-2 py-1"
                      inputMode="decimal"
                      placeholder="1.5"
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-xs text-slate-600">{locale === "zh" ? "首行缩进 first_line_indent（cm）" : "First line indent (cm)"}</span>
                    <input
                      value={effectiveStyle?.first_line_indent ?? ""}
                      onChange={(e) => updateStyle(styleEditingType, { ...effectiveStyleFor(styleEditingType), first_line_indent: toNum(e.target.value) })}
                      className="rounded-md border px-2 py-1"
                      inputMode="decimal"
                      placeholder="0.5"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="grid gap-1">
                    <span className="text-xs text-slate-600">{locale === "zh" ? "段前 before_spacing（pt）" : "Before spacing (pt)"}</span>
                    <input
                      value={effectiveStyle?.before_spacing ?? ""}
                      onChange={(e) => updateStyle(styleEditingType, { ...effectiveStyleFor(styleEditingType), before_spacing: toNum(e.target.value) })}
                      className="rounded-md border px-2 py-1"
                      inputMode="decimal"
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-xs text-slate-600">{locale === "zh" ? "段后 after_spacing（pt）" : "After spacing (pt)"}</span>
                    <input
                      value={effectiveStyle?.after_spacing ?? ""}
                      onChange={(e) => updateStyle(styleEditingType, { ...effectiveStyleFor(styleEditingType), after_spacing: toNum(e.target.value) })}
                      className="rounded-md border px-2 py-1"
                      inputMode="decimal"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!effectiveStyle?.bold}
                      onChange={(e) => updateStyle(styleEditingType, { ...effectiveStyleFor(styleEditingType), bold: e.target.checked })}
                    />
                    <span className="text-xs text-slate-700">bold</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!effectiveStyle?.italic}
                      onChange={(e) => updateStyle(styleEditingType, { ...effectiveStyleFor(styleEditingType), italic: e.target.checked })}
                    />
                    <span className="text-xs text-slate-700">italic</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!effectiveStyle?.underline}
                      onChange={(e) => updateStyle(styleEditingType, { ...effectiveStyleFor(styleEditingType), underline: e.target.checked })}
                    />
                    <span className="text-xs text-slate-700">underline</span>
                  </label>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-600">
                {locale === "zh"
                  ? "提示：修改参数后点击“重新格式化”，任务完成后预览会自动刷新。参数仅在当前会话中保存。"
                  : "Tip: change values then click Reformat. Preview refreshes after the job finishes. Changes are session-only."}
              </div>
            </>
          )}
        </div>
        ) : null}
      </section>

	      {canShowPreview ? (
	        <section className="lg:col-span-8">
	          <div className="rounded-lg border bg-white">
	            <div className="border-b px-4 py-3">
	              <div className="flex flex-wrap items-center justify-between gap-2">
	                <div className="text-sm font-semibold text-slate-900">{locale === "zh" ? "预览（只读）" : "Preview (read-only)"}</div>
	                <div className="flex flex-wrap items-center gap-2">
	                  {formattedPreviewUrl ? (
	                    <a
	                      href={resolveDocUrl(formattedPreviewUrl)}
	                      target="_blank"
	                      rel="noreferrer"
	                      download
	                      className="rounded-md bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800"
	                    >
	                      {locale === "zh" ? "下载格式化文档" : "Download formatted .docx"}
	                    </a>
	                  ) : null}
	                  <button
	                    type="button"
	                    className={`rounded-md border px-2 py-0.5 text-xs ${previewMode === "original" ? "border-cyan-500 bg-cyan-50" : "hover:bg-slate-50"}`}
	                    onClick={() => setPreviewMode("original")}
	                  >
                    {locale === "zh" ? "原始" : "Original"}
                  </button>
                  <button
                    type="button"
                    disabled={!formattedPreviewUrl}
                    className={`rounded-md border px-2 py-0.5 text-xs ${previewMode === "formatted" ? "border-cyan-500 bg-cyan-50" : "hover:bg-slate-50"} disabled:opacity-50`}
                    onClick={() => setPreviewMode("formatted")}
                  >
                    {locale === "zh" ? "格式化后" : "Formatted"}
                  </button>
                </div>
              </div>
              <div className="mt-1 text-xs text-slate-600">
                {locale === "zh"
                  ? "预览用于观察样式变化（字体/字号/行距/缩进/对齐/标题层级等），不提供编辑能力。"
                  : "Use preview to observe style changes. Editing is disabled."}
              </div>
	            </div>
	            <div className="p-4">
	              {previewError ? <div className="mb-3 text-sm text-rose-600">{previewError}</div> : null}
	              <div className="min-h-[72vh] max-h-[calc(100vh-220px)] overflow-auto rounded border bg-slate-50 p-3">
	                <div ref={previewRef} />
	              </div>
	            </div>
	          </div>
	        </section>
      ) : null}
    </div>
  );
}
