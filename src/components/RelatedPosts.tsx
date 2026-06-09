import Link from 'next/link';
import { ArrowRight, Clock, Briefcase, Globe2, Building2 } from 'lucide-react';
import { BLOG_POSTS, type BlogPost, postCategory, getCategoryMeta } from '../data/blog';
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
    <section className="mt-12 pt-8 border-t border-outline-variant/60">
      {relatedPosts.length > 0 && (
        <>
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
        </>
      )}

      {(visas.length > 0 || countries.length > 0 || featuredSoc) && (
        <>
          <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 mb-4">
            Related across the site
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 mb-3">
            {visas.map((v) => (
              <li key={v.id}>
                <Link href={`/visa-types/${v.id}`} className="group relative flex items-start gap-3 p-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:shadow-md hover:border-primary/50 active:scale-[0.99] transition-all duration-100">
                  <span className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">Visa guide</div>
                    <div className="text-[13px] font-semibold text-on-surface group-hover:text-primary transition-colors duration-100 truncate">
                      {v.title}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary mt-1.5 flex-shrink-0 transition-colors" />
                </Link>
              </li>
            ))}

            {countries.map((c) => (
              <li key={c.code}>
                <Link href={`/from/${c.code}`} className="group relative flex items-start gap-3 p-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:shadow-md hover:border-primary/50 active:scale-[0.99] transition-all duration-100">
                  <span className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center flex-shrink-0">
                    <Globe2 className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">Country guide</div>
                    <div className="text-[13px] font-semibold text-on-surface group-hover:text-primary transition-colors duration-100 truncate">
                      UK visa for {c.demonym} <span className="text-lg">{c.flag}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary mt-1.5 flex-shrink-0 transition-colors" />
                </Link>
              </li>
            ))}

            {featuredSoc && (
              <li className="sm:col-span-2">
                <Link href={`/salary/${socSlug(featuredSoc.code, featuredSoc.title)}`} className="group relative flex items-start gap-3 p-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:shadow-md hover:border-primary/50 active:scale-[0.99] transition-all duration-100">
                  <span className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">Salary page</div>
                    <div className="text-[13px] font-semibold text-on-surface group-hover:text-primary transition-colors duration-100 truncate">
                      {featuredSoc.title} (SOC {featuredSoc.code}) — £{featuredSoc.goingRate.toLocaleString()}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary mt-1.5 flex-shrink-0 transition-colors" />
                </Link>
              </li>
            )}
          </ul>
        </>
      )}
    </section>
  );
}
