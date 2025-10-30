/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  async rewrites() {
    const target = process.env.API_PROXY_TARGET || process.env.NEXT_PUBLIC_API_BASE
    if (!target) return []
    return [
      {
        source: '/api/:path*',
        destination: `${target}/:path*`,
      },
    ]
  },
};

module.exports = nextConfig;
