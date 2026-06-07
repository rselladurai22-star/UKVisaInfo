import type { Metadata } from 'next';
import CriticalIllness from './CriticalIllness';

export const metadata: Metadata = {
  title: 'Critical Illness Cover Calculator 2025/26 — How Much? | UKDesk',
  description:
    'Free UK critical illness cover calculator. Estimate the lump sum you need to clear the mortgage and debts and fund recovery if a serious illness stops you working, plus a rough monthly premium.',
  alternates: { canonical: '/critical-illness-calculator' },
  openGraph: { title: 'Critical Illness Cover Calculator', description: 'Size your critical illness cover and estimate the premium.', url: 'https://ukvisainfo.co.uk/critical-illness-calculator', type: 'article' },
};

export default function Page() {
  return <CriticalIllness />;
}
