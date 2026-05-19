import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import SdltClient from './SdltClient';

export const metadata: Metadata = {
  title: 'UK Stamp Duty Calculator 2026 — SDLT for England & Northern Ireland',
  description: 'Free SDLT calculator using 2026 rates. Includes first-time buyer relief, 3% additional-property surcharge and 2% non-UK resident surcharge. Verified against gov.uk.',
  alternates: { canonical: '/stamp-duty-calculator' },
};

export default function StampDutyPage() {
  return (
    <CalcPageShell
      eyebrow="Stamp Duty · England & NI 2026"
      title="What you'll actually pay in stamp duty."
      deck="Enter your property price and instantly see the SDLT bill — with first-time buyer relief, second-home surcharge and non-resident surcharge handled automatically."
      verified="gov.uk verified"
      related={[
        { href: '/mortgage-affordability', title: 'Mortgage affordability', desc: 'See how much you can borrow + monthly repayment.' },
        { href: '/take-home-pay',          title: 'Take-home pay',          desc: 'Net salary after tax, NI, student loan, pension.' },
        { href: '/postcode',               title: 'Postcode lookup',        desc: 'Council, MP, NHS, police force and more.' },
      ]}
      educational={[
        { title: 'Standard rates (April 2025+)', body: '0% up to £125,000 · 2% to £250,000 · 5% to £925,000 · 10% to £1.5m · 12% above £1.5m. Applies to your main residential purchase when you\'re replacing your current home.' },
        { title: 'First-time buyer relief',      body: '0% up to £300,000 and 5% on £300,001–£500,000. Relief is fully withdrawn for purchases above £500,000 — the standard rates apply instead.' },
        { title: '3% additional-property surcharge', body: 'Applies on top of standard rates if you\'re buying a second home, buy-to-let, or any additional residential property. Calculated on the full purchase price.' },
        { title: '2% non-UK resident surcharge', body: 'Charged on top of standard rates if you\'ve not been UK-resident for the 12 months before completion. Combines with the 3% surcharge for second homes purchased by non-residents.' },
        { title: 'Scotland (LBTT) and Wales (LTT)', body: 'Stamp Duty does NOT apply in Scotland or Wales. They use Land and Buildings Transaction Tax (LBTT) and Land Transaction Tax (LTT) respectively, with different bands and reliefs.' },
        { title: 'When to pay', body: 'SDLT is due within 14 days of completion. Your solicitor or conveyancer normally calculates, files and pays it on your behalf as part of completion.' },
      ]}
    >
      <SdltClient initialPrice={350000} />
    </CalcPageShell>
  );
}
