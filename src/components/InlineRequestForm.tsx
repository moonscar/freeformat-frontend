"use client";
import { useMemo, useState } from 'react';
import { inlineForm, Locale } from '@/i18n';

type LocaleType = Locale;

type Props = {
  title: string;
  desc: string;
  submitText: string;
  successText: string;
  apiHint: string;
  locale: LocaleType;
  targetEmail: string;
};

export default function InlineRequestForm({ title, desc, submitText, successText, apiHint, locale, targetEmail }: Props) {
  const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '') || '/api';
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
  const copy = inlineForm[locale === 'en' ? 'en' : 'zh'];
  const fieldClass =
    "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition";
  const labelClass = "space-y-2 text-sm font-medium text-slate-700";

  const composedText = useMemo(() => {
    const docInfo = [pages, deadline].filter(Boolean).join(' / ');
    const lines = [
      org && `${copy.compose.org}${org}`,
      link && `${copy.compose.link}${link}`,
      docInfo && `${copy.compose.doc}${docInfo}`,
      special && `${copy.compose.special}${special}`,
      contact && `${copy.compose.contact}${contact}`,
      raw && `${copy.compose.rawPrefix}${raw}`,
    ].filter(Boolean);
    return lines.join("\n");
  }, [org, link, pages, deadline, special, contact, raw, locale]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
        text: composedText,
        name: org || copy.fallbackName,
        locale,
        metadata: {
          link, deadline, pages, special, contact,
        },
      };
      const res = await fetch(`${API_BASE}/guideline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Request failed');
      }
      const data = await res.json();
      setResult(data.submission_id || copy.defaultResult);
    } catch (err: any) {
      setError(err?.message || copy.mailError);
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
          <span>{copy.requirementLabel}</span>
          <textarea
            className={`${fieldClass} h-40 w-full`}
            placeholder={copy.requirementPlaceholder}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            required
          />
        </label>
        <label className={labelClass}>
          <span>{copy.contactLabel}</span>
          <input
            type="email"
            className={`${fieldClass} w-full`}
            placeholder={copy.contactPlaceholder}
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
            <span>{copy.extrasTitle}</span>
            <span>{showExtras ? "−" : "+"}</span>
          </button>
          {showExtras && (
            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <div className="grid gap-3 md:grid-cols-2">
                <input className={fieldClass} placeholder={copy.extrasFields.org} value={org} onChange={(e) => setOrg(e.target.value)} />
                <input className={fieldClass} placeholder={copy.extrasFields.link} value={link} onChange={(e) => setLink(e.target.value)} />
                <input className={fieldClass} placeholder={copy.extrasFields.pages} value={pages} onChange={(e) => setPages(e.target.value)} />
                <input className={fieldClass} placeholder={copy.extrasFields.deadline} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
              <textarea
                className={`${fieldClass} h-24 w-full`}
                placeholder={copy.specialPlaceholder}
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
            {loading ? copy.loadingText : submitText}
          </button>
          <span className="text-xs text-slate-500">{apiHint}</span>
        </div>
      </form>
      {result && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <span className="font-medium">{successText}</span>
          <span>
            {copy.successSeparator}
            {result}
          </span>
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <span className="font-medium">{copy.errorPrefix}</span>
          <span>
            {copy.successSeparator}
            {error}
          </span>
        </div>
      )}
    </div>
  );
}
