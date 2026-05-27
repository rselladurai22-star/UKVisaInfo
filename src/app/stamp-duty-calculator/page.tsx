import type { Metadata } from 'next';
import Link from 'next/link';
import SdltClient from './SdltClient';
import FaqJsonLd from '../../components/calc-shell/FaqJsonLd';
import { primaryEditorSchema } from '../../data/editorialTeam';

export const metadata: Metadata = {
  title: 'UK Stamp Duty Calculator 2026 — SDLT, LBTT, LTT',
  description: 'The most precise and authoritative tool for calculating Stamp Duty Land Tax across the UK. Live SDLT, LBTT, LTT across every buyer scenario with what-if comparisons. Verified May 2026.',
  alternates: { canonical: '/stamp-duty-calculator' },
  openGraph: {
    title: 'UK Stamp Duty Calculator 2026',
    description: 'The most precise UK stamp duty calculator. SDLT, LBTT, LTT with what-if scenarios.',
    url: 'https://ukvisainfo.co.uk/stamp-duty-calculator',
    type: 'article',
  },
};

const T = {
  page:    '#FAF7F4',
  paper:   '#FFFFFF',
  surface: '#F8FAFC',
  ink:     '#0F172A',
  body:    '#334155',
  muted:   '#64748B',
  faint:   '#94A3B8',
  hair:    '#E2E8F0',
  divide:  '#F1F5F9',
  blue:    '#2563EB',
  blueT:   '#EFF6FF',
  emerald: '#15803D',
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
    <main style={{
      background: T.page, color: T.ink, minHeight: '100vh',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontFeatureSettings: '"cv11", "ss01"',
    }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <FaqJsonLd faqs={FAQS} />

      {/* Slim hero (breadcrumb + minimal title bar above the grid) */}
      <section style={{ paddingTop: 'clamp(96px, 12vh, 128px)', paddingBottom: 24 }}>
        <div style={wrap}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.muted, marginBottom: 12 }}>
            <Link href="/" style={{ color: T.muted, textDecoration: 'none' }}>Home</Link>
            <span style={{ color: T.faint }}>/</span>
            <Link href="/tools" style={{ color: T.muted, textDecoration: 'none' }}>Calculators</Link>
            <span style={{ color: T.faint }}>/</span>
            <span style={{ color: T.ink, fontWeight: 500 }}>Stamp duty</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 3.4vw, 36px)',
            fontWeight: 700, lineHeight: 1.1,
            letterSpacing: '-0.025em', color: T.ink,
            margin: 0, maxWidth: '32ch',
          }}>
            UK Stamp Duty Calculator
          </h1>
          <p style={{
            fontSize: 14.5, lineHeight: 1.5, color: T.muted,
            margin: '6px 0 0', maxWidth: '60ch',
          }}>
            The most precise tool for SDLT, LBTT and LTT across every UK buyer scenario.
          </p>
        </div>
      </section>

      {/* Dashboard — 3-col grid + tracker + 2-col charts (in SdltClient) */}
      <SdltClient initialPrice={350000} />

      {/* FAQ — 2-column grid */}
      <section style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div style={wrap}>
          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: 700,
            color: T.ink, margin: '0 0 24px',
            letterSpacing: '-0.02em',
          }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }} className="md:grid-cols-2">
            {FAQS.map((f, i) => (
              <details key={i} style={{
                background: T.paper, border: `1px solid ${T.hair}`,
                borderRadius: 12, overflow: 'hidden',
                transition: 'border-color 0.15s ease',
              }}>
                <summary style={{
                  cursor: 'pointer', listStyle: 'none',
                  padding: '16px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  fontSize: 14.5, fontWeight: 600, color: T.ink,
                }}>
                  {f.q}
                  <span style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: T.surface,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: T.muted, fontSize: 14, lineHeight: 1,
                  }}>⌄</span>
                </summary>
                <p style={{
                  fontSize: 14, lineHeight: 1.65, color: T.body,
                  margin: 0, padding: '0 20px 18px',
                }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: T.paper, borderTop: `1px solid ${T.hair}`, padding: '48px 0 32px' }}>
        <div style={wrap}>
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1.4fr] gap-10 md:gap-8">
            {/* Logo + tagline */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: T.blue, color: T.paper,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700,
                }}>£</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>UK SDLT Calc</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: T.muted, margin: '12px 0 0', maxWidth: '30ch' }}>
                The most precise and authoritative tool for calculating Stamp Duty Land Tax across the United Kingdom.
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                {[
                  { href: 'https://www.gov.uk/stamp-duty-land-tax', label: '🌐' },
                  { href: 'mailto:rselladurai22@gmail.com',          label: '✉' },
                ].map((l, i) => (
                  <a key={i} href={l.href} style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: T.surface, border: `1px solid ${T.hair}`,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, color: T.muted, textDecoration: 'none',
                  }}>{l.label}</a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <FooterHeader>Quick Links</FooterHeader>
              <FooterLink href="/tools">Calculators</FooterLink>
              <FooterLink href="/stamp-duty-calculator">Scotland (LBTT)</FooterLink>
              <FooterLink href="/stamp-duty-calculator">Wales (LTT)</FooterLink>
            </div>

            {/* More */}
            <div>
              <FooterHeader>&nbsp;</FooterHeader>
              <FooterLink href="/news">Insights</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </div>

            {/* Subscribe */}
            <div>
              <FooterHeader>Subscribe to our insights</FooterHeader>
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                <input type="email" placeholder="Your email" style={{
                  flex: 1, fontSize: 13, padding: '9px 12px',
                  background: T.paper, border: `1px solid ${T.hair}`,
                  borderRadius: 8, outline: 'none', color: T.ink,
                  fontFamily: 'inherit',
                }} />
                <button type="button" style={{
                  padding: '9px 18px', borderRadius: 8,
                  background: T.blue, color: T.paper, border: 'none',
                  fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>Join</button>
              </div>
              <p style={{ fontSize: 11, color: T.muted, margin: '10px 0 0', lineHeight: 1.55 }}>
                Get market updates and tax law changes directly to your inbox.
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, marginTop: 40, paddingTop: 24,
            borderTop: `1px solid ${T.hair}`,
            fontSize: 12, color: T.muted,
          }}>
            <span>© 2026 UK SDLT Calc. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link href="/privacy" style={{ color: T.muted, textDecoration: 'none' }}>Privacy Policy</Link>
              <Link href="/terms"   style={{ color: T.muted, textDecoration: 'none' }}>Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FooterHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10.5, fontWeight: 700, color: T.muted,
      letterSpacing: '0.10em', textTransform: 'uppercase',
      marginBottom: 12, minHeight: 16,
    }}>{children}</div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      display: 'block', fontSize: 13.5, color: T.ink,
      textDecoration: 'none', padding: '6px 0',
    }}>{children}</Link>
  );
}

const wrap: React.CSSProperties = {
  maxWidth: 1280, margin: '0 auto',
  padding: '0 clamp(16px, 3vw, 32px)',
};
