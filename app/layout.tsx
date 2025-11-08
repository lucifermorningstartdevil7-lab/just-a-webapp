  import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";

  const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: "ClickSprout.to",
    description: "Build a beautiful, sharable page for your socials or projects. Simple, fast, and designed for creators.",
    icons: {
      icon: '/logo.png',
    },
  };

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en" className="font-system" suppressHydrationWarning>
        <body className="antialiased">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </body>
      </html>
    );
  }
