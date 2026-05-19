import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import AppShell from '../components/AppShell';
import AdSenseScript from '../components/AdSenseScript';

const SITE_URL = 'https://ukvisainfo.co.uk';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'UK Visa Info · Types, Eligibility, Costs & Official Links (2026)',
    template: '%s · UK Visa Info',
  },
  description:
    'UK Visa Info — plain-English guide to every UK visa route for 2026. Skilled Worker, Student, Family, Visitor, Graduate, Global Talent and more. Free eligibility quiz, cost calculator and 100% gov.uk sourced.',
  applicationName: 'UK Visa Info',
  authors: [{ name: 'UK Visa Info', url: SITE_URL }],
  creator: 'UK Visa Info',
  publisher: 'UK Visa Info',
  category: 'Immigration & Visas',
  keywords: [
    'UK visa', 'UK visa 2026', 'Skilled Worker visa UK', 'Student visa UK',
    'Family visa UK', 'Graduate visa UK', 'Global Talent visa', 'Health and Care Worker visa',
    'UK visa cost calculator', 'UK visa requirements', 'UK visa application', 'IHS surcharge',
    'eVisa UK', 'UK immigration', 'UK visa eligibility', 'UK visa guide', 'apply for UK visa',
    'UK visa fees 2026', 'sponsor licence UK', 'ILR UK', 'settlement UK',
  ],
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': '/rss.xml' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: 'UK Visa Info',
    title: 'UK Visa Info — 2026 Guide to Every UK Visa Route',
    description:
      'Plain-English guidance on every UK visa route — eligibility, fees, processing times and official application links. Free tools: eligibility quiz, salary checker, cost calculator.',
    images: [
      {
        url: `${SITE_URL}/og-default.png`,
        width: 1200, height: 630,
        alt: 'UK Visa Info — 2026 Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ukvisainfo',
    title: 'UK Visa Info — 2026 Guide to Every UK Visa Route',
    description: 'Plain-English guide to every UK visa. Free eligibility quiz, cost calculator, salary checker — 100% gov.uk sourced.',
    images: [`${SITE_URL}/og-default.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: 'pQMCtigbsU9Fme1xW_J9UqPEbmzm0O7ZX7vifV4kgjA',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/icon.svg',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#06192E',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'UK Visa Info',
    alternateName: 'ukvisainfo.co.uk',
    url: SITE_URL,
    description: 'Plain-English guide to every UK visa route — eligibility, fees, processing times and official links. Updated May 2026.',
    inLanguage: 'en-GB',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/tools/sponsor-search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'UK Visa Info',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon.svg`,
      width: 64, height: 64,
    },
    sameAs: [
      'https://www.reddit.com/r/ukvisa',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: 'English',
    },
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    ],
  };

  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <AdSenseScript />
      </head>
      <body>
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
