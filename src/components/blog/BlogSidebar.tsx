import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { BlogPost, RelatedTool } from '../../data/blog';
import RelatedPosts from '../RelatedPosts';
import BlogToc, { type TocHeading } from './BlogToc';

/**
 * Shared blog right-rail. Single source of truth for the "Keep going" /
 * "Related articles" / "Across the site" stack used by EVERY blog post
 * (flagship + standard). On desktop it sits in the right column and sticks;
 * on mobile it stacks below the article. Edit here once → every post updates.
 */
export default function BlogSidebar({
  post,
  relatedTools,
  headings = [],
}: {
  post: BlogPost;
  relatedTools: RelatedTool[];
  /** H2 headings for the auto "On this page" ToC. Empty = no ToC (bespoke posts). */
  headings?: TocHeading[];
}) {
  return (
    <aside className="mt-14 lg:mt-0 lg:col-span-4">
      <div className="space-y-8 lg:sticky lg:top-8">
        {/* Auto table of contents (standard posts with 3+ sections) */}
        <BlogToc headings={headings} />

        {/* Related calculators */}
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600 mb-3">Keep going</p>
          <div className="space-y-3">
            {relatedTools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-cs"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-bold text-slate-900 group-hover:text-blue-700">{t.label}</p>
                  <p className="truncate text-[11.5px] text-slate-500">{t.hint}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 flex-none text-slate-300 group-hover:text-blue-600" />
              </Link>
            ))}
          </div>
        </div>

        <RelatedPosts current={post} />
      </div>
    </aside>
  );
}
