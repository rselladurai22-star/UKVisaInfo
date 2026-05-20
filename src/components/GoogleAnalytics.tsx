import Script from 'next/script';

/**
 * Google Analytics 4 loader.
 *
 * Loads only when NEXT_PUBLIC_GA_ID is set (G-XXXXXXXXXX). Free,
 * unlimited events. Pair with Vercel Analytics (which we already
 * have) for a 2nd lens on traffic.
 *
 * To enable: set NEXT_PUBLIC_GA_ID in your Vercel project env vars,
 * then redeploy. To get an ID: analytics.google.com → Admin → Data
 * Streams → Add stream → Web → paste your domain.
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
