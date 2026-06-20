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
    h: 'Relocation guides',
    links: [
      ['/from', 'UK visas by country'],
      ['/from/india', 'Visa from India'],
      ['/uk-cities', 'Living in UK cities'],
      ['/uk-cities/london', 'Living in London'],
      ['/uk-cities/manchester', 'Living in Manchester'],
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
    <footer className="border-t-2 border-slate-900 bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* brand */}
          <div>
            <Link href="/" aria-label="UKDesk home" className="inline-flex items-center gap-2.5 no-underline">
              <svg viewBox="0 0 64 64" width={30} height={30} xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden className="h-[30px] w-[30px] shrink-0 drop-shadow-[0_2px_6px_rgba(37,99,235,0.3)]">
                <defs>
                  <linearGradient id="ftrTile" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#2563EB" />
                    <stop offset="1" stopColor="#4F46E5" />
                  </linearGradient>
                  <linearGradient id="ftrSheen" x1="32" y1="0" x2="32" y2="38" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#ffffff" stopOpacity="0.26" />
                    <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <rect width="64" height="64" rx="15" fill="url(#ftrTile)" />
                <rect width="64" height="64" rx="15" fill="url(#ftrSheen)" />
                <path d="M20 20 V36 a12 12 0 0 0 24 0 V20" fill="none" stroke="#ffffff" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="48.5" cy="17.5" r="5" fill="#7DD3FC" />
              </svg>
              <span className="font-display text-[28px] font-extrabold uppercase leading-none tracking-[-0.01em] text-slate-900">
                UKDESK<span className="text-blue-600">.</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-[13.5px] leading-relaxed text-slate-600">
              Free UK calculators, visa routes and plain-English explainers — checked against
              official sources. No sign-up, no clutter.
            </p>
            <p className="mt-4 flex items-center gap-2 text-[12.5px] font-semibold text-blue-700">
              <ShieldCheck size={14} className="shrink-0" /> Verified against GOV.UK · HMRC · ONS
            </p>
          </div>

          {/* link columns */}
          {COLS.map((col) => (
            <nav key={col.h} aria-label={col.h}>
              <h4 className="border-b border-slate-200 pb-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-slate-400">
                {col.h}
              </h4>
              <ul>
                {col.links.map(([href, label]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="block py-[7px] text-sm text-slate-600 no-underline transition-colors hover:text-blue-700"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col justify-between gap-1.5 border-t border-slate-200 pt-5 font-mono text-[11.5px] text-slate-500 sm:flex-row sm:items-center">
          <span>© 2026 ukdesk — independent & free</span>
          <span>information only · not financial or legal advice</span>
        </div>
      </div>
    </footer>
  );
}
