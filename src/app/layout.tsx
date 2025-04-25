// src/app/layout.tsx (Full Dark Theme Base - Corrected)
import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Using Outfit font
import "./globals.css"; // Ensure Tailwind base styles are included
import { Providers } from './providers'; // Ensure correct path: ./providers
import { SiteHeader } from './components/SiteHeader'; // Ensure correct path: ./components/SiteHeader

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "sendbox.fun",
  description: "Exploring Solana ideas and projects",
  // Use the correct logo filename relative to /public
  icons: { icon: '/full-logo-black-bg-black-e.png' }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const currentYear = new Date().getFullYear();
  return (
    // Ensure html tag takes full height for background to apply
    <html lang="en" className="h-full">
      {/* Apply dark theme base directly to body */}
      {/* Added !important prefixes as a fallback if overrides occur, though usually not needed */}
      <body className={`${outfit.className} flex flex-col min-h-screen !bg-black !text-slate-300 text-lg`}>
        <Providers>
          <SiteHeader />
          {/* Main content area grows to fill space */}
          <main className="flex-grow">
            {children} {/* Pages will handle their own containers/padding */}
          </main>
          {/* Footer styling adjusted for dark theme */}
          <footer className="w-full mt-auto py-4 text-center text-sm text-slate-500 border-t border-slate-800 bg-gray-950"> {/* Darker footer bg/border */}
            © {currentYear} sendbox.fun | Made with Next.js
          </footer>
        </Providers>
      </body>
    </html>
  );
}
