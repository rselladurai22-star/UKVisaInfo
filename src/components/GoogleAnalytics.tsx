import Script from 'next/script';

/**
 * Google Analytics 4 loader.
 *
 * Reads NEXT_PUBLIC_GA_ID from the environment (set in Vercel → project
 * → Settings → Environment Variables). No-ops when unset. Free, unlimited
 * events. Pair with Vercel Analytics for a 2nd lens on traffic.
 */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
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
