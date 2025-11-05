"use client";

import React from "react";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function linkify(s: string) {
  return s.replace(
    /(https?:\/\/[\w\-._~:/?#\[\]@!$&'()*+,;=%]+)/g,
    (m) => `<a href="${m}" target="_blank" rel="noopener noreferrer" class="text-cyan-700 hover:text-cyan-900 underline">${m}</a>`
  );
}

function slugifyId(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Very small Markdown-to-HTML converter for our cleaned guideline text
function mdToHtml(md: string) {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      out.push("</ul>");
      listOpen = false;
    }
  };

  for (const raw of lines) {
    const ln = raw.trimEnd();
    if (!ln) {
      closeList();
      out.push("");
      continue;
    }
    const h = ln.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      closeList();
      const level = h[1].length;
      const rawText = h[2].trim();
      const id = slugifyId(rawText);
      const text = linkify(escapeHtml(rawText));
      const tag = `h${Math.min(level, 6)}`;
      out.push(`<${tag} id="${id}" class="mt-8 mb-3 scroll-mt-24 font-semibold text-slate-900 ${level<=2 ? 'text-2xl' : level===3 ? 'text-xl' : 'text-lg'}">${text}</${tag}>`);
      continue;
    }
    if (/^[-*]\s+/.test(ln)) {
      if (!listOpen) {
        out.push('<ul class="my-3 ml-6 list-disc space-y-1">');
        listOpen = true;
      }
      const item = linkify(escapeHtml(ln.replace(/^[-*]\s+/, "")));
      out.push(`<li>${item}</li>`);
      continue;
    }
    // Paragraph
    closeList();
    out.push(`<p class="my-3 leading-7 text-slate-800">${linkify(escapeHtml(ln))}</p>`);
  }
  closeList();
  return out.join("\n");
}

export default function Markdown({ md }: { md: string }) {
  const html = React.useMemo(() => mdToHtml(md), [md]);
  return <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}

