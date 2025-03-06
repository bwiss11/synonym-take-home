import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Autocomplete Equation Editor",
  description: "An autocomplete equation editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{ backgroundColor: "rgb(250, 250, 240)" }}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <div id="portal-root" style={{ position: "relative", zIndex: 9999 }} />
      </body>
    </html>
  );
}
