import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "jotai";
import { UserInit } from "@/components/user-init";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Duolingo - Learn Languages",
  description: "Learn languages with fun, bite-sized lessons",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 max-w-7xl mx-auto w-full px-4">
            <Provider>
              <UserInit />
              {children}
              <Toaster />
            </Provider>
          </div>
        </div>
      </body>
    </html>
  );
}
