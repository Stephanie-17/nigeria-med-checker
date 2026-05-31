import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "NaijaMed Checker | Nigerian Symptom & Drug Interaction Guide",
  description: "Check drug-to-drug interactions, find local brand name equivalents, understand symptoms with a Nigerian context, and learn to verify NAFDAC codes. Safe self-medication guidance.",
  openGraph: {
    title: "NaijaMed Checker | Safe Drug & Symptom Checker",
    description: "Built with Nigerian drug availability in mind. Check interactions, look up local brand names, verify fake drugs.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
