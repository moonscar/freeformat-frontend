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
  // External URLs (open in new tab)
  let s = escaped.replace(
    /(https?:\/\/[\w\-._~:/?#\[\]@!$&'()*+,;=%]+)/g,
    (m) =>
      `<a href="${m}" target="_blank" rel="noopener noreferrer" class="text-cyan-700 hover:text-cyan-900 underline">${m}</a>`
  );

  // Internal absolute paths (clickable, same tab)
  s = s.replace(
    /(\/(?:en|zh)\/[A-Za-z0-9\-._~\/?#=&%]+)/g,
    (m) => `<a href="${m}" class="text-cyan-700 hover:text-cyan-900 underline">${m}</a>`
  );

  return s;
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

  const isTableSeparatorRow = (s: string) => {
    // e.g. | --- | ---: | :--- |
    const trimmed = s.trim();
    if (!trimmed.includes("|")) return false;
    const parts = trimmed
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((p) => p.trim());
    if (!parts.length) return false;
    return parts.every((p) => /^:?-{3,}:?$/.test(p));
  };

  const splitTableRow = (s: string) => {
    return s
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((p) => p.trim());
  };

  const renderTable = (header: string[], body: string[][]) => {
    const ths = header
      .map(
        (cell) =>
          `<th class="border border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold">${inlineMdToHtml(cell)}</th>`
      )
      .join("");
    const trs = body
      .map((row) => {
        const tds = row
          .map((cell) => `<td class="border border-slate-200 px-3 py-2 align-top">${inlineMdToHtml(cell)}</td>`)
          .join("");
        return `<tr>${tds}</tr>`;
      })
      .join("");
    return `<div class="my-4 overflow-x-auto"><table class="w-full border-collapse text-sm"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
  };

  const renderTaskItem = (checked: boolean, text: string) => {
    const box = `<input type="checkbox" ${checked ? "checked" : ""} disabled class="mt-1 h-4 w-4 rounded border-slate-300" />`;
    return `<div class="flex items-start gap-2">${box}<span class="flex-1">${inlineMdToHtml(text)}</span></div>`;
  };

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
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

    // GFM tables (minimal): header row + separator row + body rows
    if (s.includes("|") && i + 1 < lines.length && isTableSeparatorRow(lines[i + 1])) {
      closeList();
      const header = splitTableRow(s);
      const body: string[][] = [];
      i += 1; // skip separator
      for (let j = i + 1; j < lines.length; j += 1) {
        const rowLn = lines[j].trimEnd();
        if (!rowLn.trim()) {
          i = j - 1;
          break;
        }
        const rowTrim = rowLn.trimStart();
        if (!rowTrim.includes("|")) {
          i = j - 1;
          break;
        }
        body.push(splitTableRow(rowTrim));
        i = j;
      }
      out.push(renderTable(header, body));
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
      const content = s.replace(/^[-*]\s+/, "");
      const task = content.match(/^\[( |x|X)\]\s+(.*)$/);
      if (task) {
        out.push(`<li>${renderTaskItem(task[1].toLowerCase() === "x", task[2])}</li>`);
      } else {
        out.push(`<li>${inlineMdToHtml(content)}</li>`);
      }
      continue;
    }
    if (/^\d+[.)]\s+/.test(s)) {
      if (listTag !== "ol") {
        closeList();
        out.push('<ol class="my-3 ml-6 list-decimal space-y-1">');
        listTag = "ol";
      }
      const content = s.replace(/^\d+[.)]\s+/, "");
      const task = content.match(/^\[( |x|X)\]\s+(.*)$/);
      if (task) {
        out.push(`<li>${renderTaskItem(task[1].toLowerCase() === "x", task[2])}</li>`);
      } else {
        out.push(`<li>${inlineMdToHtml(content)}</li>`);
      }
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
