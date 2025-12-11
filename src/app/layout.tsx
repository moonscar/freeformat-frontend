import '../styles/globals.css';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body className="min-h-screen bg-gradient-to-br from-[#f6f8ff] via-[#fef7f2] to-[#f0fbff] text-slate-900 antialiased">
        {children}
        <VercelAnalytics />
      </body>
    </html>
  );
}
