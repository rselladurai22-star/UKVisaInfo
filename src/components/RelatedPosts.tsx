import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { BLOG_POSTS, type BlogPost } from '../data/blog';

/** Score by tag overlap with the current post. */
function scoreRelated(current: BlogPost, candidate: BlogPost): number {
  if (candidate.slug === current.slug) return -1;
  const overlap = candidate.tags.filter((t) => current.tags.includes(t)).length;
  return overlap;
}

export default function RelatedPosts({ current }: { current: BlogPost }) {
  const related = [...BLOG_POSTS]
    .map((p) => ({ post: p, score: scoreRelated(current, p) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-outline-variant/30">
      <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-5">
        Related articles
      </h3>
      <ul className="grid gap-3 md:grid-cols-3">
        {related.map(({ post }) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block h-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 hover:border-secondary/60 transition-colors group"
            >
              <div className="text-sm font-bold text-primary group-hover:text-secondary transition-colors mb-2 leading-snug">
                {post.title}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                <Clock className="w-3 h-3" />
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
