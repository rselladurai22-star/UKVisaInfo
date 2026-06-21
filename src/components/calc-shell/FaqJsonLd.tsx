/**
 * FaqJsonLd, emits FAQPage schema.org JSON-LD for any page with
 * a list of question/answer pairs. Server component, zero runtime cost.
 *
 * Pair with a visible FAQ accordion in the page body so the structured
 * data matches what users see (Google requirement).
 *
 *   <FaqJsonLd faqs={[
 *     { q: 'Who can claim Marriage Allowance?', a: 'Married couples or…' },
 *     …
 *   ]} />
 */

export interface FaqItem {
  q: string;
  a: string;
}

export default function FaqJsonLd({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs || faqs.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
