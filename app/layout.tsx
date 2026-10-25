import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LessGooo — Intelligent Adaptive Travel Companion",
  description: "Personalized itineraries, real-time traffic replanning, transport fare budgeting, expense tracking, and verified guide allotment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#18181B] dark:bg-[#121316] dark:text-[#F4F1EA] transition-colors duration-150">
        {children}
      </body>
    </html>
  );
}
