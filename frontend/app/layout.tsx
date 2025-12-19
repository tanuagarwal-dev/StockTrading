import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Zerodha Clone - Stock Trading Platform",
    template: "%s | Zerodha Clone",
  },
  description:
    "Online platform to invest in stocks, derivatives, mutual funds, and more. Trade with zero brokerage on equity delivery.",
  keywords: [
    "stock trading",
    "zerodha",
    "invest",
    "mutual funds",
    "derivatives",
    "NSE",
    "BSE",
  ],
  authors: [{ name: "Zerodha Clone" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://zerodha-clone.com",
    siteName: "Zerodha Clone",
    title: "Zerodha Clone - Stock Trading Platform",
    description:
      "Online platform to invest in stocks, derivatives, mutual funds, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zerodha Clone - Stock Trading Platform",
    description:
      "Online platform to invest in stocks, derivatives, mutual funds, and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
