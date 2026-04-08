import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FeedMind — AI Learning Feed",
  description: "Personal AI-powered daily learning feed. 100% free, runs locally.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        {/* ── Nav ── */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-blue-600 text-lg">
              🧠 FeedMind
            </Link>
            <nav className="flex gap-6 text-sm font-medium text-slate-600">
              <Link href="/" className="hover:text-blue-600 transition-colors">Feed</Link>
              <Link href="/chat" className="hover:text-blue-600 transition-colors">💬 Chat</Link>
              <Link href="/history" className="hover:text-blue-600 transition-colors">History</Link>
              <Link href="/topics" className="hover:text-blue-600 transition-colors">Topics</Link>
            </nav>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
