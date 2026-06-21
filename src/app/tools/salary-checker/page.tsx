import type { Metadata } from 'next';
import SalaryChecker from '../../../components/tools/SalaryChecker';

const title = 'UK Skilled Worker Salary Checker 2026, Check by SOC Code (Free)';
const description = 'Free tool: check if your job offer meets the UK Skilled Worker visa salary threshold. Search 100+ SOC 2020 occupation codes with 2026 going rates. Instant pass/fail result, no signup needed.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'UK skilled worker salary threshold 2026', 'skilled worker visa salary check',
    'SOC code salary UK visa', 'do I earn enough skilled worker visa',
    'UK visa salary requirement', 'going rate skilled worker', 'tier 2 salary check',
    'skilled worker minimum salary', 'UK work visa salary calculator',
  ],
  alternates: { canonical: '/tools/salary-checker' },
  openGraph: {
    title, description,
    url: 'https://ukvisainfo.co.uk/tools/salary-checker',
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
    { '@type': 'ListItem', position: 3, name: 'Salary Checker', item: 'https://ukvisainfo.co.uk/tools/salary-checker' },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <SalaryChecker />
    </>
  );
}
