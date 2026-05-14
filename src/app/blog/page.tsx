import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { BLOG_POSTS } from '../../data/blog';

export const metadata: Metadata = {
  title: 'UK Visa Blog — Guides, Updates & Explainers 2026',
  description:
    'In-depth articles on UK visa rules, fees, eligibility and processing. Updated for 2026 with salary thresholds, IHS rates, Family visa income rules and eVisa transition.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'UK Visa Blog — Guides & Explainers',
    description: 'In-depth UK visa guides updated for 2026.',
    url: 'https://ukvisainfo.co.uk/blog',
  },
};

export default function BlogIndex() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
  const [featured, ...rest] = posts;

  return (
    <>
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-10 md:pb-14 mesh-bg-light">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-secondary mb-3">
            Blog &amp; Guides
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary tracking-tight">
            Long-form UK visa guides
          </h1>
          <p className="mt-4 max-w-2xl text-on-surface-variant text-base md:text-lg leading-relaxed">
            Plain-English deep dives on the rules behind your application —
            updated for 2026 thresholds and processing times.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Featured */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group block relative overflow-hidden bg-primary text-white rounded-3xl md:rounded-[2rem] p-7 md:p-12 mb-10 md:mb-14 shadow-card"
            >
              <div className="aurora opacity-50" aria-hidden="true" />
              <div className="dot-pattern absolute inset-0 opacity-30" aria-hidden="true" />
              <div className="relative z-10 max-w-3xl">
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-accent mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Latest article
                </span>
                <h2 className="font-display text-2xl md:text-4xl font-bold leading-tight">
                  {featured.title}
                </h2>
                <p className="mt-3 text-white/65 text-sm md:text-base leading-relaxed">
                  {featured.description}
                </p>
                <div className="mt-6 flex items-center gap-5 text-xs text-white/60">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(featured.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {featured.readMinutes} min read
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 text-accent font-semibold">
                    Read <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Grid of remaining */}
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {rest.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block h-full bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 md:p-7 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all"
                >
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold uppercase tracking-widest text-secondary bg-secondary-soft rounded-full px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display text-lg md:text-xl font-bold text-primary leading-snug group-hover:text-secondary transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                  <div className="mt-5 pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readMinutes} min
                    </span>
                    <span className="inline-flex items-center gap-1 text-secondary font-semibold">
                      Read <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
