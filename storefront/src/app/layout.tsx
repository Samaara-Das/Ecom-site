import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kuwait Marketplace",
  description: "Multi-vendor marketplace for Kuwait",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
