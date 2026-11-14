import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const fontSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Klass",
    template: "%s | Klass",
  },
  description: "Satu tempat untuk materi, jadwal, dan tugas kelasmu.",
};

/** Layout paling luar, membungkus semua halaman. Pemilik: Aqil. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
