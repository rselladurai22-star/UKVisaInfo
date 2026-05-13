'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

// Reads the publisher ID from a build-time env var so we never commit it.
// Set NEXT_PUBLIC_ADSENSE_CLIENT in Vercel env vars once your AdSense
// application is approved — e.g. "ca-pub-1234567890123456".
const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function AdSenseScript() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      try {
        setConsent(localStorage.getItem('ukvi-cookie-consent'));
      } catch {
        setConsent(null);
      }
    };
    read();
    const onChange = () => read();
    window.addEventListener('cookie-consent-change', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('cookie-consent-change', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  if (!CLIENT_ID) return null;
  if (consent !== 'accepted') return null;

  return (
    <Script
      id="adsense-script"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT_ID}`}
      crossOrigin="anonymous"
    />
  );
}
