import type { Metadata } from 'next';
import ChildBenefit from './ChildBenefit';

export const metadata: Metadata = {
  title: 'Child Benefit Tax Charge Calculator 2025/26 (HICBC) | UKDesk',
  description:
    'Free UK High Income Child Benefit Charge calculator. See how much Child Benefit you keep when income is £60,000–£80,000, and how a pension contribution can remove the charge. 2025/26 rates.',
  alternates: { canonical: '/child-benefit-trap' },
  openGraph: { title: 'Child Benefit Tax Charge Calculator (HICBC)', description: 'How much Child Benefit you keep above £60,000, and how to save it.', url: 'https://ukvisainfo.co.uk/child-benefit-trap', type: 'article' },
};

export default function Page() {
  return <ChildBenefit />;
}
