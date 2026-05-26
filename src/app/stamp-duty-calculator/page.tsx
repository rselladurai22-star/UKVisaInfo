import type { Metadata } from 'next';
import Link from 'next/link';
import SdltClient from './SdltClient';
import EditorByline from '../../components/EditorByline';
import FaqJsonLd from '../../components/calc-shell/FaqJsonLd';
import { primaryEditorSchema } from '../../data/editorialTeam';

export const metadata: Metadata = {
  title: 'UK Stamp Duty Calculator 2026 — SDLT, LBTT, LTT for England, Scotland & Wales',
  description: 'Free UK stamp duty calculator. SDLT for England & NI, LBTT for Scotland, LTT for Wales. First-time buyer relief, 3% additional-property surcharge, 2% non-resident surcharge, 36-month refund calculator. Verified against gov.uk, Revenue Scotland and the Welsh Revenue Authority.',
  alternates: { canonical: '/stamp-duty-calculator' },
  openGraph: {
    title: 'UK Stamp Duty Calculator 2026',
    description: 'SDLT, LBTT and LTT across all seven UK buyer scenarios. Verified May 2026.',
    url: 'https://ukvisainfo.co.uk/stamp-duty-calculator',
    type: 'article',
  },
};

/* ─────────────────────────────────────────────
   DESIGN TOKENS — must match SdltClient
───────────────────────────────────────────── */
const T = {
  ink:    '#11181C',
  body:   '#33383D',
  muted:  '#5C6B73',
  faint:  '#8A949B',
  hair:   '#E4E7EA',
  divide: '#F1F3F4',
  paper:  '#FFFFFF',
  pale:   '#FAFBFC',
  cream:  '#FAFAF7',
  warn:   '#A4520F',
  ok:     '#0D7A50',
};
const FONT = 'Inter, system-ui, -apple-system, sans-serif';
const NUM  = 'tabular-nums';

/* ─────────────────────────────────────────────
   FAQ DATA (also used for FAQPage JSON-LD)
───────────────────────────────────────────── */
const FAQS = [
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
];

/* ─────────────────────────────────────────────
   TABLE OF CONTENTS
───────────────────────────────────────────── */
const TOC = [
  { id: 'calculator',     label: 'Calculator' },
  { id: 'how-it-works',   label: 'How SDLT actually works' },
  { id: 'standard-bands', label: 'The five standard bands' },
  { id: 'ftb',            label: 'First-time buyer relief and the £500,000 cliff' },
  { id: 'additional',     label: 'The 3% additional-property surcharge' },
  { id: 'non-resident',   label: 'The 2% non-UK resident surcharge' },
  { id: 'scotland',       label: 'Scotland: LBTT and the 8% ADS' },
  { id: 'wales',          label: 'Wales: LTT and the 5% higher-rate' },
  { id: 'mixed-use',      label: 'Mixed-use property — the surcharge escape' },
  { id: 'examples',       label: 'Six worked examples across scenarios' },
  { id: 'mistakes',       label: 'Common mistakes and pitfalls' },
  { id: 'filing',         label: 'Filing, payment and penalty schedule' },
  { id: 'companies',      label: 'Companies, trusts and special structures' },
  { id: 'faq',            label: 'Frequently asked questions' },
  { id: 'sources',        label: 'Sources and methodology' },
];

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function StampDutyPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',                  item: 'https://ukvisainfo.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Stamp Duty calculator', item: 'https://ukvisainfo.co.uk/stamp-duty-calculator' },
    ],
  };
  const webAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'UK Stamp Duty Calculator (SDLT, LBTT, LTT)',
    url: 'https://ukvisainfo.co.uk/stamp-duty-calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
    author: primaryEditorSchema('https://ukvisainfo.co.uk'),
    publisher: { '@type': 'Organization', name: 'UKDesk', url: 'https://ukvisainfo.co.uk' },
  };

  return (
    <main style={{ background: T.cream, color: T.ink, fontFamily: FONT, minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <FaqJsonLd faqs={FAQS} />

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <header style={{ paddingTop: 'clamp(96px, 14vh, 144px)', paddingBottom: 56 }}>
        <Container>
          <Eyebrow>Stamp Duty · United Kingdom · May 2026</Eyebrow>
          <h1 style={{
            fontSize: 'clamp(30px, 5vw, 46px)',
            fontWeight: 600, lineHeight: 1.08,
            letterSpacing: '-0.025em', color: T.ink,
            margin: '20px 0 0',
            maxWidth: '20ch',
          }}>
            The complete UK stamp&nbsp;duty&nbsp;calculator.
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 1.9vw, 19px)',
            lineHeight: 1.55, color: T.body,
            margin: '24px 0 0', maxWidth: '60ch',
          }}>
            Calculate SDLT (England &amp; Northern Ireland), LBTT (Scotland) and LTT (Wales) across seven buyer scenarios. Verified against gov.uk, Revenue Scotland and the Welsh Revenue Authority.
          </p>
          <div style={{
            marginTop: 40, paddingTop: 20,
            borderTop: `1px solid ${T.hair}`,
            display: 'flex', flexWrap: 'wrap', gap: 20,
            alignItems: 'center', justifyContent: 'space-between',
            fontSize: 13, color: T.muted,
          }}>
            <EditorByline verified="May 2026" prefix="By" />
            <div style={{ display: 'flex', gap: 20 }}>
              <span>12 min read</span>
              <span style={{ color: T.faint }}>·</span>
              <span>Last updated 26 May 2026</span>
            </div>
          </div>
        </Container>
      </header>

      {/* ═══════════════════════════════════════════
          TABLE OF CONTENTS
      ═══════════════════════════════════════════ */}
      <section style={{ paddingBottom: 96 }}>
        <Container>
          <Eyebrow>On this page</Eyebrow>
          <ol style={{ listStyle: 'none', padding: 0, margin: '20px 0 0' }}>
            {TOC.map((item, i) => (
              <li key={item.id} style={{
                borderTop: i === 0 ? `1px solid ${T.hair}` : 'none',
                borderBottom: `1px solid ${T.divide}`,
              }}>
                <a href={`#${item.id}`} style={{
                  display: 'flex', alignItems: 'baseline', gap: 20,
                  padding: '14px 0', textDecoration: 'none',
                  color: T.ink, fontSize: 15,
                  lineHeight: 1.4,
                }}>
                  <span style={{
                    fontSize: 12, color: T.faint,
                    fontVariantNumeric: NUM, minWidth: 26,
                    fontWeight: 500,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════
          01 — CALCULATOR
      ═══════════════════════════════════════════ */}
      <Section id="calculator" number="01" title="Calculator">
        <p style={prose}>
          Pick a country, set your purchase price and choose the scenario that fits. Results update instantly, with band-by-band breakdown and side-by-side comparisons available below.
        </p>
        <div style={{
          background: T.paper,
          border: `1px solid ${T.hair}`,
          borderRadius: 6,
          padding: 'clamp(24px, 4vw, 40px)',
          marginTop: 32,
        }}>
          <SdltClient initialPrice={350000} />
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          02 — HOW SDLT WORKS
      ═══════════════════════════════════════════ */}
      <Section id="how-it-works" number="02" title="How SDLT actually works">
        <p style={prose}>
          Stamp Duty Land Tax is a one-off tax paid to HMRC whenever you buy a residential property, a piece of land, or a building over a set price in England and Northern Ireland. Scotland and Wales operate separate equivalent taxes — Land and Buildings Transaction Tax (LBTT) and Land Transaction Tax (LTT) — with their own rates, bands and surcharges set by the devolved governments.
        </p>
        <p style={prose}>
          The tax is calculated on a slab basis: each band&apos;s percentage applies only to the portion of the purchase price that falls within that band, not to the whole price. A £400,000 purchase by a standard buyer triggers 0% on the first £125,000, 2% on the next £125,000 (£2,500), and 5% on the final £150,000 (£7,500) — total £10,000.
        </p>
        <p style={prose}>
          SDLT is normally calculated, filed and paid by your solicitor or conveyancer as part of completion, within 14 days of the effective date of the transaction. Missing that deadline triggers interest and, after 30 days, fixed penalties starting at £100. The version of SDLT used in this calculator is the rate structure effective from 1 April 2025, as published by HMRC.
        </p>
      </Section>

      {/* ═══════════════════════════════════════════
          03 — STANDARD BANDS
      ═══════════════════════════════════════════ */}
      <Section id="standard-bands" number="03" title="The five standard bands">
        <p style={prose}>
          For a standard residential purchase — you&apos;re replacing your main home, or it&apos;s your only property — the bands are:
        </p>
        <RateTable rows={[
          ['Up to £125,000',           '0%'],
          ['£125,001 – £250,000',      '2%'],
          ['£250,001 – £925,000',      '5%'],
          ['£925,001 – £1,500,000',    '10%'],
          ['Above £1,500,000',         '12%'],
        ]} />
        <p style={prose}>
          Because the rates are slab-based, your effective rate is always lower than your top marginal rate. A £600,000 purchase by a standard buyer pays 0% + 2% + 5% across three bands — total £20,000, an effective 3.33% — even though the top band touched is 5%. This is materially different from how income tax works in everyday speech, and is the source of most casual stamp-duty mistakes.
        </p>
      </Section>

      {/* ═══════════════════════════════════════════
          04 — FTB RELIEF
      ═══════════════════════════════════════════ */}
      <Section id="ftb" number="04" title="First-time buyer relief and the £500,000 cliff">
        <p style={prose}>
          First-time buyers — people who have never owned a residential property anywhere in the world, including in joint name with anyone else — get a more generous nil-rate band: 0% up to £300,000, then 5% on the portion between £300,001 and £500,000.
        </p>
        <p style={prose}>
          The catch is the £500,001 cliff edge. Buy at exactly £500,000 and you pay £10,000 SDLT. Buy at £500,001 and you lose the relief entirely — standard rates apply to the full price, meaning £10,000 SDLT (2% on £125k plus 5% on £250k portion) instead of the saved-relief equivalent.
        </p>
        <p style={prose}>
          The cliff is symmetric at £500,000 by coincidence of the figures, but at lower prices the relief can save up to £15,000 versus standard rates. Negotiating a £1 price reduction to get below the cap can therefore matter; negotiating £1 over rarely costs you anything in tax (because both buyer types now hit standard rates), but always check the maths for your specific price point.
        </p>
      </Section>

      {/* ═══════════════════════════════════════════
          05 — 3% SURCHARGE
      ═══════════════════════════════════════════ */}
      <Section id="additional" number="05" title="The 3% additional-property surcharge">
        <p style={prose}>
          If you already own a residential property anywhere in the world and you&apos;re buying another — buy-to-let, holiday home, second residence, helping a child with a property in your name — you pay an extra 3 percentage points on every SDLT band, calculated on the full purchase price.
        </p>
        <p style={prose}>
          A £400,000 second home incurs the £10,000 standard SDLT plus a surcharge of 3% × £400,000 = £12,000. Total £22,000, more than double the standard bill. The surcharge applies even if you intend to make the new property your main home (because you still own another at the time of purchase).
        </p>
        <p style={prose}>
          The exception — the most-missed escape route — is if you complete on the new home AFTER selling your previous main residence. In that case you&apos;re replacing your main home and no surcharge applies. The order of completions matters, even by a single day. If timing slips and you complete on the new home before the sale of the old, you can still claim the surcharge back if you sell within 36 months. The refund tool inside the calculator above checks your eligibility.
        </p>
      </Section>

      {/* ═══════════════════════════════════════════
          06 — NON-RESIDENT SURCHARGE
      ═══════════════════════════════════════════ */}
      <Section id="non-resident" number="06" title="The 2% non-UK resident surcharge">
        <p style={prose}>
          Since 1 April 2021, a 2% surcharge applies to residential purchases by buyers who have not been UK-resident for at least 183 days in the 12 months ending with the effective date of the transaction. Residence is tested under SDLT-specific rules, which differ from the general Statutory Residence Test used for income tax.
        </p>
        <p style={prose}>
          A British citizen living abroad is subject to the surcharge if they fail the day-count test. A non-British citizen living in the UK for years escapes it if they meet the count. The surcharge stacks with the 3% additional-property surcharge — a non-UK resident buying a second home pays an extra 5 percentage points on every band.
        </p>
        <p style={prose}>
          There is a partial refund available if you become UK-resident within the relevant 12-month period after purchase; the deadline to claim is two years from the effective date.
        </p>
      </Section>

      {/* ═══════════════════════════════════════════
          07 — SCOTLAND LBTT
      ═══════════════════════════════════════════ */}
      <Section id="scotland" number="07" title="Scotland: LBTT and the 8% ADS">
        <p style={prose}>
          Scotland&apos;s Land and Buildings Transaction Tax replaced SDLT in Scotland on 1 April 2015. The 2025/26 residential bands run:
        </p>
        <RateTable rows={[
          ['Up to £145,000',         '0%'],
          ['£145,001 – £250,000',    '2%'],
          ['£250,001 – £325,000',    '5%'],
          ['£325,001 – £750,000',    '10%'],
          ['Above £750,000',         '12%'],
        ]} />
        <p style={prose}>
          First-time buyer relief raises the nil-rate band to £175,000 with no upper cap on eligibility. The Scottish equivalent of the 3% additional-property surcharge is the Additional Dwelling Supplement (ADS) — set at 6% from 2022 and increased to 8% from 5 December 2024 as part of the Scottish Budget. ADS is charged on the full price for any additional residential property over £40,000 and applies to all corporate buyers regardless of price.
        </p>
        <p style={prose}>
          The 36-month refund window for ADS works similarly to the SDLT equivalent. LBTT filing deadline is 30 days (versus SDLT&apos;s 14) and is administered by Revenue Scotland.
        </p>
      </Section>

      {/* ═══════════════════════════════════════════
          08 — WALES LTT
      ═══════════════════════════════════════════ */}
      <Section id="wales" number="08" title="Wales: LTT and the 5% higher-rate">
        <p style={prose}>
          Wales&apos; Land Transaction Tax replaced SDLT in Wales on 1 April 2018. The 2025 main residential bands are:
        </p>
        <RateTable rows={[
          ['Up to £225,000',           '0%'],
          ['£225,001 – £400,000',      '6%'],
          ['£400,001 – £750,000',      '7.5%'],
          ['£750,001 – £1,500,000',    '10%'],
          ['Above £1,500,000',         '12%'],
        ]} />
        <p style={prose}>
          Wales chose not to introduce a separate first-time buyer relief — the relatively high £225,000 nil-rate band covers most first-time buyer purchases already without a special tier. The Welsh equivalent of the 3% surcharge is the higher-rate residential surcharge, set at 5% (up from 4% on 11 December 2024) on additional-property purchases. There is no non-UK resident surcharge in Wales.
        </p>
        <p style={prose}>
          LTT is administered by the Welsh Revenue Authority and the filing deadline is 30 days. Wales also has no equivalent of the 15% company-flat rate — corporate dwelling purchases use standard bands plus the 5% higher-rate surcharge.
        </p>
      </Section>

      {/* ═══════════════════════════════════════════
          09 — MIXED USE
      ═══════════════════════════════════════════ */}
      <Section id="mixed-use" number="09" title="Mixed-use property — the surcharge escape">
        <p style={prose}>
          If a property has both residential and non-residential elements — a flat above a working shop, a farmhouse with substantive agricultural land, an HMO with a commercial unit attached — HMRC treats it as a mixed-use purchase. Two consequences follow.
        </p>
        <p style={prose}>
          First, non-residential SDLT rates apply: 0% to £150,000, 2% to £250,000, 5% above. These are typically lower than the residential rates for the same total price. Second, the 3% additional-property surcharge does NOT apply. For higher-value purchases this can save tens of thousands.
        </p>
        <p style={prose}>
          The catch: HMRC scrutinises mixed-use claims aggressively. The non-residential element must be a material part of the property — incidental fields, ornamental outbuildings or token shop fronts that have not been used commercially for years will not qualify. The leading case is <em>Hyman v HMRC</em> [2019], which clarified that purely residential gardens and grounds, even if extensive, do not turn a property into mixed-use.
        </p>
      </Section>

      {/* ═══════════════════════════════════════════
          10 — WORKED EXAMPLES
      ═══════════════════════════════════════════ */}
      <Section id="examples" number="10" title="Six worked examples across scenarios">
        <p style={prose}>
          Six purchases at the same £400,000 price, six very different SDLT bills:
        </p>
        <ExampleBlock label="Example 1" title="Standard buyer, £400,000">
          0% on first £125,000 = £0. 2% on next £125,000 = £2,500. 5% on final £150,000 = £7,500.<br />
          <strong>Total £10,000.</strong> Effective rate 2.5%.
        </ExampleBlock>
        <ExampleBlock label="Example 2" title="First-time buyer, £400,000">
          0% on first £300,000 = £0. 5% on next £100,000 = £5,000.<br />
          <strong>Total £5,000.</strong> Saves £5,000 versus standard.
        </ExampleBlock>
        <ExampleBlock label="Example 3" title="First-time buyer, £600,000 (over the cap)">
          Relief lost — purchase price exceeds £500,000 cap. Standard rates apply to full price: 0% + £2,500 + 5% on £350,000 (£17,500).<br />
          <strong>Total £20,000.</strong>
        </ExampleBlock>
        <ExampleBlock label="Example 4" title="Second home / buy-to-let, £400,000">
          Standard SDLT £10,000. Plus 3% surcharge on full £400,000 = £12,000.<br />
          <strong>Total £22,000.</strong>
        </ExampleBlock>
        <ExampleBlock label="Example 5" title="Non-UK resident, £400,000">
          Standard SDLT £10,000. Plus 2% surcharge on full £400,000 = £8,000.<br />
          <strong>Total £18,000.</strong>
        </ExampleBlock>
        <ExampleBlock label="Example 6" title="Non-UK resident buying a second home, £400,000">
          Standard SDLT £10,000. Plus 3% surcharge (£12,000). Plus 2% surcharge (£8,000).<br />
          <strong>Total £30,000.</strong> Six times the FTB equivalent at the same price.
        </ExampleBlock>
      </Section>

      {/* ═══════════════════════════════════════════
          11 — COMMON MISTAKES
      ═══════════════════════════════════════════ */}
      <Section id="mistakes" number="11" title="Common mistakes and pitfalls">
        <NumberedList items={[
          'Claiming first-time buyer relief when a spouse, civil partner or co-buyer has previously owned property anywhere in the world. The relief is denied for the entire purchase, not just their share.',
          'Failing to apply the 3% surcharge to a second home when you already own a buy-to-let or have inherited a share in another property anywhere in the world. HMRC checks Land Registry records.',
          'Buying a "main residence" while still owning the previous one without completing the sale first. The 3% surcharge applies even with intent to sell, and the refund must be claimed actively within 36 months.',
          'Incorrectly claiming mixed-use status for properties with token commercial elements such as paddocks or unused outbuildings. The Hyman ruling is the line.',
          'Missing the 14-day filing deadline. Most conveyancers handle this automatically, but DIY purchases or transfers of equity often miss it. Penalty starts at £100.',
        ]} />
      </Section>

      {/* ═══════════════════════════════════════════
          12 — FILING + PENALTIES
      ═══════════════════════════════════════════ */}
      <Section id="filing" number="12" title="Filing, payment and penalty schedule">
        <p style={prose}>
          SDLT returns are filed via the HMRC Stamp Taxes Online service, usually by your solicitor as part of completion. Payment is due at the same time.
        </p>
        <p style={prose}>
          If you miss the 14-day deadline: £100 fixed penalty after one day late; an additional £100 (£200 total) after three months; and a tax-geared penalty of up to 100% of the SDLT due in serious cases of deliberate failure. Interest accrues from day one of lateness at the HMRC late-payment rate, currently 7.75% as of November 2024 (it varies with Bank Rate).
        </p>
        <p style={prose}>
          For LBTT, the equivalent deadlines and penalties are administered by Revenue Scotland; for LTT, by the Welsh Revenue Authority. In all three regimes, the buyer remains legally responsible for the tax even if they instructed a third party to file and pay — so check that your conveyancer has actually completed the filing after completion.
        </p>
      </Section>

      {/* ═══════════════════════════════════════════
          13 — COMPANIES + TRUSTS
      ═══════════════════════════════════════════ */}
      <Section id="companies" number="13" title="Companies, trusts and special structures">
        <p style={prose}>
          A non-natural person — a company, a partnership of companies, or a collective investment scheme — buying a single dwelling worth more than £500,000 in England or Northern Ireland pays a flat 15% SDLT on the entire price, unless a specific relief applies. Typical reliefs: property let to unconnected third parties on commercial terms, property used in a property-developer trade, dwellings used as employee accommodation.
        </p>
        <p style={prose}>
          The 15% rate is anti-avoidance legislation aimed at preventing wealthy individuals from acquiring residential property through corporate envelopes to dodge SDLT. Where the 15% applies, the Annual Tax on Enveloped Dwellings (ATED) — a separate annual charge ranging from £4,400 to £287,000 depending on property value — also kicks in.
        </p>
        <p style={prose}>
          Scotland and Wales handle corporate purchases differently. Scotland applies the standard LBTT bands plus the 8% ADS. Wales applies the standard LTT bands plus the 5% higher-rate surcharge. Neither has a 15%-flat equivalent.
        </p>
      </Section>

      {/* ═══════════════════════════════════════════
          14 — FAQ
      ═══════════════════════════════════════════ */}
      <Section id="faq" number="14" title="Frequently asked questions">
        <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {FAQS.map((item, i) => (
            <li key={i} style={{
              borderTop: i === 0 ? `1px solid ${T.hair}` : 'none',
              borderBottom: `1px solid ${T.hair}`,
              padding: '24px 0',
            }}>
              <h3 style={{
                fontSize: 17, fontWeight: 600, color: T.ink,
                lineHeight: 1.4, margin: 0,
                letterSpacing: '-0.005em',
              }}>{item.q}</h3>
              <p style={{
                fontSize: 15, lineHeight: 1.65, color: T.body,
                margin: '10px 0 0',
              }}>{item.a}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ═══════════════════════════════════════════
          15 — SOURCES + METHODOLOGY
      ═══════════════════════════════════════════ */}
      <Section id="sources" number="15" title="Sources and methodology">
        <p style={prose}>
          We apply HMRC&apos;s SDLT slab rates for England and Northern Ireland (post-April 2025), Revenue Scotland&apos;s LBTT rates with the 8% ADS surcharge effective 5 December 2024, and the Welsh Revenue Authority&apos;s LTT rates with the 5% higher-rate surcharge effective 11 December 2024. Surcharges are applied to the full purchase price, not just the portion above the nil-rate band. Mixed-use and company-bought rules follow HMRC manuals SDLTM07550 and SDLTM09700.
        </p>
        <SourceList items={[
          { label: 'gov.uk · Stamp Duty Land Tax',      href: 'https://www.gov.uk/stamp-duty-land-tax' },
          { label: 'gov.uk · SDLT residential rates',   href: 'https://www.gov.uk/stamp-duty-land-tax/residential-property-rates' },
          { label: 'gov.uk · First-time buyer relief',  href: 'https://www.gov.uk/government/publications/stamp-duty-land-tax-relief-for-first-time-buyers' },
          { label: 'gov.uk · 3% higher-rates guidance', href: 'https://www.gov.uk/government/publications/stamp-duty-land-tax-higher-rates-for-purchases-of-additional-residential-properties' },
          { label: 'Revenue Scotland · LBTT',           href: 'https://revenue.scot/taxes/land-buildings-transaction-tax' },
          { label: 'Revenue Scotland · ADS',            href: 'https://revenue.scot/taxes/land-buildings-transaction-tax/additional-dwelling-supplement-ads' },
          { label: 'Welsh Revenue Authority · LTT',     href: 'https://gov.wales/land-transaction-tax-rates-and-bands' },
          { label: 'HMRC manual SDLTM07550',            href: 'https://www.gov.uk/hmrc-internal-manuals/stamp-duty-land-tax-manual/sdltm07550' },
        ]} />
        <div style={{
          marginTop: 32, paddingTop: 24,
          borderTop: `1px solid ${T.hair}`,
          fontSize: 13, lineHeight: 1.6, color: T.muted,
        }}>
          <p style={{ margin: 0 }}>
            For guidance only. This calculator does not constitute tax or legal advice. For complex situations — multiple properties, mixed-use claims, corporate purchases, trusts, divorce-related transfers — consult a qualified conveyancer, solicitor or tax adviser.
          </p>
          <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/sources" style={{ color: T.muted, textDecoration: 'underline', textUnderlineOffset: 3 }}>
              All site sources
            </Link>
            <span style={{ color: T.faint }}>·</span>
            <Link href="/editorial-policy" style={{ color: T.muted, textDecoration: 'underline', textUnderlineOffset: 3 }}>
              Editorial policy
            </Link>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          RELATED
      ═══════════════════════════════════════════ */}
      <section style={{ paddingTop: 80, paddingBottom: 120, borderTop: `1px solid ${T.hair}` }}>
        <Container>
          <Eyebrow>Related calculators</Eyebrow>
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 0 }}>
            {[
              { href: '/mortgage-affordability', title: 'Mortgage affordability',  desc: 'How much you can borrow + monthly repayment.' },
              { href: '/take-home-pay',          title: 'Take-home pay',           desc: 'Net salary after PAYE, NI and pension.' },
              { href: '/council-tax-band',       title: 'Council Tax band',        desc: 'Annual council tax for any UK postcode.' },
            ].map((r, i, arr) => (
              <Link key={r.href} href={r.href} style={{
                padding: '20px 0',
                borderTop: `1px solid ${T.hair}`,
                borderBottom: i === arr.length - 1 ? `1px solid ${T.hair}` : 'none',
                textDecoration: 'none', color: T.ink,
              }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.ink }}>{r.title} →</div>
                <div style={{ fontSize: 13, color: T.muted, marginTop: 4, lineHeight: 1.5 }}>{r.desc}</div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT PRIMITIVES
───────────────────────────────────────────── */
function Container({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px, 4vw, 32px)' }}>
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: T.muted,
      letterSpacing: '0.10em', textTransform: 'uppercase',
    }}>{children}</div>
  );
}

function Section({
  id, number, title, children,
}: { id: string; number: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{
      paddingTop: 'clamp(64px, 9vw, 96px)',
      paddingBottom: 'clamp(64px, 9vw, 96px)',
      borderTop: `1px solid ${T.hair}`,
      scrollMarginTop: 80,
    }}>
      <Container>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, marginBottom: 36 }}>
          <span style={{
            fontSize: 13, fontWeight: 600, color: T.faint,
            fontVariantNumeric: NUM, letterSpacing: '0.04em',
            minWidth: 24,
          }}>{number}</span>
          <h2 style={{
            fontSize: 'clamp(22px, 3.2vw, 30px)',
            fontWeight: 600, lineHeight: 1.2,
            letterSpacing: '-0.018em', color: T.ink,
            margin: 0,
          }}>{title}</h2>
        </div>
        {children}
      </Container>
    </section>
  );
}

/* Common prose style */
const prose: React.CSSProperties = {
  fontSize: 16, lineHeight: 1.7, color: T.body,
  margin: '0 0 20px',
};

/* Inline rate table for band lists */
function RateTable({ rows }: { rows: [string, string][] }) {
  return (
    <table style={{
      width: '100%', borderCollapse: 'collapse',
      margin: '8px 0 24px', fontSize: 14.5,
    }}>
      <tbody>
        {rows.map(([band, rate], i) => (
          <tr key={i} style={{
            borderTop: i === 0 ? `1px solid ${T.hair}` : 'none',
            borderBottom: `1px solid ${T.divide}`,
          }}>
            <td style={{ padding: '12px 0', color: T.body }}>{band}</td>
            <td style={{
              padding: '12px 0', textAlign: 'right',
              fontVariantNumeric: NUM, color: T.ink, fontWeight: 500,
            }}>{rate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* Worked example block */
function ExampleBlock({
  label, title, children,
}: { label: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ margin: '0 0 20px', paddingLeft: 16, borderLeft: `2px solid ${T.divide}` }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: T.faint,
        letterSpacing: '0.10em', textTransform: 'uppercase',
        marginBottom: 6,
      }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, marginBottom: 8 }}>{title}</div>
      <p style={{ fontSize: 14.5, lineHeight: 1.65, color: T.body, margin: 0 }}>{children}</p>
    </div>
  );
}

/* Numbered list */
function NumberedList({ items }: { items: string[] }) {
  return (
    <ol style={{ listStyle: 'none', counterReset: 'pitfall', padding: 0, margin: 0 }}>
      {items.map((it, i) => (
        <li key={i} style={{
          display: 'flex', gap: 16, alignItems: 'flex-start',
          padding: '16px 0',
          borderTop: i === 0 ? `1px solid ${T.hair}` : 'none',
          borderBottom: `1px solid ${T.divide}`,
        }}>
          <span style={{
            fontSize: 12, color: T.faint, fontVariantNumeric: NUM,
            minWidth: 22, fontWeight: 500, marginTop: 2,
          }}>{String(i + 1).padStart(2, '0')}</span>
          <span style={{ fontSize: 15, lineHeight: 1.65, color: T.body }}>{it}</span>
        </li>
      ))}
    </ol>
  );
}

/* Source list */
function SourceList({ items }: { items: { label: string; href: string }[] }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
      {items.map((it, i) => (
        <li key={it.href} style={{
          borderTop: i === 0 ? `1px solid ${T.hair}` : 'none',
          borderBottom: `1px solid ${T.divide}`,
        }}>
          <a href={it.href} target="_blank" rel="noopener noreferrer" style={{
            display: 'block', padding: '12px 0',
            fontSize: 14, color: T.ink, textDecoration: 'none',
          }}>
            {it.label} <span style={{ color: T.faint, marginLeft: 6, fontSize: 11 }}>↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
