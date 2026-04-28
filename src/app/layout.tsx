import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import AppShell from '../components/AppShell';

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
  alternates: { canonical: '/' },
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
      { url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23000613'/><stop offset='1' stop-color='%23001f3f'/></linearGradient></defs><rect width='64' height='64' rx='14' fill='url(%23g)'/><path d='M12 26 L32 12 L52 26' stroke='%23bb0027' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/><rect x='17' y='26' width='4' height='20' fill='white'/><rect x='25' y='26' width='4' height='20' fill='white'/><rect x='35' y='26' width='4' height='20' fill='white'/><rect x='43' y='26' width='4' height='20' fill='white'/><rect x='12' y='46' width='40' height='4' rx='1' fill='%23bb0027'/><circle cx='32' cy='20' r='2' fill='%23bb0027'/></svg>", type: 'image/svg+xml' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#000613',
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
      </head>
      <body>
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
