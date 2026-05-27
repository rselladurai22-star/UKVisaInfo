import type { Metadata } from 'next';
import Link from 'next/link';
import SdltClient from './SdltClient';
import FaqJsonLd from '../../components/calc-shell/FaqJsonLd';
import EditorByline from '../../components/EditorByline';
import { primaryEditorSchema } from '../../data/editorialTeam';

export const metadata: Metadata = {
  title: 'UK Stamp Duty Calculator 2026 — SDLT, LBTT, LTT',
  description: 'The most precise UK Stamp Duty calculator. Live SDLT, LBTT, LTT across every buyer scenario with what-if comparisons. Verified May 2026.',
  alternates: { canonical: '/stamp-duty-calculator' },
  openGraph: {
    title: 'UK Stamp Duty Calculator 2026',
    description: 'The most precise UK Stamp Duty calculator. SDLT, LBTT, LTT with what-if scenarios.',
    url: 'https://ukvisainfo.co.uk/stamp-duty-calculator',
    type: 'article',
  },
};

/* Match site theme exactly */
const T = {
  page:    '#FAFAF7',
  paper:   '#FFFFFF',
  surface: '#F6F5F0',
  ink:     '#0B0F19',
  body:    '#1F2937',
  muted:   '#475569',
  faint:   '#94A3B8',
  hair:    'rgba(11,15,25,0.08)',
  divide:  'rgba(11,15,25,0.05)',
  emerald: '#047857',
  emeraldT:'#ECFDF5',
  gold:    '#B8860B',
};

const FAQS = [
  { q: 'What is a first-time buyer?',
    a: 'Someone who has never owned a residential property anywhere in the world, alone or jointly. If you co-buy with anyone who has previously owned property, the relief is denied for the entire purchase — not just their share.' },
  { q: 'Bought through a company?',
    a: 'A non-natural person (a company, partnership of companies, or collective investment scheme) buying a single dwelling worth more than £500,000 in England or NI pays a flat 15% SDLT, unless a specific relief applies (e.g. let to unconnected third parties on commercial terms).' },
  { q: 'What about other properties?',
    a: 'If you already own a residential property anywhere in the world and you are buying another, a 3% surcharge is applied to every band on the full purchase price. The Scottish equivalent (ADS) is 8% from December 2024; the Welsh equivalent is 5% from December 2024.' },
  { q: 'Can I estimate legal fees?',
    a: 'Typical UK conveyancing fees for a residential purchase run £800–£2,000 (solicitor + searches + Land Registry), depending on property value and complexity. Add SDLT separately. We assume £1,500 in the Comparative Load chart above as a representative average — actual quotes vary widely.' },
];

export default function Page() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',                  item: 'https://ukvisainfo.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Stamp Duty calculator', item: 'https://ukvisainfo.co.uk/stamp-duty-calculator' },
    ],
  };
  const webAppJsonLd = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'UK Stamp Duty Calculator',
    url: 'https://ukvisainfo.co.uk/stamp-duty-calculator',
    applicationCategory: 'FinanceApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
    author: primaryEditorSchema('https://ukvisainfo.co.uk'),
    publisher: { '@type': 'Organization', name: 'UKDesk', url: 'https://ukvisainfo.co.uk' },
  };

  return (
    <div style={{
      background: T.page, color: T.ink,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontFeatureSettings: '"cv11", "ss01"',
    }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <FaqJsonLd faqs={FAQS} />

      {/* Hero — clean, editorial */}
      <section style={{ paddingTop: 'clamp(96px, 12vh, 128px)', paddingBottom: 32 }}>
        <div style={wrap}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: T.muted, marginBottom: 16 }}>
            <Link href="/" style={{ color: T.muted, textDecoration: 'none' }}>Home</Link>
            <span style={{ color: T.faint }}>/</span>
            <Link href="/tools" style={{ color: T.muted, textDecoration: 'none' }}>Calculators</Link>
            <span style={{ color: T.faint }}>/</span>
            <span style={{ color: T.ink, fontWeight: 500 }}>Stamp duty</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <h1 style={{
                fontSize: 'clamp(32px, 4.2vw, 52px)',
                fontWeight: 700, lineHeight: 1.04,
                letterSpacing: '-0.035em', color: T.ink,
                margin: 0, maxWidth: '20ch',
              }}>
                UK Stamp Duty <span style={{ color: T.muted, fontWeight: 500 }}>Calculator</span>
              </h1>
              <p style={{
                fontSize: 'clamp(15px, 1.5vw, 17px)',
                lineHeight: 1.5, color: T.body,
                margin: '14px 0 0', maxWidth: '60ch',
                fontWeight: 400,
              }}>
                Live SDLT, LBTT and LTT across every UK buyer scenario with side-by-side comparison and what-if analysis.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13, color: T.muted }}>
              <EditorByline verified="May 2026" prefix="By" />
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard (calculator + tracker + charts) */}
      <SdltClient initialPrice={350000} />

      {/* FAQ — 2-col card grid */}
      <section style={{ paddingTop: 48, paddingBottom: 72 }}>
        <div style={wrap}>
          <div style={{ marginBottom: 28 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: T.gold,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              FAQ
            </div>
            <h2 style={{
              fontSize: 'clamp(24px, 2.8vw, 32px)', fontWeight: 700,
              color: T.ink, margin: 0,
              letterSpacing: '-0.025em', lineHeight: 1.15,
            }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }} className="md:grid-cols-2">
            {FAQS.map((f, i) => (
              <details key={i} style={{
                background: T.paper, border: `1px solid ${T.hair}`,
                borderRadius: 12, overflow: 'hidden',
              }}>
                <summary style={{
                  cursor: 'pointer', listStyle: 'none',
                  padding: '18px 22px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  fontSize: 15, fontWeight: 600, color: T.ink,
                  lineHeight: 1.35,
                }}>
                  {f.q}
                  <span style={{
                    width: 26, height: 26, borderRadius: 6,
                    background: T.surface,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: T.muted, fontSize: 14, lineHeight: 1, flexShrink: 0,
                  }}>⌄</span>
                </summary>
                <p style={{
                  fontSize: 14.5, lineHeight: 1.65, color: T.body,
                  margin: 0, padding: '0 22px 20px',
                }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const wrap: React.CSSProperties = {
  maxWidth: 2400, margin: '0 auto',
  padding: '0 clamp(16px, 4vw, 96px)',
};
