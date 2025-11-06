"use client";

import React from "react";
import Toc from "./Toc";

type Props = {
  md: string;
  title?: string;
  label?: string; // i18n label for toggle button, e.g. 目录 / Contents
};

export default function TocSidebar({ md, title, label }: Props) {
  const storageKey = "toc-collapsed";
  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  React.useEffect(() => {
    try {
      const v = localStorage.getItem(storageKey);
      if (v != null) setCollapsed(v === "1");
    } catch {}
  }, []);

  const toggle = React.useCallback(() => {
    setCollapsed((c) => {
      const n = !c;
      try {
        localStorage.setItem(storageKey, n ? "1" : "0");
      } catch {}
      return n;
    });
  }, []);

  return (
    <aside className="sticky top-24">
      <div className="rounded-lg border">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="truncate text-sm font-medium text-slate-900">{title || "TOC"}</div>
          <button
            type="button"
            aria-expanded={!collapsed}
            onClick={toggle}
            className="text-xs text-cyan-700 hover:text-cyan-900"
          >
            {collapsed ? (label ? `${label} ▼` : "Show ▼") : (label ? `${label} ▲` : "Hide ▲")}
          </button>
        </div>
        {!collapsed ? (
          <div className="max-h-[calc(100vh-8rem)] overflow-auto px-3 pb-3">
            <Toc md={md} />
          </div>
        ) : null}
      </div>
    </aside>
  );
}

