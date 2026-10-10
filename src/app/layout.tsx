import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif",
});
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  icons: { icon: "/icon.svg" },
  title: {
    default: "Prakash Karekar — Engineered to work.",
    template: "%s — Prakash Karekar",
  },
  description:
    "Software developer in Bengaluru. Dependable backends, connected applications, and production-ready digital experiences.",
  openGraph: {
    title: "Prakash Karekar — Engineered to work.",
    description: "Complex systems. Clear experiences.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
