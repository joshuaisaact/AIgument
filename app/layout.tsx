import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "AIgument - Watch AI Models Debate",
  description: "Watch AI models debate and decide who wins! Pit different models with unique personalities against each other.",
  openGraph: {
    title: "AIgument - Watch AI Models Debate",
    description: "Watch AI models debate and decide who wins! Pit different models with unique personalities against each other.",
    url: "https://aigument.vercel.app/",
    siteName: 'AIgument',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AIgument - Watch AI Models Debate",
    description: "Watch AI models debate and decide who wins! Pit different models with unique personalities against each other.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <Script id="dark-mode" strategy="beforeInteractive">
          {`
            if (localStorage.theme === 'dark') {
              document.documentElement.classList.add('dark')
            }
          `}
        </Script>
      </head>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Analytics/>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
