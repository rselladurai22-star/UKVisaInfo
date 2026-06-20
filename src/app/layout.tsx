import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import AppShell from '../components/AppShell';
import AdSenseScript from '../components/AdSenseScript';
import ConsentInit from '../components/ConsentInit';
import GoogleAnalytics from '../components/GoogleAnalytics';
import { PRIMARY_EDITOR, primaryEditorSchema } from '../data/editorialTeam';
import { Inter, Hanken_Grotesk, JetBrains_Mono, Lora } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-grotesk',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
});

const SITE_URL = 'https://ukvisainfo.co.uk';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'UKDesk — UK Tools, Calculators & Guides for Money, Property, Visas',
    template: '%s · UKDesk',
  },
  description:
    'UKDesk — free UK calculators and lookups in one place. Take-home pay, mortgage, stamp duty, council tax, postcode super-lookup, every UK visa route. Verified against gov.uk, HMRC and ONS.',
  applicationName: 'UKDesk',
  authors: [
    { name: PRIMARY_EDITOR.name, url: `${SITE_URL}${PRIMARY_EDITOR.profileUrl}` },
    { name: 'UKDesk', url: SITE_URL },
  ],
  creator: PRIMARY_EDITOR.name,
  publisher: 'UKDesk',
  category: 'Reference & Utilities',
  keywords: [
    'UK take-home pay', 'UK mortgage calculator', 'UK stamp duty 2026', 'UK council tax band',
    'UK postcode lookup', 'cost of living UK', 'UK salary calculator', 'PAYE calculator',
    'UK visa 2026', 'Skilled Worker visa UK', 'Student visa UK', 'Family visa UK',
    'UK utility tools', 'UK calculators', 'gov.uk verified', 'HMRC 2026/27',
    'UK life admin', 'moving to UK', 'living in UK', 'British calculators',
  ],
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': '/rss.xml' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: 'UKDesk',
    title: 'UKDesk — Every UK Tool, Calculator and Guide in One Place',
    description:
      'Free UK calculators and lookups: take-home pay, mortgage, stamp duty, council tax, postcode, every visa route. Verified against gov.uk, HMRC and ONS.',
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200, height: 630,
        alt: 'UKDesk — UK tools & calculators',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ukdesk',
    title: 'UKDesk — Every UK Tool, Calculator and Guide',
    description: 'Free UK calculators and lookups: pay, mortgage, SDLT, council tax, postcode, visas. 100% gov.uk sourced.',
    images: [`${SITE_URL}/opengraph-image`],
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
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'UKDesk',
    alternateName: 'ukvisainfo.co.uk',
    url: SITE_URL,
    description: 'Free UK calculators and lookups in one place — take-home pay, mortgage, stamp duty, council tax, postcode, every visa route. Verified against gov.uk, HMRC and ONS.',
    inLanguage: 'en-GB',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/tools?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
  const editorJsonLd = primaryEditorSchema(SITE_URL);
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#org`,
    name: 'UKDesk',
    legalName: 'UKDesk',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon.svg`,
      width: 64, height: 64,
    },
    sameAs: [
      'https://www.reddit.com/r/ukvisa',
    ],
    email: 'contact@ukvisainfo.co.uk',
    founder: editorJsonLd,
    employee: [editorJsonLd],
    publishingPrinciples: `${SITE_URL}/editorial-policy`,
    knowsAbout: PRIMARY_EDITOR.expertise,
    areaServed: 'GB',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'editorial',
        email: 'contact@ukvisainfo.co.uk',
        availableLanguage: 'English',
        areaServed: 'GB',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'privacy',
        email: 'privacy@ukvisainfo.co.uk',
        availableLanguage: 'English',
        areaServed: 'GB',
      },
    ],
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    ],
  };

  return (
    <html lang="en-GB" className={`${inter.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} ${lora.variable}`}>
      <head>
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', ...editorJsonLd }) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <ConsentInit />
        <AdSenseScript />
        <GoogleAnalytics />
      </head>
      <body>
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
