import type { Metadata } from 'next';
import CommunityClient from './CommunityClient';

const title = 'UK Visa Community — Ask Questions, Share Experiences (Free)';
const description = 'Join thousands of UK visa applicants. Ask questions, read answers, get notified of rule changes. Free WhatsApp & Telegram channels + Q&A forum. No lawyers, just real experiences.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'UK visa community', 'UK visa questions forum', 'UK visa WhatsApp group',
    'UK visa Telegram channel', 'UK visa help', 'UK immigration forum',
    'ask UK visa questions', 'UK visa experiences', 'UK visa updates alerts',
  ],
  alternates: { canonical: '/community' },
  openGraph: {
    title, description,
    url: 'https://ukvisainfo.co.uk/community',
    type: 'website',
    images: [{ url: 'https://ukvisainfo.co.uk/opengraph-image', width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: 'summary_large_image', title, description,
    images: ['https://ukvisainfo.co.uk/opengraph-image'],
  },
};

const breadcrumb = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ukvisainfo.co.uk' },
    { '@type': 'ListItem', position: 2, name: 'Community', item: 'https://ukvisainfo.co.uk/community' },
  ],
};

export default function CommunityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <CommunityClient />
    </>
  );
}
