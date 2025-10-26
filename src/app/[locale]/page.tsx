import Link from 'next/link';
import InlineRequestForm from '@/components/InlineRequestForm';

const REQUEST_EMAIL = process.env.NEXT_PUBLIC_REQUEST_EMAIL || 'hello@ai-formatter.com';

export default function Page({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  const t = locale === 'en' ? en : zh;
  return (
    <main className="relative mx-auto max-w-6xl px-4 py-16 text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-[-20%] top-[-220px] h-[460px] bg-gradient-to-b from-cyan-200/70 via-[#fef7f2] to-transparent blur-[180px]" />
        <div className="absolute left-1/3 top-[320px] h-80 w-80 bg-rose-200/40 blur-[200px]" />
      </div>

      {/* Hero */}
      <section className="text-center space-y-6">
        <span className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-200 bg-white/70 px-4 py-1 text-sm font-medium text-cyan-800 shadow-sm">
          {t.badge}
        </span>
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight text-slate-900">
          <span className="bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-700 bg-clip-text text-transparent">{t.heroTitle}</span>
        </h1>
        <p className="mx-auto max-w-3xl text-base text-slate-600 md:text-lg">{t.heroDesc}</p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#request"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-cyan-500/40 transition hover:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
          >
            {t.cta.primary}
          </a>
          <Link
            href={`/${params.locale}/templates`}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3 text-base font-semibold text-slate-800 shadow-sm transition hover:border-cyan-300 hover:text-cyan-700"
          >
            {t.cta.secondary}
          </Link>
        </div>
      </section>

      {/* Primary CTA: Inline requirement submission (no email client) */}
      <section id="request" className="mt-12">
        <InlineRequestForm
          locale={locale}
          targetEmail={REQUEST_EMAIL}
          title={t.inline.title}
          desc={t.inline.desc}
          submitText={t.inline.submit}
          successText={t.inline.success}
          apiHint={t.inline.apiHint}
        />
      </section>

      {/* Value props */}
      <section className="mt-14 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl shadow-slate-200/70">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">{t.features.title}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {t.features.items.map((i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl shadow-slate-200/70">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">{t.howItWorks.title}</p>
          <ol className="mt-4 space-y-3 text-sm text-slate-600">
            {t.howItWorks.steps.map((s, index) => (
              <li key={s} className="flex gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-200">
                  {index + 1}
                </span>
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl border border-white/60 bg-gradient-to-b from-white via-cyan-50 to-rose-50 p-6 shadow-xl shadow-slate-200/70">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">{t.links.title}</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>
              <Link
                className="flex items-center justify-between rounded-xl border border-white/80 bg-white px-4 py-3 transition hover:border-cyan-300 hover:text-cyan-700"
                href={`/${params.locale}/templates`}
              >
                <span>{t.links.templates}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center justify-between rounded-xl border border-white/80 bg-white px-4 py-3 transition hover:border-cyan-300 hover:text-cyan-700"
                href={`/${params.locale}/privacy`}
              >
                <span>{t.links.privacy}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

const zh = {
  badge: '内测优先通道 · 免费试用',
  heroTitle: '一键按高校规范自动排版论文',
  heroDesc: '首发上线 SEO 落地页：欢迎把你正在/即将面临的格式要求发送到我们的邮箱，我们会优先支持热门格式并回信告知进度。',
  cta: {
    primary: '立即提交格式',
    secondary: '查看模板',
  },
  features: {
    title: '核心功能',
    items: ['提交格式要求，优先适配热门', 'docx 解析', '模板应用', '差异报告（即将）'],
  },
  howItWorks: {
    title: '工作原理',
    steps: ['发送格式要求到邮箱', '我们生成模板并回信', '正式版上线后一键排版并下载'],
  },
  links: {
    title: '更多',
    templates: '模板列表',
    privacy: '隐私与使用限制',
  },
  inline: {
    title: '在线提交你的格式要求（无需跳转）',
    desc: '填写核心信息后点击提交，我们会帮你自动生成邮件草稿并打开邮箱。',
    submit: '生成邮件草稿',
    success: `已打开邮件客户端，如未弹出请手动发送至 ${REQUEST_EMAIL}`,
    apiHint: `目标邮箱：${REQUEST_EMAIL}`,
  },
};

const en = {
  badge: 'Early Access · Free While In Beta',
  heroTitle: 'One‑click Thesis Formatting',
  heroDesc: 'Landing page for SEO: send us your formatting guideline by email; we prioritize popular formats and reply with status. Full product comes soon.',
  cta: {
    primary: 'Submit a guideline',
    secondary: 'Explore templates',
  },
  features: {
    title: 'Features',
    items: ['Collect requirements by email', 'Docx parsing', 'Template styling', 'Diff report (soon)'],
  },
  howItWorks: {
    title: 'How it works',
    steps: ['Email us your guideline', 'We build a template & reply', 'Format & download when GA is ready'],
  },
  links: {
    title: 'More',
    templates: 'Templates',
    privacy: 'Privacy & Usage Limits',
  },
  inline: {
    title: 'Submit your guideline inline (no redirect)',
    desc: 'Fill in the essentials, click submit, and we will open your mail app with a prefilled draft.',
    submit: 'Open email draft',
    success: `Mail composer opened. Send it to ${REQUEST_EMAIL}`,
    apiHint: `Target email: ${REQUEST_EMAIL}`,
  },
};
