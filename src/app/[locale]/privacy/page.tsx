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
        <h1 className="mb-4 text-3xl font-semibold">{isZh ? '隐私与使用说明' : 'Privacy & Usage'}</h1>
        <p className="mb-3 text-sm text-slate-600">
          {isZh
            ? 'FreeFormat 是一个文档排版工具。我们只在格式化过程中使用你上传的文档与所选模板/指南，不用于其他目的。'
            : 'FreeFormat is a document formatting tool. We use your uploaded documents and the selected template/guide solely to format your file.'}
        </p>
        <div className="space-y-4 text-sm leading-relaxed text-slate-800">
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '数据使用' : 'Data Usage'}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>{isZh ? '上传的 .docx 仅用于解析与应用样式，不会修改正文语义。' : 'Uploaded .docx files are parsed and styled; we do not alter your content.'}</li>
              <li>{isZh ? '格式指南文本仅用于生成/匹配模板，不会对外共享。' : 'Guideline text is used to generate/match templates and is not shared externally.'}</li>
              <li>{isZh ? '格式化产物与临时文件会定期清理；如需长期保留，请自行下载备份。' : 'Formatted outputs and temp files are cleaned periodically; please download and keep your own copies.'}</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '安全与访问' : 'Security & Access'}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>{isZh ? '请避免上传包含高度敏感信息的文件；我们建议在提交前自行脱敏。' : 'Avoid uploading highly sensitive data; consider redacting it before submission.'}</li>
              <li>{isZh ? '文件仅用于格式化流程；链接仅用于下载结果，不会公开索引。' : 'Files are used only for formatting; download links are not intended for public indexing.'}</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '联系方式' : 'Contact'}</h2>
            <p className="mt-2">
              {isZh
                ? '如有隐私或合规问题，请邮件联系：hello@freeformat.app'
                : 'If you have privacy or compliance questions, email: hello@freeformat.app'}
            </p>
          </section>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
