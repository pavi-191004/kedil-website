import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import ScrollAnimations from "@/components/ScrollAnimations";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Kedil — Financial Clarity",
  description:
    "Kedil gives you a clear picture of your money. Track spending, plan budgets, and grow your wealth — all in one place.",
  metadataBase: new URL("https://www.kedil.money"),
  openGraph: {
    title: "Kedil — Financial Clarity",
    description: "Track spending, plan budgets, and grow your wealth.",
    url: "https://www.kedil.money",
    siteName: "Kedil",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className="font-sans bg-white text-gray-900 antialiased">
        <NavbarWrapper />
        <ScrollAnimations />
        {children}
      </body>
    </html>
  );
}
