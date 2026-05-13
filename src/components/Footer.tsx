'use client';

import Link from 'next/link';
import { Share2, HelpCircle, Mail, Gavel } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="text-xl font-bold text-white mb-6">UK Visa Info</div>
            <p className="text-white/60 text-sm max-w-sm leading-relaxed">
              Independent UK immigration guidance. Not a law firm or
              government agency. Always confirm critical information against
              the official gov.uk source.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Resources</h4>
            <ul className="space-y-4 text-sm">
              <li><Link className="text-white/60 hover:text-secondary transition-colors" href="/visa-types">Visa Types</Link></li>
              <li><Link className="text-white/60 hover:text-secondary transition-colors" href="/eligibility">Eligibility Quiz</Link></li>
              <li><Link className="text-white/60 hover:text-secondary transition-colors" href="/costs">Cost Calculator</Link></li>
              <li><Link className="text-white/60 hover:text-secondary transition-colors" href="/blog">Blog &amp; Guides</Link></li>
              <li><a target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-secondary transition-colors" href="https://www.gov.uk/browse/visas-immigration">gov.uk Official</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><Link className="text-white/60 hover:text-secondary transition-colors" href="/about">About</Link></li>
              <li><Link className="text-white/60 hover:text-secondary transition-colors" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="text-white/60 hover:text-secondary transition-colors" href="/terms">Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white/40 text-xs">
            © 2026 UK Visa Info. All rights reserved. Independent editorial — not affiliated with gov.uk or the Home Office.
          </div>

          <div className="flex gap-6">
            <a aria-label="Help" className="text-white/60 hover:text-white transition-colors" href="https://www.gov.uk/contact-ukvi-inside-outside-uk" target="_blank" rel="noopener noreferrer"><HelpCircle className="w-4 h-4" /></a>
            <a aria-label="Share" className="text-white/60 hover:text-white transition-colors" href="https://www.gov.uk/browse/visas-immigration" target="_blank" rel="noopener noreferrer"><Share2 className="w-4 h-4" /></a>
            <a aria-label="Email" className="text-white/60 hover:text-white transition-colors" href="mailto:contact@ukvisainfo.co.uk"><Mail className="w-4 h-4" /></a>
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <Gavel className="w-4 h-4" />
              Editorial site
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
