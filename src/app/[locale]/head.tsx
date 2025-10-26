import { siteConfig } from '@/lib/siteConfig';

export default function Head({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en-US' : 'zh-CN';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    description: siteConfig.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    inLanguage: locale,
    url: siteConfig.url,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
    },
    creator: {
      '@type': 'Organization',
      name: siteConfig.name,
      email: siteConfig.contactEmail,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
