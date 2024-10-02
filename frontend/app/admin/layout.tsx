'use client';

import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import AdminSidebar from "@/components/Sidebar/AdminSidebar"

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={inter.className}>
            <div style={{ display: 'flex' }}>
              <AdminSidebar />
              <main style={{ flex: 1 }}>{children}</main>
            </div>
        </body>
      </html>
    </SessionProvider>
  );
}