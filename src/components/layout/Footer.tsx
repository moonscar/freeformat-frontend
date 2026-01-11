import Link from 'next/link';

export default function Footer({ locale }: { locale: string }) {
  const isZh = locale === 'zh';
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>© FreeFormat · AI Document Formatter 2025</div>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/about`} className="hover:text-slate-900">
              {isZh ? '关于' : 'About'}
            </Link>
            <Link href={`/${locale}/devlog`} className="hover:text-slate-900">
              {isZh ? '开发日志' : 'Dev log'}
            </Link>
            <Link href={`/${locale}/support`} className="hover:text-slate-900">
              {isZh ? '支持' : 'Support'}
            </Link>
            <Link href={`/${locale}/privacy`} className="hover:text-slate-900">
              {isZh ? '隐私' : 'Privacy'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
