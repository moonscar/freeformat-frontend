import '../styles/globals.css';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === '1';
  const adsClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {adsEnabled && adsClient ? (
          <>
            <meta name="google-adsense-account" content={adsClient} />
            <Script
              id="adsbygoogle-loader"
              async
              strategy="afterInteractive"
              crossOrigin="anonymous"
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
                adsClient,
              )}`}
            />
          </>
        ) : null}
      </head>
      <body className="min-h-screen bg-gradient-to-br from-[#f6f8ff] via-[#fef7f2] to-[#f0fbff] text-slate-900 antialiased">
        {children}
        <VercelAnalytics />
      </body>
    </html>
  );
}
