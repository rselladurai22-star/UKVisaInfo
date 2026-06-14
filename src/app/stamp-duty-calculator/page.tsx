import type { Metadata } from 'next';
import StampDuty from './StampDuty';
import FaqJsonLd from '../../components/calc-shell/FaqJsonLd';

export const metadata: Metadata = {
  title: 'Stamp Duty Calculator 2025/26 — SDLT for England & NI | UKDesk',
  description:
    'Free UK Stamp Duty (SDLT) calculator on 2025/26 rates. First-time buyer relief, the 5% additional-property surcharge and 2% non-resident surcharge, with a full band-by-band breakdown and worked examples.',
  alternates: { canonical: '/stamp-duty-calculator' },
  openGraph: {
    title: 'Stamp Duty Calculator 2025/26 — SDLT for England & NI',
    description: 'Calculate SDLT with first-time buyer relief and surcharges, plus a full band breakdown.',
    url: 'https://ukvisainfo.co.uk/stamp-duty-calculator',
    type: 'article',
  },
};

const FAQS = [
  { q: 'Can I add stamp duty to my mortgage?', a: 'Not directly — SDLT is due in cash within 14 days of completion. You could borrow slightly more against the property, but most buyers budget for it as an upfront cash cost alongside the deposit and legal fees.' },
  { q: 'Do first-time buyers pay any stamp duty?', a: 'Not on the first £300,000, then 5% on the portion to £500,000. Above a £500,000 purchase price the relief is lost entirely and standard rates apply to the whole amount.' },
  { q: 'I own a buy-to-let and am buying a home to live in — do I pay the surcharge?', a: 'If you are not replacing a main residence and will own two or more properties at completion, the 5% additional-property surcharge applies to the new purchase.' },
  { q: 'Is stamp duty different in Scotland and Wales?', a: 'Yes. Scotland charges LBTT and Wales charges LTT, each with its own bands and additional-dwelling supplement. This tool covers SDLT for England and Northern Ireland only.' },
  { q: 'Can I reclaim the higher-rate surcharge?', a: 'If you paid the surcharge because you had not yet sold your previous main home, you can usually reclaim it if you sell that home within 36 months — normally claimed within 12 months of the sale.' },
];

export default function Page() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ukvisainfo.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Property', item: 'https://ukvisainfo.co.uk/category/property' },
      { '@type': 'ListItem', position: 3, name: 'Stamp Duty calculator', item: 'https://ukvisainfo.co.uk/stamp-duty-calculator' },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <FaqJsonLd faqs={FAQS} />
      <StampDuty />
    </>
  );
}
