import type { Metadata } from 'next';
import { siteConfig } from '@/lib/siteConfig';
import Analytics from '@/components/Analytics';
import VercelAnalytics from '@/components/VercelAnalytics';

type LayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
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
    keywords: Array.from(localeConfig.keywords),
    openGraph: {
      title: localeConfig.title,
      description: localeConfig.description,
      siteName: 'FreeFormat · AI Document Formatter',
      locale: localeConfig.ogLocale,
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

export default function LocaleLayout({ children, params }: LayoutProps) {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  return (
    <>
      <Analytics />
      {children}
      <VercelAnalytics />
    </>
  );
}
