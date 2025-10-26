export default function robots() {
  const url = 'https://your-domain.com';
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}

