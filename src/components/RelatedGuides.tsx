import Link from 'next/link';
import { GuideSection } from './calc-ui';
import { guidesFor } from '../data/calcGuides';

// Renders a "Related guides" section linking a calculator back to the blog
// posts that explain it (topic-cluster interlinking). Returns null if no
// guides are mapped for the path, so it is safe to drop into any calculator.
export default function RelatedGuides({ calc }: { calc: string }) {
  const guides = guidesFor(calc);
  if (guides.length === 0) return null;
  return (
    <GuideSection title="Related guides">
      <ul className="not-prose grid sm:grid-cols-2 gap-2 list-none pl-0">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/blog/${g.slug}`}
              className="block rounded-xl border border-outline-variant p-3 hover:border-primary transition-colors text-sm font-medium text-on-surface no-underline"
            >
              {g.title} →
            </Link>
          </li>
        ))}
      </ul>
    </GuideSection>
  );
}
