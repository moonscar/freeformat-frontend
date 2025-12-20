import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  const canonical = `/${localeKey}/contact`;
  return {
    title: localeKey === 'zh' ? '联系我们' : 'Contact',
    description:
      localeKey === 'zh'
        ? '联系 FreeFormat：支持与问题反馈。'
        : 'Contact FreeFormat for support and feedback.',
    alternates: {
      canonical,
      languages: {
        en: '/en/contact',
        zh: '/zh/contact',
      },
    },
    openGraph: {
      url: canonical,
      type: 'website',
    },
  };
}

export default function ContactPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  const isZh = locale === 'zh';
  return (
    <>
      <Header locale={locale} />
      <main className="mx-auto max-w-3xl px-4 py-10 text-slate-900">
        <h1 className="mb-4 text-3xl font-semibold">{isZh ? '联系我们' : 'Contact'}</h1>
        <div className="space-y-4 text-sm leading-relaxed text-slate-800">
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '反馈入口' : 'Feedback'}</h2>
            <p className="mt-2">
              {isZh ? '格式化效果问题、模板需求或功能建议，请优先使用反馈页：' : 'For formatting issues, template requests or suggestions, use the feedback page:'}{' '}
              <Link className="text-cyan-700 underline hover:text-cyan-900" href={`/${locale}/feedback`}>
                {isZh ? '提交反馈' : 'Submit feedback'}
              </Link>
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '邮箱' : 'Email'}</h2>
            <p className="mt-2">
              {isZh ? '商务/合作/合规问题：' : 'Business/partnership/compliance:'}{' '}
              <a className="text-cyan-700 underline hover:text-cyan-900" href="mailto:hello@freeformat.app">
                hello@freeformat.app
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}

