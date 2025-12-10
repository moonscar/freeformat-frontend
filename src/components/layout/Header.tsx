import Link from 'next/link';

export default function Header({ locale }: { locale: string }) {
  const isZh = locale === 'zh';
  return (
    <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href={`/${locale}/tool`} className="font-semibold tracking-tight">
          FreeFormat · AI Document Formatter
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600">
          <Link prefetch={false} href={`/${locale}/feedback`} className="hover:text-slate-900">
            {isZh ? '反馈' : 'Feedback'}
          </Link>
          <Link prefetch={false} href={`/${locale}/guides`} className="hover:text-slate-900">
            Guides
          </Link>
          <Link prefetch={false} href="/en/guides/apa-org" className="hover:text-slate-900">
            APA
          </Link>
          <Link prefetch={false} href="/en/guides/mla-org" className="hover:text-slate-900">
            MLA
          </Link>
        </nav>
      </div>
    </header>
  );
}
