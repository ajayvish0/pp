import type { Metadata } from "next";
import { Inter, Playfair_Display, DM_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${dmMono.variable} antialiased font-sans flex flex-col min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Navbar />
          {/*
            - md:pt-[56px]  → matches the desktop navbar height exactly, so hero content starts right below it
            - pb-28 md:pb-0 → on mobile, prevents content hiding behind the bottom dock (dock is ~80px + 24px gap)
          */}
          <main className="flex-1 ">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}