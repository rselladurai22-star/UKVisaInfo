import Link from 'next/link';
import { ExternalLink, Mail, Sparkles } from 'lucide-react';
import FooterNewsletter from './FooterNewsletter';

const LOGO_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3"  y="3"  width="8" height="8" rx="2" fill="#00C4B4" />
    <rect x="13" y="3"  width="8" height="8" rx="2" fill="none" stroke="#ffffff" strokeWidth="1.6" opacity="0.92" />
    <rect x="3"  y="13" width="8" height="8" rx="2" fill="none" stroke="#ffffff" strokeWidth="1.6" opacity="0.92" />
    <rect x="13" y="13" width="8" height="8" rx="2" fill="none" stroke="#C9A14A" strokeWidth="1.6" opacity="0.92" />
  </svg>
);

const CALCULATORS = [
  { href: '/take-home-pay',          label: 'Take-Home Pay' },
  { href: '/national-insurance',     label: 'National Insurance' },
  { href: '/dividend-tax',           label: 'Dividend Tax' },
  { href: '/inheritance-tax',        label: 'Inheritance Tax' },
  { href: '/cgt-calculator',         label: 'Capital Gains Tax' },
  { href: '/sole-trader-vs-limited', label: 'Sole vs Ltd' },
  { href: '/student-loan-repayment', label: 'Student Loan' },
  { href: '/redundancy-pay',         label: 'Redundancy Pay' },
  { href: '/maternity-pay',          label: 'Maternity Pay' },
  { href: '/sick-pay',               label: 'Statutory Sick Pay' },
  { href: '/payslip-decoder',        label: 'Payslip Decoder' },
  { href: '/mortgage-affordability', label: 'Mortgage' },
  { href: '/stamp-duty-calculator',  label: 'Stamp Duty' },
  { href: '/council-tax-band',       label: 'Council Tax' },
  { href: '/vat-calculator',         label: 'VAT Calculator' },
  { href: '/pension-allowance',      label: 'Pension Allowance' },
  { href: '/state-pension',          label: 'State Pension' },
  { href: '/holiday-pay',            label: 'Holiday Pay' },
  { href: '/salary-compare',         label: 'Salary Compare' },
  { href: '/energy-bill',            label: 'Energy Bill' },
  { href: '/ulez-check',             label: 'ULEZ / CAZ Check' },
  { href: '/mot-check',              label: 'MOT & Tax Check' },
  { href: '/child-benefit-calculator',    label: 'Child Benefit' },
  { href: '/marriage-allowance-calculator', label: 'Marriage Allowance' },
  { href: '/company-car-tax',             label: 'Company Car Tax' },
  { href: '/ir35-calculator',             label: 'IR35 Calculator' },
  { href: '/contractor-day-rate',         label: 'Contractor Day Rate' },
  { href: '/mileage-expense-calculator',  label: 'Mileage Expenses' },
  { href: '/salary-sacrifice-calculator', label: 'Salary Sacrifice' },
  { href: '/self-assessment-calculator',  label: 'Self Assessment' },
  { href: '/rental-income-tax',           label: 'Rental Income Tax' },
  { href: '/rental-yield-calculator',     label: 'Rental Yield' },
  { href: '/overpayment-mortgage',        label: 'Mortgage Overpayment' },
  { href: '/property-cgt-calculator',     label: 'Property CGT' },
  { href: '/childcare-calculator',        label: 'Childcare Costs' },
  { href: '/isa-calculator',              label: 'ISA & LISA Growth' },
  { href: '/ihs-calculator',              label: 'IHS Surcharge' },
  { href: '/skilled-worker-points-check', label: 'Skilled Worker Points' },
  { href: '/notice-period-calculator',    label: 'Notice Period' },
  { href: '/minimum-wage-checker',        label: 'Minimum Wage' },
  { href: '/pension-drawdown-calculator', label: 'Pension Drawdown' },
  { href: '/lifetime-isa-calculator',     label: 'Lifetime ISA' },
];

const RESOURCES = [
  { href: '/visa-types',          label: 'Visa Routes' },
  { href: '/eligibility',         label: 'Eligibility Quiz' },
  { href: '/postcode',            label: 'Postcode Lookup' },
  { href: '/blog',                label: 'Guides & Blog' },
  { href: '/news',                label: 'News & Updates' },
];

const EXPLORE = [
  { href: '/settlement',          label: 'Settlement Compare' },
  { href: '/from',                label: 'By Country' },
  { href: '/uk-cities',           label: 'UK City Guides' },
  { href: '/salary',              label: 'Salary by SOC Code' },
  { href: '/tools/refusal-analyzer', label: 'Refusal Analyzer' },
  { href: '/my-journey',          label: 'My Visa Journey' },
];

const LEGAL = [
  { href: '/about',   label: 'About' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms',   label: 'Terms of Use' },
];

export default function Footer() {
  return (
    <footer className="bg-[#06192E] text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-10">

        {/* Newsletter strip */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F2C4B] to-[#0A2540] border border-white/[0.06] p-6 md:p-8 mb-12 md:mb-14">
          <div
            className="absolute inset-0 opacity-[0.18] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201, 161, 74,0.5) 1px, transparent 0)',
              backgroundSize: '18px 18px',
            }}
          />
          <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full bg-[#00C4B4]/22 blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#C9A14A] mb-3">
                <Sparkles className="w-3 h-3" />
                Weekly UK Visa Brief
              </div>
              <h3 className="font-display font-bold text-white text-[20px] md:text-[24px] leading-tight tracking-[-0.015em]">
                Rule changes, fee updates and route news.<br className="hidden md:block" />
                <span className="text-white/55">Straight to your inbox, every Tuesday.</span>
              </h3>
              <p className="mt-3 text-[12.5px] text-white/45">
                3-minute read · Free · Unsubscribe in one click.
              </p>
            </div>
            <div>
              <FooterNewsletter />
            </div>
          </div>
        </div>

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-white/[0.08]">

          {/* Brand */}
          <div className="col-span-2 md:col-span-3">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#0A2540] to-[#06192E] ring-1 ring-[#00C4B4]/40 flex items-center justify-center shadow-[0_2px_8px_rgba(0,196,180,0.25)]">
                {LOGO_ICON}
              </span>
              <span className="font-display font-bold text-[16px] text-white tracking-[-0.02em]">
                UK<span className="text-[#00C4B4]">Desk</span>
              </span>
            </Link>
            <p className="mt-5 text-sm text-white/40 leading-relaxed max-w-[280px]">
              Free UK calculators, lookups and guides — verified against gov.uk, HMRC and ONS.
              Independent editorial. No login, no email harvesting.
            </p>
            <a
              href="mailto:contact@ukvisainfo.co.uk"
              className="mt-5 inline-flex items-center gap-2 text-sm text-white/45 hover:text-white/80 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              contact@ukvisainfo.co.uk
            </a>
          </div>

          {/* Calculators */}
          <div className="col-span-1 md:col-span-3 md:col-start-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/30 mb-5">
              Calculators
            </h4>
            <ul className="space-y-3">
              {CALCULATORS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/30 mb-5">
              Resources
            </h4>
            <ul className="space-y-3">
              {RESOURCES.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://www.gov.uk/browse/visas-immigration"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white transition-colors"
                >
                  gov.uk
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/30 mb-5">
              Explore
            </h4>
            <ul className="space-y-3">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/rss.xml"
                  className="inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white transition-colors"
                >
                  RSS feed
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 md:col-span-2 md:col-start-12">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/30 mb-5">
              Legal
            </h4>
            <ul className="space-y-3">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-7 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[12px] text-white/25">
          <span>
            © 2026 UKDesk — Independent editorial, not affiliated with gov.uk, HMRC or the Home Office.
          </span>
          <span>Made in the UK</span>
        </div>
      </div>
    </footer>
  );
}
