import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Advent Calendar',
  description: 'Create and share your advent calendar',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-white/10">
          <div className="container flex items-center justify-between">
            <a href="/" className="font-semibold">Advent Calendar</a>
            <nav className="text-sm">
              <a className="hover:underline" href="/create">Create</a>
            </nav>
          </div>
        </header>
        <main className="container py-6">{children}</main>
        <footer className="container border-t border-white/10 mt-8 pt-4 text-xs text-white/70">
          Built with Next.js • Deploy to Vercel
        </footer>
      </body>
    </html>
  );
}
