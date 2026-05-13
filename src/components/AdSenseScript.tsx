// AdSense verification snippet — server-rendered into <head>.
// Set NEXT_PUBLIC_ADSENSE_CLIENT in Vercel env vars (e.g. "ca-pub-...").
// Rendered as a raw <script> tag in <head> so the AdSense crawler can
// detect it from the initial HTML response without executing JavaScript.
const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function AdSenseScript() {
  if (!CLIENT_ID) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT_ID}`}
      crossOrigin="anonymous"
    />
  );
}
