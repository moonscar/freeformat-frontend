import Link from 'next/link';
import { headers } from 'next/headers';

type GuideItem = { slug: string; locale: string; title?: string | null; guide_type?: string | null; version?: string | null };

type GuideSearchItem = {
  slug: string;
  locale: string;
  title?: string | null;
  template_id: string;
  template_tier?: string | null;
  status?: string;
};

function resolveApiBaseAbsolute(): string {
  const base = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '') || '/api';
  if (base && !base.startsWith('/')) return base;
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'http';
  if (!host) return base;
  return `${proto}://${host}${base}`.replace(/\/$/, '');
}

async function fetchGuides(locale: string): Promise<GuideItem[]> {
  const base = resolveApiBaseAbsolute();
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const res = await fetch(`${base}/guides?locale=${encodeURIComponent(locale)}`,
      isProd ? { next: { revalidate: 300 } } : { cache: 'no-store' }
    );
    if (!res.ok) return [];
    return (await res.json()) as GuideItem[];
  } catch {
    return [];
  }
}

async function fetchTemplateReadyGuides(locale: string): Promise<GuideSearchItem[]> {
  const base = resolveApiBaseAbsolute();
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const params = new URLSearchParams({ locale, limit: '200' });
    const res = await fetch(`${base}/guides/search?${params.toString()}`,
      isProd ? { next: { revalidate: 300 } } : { cache: 'no-store' }
    );
    if (!res.ok) return [];
    return (await res.json()) as GuideSearchItem[];
  } catch {
    return [];
  }
}

export default async function GuideList({ locale }: { locale: string }) {
  // Site quality policy:
  // - For /en/guides, hide entries without templates (avoid "No template yet" directory noise).
  // - For /zh/guides, keep listing all guides.
  const isEn = locale === 'en';
  const items = isEn ? await fetchTemplateReadyGuides(locale) : await fetchGuides(locale);

  if (!items.length) {
    return (
      <div className="rounded border p-4 text-sm text-slate-600">
        {locale === 'zh' ? '暂无可用指南' : 'No template-ready guides yet.'}
      </div>
    );
  }

  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {items.map((g) => (
        <li key={`${g.locale}:${g.slug}`} className="rounded border p-4">
          <div className="font-medium text-slate-900">{(g as any).title || g.slug}</div>
          <div className="mt-1 text-xs text-slate-500">
            {isEn
              ? ((g as any).template_tier ? `Template: ${(g as any).template_tier}` : 'Template available')
              : [(g as any).guide_type, (g as any).version].filter(Boolean).join(' • ')}
          </div>
          <div className="mt-3">
            <Link href={`/${locale}/guides/${g.slug}`} className="text-sm text-cyan-700 underline hover:text-cyan-900">
              {locale === 'zh' ? '查看' : 'View'}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
