import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import FloatingButtons from "@/components/FloatingButtons";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Printing House | Professional Printing Services",
  description: "High quality printing services for your business needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <FloatingButtons />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
