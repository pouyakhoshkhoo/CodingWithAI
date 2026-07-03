import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Verified Property Marketplace',
  description: 'Manual-first verified property listings with سند رسمی and کارت ملی review.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <nav className="nav">
          <Link className="brand" href="/">بازار ملک معتبر</Link>
          <div className="navlinks">
            <Link href="/listings">آگهی‌های تایید شده</Link>
            <Link href="/submit">ثبت ملک</Link>
            <Link href="/owner">پنل مالک</Link>
            <Link href="/admin">پنل ادمین</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
