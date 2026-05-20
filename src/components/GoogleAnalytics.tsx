import Script from 'next/script';

/**
 * Google Analytics 4 loader.
 *
 * UKDesk Measurement ID is hardcoded as the default. An env var
 * (NEXT_PUBLIC_GA_ID) can override for staging / preview deploys.
 * Free, unlimited events. Pair with Vercel Analytics for a 2nd lens.
 *
 * Manage the property at analytics.google.com.
 */
const UKDESK_GA_ID = 'G-80TXNPVFCZ';

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || UKDESK_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
