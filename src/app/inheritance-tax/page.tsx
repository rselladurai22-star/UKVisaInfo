import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import IhtClient from './IhtClient';

export const metadata: Metadata = {
  title: 'UK Inheritance Tax Calculator 2026 — NRB £325k + Residence £175k',
  description: 'Free UK inheritance tax calculator. Apply the £325,000 nil-rate band, £175,000 residence nil-rate band, spouse exemption and charity-reduced 36% rate. Frozen until April 2030.',
  alternates: { canonical: '/inheritance-tax' },
};

export default function IhtPage() {
  return (
    <CalcPageShell
      url="/inheritance-tax"
      eyebrow="Inheritance Tax · UK · 2026"
      title="What HMRC will take from your estate."
      deck="Estate value, charity gifts and spouse legacies — instantly see the IHT bill after the £325k Nil-Rate Band and £175k Residence Nil-Rate Band."
      verified="gov.uk/inheritance-tax"
      related={[
        { href: '/cgt-calculator',      title: 'Capital Gains Tax', desc: 'CGT on selling property or shares in your lifetime.' },
        { href: '/pension-allowance',   title: 'Pension allowances', desc: 'Pensions usually fall outside the IHT estate.' },
        { href: '/stamp-duty-calculator', title: 'Stamp Duty', desc: 'If heirs are buying out shares of the family home.' },
      ]}
      educational={[
        { title: 'Nil-Rate Band · £325,000', body: 'Each person\'s estate is exempt from IHT on the first £325,000. Frozen at this level since 2009; frozen until April 2030 (Autumn Budget 2024).' },
        { title: 'Residence Nil-Rate Band · £175,000', body: 'An extra £175,000 if the family home (or equivalent value) passes to children, grandchildren, step-/adopted/foster descendants. Doesn\'t apply if the home goes to siblings, friends or non-descendants.' },
        { title: 'Spouse / civil-partner exemption', body: 'Unlimited transfers between UK-domiciled spouses are IHT-free. Better still, any unused NRB and RNRB transfer to the surviving spouse — so a couple can pass on up to £1,000,000 IHT-free.' },
        { title: '40% — or 36% with charity', body: 'IHT is 40% on the excess above all allowances. If you leave 10% or more of the "baseline" net estate to a registered charity, the rate on the remainder drops to 36%.' },
        { title: 'RNRB taper for £2m+ estates', body: 'For every £2 your gross estate exceeds £2,000,000, the RNRB is reduced by £1. So a £2.35m single estate loses the entire £175k RNRB. Couples can double the threshold to £2.7m before full taper.' },
        { title: 'What\'s NOT modelled here', body: 'Lifetime gifts within 7 years of death (potentially exempt transfers with taper relief), Business Property Relief, Agricultural Property Relief, trusts, and non-UK-domiciled estates need bespoke advice.' },
      ]}
    >
      <IhtClient />
    </CalcPageShell>
  );
}
