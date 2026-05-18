import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, ArrowUpRight } from 'lucide-react';
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  'skilled-worker': { bg: 'rgba(217,21,43,0.08)', text: '#d9152b' },
  'student': { bg: 'rgba(37,99,235,0.08)', text: '#2563eb' },
  'family': { bg: 'rgba(124,58,237,0.08)', text: '#7c3aed' },
  'visitor': { bg: 'rgba(8,145,178,0.08)', text: '#0891b2' },
  'costs': { bg: 'rgba(217,119,6,0.08)', text: '#d97706' },
  'health': { bg: 'rgba(5,150,105,0.08)', text: '#059669' },
  'graduate': { bg: 'rgba(13,148,136,0.08)', text: '#0d9488' },
};
function tagStyle(tag: string) {
  return TAG_COLORS[tag] ?? { bg: 'rgba(14,20,36,0.06)', text: '#52596e' };
}

export default function BlogIndex() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
  const [featured, second, ...rest] = posts;

  return (
    <div className="bg-white">
      {/* Page hero */}
      <section className="pt-[88px] md:pt-[104px] pb-12 md:pb-16 hero-light">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#d9152b]">
            Blog & Guides
          </span>
          <h1 className="mt-2 font-display text-[1.75rem] sm:text-[2.25rem] md:text-[2.875rem] font-bold text-[#0a1530] tracking-tight leading-tight">
            Long-form UK visa guides
          </h1>
          <p className="mt-3 max-w-2xl text-[#52596e] text-base md:text-lg leading-relaxed">
            Plain-English deep dives on the rules behind your application — updated for
            2026 thresholds, fees and processing times.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">

          {/* Featured post */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group block relative overflow-hidden hero-dark rounded-2xl md:rounded-3xl p-8 md:p-12 mb-10 md:mb-14 shadow-card"
            >
              <div className="dot-pattern absolute inset-0 opacity-40" aria-hidden="true" />
              <div className="relative z-10 max-w-3xl">
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#ffbf47]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffbf47]" />
                    Latest article
                  </span>
                  {featured.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-display text-white text-[1.375rem] md:text-[2rem] font-bold leading-tight">
                  {featured.title}
                </h2>
                <p className="mt-3 text-white/55 text-sm md:text-base leading-relaxed line-clamp-2">
                  {featured.description}
                </p>
                <div className="mt-6 flex items-center gap-5 text-xs text-white/45">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(featured.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {featured.readMinutes} min read
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-[#ffbf47] font-semibold">
                    Read article
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Two-column editorial layout for second + rest */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

            {/* Second post — larger card */}
            {second && (
              <Link
                href={`/blog/${second.slug}`}
                className="group md:row-span-2 flex flex-col bg-[#0a1530] rounded-2xl p-7 shadow-card hover:-translate-y-1 transition-all overflow-hidden relative"
              >
                <div className="dot-pattern absolute inset-0 opacity-25" aria-hidden="true" />
                <div className="relative z-10 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {second.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display text-white text-[1.125rem] md:text-[1.25rem] font-bold leading-snug flex-1">
                    {second.title}
                  </h3>
                  <p className="mt-3 text-white/45 text-sm leading-relaxed line-clamp-3">
                    {second.description}
                  </p>
                  <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/35">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {second.readMinutes} min read
                    </span>
                    <span className="inline-flex items-center gap-1 text-white/60 font-semibold group-hover:text-white transition-colors">
                      Read <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Remaining posts */}
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white border border-[rgba(14,20,36,0.08)] rounded-2xl p-6 md:p-7 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all"
              >
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.slice(0, 2).map((tag) => {
                    const s = tagStyle(tag);
                    return (
                      <span
                        key={tag}
                        className="text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full"
                        style={{ background: s.bg, color: s.text }}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
                <h3 className="font-display text-[1rem] md:text-[1.0625rem] font-bold text-[#0a1530] leading-snug flex-1 group-hover:text-[#d9152b] transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-[#52596e] leading-relaxed line-clamp-2">
                  {post.description}
                </p>
                <div className="mt-5 pt-4 border-t border-[rgba(14,20,36,0.07)] flex items-center justify-between text-xs text-[#52596e]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {post.readMinutes} min read
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#d9152b] font-semibold">
                    Read <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
