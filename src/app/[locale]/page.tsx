import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function LocaleHome({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  redirect(`/${locale}/tool`);
}
