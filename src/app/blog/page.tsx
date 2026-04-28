import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../../data/blog';

export const metadata: Metadata = {
  title: 'UK Visa Blog — Guides, Updates & Explainers 2026',
  description:
    'In-depth articles on UK visa rules, fees, eligibility and processing. Updated for 2026 with salary thresholds, IHS rates, Family visa income rules and eVisa transition.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'UK Visa Blog — Guides & Explainers',
    description:
      'In-depth UK visa guides updated for 2026.',
    url: 'https://ukvisainfo.co.uk/blog',
  },
};

export default function BlogIndex() {
  const posts = [...BLOG_POSTS].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-12">
        <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-secondary mb-3">
          UK Visa Info Blog
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
          Guides, explainers &amp; 2026 updates
        </h1>
        <p className="text-xl text-on-surface-variant max-w-3xl">
          Long-form, up-to-date articles on UK visa rules. Written to answer the
          specific questions applicants actually ask — not recycled from gov.uk.
        </p>
      </header>

      <ul className="space-y-6">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="border border-outline-variant/30 rounded-2xl p-6 md:p-8 bg-surface-container-lowest hover:border-secondary/60 transition-colors"
          >
            <Link href={`/blog/${post.slug}`} className="block group">
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold uppercase tracking-widest text-secondary bg-secondary/10 rounded-full px-2 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary group-hover:text-secondary transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-base text-on-surface-variant mb-4">
                {post.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readMinutes} min read
                </span>
                <span className="ml-auto flex items-center gap-1 text-secondary font-medium">
                  Read <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
