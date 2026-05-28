import Link from 'next/link';
import { ExternalLink, Mail } from 'lucide-react';
import FooterNewsletter from './FooterNewsletter';

const FONT         = '"Inter", -apple-system, system-ui, sans-serif';
const FONT_DISPLAY = '"Space Grotesk", -apple-system, system-ui, sans-serif';
const FONT_MONO    = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
const INK     = '#213343';   // HubSpot navy
const CREAM   = '#FFFFFF';   // pure white
const EMERALD = '#FF7A59';   // HubSpot brand orange (legacy name)

/* ─────────────────────────────────────────────
   FOOTER NAV — five columns, HubSpot pattern
───────────────────────────────────────────── */

const CALCULATORS_TOP = [
  { href: '/take-home-pay',              label: 'Take-Home Pay' },
  { href: '/mortgage-affordability',     label: 'Mortgage' },
  { href: '/stamp-duty-calculator',      label: 'Stamp Duty' },
  { href: '/council-tax-band',           label: 'Council Tax' },
  { href: '/national-insurance',         label: 'National Insurance' },
  { href: '/tax-code',                   label: 'Tax Code Decoder' },
  { href: '/dividend-tax',               label: 'Dividend Tax' },
  { href: '/inheritance-tax',            label: 'Inheritance Tax' },
  { href: '/cgt-calculator',             label: 'Capital Gains Tax' },
  { href: '/self-assessment-calculator', label: 'Self Assessment' },
  { href: '/pension-allowance',          label: 'Pension Allowance' },
  { href: '/isa-calculator',             label: 'ISA & LISA' },
];

const VISAS = [
  { href: '/visa-types',          label: 'All visa routes' },
  { href: '/visa/skilled-worker', label: 'Skilled Worker' },
  { href: '/visa/student',        label: 'Student' },
  { href: '/visa/family',         label: 'Family' },
  { href: '/visa/graduate',       label: 'Graduate' },
  { href: '/visa/ilr',            label: 'Indefinite Leave (ILR)' },
  { href: '/visa/citizenship',    label: 'British Citizenship' },
  { href: '/eligibility',         label: 'Eligibility quiz' },
];

const RESOURCES = [
  { href: '/blog',      label: 'Guides & blog' },
  { href: '/news',      label: 'News & updates' },
  { href: '/postcode',  label: 'Postcode lookup' },
  { href: '/from',      label: 'Country guides' },
  { href: '/uk-cities', label: 'UK city briefs' },
  { href: '/salary',    label: 'Salary by SOC code' },
  { href: '/sponsors',  label: 'Sponsor directory' },
  { href: '/tools',     label: 'All 46 tools' },
];

const COMPANY = [
  { href: '/about',            label: 'About UKDesk' },
  { href: '/about#editor',     label: 'Editorial team' },
  { href: '/editorial-policy', label: 'Editorial policy' },
  { href: '/sources',          label: 'Sources cited' },
  { href: '/contact',          label: 'Contact us' },
];

const LEGAL_BOTTOM = [
  { href: '/privacy',          label: 'Privacy Policy' },
  { href: '/terms',            label: 'Terms of Use' },
  { href: '/privacy#adsense',  label: 'Advertising disclosure' },
  { href: '/terms#disclaimer', label: 'Legal disclaimer' },
  { href: '/sitemap.xml',      label: 'Sitemap' },
  { href: '/rss.xml',          label: 'RSS' },
];

/* ─────────────────────────────────────────────
   LOGO
───────────────────────────────────────────── */
function FooterLogo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group" aria-label="UKDesk — home">
      <span
        className="relative flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.04]"
        style={{
          width: 36, height: 36,
          background: CREAM,
          borderRadius: 10,
          boxShadow: '0 2px 10px -2px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}>
        <span aria-hidden
              style={{
                fontFamily: FONT, fontWeight: 700, fontSize: 18,
                color: INK, letterSpacing: '-0.02em', lineHeight: 1, marginTop: -1,
              }}>U</span>
        <span aria-hidden
              className="absolute"
              style={{
                right: 4, bottom: 4, width: 5, height: 5,
                background: EMERALD, borderRadius: 2,
                boxShadow: `0 0 0 1.5px ${CREAM}`,
              }} />
      </span>
      <span style={{
        fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 21,
        color: CREAM, letterSpacing: '-0.025em', lineHeight: 1,
      }}>
        UKDesk<span style={{ color: '#A7F3D0' }}>.</span>
      </span>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   COLUMN
───────────────────────────────────────────── */
function FooterColumn({ heading, items }: {
  heading: string;
  items: { href: string; label: string }[];
}) {
  return (
    <section>
      <h2 style={{
        fontFamily: FONT, fontWeight: 700, fontSize: 14,
        color: CREAM, letterSpacing: '-0.005em',
        marginBottom: 18,
      }}>
        {heading}
      </h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((l) => (
          <li key={l.href} style={{ marginBottom: 10 }}>
            <Link href={l.href}
                  style={{
                    fontFamily: FONT, fontSize: 14, fontWeight: 400,
                    color: 'rgba(255,255,255,0.62)', textDecoration: 'none',
                    transition: 'color 150ms',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = CREAM; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.62)'; }}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer style={{ background: INK, color: CREAM, fontFamily: FONT }}>
      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10 pt-16 md:pt-20 pb-10">

        {/* Newsletter band — slimmer, less decoration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pb-14 md:pb-16 mb-14 md:mb-16"
             style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
          <div>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700,
              fontSize: 'clamp(1.5rem, 2.6vw, 1.875rem)',
              color: CREAM, letterSpacing: '-0.022em', lineHeight: 1.15,
              maxWidth: '20ch',
            }}>
              The Tuesday brief — UK rule changes, fee updates, route news.
            </h2>
            <p style={{
              fontFamily: FONT, fontSize: 14, lineHeight: 1.6,
              color: 'rgba(255,255,255,0.62)', marginTop: 12,
            }}>
              3-minute read every Tuesday. Free, no spam, unsubscribe in one click.
            </p>
          </div>
          <div>
            <FooterNewsletter />
          </div>
        </div>

        {/* Main nav grid — brand + 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8 pb-14"
             style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>

          {/* Brand block */}
          <div className="col-span-2 md:col-span-3">
            <FooterLogo />
            <p style={{
              fontFamily: FONT, fontSize: 14, lineHeight: 1.65,
              color: 'rgba(255,255,255,0.55)',
              marginTop: 22, maxWidth: 280,
            }}>
              Free UK calculators, lookups and guides — verified against gov.uk,
              HMRC and ONS. Independent editorial.
            </p>
            <a href="mailto:contact@ukvisainfo.co.uk"
               className="inline-flex items-center gap-2 transition-colors"
               style={{
                 fontFamily: FONT, fontSize: 13.5, fontWeight: 500,
                 color: 'rgba(255,255,255,0.62)', marginTop: 22,
               }}
               onMouseEnter={(e) => { e.currentTarget.style.color = CREAM; }}
               onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.62)'; }}>
              <Mail className="w-3.5 h-3.5" />
              contact@ukvisainfo.co.uk
            </a>
            <a href="https://www.gov.uk/browse/visas-immigration"
               target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1.5 transition-colors mt-2.5"
               style={{
                 fontFamily: FONT, fontSize: 13.5, fontWeight: 500,
                 color: 'rgba(255,255,255,0.62)', display: 'flex',
               }}
               onMouseEnter={(e) => { e.currentTarget.style.color = CREAM; }}
               onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.62)'; }}>
              gov.uk visas
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Calculators column */}
          <div className="col-span-1 md:col-span-3 md:col-start-4">
            <FooterColumn heading="Popular Calculators" items={CALCULATORS_TOP} />
          </div>

          {/* Visas column */}
          <div className="col-span-1 md:col-span-2">
            <FooterColumn heading="UK Visas" items={VISAS} />
          </div>

          {/* Resources column */}
          <div className="col-span-1 md:col-span-2">
            <FooterColumn heading="Resources" items={RESOURCES} />
          </div>

          {/* Company column */}
          <div className="col-span-1 md:col-span-2">
            <FooterColumn heading="Company" items={COMPANY} />
          </div>
        </div>

        {/* Bottom utility bar — HubSpot inline legal pattern */}
        <div className="pt-8 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-6">
          <div style={{
            fontFamily: FONT, fontSize: 12.5, lineHeight: 1.5,
            color: 'rgba(255,255,255,0.42)', maxWidth: 560,
          }}>
            <p>
              Copyright © 2026 UKDesk. Independent editorial — not affiliated with
              gov.uk, HMRC or the Home Office.
            </p>
            <p style={{ marginTop: 6 }}>Made in the UK.</p>
          </div>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2"
              style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {LEGAL_BOTTOM.map((l) => (
              <li key={l.href}>
                <Link href={l.href}
                      style={{
                        fontFamily: FONT, fontSize: 12.5, fontWeight: 500,
                        color: 'rgba(255,255,255,0.62)', textDecoration: 'none',
                        transition: 'color 150ms',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = CREAM; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.62)'; }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
