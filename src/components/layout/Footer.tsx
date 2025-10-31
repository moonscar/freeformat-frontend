import Link from 'next/link';

export default function Footer({ locale }: { locale: string }) {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>© AI Formatter 2025</div>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/privacy`} className="hover:text-slate-900">
              Privacy
            </Link>
            <Link href={`/${locale}/templates`} className="hover:text-slate-900">
              Templates
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

