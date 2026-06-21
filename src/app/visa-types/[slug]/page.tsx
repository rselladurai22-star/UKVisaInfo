import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowUpRight, ExternalLink, Check, FileText, Info } from 'lucide-react';
import { VISA_DETAILS } from '../../../data/visaDetails';
import { VISA_FAQS } from '../../../data/visaFaqs';
import { getVariants } from '../../../data/visaVariants';
import VisaFaq from '../../../components/visa/VisaFaq';
import EditorByline from '../../../components/EditorByline';
import { primaryEditorSchema } from '../../../data/editorialTeam';
import s from '../../../components/visa/visaDetailV3.module.css';

interface RouteParams { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return Object.keys(VISA_DETAILS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const v = VISA_DETAILS[slug];
  if (!v) return { title: 'Visa not found' };
  const title = `${v.title} 2026, Fees, Eligibility & Process`;
  const description = `${v.summary} Fee ${v.fee}. IHS ${v.ihs}. Decision in ${v.processing.outside}. Verified ${v.updated}.`;
  return {
    title, description,
    alternates: { canonical: `/visa-types/${slug}` },
    openGraph: {
      title, description, url: `https://ukvisainfo.co.uk/visa-types/${slug}`, type: 'article',
      images: [{ url: `https://ukvisainfo.co.uk/visa-types/${slug}/opengraph-image`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

const shortFee = (f: string) => f.match(/£[\d,]+/)?.[0] ?? ', ';
const shortDur = (d: string) => d.split(/[·;]/)[0].trim();

export default async function VisaPage({ params }: RouteParams) {
  const { slug } = await params;
  const v = VISA_DETAILS[slug];
  if (!v) notFound();

  const faqs = VISA_FAQS[slug] ?? [];
  const variants = getVariants(slug);
  const related = Object.entries(VISA_DETAILS).filter(([k]) => k !== slug).slice(0, 4);
  const canSwitch = !!v.processing.inside && !/^n\/?a/i.test(v.processing.inside);

  const SITE = 'https://ukvisainfo.co.uk';
  const articleJsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: v.title, description: v.summary,
    datePublished: '2026-04-08', dateModified: '2026-05-19',
    author: primaryEditorSchema(SITE),
    publisher: { '@type': 'Organization', name: 'UKDesk', url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}/icon.svg` } },
    image: `${SITE}/visa-types/${slug}/opengraph-image`, mainEntityOfPage: `${SITE}/visa-types/${slug}`, inLanguage: 'en-GB',
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Visas', item: `${SITE}/visa-types` },
      { '@type': 'ListItem', position: 3, name: v.title, item: `${SITE}/visa-types/${slug}` },
    ],
  };
  const howToJsonLd = {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: `How to apply for a ${v.title}`,
    step: v.steps.map((st, i) => ({ '@type': 'HowToStep', position: i + 1, name: st.title, text: st.desc })),
  };
  const faqJsonLd = faqs.length ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  } : null;

  const TOC = [
    { id: 'eligibility', label: 'Who can apply' },
    { id: 'apply', label: 'How to apply' },
    { id: 'documents', label: 'Documents' },
    ...(v.notes?.length ? [{ id: 'good-to-know', label: 'Good to know' }] : []),
    ...(variants.length ? [{ id: 'sub-routes', label: 'Sub-routes' }] : []),
    ...(faqs.length ? [{ id: 'faq', label: 'FAQ' }] : []),
  ];

  return (
    <div className={s.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      <div className="container-page">
        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 pt-5 text-xs font-medium text-on-surface-variant">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="opacity-50">›</span>
          <Link href="/visa-types" className="hover:text-primary">Visas</Link>
          <span className="opacity-50">›</span>
          <span className="text-primary font-semibold">{v.title}</span>
        </nav>

        {/* hero */}
        <header className={s.hero}>
          <span className={s.tag}>{v.category} visa</span>
          <h1 className={s.title}>{v.title}</h1>
          <p className={s.tagline}>{v.tagline}</p>
          <span className={s.trust}>
            <ShieldCheck size={15} /> Sourced from GOV.UK · Updated {v.updated}
          </span>
        </header>

        {/* on-page nav, swipes on phones */}
        <nav aria-label="On this page" className={s.toc}>
          {TOC.map((t) => (
            <a key={t.id} href={`#${t.id}`} className={s.tocLink}>{t.label}</a>
          ))}
        </nav>

        <div className={s.layout}>
          <div className={s.content}>
            {/* answer-first */}
            <div className={s.answer}>
              <span className={s.answerLbl}>The short answer</span>
              <p>{v.summary}</p>
            </div>

            {/* key facts, swipe on phones, grid on desktop */}
            <div className={s.facts}>
              <div className={s.fact}><b>{shortFee(v.fee)}</b><span>Application fee from</span></div>
              <div className={s.fact}><b>{shortFee(v.ihs)}</b><span>IHS per year</span></div>
              <div className={s.fact}><b>{v.processing.outside}</b><span>Decision (outside UK)</span></div>
              <div className={s.fact}><b>{shortDur(v.duration)}</b><span>Initial leave</span></div>
            </div>

            <h2 id="eligibility">Who can apply</h2>
            <ul className={s.elig}>
              {v.eligibility.map((e, i) => (
                <li key={i} className={s.eligItem}><Check size={18} strokeWidth={2.4} />{e}</li>
              ))}
            </ul>

            <h2 id="apply">How to apply</h2>
            <ol className={s.steps}>
              {v.steps.map((st, i) => (
                <li key={i}><b>{st.title}</b><span>{st.desc}</span></li>
              ))}
            </ol>

            <h2 id="documents">Documents you&rsquo;ll need</h2>
            <ul className={s.docs}>
              {v.documents.map((d, i) => (<li key={i}><FileText size={15} />{d}</li>))}
            </ul>

            {v.notes && v.notes.length > 0 && (
              <>
                <h2 id="good-to-know">Good to know</h2>
                {v.notes.map((n, i) => (<div key={i} className={s.note}><Info size={18} />{n}</div>))}
              </>
            )}

            {variants.length > 0 && (
              <>
                <h2 id="sub-routes">Sub-routes</h2>
                <div className={s.subGrid}>
                  {variants.map((va) => (
                    <Link key={va.id} href={`/visa-types/${slug}/${va.id}`} className={s.subCard}>
                      <h3>{va.label}</h3>
                      <p>{va.headline}</p>
                      <span className={s.go}>View <ArrowUpRight size={12} /></span>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {faqs.length > 0 && (
              <>
                <h2 id="faq">Common questions</h2>
                <VisaFaq faqs={faqs} />
              </>
            )}

            <div className={s.srcline}>
              <ShieldCheck size={15} />
              <span>Source: <a href={v.applyUrl} target="_blank" rel="noopener noreferrer">GOV.UK, {v.title}</a> · Last verified {v.updated}</span>
            </div>
            <div style={{ marginTop: 24 }}><EditorByline verified={v.updated} prefix="Written & verified by" /></div>
          </div>

          <aside className={s.side}>
            <div className={s.card}>
              <h4>Key facts</h4>
              <div className={s.krow}><span>Application fee</span><b>{shortFee(v.fee)}+</b></div>
              <div className={s.krow}><span>IHS / year</span><b>{shortFee(v.ihs)}</b></div>
              <div className={s.krow}><span>Initial leave</span><b>{shortDur(v.duration)}</b></div>
              <div className={s.krow}><span>Decision time</span><b>{v.processing.outside}</b></div>
              <div className={s.krow}><span>Switch in-UK</span><b>{canSwitch ? 'Yes' : 'No'}</b></div>
            </div>

            <div className={s.ctaCard}>
              <h4>Ready to apply?</h4>
              <p>Start your application on the official GOV.UK service.</p>
              <a className={s.ctaBtn} href={v.applyUrl} target="_blank" rel="noopener noreferrer">
                Apply on GOV.UK <ExternalLink size={13} />
              </a>
            </div>

            <div className={s.card}>
              <h4>Tools</h4>
              <Link className={s.linkRow} href={`/tools/cost-calculator?visa=${slug}`}>Visa cost calculator <ArrowUpRight size={14} /></Link>
              <Link className={s.linkRow} href="/eligibility">Eligibility quiz <ArrowUpRight size={14} /></Link>
              <Link className={s.linkRow} href="/visa-types/visa-switching">Switching guide <ArrowUpRight size={14} /></Link>
            </div>

            <div className={s.card}>
              <h4>Other routes</h4>
              {related.map(([k, rv]) => (
                <Link key={k} className={s.linkRow} href={`/visa-types/${k}`}>{rv.title} <ArrowUpRight size={14} /></Link>
              ))}
            </div>
          </aside>
        </div>
      </div>

      {/* fixed apply bar, phones only */}
      <div className={s.applyBar}>
        <div className={s.applyBarFee}>
          Fee from
          <b>{shortFee(v.fee)}</b>
        </div>
        <a className={s.applyBarBtn} href={v.applyUrl} target="_blank" rel="noopener noreferrer">
          Apply on GOV.UK <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
