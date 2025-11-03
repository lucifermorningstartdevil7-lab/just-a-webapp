  import type { Metadata } from "next";
  import { Inter } from "next/font/google";
  import "./globals.css";

  const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: "LinkTrim - Your clean link-in-bio",
    description: "Build a beautiful, sharable page for your socials or projects. Simple, fast, and designed for creators.",
    icons: {
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🔗</text></svg>',
    },
  };

  const inter = Inter({subsets: ['latin'], variable: '--font-inter', display: 'swap'})


  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`}>
            {children}
        </body>
      </html>
    );
  }
