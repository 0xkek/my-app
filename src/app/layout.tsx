// src/app/layout.tsx (Using Outfit font and text-lg)

import type { Metadata } from "next";
// --- Import Outfit font ---
import { Outfit } from "next/font/google";
// --------------------------
import "./globals.css";
import { Providers } from './providers';
import { SiteHeader } from './components/SiteHeader';

// --- Configure Outfit ---
const outfit = Outfit({ subsets: ["latin"] });
// ------------------------

export const metadata: Metadata = {
  title: "Smoothbrain XYZ Playground",
  description: "Exploring Solana ideas and projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" className="h-full">
      {/* --- Apply Outfit font class name & text-lg --- */}
      <body className={`${outfit.className} flex flex-col min-h-screen text-slate-900 dark:text-slate-200 text-lg`}>
      {/* -------------------------------------------- */}
        <Providers>
          <SiteHeader />
          <main className="container mx-auto p-4 flex-grow">
            {children}
          </main>
          <footer className="w-full mt-auto py-4 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            © {currentYear} smoothbrain.xyz | Made with Next.js
          </footer>
        </Providers>
      </body>
    </html>
  );
}