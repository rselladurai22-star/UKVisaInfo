'use client';

import { Share2, HelpCircle, Mail, Gavel } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="text-xl font-bold text-white mb-6">UK Visa Hub</div>
            <p className="text-white/60 text-sm max-w-sm leading-relaxed">
              The independent authority on UK immigration and visa procedures. Not a law firm or government agency. Providing clarity and confidence for your journey to the United Kingdom.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Resources</h4>
            <ul className="space-y-4 text-sm">
              <li><a target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-secondary transition-colors" href="https://www.gov.uk/browse/visas-immigration">gov.uk Official</a></li>
              <li><a target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-secondary transition-colors" href="https://www.gov.uk/visa-fees">Visa Fee Calculator</a></li>
              <li><a target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-secondary transition-colors" href="https://www.gov.uk/guidance/immigration-rules">Immigration Rules</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><a target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-secondary transition-colors" href="https://www.gov.uk/government/publications/personal-information-charter">Privacy Policy</a></li>
              <li><a target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-secondary transition-colors" href="https://www.gov.uk/help/terms-conditions">Disclaimer</a></li>
              <li><a target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-secondary transition-colors" href="https://www.gov.uk/help/terms-conditions">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white/40 text-xs">
            © 2026 UK Visa Hub. All rights reserved. An official digital diplomat service.
          </div>

          <div className="flex gap-6">
            <a aria-label="Share" className="text-white/60 hover:text-white transition-colors" href="https://www.gov.uk/browse/visas-immigration" target="_blank" rel="noopener noreferrer"><Share2 className="w-4 h-4" /></a>
            <a aria-label="Help" className="text-white/60 hover:text-white transition-colors" href="https://www.gov.uk/contact-ukvi-inside-outside-uk" target="_blank" rel="noopener noreferrer"><HelpCircle className="w-4 h-4" /></a>
            <a aria-label="Email" className="text-white/60 hover:text-white transition-colors" href="mailto:info@ukvisahub.example"><Mail className="w-4 h-4" /></a>
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <Gavel className="w-4 h-4" />
              Freedom of Information
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
