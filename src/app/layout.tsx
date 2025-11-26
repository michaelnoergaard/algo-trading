import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlgoTrade Pro - Advanced Algorithmic Trading Platform",
  description: "Modern algorithmic trading platform with strategy editor and backtesting capabilities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
