import Link from 'next/link';
import InlineRequestForm from '@/components/InlineRequestForm';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/layout/HeroSection';
import Footer from '@/components/layout/Footer';
import { getT } from '@/i18n';
import InfoSections from '@/components/sections/InfoSections';
import FAQ from '@/components/sections/FAQ';

const REQUEST_EMAIL = process.env.NEXT_PUBLIC_REQUEST_EMAIL || 'hello@ai-formatter.com';

export default function Page({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  const dict = getT(locale as any);
  const t = dict.landing;
  return (
    <>
      <Header locale={locale} />
      <HeroSection title={t.heroTitle} desc={t.heroDesc} />
      <main className="relative mx-auto max-w-6xl px-4 py-12 text-slate-900">
        {/* Primary CTA: Inline requirement submission */}
        <section id="request" className="mt-4">
          <InlineRequestForm
            locale={locale as any}
            targetEmail={REQUEST_EMAIL}
            title={t.inline.title}
            desc={t.inline.desc}
            submitText={t.inline.submit}
            successText={t.inline.success}
            apiHint={t.inline.apiHint}
          />
        </section>

        {/* Info sections matching classic tool layout */}
        <InfoSections what={t.info.what} how={t.info.how} use={t.info.use} />
        <FAQ title={t.info.faq.title} items={t.info.faq.items} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
