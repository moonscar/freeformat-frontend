import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/siteConfig';

type GuideItem = { slug: string; locale: string };

async function fetchGuides(locale: string): Promise<GuideItem[]> {
  const api = (process.env.NEXT_PUBLIC_API_BASE || process.env.API_PROXY_TARGET || `${siteConfig.url.replace(/\/$/, '')}/api`).replace(/\/$/, '');
  try {
    const res = await fetch(`${api}/guides?locale=${encodeURIComponent(locale)}`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return (await res.json()) as GuideItem[];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const locales = ['zh', 'en'];

  const staticRoutes = ['', '/tool'];

  const guideEntries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    const items = await fetchGuides(locale);
    for (const g of items) {
      guideEntries.push({
        url: `${baseUrl}/${locale}/guides/${g.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        lastModified: new Date(),
      });
    }
  }

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((path) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
      lastModified: new Date(),
    }))
  );

  const entries: MetadataRoute.Sitemap = [...staticEntries, ...guideEntries];
  return entries;
}
