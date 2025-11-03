import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/siteConfig';

export default function robots(): MetadataRoute.Robots {
  const url = siteConfig.url;
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/en/*', '/zh/*', '/guides/*', '/templates', '/tool'],
        disallow: ['/api/*', '/_next/*', '/download/*', '/*?*'],
      },
    ],
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}
