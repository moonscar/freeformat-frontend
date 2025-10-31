import Link from 'next/link';

export default function Header({ locale }: { locale: string }) {
  return (
    <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href={`/${locale}`} className="font-semibold tracking-tight">
          AI Formatter
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600">
          <Link href={`/${locale}/tool`} className="hover:text-slate-900">
            Tool
          </Link>
          <Link href={`/${locale}/templates`} className="hover:text-slate-900">
            Templates
          </Link>
        </nav>
      </div>
    </header>
  );
}

