import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const viewport: Viewport = {
  themeColor: '#1C0D02',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'GayaSeva — Gaya Ji Local Services, Pick & Drop, Pandits & Stay',
  description: 'Premium, trustworthy, mobile-first local service network for Gaya Ji, Bihar.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icongaya.jpeg',
    shortcut: '/icongaya.jpeg',
    apple: '/icongaya.jpeg',
  },
};

import { LanguageProvider } from '@/context/LanguageContext';
import { LocationProvider } from '@/context/LocationContext';
import { LocationBanner } from '@/components/layout/LocationBanner';
import { StickyActionButtons } from '@/components/layout/StickyActionButtons';
import { QRConciergeModal } from '@/components/ui/QRConciergeModal';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

import { StickyAccessPassBar } from '@/components/ui/StickyAccessPassBar';
import { PopupAd } from '@/components/PopupAd';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#F8F6EF] text-[#4A2E1A] antialiased pb-24 md:pb-16 max-w-full overflow-x-hidden">
        <LanguageProvider>
          <LocationProvider>
            <LocationBanner />
            <Navbar />
            <StickyAccessPassBar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <MobileBottomNav />
            <StickyActionButtons />
            <QRConciergeModal />
            <PWAInstallPrompt />
            <PopupAd />
          </LocationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
