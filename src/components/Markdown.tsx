"use client";

import React from "react";
import { slugifyHeadingId } from "@/lib/headingIds";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function linkifyPlainUrls(escaped: string) {
  return escaped.replace(
    /(https?:\/\/[\w\-._~:/?#\[\]@!$&'()*+,;=%]+)/g,
    (m) =>
      `<a href="${m}" target="_blank" rel="noopener noreferrer" class="text-cyan-700 hover:text-cyan-900 underline">${m}</a>`
  );
}

function inlineMdToHtml(rawText: string) {
  const linkTokens: string[] = [];
  const tokenized = rawText.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) => {
    const idx = linkTokens.length;
    const safeLabel = escapeHtml(String(label));
    const safeUrl = escapeHtml(String(url));
    linkTokens.push(
      `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="text-cyan-700 hover:text-cyan-900 underline">${safeLabel}</a>`
    );
    return `@@LINK${idx}@@`;
  });

  let s = escapeHtml(tokenized);

  s = s.replace(/`([^`]+)`/g, (_m, code) => `<code class="rounded bg-slate-100 px-1 py-0.5 text-[0.95em]">${code}</code>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, (_m, inner) => `<strong>${inner}</strong>`);
  s = s.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, (_m, lead, inner) => `${lead}<em>${inner}</em>`);

  s = linkifyPlainUrls(s);

  for (let i = 0; i < linkTokens.length; i += 1) {
    s = s.replaceAll(`@@LINK${i}@@`, linkTokens[i]);
  }

  return s;
}

// Very small Markdown-to-HTML converter for our cleaned guideline text
function mdToHtml(md: string) {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];
  let listTag: "ul" | "ol" | null = null;

  const closeList = () => {
    if (listTag) {
      out.push(`</${listTag}>`);
      listTag = null;
    }
  };

  for (const raw of lines) {
    const ln = raw.trimEnd();
    const s = ln.trimStart();
    if (!ln) {
      closeList();
      out.push("");
      continue;
    }
    const h = s.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      closeList();
      const level = h[1].length;
      const rawText = h[2].trim();
      const id = slugifyHeadingId(rawText);
      const text = inlineMdToHtml(rawText);
      const tag = `h${Math.min(level, 6)}`;
      out.push(`<${tag} id="${id}" class="mt-8 mb-3 scroll-mt-24 font-semibold text-slate-900 ${level<=2 ? 'text-2xl' : level===3 ? 'text-xl' : 'text-lg'}">${text}</${tag}>`);
      continue;
    }
    if (/^>\s+/.test(s)) {
      closeList();
      out.push(`<blockquote class="my-3 border-l-4 border-slate-200 pl-4 text-slate-700">${inlineMdToHtml(s.replace(/^>\s+/, ""))}</blockquote>`);
      continue;
    }
    if (/^[-*]\s+/.test(s)) {
      if (listTag !== "ul") {
        closeList();
        out.push('<ul class="my-3 ml-6 list-disc space-y-1">');
        listTag = "ul";
      }
      out.push(`<li>${inlineMdToHtml(s.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }
    if (/^\d+[.)]\s+/.test(s)) {
      if (listTag !== "ol") {
        closeList();
        out.push('<ol class="my-3 ml-6 list-decimal space-y-1">');
        listTag = "ol";
      }
      out.push(`<li>${inlineMdToHtml(s.replace(/^\d+[.)]\s+/, ""))}</li>`);
      continue;
    }
    // Paragraph
    closeList();
    out.push(`<p class="my-3 leading-7 text-slate-800">${inlineMdToHtml(s)}</p>`);
  }
  closeList();
  return out.join("\n");
}

export default function Markdown({ md }: { md: string }) {
  const html = React.useMemo(() => mdToHtml(md), [md]);
  return <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}
