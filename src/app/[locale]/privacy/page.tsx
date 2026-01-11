import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  const canonical = `/${localeKey}/privacy`;
  return {
    alternates: {
      canonical,
      languages: {
        en: '/en/privacy',
        zh: '/zh/privacy',
      },
    },
    openGraph: {
      url: canonical,
      type: 'website',
    },
  };
}

export default function PrivacyPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  const isZh = locale === 'zh';
  return (
    <>
      <Header locale={locale} />
      <main className="mx-auto max-w-3xl px-4 py-10 text-slate-900">
        <h1 className="mb-4 text-3xl font-semibold">{isZh ? '隐私说明' : 'Privacy'}</h1>
        <p className="mb-6 text-sm text-slate-600">
          {isZh
            ? '我们只在你发起格式检查/格式化任务时使用你上传的文档与所选模板/指南，不用于其他目的。'
            : 'We only use your uploaded documents and selected template/guide to run the check/format tasks you request.'}
        </p>
        <div className="space-y-4 text-sm leading-relaxed text-slate-800">
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '我们收集哪些信息' : 'What we collect'}</h2>
            <h3 className="mt-3 font-semibold text-slate-900">{isZh ? '你主动提供的信息' : 'Information you provide'}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>{isZh ? '你上传的 `.docx` 文件（用于格式检查/格式化）' : 'Your uploaded `.docx` file (for checking/formatting)'}</li>
              <li>{isZh ? '你选择的指南/模板（用于确定检查与格式化规则）' : 'Your selected guide/template (to determine rules)'}</li>
              <li>{isZh ? '你提交的反馈文本（如果你在站内提交意见）' : 'Feedback text you submit (if any)'}</li>
            </ul>
            <h3 className="mt-3 font-semibold text-slate-900">{isZh ? '自动产生的信息（服务运行所需）' : 'Automatically generated (service operation)'}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                {isZh
                  ? '基本的请求日志（例如时间、耗时、错误信息），用于排查问题与改进质量'
                  : 'Basic request logs (time, duration, errors) for debugging and improving quality'}
              </li>
              <li>
                {isZh
                  ? '生成的中间产物（例如用于检查/格式化的结构化文档数据 `doc.json`、检查报告）'
                  : 'Intermediate artifacts (e.g., structured `doc.json`, check reports)'}
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '文件与数据如何被使用' : 'How we use your data'}</h2>
            <p className="mt-2">
              {isZh
                ? '我们只把你的文件与数据用于：完成任务、生成结果与排查错误。不会把你的文档内容用于训练公开模型，也不会出售给第三方。'
                : 'We only use your data to run your tasks, produce outputs, and debug issues. We do not sell your content, and we do not use it to train public models.'}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>{isZh ? '完成你发起的格式检查与格式化任务' : 'Run the format check and formatting you request'}</li>
              <li>{isZh ? '输出检查报告与格式化后的文件' : 'Generate check reports and formatted outputs'}</li>
              <li>{isZh ? '排查错误与改进工具质量（例如复现某个格式问题）' : 'Debug and improve quality (e.g., reproducing issues)'}</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '存储与保留期限' : 'Storage & retention'}</h2>
            <p className="mt-2">
              {isZh
                ? '为支持“结果复用/避免重复计算”，系统可能会临时保存你上传的文档、格式化后的文档、检查报告与中间结构化数据（例如 `doc.json`）。'
                : 'To support reuse (avoid repeated computation), we may temporarily store your uploaded file, formatted output, reports, and intermediate artifacts (e.g., `doc.json`).'}
            </p>
            <p className="mt-2">
              {isZh ? '默认保留 7 天，到期自动清理。' : 'Default retention: 7 days, then auto-clean.'}
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '第三方服务' : 'Third-party services'}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>{isZh ? '文件存储服务（用于保存你上传的文件与结果文件）' : 'File storage (to store uploads and outputs)'}</li>
              <li>
                {isZh
                  ? 'AI 服务（用于某些可选能力，例如段落标注或模板生成；具体以产品页面说明为准）'
                  : 'AI services (optional features like paragraph annotation or template generation; see product pages for details)'}
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '你可以怎么做（删除与反馈）' : 'Deletion & feedback'}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>{isZh ? '如需删除某次任务相关的文件/中间数据，请发邮件到：about@freeformat.app' : 'To delete a task’s files/artifacts, email: about@freeformat.app'}</li>
              <li>
                {isZh
                  ? '为帮助定位，请提供：上传时间（大概即可）、你使用的指南/模板名称、以及你看到的报错信息（如有）'
                  : 'For faster debugging, include: upload time (approx), guide/template used, and any error messages.'}
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '免责声明（重要）' : 'Important notice'}</h2>
            <p className="mt-2">
              {isZh
                ? '你不应上传包含敏感个人信息或高度机密信息的文件（例如身份证号、银行卡信息、完整合同等）。如果不确定，请先把“格式要求”以文本形式发给我讨论。'
                : 'Do not upload highly sensitive or confidential documents (IDs, bank details, full contracts, etc.). If unsure, send the formatting requirements as plain text first.'}
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '联系方式' : 'Contact'}</h2>
            <p className="mt-2">
              {isZh
                ? '如有隐私或合规问题，请邮件联系：about@freeformat.app'
                : 'If you have privacy or compliance questions, email: about@freeformat.app'}
            </p>
          </section>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
