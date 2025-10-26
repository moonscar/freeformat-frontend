"use client";
import { useMemo, useState } from 'react';

type Props = {
  title: string;
  desc: string;
  submitText: string;
  successText: string;
  apiHint: string;
};

export default function InlineRequestForm({ title, desc, submitText, successText, apiHint }: Props) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  const [org, setOrg] = useState("");
  const [link, setLink] = useState("");
  const [deadline, setDeadline] = useState("");
  const [pages, setPages] = useState("");
  const [special, setSpecial] = useState("");
  const [contact, setContact] = useState("");
  const [raw, setRaw] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showExtras, setShowExtras] = useState(false);
  const fieldClass =
    "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition";
  const labelClass = "space-y-2 text-sm font-medium text-slate-700";

  const composedText = useMemo(() => {
    const lines = [
      `【学校/院系/期刊】${org}`,
      `【格式要求链接/附件】${link}`,
      `【文档类型/页数/DDL】${pages} / ${deadline}`,
      `【特殊要求】${special}`,
      `【联系方式】${contact}`,
      raw ? "【格式要求原文】\n" + raw : "",
    ].filter(Boolean);
    return lines.join("\n");
  }, [org, link, pages, deadline, special, contact, raw]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/guideline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: composedText, name: org || "用户上传格式要求" }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `请求失败：${res.status}`);
      }
      const data = await res.json();
      setResult(data.template_id || "已接收");
    } catch (err: any) {
      setError(err?.message || "提交失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/80 bg-white/90 p-6 shadow-2xl shadow-cyan-100 md:p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600">{desc}</p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className={labelClass}>
          <span>格式要求原文（必填）</span>
          <textarea
            className={`${fieldClass} h-40 w-full`}
            placeholder="直接粘贴格式要求，越详细越好"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            required
          />
        </label>
        <label className={labelClass}>
          <span>邮箱 / 联系方式（必填）</span>
          <input
            type="email"
            className={`${fieldClass} w-full`}
            placeholder="我们会把模板进度回信给你"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </label>

        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
          <button
            type="button"
            className="flex w-full items-center justify-between text-sm font-medium text-cyan-700"
            onClick={() => setShowExtras((prev) => !prev)}
          >
            <span>补充信息（选填）</span>
            <span>{showExtras ? "−" : "+"}</span>
          </button>
          {showExtras && (
            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <div className="grid gap-3 md:grid-cols-2">
                <input className={fieldClass} placeholder="学校 / 院系 / 期刊（选填）" value={org} onChange={(e) => setOrg(e.target.value)} />
                <input className={fieldClass} placeholder="格式要求链接（选填）" value={link} onChange={(e) => setLink(e.target.value)} />
                <input className={fieldClass} placeholder="文档类型或页数（选填）" value={pages} onChange={(e) => setPages(e.target.value)} />
                <input className={fieldClass} placeholder="截止日期（选填）" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
              <textarea
                className={`${fieldClass} h-24 w-full`}
                placeholder="特殊要求或备注（选填）"
                value={special}
                onChange={(e) => setSpecial(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-cyan-500/40 transition hover:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "提交中…" : submitText}
          </button>
          <span className="text-xs text-slate-500">{apiHint}</span>
        </div>
      </form>
      {result && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {successText}：{result}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          提交失败：{error}
        </div>
      )}
    </div>
  );
}
