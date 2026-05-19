import Link from 'next/link';
import { ArrowRight, Clock, Briefcase, Globe2, Building2 } from 'lucide-react';
import { BLOG_POSTS, type BlogPost } from '../data/blog';
import { VISA_DETAILS } from '../data/visaDetails';
import { COUNTRIES } from '../data/countries';
import { SOC_OCCUPATIONS } from '../data/socCodes';
import { socSlug } from '../lib/slug';

/** Score by tag overlap (weight 2) + recency (months). */
function scorePost(current: BlogPost, candidate: BlogPost): number {
  if (candidate.slug === current.slug) return -1;
  const overlap = candidate.tags.filter((t) => current.tags.includes(t)).length;
  if (overlap === 0) return 0;
  const monthsOld = (Date.now() - new Date(candidate.date).getTime()) / (1000 * 60 * 60 * 24 * 30);
  return overlap * 2 + Math.max(0, 6 - monthsOld) * 0.25;
}

/* Map blog tags to visa slugs so we can recommend visa guides too. */
const TAG_TO_VISA: Record<string, string[]> = {
  'Skilled Worker':     ['skilled-worker'],
  'Student':            ['student'],
  'Student visa':       ['student'],
  'Family':             ['family'],
  'Family visa':        ['family'],
  'Visitor':            ['visitor'],
  'Visitor visa':       ['visitor'],
  'Health & Care':      ['health'],
  'Graduate':           ['graduate'],
  'Graduate visa':      ['graduate'],
  'ILR':                ['ilr', 'citizenship'],
  'Citizenship':        ['citizenship'],
  'Talent':             ['talent'],
};

function visasFor(tags: string[]): string[] {
  const ids = new Set<string>();
  for (const t of tags) for (const v of TAG_TO_VISA[t] ?? []) ids.add(v);
  return [...ids];
}

export default function RelatedPosts({ current }: { current: BlogPost }) {
  /* Related blog posts (top 3 by tag overlap + recency) */
  const relatedPosts = [...BLOG_POSTS]
    .map((p) => ({ post: p, score: scorePost(current, p) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, 3);

  /* Cross-type recommendations: visa guides + countries + a salient SOC code */
  const visaIds = visasFor(current.tags);
  const visas = visaIds
    .map((id) => VISA_DETAILS[id as keyof typeof VISA_DETAILS])
    .filter((v): v is NonNullable<typeof v> => !!v)
    .slice(0, 2);

  const countries = Object.values(COUNTRIES)
    .filter((c) => c.status === 'full')
    .slice(0, 2);

  /* If post is about Skilled Worker / salary, recommend the most-searched SOC code page */
  const isSalaryPost = current.tags.some((t) => /salary|skilled|threshold/i.test(t)) || /salary|threshold/i.test(current.title);
  const featuredSoc = isSalaryPost
    ? SOC_OCCUPATIONS.find((o) => /software developer/i.test(o.title)) ?? SOC_OCCUPATIONS[0]
    : null;

  if (relatedPosts.length === 0 && visas.length === 0 && !featuredSoc) return null;

  return (
    <section className="mt-12 pt-8 border-t border-[rgba(14,20,36,0.08)]">
      {relatedPosts.length > 0 && (
        <>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9aa3b8] mb-4">
            Related articles
          </div>
          <ul className="grid gap-3 sm:grid-cols-3 mb-8">
            {relatedPosts.map(({ post }) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block h-full bg-white border border-[rgba(14,20,36,0.07)] rounded-2xl p-4 hover:border-[#0A2540] hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(10, 37, 64,0.08)] transition-[transform,border-color,box-shadow] duration-150"
                >
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {post.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[9.5px] font-bold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-full bg-[#f3f5fb] text-[#52596e]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="text-[13.5px] font-bold text-[#0A2540] group-hover:text-[#00C4B4] transition-colors duration-100 leading-snug mb-2">
                    {post.title}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#7a8195]">
                    <Clock className="w-3 h-3" />
                    {post.readMinutes} min read
                    <ArrowRight className="w-3 h-3 ml-auto text-[#00C4B4] opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {(visas.length > 0 || countries.length > 0 || featuredSoc) && (
        <>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9aa3b8] mb-4">
            Related across the site
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 mb-3">
            {visas.map((v) => (
              <li key={v.id}>
                <Link href={`/visa/${v.id}`} className="group flex items-start gap-3 p-3.5 rounded-xl border border-[rgba(14,20,36,0.06)] bg-white hover:border-[#0A2540] transition-colors duration-100">
                  <span className="w-8 h-8 rounded-lg bg-[rgba(0, 196, 180,0.08)] text-[#00C4B4] flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9aa3b8]">Visa guide</div>
                    <div className="text-[13.5px] font-semibold text-[#0A2540] group-hover:text-[#00C4B4] transition-colors duration-100 truncate">
                      {v.title}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#cfd5e0] mt-1 flex-shrink-0" />
                </Link>
              </li>
            ))}

            {countries.map((c) => (
              <li key={c.code}>
                <Link href={`/from/${c.code}`} className="group flex items-start gap-3 p-3.5 rounded-xl border border-[rgba(14,20,36,0.06)] bg-white hover:border-[#0A2540] transition-colors duration-100">
                  <span className="w-8 h-8 rounded-lg bg-[rgba(10, 37, 64,0.08)] text-[#0A2540] flex items-center justify-center flex-shrink-0">
                    <Globe2 className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9aa3b8]">Country guide</div>
                    <div className="text-[13.5px] font-semibold text-[#0A2540] group-hover:text-[#00C4B4] transition-colors duration-100 truncate">
                      UK visa for {c.demonym} <span className="text-lg">{c.flag}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#cfd5e0] mt-1 flex-shrink-0" />
                </Link>
              </li>
            ))}

            {featuredSoc && (
              <li className="sm:col-span-2">
                <Link href={`/salary/${socSlug(featuredSoc.code, featuredSoc.title)}`} className="group flex items-start gap-3 p-3.5 rounded-xl border border-[rgba(14,20,36,0.06)] bg-white hover:border-[#0A2540] transition-colors duration-100">
                  <span className="w-8 h-8 rounded-lg bg-[rgba(0, 127, 118,0.08)] text-[#007F76] flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9aa3b8]">Salary page</div>
                    <div className="text-[13.5px] font-semibold text-[#0A2540] group-hover:text-[#00C4B4] transition-colors duration-100 truncate">
                      {featuredSoc.title} (SOC {featuredSoc.code}) — £{featuredSoc.goingRate.toLocaleString()}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#cfd5e0] mt-1 flex-shrink-0" />
                </Link>
              </li>
            )}
          </ul>
        </>
      )}
    </section>
  );
}
