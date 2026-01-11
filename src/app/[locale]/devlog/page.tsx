import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/lib/siteConfig';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  const canonical = `/${localeKey}/devlog`;
  const title = localeKey === 'zh' ? '产品开发日志' : 'Product Dev Log';
  const description =
    localeKey === 'zh'
      ? '记录 FreeFormat 的重大功能迭代与更新。'
      : 'Major product updates and milestones for FreeFormat.';
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: '/en/devlog',
        zh: '/zh/devlog',
      },
    },
    openGraph: {
      url: canonical,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function DevLogPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  const isZh = locale === 'zh';
  return (
    <>
      <Header locale={locale} />
      <main className="mx-auto max-w-3xl px-4 py-10 text-slate-900">
        <h1 className="mb-2 text-3xl font-semibold">{isZh ? '产品开发日志' : 'Product Dev Log'}</h1>
        <p className="mb-8 text-sm text-slate-600">
          {isZh
            ? '这里记录 FreeFormat 的重大功能迭代。后续我会把每个版本的核心改动、原因与结果放在这里，方便用户与审核方理解产品在持续迭代。'
            : 'This page records major FreeFormat updates. It helps users (and reviewers) understand what changed, why, and what the tool can do.'}
        </p>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">{isZh ? '写作规范' : 'Posting format'}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>{isZh ? '仅记录重大功能：工具链路、质量闭环、模板与引擎能力变化。' : 'Major milestones only: core flow, quality loop, template/engine capability changes.'}</li>
            <li>{isZh ? '每条包含：时间、改动点、用户影响、已知限制与下一步。' : 'Each entry should include: date, changes, user impact, known limits, and next steps.'}</li>
          </ul>
          <div className="mt-4 text-sm text-slate-700">
            {isZh ? '联系：' : 'Contact: '}{' '}
            <a className="text-cyan-700 underline hover:text-cyan-900" href={`mailto:${siteConfig.contactEmail}`}>
              {siteConfig.contactEmail}
            </a>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">{isZh ? '日志条目' : 'Entries'}</h2>
          <p className="mt-2 text-sm text-slate-600">
            {isZh ? '（待补充：你可以直接在此页面追加条目。）' : '(To be updated: append new entries directly on this page.)'}
          </p>
        </section>

        <div className="mt-8 text-sm">
          <Link className="text-cyan-700 underline hover:text-cyan-900" href={`/${locale}/tool`}>
            {isZh ? '返回工具页' : 'Back to the tool'}
          </Link>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
