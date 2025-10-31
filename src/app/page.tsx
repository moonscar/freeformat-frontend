import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

function pickLocale(accept: string | null | undefined): 'zh' | 'en' {
  if (!accept) return 'zh';
  const parts = accept
    .split(',')
    .map((s) => s.split(';')[0]?.trim().toLowerCase())
    .filter(Boolean) as string[];
  for (const p of parts) {
    if (p.startsWith('zh')) return 'zh';
    if (p.startsWith('en')) return 'en';
  }
  return 'zh';
}

export default function RootRedirect() {
  const accept = headers().get('accept-language');
  const locale = pickLocale(accept);
  // 首页定位为反馈收集页面（/[locale]）
  redirect(`/${locale}`);
}

