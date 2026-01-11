import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/lib/siteConfig';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  const canonical = `/${localeKey}/about`;
  return {
    title: localeKey === 'zh' ? '关于 FreeFormat（独立开发者与产品愿景）' : 'About FreeFormat (Indie Developer & Vision)',
    description:
      localeKey === 'zh'
        ? 'FreeFormat 是一个面向 Word（.docx）的格式检查与格式化工具：先检查再修复，并明确能力边界与交付物。'
        : 'FreeFormat is a Word (.docx) format checker + formatter: check first, then fix, with clear deliverables and boundaries.',
    alternates: {
      canonical,
      languages: {
        en: '/en/about',
        zh: '/zh/about',
      },
    },
    openGraph: {
      url: canonical,
      type: 'website',
    },
  };
}

export default function AboutPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  const isZh = locale === 'zh';
  return (
    <>
      <Header locale={locale} />
      <main className="mx-auto max-w-3xl px-4 py-10 text-slate-900">
        <h1 className="mb-4 text-3xl font-semibold">{isZh ? '关于 FreeFormat' : 'About FreeFormat'}</h1>
        <p className="mb-8 text-sm text-slate-600">
          {isZh
            ? 'FreeFormat 是一个面向 Word（.docx）的格式检查与格式化工具：先检查（评分 + 问题列表），再按模板修复并下载结果。'
            : 'FreeFormat is a Word (.docx) format checker + formatter: score & issues first, then apply a template and download the result.'}
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-slate-800">
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '我是谁' : 'Who I am'}</h2>
            <p className="mt-2">
              {isZh
                ? '我是一个独立开发者。在大模型时代，我希望做出一些真正能帮到人的产品。做 FreeFormat 的原因很简单：学术写作或正式写作时，编排内容本身需要投入时间精力，这是值得的；但进入 Word 排版阶段，耗时、反复修改、最后还不确定“到底有没有符合要求”，往往成为整个创作过程中最令人心烦的部分。'
                : 'I’m an independent developer. I started FreeFormat because Word formatting is often the most time‑consuming and frustrating part of writing—lots of manual tweaks, repeated edits, and still not sure if it meets the requirements.'}
            </p>
            <p className="mt-2">
              {isZh
                ? '我不想把这件事做成“学术写作教程”，而是想把它做成一个更接近工具的东西：能把文档格式整理到一个可接受的状态，并给出清晰的检查结果，让你知道哪里还需要手动处理。'
                : 'I’m not trying to build a writing tutorial. I want a tool: bring your document to an acceptable formatting state, and give you a clear check report so you know what still needs manual work.'}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{isZh ? 'FreeFormat 是什么' : 'What FreeFormat is'}</h2>
            <p className="mt-2">
              {isZh ? '这是一个由独立开发者维护的工具站点。' : 'This is a tool site maintained by an independent developer.'}{' '}
              {isZh
                ? 'FreeFormat 是一个面向 Word（.docx）的格式检查与格式化工具。它围绕“模板（template）”工作：不同学校/期刊/会议/规范对版式有不同要求；模板把这些要求变成一套可执行的规则，然后程序把这些规则应用到具体段落中，以此完成格式修改。'
                : 'FreeFormat is a format checker + formatter for Word (.docx). It works around templates: each school/journal/conference has layout requirements, and a template turns them into executable rules applied to your paragraphs.'}
            </p>
            <p className="mt-2">
              {isZh
                ? '目前产品的核心能力集中在字体、大小、段落样式等可稳定自动化的项目上；我会持续迭代与更新。'
                : 'Today, the core focus is typography and paragraph styles—things that can be applied reliably. I’ll keep iterating and improving the coverage.'}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{isZh ? '如何工作（3 步）' : 'How it works (3 steps)'}</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>{isZh ? '选择一个指南/模板（如 APA、MLA 或学校论文模板）。' : 'Pick a guide/template (e.g., APA, MLA, or a school thesis template).'}</li>
              <li>{isZh ? '上传你的 Word（.docx）并先做一次格式检查（评分 + 问题列表）。' : 'Upload your Word (.docx) and run a format check (score + issues).'}</li>
              <li>{isZh ? '下载排版后的文档，并按学校/期刊要求做最终检查。' : 'Download the formatted document and cross‑check against official requirements.'}</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{isZh ? '我们能做什么（当前版本）' : 'What it can do (current)'}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>{isZh ? '统一行距、段前段后、首行缩进（并清理多余空格/Tab）。' : 'Unify spacing and indents (and remove extra spaces/tabs).'}</li>
              <li>{isZh ? '统一正文与多级标题样式。' : 'Apply consistent body and multi‑level heading styles.'}</li>
              <li>{isZh ? '统一参考文献列表的版式（如悬挂缩进）。' : 'Format reference list layout (e.g., hanging indents).'}</li>
              <li>{isZh ? '统一表题/图题等题注样式。' : 'Format table/figure caption styles.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{isZh ? '能力边界（我不会硬说“一键全搞定”）' : 'Boundaries (what I won’t over-promise)'}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>{isZh ? '不改写或润色正文内容。' : 'We do not rewrite or proofread your content.'}</li>
              <li>{isZh ? '不保证复杂页眉页脚与分节页码完全一致。' : 'We do not guarantee complex headers/footers and section‑based page numbering.'}</li>
              <li>{isZh ? '不负责参考文献条目的内容规范（字段顺序/标点等）。' : 'We do not enforce citation/reference content rules (field order/punctuation).'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{isZh ? '盈利模式与未来愿景' : 'Business model & vision'}</h2>
            <p className="mt-2">
              {isZh
                ? '当前 FreeFormat 主要以工具站的方式运营：对用户来说，格式检查与格式化是免费的；对我来说，成本主要来自存储与（可选的）AI 能力调用。我希望先用“免费可用 + 明确能力边界 + 可验证交付物”的方式把产品做扎实，并通过广告与自然流量覆盖基础成本，让它至少能自我运转。未来的愿景是把它做成半自助的排版工具：用户可以基于现有模板直接使用，也可以提交自己学校/期刊的格式要求；在不增加复杂门槛的前提下，我会提供“付费加速生成专属模板”的选项，用更强的模型与更完善的流程更快交付更可靠的模板，而格式化能力仍尽量保持对更多人可用、成本可控。'
                : 'FreeFormat is currently operated as a free tool site. For users, checking and formatting are free; my main costs are storage and (optional) AI calls. The near‑term goal is sustainability: clear boundaries + verifiable deliverables, supported by ads and organic traffic. The longer‑term vision is a semi‑self‑serve workflow: you can use existing templates, and if you need a custom school/journal format, you can request it with a paid “accelerated template generation” option that uses stronger models and a more robust delivery process.'}
            </p>
            <p className="mt-2">
              {isZh
                ? '我希望：AI 时代，每个人都能把精力投入到自己认为更有价值的事情上，剩余的事情，就交给 AI 和我们开发者。'
                : 'In the AI era, I hope people can focus on what they value most—and let tools handle the repetitive parts.'}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{isZh ? '联系方式' : 'Contact'}</h2>
            <p className="mt-2">
              {isZh ? '邮箱：' : 'Email: '}{' '}
              <a className="text-cyan-700 underline hover:text-cyan-900" href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
            </p>
            <p className="mt-2">
              <Link className="text-cyan-700 underline hover:text-cyan-900" href={`/${locale}/devlog`}>
                {isZh ? '查看开发日志' : 'View the dev log'}
              </Link>
              {' · '}
              <Link className="text-cyan-700 underline hover:text-cyan-900" href={`/${locale}/support`}>
                {isZh ? '支持与常见问题' : 'Support & FAQ'}
              </Link>
            </p>
          </section>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
