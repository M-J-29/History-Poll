import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travel Back in Time — Poll",
  description: "Vote for the historical era you'd travel back to.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        {children}
      </body>
    </html>
  );
}
