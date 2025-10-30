import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import FooterGuard from "@/components/layout/FooterGuard";
import ReduxProvider from "@/providers/ReduxProvider";
import ThemeProvider from "@/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glorta — Link Kısaltma ve Kazanç Platformu",
  description: "Uzun linklerini saniyeler içinde kısalt, akıllı yönlendirme ve gelişmiş analitikle performansı ölç. Glorta ile linklerinden kazanç elde et.",
  icons: {
    icon: [
      { url: "/AppImage/browser_logo.png?v=3", type: "image/png" },
    ],
    shortcut: [
      { url: "/AppImage/browser_logo.png?v=3", type: "image/png" },
    ],
    apple: [
      { url: "/AppImage/browser_logo.png?v=3", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <link rel="icon" href="/AppImage/browser_logo.png?v=3" type="image/png" />
        <link rel="shortcut icon" href="/AppImage/browser_logo.png?v=3" type="image/png" />
        <link rel="apple-touch-icon" href="/AppImage/browser_logo.png?v=3" />
        <meta name="theme-color" content="#0b5cff" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden` }>
        <ReduxProvider>
          <ThemeProvider>
            <Navbar />
            {children}
            <FooterGuard />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
