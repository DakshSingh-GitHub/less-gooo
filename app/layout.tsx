import type { Metadata } from "next";
import {
  Bodoni_Moda,
  Cormorant_Garamond,
  DM_Sans,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LessGooo — Adaptive Travel Atlas & Field Companion",
  description:
    "The journey is yours. The unexpected is ours to navigate. Living itineraries, Varanasi spatial cartography, local transit fare transparency, tactile expense journals, and verified human companionship.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${cormorantGaramond.variable} ${dmSans.variable} ${ibmPlexMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#18181B] dark:bg-[#0A0D14] dark:text-[#F3EEE5] font-sans transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
