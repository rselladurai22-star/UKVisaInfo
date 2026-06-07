import type { Metadata } from 'next';
import IsaCalculator from './IsaCalculator';

export const metadata: Metadata = {
  title: 'ISA Calculator 2025/26 — Tax-Free Savings Growth | UKDesk',
  description:
    'Free UK ISA calculator. See how a Cash or Stocks & Shares ISA grows tax-free from a lump sum and monthly saving, within the £20,000 annual allowance. ISA types and rules explained.',
  alternates: { canonical: '/isa-calculator' },
  openGraph: { title: 'ISA Calculator — Tax-Free Growth', description: 'Project tax-free ISA growth within the £20,000 allowance.', url: 'https://ukvisainfo.co.uk/isa-calculator', type: 'article' },
};

export default function Page() {
  return <IsaCalculator />;
}
