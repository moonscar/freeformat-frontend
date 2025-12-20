import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const localeKey = params.locale === 'en' ? 'en' : 'zh';
  const canonical = `/${localeKey}/terms`;
  return {
    title: localeKey === 'zh' ? '使用条款' : 'Terms of Use',
    description:
      localeKey === 'zh'
        ? 'FreeFormat 的使用条款与免责声明。'
        : 'Terms of use and disclaimers for FreeFormat.',
    alternates: {
      canonical,
      languages: {
        en: '/en/terms',
        zh: '/zh/terms',
      },
    },
    openGraph: {
      url: canonical,
      type: 'website',
    },
  };
}

export default function TermsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  const isZh = locale === 'zh';
  return (
    <>
      <Header locale={locale} />
      <main className="mx-auto max-w-3xl px-4 py-10 text-slate-900">
        <h1 className="mb-4 text-3xl font-semibold">{isZh ? '使用条款' : 'Terms of Use'}</h1>
        <div className="space-y-4 text-sm leading-relaxed text-slate-800">
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '服务性质' : 'Service'}</h2>
            <p className="mt-2">
              {isZh
                ? 'FreeFormat 提供文档排版与样式应用服务，主要用于将模板版式应用到你上传的 Word（.docx）文档。'
                : 'FreeFormat provides document formatting by applying style templates to your uploaded Word (.docx) files.'}
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '用户责任' : 'Your responsibility'}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                {isZh
                  ? '你应确保上传内容不侵犯第三方权利，并对提交的内容与使用结果负责。'
                  : 'You are responsible for the content you upload and must not infringe third‑party rights.'}
              </li>
              <li>
                {isZh
                  ? '格式化结果需自行核对并最终确认，尤其是学校/期刊的细节要求。'
                  : 'You must review and validate the formatted result against your official requirements.'}
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '免责声明' : 'Disclaimer'}</h2>
            <p className="mt-2">
              {isZh
                ? '我们尽力提升模板与引擎的准确性，但不对任何特定机构审核通过、排版结果完全无误作保证。因使用本服务造成的直接或间接损失，由用户自行承担。'
                : 'We strive to improve template accuracy, but we do not guarantee acceptance by any institution or perfectly correct formatting. You use the service at your own risk.'}
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold">{isZh ? '变更' : 'Changes'}</h2>
            <p className="mt-2">
              {isZh
                ? '我们可能会不定期更新本条款。继续使用即表示你接受更新后的条款。'
                : 'We may update these terms from time to time. Continued use means you accept the updated terms.'}
            </p>
          </section>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}

