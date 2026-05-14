import Link from 'next/link';
import { Crown, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-primary text-white mt-12 overflow-hidden">
      <div className="dot-pattern absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="inline-flex w-9 h-9 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-[#8b001d] shadow-soft">
                <Crown className="w-4 h-4 text-white" />
              </span>
              <span className="font-display font-bold text-lg text-white">
                UK Visa <span className="text-accent">Info</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm text-white/55 leading-relaxed">
              Independent, plainly-written UK immigration guidance. Always
              confirm critical information against the official gov.uk
              source.
            </p>
          </div>

          {/* Resources */}
          <div className="col-span-1 md:col-span-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-white/45 mb-5">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/visa-types" className="text-white/75 hover:text-white transition-colors">
                  Visa Types
                </Link>
              </li>
              <li>
                <Link href="/eligibility" className="text-white/75 hover:text-white transition-colors">
                  Eligibility Quiz
                </Link>
              </li>
              <li>
                <Link href="/costs" className="text-white/75 hover:text-white transition-colors">
                  Cost Calculator
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/75 hover:text-white transition-colors">
                  Guides &amp; Blog
                </Link>
              </li>
              <li>
                <a
                  href="https://www.gov.uk/browse/visas-immigration"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/75 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  gov.uk
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-white/45 mb-5">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-white/75 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/75 hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/75 hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-2">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-white/45 mb-5">
              Contact
            </h4>
            <a
              href="mailto:contact@ukvisainfo.co.uk"
              className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              contact@ukvisainfo.co.uk
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-white/40">
          <div>
            © 2026 UK Visa Info. Independent editorial — not affiliated with
            gov.uk or the Home Office.
          </div>
          <div>Made in the UK</div>
        </div>
      </div>
    </footer>
  );
}
