import type { Metadata } from 'next';
import Link from 'next/link';
import SdltClient from './SdltClient';
import EditorByline from '../../components/EditorByline';
import FaqJsonLd from '../../components/calc-shell/FaqJsonLd';
import { primaryEditorSchema } from '../../data/editorialTeam';

export const metadata: Metadata = {
  title: 'UK Stamp Duty Calculator 2026 — SDLT, LBTT, LTT',
  description: 'Live UK stamp duty calculator with price-sensitivity chart and scenario comparison. SDLT, LBTT, LTT across every buyer scenario. Verified May 2026.',
  alternates: { canonical: '/stamp-duty-calculator' },
  openGraph: {
    title: 'UK Stamp Duty Calculator 2026',
    description: 'Live SDLT, LBTT and LTT across every buyer scenario with price-curve visualisation.',
    url: 'https://ukvisainfo.co.uk/stamp-duty-calculator',
    type: 'article',
  },
};

const T = {
  black:   '#09090B',
  ink:     '#18181B',
  body:    '#3F3F46',
  muted:   '#71717A',
  faint:   '#A1A1AA',
  paper:   '#FFFFFF',
  surface: '#FAFAFA',
  hair:    '#E4E4E7',
  brand:   '#047857',
};

const FAQS = [
  { q: 'Do first-time buyers pay any Stamp Duty in 2026?', a: 'In England and Northern Ireland, first-time buyers pay 0% up to £300,000 and 5% on the portion between £300,001 and £500,000. Above £500,000 the relief is withdrawn entirely. Scotland gives FTB relief up to £175,000; Wales has no separate FTB relief.' },
  { q: 'What is the 3% additional-property surcharge?', a: 'A 3 percentage-point uplift on every SDLT band, applied to the full purchase price when you already own a residential property anywhere in the world. The Scottish equivalent (ADS) is 8% from December 2024; the Welsh equivalent is 5% from December 2024.' },
  { q: 'Can I claim back the 3% surcharge?', a: 'Yes — if you sell your previous main residence within 36 months of paying the surcharge, you can apply to HMRC for a full refund. Use the refund tool above to check eligibility based on your timeline.' },
  { q: 'When is SDLT due?', a: 'Within 14 days of the effective date of the transaction (usually completion). Your solicitor or conveyancer normally calculates, files and pays it on your behalf. LBTT and LTT both have a 30-day deadline.' },
  { q: 'Does SDLT apply in Scotland or Wales?', a: 'No. Scotland uses Land and Buildings Transaction Tax (LBTT) administered by Revenue Scotland. Wales uses Land Transaction Tax (LTT) administered by the Welsh Revenue Authority. Switch country using the region tabs in the calculator.' },
];

export default function Page() {
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
    name: 'UK Stamp Duty Calculator',
    url: 'https://ukvisainfo.co.uk/stamp-duty-calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
    author: primaryEditorSchema('https://ukvisainfo.co.uk'),
    publisher: { '@type': 'Organization', name: 'UKDesk', url: 'https://ukvisainfo.co.uk' },
  };

  return (
    <main style={{
      background: T.surface, color: T.ink, minHeight: '100vh',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontFeatureSettings: '"cv11", "ss01"',
    }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <FaqJsonLd faqs={FAQS} />

      {/* ──── Hero (light) ──── */}
      <section style={{ paddingTop: 'clamp(96px, 12vh, 128px)', paddingBottom: 16 }}>
        <div style={wrap}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.muted, marginBottom: 24 }}>
            <Link href="/" style={{ color: T.muted, textDecoration: 'none' }}>Home</Link>
            <span style={{ color: T.faint }}>/</span>
            <Link href="/tools" style={{ color: T.muted, textDecoration: 'none' }}>Calculators</Link>
            <span style={{ color: T.faint }}>/</span>
            <span style={{ color: T.ink, fontWeight: 500 }}>Stamp duty</span>
            <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, color: T.muted }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: T.brand }} />
              Updated May 2026
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32, alignItems: 'end' }} className="lg:grid-cols-[1fr_auto]">
            <div>
              <h1 style={{
                fontSize: 'clamp(36px, 5.5vw, 64px)',
                fontWeight: 700, lineHeight: 1.02,
                letterSpacing: '-0.04em', color: T.black,
                margin: 0, maxWidth: '20ch',
              }}>
                UK Stamp Duty<br/>
                <span style={{ color: T.muted, fontWeight: 500 }}>Calculator</span>
              </h1>
              <p style={{
                fontSize: 17, lineHeight: 1.5, color: T.body,
                margin: '20px 0 0', maxWidth: '52ch',
              }}>
                Live SDLT, LBTT and LTT across every UK buyer scenario with price-sensitivity visualisation. Verified against HMRC, Revenue Scotland and the Welsh Revenue Authority.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: T.muted }}>
              <EditorByline verified="May 2026" prefix="By" />
            </div>
          </div>
        </div>
      </section>

      {/* SdltClient renders its own sections: calc, dark insights, country, refund, quick-ref */}
      <SdltClient initialPrice={350000} />

      {/* ──── FAQ ──── */}
      <section style={{ paddingTop: 64, paddingBottom: 64, borderTop: `1px solid ${T.hair}`, background: T.paper }}>
        <div style={wrap}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }} className="lg:grid-cols-[280px_1fr]">
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                FAQ
              </div>
              <h2 style={{
                fontSize: 24, fontWeight: 700, lineHeight: 1.15,
                letterSpacing: '-0.02em', color: T.black,
                margin: '8px 0 0', maxWidth: '20ch',
              }}>
                Common questions
              </h2>
            </div>
            <div>
              {FAQS.map((f, i) => (
                <details key={i} style={{
                  padding: '20px 0',
                  borderBottom: i < FAQS.length - 1 ? `1px solid ${T.hair}` : 'none',
                }}>
                  <summary style={{
                    cursor: 'pointer', listStyle: 'none',
                    fontSize: 15.5, fontWeight: 600, color: T.ink,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  }}>
                    {f.q}
                    <span style={{ color: T.faint, fontSize: 18, lineHeight: 1 }}>+</span>
                  </summary>
                  <p style={{ fontSize: 14.5, lineHeight: 1.65, color: T.body, margin: '10px 0 0', maxWidth: '60ch' }}>
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──── Footer strip ──── */}
      <section style={{ paddingTop: 40, paddingBottom: 80, background: T.surface, borderTop: `1px solid ${T.hair}` }}>
        <div style={wrap}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40 }} className="lg:grid-cols-[1fr_1fr]">
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 14 }}>
                Sources
              </div>
              <div style={{ display: 'grid', gap: 1, background: T.hair, borderRadius: 10, overflow: 'hidden', border: `1px solid ${T.hair}` }}>
                {[
                  { label: 'Stamp Duty Land Tax',                 href: 'https://www.gov.uk/stamp-duty-land-tax', src: 'gov.uk · HMRC' },
                  { label: 'SDLT residential property rates',     href: 'https://www.gov.uk/stamp-duty-land-tax/residential-property-rates', src: 'gov.uk · HMRC' },
                  { label: 'Land and Buildings Transaction Tax',  href: 'https://revenue.scot/taxes/land-buildings-transaction-tax', src: 'Revenue Scotland' },
                  { label: 'Land Transaction Tax rates',          href: 'https://gov.wales/land-transaction-tax-rates-and-bands', src: 'Welsh Revenue Authority' },
                ].map((s) => (
                  <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    padding: '14px 16px', background: T.paper, textDecoration: 'none',
                  }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{s.src}</div>
                    </div>
                    <span style={{ color: T.faint, fontSize: 13 }}>↗</span>
                  </a>
                ))}
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.55, color: T.muted, marginTop: 16 }}>
                For guidance only. Not tax or legal advice.{' '}
                <Link href="/sources" style={{ color: T.brand, textDecoration: 'underline', textUnderlineOffset: 3 }}>All sources</Link>
                {' · '}
                <Link href="/editorial-policy" style={{ color: T.brand, textDecoration: 'underline', textUnderlineOffset: 3 }}>Editorial policy</Link>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 14 }}>
                Related calculators
              </div>
              <div style={{ display: 'grid', gap: 1, background: T.hair, borderRadius: 10, overflow: 'hidden', border: `1px solid ${T.hair}` }}>
                {[
                  { href: '/mortgage-affordability', title: 'Mortgage affordability',  desc: 'Maximum borrowing with FCA stress test.' },
                  { href: '/take-home-pay',          title: 'Take-home pay',           desc: 'Net salary after PAYE, NI and pension.' },
                  { href: '/council-tax-band',       title: 'Council Tax band',        desc: 'Estimate annual council tax by postcode.' },
                  { href: '/ihs-calculator',         title: 'Visa IHS calculator',     desc: 'Immigration Health Surcharge per year.' },
                ].map((r) => (
                  <Link key={r.href} href={r.href} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    padding: '14px 16px', background: T.paper, textDecoration: 'none',
                  }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{r.desc}</div>
                    </div>
                    <span style={{ color: T.faint, fontSize: 13 }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const wrap: React.CSSProperties = {
  maxWidth: 1280,
  margin: '0 auto',
  padding: '0 clamp(16px, 3vw, 32px)',
};
