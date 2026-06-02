import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

const COLS: { h: string; links: [string, string][] }[] = [
  {
    h: 'Popular tools',
    links: [
      ['/take-home-pay', 'Take-home pay'],
      ['/stamp-duty-calculator', 'Stamp duty'],
      ['/mortgage-affordability', 'Mortgage'],
      ['/council-tax-band', 'Council tax'],
      ['/tools', 'All 46 tools'],
    ],
  },
  {
    h: 'Immigration',
    links: [
      ['/visa-types', 'All visa routes'],
      ['/visa/skilled-worker', 'Skilled Worker'],
      ['/eligibility', 'Eligibility quiz'],
      ['/ihs-calculator', 'IHS calculator'],
    ],
  },
  {
    h: 'UKDesk',
    links: [
      ['/about', 'About'],
      ['/editorial-policy', 'Editorial policy'],
      ['/sources', 'Sources'],
      ['/contact', 'Contact'],
      ['/privacy', 'Privacy'],
      ['/terms', 'Terms'],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface-container-low">
      <div className="max-w-[1160px] mx-auto py-10 px-4 pb-7 grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-7 sm:px-6 md:py-[54px] md:pb-[36px] md:gap-8">
        <div className="max-w-none md:max-w-96">
          <Link href="/" className="inline-flex items-center gap-2.5 font-display font-bold text-[20px] tracking-tight text-primary hover:opacity-90 no-underline select-none" aria-label="UKDesk — home">
            <svg viewBox="0 0 64 64" width={30} height={30} xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden focusable="false">
              <rect width="64" height="64" rx="14" fill="#0B0F19" />
              <path d="M19 17 V34 a13 13 0 0 0 26 0 V17" fill="none" stroke="#FAFAF7" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="49" cy="16" r="5.5" fill="#047857" />
              <circle cx="49" cy="16" r="2" fill="#FAFAF7" />
            </svg>
            <span>UK<span className="text-secondary">Desk</span></span>
          </Link>
          <p className="text-[13.5px] text-on-surface-variant leading-relaxed mt-3 mb-0">Free UK calculators, visa routes and plain-English explainers — checked against official sources. No sign-up, no clutter.</p>
          <div className="flex items-center gap-2 mt-3.5 text-[13px] font-semibold text-on-surface-variant"><ShieldCheck size={15} className="text-secondary shrink-0" /> Verified against GOV.UK · HMRC · ONS</div>
        </div>
        {COLS.map((col) => (
          <div key={col.h} className="flex flex-col">
            <h4 className="text-[11px] font-bold tracking-wider uppercase text-on-surface-variant mb-3.5">{col.h}</h4>
            {col.links.map(([href, label]) => (
              <Link key={href} href={href} className="block text-sm text-on-surface-variant py-1.25 no-underline hover:text-primary transition-colors">{label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className="max-w-[1160px] mx-auto py-[18px] px-4 sm:px-6 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-1.5 md:gap-2.5 text-[12.5px] text-on-surface-variant">
        <span>© 2026 UKDesk · Independent &amp; free</span>
        <span>Information only — not financial or legal advice.</span>
      </div>
    </footer>
  );
}
