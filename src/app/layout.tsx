// src/app/layout.tsx (Whitespace double-checked)

import Link from 'next/link';
import type { Metadata } from "next";
// Make sure this font import matches your project setup (e.g., Inter, Geist Sans)
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Solana Playground", // Customize your site title
  description: "Exploring Solana ideas and projects", // Customize your site description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear(); // Get current year dynamically

  return (
    // Ensure html tag takes full height
    <html lang="en" className="h-full">
      {/*
        The body tag below should start immediately after the html tag above (or comments).
        Ensure there are NO extra spaces or blank lines here that could cause hydration errors.
      */}
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* Header Navigation */}
        <header className="bg-slate-700 text-white p-4 shadow-md">
          <nav className="container mx-auto flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/" className="hover:text-slate-300">Home</Link>
            <Link href="/about" className="hover:text-slate-300">About</Link>
            <Link href="/blog" className="hover:text-slate-300">Blog</Link>
            <Link href="/projects" className="hover:text-slate-300">Projects</Link>
          </nav>
        </header>

        {/* Main page content - flex-grow makes it fill space */}
        <main className="container mx-auto p-4 flex-grow">
          {children}
        </main>

        {/* Footer - mt-auto pushes it down */}
        <footer className="w-full mt-auto py-4 text-center text-sm text-slate-500 border-t border-slate-200 bg-slate-50">
          © {currentYear} smoothbrain.xyz | Made with Next.js
        </footer>
      </body>
    </html>
  );
}