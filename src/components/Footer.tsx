import Link from 'next/link';
import { ExternalLink, Mail, Sparkles, ArrowUpRight } from 'lucide-react';
import FooterNewsletter from './FooterNewsletter';

const INK     = '#0B0F19';
const CREAM   = '#FAFAF7';
const EMERALD = '#047857';
const GOLD    = '#B8860B';

const CALCULATORS_TOP = [
  { href: '/take-home-pay',          label: 'Take-Home Pay' },
  { href: '/mortgage-affordability', label: 'Mortgage' },
  { href: '/stamp-duty-calculator',  label: 'Stamp Duty' },
  { href: '/council-tax-band',       label: 'Council Tax' },
  { href: '/national-insurance',     label: 'National Insurance' },
  { href: '/tax-code',               label: 'Tax Code Decoder' },
  { href: '/dividend-tax',           label: 'Dividend Tax' },
  { href: '/inheritance-tax',        label: 'Inheritance Tax' },
  { href: '/cgt-calculator',         label: 'Capital Gains Tax' },
  { href: '/self-assessment-calculator', label: 'Self Assessment' },
  { href: '/pension-allowance',      label: 'Pension Allowance' },
  { href: '/isa-calculator',         label: 'ISA & LISA' },
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

const EXPLORE = [
  { href: '/blog',                label: 'Guides & blog' },
  { href: '/news',                label: 'News & updates' },
  { href: '/postcode',            label: 'Postcode lookup' },
  { href: '/from',                label: 'Country guides' },
  { href: '/uk-cities',           label: 'UK city briefs' },
  { href: '/salary',              label: 'Salary by SOC code' },
  { href: '/sponsors',            label: 'Sponsor directory' },
  { href: '/tools',               label: 'All 46 tools' },
];

const LEGAL = [
  { href: '/about',             label: 'About & editor' },
  { href: '/editorial-policy',  label: 'Editorial policy' },
  { href: '/sources',           label: 'Sources cited' },
  { href: '/privacy',           label: 'Privacy Policy' },
  { href: '/terms',             label: 'Terms of Use' },
  { href: '/terms#disclaimer',  label: 'Legal disclaimer' },
];

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
        <span
          aria-hidden
          style={{
            fontFamily: 'Fraunces, serif',
            fontWeight: 600,
            fontSize: 18,
            color: INK,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginTop: -1,
          }}
        >U</span>
        <span
          aria-hidden
          className="absolute"
          style={{
            right: 4, bottom: 4,
            width: 5, height: 5,
            background: EMERALD,
            borderRadius: 2,
            boxShadow: `0 0 0 1.5px ${CREAM}`,
          }}
        />
      </span>
      <span style={{
        fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 21,
        color: CREAM, letterSpacing: '-0.025em', lineHeight: 1,
      }}>
        UKDesk<span style={{ color: '#A7F3D0' }}>.</span>
      </span>
    </Link>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: INK, color: CREAM }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-16 md:pt-20 pb-10">

        {/* Newsletter strip */}
        <div className="relative overflow-hidden rounded-3xl p-7 md:p-10 mb-16 md:mb-20"
             style={{
               background: 'linear-gradient(135deg, #1F2937 0%, #0B0F19 60%, #1F2937 100%)',
               border: '1px solid rgba(250,250,247,0.08)',
             }}>
          <div className="absolute inset-0 opacity-[0.10] pointer-events-none" aria-hidden
               style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(184,134,11,0.6) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full pointer-events-none" aria-hidden
               style={{ background: 'rgba(4,120,87,0.28)', filter: 'blur(60px)' }} />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] mb-4"
                   style={{ color: '#FDE68A' }}>
                <Sparkles className="w-3 h-3" />
                The Tuesday brief
              </div>
              <h3 className="leading-[1.05]"
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontWeight: 600,
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    color: CREAM,
                    letterSpacing: '-0.025em',
                  }}>
                Rule changes, fee updates,<br className="hidden md:block" />
                <span style={{ fontStyle: 'italic', color: '#A7F3D0' }}>route news.</span>
              </h3>
              <p className="mt-4 text-[13.5px] leading-relaxed" style={{ color: 'rgba(250,250,247,0.55)' }}>
                3-minute read · Every Tuesday · Unsubscribe in one click.
              </p>
            </div>
            <div>
              <FooterNewsletter />
            </div>
          </div>
        </div>

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8 pb-14"
             style={{ borderBottom: '1px solid rgba(250,250,247,0.08)' }}>

          {/* Brand */}
          <div className="col-span-2 md:col-span-3">
            <FooterLogo />
            <p className="mt-6 text-[14px] leading-[1.65] max-w-[280px]" style={{ color: 'rgba(250,250,247,0.50)' }}>
              The quiet desk for UK life. Free calculators, lookups and guides —
              verified against gov.uk, HMRC and ONS. Independent editorial.
            </p>
            <a href="mailto:contact@ukvisainfo.co.uk"
               className="mt-6 inline-flex items-center gap-2 text-[13px] transition-colors"
               style={{ color: 'rgba(250,250,247,0.55)' }}
               onMouseEnter={(e) => { e.currentTarget.style.color = CREAM; }}
               onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(250,250,247,0.55)'; }}>
              <Mail className="w-3.5 h-3.5" />
              contact@ukvisainfo.co.uk
            </a>
          </div>

          {/* Calculators */}
          <div className="col-span-1 md:col-span-3 md:col-start-4">
            <h4 className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-5" style={{ color: GOLD }}>
              Calculators
            </h4>
            <ul className="space-y-2.5">
              {CALCULATORS_TOP.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                        className="text-[13.5px] transition-colors"
                        style={{ color: 'rgba(250,250,247,0.55)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link href="/tools"
                      className="inline-flex items-center gap-1 text-[13px] font-semibold transition-colors"
                      style={{ color: '#A7F3D0' }}>
                  All 46 tools
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Visas */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-5" style={{ color: GOLD }}>
              Visas
            </h4>
            <ul className="space-y-2.5">
              {VISAS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                        className="text-[13.5px] transition-colors"
                        style={{ color: 'rgba(250,250,247,0.55)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-5" style={{ color: GOLD }}>
              Explore
            </h4>
            <ul className="space-y-2.5">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                        className="text-[13.5px] transition-colors"
                        style={{ color: 'rgba(250,250,247,0.55)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="https://www.gov.uk/browse/visas-immigration"
                   target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 text-[13.5px] transition-colors"
                   style={{ color: 'rgba(250,250,247,0.55)' }}>
                  gov.uk
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="/rss.xml"
                   className="inline-flex items-center gap-1.5 text-[13.5px] transition-colors"
                   style={{ color: 'rgba(250,250,247,0.55)' }}>
                  RSS feed
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 md:col-span-2 md:col-start-12">
            <h4 className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-5" style={{ color: GOLD }}>
              About
            </h4>
            <ul className="space-y-2.5">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                        className="text-[13.5px] transition-colors"
                        style={{ color: 'rgba(250,250,247,0.55)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-7 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[12px]"
             style={{ color: 'rgba(250,250,247,0.32)' }}>
          <span>
            © 2026 UKDesk — Independent editorial, not affiliated with gov.uk, HMRC or the Home Office.
          </span>
          <span>Made in the UK</span>
        </div>
      </div>
    </footer>
  );
}
