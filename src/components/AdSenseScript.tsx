import Script from 'next/script';

// Reads the publisher ID from a build-time env var so we never commit it.
// Set NEXT_PUBLIC_ADSENSE_CLIENT in Vercel env vars — e.g. "ca-pub-...".
//
// The script is loaded unconditionally so AdSense verification can succeed.
// Ad personalization (cookie-based) is handled separately via Google's
// EU User Consent Policy and the cookie banner.
const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function AdSenseScript() {
  if (!CLIENT_ID) return null;

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
