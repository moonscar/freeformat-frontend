export default async function sitemap() {
  const baseUrl = 'https://your-domain.com';
  const locales = ['zh', 'en'];

  const routes = ['', '/templates'].flatMap((path) =>
    locales.map((l) => ({ url: `${baseUrl}/${l}${path}`, changefreq: 'weekly', priority: 0.8 }))
  );

  return routes;
}

