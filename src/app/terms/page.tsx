import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use — UK Visa Info',
  description:
    'Terms of use for ukvisainfo.co.uk. Editorial disclaimer, no legal advice, accuracy and liability terms.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-on-surface">
      <h1 className="text-4xl font-bold text-primary mb-2">Terms of Use</h1>
      <p className="text-sm text-on-surface-variant mb-10">
        Last updated: 29 April 2026
      </p>

      <section className="space-y-4 leading-relaxed">
        <h2 className="text-2xl font-bold text-primary mt-4 mb-3">
          1. Acceptance of terms
        </h2>
        <p>
          By accessing <strong>ukvisainfo.co.uk</strong> you agree to be bound
          by these Terms of Use. If you do not agree, please do not use the
          site.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          2. Nature of the website
        </h2>
        <p>
          UK Visa Info is an independent editorial site providing general
          information on UK immigration routes. We are not the UK Home Office
          and we are not affiliated with any government body.
        </p>
        <p>
          <strong>We do not provide legal advice.</strong> Nothing on this
          site constitutes legal advice, an offer to enter into a
          solicitor–client relationship, or representation of any kind. For
          legal advice on your specific immigration situation, consult a
          qualified UK immigration solicitor regulated by the SRA or an OISC
          (Office of the Immigration Services Commissioner) registered
          adviser.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          3. Accuracy and currency
        </h2>
        <p>
          UK immigration rules change frequently. We make reasonable efforts
          to keep content accurate and up to date, but cannot guarantee that
          every article reflects the latest rules at the time you read it.
          Always confirm critical information against the official{' '}
          <a
            href="https://www.gov.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary underline"
          >
            gov.uk
          </a>{' '}
          source.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          4. Use of content
        </h2>
        <p>
          You may read and share links to our articles. You may not republish
          our full article text on another website without explicit written
          permission. Short quotations with attribution to ukvisainfo.co.uk
          are permitted.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          5. Third-party links
        </h2>
        <p>
          We link to external sites including gov.uk and selected third-party
          services. We are not responsible for the content, accuracy or
          policies of external sites.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          6. Advertising and affiliate disclosure
        </h2>
        <p>
          This site is supported by advertising and may earn commission from
          affiliate links. Where a link is an affiliate or sponsored link, it
          is marked accordingly. Advertising does not influence our editorial
          content.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          7. Limitation of liability
        </h2>
        <p>
          To the maximum extent permitted by law, UK Visa Info accepts no
          liability for any loss arising from reliance on information
          published on this site. Visa applications carry significant
          financial and personal consequences; never rely solely on a
          third-party guide.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          8. Changes
        </h2>
        <p>
          We may revise these Terms from time to time. Continued use of the
          site after a change constitutes acceptance of the updated Terms.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          9. Governing law
        </h2>
        <p>
          These Terms are governed by the laws of England and Wales.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          10. Contact
        </h2>
        <p>
          Questions about these Terms can be sent to{' '}
          <strong>contact@ukvisainfo.co.uk</strong>.
        </p>
      </section>
    </div>
  );
}
