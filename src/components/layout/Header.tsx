import Link from 'next/link';

export default function Header({ locale }: { locale: string }) {
  return (
    <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href={`/${locale}`} className="font-semibold tracking-tight">
          FreeFormat · AI Document Formatter
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600">
          <Link prefetch={false} href={`/${locale}/tool`} className="hover:text-slate-900">Tool</Link>
          <Link prefetch={false} href={`/${locale}/guides`} className="hover:text-slate-900">Guides</Link>
          <Link prefetch={false} href={`/${locale}/guides/apa-format`} className="hover:text-slate-900">APA</Link>
          <Link prefetch={false} href={`/${locale}/guides/mla-format`} className="hover:text-slate-900">MLA</Link>
        </nav>
      </div>
    </header>
  );
}
