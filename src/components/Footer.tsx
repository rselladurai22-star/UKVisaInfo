import Link from 'next/link';
import { ExternalLink, Mail } from 'lucide-react';

const LOGO_ICON = (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
    <path d="M1 7L8 1.5L15 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="2.5" y="7" width="2" height="5.5" rx="0.5" fill="white"/>
    <rect x="6" y="7" width="2" height="5.5" rx="0.5" fill="white"/>
    <rect x="9.5" y="7" width="2" height="5.5" rx="0.5" fill="white"/>
    <rect x="1" y="12.5" width="14" height="1.5" rx="0.5" fill="#ffbf47"/>
  </svg>
);

const RESOURCES = [
  { href: '/visa-types', label: 'Visa Routes' },
  { href: '/eligibility', label: 'Eligibility Quiz' },
  { href: '/costs', label: 'Cost Calculator' },
  { href: '/blog', label: 'Guides & Blog' },
];

const LEGAL = [
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
];

export default function Footer() {
  return (
    <footer className="bg-[#08112a] text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-10">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-white/[0.08]">

          {/* Brand */}
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#c9112a] to-[#8b001d] flex items-center justify-center shadow-[0_1px_4px_rgba(217,21,43,0.4)]">
                {LOGO_ICON}
              </span>
              <span className="font-display font-bold text-[15px] text-white">
                UK Visa <span className="text-[#ffbf47]">Info</span>
              </span>
            </Link>
            <p className="mt-5 text-sm text-white/40 leading-relaxed max-w-[280px]">
              Independent, plainly-written UK immigration guidance. Always confirm critical
              information against the official gov.uk source.
            </p>
            <a
              href="mailto:contact@ukvisainfo.co.uk"
              className="mt-5 inline-flex items-center gap-2 text-sm text-white/45 hover:text-white/80 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              contact@ukvisainfo.co.uk
            </a>
          </div>

          {/* Resources */}
          <div className="col-span-1 md:col-span-3 md:col-start-7">
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

          {/* Legal */}
          <div className="col-span-1 md:col-span-2">
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
            © 2026 UK Visa Info — Independent editorial, not affiliated with gov.uk or the Home Office.
          </span>
          <span>Made in the UK</span>
        </div>
      </div>
    </footer>
  );
}
