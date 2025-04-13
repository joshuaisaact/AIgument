import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "arGPTment - Watch AI Models Debate",
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
      <body className={`${geist.variable} antialiased`}>{children}</body>
    </html>
  );
}
