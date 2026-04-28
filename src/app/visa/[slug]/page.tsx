import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, CheckCircle2, FileText, ListChecks, Sparkles, Clock, Banknote, ShieldCheck, Calendar } from 'lucide-react';
import { VISA_DETAILS } from '../../../data/visaDetails';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

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

  const jsonLd = {
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/visa-types"
          className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> All visa types
        </Link>

        <header className="mb-10">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-secondary mb-3">
            {v.category} visa · Updated {v.updated}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">{v.title}</h1>
          <p className="text-xl text-on-surface-variant">{v.tagline}</p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          <Stat icon={Banknote} label="Fee" value={v.fee} />
          <Stat icon={ShieldCheck} label="IHS" value={v.ihs} />
          <Stat icon={Calendar} label="Duration" value={v.duration} />
          <Stat icon={Clock} label="Processing" value={v.processing.outside} />
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-3">Overview</h2>
          <p className="text-base leading-relaxed text-on-surface">{v.summary}</p>
        </section>

        <Section icon={CheckCircle2} title="Eligibility">
          <ul className="space-y-2">
            {v.eligibility.map((item, i) => (
              <li key={i} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={FileText} title="Required documents">
          <ul className="space-y-2">
            {v.documents.map((item, i) => (
              <li key={i} className="flex gap-3">
                <FileText className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={ListChecks} title="How to apply">
          <ol className="space-y-4">
            {v.steps.map((s, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/15 text-secondary font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <div className="font-semibold text-primary">{s.title}</div>
                  <div className="text-sm text-on-surface-variant">{s.desc}</div>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {v.notes && v.notes.length > 0 && (
          <Section icon={Sparkles} title="Key notes">
            <ul className="space-y-2">
              {v.notes.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <Sparkles className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <a
          href={v.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-secondary text-white font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-colors"
        >
          Apply on gov.uk <ExternalLink className="w-4 h-4" />
        </a>
      </article>
    </>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="border border-outline-variant/30 rounded-xl p-4 bg-surface-container-lowest">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <div className="text-base font-semibold text-primary">{value}</div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-primary mb-4">
        <Icon className="w-6 h-6 text-secondary" /> {title}
      </h2>
      <div className="text-on-surface">{children}</div>
    </section>
  );
}
