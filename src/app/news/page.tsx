import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { NEWS_ITEMS } from '../../data/news';

export const metadata: Metadata = {
  title: 'UK Visa News — Rule Changes, Fee Updates & Processing 2026',
  description: 'Latest UK immigration updates — fee uplifts, route changes, processing-time shifts and eVisa rollout. Sourced from gov.uk.',
  alternates: { canonical: '/news' },
};

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  Rules:      { bg: 'rgba(217,21,43,0.08)',  text: '#d9152b' },
  Fees:       { bg: 'rgba(217,119,6,0.08)',  text: '#d97706' },
  Processing: { bg: 'rgba(8,145,178,0.08)',  text: '#0891b2' },
  eVisa:      { bg: 'rgba(37,99,235,0.08)',  text: '#2563eb' },
  Routes:     { bg: 'rgba(5,150,105,0.08)',  text: '#059669' },
  Sponsors:   { bg: 'rgba(124,58,237,0.08)', text: '#7c3aed' },
};

export default function NewsIndex() {
  const items = [...NEWS_ITEMS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="bg-white">
      <section className="pt-[100px] md:pt-[120px] pb-12 md:pb-14 bg-gradient-to-br from-[#0a1530] via-[#0e1b3f] to-[#13204a] relative isolate overflow-hidden">
        <div className="absolute inset-0 opacity-[0.18] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)', backgroundSize: '22px 22px' }} />
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-[#d9152b]/15 blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#ffbf47] mb-3">
            <Newspaper className="w-3 h-3" /> Updates
          </span>
          <h1 className="font-display text-white text-[1.75rem] sm:text-[2.25rem] md:text-[2.875rem] font-bold tracking-[-0.025em] leading-[1.05]">
            UK visa news &amp; updates
          </h1>
          <p className="mt-4 max-w-2xl text-white/55 text-base leading-relaxed">
            Short briefs on UK immigration changes — fee uplifts, route closures, processing-time shifts. Updated weekly. Subscribe to the newsletter to get them on Tuesdays.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#fafbfd]">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 space-y-4">
          {items.map((n) => {
            const c = CAT_COLORS[n.category] ?? { bg: 'rgba(14,20,36,0.06)', text: '#52596e' };
            return (
              <Link
                key={n.slug}
                href={`/news/${n.slug}`}
                className="group block bg-white rounded-2xl border border-[rgba(14,20,36,0.07)] p-5 md:p-6 hover:border-[#0a1530] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(10,21,48,0.08)] transition-[transform,border-color,box-shadow] duration-150"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center text-[10.5px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.text }}>
                    {n.category}
                  </span>
                  <span className="text-[11.5px] text-[#9aa3b8] inline-flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {new Date(n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <h2 className="font-display font-bold text-[1.0625rem] md:text-[1.1875rem] text-[#0a1530] leading-snug group-hover:text-[#d9152b] transition-colors duration-100">
                  {n.title}
                </h2>
                <p className="mt-2 text-[14px] text-[#52596e] leading-relaxed line-clamp-2">{n.summary}</p>
                <div className="mt-4 pt-3 border-t border-[rgba(14,20,36,0.06)] inline-flex items-center gap-1 text-[12.5px] font-bold text-[#d9152b] group-hover:gap-2 transition-[gap] duration-100">
                  Read full update <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
