import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "iPlayable AI Studio",
  description: "AI-first platform for HTML5 playable ads"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-background text-foreground">
          <Sidebar />
          <main className="h-screen flex-1 overflow-hidden">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
