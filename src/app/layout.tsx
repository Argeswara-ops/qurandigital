import "./globals.css";
import type { Metadata } from "next";
import { Amiri, Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "EQuran.id - Al-Quran Digital",
  description: "Platform Al-Quran digital Indonesia berbasis API EQuran.id",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${amiri.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="min-h-screen bg-[var(--color-darkbg)] text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
