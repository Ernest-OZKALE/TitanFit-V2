import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./design-tokens.css";
import "./luxury-theme.css";
import "./animations.css";
import { AuthProvider } from "@/lib/auth-context";
import { NotificationProvider } from "@/context/NotificationContext";
import { Toolbelt } from "@/components/ui/Toolbelt";
import { CommandCenter } from "@/components/CommandCenter";
import { Toaster } from 'sonner';

import IntlProvider from "@/components/IntlProvider";
import SiteProtection from "@/components/ui/SiteProtection";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import LiquidNoise from "@/components/ui/LiquidNoise";
import QueryProvider from "@/components/QueryProvider";
import TitanFooter from "@/components/layout/TitanFooter";

import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieBanner from "@/components/CookieBanner";
import { ChatWidget } from "@/components/ChatWidget";
import { RewardProvider } from "@/context/RewardContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://titanfit.app'),
  title: {
    default: "TitanFit - Votre Parcours Fitness Elite",
    template: "%s | TitanFit",
  },
  description: "Application fitness premium avec coaching IA, suivi nutritionnel intelligent, et gamification. Atteignez vos objectifs avec TitanFit.",
  keywords: ["fitness", "nutrition", "musculation", "coaching IA", "suivi calories", "prise de masse", "perte de poids", "entraînement"],
  authors: [{ name: "TitanFit Team" }],
  creator: "TitanFit",
  publisher: "TitanFit",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "TitanFit",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "TitanFit",
    title: "TitanFit - Votre Parcours Fitness Elite",
    description: "Application fitness premium avec coaching IA, suivi nutritionnel intelligent, et gamification.",
    images: [
      {
        url: "/dashboard-mock.png",
        width: 1200,
        height: 630,
        alt: "TitanFit Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TitanFit - Votre Parcours Fitness Elite",
    description: "Application fitness premium avec coaching IA.",
    images: ["/dashboard-mock.png"],
  },
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

};

export const viewport: Viewport = {
  themeColor: "#D4AF37",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // App-like feel
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="light" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900 selection:bg-[#D4AF37] selection:text-white`}
      >
        {/* TITAN 2026: GLOBAL STRUCTURED DATA (pSEO BASE) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "TitanFit Systems",
              "url": "https://titanfit.app",
              "logo": "https://titanfit.app/icon.png",
              "sameAs": [
                "https://twitter.com/titanfit",
                "https://instagram.com/titanfit"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-555-5555",
                "contactType": "Customer Support"
              }
            })
          }}
        />
        <GoogleAnalytics />
        <QueryProvider>
          <AuthProvider>
            <RewardProvider>
              <NotificationProvider>
                <IntlProvider>
                  <SiteProtection />
                  <ServiceWorkerRegister />
                  <LiquidNoise />
                  <CommandCenter />
                  {children}
                  <TitanFooter />
                  <Toolbelt />
                  <CookieBanner />
                  <Toaster position="top-center" richColors />
                </IntlProvider>
              </NotificationProvider>
            </RewardProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
