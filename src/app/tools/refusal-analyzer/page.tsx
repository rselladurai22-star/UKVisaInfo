import type { Metadata } from 'next';
import RefusalAnalyzerClient from './RefusalAnalyzerClient';

const title = 'UK Visa Refusal Analyzer, Decode Your Refusal Letter Free (2026)';
const description = 'Paste your UK visa refusal letter and get a plain-English breakdown of every refusal ground, how serious it is, what it means, and exactly what to do next. Free, private, no signup required.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'UK visa refusal', 'visa rejection reasons UK', 'UK visa refusal letter explained',
    'why was my UK visa refused', 'UK visa refusal grounds', 'paragraph 320 refusal',
    'UK visa appeal', 'visa refusal analyzer', 'decode UK visa refusal',
  ],
  alternates: { canonical: '/tools/refusal-analyzer' },
  openGraph: {
    title, description,
    url: 'https://ukvisainfo.co.uk/tools/refusal-analyzer',
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
    { '@type': 'ListItem', position: 1, name: 'Home',  item: 'https://ukvisainfo.co.uk' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ukvisainfo.co.uk/tools' },
    { '@type': 'ListItem', position: 3, name: 'Refusal Analyzer', item: 'https://ukvisainfo.co.uk/tools/refusal-analyzer' },
  ],
};

export default function RefusalAnalyzerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <RefusalAnalyzerClient />
    </>
  );
}
