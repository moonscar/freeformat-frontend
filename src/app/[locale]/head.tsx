import { siteConfig } from '@/lib/siteConfig';

export default function Head({ params }: { params: { locale: string } }) {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  const localeConfig = siteConfig.locales[localeKey];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: localeConfig.title,
    description: localeConfig.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    inLanguage: localeConfig.schemaLang,
    url: `${siteConfig.url}/${localeKey}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
    },
    creator: {
      '@type': 'Organization',
      name: 'FreeFormat · AI Document Formatter',
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
