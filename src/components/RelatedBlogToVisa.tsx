import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '../data/blog';

const TAG_TO_VISA_SLUG: Record<string, string[]> = {
  'skilled-worker': ['Skilled Worker', 'Switching'],
  student: ['Student visa', 'IELTS'],
  visitor: ['Visitor visa', 'ETA'],
  family: ['Family visa', 'Spouse visa', 'Dependants'],
  health: ['Health & Care', 'NHS', 'Healthcare workers'],
  talent: ['Global Talent'],
  graduate: ['Graduate visa', 'Post-study'],
  'innovator-founder': ['Innovator Founder', 'Entrepreneur', 'Business'],
};

/** Show blog articles relevant to this visa page. */
export default function RelatedBlogToVisa({ visaSlug }: { visaSlug: string }) {
  const matchTags = TAG_TO_VISA_SLUG[visaSlug] ?? [];
  if (matchTags.length === 0) return null;

  const related = BLOG_POSTS.filter((p) =>
    p.tags.some((t) => matchTags.includes(t))
  ).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-outline-variant/30">
      <div className="flex items-center gap-2 mb-5">
        <BookOpen className="w-4 h-4 text-secondary" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          In-depth guides on this route
        </h3>
      </div>
      <ul className="grid gap-3 md:grid-cols-2">
        {related.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 hover:border-secondary/60 transition-colors group"
            >
              <div className="text-sm font-bold text-primary group-hover:text-secondary mb-1 leading-snug">
                {post.title}
              </div>
              <div className="text-[11px] text-on-surface-variant flex items-center gap-1">
                {post.readMinutes} min read
                <ArrowRight className="w-3 h-3 ml-auto text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
