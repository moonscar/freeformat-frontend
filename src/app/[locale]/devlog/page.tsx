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
            ? '这里记录 FreeFormat 的关键节点与重要迭代：我在解决什么问题、为什么这样做、目前的能力边界是什么。'
            : 'Major milestones and iterations for FreeFormat: what changed, why, and the current boundaries.'}
        </p>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">{isZh ? '为什么写开发日志' : 'Why this log exists'}</h2>
          <p className="mt-2 text-sm text-slate-700">
            {isZh
              ? 'FreeFormat 是一个工具型站点，最容易被误解成“教程/资料整理页”。我希望把真实进展与能力边界公开出来：哪些已经稳定，哪些仍需要你在 Word 里手动确认。'
              : 'FreeFormat is a tool site. To avoid “it looks like a tutorial site” confusion, I keep milestones and boundaries public: what is stable and what still needs manual Word steps.'}
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold">{isZh ? '里程碑' : 'Milestones'}</h2>

          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold">{isZh ? '2026-01-10｜进入正式上线阶段' : '2026-01-10 — Launch phase'}</h3>
            <p className="mt-2 text-sm text-slate-700">
              {isZh
                ? '站点从“征集意见 + 半 demo”进入“对外可用”的上线状态：优先兑现承诺，而不是追求模板数量。'
                : 'Moved from “feedback collection + semi-demo” to a usable public release: prioritize deliverables over template count.'}
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold">{isZh ? '2025-12-31｜证据与交付物链条搭建' : '2025-12-31 — Evidence & deliverables'}</h3>
            <p className="mt-2 text-sm text-slate-700">
              {isZh
                ? '开始批量生成“示例文档、格式化结果、截图”等证据材料，用真实交付物降低“低价值内容/同质化摘要”的风险。'
                : 'Started producing evidence artifacts (sample docs, formatted outputs, screenshots) so pages have verifiable deliverables.'}
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold">{isZh ? '2025-12-22｜需求调研开始' : '2025-12-22 — Research'}</h3>
            <p className="mt-2 text-sm text-slate-700">
              {isZh
                ? '用搜索引擎与用户社区验证真实痛点，把产品从“我觉得该做什么”转向“用户在搜什么”。'
                : 'Validated real pain points via search and communities—shifted from assumptions to what users actually search for.'}
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">{isZh ? '我会持续公开的内容' : 'What I will keep publishing'}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>{isZh ? '每次重要能力升级（页码/页眉页脚、单双栏、目录等）' : 'Major capability upgrades (page numbers, headers/footers, columns, TOC, etc.)'}</li>
            <li>{isZh ? '每次明显影响用户体验的 bug 修复（原因/影响/修复方式）' : 'High-impact bug fixes (cause, impact, fix)'}</li>
          </ul>
          <div className="mt-4 text-sm text-slate-700">
            {isZh ? '联系：' : 'Contact: '}{' '}
            <a className="text-cyan-700 underline hover:text-cyan-900" href={`mailto:${siteConfig.contactEmail}`}>
              {siteConfig.contactEmail}
            </a>
          </div>
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
