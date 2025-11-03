import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const locales = ['zh', 'en'];
  const staticRoutes = [
    '',
    '/templates',
    '/tool',
    '/guides/apa-format',
    '/guides/mla-format',
  ];

  return staticRoutes.flatMap((path) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      changefreq: 'weekly',
      priority: path === '' ? 1 : 0.7,
      lastModified: new Date(),
    }))
  );
}
