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
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="max-w-[1160px] mx-auto py-10 px-4 pb-7 grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-7 sm:px-6 md:py-[54px] md:pb-[36px] md:gap-8">
        <div className="max-w-none md:max-w-96">
          <Link href="/" className="inline-flex items-center gap-2.5 font-display font-bold text-[20px] tracking-tight text-slate-800 hover:text-slate-900 no-underline select-none" aria-label="UKDesk — home">
            <span className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#06b6d4] flex items-center justify-center text-white text-[15px] font-bold shadow-sm" aria-hidden>U</span>UKDesk
          </Link>
          <p className="text-[13.5px] text-slate-500 leading-relaxed mt-3 mb-0">Free UK calculators, visa routes and plain-English explainers — checked against official sources. No sign-up, no clutter.</p>
          <div className="flex items-center gap-2 mt-3.5 text-[13px] font-semibold text-slate-600"><ShieldCheck size={15} className="text-[#4f46e5] shrink-0" /> Verified against GOV.UK · HMRC · ONS</div>
        </div>
        {COLS.map((col) => (
          <div key={col.h} className="flex flex-col">
            <h4 className="text-[11px] font-bold tracking-wider uppercase text-slate-500 mb-3.5">{col.h}</h4>
            {col.links.map(([href, label]) => (
              <Link key={href} href={href} className="block text-sm text-slate-600 py-1.25 no-underline hover:text-[#4f46e5] transition-colors">{label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className="max-w-[1160px] mx-auto py-[18px] px-6 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-1.5 md:gap-2.5 text-[12.5px] text-slate-500">
        <span>© 2026 UKDesk · Independent &amp; free</span>
        <span>Information only — not financial or legal advice.</span>
      </div>
    </footer>
  );
}
