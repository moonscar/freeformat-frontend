import type { Metadata } from 'next';
import '../../styles/globals.css';
import { siteConfig } from '@/lib/siteConfig';
import Analytics from '@/components/Analytics';

type LayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

const languageAlternates = {
  en: '/en',
  zh: '/zh',
};

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  const localeConfig = siteConfig.locales[localeKey];

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: localeConfig.title,
      template: `%s | ${localeConfig.title}`,
    },
    description: localeConfig.description,
    keywords: localeConfig.keywords,
    alternates: {
      canonical: `/${localeKey}`,
      languages: languageAlternates,
    },
    openGraph: {
      title: localeConfig.title,
      description: localeConfig.description,
      url: `${siteConfig.url}/${localeKey}`,
      siteName: 'AI Formatter',
      locale: localeConfig.ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: localeConfig.title,
      description: localeConfig.description,
    },
  };
}

export default function RootLayout({ children, params }: LayoutProps) {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  return (
    <html lang={localeKey} suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-[#f6f8ff] via-[#fef7f2] to-[#f0fbff] text-slate-900 antialiased">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
