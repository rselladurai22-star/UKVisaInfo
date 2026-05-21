import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import PropertyCgtClient from './PropertyCgtClient';

export const metadata: Metadata = {
  title: 'Property CGT Calculator 2025/26 — PPR Relief, 18%/24% Rates, 60-Day Rule',
  description: 'UK residential property Capital Gains Tax calculator 2025/26. Private Residence Relief, last 9 months exemption, £3,000 AEA. New 18%/24% rates from October 2024. 60-day reporting deadline.',
  alternates: { canonical: '/property-cgt-calculator' },
};

export default function PropertyCgtPage() {
  return (
    <CalcPageShell
      url="/property-cgt-calculator"
      eyebrow="Property CGT · UK · 2025/26"
      title="Selling a property? Here&rsquo;s what HMRC will take."
      deck="Private Residence Relief, the last-9-months exemption, and the £3,000 Annual Exempt Amount — all applied before the 18% or 24% residential property CGT rate. And you have 60 days to report it."
      verified="gov.uk/capital-gains-tax/rates"
      related={[
        { href: '/rental-income-tax', title: 'Rental income tax', desc: 'Annual tax on rental profits before you sell.' },
        { href: '/cgt-calculator', title: 'General CGT calculator', desc: 'CGT on shares, funds and other assets.' },
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'Other income affects which CGT rate band applies.' },
      ]}
      educational={[
        { title: 'Private Residence Relief (PPR)', body: 'If the property was your main home for all or part of your ownership, the gain is exempt for those months. The final 9 months of ownership always qualifies as PPR regardless of where you live — designed to help people who can\'t sell main home before buying next.' },
        { title: 'New CGT rates from 30 Oct 2024', body: 'The October 2024 Budget raised residential property CGT rates: basic-rate taxpayers now pay 18% (up from 18% — unchanged for property, but notably higher than pre-Budget shares rates). Higher/additional rate is 24% (down from 28%). Rates apply from 30 October 2024.' },
        { title: '£3,000 Annual Exempt Amount', body: 'Each individual has a £3,000 CGT exemption per year (reduced from £12,300 in 2022/23). Gains below this are tax-free. You can\'t carry forward unused exemptions — use them in the tax year.' },
        { title: '60-day reporting rule', body: 'Residential property gains must be reported to HMRC and any CGT paid within 60 days of completion using the "Report and Pay CGT on UK property" service. This is separate from your Self Assessment return.' },
        { title: 'Selling costs & improvement costs', body: 'Estate agent fees, conveyancing, and capital improvement costs (e.g. extension, new kitchen — not repairs) can be deducted from the gain. Repair costs during ownership are revenue expenses, not capital costs, and do not reduce CGT.' },
      ]}
    >
      <PropertyCgtClient />
    </CalcPageShell>
  );
}
