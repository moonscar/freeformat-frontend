export function slugifyHeadingId(text: string): string {
  const raw = String(text || "").trim();
  if (!raw) return "section";

  let s = raw.normalize("NFKC").toLowerCase();
  // Replace common separators with hyphens to avoid merging numbers like "4.1" -> "41".
  s = s.replace(/[\s./·•—–―，,、:：;；()（）【】[\]{}<>《》“”\"'`]+/g, "-");

  // Keep unicode letters/numbers; drop the rest.
  s = s.replace(/[^\p{L}\p{N}-]+/gu, "-");
  s = s.replace(/-+/g, "-").replace(/^-|-$/g, "");

  if (!s) {
    // FNV-1a 32-bit hash (stable, short)
    let h = 2166136261;
    for (const ch of raw) {
      h ^= ch.codePointAt(0) || 0;
      h = Math.imul(h, 16777619);
    }
    return `sec-${(h >>> 0).toString(36)}`;
  }

  // Avoid extremely long ids.
  const MAX = 80;
  if (s.length > MAX) s = s.slice(0, MAX).replace(/-+$/g, "");
  return s || "section";
}

