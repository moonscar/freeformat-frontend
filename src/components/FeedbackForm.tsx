"use client";

import React, { useState, useMemo } from "react";
import { Locale } from "@/i18n";

type Props = {
  locale: Locale;
};

type FeedbackType = "format_issue" | "new_guide" | "feature" | "bug" | "other";

export default function FeedbackForm({ locale }: Props) {
  const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "") || "/api";
  const isZh = locale === "zh";

  const [feedbackType, setFeedbackType] = useState<FeedbackType>("format_issue");
  const [role, setRole] = useState<string>("");
  const [docType, setDocType] = useState<string>("");
  const [guideSlugOrUrl, setGuideSlugOrUrl] = useState<string>("");
  const [institution, setInstitution] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [details, setDetails] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fieldClass =
    "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition";
  const labelClass = "space-y-2 text-sm font-medium text-slate-700";

  const helperText = useMemo(() => {
    if (feedbackType === "format_issue") {
      return isZh
        ? "请尽量说明：使用了哪一份指南/模板（如 ustc-edu、APA），以及哪些地方与官方格式要求不一致（例如：章节标题字号、行距、参考文献样式等）。"
        : "Please describe which guide/template you used (e.g., ustc-edu, APA) and where the formatted result differs from the official requirements (e.g., heading font size, line spacing, reference style).";
    }
    if (feedbackType === "new_guide") {
      return isZh
        ? "请写明学校/院系/期刊名称，并附上格式要求的链接或关键原文（可以直接粘贴官方说明中的格式部分）。"
        : "Please include the school/department/journal name and paste the link or key paragraphs of the official formatting guideline.";
    }
    if (feedbackType === "bug") {
      return isZh
        ? "请描述你当时的操作步骤、看到的错误提示或异常行为，方便我们复现问题。"
        : "Please describe the steps you took and any error messages or unexpected behavior you saw, so we can reproduce the issue.";
    }
    if (feedbackType === "feature") {
      return isZh
        ? "欢迎描述你希望 FreeFormat 支持的功能或工作流场景。"
        : "Describe the feature or workflow you’d like FreeFormat to support.";
    }
    return isZh
      ? "你可以在这里写下任何其他想法、建议或问题。"
      : "You can write any other thoughts, suggestions, or questions here.";
  }, [feedbackType, isZh]);

  const composedText = useMemo(() => {
    const lines: string[] = [];
    lines.push(
      isZh ? `【反馈类型】${feedbackType}` : `Feedback type: ${feedbackType}`,
    );
    if (role) {
      lines.push(isZh ? `【角色】${role}` : `Role: ${role}`);
    }
    if (docType) {
      lines.push(isZh ? `【文档类型】${docType}` : `Document type: ${docType}`);
    }
    if (institution) {
      lines.push(isZh ? `【学校/机构】${institution}` : `Institution: ${institution}`);
    }
    if (guideSlugOrUrl) {
      lines.push(
        isZh
          ? `【相关指南/链接】${guideSlugOrUrl}`
          : `Related guide / URL: ${guideSlugOrUrl}`,
      );
    }
    if (contact) {
      lines.push(isZh ? `【联系方式】${contact}` : `Contact: ${contact}`);
    }
    if (title) {
      lines.push(isZh ? `【标题】${title}` : `Title: ${title}`);
    }
    if (details) {
      lines.push(isZh ? "【详细说明】" : "Details:");
      lines.push(details);
    }
    return lines.join("\n");
  }, [feedbackType, role, docType, institution, guideSlugOrUrl, contact, title, details, isZh]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      if (!details.trim()) {
        throw new Error(isZh ? "请先填写详细说明。" : "Please fill in the details first.");
      }
      const payload = {
        text: composedText,
        name: institution || title || (isZh ? "匿名反馈" : "Anonymous feedback"),
        locale,
        metadata: {
          feedback_type: feedbackType,
          role,
          doc_type: docType,
          guide_slug_or_url: guideSlugOrUrl,
          institution,
          contact,
          title,
        },
      };
      const res = await fetch(`${API_BASE}/guideline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = await res.text();
        if (!msg) msg = isZh ? "提交失败，请稍后重试。" : "Request failed, please try again.";
        throw new Error(msg);
      }
      const data = (await res.json()) as any;
      const sid = data?.submission_id || "";
      setResult(
        isZh
          ? sid
            ? `已收到反馈，编号：${sid}`
            : "已收到你的反馈，感谢。"
          : sid
          ? `Feedback received, id: ${sid}`
          : "Thanks, your feedback has been received.",
      );
    } catch (err: any) {
      setError(String(err?.message || (isZh ? "提交失败，请稍后重试。" : "Submit failed, please try again.")));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/80 bg-white/90 p-6 shadow-2xl shadow-cyan-100 md:p-8">
      <form className="space-y-5" onSubmit={onSubmit}>
        {/* Feedback type */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-slate-700">
            {isZh ? "反馈类型" : "Feedback type"}
          </legend>
          <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                className="h-3 w-3"
                value="format_issue"
                checked={feedbackType === "format_issue"}
                onChange={() => setFeedbackType("format_issue")}
              />
              <span>{isZh ? "格式化结果有问题" : "Formatting result issue"}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                className="h-3 w-3"
                value="new_guide"
                checked={feedbackType === "new_guide"}
                onChange={() => setFeedbackType("new_guide")}
              />
              <span>{isZh ? "希望支持新的学校/期刊格式" : "Request a new guide/template"}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                className="h-3 w-3"
                value="feature"
                checked={feedbackType === "feature"}
                onChange={() => setFeedbackType("feature")}
              />
              <span>{isZh ? "功能建议" : "Feature suggestion"}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                className="h-3 w-3"
                value="bug"
                checked={feedbackType === "bug"}
                onChange={() => setFeedbackType("bug")}
              />
              <span>{isZh ? "Bug / 报错" : "Bug / error report"}</span>
            </label>
            <label className="flex items-center gap-2 md:col-span-2">
              <input
                type="radio"
                className="h-3 w-3"
                value="other"
                checked={feedbackType === "other"}
                onChange={() => setFeedbackType("other")}
              />
              <span>{isZh ? "其他反馈" : "Other feedback"}</span>
            </label>
          </div>
        </fieldset>

        {/* Basic info */}
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            <span>{isZh ? "角色（可选）" : "Your role (optional)"}</span>
            <select
              className={fieldClass}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">{isZh ? "请选择…" : "Select…"}</option>
              <option value={isZh ? "本科生" : "undergraduate"}>
                {isZh ? "本科生" : "Undergraduate"}
              </option>
              <option value={isZh ? "研究生" : "graduate"}>
                {isZh ? "研究生" : "Graduate student"}
              </option>
              <option value={isZh ? "导师/教师" : "advisor/teacher"}>
                {isZh ? "导师 / 教师" : "Advisor / teacher"}
              </option>
              <option value={isZh ? "编辑/出版" : "editor/publisher"}>
                {isZh ? "编辑 / 出版" : "Editor / publisher"}
              </option>
              <option value={isZh ? "其他" : "other"}>
                {isZh ? "其他" : "Other"}
              </option>
            </select>
          </label>
          <label className={labelClass}>
            <span>{isZh ? "文档类型（可选）" : "Document type (optional)"}</span>
            <select
              className={fieldClass}
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option value="">{isZh ? "请选择…" : "Select…"}</option>
              <option value={isZh ? "本科毕业论文" : "undergrad_thesis"}>
                {isZh ? "本科毕业论文" : "Undergraduate thesis"}
              </option>
              <option value={isZh ? "硕博学位论文" : "grad_thesis"}>
                {isZh ? "硕博学位论文" : "Master/PhD thesis"}
              </option>
              <option value={isZh ? "课程论文/报告" : "course_paper"}>
                {isZh ? "课程论文 / 报告" : "Course paper / report"}
              </option>
              <option value={isZh ? "期刊/会议投稿" : "journal_conference"}>
                {isZh ? "期刊 / 会议投稿" : "Journal / conference submission"}
              </option>
              <option value={isZh ? "其他" : "other"}>
                {isZh ? "其他" : "Other"}
              </option>
            </select>
          </label>
        </div>

        {/* Related guide / institution */}
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            <span>{isZh ? "学校 / 机构名称（可选）" : "Institution / journal (optional)"}</span>
            <input
              className={fieldClass}
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder={isZh ? "例如：中国科学技术大学、某某学院" : "e.g., USTC, Department/Journal name"}
            />
          </label>
          <label className={labelClass}>
            <span>{isZh ? "相关指南 slug 或链接（可选）" : "Related guide slug or URL (optional)"}</span>
            <input
              className={fieldClass}
              value={guideSlugOrUrl}
              onChange={(e) => setGuideSlugOrUrl(e.target.value)}
              placeholder={isZh ? "例如：ustc-edu 或完整链接" : "e.g., ustc-edu or full URL"}
            />
          </label>
        </div>

        {/* Contact */}
        <label className={labelClass}>
          <span>{isZh ? "联系方式（可选）" : "Contact info (optional)"}</span>
          <input
            className={fieldClass}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={isZh ? "邮箱 / 微信 / 其他" : "Email / handle (optional)"}
          />
        </label>

        {/* Title + Details */}
        <label className={labelClass}>
          <span>{isZh ? "问题或需求标题（可选）" : "Short title (optional)"}</span>
          <input
            className={fieldClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              isZh ? "例如：章节标题字号偏大 / 希望支持某某期刊格式" : "e.g., Heading font too large / Need support for XYZ journal"
            }
          />
        </label>

        <label className={labelClass}>
          <span>{isZh ? "详细说明" : "Details"}</span>
          <textarea
            className={`${fieldClass} h-40 w-full`}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder={helperText}
            required
          />
          <p className="text-xs text-slate-500">{helperText}</p>
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-cyan-500/40 transition hover:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading
              ? isZh
                ? "提交中…"
                : "Submitting…"
              : isZh
              ? "提交反馈"
              : "Submit feedback"}
          </button>
          <span className="text-xs text-slate-500">
            {isZh
              ? "优先处理：格式化结果问题与已有模板的质量问题。"
              : "We prioritise formatting issues and template quality problems."}
          </span>
        </div>
      </form>

      {result && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {result}
        </div>
      )}
      {error && (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}
    </div>
  );
}

