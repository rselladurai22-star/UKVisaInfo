import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import SdltClient from './SdltClient';

export const metadata: Metadata = {
  title: 'UK Stamp Duty Calculator 2026 — SDLT, LBTT, LTT for England, Scotland & Wales',
  description: 'Free UK stamp duty calculator. SDLT for England & NI, LBTT for Scotland, LTT for Wales. First-time buyer relief, 3% additional-property surcharge, 2% non-resident surcharge, 36-month refund calculator. Verified against gov.uk, Revenue Scotland and the Welsh Revenue Authority.',
  alternates: { canonical: '/stamp-duty-calculator' },
};

export default function StampDutyPage() {
  return (
    <CalcPageShell
      url="/stamp-duty-calculator"
      eyebrow="Stamp Duty · UK 2026 · SDLT, LBTT & LTT"
      title="Every UK stamp duty scenario, calculated."
      deck="Enter your purchase price and see the exact bill across all 7 buyer scenarios in England & NI (SDLT), Scotland (LBTT) and Wales (LTT). First-time buyer relief, the 3% additional-property surcharge, the 2% non-resident surcharge and the 36-month refund window — handled."
      verified="May 2026 · HMRC, Revenue Scotland and WRA verified"
      methodology={{
        summary: "We apply HMRC's SDLT slab rates for England and Northern Ireland (post-April 2025), Revenue Scotland's LBTT rates (with the 8% ADS surcharge effective 5 Dec 2024), and the Welsh Revenue Authority's LTT rates (with the 5% higher-rate surcharge effective 11 Dec 2024). Surcharges (3% additional-property, 2% non-UK resident, 8% Scottish ADS, 5% Welsh higher-rate) are applied to the full purchase price, not just the portion above the nil-rate band. Mixed-use and company-bought rules follow HMRC SDLTM07550 and SDLTM09700.",
        govUrl: "https://www.gov.uk/stamp-duty-land-tax",
        govLabel: "gov.uk · Stamp Duty Land Tax",
      }}
      faqs={[
        { q: 'What is Stamp Duty Land Tax (SDLT)?', a: 'SDLT is a tax paid when you buy a residential or non-residential property or land over a certain price in England and Northern Ireland. The bands and rates are set by HMRC and updated periodically; the version applied here reflects rates effective from April 2025.' },
        { q: 'What are the current SDLT thresholds in 2026?', a: 'For a standard residential purchase: 0% on the portion up to £125,000, 2% on £125,001–£250,000, 5% on £250,001–£925,000, 10% on £925,001–£1.5m, and 12% above £1.5m. These are slab rates — each tier applies only to the portion of the price in that band.' },
        { q: 'Do first-time buyers pay Stamp Duty?', a: 'First-time buyers pay 0% on the first £300,000 and 5% on the portion from £300,001 to £500,000. The relief is withdrawn entirely if the purchase price exceeds £500,000 — standard rates then apply to the whole price.' },
        { q: 'What is the 3% additional-property surcharge?', a: 'A 3 percentage-point uplift on every band, applied when you buy a residential property and already own another (including buy-to-let, second homes and holiday homes). It is calculated on the full purchase price, not just the portion above the nil-rate band.' },
        { q: 'How does the 2% non-UK resident surcharge work?', a: 'If you have not been UK-resident for at least 183 days in the 12 months before completion, a further 2% is added to every band. For an overseas buyer purchasing a second home, the 3% and 2% surcharges combine — adding 5 points to each standard band rate.' },
        { q: 'Does SDLT apply in Scotland or Wales?', a: 'No. Scotland uses Land and Buildings Transaction Tax (LBTT, Revenue Scotland) and Wales uses Land Transaction Tax (LTT, Welsh Revenue Authority). The bands, reliefs and surcharges differ — use the country selector in the calculator above to see the correct figures.' },
        { q: 'When do I have to pay SDLT?', a: 'Within 14 days of the effective date of the transaction (usually completion). Your solicitor or conveyancer normally calculates, files the SDLT return and pays HMRC on your behalf as part of completion. Missing the deadline triggers interest and potential penalties.' },
        { q: 'Can I reclaim the 3% surcharge if I sell my old home?', a: 'Yes — if you sell your previous main residence within 36 months of paying the surcharge, you can apply to HMRC for a refund. The application must be made within 12 months of selling the old home or within 12 months of the SDLT return filing date, whichever is later.' },
        { q: 'Is SDLT payable on transfers between spouses?', a: 'A transfer of equity to your spouse or civil partner with no consideration (no payment, no taking on of mortgage debt) is exempt. If the receiving partner takes on a share of an outstanding mortgage, SDLT is charged on the value of that share at standard rates.' },
        { q: 'How is SDLT calculated on shared ownership?', a: 'You can either pay SDLT in stages (only on the share you currently buy, plus on rent payments above the threshold) or pay upfront on the full market value (allowing future staircasing without further SDLT until you exceed 80% ownership). The choice is made at the first purchase and is irrevocable.' },
      ]}
      sidebar={{
        keyRates: [
          { label: 'SDLT nil-rate band',         value: '£125,000', sub: 'Standard buyers' },
          { label: 'FTB nil-rate band',          value: '£300,000', sub: 'First-time buyers' },
          { label: 'FTB relief cap',             value: '£500,000', sub: 'No relief above this' },
          { label: 'Additional-property',        value: '+3%',      sub: 'On full price' },
          { label: 'Non-UK resident',            value: '+2%',      sub: 'On full price' },
          { label: 'Company-flat rate',          value: '15%',      sub: 'Dwellings > £500k' },
          { label: 'LBTT nil-rate (Scotland)',   value: '£145,000', sub: 'Standard buyers' },
          { label: 'Scottish ADS',               value: '+8%',      sub: 'From 5 Dec 2024' },
          { label: 'LTT nil-rate (Wales)',       value: '£225,000', sub: 'Standard buyers' },
          { label: 'Welsh higher-rate',          value: '+5%',      sub: 'From 11 Dec 2024' },
        ],
        dates: [
          { date: '14 days', desc: 'Deadline to file SDLT return after completion', urgent: true },
          { date: '30 days', desc: 'LBTT (Scotland) filing deadline', urgent: false },
          { date: '30 days', desc: 'LTT (Wales) filing deadline', urgent: false },
          { date: '36 months', desc: 'Window to sell old home and claim 3% surcharge refund', urgent: false },
        ],
        tips: [
          { heading: 'Don\'t fall off the FTB cliff', body: 'Buying at £499,999 keeps you in FTB relief: £9,999.95 SDLT. At £500,001 the relief is lost entirely and standard rates apply to the whole price: £10,000 SDLT. Negotiating a £2 price reduction can save you nothing — but £1 in the right direction matters.' },
          { heading: 'Refund deadline is double-barrelled', body: 'You have 36 months to sell the old home AND 12 months from the sale date (or original SDLT filing date, whichever is later) to claim. Most refund failures are administrative, not eligibility-related.' },
          { heading: 'Mixed-use can save tens of thousands', body: 'If your purchase includes any non-residential element (e.g. a flat above a shop), the non-residential SDLT rates apply — and the 3% surcharge does NOT. HMRC scrutinises this; the commercial element must be substantive and intended for ongoing commercial use.' },
          { heading: 'Multiple Dwellings Relief (MDR) — abolished', body: 'MDR was withdrawn from 1 June 2024 for transactions completed after that date. Some transactions exchanged before 6 March 2024 may still qualify under transitional rules — check with your conveyancer if the contract pre-dates the abolition.' },
        ],
        govLink: 'gov.uk/stamp-duty-land-tax',
        govLabel: 'gov.uk — Stamp Duty Land Tax',
      }}
      related={[
        { href: '/mortgage-affordability', title: 'Mortgage affordability', desc: 'How much you can borrow + monthly repayment + stress test.' },
        { href: '/take-home-pay',          title: 'Take-home pay',          desc: 'Net salary after PAYE, NI, student loan, pension.' },
        { href: '/council-tax-band',       title: 'Council Tax band',       desc: 'Estimate annual council tax for any UK postcode.' },
      ]}
      educational={[
        {
          title: 'Quick start: what stamp duty actually is',
          body: 'Stamp Duty Land Tax (SDLT) is a one-off tax paid to HMRC whenever you buy a residential property, a piece of land, or a building over a set price in England and Northern Ireland. Scotland and Wales operate separate equivalent taxes — Land and Buildings Transaction Tax (LBTT) and Land Transaction Tax (LTT) respectively — with their own rates, bands and surcharges set by the devolved governments. The tax is calculated on a slab basis: each band\'s percentage applies only to the portion of the purchase price that falls within that band, not to the whole price. So a £400,000 purchase by a standard buyer triggers 0% on the first £125,000, 2% on the next £125,000 (£2,500), and 5% on the final £150,000 (£7,500) — total £10,000. SDLT is normally calculated, filed and paid by your solicitor or conveyancer as part of completion, within 14 days of the effective date of the transaction. Missing that deadline triggers interest and, after 30 days, fixed penalties starting at £100. The version of SDLT used in this calculator is the rate structure effective from 1 April 2025, as published by HMRC.',
        },
        {
          title: 'The five standard SDLT bands explained',
          body: 'For a standard residential purchase (you\'re replacing your main home, or it\'s your only property), the bands are: 0% on the portion of the price up to £125,000; 2% on the portion from £125,001 to £250,000; 5% from £250,001 to £925,000; 10% from £925,001 to £1.5 million; and 12% on anything above £1.5 million. Because the rates are slab-based, your "effective rate" is always lower than your top marginal rate. A £600,000 purchase by a standard buyer pays 0% + 2% + 5% across three bands — total £20,000, an effective 3.33% — even though the top band touched is 5%. This is materially different from how income tax works in everyday speech (where people often refer to themselves as "40% taxpayers"), and is the source of most stamp-duty mistakes in casual estimates.',
        },
        {
          title: 'First-time buyer relief — and the £500,000 cliff',
          body: 'First-time buyers (people who have never owned a residential property anywhere in the world, including in joint name with anyone else) get a more generous nil-rate band: 0% up to £300,000, then 5% on the portion between £300,001 and £500,000. The catch is the £500,001 cliff edge. Buy at exactly £500,000 and you pay £10,000 SDLT (5% on the £200,000 between £300k and £500k). Buy at £500,001 and you lose the relief entirely — standard rates apply to the full price, meaning £10,000 SDLT (2% on £125k + 5% on £250k portion) instead of the saved-relief equivalent. The cliff is symmetric at £500,000 by coincidence of the figures, but at lower prices the relief can save up to £15,000 versus standard rates. Negotiating a £1 price reduction to get below the cap can therefore matter; negotiating £1 over rarely costs you anything in tax (because both buyer types now hit standard rates), but always check the maths for your specific price point.',
        },
        {
          title: 'The 3% additional-property surcharge in detail',
          body: 'If you already own a residential property anywhere in the world and you\'re buying another — buy-to-let, holiday home, second residence, helping a child with a property in your name — you pay an extra 3 percentage points on every SDLT band, calculated on the full purchase price. So a £400,000 second home incurs the £10,000 standard SDLT (as above) plus a surcharge of 3% × £400,000 = £12,000. Total: £22,000, more than double the standard bill. The surcharge applies even if you intend to make the new property your main home (because you still own another at the time of purchase). The exception — the most-missed escape route — is if you complete on the new home AFTER selling your previous main residence: in that case you\'re replacing your main home and no surcharge applies. The order of completions matters, even by a single day. If timing slips and you complete on the new home before the sale of the old, you can still claim the surcharge back if you sell within 36 months — see the refund tool above.',
        },
        {
          title: 'The 2% non-UK resident surcharge',
          body: 'Since 1 April 2021, a 2% surcharge applies to residential purchases by buyers who have not been UK-resident for at least 183 days in the 12 months ending with the effective date of the transaction. Residence is tested under SDLT-specific rules, which differ from the general Statutory Residence Test used for income tax. A British citizen living abroad is subject to the surcharge if they fail the day-count test. A non-British citizen living in the UK for years escapes it if they meet the count. The surcharge stacks with the 3% additional-property surcharge — a non-UK resident buying a second home pays an extra 5 percentage points on every band. There is a partial refund available if you become UK-resident within the relevant 12-month period after purchase; the deadline to claim is 2 years from the effective date.',
        },
        {
          title: 'Scotland: LBTT and the 8% ADS',
          body: 'Scotland\'s Land and Buildings Transaction Tax (LBTT) replaced SDLT in Scotland on 1 April 2015. The 2025/26 residential bands run: 0% up to £145,000; 2% from £145,001 to £250,000; 5% from £250,001 to £325,000; 10% from £325,001 to £750,000; and 12% above £750,000. First-time buyer relief raises the nil-rate band to £175,000 with no upper cap on eligibility. The Scottish equivalent of the 3% additional-property surcharge is the Additional Dwelling Supplement (ADS) — set at 6% from 2022 and increased to 8% from 5 December 2024 as part of the Scottish Budget. ADS is charged on the full price for any additional residential property over £40,000 and applies to all corporate buyers regardless of price. The 36-month refund window for ADS works similarly to the SDLT equivalent. LBTT filing deadline is 30 days (vs SDLT\'s 14) and is administered by Revenue Scotland.',
        },
        {
          title: 'Wales: LTT and the 5% higher-rate surcharge',
          body: 'Wales\' Land Transaction Tax (LTT) replaced SDLT in Wales on 1 April 2018. The 2025 main residential bands are: 0% up to £225,000; 6% from £225,001 to £400,000; 7.5% from £400,001 to £750,000; 10% from £750,001 to £1.5 million; and 12% above £1.5m. Wales chose not to introduce a separate first-time buyer relief — the relatively high £225,000 nil-rate band covers most first-time buyer purchases already without a special tier. The Welsh equivalent of the 3% surcharge is the higher-rate residential surcharge, set at 5% (up from 4% on 11 December 2024) on additional-property purchases. There is no non-UK resident surcharge in Wales. LTT is administered by the Welsh Revenue Authority and the filing deadline is 30 days. Wales also has no equivalent of the 15% company-flat rate — corporate dwelling purchases use standard bands plus the 5% higher-rate surcharge.',
        },
        {
          title: 'Mixed-use property — the 3% surcharge escape',
          body: 'If a property has both residential and non-residential elements (e.g. a flat above a working shop, a farmhouse with substantive agricultural land, an HMO with a commercial unit attached), HMRC treats it as a mixed-use purchase. Two consequences: non-residential SDLT rates apply (0% to £150,000, 2% to £250,000, 5% above), which are typically lower than the residential rates for the same total price; AND the 3% additional-property surcharge does NOT apply. For higher-value purchases, this can save tens of thousands. The catch: HMRC scrutinises mixed-use claims aggressively. The non-residential element must be a "material" part of the property — incidental fields, ornamental outbuildings or token shop fronts that have not been used commercially for years will not qualify. The leading case is Hyman v HMRC [2019], which clarified that purely residential gardens and grounds, even if extensive, do not turn a property into mixed-use.',
        },
        {
          title: 'Six worked examples across scenarios',
          body: 'Example 1 — Standard buyer, £400,000: 0% on £125k + 2% on £125k (£2,500) + 5% on £150k (£7,500) = £10,000 SDLT. Effective rate 2.5%. Example 2 — First-time buyer, £400,000: 0% on £300k + 5% on £100k (£5,000) = £5,000 SDLT. Saves £5,000 vs standard. Example 3 — First-time buyer, £600,000: Relief lost (over £500k cap). Standard rates apply: 0% + £2,500 + 5% on £350k (£17,500) = £20,000 SDLT. Example 4 — Second home, £400,000: Standard SDLT £10,000 + 3% surcharge on full £400k (£12,000) = £22,000 total. Example 5 — Non-UK resident, £400,000: Standard SDLT £10,000 + 2% surcharge on full £400k (£8,000) = £18,000 total. Example 6 — Non-UK resident buying a second home, £400,000: Standard SDLT £10,000 + 3% surcharge (£12,000) + 2% surcharge (£8,000) = £30,000 total. The same £400,000 property triggers anywhere from £5,000 to £30,000 in SDLT depending on the buyer scenario — a 6× range.',
        },
        {
          title: 'Common mistakes and pitfalls',
          body: 'The five most common SDLT errors that cost money or risk HMRC investigation: (1) Claiming first-time buyer relief when a spouse, civil partner or co-buyer has previously owned property — relief is denied for the entire purchase, not just their share. (2) Failing to apply the 3% surcharge to a second home when you already own a buy-to-let or have inherited a share in another property anywhere in the world. (3) Buying a "main residence" while still owning the previous one without completing the sale first — the 3% surcharge applies even with intent to sell, and the refund must be claimed actively within 36 months. (4) Incorrectly claiming mixed-use status for properties with token commercial elements (paddocks, unused outbuildings). (5) Missing the 14-day filing deadline — most conveyancers handle this, but DIY purchases or transfers of equity often miss it.',
        },
        {
          title: 'Filing, payment and penalty schedule',
          body: 'SDLT returns are filed via the HMRC Stamp Taxes Online service, usually by your solicitor as part of completion. Payment is due at the same time. If you miss the 14-day deadline: £100 fixed penalty after 1 day late; an additional £100 (£200 total) after 3 months; and a tax-geared penalty of up to 100% of the SDLT due in serious cases of deliberate failure. Interest accrues from day 1 of lateness at the HMRC late-payment rate (currently 7.75% as of November 2024, varies with Bank Rate). For LBTT, the equivalent deadlines and penalties are administered by Revenue Scotland; for LTT, by the Welsh Revenue Authority. In all three regimes, the buyer remains legally responsible for the tax even if they instructed a third party to file and pay — so check that your conveyancer has actually completed the filing after completion.',
        },
        {
          title: 'Companies, trusts and special structures',
          body: 'A non-natural person (a company, a partnership of companies, or a collective investment scheme) buying a single dwelling worth more than £500,000 in England or NI pays a flat 15% SDLT on the entire price, unless a specific relief applies (typical reliefs: property let to unconnected third parties on commercial terms, property used in a property-developer trade, dwellings used as employee accommodation). The 15% rate is anti-avoidance legislation aimed at preventing wealthy individuals from acquiring residential property through corporate envelopes to dodge SDLT. Where the 15% does apply, the Annual Tax on Enveloped Dwellings (ATED) — a separate annual charge ranging from £4,400 to £287,000 depending on property value — also kicks in. Scotland and Wales handle corporate purchases differently: Scotland applies the standard bands plus the 8% ADS; Wales applies the standard bands plus the 5% higher-rate surcharge.',
        },
      ]}
    >
      <SdltClient initialPrice={350000} />
    </CalcPageShell>
  );
}
