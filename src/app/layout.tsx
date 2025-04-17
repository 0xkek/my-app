// src/app/layout.tsx

import Link from 'next/link'; // <--- IMPORT THE LINK COMPONENT HERE
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Or Geist Sans, depending on your setup
import "./globals.css";

const inter = Inter({ subsets: ["latin"] }); // Or const geist = GeistSans(...) etc.

export const metadata: Metadata = {
  title: "My Solana Playground", // You can change the default title here
  description: "Exploring Solana ideas", // And the description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* The font class might be on <html> or <body> depending on your setup */}
      <body className={inter.className}> {/* Or geist.className */}

        {/* START: Add Simple Header Navigation */}
        <header className="bg-slate-700 text-white p-4 shadow-md"> {/* Basic Styling */}
          <nav className="container mx-auto flex gap-6"> {/* Adjust spacing with gap-x */}
            <Link href="/" className="hover:text-slate-300">
              Home
            </Link>
            <Link href="/about" className="hover:text-slate-300">
              About
            </Link>
            {/* We can add a link to a 'Projects' page here later */}
          </nav>
        </header>
        {/* END: Simple Header Navigation */}

        {/* The main content of your current page (e.g., page.tsx or about/page.tsx) renders here */}
        {/* We wrap `children` in a main tag semantically */}
        <main className="container mx-auto p-4"> {/* Add padding around page content */}
          {children}
        </main>

        {/* You could add a persistent footer here too if needed */}
        {/* <footer className="text-center mt-8 p-4 text-gray-500 border-t">Site Footer</footer> */}

      </body>
    </html>
  );
}