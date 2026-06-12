/**
 * Footer v4 — "Ledger" chrome.
 * Heavy top rule, mono kickers, flat link rows. Single column on phones,
 * four columns from sm. No cards, no boxes.
 */
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

const COLS: { h: string; links: [string, string][] }[] = [
  {
    h: 'Popular tools',
    links: [
      ['/take-home-pay', 'Take-home pay'],
      ['/stamp-duty-calculator', 'Stamp duty'],
      ['/mortgage-affordability', 'Mortgage affordability'],
      ['/council-tax-band', 'Council tax band'],
      ['/tools', 'Full tool index'],
    ],
  },
  {
    h: 'Immigration',
    links: [
      ['/visa-types', 'All visa routes'],
      ['/visa-types/skilled-worker', 'Skilled Worker'],
      ['/settlement', 'Settlement & ILR'],
      ['/eligibility', 'Eligibility quiz'],
      ['/ihs-calculator', 'IHS calculator'],
    ],
  },
  {
    h: 'Site',
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
    <footer className="border-t-2 border-[#0b0f19] bg-[#fbfbf9]">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1.4fr_1fr_1fr_1fr] sm:gap-8">
          {/* brand */}
          <div>
            <Link href="/" aria-label="UKDesk home" className="inline-flex items-center gap-2.5 no-underline">
              <svg viewBox="0 0 64 64" width={28} height={28} xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden className="h-7 w-7 shrink-0">
                <path d="M32 6 L56 18 L32 30 L8 18 Z" fill="#0b0f19" />
                <path d="M8 18 L32 30 V54 L8 42 Z" fill="#047857" />
                <path d="M32 30 L56 18 V42 L32 54 Z" fill="#10b981" />
              </svg>
              <span className="font-display text-2xl font-extrabold leading-none tracking-[-0.03em] text-[#0b0f19]">
                ukdesk<span className="text-emerald-600">.</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-[13.5px] leading-relaxed text-slate-600">
              Free UK calculators, visa routes and plain-English explainers — checked against
              official sources. No sign-up, no clutter.
            </p>
            <p className="mt-4 flex items-center gap-2 text-[12.5px] font-semibold text-emerald-700">
              <ShieldCheck size={14} className="shrink-0" /> Verified against GOV.UK · HMRC · ONS
            </p>
          </div>

          {/* link columns */}
          {COLS.map((col) => (
            <nav key={col.h} aria-label={col.h}>
              <h4 className="border-b border-[#0b0f19]/10 pb-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-slate-400">
                {col.h}
              </h4>
              <ul>
                {col.links.map(([href, label]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="block py-[7px] text-sm text-slate-600 no-underline transition-colors hover:text-emerald-700"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col justify-between gap-1.5 border-t border-[#0b0f19]/10 pt-5 font-mono text-[11.5px] text-slate-500 sm:flex-row sm:items-center">
          <span>© 2026 ukdesk — independent & free</span>
          <span>information only · not financial or legal advice</span>
        </div>
      </div>
    </footer>
  );
}
