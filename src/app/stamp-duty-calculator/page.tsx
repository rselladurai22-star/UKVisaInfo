import type { Metadata } from 'next';
import SdltClient from './SdltClient';
import FaqJsonLd from '../../components/calc-shell/FaqJsonLd';
import { primaryEditorSchema } from '../../data/editorialTeam';

export const metadata: Metadata = {
  title: 'UK Stamp Duty Calculator 2026 — SDLT, LBTT, LTT',
  description:
    'The most precise UK Stamp Duty calculator. Live SDLT, LBTT, LTT across every UK buyer scenario.',
  alternates: { canonical: '/stamp-duty-calculator' },
  openGraph: {
    title: 'UK Stamp Duty Calculator 2026',
    description: 'SDLT, LBTT, LTT with what-if scenarios.',
    url: 'https://ukvisainfo.co.uk/stamp-duty-calculator',
    type: 'article',
  },
};

const FAQS = [
  { q: 'What is a first-time buyer?', a: 'Someone who has never owned a residential property anywhere in the world, alone or jointly.' },
  { q: 'When is SDLT due?', a: 'Within 14 days of completion in England and NI; 30 days for LBTT (Scotland) and LTT (Wales).' },
  { q: 'Can I claim back the additional-property surcharge?', a: 'Yes — if you sell your previous main residence within 36 months you can apply for a full refund.' },
];

export default function Page() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ukvisainfo.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Stamp Duty calculator', item: 'https://ukvisainfo.co.uk/stamp-duty-calculator' },
    ],
  };
  const webAppJsonLd = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'UK Stamp Duty Calculator',
    url: 'https://ukvisainfo.co.uk/stamp-duty-calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
    author: primaryEditorSchema('https://ukvisainfo.co.uk'),
    publisher: { '@type': 'Organization', name: 'UKDesk', url: 'https://ukvisainfo.co.uk' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <FaqJsonLd faqs={FAQS} />
      <SdltClient initialPrice={350000} />
    </>
  );
}
