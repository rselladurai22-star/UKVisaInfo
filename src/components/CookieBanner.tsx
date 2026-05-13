'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie } from 'lucide-react';

const STORAGE_KEY = 'ukvi-cookie-consent';

type Consent = 'accepted' | 'rejected' | null;

function readConsent(): Consent {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v === 'accepted' || v === 'rejected' ? v : null;
}

function writeConsent(v: 'accepted' | 'rejected') {
  localStorage.setItem(STORAGE_KEY, v);
  // Fire a custom event so analytics / ad components can react without reload
  window.dispatchEvent(new CustomEvent('cookie-consent-change', { detail: v }));
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (readConsent() === null) {
      // Slight delay so banner doesn't flash before LCP
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    writeConsent('accepted');
    setOpen(false);
  };
  const reject = () => {
    writeConsent('rejected');
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="Cookie consent"
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-[420px] z-[300] bg-primary text-white rounded-2xl shadow-2xl border border-white/10 p-5"
        >
          <div className="flex items-start gap-3 mb-3">
            <Cookie className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold mb-1">We use cookies</h2>
              <p className="text-xs text-white/80 leading-relaxed">
                We use a small set of cookies to understand how this site is
                used and to support it via advertising. You can accept all
                cookies, or reject non-essential ones. See our{' '}
                <Link
                  href="/privacy"
                  className="underline decoration-secondary/60 hover:text-secondary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={reject}
              className="flex-1 text-xs font-semibold py-2 rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
            >
              Reject non-essential
            </button>
            <button
              type="button"
              onClick={accept}
              className="flex-1 text-xs font-bold py-2 rounded-lg bg-secondary text-white hover:bg-secondary/90 transition-colors"
            >
              Accept all
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
