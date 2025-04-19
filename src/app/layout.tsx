// src/app/layout.tsx (Ensuring html and body tags are present)

import Link from 'next/link';
import type { Metadata } from "next";
// Make sure this font import matches your project setup (e.g., Inter, Geist Sans)
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smoothbrain XYZ Playground", // Updated Title
  description: "Exploring Solana ideas and projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    // --- Root HTML tag MUST be here ---
    <html lang="en" className="h-full">
      {/* --- Body tag MUST be here, wrapping content --- */}
      <body className={`${inter.className} flex flex-col min-h-screen`}>

        {/* Header Navigation */}
        <header className="bg-slate-800 text-white shadow-md sticky top-0 z-10">
          <div className="container mx-auto flex flex-wrap items-center justify-between p-4">
            <Link href="/" className="text-xl font-bold hover:text-slate-300 transition-colors">
              smoothbrain.xyz
            </Link>
            <nav className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1 items-center">
              <Link href="/" className="hover:text-slate-300 transition-colors text-sm sm:text-base">Home</Link>
              <Link href="/about" className="hover:text-slate-300 transition-colors text-sm sm:text-base">About</Link>
              <Link href="/blog" className="hover:text-slate-300 transition-colors text-sm sm:text-base">Blog</Link>
              <Link href="/projects" className="hover:text-slate-300 transition-colors text-sm sm:text-base">Projects</Link>
            </nav>
          </div>
        </header>

        {/* Main page content */}
        <main className="container mx-auto p-4 flex-grow">
          {children} {/* This renders your page.tsx content */}
        </main>

        {/* Footer */}
        <footer className="w-full mt-auto py-4 text-center text-sm text-slate-500 border-t border-slate-200 bg-slate-50">
          © {currentYear} smoothbrain.xyz | Made with Next.js
        </footer>

      </body>
      {/* --- Closing Body tag --- */}
    </html>
    // --- Closing HTML tag ---
  );
}