// src/app/layout.tsx (Reduced Footer Height)
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
  icons: { icon: '/e-logo-yellow-square-white-e.png' }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const currentYear = new Date().getFullYear();
  return (
    // Ensure html tag takes full height for background to apply
    <html lang="en" className="h-full">
      {/* Apply dark theme base directly to body */}
      <body className={`${outfit.className} flex flex-col min-h-screen !bg-neutral-900 !text-slate-200 text-lg`}>
        <Providers>
          <SiteHeader />
          {/* Main content area grows to fill space */}
          <main className="flex-grow">
            {children} {/* Pages will handle their own containers/padding */}
          </main>

          {/* --- Footer with Reduced Padding/Margin --- */}
          <footer className="w-full mt-auto py-2 bg-gradient-to-r from-[#452a05] to-stone-900 border-t border-[#FFAE00]/30 text-center text-sm text-slate-400"> {/* Changed py-4 to py-2 */}
            <div className="container mx-auto px-4">
              <p>© {currentYear} sendbox.fun | Made with Next.js</p>
              {/* Changed mt-2 to mt-1 */}
              <div className="mt-1">
                <a href="#" className="text-[#FFAE00]/80 hover:text-[#FFAE00] mx-2 transition-colors">Terms</a>
                <a href="#" className="text-[#FFAE00]/80 hover:text-[#FFAE00] mx-2 transition-colors">Privacy</a>
              </div>
            </div>
          </footer>
          {/* --- End Footer --- */}

        </Providers>
      </body>
    </html>
  );
}
