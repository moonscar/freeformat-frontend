import '../styles/globals.css';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
        <VercelAnalytics />
      </body>
    </html>
  );
}
