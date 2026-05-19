import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { NEWS_ITEMS, getNewsItem } from '../../../data/news';
import EmailCapture from '../../../components/EmailCapture';

interface RouteParams { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return NEWS_ITEMS.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const n = getNewsItem(slug);
  if (!n) return { title: 'News update not found' };
  return {
    title: `${n.title} — UK Visa News`,
    description: n.summary,
    alternates: { canonical: `/news/${slug}` },
    openGraph: {
      title: n.title, description: n.summary,
      url: `https://ukvisainfo.co.uk/news/${slug}`,
      type: 'article', publishedTime: n.date,
    },
  };
}

export default async function NewsItemPage({ params }: RouteParams) {
  const { slug } = await params;
  const n = getNewsItem(slug);
  if (!n) notFound();

  const others = NEWS_ITEMS.filter((o) => o.slug !== n.slug).slice(0, 3);

  return (
    <>
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0e1b3f] to-[#0F2C4B] pt-[100px] md:pt-[120px] pb-10 md:pb-14">
        <div className="absolute inset-0 opacity-[0.18] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201, 161, 74,0.5) 1px, transparent 0)', backgroundSize: '22px 22px' }} />
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-[#00C4B4]/15 blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <Link href="/news" className="inline-flex items-center gap-1.5 text-white/55 hover:text-white text-sm font-medium mb-6 transition-colors duration-100">
            <ArrowLeft className="w-4 h-4" /> All updates
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center text-[10.5px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-[#C9A14A] text-[#0A2540]">
              {n.category}
            </span>
            <span className="text-[11.5px] text-white/45 inline-flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {new Date(n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <h1 className="font-display text-white text-[1.625rem] sm:text-[2rem] md:text-[2.5rem] font-bold leading-tight tracking-[-0.025em]">
            {n.title}
          </h1>
          <p className="mt-4 text-white/65 text-base leading-relaxed">{n.summary}</p>
        </div>
      </header>

      <div className="bg-white">
        <article className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="prose-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="text-[#1a2240] text-[1.0625rem] leading-[1.75] mb-4">{children}</p>,
                strong: ({ children }) => <strong className="font-bold text-[#0A2540]">{children}</strong>,
                ul: ({ children }) => <ul className="my-4 space-y-2 pl-0">{children}</ul>,
                li: ({ children }) => (
                  <li className="flex gap-3 items-start text-[#1a2240] text-[1.0625rem] leading-[1.65]">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#00C4B4] flex-shrink-0" />
                    <span>{children}</span>
                  </li>
                ),
                a: ({ href, children }) => (
                  <a href={href} className="text-[#00C4B4] underline decoration-[#00C4B4]/35 hover:decoration-[#00C4B4] font-medium">{children}</a>
                ),
              }}
            >{n.body}</ReactMarkdown>
          </div>

          {n.source && (
            <a
              href={n.source}
              target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fafbfd] border border-[rgba(14,20,36,0.07)] text-[#0A2540] text-[13px] font-semibold hover:border-[#0A2540] transition-colors duration-100"
            >
              Read the official source <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <div className="mt-10">
            <EmailCapture
              title="Don't miss the next update"
              subtitle="Weekly briefs on rule changes, fee uplifts and route news straight to your inbox."
              cta="Subscribe"
              source={`news:${n.slug}`}
            />
          </div>

          {others.length > 0 && (
            <section className="mt-12 pt-8 border-t border-[rgba(14,20,36,0.08)]">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9aa3b8] mb-4">More updates</div>
              <ul className="space-y-2">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/news/${o.slug}`} className="group flex items-center gap-3 p-3 rounded-xl border border-[rgba(14,20,36,0.06)] bg-white hover:border-[#0A2540] transition-colors duration-100">
                      <span className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#9aa3b8] tabular-nums w-20 flex-shrink-0">
                        {new Date(o.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                      <span className="text-[13.5px] font-semibold text-[#0A2540] truncate flex-1 group-hover:text-[#00C4B4] transition-colors duration-100">{o.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#cfd5e0] flex-shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </div>
    </>
  );
}
