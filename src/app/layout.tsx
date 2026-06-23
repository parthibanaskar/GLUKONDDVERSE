import React from 'react';
import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Fraunces } from 'next/font/google';
import Script from 'next/script';
import { CapoProvider } from '@/context/CapoContext';
import FretWrapper from '@/components/FretWrapper';
import SecurityShield from '@/components/SecurityShield';
import '@/styles/tailwind.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "GlukonddVerse — Parthiba's Multiverse Portfolio",
  description: 'Web Developer, Cinematographer, and Musician. A dimension-shifting portfolio.',
  openGraph: {
    title: 'GlukonddVerse',
    description: "Parthiba's Multiverse Portfolio.",
    url: '/',
    siteName: 'GlukonddVerse',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GlukonddVerse',
    description:
      "Parthiba's Multiverse Portfolio. Explore dimensions of Engineering, Cinema, and Sound.",
    images: ['/og-image.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Parthiba',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  jobTitle: ['Web Developer', 'Cinematographer', 'Musician'],
  sameAs: ['https://twitter.com/glukondd', 'https://github.com/glukondd'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${fraunces.variable}`}>
      <body className="antialiased selection:bg-white/20">
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="beforeInteractive"
        />
        <SecurityShield />

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:font-mono focus:text-xs focus:tracking-widest focus:uppercase focus:outline-none"
        >
          Skip to content
        </a>

        <CapoProvider>
          <FretWrapper>{children}</FretWrapper>
        </CapoProvider>
      </body>
    </html>
  );
}
