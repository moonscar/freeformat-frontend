import type { Metadata } from 'next';
import '../../styles/globals.css';

export const metadata: Metadata = {
  title: 'AI Formatter – 一键论文格式化',
  description: '按高校规范自动排版中文/英文论文，支持标题、摘要、脚注等。',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'AI Formatter – 一键论文格式化',
    description: '按高校规范自动排版中文/英文论文',
    url: 'https://your-domain.com',
    siteName: 'AI Formatter',
    locale: 'zh_CN',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className="min-h-screen bg-gradient-to-br from-[#f6f8ff] via-[#fef7f2] to-[#f0fbff] text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
