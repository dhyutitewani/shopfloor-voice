import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar/Sidebar"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "suggestions",
  description: "created to collect suggestions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main style={{ flex: 1 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}