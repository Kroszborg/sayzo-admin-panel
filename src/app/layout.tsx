import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import AppLoader from "@/components/shared/AppLoader";

// Load Inter with all weights needed for the admin panel
const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-sans",
  weight:   ["400", "500", "600", "700", "800"],
  display:  "swap",
});

export const metadata: Metadata = {
  title:       "SAYZO Admin Panel",
  description: "SAYZO platform administration dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <AppLoader />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
