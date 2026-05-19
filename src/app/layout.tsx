import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import AppShell from '../components/AppShell';
import AdSenseScript from '../components/AdSenseScript';

const SITE_URL = 'https://ukvisainfo.co.uk';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'UK Visa Info · Types, Eligibility, Costs & Official Links (April 2026)',
    template: '%s · UK Visa Info',
  },
  description:
    'UK Visa Info — the April 2026 guide to UK visa types, eligibility, costs, and official application links. Skilled Worker, Student, Family, Visitor, Graduate, Global Talent and more.',
  applicationName: 'UK Visa Info',
  authors: [{ name: 'UK Visa Info' }],
  keywords: [
    'UK visa', 'UK visa 2026', 'Skilled Worker visa', 'Student visa UK',
    'Family visa UK', 'Graduate visa', 'Global Talent visa', 'Health and Care Worker',
    'UK visa cost', 'UK visa requirements', 'UK visa application', 'IHS', 'eVisa',
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
    title: 'UK Visa Info — April 2026 Guide',
    description:
      'Your April 2026 guide to UK visas: Skilled Worker, Student, Family, Visitor, Graduate, Global Talent and more. Eligibility wizard + cost calculator + guided apply.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK Visa Info — April 2026 Guide',
    description: 'Types, eligibility, costs & guided apply for every UK visa route.',
  },
  robots: { index: true, follow: true },
  verification: {
    google: 'pQMCtigbsU9Fme1xW_J9UqPEbmzm0O7ZX7vifV4kgjA',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
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
    url: SITE_URL,
    description: 'Guide to UK visa types, eligibility, costs and applications — updated April 2026.',
    inLanguage: 'en-GB',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'UK Visa Info',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
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
        <AdSenseScript />
      </head>
      <body>
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
