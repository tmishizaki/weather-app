import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "天気予報（SSR+Tailwind）",
  description: "Next.js SSR Weather Sample with Tailwind v4",
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div className="mx-auto max-w-4xl p-4 md:p-6">
          <header className="mb-6 flex items-end justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight">天気予報（SSR + 当日キャッシュ）</h1>
            <Link
              href="/"
              className="btn-ghost"
              aria-label="ホームへ"
            >
              ホーム
            </Link>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}