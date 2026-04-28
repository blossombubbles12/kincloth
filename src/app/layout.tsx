import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { RecentViewedProvider } from "@/lib/recent-viewed-context";
import { FavouritesProvider } from "@/lib/favourites-context";
import { ToastProvider } from "@/components/ToastContainer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HeartAnimationProvider } from "@/components/HeartAnimation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://scrollcommerce.store";
const SITE_NAME = "Chiangel";
const SITE_DESCRIPTION =
  "Chiangel — Discover curated premium products with a TikTok-style scroll feed. New drops every week — Shop the Feed.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Shop the Feed`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "online store", "premium products", "shop online",
    "new arrivals", "trending products", "e-commerce",
    "fashion", "lifestyle", "curated collection",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "shopping",
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Shop the Feed`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Shop the Feed`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@chiangel",
    creator: "@chiangel",
    title: `${SITE_NAME} | Shop the Feed`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon-32x32.png",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    // google: "your-google-search-console-token",
    // yandex: "your-yandex-token",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full overflow-hidden`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <FavouritesProvider>
            <CartProvider>
              <RecentViewedProvider>
                <ToastProvider>
                  <HeartAnimationProvider>
                    {children}
                  </HeartAnimationProvider>
                </ToastProvider>
              </RecentViewedProvider>
            </CartProvider>
          </FavouritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
