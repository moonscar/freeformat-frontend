import InlineRequestForm from '@/components/InlineRequestForm';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/layout/HeroSection';
import Footer from '@/components/layout/Footer';
import { getT } from '@/i18n';
import InfoSections from '@/components/sections/InfoSections';
import AnchorNav from '@/components/sections/AnchorNav';
import FAQ from '@/components/sections/FAQ';
import GuideList from '@/components/GuideList';
import type { Metadata } from 'next';

const REQUEST_EMAIL = process.env.NEXT_PUBLIC_REQUEST_EMAIL || 'about@freeformat.app';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  const canonical = `/${localeKey}/landing`;
  return {
    alternates: {
      canonical,
      languages: {
        en: '/en/landing',
        zh: '/zh/landing',
      },
    },
    openGraph: {
      url: canonical,
      type: 'website',
    },
  };
}

export default function LandingPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  const dict = getT(locale as any);
  const t = dict.landing;
  return (
    <>
      <Header locale={locale} />
      <HeroSection title={t.heroTitle} desc={t.heroDesc} />
      <main className="relative mx-auto max-w-3xl px-4 py-10 text-slate-900">
        <section id="request" className="mt-2">
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

        <section className="mb-10">
          <h2 className="mb-3 text-2xl font-semibold text-slate-900">{locale === 'zh' ? '指南索引' : 'Guides Index'}</h2>
          <GuideList locale={locale} />
        </section>

        <AnchorNav
          items={[
            { href: '#what', label: t.info.what.title },
            { href: '#how', label: t.info.how.title },
            { href: '#use', label: t.info.use.title },
            { href: '#faq', label: t.info.faq.title },
          ]}
        />

        <InfoSections what={t.info.what} how={t.info.how} use={t.info.use} subheads={t.info.subheads} />
        <div id="faq">
          <FAQ title={t.info.faq.title} items={t.info.faq.items} />
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}

export const revalidate = 300;
