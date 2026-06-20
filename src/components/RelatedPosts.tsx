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

const eyebrow = 'font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600 mb-3';
const crossCard =
  'group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-cs';
const crossIcon = 'flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-blue-50 text-blue-600';

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
    <section className="space-y-8">
      {relatedPosts.length > 0 && (
        <div>
          <p className={eyebrow}>Related articles</p>
          <ul className="space-y-3">
            {relatedPosts.map(({ post }) => {
              const catMeta = getCategoryMeta(postCategory(post));
              return (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group relative block overflow-hidden rounded-xl border border-slate-200 bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-cs"
                  >
                    <span className="absolute left-0 top-0 bottom-0 w-1 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: catMeta.accent }} />
                    <div className="mb-1.5 flex flex-wrap gap-1.5 pl-1">
                      {post.tags.slice(0, 2).map((t) => (
                        <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="pl-1 text-[13.5px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-700">
                      {post.title}
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 pl-1 text-[11px] text-slate-500">
                      <Clock className="h-3.5 w-3.5" /> {post.readMinutes} min read
                      <ArrowRight className="ml-auto h-3.5 w-3.5 text-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {(visas.length > 0 || countries.length > 0 || featuredSoc) && (
        <div>
          <p className={eyebrow}>Across the site</p>
          <ul className="space-y-2">
            {visas.map((v) => (
              <li key={v.id}>
                <Link href={`/visa-types/${v.id}`} className={crossCard}>
                  <span className={crossIcon}><Briefcase className="h-3.5 w-3.5" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Visa guide</div>
                    <div className="truncate text-[13px] font-semibold text-slate-900 group-hover:text-blue-700">{v.title}</div>
                  </div>
                  <ArrowRight className="mt-1.5 h-3.5 w-3.5 flex-none text-slate-300 group-hover:text-blue-600" />
                </Link>
              </li>
            ))}

            {countries.map((c) => (
              <li key={c.code}>
                <Link href={`/from/${c.code}`} className={crossCard}>
                  <span className={crossIcon}><Globe2 className="h-3.5 w-3.5" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Country guide</div>
                    <div className="truncate text-[13px] font-semibold text-slate-900 group-hover:text-blue-700">
                      UK visa for {c.demonym} <span className="text-lg">{c.flag}</span>
                    </div>
                  </div>
                  <ArrowRight className="mt-1.5 h-3.5 w-3.5 flex-none text-slate-300 group-hover:text-blue-600" />
                </Link>
              </li>
            ))}

            {featuredSoc && (
              <li>
                <Link href={`/salary/${socSlug(featuredSoc.code, featuredSoc.title)}`} className={crossCard}>
                  <span className={crossIcon}><Building2 className="h-3.5 w-3.5" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Salary page</div>
                    <div className="truncate text-[13px] font-semibold text-slate-900 group-hover:text-blue-700">
                      {featuredSoc.title} (SOC {featuredSoc.code})
                    </div>
                  </div>
                  <ArrowRight className="mt-1.5 h-3.5 w-3.5 flex-none text-slate-300 group-hover:text-blue-600" />
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </section>
  );
}
