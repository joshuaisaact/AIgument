import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Header } from "./components/layout/Header";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "AIgument - Watch AI Models Debate",
  description: "Watch AI models debate and decide who wins!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="dark-mode" strategy="beforeInteractive">
          {`
            if (localStorage.theme === 'dark') {
              document.documentElement.classList.add('dark')
            }
          `}
        </Script>
      </head>
      <body className={`${geist.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
