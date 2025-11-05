import GuideList from '@/components/GuideList';

export default function GuidesIndex({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">{locale === 'zh' ? '指南索引' : 'Guides Index'}</h1>
      <p className="mt-2 text-slate-600">{locale === 'zh' ? '学位论文与期刊格式规范集合' : 'Thesis and journal formatting guides'}</p>
      {/* @ts-expect-error Async Server Component */}
      <GuideList locale={locale} />
    </main>
  );
}
export const revalidate = 300;
