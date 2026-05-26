import type { Metadata } from 'next';
import Link from 'next/link';
import SdltClient from './SdltClient';
import EditorByline from '../../components/EditorByline';
import FaqJsonLd from '../../components/calc-shell/FaqJsonLd';
import { primaryEditorSchema } from '../../data/editorialTeam';

export const metadata: Metadata = {
  title: 'UK Stamp Duty Calculator 2026 — SDLT, LBTT, LTT for England, Scotland & Wales',
  description: 'Free interactive UK stamp duty calculator. Live SDLT, LBTT and LTT comparison across 7 buyer scenarios and 3 countries. First-time buyer relief, 3% additional-property surcharge, 2% non-resident surcharge, 36-month refund tool. Verified against gov.uk, Revenue Scotland and the WRA.',
  alternates: { canonical: '/stamp-duty-calculator' },
  openGraph: {
    title: 'UK Stamp Duty Calculator 2026 — Interactive SDLT, LBTT, LTT',
    description: 'Live SDLT, LBTT and LTT across all UK buyer scenarios. Verified May 2026.',
    url: 'https://ukvisainfo.co.uk/stamp-duty-calculator',
    type: 'article',
  },
};

/* ─────────────────────────────────────────────
   TOKENS
───────────────────────────────────────────── */
const T = {
  ink:      '#0A0E1F',
  body:     '#2D3748',
  muted:    '#64748B',
  faint:    '#94A3B8',
  paper:    '#FFFFFF',
  page:     '#F8FAFC',
  hair:     '#E2E8F0',
  divide:   '#F1F5F9',
  emerald:  '#047857',
  emeraldT: '#ECFDF5',
  gold:     '#B8860B',
  goldT:    '#FEF3C7',
  blue:     '#2563EB',
  blueT:    '#EFF6FF',
};
const FONT = 'Inter, system-ui, -apple-system, sans-serif';
const NUM  = 'tabular-nums';

/* ─────────────────────────────────────────────
   FAQ + TOC DATA
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

const SECTIONS = [
  { id: 'how-it-works',   label: 'How SDLT actually works' },
  { id: 'standard-bands', label: 'The five standard bands' },
  { id: 'ftb',            label: 'First-time buyer relief and the £500k cliff' },
  { id: 'additional',     label: 'The 3% additional-property surcharge' },
  { id: 'non-resident',   label: 'The 2% non-UK resident surcharge' },
  { id: 'scotland',       label: 'Scotland: LBTT and the 8% ADS' },
  { id: 'wales',          label: 'Wales: LTT and the 5% higher-rate' },
  { id: 'mixed-use',      label: 'Mixed-use property' },
  { id: 'mistakes',       label: 'Common mistakes and pitfalls' },
  { id: 'filing',         label: 'Filing, payment and penalties' },
  { id: 'companies',      label: 'Companies and special structures' },
];

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
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
    <main style={{ background: T.page, color: T.ink, fontFamily: FONT, minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <FaqJsonLd faqs={FAQS} />

      {/* ════════════════════════════════════════════
          HERO BAR — compact, full-width with stats
      ════════════════════════════════════════════ */}
      <header style={{ background: T.paper, borderBottom: `1px solid ${T.hair}` }}>
        <Wrapper>
          <div style={{ paddingTop: 'clamp(96px, 12vh, 128px)', paddingBottom: 32 }}>

            {/* Breadcrumb + meta strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.muted, marginBottom: 24 }}>
              <Link href="/" style={{ color: T.muted, textDecoration: 'none' }}>Home</Link>
              <span style={{ color: T.faint }}>›</span>
              <Link href="/tools" style={{ color: T.muted, textDecoration: 'none' }}>Calculators</Link>
              <span style={{ color: T.faint }}>›</span>
              <span style={{ color: T.ink, fontWeight: 500 }}>Stamp Duty</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }} className="lg:grid-cols-[1fr_360px]">
              {/* Left: title block */}
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '4px 10px', borderRadius: 999,
                  background: T.emeraldT, color: T.emerald,
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                  marginBottom: 16,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.emerald }} />
                  Live · Updated May 2026
                </div>
                <h1 style={{
                  fontSize: 'clamp(28px, 4.2vw, 48px)',
                  fontWeight: 700, lineHeight: 1.05,
                  letterSpacing: '-0.028em', color: T.ink,
                  margin: 0, maxWidth: '20ch',
                }}>
                  UK Stamp Duty Calculator
                </h1>
                <p style={{
                  fontSize: 'clamp(15px, 1.5vw, 17px)',
                  lineHeight: 1.5, color: T.body,
                  margin: '16px 0 0', maxWidth: '52ch',
                }}>
                  Live SDLT (England &amp; NI), LBTT (Scotland) and LTT (Wales) across all seven buyer scenarios. Verified against gov.uk, Revenue Scotland and the Welsh Revenue Authority.
                </p>
                <div style={{
                  marginTop: 24, display: 'flex', flexWrap: 'wrap',
                  gap: 16, alignItems: 'center', fontSize: 13, color: T.muted,
                }}>
                  <EditorByline verified="May 2026" prefix="By" />
                  <span style={{ color: T.faint }}>·</span>
                  <span>12 min read</span>
                  <span style={{ color: T.faint }}>·</span>
                  <span>SDLT · LBTT · LTT</span>
                </div>
              </div>

              {/* Right: at-a-glance stats */}
              <div style={{
                background: T.page, borderRadius: 12, padding: 20,
                border: `1px solid ${T.hair}`,
              }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: T.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                  At a glance · April 2025+
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  {[
                    { v: '£125k', l: 'Nil-rate band'    },
                    { v: '£300k', l: 'FTB nil-rate'     },
                    { v: '+3%',   l: 'Additional surch.' },
                    { v: '+2%',   l: 'Non-resident'    },
                    { v: '14d',   l: 'SDLT filing'     },
                    { v: '36mo',  l: 'Refund window'   },
                  ].map((s, i) => (
                    <div key={i}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: T.ink, fontVariantNumeric: NUM, letterSpacing: '-0.018em', lineHeight: 1.1 }}>{s.v}</div>
                      <div style={{ fontSize: 10.5, color: T.muted, marginTop: 3 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Wrapper>
      </header>

      {/* ════════════════════════════════════════════
          CALCULATOR DASHBOARD — full bleed
      ════════════════════════════════════════════ */}
      <section style={{ paddingTop: 24, paddingBottom: 48 }}>
        <Wrapper>
          <SdltClient initialPrice={350000} />
        </Wrapper>
      </section>

      {/* ════════════════════════════════════════════
          GUIDE — 2-column article + sticky TOC
      ════════════════════════════════════════════ */}
      <section style={{ background: T.paper, borderTop: `1px solid ${T.hair}`, paddingTop: 64, paddingBottom: 80 }}>
        <Wrapper>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48 }} className="lg:grid-cols-[260px_1fr]">

            {/* Sticky TOC */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div style={{ fontSize: 10.5, fontWeight: 700, color: T.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                In this guide
              </div>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {SECTIONS.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} style={{
                      display: 'flex', alignItems: 'baseline', gap: 12,
                      padding: '8px 0', textDecoration: 'none',
                      color: T.body, fontSize: 13, lineHeight: 1.4,
                      borderLeft: `2px solid transparent`, paddingLeft: 12, marginLeft: -14,
                    }}>
                      <span style={{ fontSize: 11, color: T.faint, fontVariantNumeric: NUM, minWidth: 18, fontWeight: 500 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{s.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            {/* Article */}
            <article style={{ maxWidth: 720 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: T.gold, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                The complete guide
              </div>
              <h2 style={{
                fontSize: 'clamp(24px, 3vw, 34px)',
                fontWeight: 700, lineHeight: 1.15,
                letterSpacing: '-0.02em', color: T.ink,
                margin: '0 0 32px', maxWidth: '24ch',
              }}>
                Everything you need to know about UK stamp duty in 2026
              </h2>

              <Block id="how-it-works" num="01" title="How SDLT actually works">
                <p style={prose}>
                  Stamp Duty Land Tax is a one-off tax paid to HMRC whenever you buy a residential property, a piece of land, or a building over a set price in England and Northern Ireland. Scotland and Wales operate separate equivalent taxes — Land and Buildings Transaction Tax (LBTT) and Land Transaction Tax (LTT) — with their own rates, bands and surcharges set by the devolved governments.
                </p>
                <p style={prose}>
                  The tax is calculated on a slab basis: each band&apos;s percentage applies only to the portion of the purchase price that falls within that band, not to the whole price. A £400,000 purchase by a standard buyer triggers 0% on the first £125,000, 2% on the next £125,000 (£2,500), and 5% on the final £150,000 (£7,500) — total £10,000.
                </p>
                <Callout tone="blue" title="Why effective rate is always lower than top marginal rate">
                  Because rates are slab-based, the &quot;effective rate&quot; on the bill is always below the highest band touched. A £600,000 standard purchase pays 0% + 2% + 5% — total £20,000, an effective 3.33%, even though the top band is 5%.
                </Callout>
              </Block>

              <Block id="standard-bands" num="02" title="The five standard bands">
                <p style={prose}>
                  For a standard residential purchase — you&apos;re replacing your main home, or it&apos;s your only property — the bands are:
                </p>
                <BandTable rows={[
                  ['Up to £125,000',           '0%'],
                  ['£125,001 – £250,000',      '2%'],
                  ['£250,001 – £925,000',      '5%'],
                  ['£925,001 – £1,500,000',    '10%'],
                  ['Above £1,500,000',         '12%'],
                ]} />
              </Block>

              <Block id="ftb" num="03" title="First-time buyer relief and the £500k cliff">
                <p style={prose}>
                  First-time buyers — people who have never owned a residential property anywhere in the world, including in joint name with anyone else — get a more generous nil-rate band: 0% up to £300,000, then 5% on the portion between £300,001 and £500,000.
                </p>
                <Callout tone="warn" title="The cliff edge at £500,001">
                  Buy at exactly £500,000 and you pay £10,000 SDLT. Buy at £500,001 and you lose the relief entirely — standard rates apply to the full price. Negotiating a £2 reduction can be the difference between £10,000 and the full standard bill.
                </Callout>
                <p style={prose}>
                  At lower prices the relief saves up to £15,000 versus standard rates. Always check both calculations for prices near £500k.
                </p>
              </Block>

              <Block id="additional" num="04" title="The 3% additional-property surcharge">
                <p style={prose}>
                  If you already own a residential property anywhere in the world and you&apos;re buying another — buy-to-let, holiday home, second residence — you pay an extra 3 percentage points on every SDLT band, calculated on the full purchase price.
                </p>
                <p style={prose}>
                  A £400,000 second home incurs the £10,000 standard SDLT plus a surcharge of 3% × £400,000 = £12,000. Total £22,000, more than double the standard bill.
                </p>
                <Callout tone="emerald" title="The 36-month refund window">
                  If you complete on the new home before selling the old, the surcharge applies upfront — but you can claim it back if you sell the previous main residence within 36 months. Use the refund eligibility checker above.
                </Callout>
              </Block>

              <Block id="non-resident" num="05" title="The 2% non-UK resident surcharge">
                <p style={prose}>
                  Since 1 April 2021, a 2% surcharge applies to residential purchases by buyers who have not been UK-resident for at least 183 days in the 12 months ending with the effective date of the transaction. Residence is tested under SDLT-specific rules, which differ from the general Statutory Residence Test used for income tax.
                </p>
                <p style={prose}>
                  The surcharge stacks with the 3% additional-property surcharge — a non-UK resident buying a second home pays an extra 5 percentage points on every band. There is a partial refund available if you become UK-resident within the relevant 12-month period after purchase.
                </p>
              </Block>

              <Block id="scotland" num="06" title="Scotland: LBTT and the 8% ADS">
                <p style={prose}>
                  Scotland&apos;s Land and Buildings Transaction Tax replaced SDLT in Scotland on 1 April 2015. The 2025/26 residential bands run:
                </p>
                <BandTable rows={[
                  ['Up to £145,000',         '0%'],
                  ['£145,001 – £250,000',    '2%'],
                  ['£250,001 – £325,000',    '5%'],
                  ['£325,001 – £750,000',    '10%'],
                  ['Above £750,000',         '12%'],
                ]} />
                <p style={prose}>
                  First-time buyer relief raises the nil-rate band to £175,000. The Scottish equivalent of the 3% additional-property surcharge is the Additional Dwelling Supplement (ADS) — increased to 8% from 5 December 2024.
                </p>
              </Block>

              <Block id="wales" num="07" title="Wales: LTT and the 5% higher-rate">
                <p style={prose}>
                  Wales&apos; Land Transaction Tax replaced SDLT in Wales on 1 April 2018. The 2025 main residential bands are:
                </p>
                <BandTable rows={[
                  ['Up to £225,000',           '0%'],
                  ['£225,001 – £400,000',      '6%'],
                  ['£400,001 – £750,000',      '7.5%'],
                  ['£750,001 – £1,500,000',    '10%'],
                  ['Above £1,500,000',         '12%'],
                ]} />
                <p style={prose}>
                  Wales chose not to introduce a separate first-time buyer relief — the relatively high £225,000 nil-rate band covers most first-time buyer purchases without a special tier. The higher-rate residential surcharge is 5% (up from 4% on 11 December 2024). There is no non-UK resident surcharge in Wales.
                </p>
              </Block>

              <Block id="mixed-use" num="08" title="Mixed-use property — the surcharge escape">
                <p style={prose}>
                  If a property has both residential and non-residential elements — a flat above a working shop, a farmhouse with substantive agricultural land — HMRC treats it as a mixed-use purchase. Non-residential SDLT rates apply: 0% to £150,000, 2% to £250,000, 5% above. And the 3% additional-property surcharge does NOT apply.
                </p>
                <Callout tone="warn" title="HMRC scrutinises mixed-use claims">
                  The non-residential element must be material. Incidental fields, ornamental outbuildings or token shop fronts that haven&apos;t been used commercially won&apos;t qualify. The leading case is <em>Hyman v HMRC</em> [2019].
                </Callout>
              </Block>

              <Block id="mistakes" num="09" title="Common mistakes and pitfalls">
                <ol style={pitfallList}>
                  {[
                    'Claiming first-time buyer relief when a spouse, civil partner or co-buyer has previously owned property anywhere in the world. The relief is denied for the entire purchase.',
                    'Failing to apply the 3% surcharge to a second home when you already own a buy-to-let or have inherited a share in another property. HMRC checks Land Registry records.',
                    'Buying a "main residence" while still owning the previous one without completing the sale first. The 3% surcharge applies even with intent to sell.',
                    'Incorrectly claiming mixed-use status for properties with token commercial elements such as paddocks or unused outbuildings.',
                    'Missing the 14-day filing deadline. Most conveyancers handle this automatically, but DIY purchases or transfers of equity often miss it.',
                  ].map((p, i) => (
                    <li key={i}>
                      <span style={{ fontSize: 11, color: T.gold, fontVariantNumeric: NUM, fontWeight: 700, letterSpacing: '0.06em' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ol>
              </Block>

              <Block id="filing" num="10" title="Filing, payment and penalty schedule">
                <p style={prose}>
                  SDLT returns are filed via the HMRC Stamp Taxes Online service, usually by your solicitor as part of completion. Payment is due at the same time.
                </p>
                <p style={prose}>
                  Miss the 14-day deadline and: £100 fixed penalty after one day late; an additional £100 (£200 total) after three months; and a tax-geared penalty of up to 100% of the SDLT due in serious cases of deliberate failure. Interest accrues from day one at the HMRC late-payment rate (7.75% as of November 2024).
                </p>
                <p style={prose}>
                  For LBTT and LTT, equivalent deadlines and penalties are administered by Revenue Scotland and the Welsh Revenue Authority respectively (both 30 days). The buyer remains legally responsible even if a third party files on their behalf.
                </p>
              </Block>

              <Block id="companies" num="11" title="Companies, trusts and special structures">
                <p style={prose}>
                  A non-natural person — a company, partnership of companies, or collective investment scheme — buying a single dwelling worth more than £500,000 in England or Northern Ireland pays a flat 15% SDLT on the entire price, unless a specific relief applies (typically: property let to unconnected third parties, used in a property-developer trade, or as employee accommodation).
                </p>
                <p style={prose}>
                  Where 15% applies, the Annual Tax on Enveloped Dwellings (ATED) also kicks in — a separate annual charge from £4,400 to £287,000 depending on property value. Scotland and Wales don&apos;t have a 15%-flat equivalent; corporate purchases use standard bands plus the ADS (8%) or higher-rate (5%) surcharge respectively.
                </p>
              </Block>
            </article>
          </div>
        </Wrapper>
      </section>

      {/* ════════════════════════════════════════════
          FAQ — card grid
      ════════════════════════════════════════════ */}
      <section style={{ background: T.page, paddingTop: 64, paddingBottom: 80, borderTop: `1px solid ${T.hair}` }}>
        <Wrapper>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: T.gold, letterSpacing: '0.12em', textTransform: 'uppercase' }}>FAQ</div>
            <h2 style={{
              fontSize: 'clamp(22px, 2.8vw, 30px)', fontWeight: 700, lineHeight: 1.2,
              letterSpacing: '-0.02em', color: T.ink, margin: '8px 0 0',
            }}>
              Frequently asked questions
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {FAQS.map((f, i) => (
              <details key={i} style={{
                background: T.paper, border: `1px solid ${T.hair}`,
                borderRadius: 10, padding: '18px 20px',
              }}>
                <summary style={{
                  cursor: 'pointer', listStyle: 'none',
                  fontSize: 14.5, fontWeight: 600, color: T.ink,
                  lineHeight: 1.4, display: 'flex', alignItems: 'flex-start', gap: 10,
                }}>
                  <span style={{ fontSize: 11, color: T.gold, fontVariantNumeric: NUM, fontWeight: 700, letterSpacing: '0.06em', marginTop: 2 }}>
                    Q{String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{f.q}</span>
                </summary>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: T.body, margin: '12px 0 0 28px' }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </Wrapper>
      </section>

      {/* ════════════════════════════════════════════
          SOURCES — card grid
      ════════════════════════════════════════════ */}
      <section style={{ background: T.paper, paddingTop: 64, paddingBottom: 64, borderTop: `1px solid ${T.hair}` }}>
        <Wrapper>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: T.gold, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Sources &amp; methodology</div>
            <h2 style={{
              fontSize: 'clamp(22px, 2.8vw, 30px)', fontWeight: 700, lineHeight: 1.2,
              letterSpacing: '-0.02em', color: T.ink, margin: '8px 0 0', maxWidth: '36ch',
            }}>
              Every figure verified against primary sources
            </h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: T.body, margin: '12px 0 0', maxWidth: '60ch' }}>
              SDLT rates from HMRC effective April 2025. LBTT rates from Revenue Scotland with the 8% ADS effective 5 December 2024. LTT rates from the Welsh Revenue Authority with the 5% higher-rate surcharge effective 11 December 2024.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {[
              { label: 'gov.uk · Stamp Duty Land Tax',      href: 'https://www.gov.uk/stamp-duty-land-tax',                                                                                  src: 'HMRC' },
              { label: 'gov.uk · SDLT residential rates',   href: 'https://www.gov.uk/stamp-duty-land-tax/residential-property-rates',                                                       src: 'HMRC' },
              { label: 'gov.uk · First-time buyer relief',  href: 'https://www.gov.uk/government/publications/stamp-duty-land-tax-relief-for-first-time-buyers',                             src: 'HMRC' },
              { label: 'gov.uk · 3% higher rates',          href: 'https://www.gov.uk/government/publications/stamp-duty-land-tax-higher-rates-for-purchases-of-additional-residential-properties', src: 'HMRC' },
              { label: 'Revenue Scotland · LBTT',           href: 'https://revenue.scot/taxes/land-buildings-transaction-tax',                                                                src: 'RS'   },
              { label: 'Revenue Scotland · ADS',            href: 'https://revenue.scot/taxes/land-buildings-transaction-tax/additional-dwelling-supplement-ads',                            src: 'RS'   },
              { label: 'Welsh Revenue Authority · LTT',     href: 'https://gov.wales/land-transaction-tax-rates-and-bands',                                                                  src: 'WRA'  },
              { label: 'HMRC manual SDLTM07550',            href: 'https://www.gov.uk/hmrc-internal-manuals/stamp-duty-land-tax-manual/sdltm07550',                                          src: 'HMRC' },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                display: 'block', padding: 16,
                background: T.page, border: `1px solid ${T.hair}`,
                borderRadius: 8, textDecoration: 'none',
                transition: 'border-color 0.12s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.src}</span>
                  <span style={{ fontSize: 12, color: T.faint }}>↗</span>
                </div>
                <div style={{ fontSize: 13.5, color: T.ink, fontWeight: 500, lineHeight: 1.4 }}>{s.label}</div>
              </a>
            ))}
          </div>
          <div style={{
            marginTop: 32, padding: 20, background: T.page,
            borderRadius: 10, border: `1px solid ${T.hair}`,
            fontSize: 13, lineHeight: 1.65, color: T.muted,
          }}>
            <strong style={{ color: T.body }}>Disclaimer.</strong> This calculator is for guidance only and does not constitute tax or legal advice. For complex situations — multiple properties, mixed-use claims, corporate purchases, trusts, divorce-related transfers — consult a qualified conveyancer, solicitor or tax adviser.{' '}
            <Link href="/sources" style={{ color: T.blue, textDecoration: 'underline', textUnderlineOffset: 3 }}>All site sources</Link>
            {' · '}
            <Link href="/editorial-policy" style={{ color: T.blue, textDecoration: 'underline', textUnderlineOffset: 3 }}>Editorial policy</Link>
          </div>
        </Wrapper>
      </section>

      {/* ════════════════════════════════════════════
          RELATED CALCULATORS
      ════════════════════════════════════════════ */}
      <section style={{ background: T.page, paddingTop: 48, paddingBottom: 80, borderTop: `1px solid ${T.hair}` }}>
        <Wrapper>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: T.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            Related calculators
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { href: '/mortgage-affordability', title: 'Mortgage affordability',  desc: 'How much you can borrow with stress test.', tag: 'Property' },
              { href: '/take-home-pay',          title: 'Take-home pay',           desc: 'Net salary after PAYE, NI and pension.',     tag: 'Income' },
              { href: '/council-tax-band',       title: 'Council Tax band',        desc: 'Annual council tax for any UK postcode.',    tag: 'Property' },
              { href: '/ihs-calculator',         title: 'Visa IHS calculator',     desc: 'Immigration Health Surcharge per year.',     tag: 'Visa' },
            ].map((r) => (
              <Link key={r.href} href={r.href} style={{
                display: 'block', padding: 20,
                background: T.paper, border: `1px solid ${T.hair}`,
                borderRadius: 10, textDecoration: 'none',
              }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: T.gold, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{r.tag}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, lineHeight: 1.3 }}>{r.title}</div>
                <div style={{ fontSize: 13, color: T.muted, marginTop: 6, lineHeight: 1.5 }}>{r.desc}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.blue, marginTop: 14 }}>Open →</div>
              </Link>
            ))}
          </div>
        </Wrapper>
      </section>
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LAYOUT PRIMITIVES
═══════════════════════════════════════════════════════════════ */
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 1640, margin: '0 auto', padding: '0 clamp(16px, 3vw, 40px)' }}>
      {children}
    </div>
  );
}

function Block({
  id, num, title, children,
}: { id: string; num: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 56, scrollMarginTop: 96 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 20 }}>
        <span style={{
          display: 'inline-flex', width: 30, height: 24, alignItems: 'center', justifyContent: 'center',
          background: T.emeraldT, color: T.emerald, borderRadius: 4,
          fontSize: 11, fontWeight: 700, fontVariantNumeric: NUM, letterSpacing: '0.04em',
        }}>{num}</span>
        <h3 style={{
          fontSize: 'clamp(20px, 2.2vw, 24px)',
          fontWeight: 700, lineHeight: 1.25,
          letterSpacing: '-0.018em', color: T.ink, margin: 0,
        }}>{title}</h3>
      </div>
      {children}
    </section>
  );
}

const prose: React.CSSProperties = {
  fontSize: 15.5, lineHeight: 1.7, color: T.body, margin: '0 0 16px',
};

const pitfallList: React.CSSProperties = {
  listStyle: 'none', padding: 0, margin: 0,
};

function BandTable({ rows }: { rows: [string, string][] }) {
  return (
    <table style={{
      width: '100%', borderCollapse: 'collapse',
      margin: '8px 0 20px', fontSize: 14.5,
      background: T.page, borderRadius: 8, overflow: 'hidden',
      border: `1px solid ${T.hair}`,
    }}>
      <tbody>
        {rows.map(([band, rate], i) => (
          <tr key={i} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${T.hair}` : 'none' }}>
            <td style={{ padding: '12px 16px', color: T.body }}>{band}</td>
            <td style={{
              padding: '12px 16px', textAlign: 'right',
              fontVariantNumeric: NUM, color: T.emerald, fontWeight: 700,
            }}>{rate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Callout({ tone, title, children }: { tone: 'blue' | 'warn' | 'emerald'; title: string; children: React.ReactNode }) {
  const styles = {
    blue:    { bg: T.blueT,    fg: T.blue    },
    warn:    { bg: T.goldT,    fg: T.gold    },
    emerald: { bg: T.emeraldT, fg: T.emerald },
  };
  const s = styles[tone];
  return (
    <div style={{
      margin: '8px 0 20px', padding: 18,
      background: s.bg, borderLeft: `3px solid ${s.fg}`, borderRadius: '0 8px 8px 0',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: s.fg, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.65, color: T.body }}>
        {children}
      </div>
    </div>
  );
}
