import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";
import "./styles/klass.css";

/* Font design system Klass dimuat lokal dari src/app/fonts supaya tidak
   bergantung jaringan. Nama variabelnya diberi awalan "--font-klass-" agar
   tidak bentrok dengan token tema Tailwind (--font-sans, --font-mono).
   Variabel ini dipakai oleh token di src/app/styles/klass/tokens.css. */
const jakarta = localFont({
  src: "./fonts/plus-jakarta-sans-variabel.ttf",
  variable: "--font-klass-sans",
  weight: "200 800",
  display: "swap",
});

const spaceMono = localFont({
  src: [
    { path: "./fonts/spacemono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/spacemono-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-klass-mono",
  display: "swap",
});

const caveat = localFont({
  src: "./fonts/caveat-latin.woff2",
  variable: "--font-klass-hand",
  weight: "400 700",
  display: "swap",
});

const handjet = localFont({
  src: "./fonts/handjet-latin.woff2",
  variable: "--font-klass-pixel",
  weight: "100 900",
  display: "swap",
});

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

const fontVariables = [
  jakarta.variable,
  spaceMono.variable,
  caveat.variable,
  handjet.variable,
  fontSans.variable,
  fontMono.variable,
].join(" ");

/** Layout paling luar, membungkus semua halaman. Pemilik: Aqil. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
