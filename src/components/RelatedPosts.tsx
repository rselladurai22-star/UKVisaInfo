import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { BLOG_POSTS, type BlogPost, postCategory, getCategoryMeta } from '../data/blog';

/** Score by tag overlap (weight 2) + recency (months). */
function scorePost(current: BlogPost, candidate: BlogPost): number {
  if (candidate.slug === current.slug) return -1;
  const overlap = candidate.tags.filter((t) => current.tags.includes(t)).length;
  if (overlap === 0) return 0;
  const monthsOld = (Date.now() - new Date(candidate.date).getTime()) / (1000 * 60 * 60 * 24 * 30);
  return overlap * 2 + Math.max(0, 6 - monthsOld) * 0.25;
}

export default function RelatedPosts({ current }: { current: BlogPost }) {
  /* Related blog posts (top 3 by tag overlap + recency) */
  const relatedPosts = [...BLOG_POSTS]
    .map((p) => ({ post: p, score: scorePost(current, p) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-outline-variant/60">
      <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 mb-4">
        Related articles
      </div>
      <ul className="grid gap-3 sm:grid-cols-3 mb-8 animate-fade-in">
        {relatedPosts.map(({ post }) => {
          const category = postCategory(post);
          const catMeta = getCategoryMeta(category);
          return (
            <li key={post.slug} className="h-full">
              <Link
                href={`/blog/${post.slug}`}
                className="group relative block h-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 flex flex-col justify-between hover:shadow-md active:scale-[0.99] transition-all overflow-hidden"
              >
                {/* Hover indicator bar on the left */}
                <span className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: catMeta.accent }} />
                <div className="pl-1">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {post.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant/30 text-on-surface-variant">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="text-[13px] font-semibold text-on-surface group-hover:text-primary transition-colors duration-100 leading-snug mb-2 line-clamp-2">
                    {post.title}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant/80 pl-1 mt-auto pt-2">
                  <Clock className="w-3.5 h-3.5 text-on-surface-variant" />
                  {post.readMinutes} min read
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-primary opacity-0 group-hover:opacity-100 transition-all duration-100" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
