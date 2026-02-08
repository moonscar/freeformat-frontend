import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/siteConfig';

type GuideItem = {
  slug: string;
  locale: string;
  guide_type?: string | null;
  template_id?: string | null;
  status?: string | null;
  isIntentOnly?: boolean | null;
  updated_at?: string | null;
  updatedAt?: string | null;
  meta?: { guide_mode?: string | null } | null;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SITEMAP_EXCLUDE_BY_LOCALE: Record<string, Set<string>> = {
  en: new Set(["proquest", "ucl-edu", "apa-format"]),
  zh: new Set([]),
};

async function fetchGuides(locale: string): Promise<GuideItem[]> {
  const api = (process.env.NEXT_PUBLIC_API_BASE || process.env.API_PROXY_TARGET || `${siteConfig.url.replace(/\/$/, '')}/api`).replace(/\/$/, '');
  try {
    const res = await fetch(`${api}/guides?locale=${encodeURIComponent(locale)}&limit=500`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const items = (await res.json()) as GuideItem[];
    const exclude = SITEMAP_EXCLUDE_BY_LOCALE[locale] || new Set<string>();
    return items
      .filter((g) => !!g?.slug && !exclude.has(g.slug))
      .filter((g) => {
        const status = String(g.status || '').toLowerCase();
        // Keep sitemap lean: only include published/active items.
        if (status && status !== 'active') return false;
        const guideMode = String(g.meta?.guide_mode || '').toLowerCase();
        if (g.isIntentOnly || guideMode === 'intent_only') return false;
        // For non-topic guides, require template_id (otherwise treat as not-ready / thin).
        const t = String(g.guide_type || '').toLowerCase();
        if (t === 'topic') return true;
        return !!g.template_id;
      });
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const locales = ['zh', 'en'];

  const staticRoutes = ['', '/tool', '/guides', '/topics', '/feedback', '/privacy', '/about', '/devlog', '/support', '/landing'];

  const guideEntries: MetadataRoute.Sitemap = [];
  const topicEntries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    const items = await fetchGuides(locale);
    for (const g of items) {
      const t = String(g.guide_type || '').toLowerCase();
      if (t === 'topic') {
        const itemLastModified = g.updated_at || g.updatedAt;
        topicEntries.push({
          url: `${baseUrl}/${locale}/topics/${g.slug}`,
          changeFrequency: 'weekly' as const,
          priority: 0.85,
          lastModified: itemLastModified ? new Date(itemLastModified) : new Date(),
        });
      } else {
        const itemLastModified = g.updated_at || g.updatedAt;
        guideEntries.push({
          url: `${baseUrl}/${locale}/guides/${g.slug}`,
          changeFrequency: 'monthly' as const,
          priority: 0.45,
          lastModified: itemLastModified ? new Date(itemLastModified) : new Date(),
        });
      }
    }
  }

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((path) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      changeFrequency:
        path === '/topics'
          ? ('weekly' as const)
          : path === '/guides'
          ? ('monthly' as const)
          : ('weekly' as const),
      priority:
        path === ''
          ? 1
          : path === '/tool'
          ? 0.9
          : path === '/topics'
          ? 0.8
          : path === '/guides'
          ? 0.45
          : path === '/feedback'
          ? 0.4
          : path === '/landing'
          ? 0.3
          : 0.2,
      lastModified: new Date(),
    }))
  );

  const entries: MetadataRoute.Sitemap = [...staticEntries, ...guideEntries];
  return [...entries, ...topicEntries];
}
