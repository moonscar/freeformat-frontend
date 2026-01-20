"use client";

import React from "react";

type Props = {
  locale: "en" | "zh";
  guideSlug?: string;
  initialTemplateId?: string;
  popularGuides?: Array<{ slug: string; label: string }>;
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

export default function ToolWorkArea({ locale, guideSlug, initialTemplateId, popularGuides }: Props) {
  const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || '/api').replace(/\/$/, '');
  const [templateId, setTemplateId] = React.useState<string>(initialTemplateId || "");
  const [currentGuideSlug, setCurrentGuideSlug] = React.useState<string>(guideSlug || "");
  const [currentGuideTitle, setCurrentGuideTitle] = React.useState<string>("");
  const [file, setFile] = React.useState<File | null>(null);
  const [lastUpload, setLastUpload] = React.useState<UploadResult | null>(null);
  const [lastUploadKey, setLastUploadKey] = React.useState<string>("");
  const [uploading, setUploading] = React.useState(false);
  const [formatting, setFormatting] = React.useState(false);
  const [jobId, setJobId] = React.useState<string>("");
  const [jobStatus, setJobStatus] = React.useState<JobStatus | null>(null);
  const [checking, setChecking] = React.useState(false);
  const [checkResult, setCheckResult] = React.useState<CheckResponse | null>(null);
  const [error, setError] = React.useState<string>("");
  const [previewError, setPreviewError] = React.useState<string>("");
  const previewRef = React.useRef<HTMLDivElement | null>(null);
  const previewedJobRef = React.useRef<string>("");
  const [showSearch, setShowSearch] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const t = (s: string) => {
    const zh: Record<string, string> = {
      selectTemplate: "模板",
      usingTemplate: "",
      change: "",
      noTemplate: "请先选择一个指南或模板后再开始格式化",
      uploadDoc: "上传 .docx",
      runCheck: "开始检查",
      start: "开始格式化",
      uploading: "正在上传…",
      formatting: "正在格式化…",
      checking: "正在检查…",
      job: "任务",
      error: "错误",
      result: "结果",
      downloadDoc: "下载格式化文档",
      downloadMap: "下载格式映射",
      youWillGet: "你将获得：评分（score）、问题列表（issues）与格式化后的 .docx。",
      sampleReport: "检查输出预览",
      score: "评分",
      confidence: "置信度",
      keyIssues: "关键问题",
      popularTemplates: "热门模板",
      searchMoreTemplates: "搜索更多模板",
      hideSearch: "收起搜索",
      chooseDoc: "选择 .docx 文件",
      replace: "替换",
      remove: "移除",
    };
    const en: Record<string, string> = {
      selectTemplate: "Template",
      usingTemplate: "",
      change: "",
      noTemplate: "Please select a guide/template before formatting.",
      uploadDoc: "Upload .docx",
      runCheck: "Run check",
      start: "Start Formatting",
      uploading: "Uploading…",
      formatting: "Formatting…",
      checking: "Checking…",
      job: "Job",
      error: "Error",
      result: "Result",
      downloadDoc: "Download formatted doc",
      downloadMap: "",
      youWillGet: "You’ll receive: a score, an issue list, and a formatted .docx.",
      sampleReport: "Sample check output",
      score: "Score",
      confidence: "Confidence",
      keyIssues: "Key issues",
      popularTemplates: "Popular templates",
      searchMoreTemplates: "Search more templates",
      hideSearch: "Hide search",
      chooseDoc: "Choose a .docx file",
      replace: "Replace",
      remove: "Remove",
    };
    return (locale === "zh" ? zh : en)[s] || s;
  };

  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [searching, setSearching] = React.useState(false);
  const [searchError, setSearchError] = React.useState<string>("");
  const [searchResults, setSearchResults] = React.useState<GuideSearchItem[]>([]);
  const [popularMetaBySlug, setPopularMetaBySlug] = React.useState<Record<string, GuideSearchItem>>({});
  const [lastRequestKey, setLastRequestKey] = React.useState<string>("");
  const [cooldownUntil, setCooldownUntil] = React.useState<number>(0);

  const isDev = process.env.NODE_ENV !== 'production';
  React.useEffect(() => {
    if (isDev) {
      // Initial debug snapshot
      // eslint-disable-next-line no-console
      console.debug('[tool] init', { API_BASE, locale, guideSlug, initialTemplateId, templateId });
    }
  }, []);

  React.useEffect(() => {
    async function fetchPopularMeta() {
      if (!popularGuides?.length) return;
      const next: Record<string, GuideSearchItem> = {};
      await Promise.all(
        popularGuides.slice(0, 12).map(async (g) => {
          try {
            const res = await fetch(`${API_BASE}/guides/${g.slug}?locale=${locale}`);
            if (!res.ok) return;
            const j = await res.json();
            let templateId = j.template_id || "";
            let templateTier = j.template_tier || null;
            let title = j.title || g.label;
            let status = j.status || "active";

            // Fallback: if guide detail omits template fields, use search endpoint to hydrate them.
            if (!templateId) {
              try {
                const params = new URLSearchParams();
                params.set("locale", locale);
                params.set("q", g.slug);
                params.set("limit", "20");
                const res2 = await fetch(`${API_BASE}/guides/search?${params.toString()}`);
                if (res2.ok) {
                  const js2 = (await res2.json()) as any[];
                  const exact = (js2 || []).find((it) => it?.slug === g.slug);
                  if (exact) {
                    templateId = exact.template_id || templateId;
                    templateTier = exact.template_tier || templateTier;
                    title = exact.title || title;
                    status = exact.status || status;
                  }
                }
              } catch {}
            }
            next[g.slug] = {
              slug: j.slug || g.slug,
              locale: j.locale || locale,
              title,
              templateId,
              templateTier,
              status,
            };
          } catch {}
        })
      );
      setPopularMetaBySlug(next);
    }
    void fetchPopularMeta();
  }, [popularGuides, API_BASE, locale]);

  // Default selection: preselect a recommended popular template to reduce friction.
  React.useEffect(() => {
    if (templateId) return;
    if (guideSlug) return; // from guide: respect incoming state
    if (!popularGuides?.length) return;

    const preferredSlug = locale === "zh" ? "ustc-edu" : "apa-org";
    const preferred = popularMetaBySlug[preferredSlug];
    if (preferred?.templateId) {
      handleSelectGuide(preferred);
      return;
    }
    const first = popularGuides.map((g) => popularMetaBySlug[g.slug]).find((x) => x?.templateId);
    if (first) handleSelectGuide(first);
  }, [templateId, guideSlug, locale, popularGuides, popularMetaBySlug]);

  React.useEffect(() => {
    // 若从指南页跳转且尚未有标题，尝试获取指南详情以展示名称
    async function fetchGuideTitle() {
      if (!guideSlug || currentGuideTitle) return;
      try {
        const res = await fetch(`${API_BASE}/guides/${guideSlug}?locale=${locale}`);
        if (!res.ok) return;
        const j = await res.json();
        if (j?.title) {
          setCurrentGuideTitle(j.title);
        }
      } catch (e) {
        if (isDev) console.debug('[tool] fetch guide title failed', e);
      }
    }
    void fetchGuideTitle();
  }, [guideSlug, locale, API_BASE, currentGuideTitle, isDev]);

  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setHasSearched(true);
    setSearching(true);
    setSearchError("");
    try {
      const params = new URLSearchParams();
      if (locale) params.set("locale", locale);
      const q = searchQuery.trim();
      if (q) params.set("q", q);
      params.set("limit", "20");
      const url = `${API_BASE}/guides/search?${params.toString()}`;
      if (isDev) console.debug('[tool] search -> GET', url);
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
      if (isDev) console.debug('[tool] search <- OK', items);
    } catch (e: any) {
      const msg = String(e?.message || e);
      setSearchError(msg);
      if (isDev) console.debug('[tool] search error', e);
    } finally {
      setSearching(false);
    }
  }

  async function selectPopularSlug(slug: string) {
    const p = popularMetaBySlug[slug];
    if (p?.templateId) {
      handleSelectGuide(p);
      return;
    }
    const hit = searchResults.find((x) => x.slug === slug);
    if (hit) {
      handleSelectGuide(hit);
      return;
    }
    // Fallback: run a quick search by slug; if found, select it.
    try {
      const params = new URLSearchParams();
      params.set("locale", locale);
      params.set("q", slug);
      params.set("limit", "20");
      const url = `${API_BASE}/guides/search?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) return;
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
      const exact = items.find((x) => x.slug === slug);
      if (exact) handleSelectGuide(exact);
    } catch {}
  }

  function handleSelectGuide(item: GuideSearchItem) {
    setTemplateId(item.templateId);
    setCurrentGuideSlug(item.slug);
    setCurrentGuideTitle(item.title || "");
    setError("");
    if (isDev) console.debug('[tool] select guide', item);
  }

  function formatTierText(tier?: string | null) {
    const t2 = (tier || "").toLowerCase();
    if (!t2) return null;
    const zhMap: Record<string, string> = { gold: "金", silver: "银", bronze: "铜" };
    const enMap: Record<string, string> = { gold: "Gold", silver: "Silver", bronze: "Bronze" };
    return locale === "zh" ? zhMap[t2] || tier : enMap[t2] || tier;
  }

  function formatTierBadge(tier?: string | null) {
    const t2 = (tier || "").toLowerCase();
    const label = formatTierText(tier);
    if (!label) return null;

    const cls =
      t2 === "gold"
        ? "bg-amber-500/10 text-amber-800 border border-amber-300"
        : t2 === "silver"
        ? "bg-slate-500/10 text-slate-800 border border-slate-300"
        : t2 === "bronze"
        ? "bg-orange-500/10 text-orange-800 border border-orange-300"
        : "bg-slate-500/10 text-slate-800 border border-slate-300";
    const icon = t2 === "gold" ? "★" : t2 === "silver" ? "◇" : "•";

    return (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}>
        {icon} {label}
      </span>
    );
  }

  function fileKey(f: File) {
    return `${f.name}::${f.size}::${f.lastModified}`;
  }

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
      setLastUpload(json);
      setLastUploadKey(fileKey(file));
      try {
        const ctx = {
          locale,
          template_id: templateId,
          guide_slug: currentGuideSlug || guideSlug || "",
          file_id: json.file_id,
          filename: json.filename,
          file_url: json.url,
          created_at: new Date().toISOString(),
        };
        sessionStorage.setItem("ff_studio_ctx_v1", JSON.stringify(ctx));
      } catch {}
      return json;
    } finally {
      setUploading(false);
    }
  }

  async function ensureUpload(): Promise<UploadResult> {
    if (lastUpload && file && lastUploadKey && lastUploadKey === fileKey(file)) {
      return lastUpload;
    }
    return await handleUpload();
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
      if (js.status === "succeeded" && js.result) {
        try {
          const raw = sessionStorage.getItem("ff_studio_ctx_v1");
          const prev = raw ? JSON.parse(raw) : {};
          const next = {
            ...prev,
            locale,
            template_id: templateId,
            guide_slug: currentGuideSlug || guideSlug || prev?.guide_slug || "",
            formatted_doc_url: js.result.formatted_doc_url,
            format_map_url: js.result.format_map_url,
            updated_at: new Date().toISOString(),
          };
          sessionStorage.setItem("ff_studio_ctx_v1", JSON.stringify(next));
        } catch {}
      }
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
    setCheckResult(null);
    if (!templateId) {
      setError(t("noTemplate"));
      return;
    }
    if (!file) {
      setError(locale === "zh" ? "请先选择 .docx 文件" : "Please choose a .docx file first");
      return;
    }
    const now = Date.now();
    const reqKey = `${file.name}|${file.size}|${templateId}`;
    if (lastRequestKey === reqKey && cooldownUntil > now) {
      setError(locale === "zh" ? "请勿短时间内重复提交同一文件" : "Please avoid resubmitting the same file too quickly.");
      return;
    }
    setLastRequestKey(reqKey);
    const nextCooldown = now + 3000;
    setCooldownUntil(nextCooldown);
    setTimeout(() => setCooldownUntil(0), 3000);
    try {
      if (isDev) console.debug('[tool] start formatting', { templateId, guideSlug });
      const up = await ensureUpload();
      setFormatting(true);
      const body = { file_id: up.file_id, template_id: templateId } as any;
      const effectiveSlug = currentGuideSlug || guideSlug || "";
      if (effectiveSlug) body.guide_slug = effectiveSlug;
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

  async function handleRunCheck() {
    setError("");
    setCheckResult(null);
    if (!templateId) {
      setError(t("noTemplate"));
      return;
    }
    if (!file) {
      setError(locale === "zh" ? "请先选择 .docx 文件" : "Please choose a .docx file first");
      return;
    }
    const now = Date.now();
    const reqKey = `${file.name}|${file.size}|${templateId}|check`;
    if (lastRequestKey === reqKey && cooldownUntil > now) {
      setError(locale === "zh" ? "请勿短时间内重复提交同一文件" : "Please avoid resubmitting the same file too quickly.");
      return;
    }
    setLastRequestKey(reqKey);
    const nextCooldown = now + 3000;
    setCooldownUntil(nextCooldown);
    setTimeout(() => setCooldownUntil(0), 3000);
    try {
      const up = await ensureUpload();
      setChecking(true);
      const body: any = {
        file_id: up.file_id,
        template_id: templateId,
        force_regen_docjson: false,
      };
      const effectiveSlug = currentGuideSlug || guideSlug || "";
      if (effectiveSlug) body.guide_slug = effectiveSlug;
      if (isDev) console.debug('[tool] check -> POST', `${API_BASE}/check`, body);
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
      if (isDev) console.debug('[tool] check <- OK', data);
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setChecking(false);
    }
  }

  const checkSummary = checkResult?.report?.summary;
  const checkItems = Array.isArray(checkResult?.report?.items) ? (checkResult?.report?.items as CheckItem[]) : [];
  const actionable = checkItems.filter((it) => it.status === "fail" || it.status === "warn");
  const topIssues = actionable.slice(0, 8);
  const popularLoading = !!popularGuides?.length && !templateId && Object.keys(popularMetaBySlug).length === 0;

  return (
    <div className="space-y-6">
      {/* Main interaction: upload + check/format (check is primary) */}
      <section className="rounded-lg border p-4">
        <div className="text-sm font-medium text-slate-900">
          {locale === "zh" ? "上传 → 检查 → 格式化" : "Upload → Check → Format"}
        </div>
        <div className="mt-1 text-xs text-slate-700">{t("youWillGet")}</div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setFile(f);
              // If user picks a new file, reuse of previous upload is no longer valid.
              setLastUpload(null);
              setLastUploadKey("");
              setJobId("");
              setJobStatus(null);
              setCheckResult(null);
              setPreviewError("");
              setError("");
            }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            {file ? t("replace") : t("chooseDoc")}
          </button>
          {file ? (
            <>
              <span className="text-xs text-slate-600">{file.name}</span>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setLastUpload(null);
                  setLastUploadKey("");
                  setJobId("");
                  setJobStatus(null);
                  setCheckResult(null);
                  setPreviewError("");
                  setError("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {t("remove")}
              </button>
            </>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleRunCheck}
            disabled={!templateId || uploading || checking || searching || (cooldownUntil > Date.now())}
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white ${uploading || checking ? 'bg-slate-400' : 'bg-cyan-700 hover:bg-cyan-800'}`}
          >
            {uploading ? t("uploading") : searching && !templateId ? (locale === "zh" ? "加载模板中…" : "Loading templates…") : checking ? t("checking") : t("runCheck")}
          </button>
          <button
            type="button"
            onClick={handleStart}
            disabled={!templateId || uploading || formatting || searching || (cooldownUntil > Date.now())}
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white ${uploading || formatting ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800'}`}
          >
            {uploading ? t("uploading") : searching && !templateId ? (locale === "zh" ? "加载模板中…" : "Loading templates…") : formatting ? t("formatting") : t("start")}
          </button>
          {jobId ? <span className="text-xs text-slate-600">{t("job")}: {jobId}</span> : null}
        </div>

        {/* Show result right under the action buttons (primary visibility) */}
        {error ? (
          <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {t("error")}: {error}
          </div>
        ) : null}
        {jobStatus ? (
          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <div className="font-medium text-slate-900">{t("result")}</div>
            <div className="mt-1 text-slate-700">status: {jobStatus.status}</div>
            {jobStatus.result ? (
              <div className="mt-2 flex flex-wrap items-center gap-4">
                {jobStatus.result.formatted_doc_url ? (
                  <a
                    className="text-cyan-700 underline"
                    href={resolveDocUrl(jobStatus.result.formatted_doc_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("downloadDoc")}
                  </a>
                ) : null}
              </div>
            ) : null}
            {jobStatus.error ? <div className="mt-1 text-rose-600">{jobStatus.error}</div> : null}

            {jobStatus?.status === "succeeded" && jobStatus.result?.formatted_doc_url && lastUpload?.file_id ? (
              <div className="mt-3">
                <a
                  className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  href={`/${locale}/studio?from=tool&slug=${encodeURIComponent(currentGuideSlug || guideSlug || "")}&template_id=${encodeURIComponent(templateId)}&file_id=${encodeURIComponent(lastUpload.file_id)}&filename=${encodeURIComponent(lastUpload.filename || "")}&file_url=${encodeURIComponent(lastUpload.url || "")}&formatted_doc_url=${encodeURIComponent(jobStatus.result.formatted_doc_url || "")}&docjson_url=${encodeURIComponent(jobStatus.result.format_map_url || "")}`}
                >
                  {locale === "zh" ? "在工作台继续微调（Studio）" : "Open in Studio to fine-tune"}
                </a>
                <div className="mt-1 text-xs text-slate-600">
                  {locale === "zh" ? "会带上当前模板与上传文件上下文。" : "Keeps the same template and upload context."}
                </div>
              </div>
            ) : null}

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
      </section>

      {/* Check output (evidence) */}
      <section className="rounded-lg border p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-medium text-slate-900">
            {locale === "zh" ? "检查输出（评分 + 问题列表）" : "Check output (score + issues)"}
          </div>
          <span className="text-xs text-slate-500">{t("sampleReport")}</span>
        </div>
        {checkSummary ? (
          <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("score")}</div>
                <div className="text-3xl font-semibold text-slate-900">{Math.round(checkSummary.score)}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("confidence")}</div>
                <div className="text-lg font-semibold text-slate-900">{Math.round(checkSummary.confidence * 100)}%</div>
              </div>
            </div>
            {topIssues.length ? (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-900">{t("keyIssues")}</div>
                <ul className="mt-2 space-y-2">
                  {topIssues.map((it) => (
                    <li key={it.code} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium text-slate-900">{it.title}</div>
                          {it.recommendation ? (
                            <div className="mt-1 text-xs text-slate-600">{it.recommendation}</div>
                          ) : null}
                        </div>
                        <span
                          className={
                            it.status === "fail"
                              ? "shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700"
                              : "shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800"
                          }
                        >
                          {it.status === "fail" ? (locale === "zh" ? "失败" : "Fail") : (locale === "zh" ? "警告" : "Warn")}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-4 text-sm text-slate-700">{locale === "zh" ? "暂无可操作问题。" : "No actionable issues."}</div>
            )}
          </div>
        ) : (
          <div className="mt-3 text-sm text-slate-700">
            {locale === "zh"
              ? "点击上方“开始检查”后，会生成评分（score）与问题列表（issues），用于你判断本次格式化会带来哪些改变。"
              : "Click “Run check” above to generate a score and an issue list so you know what will change before formatting."}
          </div>
        )}
      </section>

      {/* Template / guide selection */}
      <section className="rounded-lg border p-4">
        <div className="text-sm font-medium text-slate-900">{t("selectTemplate")}</div>
        <div className="mt-1 text-xs text-slate-700">
          {templateId ? (
            <>
              {locale === 'zh' ? '当前模板（可切换）：' : 'Current template (switchable):'}{' '}
              <span className="font-mono">
                {currentGuideTitle || currentGuideSlug || guideSlug || (locale === 'zh' ? '（未命名指南）' : '(unnamed guide)')}
              </span>
            </>
          ) : popularLoading ? (
            <span className="text-slate-600">
              {locale === "zh" ? "正在加载推荐模板…" : "Loading recommended templates…"}
            </span>
          ) : (
            <span className="text-rose-600">{t("noTemplate")}</span>
          )}
        </div>
        {popularGuides?.length ? (
          <div className="mt-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t("popularTemplates")}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {popularGuides.slice(0, 10).map((g) => {
                const meta = popularMetaBySlug[g.slug] || searchResults.find((x) => x.slug === g.slug);
                const selected = g.slug === (currentGuideSlug || guideSlug);
                return (
                  <button
                    key={g.slug}
                    type="button"
                    onClick={() => selectPopularSlug(g.slug)}
                    className={`inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50 ${
                      selected ? "border-cyan-500 bg-cyan-50" : ""
                    }`}
                  >
                    <span className="max-w-[210px] truncate">{g.label}</span>
                    {formatTierBadge(meta?.templateTier)}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSearch((v) => !v)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            {showSearch ? t("hideSearch") : t("searchMoreTemplates")}
          </button>
          {searching ? <span className="text-xs text-slate-600">{locale === "zh" ? "搜索中…" : "Searching…"}</span> : null}
        </div>

        {showSearch ? (
          <>
            <form onSubmit={handleSearch} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === 'zh' ? '搜索指南或学校名称，例如：APA，USTC' : 'Search guide or institution, e.g. APA, USTC'}
                className="flex-1 rounded-md border px-2 py-1 text-sm"
              />
              <button
                type="submit"
                disabled={searching}
                className={`rounded-md px-3 py-1 text-sm text-white ${searching ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800'}`}
              >
                {searching ? (locale === 'zh' ? '搜索中…' : 'Searching…') : (locale === 'zh' ? '搜索' : 'Search')}
              </button>
            </form>
            {searchError ? (
              <div className="mt-1 text-xs text-rose-600">{searchError}</div>
            ) : null}
            {hasSearched && searchResults.length > 0 ? (
              <div className="mt-3 max-h-48 space-y-1 overflow-auto text-sm">
                {searchResults.map((item) => {
                  const selected = item.slug === (currentGuideSlug || guideSlug);
                  return (
                    <button
                      key={`${item.slug}-${item.locale}`}
                      type="button"
                      onClick={() => handleSelectGuide(item)}
                      className={`flex w-full items-center justify-between rounded border px-2 py-1 text-left ${
                        selected ? 'border-cyan-500 bg-cyan-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex flex-col items-start gap-1">
                        <span className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{item.title || item.slug}</span>
                          {formatTierBadge(item.templateTier || "bronze")}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500">{item.slug}</span>
                      </span>
                      {selected ? (
                        <span className="text-xs text-cyan-700">{locale === 'zh' ? '已选择' : 'Selected'}</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </>
        ) : null}
      </section>
    </div>
  );
}
