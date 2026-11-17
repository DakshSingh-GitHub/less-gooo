import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LessGooo — Intelligent Adaptive Travel Companion",
  description: "Personalized itineraries, real-time traffic replanning, transport fare budgeting, expense tracking, and verified guide allotment.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

const themeScript = `
(function() {
  try {
    var key = 'lessgooo-theme';
    var keyAlt = 'lessgooo_theme';
    var saved = localStorage.getItem(key) || localStorage.getItem(keyAlt);
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = saved === 'dark' || (!saved && prefersDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#18181B] dark:bg-[#121316] dark:text-[#F4F1EA]">
        {children}
      </body>
    </html>
  );
}
