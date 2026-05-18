import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ExternalLink, CheckCircle2, FileText, ListChecks,
  Sparkles, Clock, Banknote, ShieldCheck, Calendar, ArrowRight,
} from 'lucide-react';
import { VISA_DETAILS } from '../../../data/visaDetails';
import { VISA_FAQS } from '../../../data/visaFaqs';
import VisaFaqSection from '../../../components/VisaFaqSection';
import RelatedBlogToVisa from '../../../components/RelatedBlogToVisa';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

const CATEGORY_COLORS: Record<string, string> = {
  Work: '#d9152b',
  Study: '#2563eb',
  Family: '#7c3aed',
  Visit: '#0891b2',
};

export function generateStaticParams() {
  return Object.keys(VISA_DETAILS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const v = VISA_DETAILS[slug];
  if (!v) return { title: 'Visa not found' };
  const title = `${v.title} 2026 — Fees, Eligibility & How to Apply`;
  const description = `${v.summary} Fee: ${v.fee}. IHS: ${v.ihs}. Processing: ${v.processing.outside} (outside UK). Updated ${v.updated}.`;
  return {
    title,
    description,
    alternates: { canonical: `/visa/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://ukvisainfo.co.uk/visa/${slug}`,
      type: 'article',
    },
  };
}

export default async function VisaPage({ params }: RouteParams) {
  const { slug } = await params;
  const v = VISA_DETAILS[slug];
  if (!v) notFound();

  const faqs = VISA_FAQS[slug] ?? [];
  const catColor = CATEGORY_COLORS[v.category] ?? '#d9152b';

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: v.title,
    description: v.summary,
    datePublished: '2026-04-01',
    dateModified: '2026-04-23',
    author: { '@type': 'Organization', name: 'UK Visa Info' },
    publisher: { '@type': 'Organization', name: 'UK Visa Info' },
    mainEntityOfPage: `https://ukvisainfo.co.uk/visa/${slug}`,
  };

  const faqJsonLd = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      {/* ── DARK HERO HEADER ── */}
      <div className="hero-dark pt-[88px] md:pt-[104px] pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Back nav */}
          <Link
            href="/visa-types"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All visa routes
          </Link>

          {/* Category badge */}
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] mb-4"
            style={{ background: `${catColor}25`, color: catColor }}
          >
            {v.category} visa
          </span>

          {/* Title & tagline */}
          <h1 className="font-display text-white text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-bold leading-tight tracking-tight">
            {v.title}
          </h1>
          <p className="mt-3 text-white/58 text-base md:text-lg leading-relaxed max-w-2xl">
            {v.tagline}
          </p>

          {/* Stat chips row */}
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { icon: Banknote, label: 'Fee', value: v.fee },
              { icon: ShieldCheck, label: 'IHS', value: v.ihs },
              { icon: Calendar, label: 'Duration', value: v.duration },
              { icon: Clock, label: 'Processing', value: v.processing.outside },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 bg-white/[0.08] border border-white/[0.12] rounded-xl px-4 py-2.5"
              >
                <Icon className="w-4 h-4 text-white/45 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/40 leading-none mb-0.5">
                    {label}
                  </div>
                  <div className="text-sm font-semibold text-white leading-none">
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">

          {/* Apply button — prominent at top of content */}
          <a
            href={v.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white font-bold px-6 py-3.5 rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_2px_12px_rgba(0,0,0,0.2)] mb-12"
            style={{ background: catColor }}
          >
            Apply on gov.uk <ExternalLink className="w-4 h-4" />
          </a>

          {/* Overview */}
          <ContentSection>
            <SectionHeading color={catColor}>Overview</SectionHeading>
            <p className="text-[#0e1424] leading-[1.75] text-[1.0625rem]">{v.summary}</p>
          </ContentSection>

          {/* Eligibility */}
          <ContentSection>
            <SectionHeading icon={CheckCircle2} color={catColor}>Eligibility</SectionHeading>
            <ul className="space-y-3">
              {v.eligibility.map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span
                    className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${catColor}14` }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: catColor }} />
                  </span>
                  <span className="text-[#0e1424] text-[0.9375rem] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </ContentSection>

          {/* Documents */}
          <ContentSection>
            <SectionHeading icon={FileText} color={catColor}>Required documents</SectionHeading>
            <ul className="space-y-3">
              {v.documents.map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span
                    className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${catColor}14` }}
                  >
                    <FileText className="w-3 h-3" style={{ color: catColor }} />
                  </span>
                  <span className="text-[#0e1424] text-[0.9375rem] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </ContentSection>

          {/* How to apply */}
          <ContentSection>
            <SectionHeading icon={ListChecks} color={catColor}>How to apply</SectionHeading>
            <ol className="space-y-5">
              {v.steps.map((s, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full text-white font-bold text-sm flex items-center justify-center shadow-sm"
                    style={{ background: catColor }}
                  >
                    {i + 1}
                  </span>
                  <div className="pt-0.5">
                    <div className="font-semibold text-[#0a1530] text-[0.9375rem]">{s.title}</div>
                    <div className="text-sm text-[#52596e] mt-0.5 leading-relaxed">{s.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </ContentSection>

          {/* Key notes */}
          {v.notes && v.notes.length > 0 && (
            <ContentSection>
              <SectionHeading icon={Sparkles} color={catColor}>Key notes</SectionHeading>
              <ul className="space-y-3">
                {v.notes.map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: catColor }} />
                    <span className="text-[#0e1424] text-[0.9375rem] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </ContentSection>
          )}

          {/* Bottom apply CTA */}
          <div className="mt-10 pt-10 border-t border-[rgba(14,20,36,0.08)] flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href={v.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white font-bold px-6 py-3.5 rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ background: catColor }}
            >
              Apply on gov.uk <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              href="/eligibility"
              className="inline-flex items-center gap-2 bg-[rgba(14,20,36,0.05)] text-[#0a1530] font-semibold px-6 py-3.5 rounded-xl text-sm hover:bg-[rgba(14,20,36,0.09)] transition-colors"
            >
              Check my eligibility <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* FAQ */}
          <VisaFaqSection faqs={faqs} />

          {/* Related blog posts */}
          <RelatedBlogToVisa visaSlug={slug} />
        </div>
      </div>
    </>
  );
}

function ContentSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="mb-10 bg-white border border-[rgba(14,20,36,0.07)] rounded-2xl p-6 md:p-8 shadow-soft">
      {children}
    </section>
  );
}

function SectionHeading({
  children,
  icon: Icon,
  color,
}: {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}) {
  return (
    <h2 className="font-display text-[1.125rem] md:text-[1.25rem] font-bold text-[#0a1530] mb-5 flex items-center gap-2.5">
      {Icon && (
        <span
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}14` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </span>
      )}
      {children}
    </h2>
  );
}
