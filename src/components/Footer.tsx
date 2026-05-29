import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import s from './Footer.module.css';

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
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.about}>
          <Link href="/" className={s.brand} aria-label="UKDesk — home">
            <span className={s.mark} aria-hidden>U</span>UKDesk
          </Link>
          <p>Free UK calculators, visa routes and plain-English explainers — checked against official sources. No sign-up, no clutter.</p>
          <div className={s.trust}><ShieldCheck size={15} /> Verified against GOV.UK · HMRC · ONS</div>
        </div>
        {COLS.map((col) => (
          <div key={col.h} className={s.col}>
            <h4>{col.h}</h4>
            {col.links.map(([href, label]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className={s.bottom}>
        <span>© 2026 UKDesk · Independent &amp; free</span>
        <span>Information only — not financial or legal advice.</span>
      </div>
    </footer>
  );
}
