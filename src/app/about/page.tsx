import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — UK Visa Info',
  description:
    'About ukvisainfo.co.uk: who we are, our editorial approach, and how we keep UK visa information accurate and up to date.',
  alternates: { canonical: '/about' },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-on-surface">
      <h1 className="text-4xl font-bold text-primary mb-3">About UK Visa Info</h1>
      <p className="text-lg text-on-surface-variant mb-10">
        Independent, plainly-written UK immigration guidance.
      </p>

      <section className="space-y-4 leading-relaxed">
        <h2 className="text-2xl font-bold text-primary mt-4 mb-3">
          What this site is
        </h2>
        <p>
          UK Visa Info is an editorial site covering the UK visa system —
          work routes, study, family, visit, and settlement. We translate
          dense official rules into plain English so applicants can
          understand what they need before they spend time and money on an
          application.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          What this site is not
        </h2>
        <p>
          We are not the UK Home Office. We are not gov.uk. We are not
          immigration solicitors and we do not provide legal advice for
          individual cases. For tailored advice, speak with a UK immigration
          solicitor regulated by the SRA or an{' '}
          <a
            className="text-secondary underline"
            href="https://www.gov.uk/government/organisations/immigration-services-commissioner"
            target="_blank"
            rel="noopener noreferrer"
          >
            OISC-registered adviser
          </a>
          .
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          Editorial approach
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Source-first.</strong> Every article references the
            current Immigration Rules, Home Office guidance, or relevant
            statutory instrument.
          </li>
          <li>
            <strong>Updated by date.</strong> Every article shows its last
            update date. We revise content when fees, thresholds or rules
            change.
          </li>
          <li>
            <strong>Plain English.</strong> We don&apos;t paste official text
            verbatim. We explain it.
          </li>
          <li>
            <strong>No fluff.</strong> If a section doesn&apos;t help an
            applicant decide something, it doesn&apos;t belong on the page.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          How the site is funded
        </h2>
        <p>
          The site is reader-supported through advertising and affiliate
          links to relevant services (English tests, money transfer, visa
          services). Advertising does not influence which routes we cover or
          how we describe them. See our{' '}
          <Link href="/terms" className="text-secondary underline">
            Terms of Use
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-secondary underline">
            Privacy Policy
          </Link>{' '}
          for full disclosure.
        </p>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-3">
          Contact
        </h2>
        <p>
          Editorial queries, corrections and feedback:{' '}
          <strong>contact@ukvisainfo.co.uk</strong>
        </p>
        <p>
          Privacy and data requests:{' '}
          <strong>privacy@ukvisainfo.co.uk</strong>
        </p>
      </section>
    </div>
  );
}
