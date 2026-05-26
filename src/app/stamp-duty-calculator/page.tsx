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
      url="/stamp-duty-calculator"
      eyebrow="Stamp Duty · England & NI 2026"
      title="What you'll actually pay in stamp duty."
      deck="Enter your property price and instantly see the SDLT bill — with first-time buyer relief, second-home surcharge and non-resident surcharge handled automatically."
      verified="gov.uk verified"
      methodology={{
        summary: "We apply HMRC's SDLT band rates for England and Northern Ireland (effective April 2025): 0% up to £125,000, 2% to £250,000, 5% to £925,000, 10% to £1.5m and 12% above. First-time buyer relief, the 3% additional-property surcharge and the 2% non-UK resident surcharge are added on top of standard bands.",
        govUrl: "https://www.gov.uk/stamp-duty-land-tax",
        govLabel: "gov.uk · Stamp Duty Land Tax",
      }}
      faqs={[
        { q: 'What is Stamp Duty Land Tax (SDLT)?', a: 'SDLT is a tax paid when you buy a residential or non-residential property or land over a certain price in England and Northern Ireland. The bands and rates are set by HMRC and updated periodically; the version applied here reflects rates effective from April 2025.' },
        { q: 'What are the current SDLT thresholds in 2026?', a: 'For a standard residential purchase: 0% on the portion up to £125,000, 2% on £125,001–£250,000, 5% on £250,001–£925,000, 10% on £925,001–£1.5m, and 12% above £1.5m. These are slab rates — each tier applies only to the portion of the price in that band.' },
        { q: 'Do first-time buyers pay Stamp Duty?', a: 'First-time buyers pay 0% on the first £300,000 and 5% on the portion from £300,001 to £500,000. The relief is withdrawn entirely if the purchase price exceeds £500,000 — standard rates then apply to the whole price.' },
        { q: 'What is the 3% additional-property surcharge?', a: 'A 3 percentage-point uplift on every band, applied when you buy a residential property and already own another (including buy-to-let, second homes and holiday homes). It is calculated on the full purchase price, not just the portion above the nil-rate band.' },
        { q: 'How does the 2% non-UK resident surcharge work?', a: 'If you have not been UK-resident for at least 183 days in the 12 months before completion, a further 2% is added to every band. For an overseas buyer purchasing a second home, the 3% and 2% surcharges combine — adding 5 points to each standard band rate.' },
        { q: 'Does SDLT apply in Scotland or Wales?', a: 'No. Scotland uses Land and Buildings Transaction Tax (LBTT, Revenue Scotland) and Wales uses Land Transaction Tax (LTT, Welsh Revenue Authority). The bands, reliefs and surcharges differ — do not use a SDLT calculator for Scottish or Welsh properties.' },
        { q: 'When do I have to pay SDLT?', a: 'Within 14 days of the effective date of the transaction (usually completion). Your solicitor or conveyancer normally calculates, files the SDLT return and pays HMRC on your behalf as part of completion. Missing the deadline triggers interest and potential penalties.' },
        { q: 'Can I reclaim the 3% surcharge if I sell my old home?', a: 'Yes — if you sell your previous main residence within 36 months of paying the surcharge, you can apply to HMRC for a refund. The application must be made within 12 months of selling the old home or within 12 months of the SDLT return filing date, whichever is later.' },
        { q: 'Is SDLT payable on transfers between spouses?', a: 'A transfer of equity to your spouse or civil partner with no consideration (no payment, no taking on of mortgage debt) is exempt. If the receiving partner takes on a share of an outstanding mortgage, SDLT is charged on the value of that share at standard rates.' },
        { q: 'How is SDLT calculated on shared ownership?', a: 'You can either pay SDLT in stages (only on the share you currently buy, plus on rent payments above the threshold) or pay upfront on the full market value (allowing future staircasing without further SDLT until you exceed 80% ownership). The choice is made at the first purchase and is irrevocable.' },
      ]}
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
