// Google Consent Mode v2 defaults + Funding Choices (certified CMP) loader.
//
// MUST render before AdSenseScript and GoogleAnalytics in <head> so the
// "denied" defaults are set before any Google tag reads consent state.
//
// Required for serving AdSense ads to UK/EEA users (Google mandates a
// certified CMP since Jan 2024). The actual GDPR/consent MESSAGE is created
// in the AdSense dashboard: Privacy & messaging → GDPR → publish. This file
// only loads that message and sets the Consent Mode v2 defaults.
//
// Env: NEXT_PUBLIC_ADSENSE_CLIENT (e.g. "ca-pub-9854912596289421").

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

// Funding Choices uses the "pub-…" form, not the "ca-pub-…" form.
const fcPubId = CLIENT_ID?.replace(/^ca-/, '');

const consentDefault = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  analytics_storage:'denied',
  functionality_storage:'granted',
  security_storage:'granted',
  wait_for_update:500
});
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);
`;

// Standard Funding Choices presence-signalling snippet.
const fundingChoices = (pub: string) => `
(function() {
  function signalGooglefcPresent() {
    if (!window.frames['googlefcPresent']) {
      if (document.body) {
        const iframe = document.createElement('iframe');
        iframe.style = 'width:0;height:0;border:none;z-index:-1000;left:-1000px;top:-1000px;';
        iframe.style.display = 'none';
        iframe.name = 'googlefcPresent';
        document.body.appendChild(iframe);
      } else {
        setTimeout(signalGooglefcPresent, 0);
      }
    }
  }
  signalGooglefcPresent();
})();
`;

export default function ConsentInit() {
  if (!CLIENT_ID || !fcPubId) return null;

  return (
    <>
      {/* 1. Consent Mode v2 defaults — denied until the user opts in. */}
      <script dangerouslySetInnerHTML={{ __html: consentDefault }} />
      {/* 2. Funding Choices certified CMP message loader. */}
      <script
        async
        src={`https://fundingchoicesmessages.google.com/i/${fcPubId}?ers=1`}
      />
      <script dangerouslySetInnerHTML={{ __html: fundingChoices(fcPubId) }} />
    </>
  );
}
