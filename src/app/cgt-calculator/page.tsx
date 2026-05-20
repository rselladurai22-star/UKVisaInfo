import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import CgtClient from './CgtClient';

export const metadata: Metadata = {
  title: 'UK Capital Gains Tax Calculator 2026/27 — 18% / 24% with £3,000 Allowance',
  description: 'Free UK Capital Gains Tax calculator for 2026/27. £3,000 Annual Exempt Amount, 18% basic-rate, 24% higher-rate. Property and other assets — HMRC-aligned.',
  alternates: { canonical: '/cgt-calculator' },
};

export default function CgtPage() {
  return (
    <CalcPageShell
      url="/cgt-calculator"
      eyebrow="CGT · UK 2026/27"
      title="Capital Gains Tax — what you’ll actually pay."
      deck="Enter your taxable income and total gain. We apply the £3,000 Annual Exempt Amount and split the gain between 18% and 24% bands based on your unused basic-rate room."
      verified="HMRC CG manual"
      related={[
        { href: '/take-home-pay',          title: 'Take-home pay',          desc: 'Net salary 2026/27.' },
        { href: '/stamp-duty-calculator',  title: 'Stamp Duty',             desc: 'When you buy, not sell.' },
        { href: '/pension-allowance',      title: 'Pension allowance',      desc: 'How much can you contribute pre-tax?' },
      ]}
      educational={[
        { title: 'Annual Exempt Amount (AEA)', body: 'You can realise up to £3,000 of gains tax-free in 2026/27 (frozen from 2024/25; was £6,000 before, £12,300 before that). Trusts get half — £1,500.' },
        { title: 'Rates — same for property and other', body: 'From 30 October 2024 (Autumn Budget) all asset classes share rates: 18% inside the basic-rate band, 24% above. Before that, non-property was 10%/20%. Carried interest stayed separate.' },
        { title: 'How gains stack', body: 'Your taxable gain (after AEA) stacks on top of taxable income. Whatever basic-rate band (up to £37,700 above PA) is unused taxes the gain at 18%; the rest at 24%.' },
        { title: 'What counts as a gain', body: 'Disposal of shares, second homes/buy-to-let, business assets, crypto, collectibles, fine art. Your main residence is normally exempt under Private Residence Relief. ISAs are exempt.' },
        { title: 'Reporting', body: 'Residential property gains must be reported and paid within 60 days of completion via HMRC\'s Capital Gains Tax on UK Property service. Other gains go on the Self Assessment return by 31 January.' },
        { title: 'Reliefs not modelled here', body: 'Business Asset Disposal Relief (10% on qualifying business sales, lifetime £1m cap), Investors\' Relief, Private Residence Relief, Lettings Relief, Gift Hold-Over Relief. For complex cases, get accountant advice.' },
      ]}
    >
      <CgtClient />
    </CalcPageShell>
  );
}
