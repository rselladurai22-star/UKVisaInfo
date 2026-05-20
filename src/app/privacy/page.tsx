import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — UKDesk',
  description:
    'Privacy policy for ukvisainfo.co.uk. How we collect, use and protect your data, including cookies, analytics and advertising.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-on-surface">
      <h1 className="text-4xl font-bold text-primary mb-2">Privacy Policy</h1>
      <p className="text-sm text-on-surface-variant mb-10">
        Last updated: 29 April 2026
      </p>

      <section className="space-y-4 leading-relaxed">
        <p>
          This Privacy Policy explains how <strong>UKDesk</strong>{' '}
          (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), operator of{' '}
          <strong>ukvisainfo.co.uk</strong>, collects, uses and protects
          information about visitors to this website. We are committed to
          handling your personal data in accordance with the UK General Data
          Protection Regulation (UK GDPR) and the Data Protection Act 2018.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          1. Who we are
        </h2>
        <p>
          UKDesk is an independent information website providing
          guidance on UK immigration routes. We are not affiliated with the UK
          Home Office, gov.uk, or any official government body. We are not
          immigration solicitors and do not provide legal advice.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          2. What information we collect
        </h2>
        <p>
          We collect limited information automatically when you visit the
          site:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Usage data</strong> — pages visited, time on site,
            referring website, device type, browser version, approximate
            location (country / region only).
          </li>
          <li>
            <strong>IP address</strong> — stored briefly by our hosting
            provider (Vercel) for security and analytics. We do not link IP
            addresses to identifiable individuals.
          </li>
          <li>
            <strong>Cookie data</strong> — see Section 5 below.
          </li>
        </ul>
        <p>
          We do not ask for or collect names, email addresses, phone numbers,
          passport details, or any other personal information through this
          website. Tools such as the eligibility quiz process your inputs
          locally in your browser and do not transmit them to us.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          3. How we use information
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To understand which content is most useful so we can improve it</li>
          <li>To measure traffic patterns and detect technical issues</li>
          <li>To serve relevant advertising (where you have consented)</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          4. Legal basis
        </h2>
        <p>
          We process site analytics under our legitimate interest in operating
          and improving the website. We process advertising and tracking
          cookies only with your explicit consent.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          5. Cookies
        </h2>
        <p>
          A cookie is a small text file stored on your device. We use three
          categories:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Strictly necessary cookies</strong> — required for site
            functionality. No consent needed.
          </li>
          <li>
            <strong>Analytics cookies</strong> — Vercel Web Analytics. Used to
            count visits and identify popular content. Anonymised; no personal
            identification.
          </li>
          <li>
            <strong>Advertising cookies</strong> — used by Google AdSense and
            its partners to serve relevant ads. Set only with your consent via
            the cookie banner.
          </li>
        </ul>
        <p>
          You can withdraw cookie consent at any time by clearing your
          browser&apos;s cookies for this domain or returning to the cookie
          banner.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          6. Third-party services
        </h2>
        <p>
          We share limited usage data with the following processors:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Vercel Inc.</strong> — hosting and basic analytics
          </li>
          <li>
            <strong>Cloudflare Inc.</strong> — DNS and security
          </li>
          <li>
            <strong>Google LLC</strong> — AdSense advertising and Search
            Console (Search Console processes aggregated query data only)
          </li>
        </ul>
        <p>
          Each of these providers operates under its own privacy policy and
          may transfer data outside the UK. Where transfers occur, they are
          governed by appropriate safeguards (UK adequacy decisions, Standard
          Contractual Clauses, or equivalent).
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          7. Your rights
        </h2>
        <p>Under UK GDPR you have the right to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access any personal data we hold about you</li>
          <li>Request correction or deletion of that data</li>
          <li>Object to processing or restrict it</li>
          <li>Withdraw consent for cookies at any time</li>
          <li>
            Complain to the Information Commissioner&apos;s Office (ICO) at{' '}
            <a
              className="text-secondary underline"
              href="https://ico.org.uk/make-a-complaint/"
              rel="noopener noreferrer"
            >
              ico.org.uk
            </a>
          </li>
        </ul>
        <p>
          Because we do not knowingly collect personally identifying
          information, in most cases there is no individual data record to
          access or delete. If you believe we hold data about you, contact us
          at <strong>privacy@ukvisainfo.co.uk</strong>.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          8. Children
        </h2>
        <p>
          This site is not directed at children under 13. We do not knowingly
          collect data from children.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          9. Changes to this policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. The &quot;Last
          updated&quot; date at the top of the page reflects the most recent
          revision.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          10. Contact
        </h2>
        <p>
          Questions about this Privacy Policy can be sent to{' '}
          <strong>privacy@ukvisainfo.co.uk</strong>.
        </p>
      </section>
    </div>
  );
}
