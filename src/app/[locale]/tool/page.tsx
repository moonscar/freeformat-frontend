import Link from 'next/link';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/layout/HeroSection';
import Footer from '@/components/layout/Footer';
import { getT } from '@/i18n';
import InfoSections from '@/components/sections/InfoSections';
import FAQ from '@/components/sections/FAQ';

export default function ToolPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  const dict = getT(locale as any);
  const t = dict.tool;
  return (
    <>
      <Header locale={locale} />
      <HeroSection title={t.heroTitle} desc={t.heroDesc} />
      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* 工具区占位：后续接入 GuidelineBox / Upload / Templates */}
        <section className="rounded-2xl border border-dashed p-6 text-slate-700">
          <h2 className="text-lg font-semibold">{t.placeholderTitle}</h2>
          <p className="mt-1 text-sm">{t.placeholderDesc}</p>
          <div className="mt-3 text-sm">
            <Link href={`/${params.locale}/templates`} className="underline">
              {t.links.templates} →
            </Link>
          </div>
        </section>
        {/* 说明与 FAQ，与反馈页保持一致布局 */}
        <InfoSections what={dict.landing.info.what} how={dict.landing.info.how} use={dict.landing.info.use} />
        <FAQ title={dict.landing.info.faq.title} items={dict.landing.info.faq.items} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
