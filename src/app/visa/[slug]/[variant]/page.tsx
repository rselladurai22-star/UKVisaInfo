import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowUpRight, ExternalLink, Check, Info, ChevronLeft } from 'lucide-react';
import { VISA_DETAILS } from '../../../../data/visaDetails';
import { VISA_VARIANTS, getVariants } from '../../../../data/visaVariants';
import EditorByline from '../../../../components/EditorByline';
import { primaryEditorSchema } from '../../../../data/editorialTeam';
import c from '../../../../components/calc/calc.module.css';
import s from '../../../../components/visa/visaDetail.module.css';

interface RouteParams { params: Promise<{ slug: string; variant: string }> }

export function generateStaticParams() {
  const all: { slug: string; variant: string }[] = [];
  for (const [slug, vars] of Object.entries(VISA_VARIANTS)) {
    for (const v of vars) all.push({ slug, variant: v.id });
  }
  return all;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug, variant } = await params;
  const visa = VISA_DETAILS[slug as keyof typeof VISA_DETAILS];
  const v = getVariants(slug).find((x) => x.id === variant);
  if (!visa || !v) return { title: 'Sub-route not found' };
  const title = `${visa.title} — ${v.label} (2026 Guide)`;
  const description = `Complete guide for ${v.label}. ${v.headline}. Eligibility, costs and how to apply. Updated April 2026, sourced from GOV.UK.`;
  return {
    title, description,
    alternates: { canonical: `/visa/${slug}/${variant}` },
    openGraph: { title, description, url: `https://ukvisainfo.co.uk/visa/${slug}/${variant}`, type: 'article' },
  };
}

const shortFee = (f: string) => f.match(/£[\d,]+/)?.[0] ?? null;

export default async function VariantPage({ params }: RouteParams) {
  const { slug, variant } = await params;
  const visa = VISA_DETAILS[slug as keyof typeof VISA_DETAILS];
  const v = getVariants(slug).find((x) => x.id === variant);
  if (!visa || !v) notFound();

  const others = getVariants(slug).filter((x) => x.id !== variant);
  const feeStr = v.fee ?? (v.feeAmount ? `£${v.feeAmount.toLocaleString()}` : visa.fee);
  const fee = shortFee(feeStr) ?? shortFee(visa.fee) ?? '—';
  const ihs = v.ihsAdult ? `£${v.ihsAdult.toLocaleString()}` : (shortFee(visa.ihs) ?? '—');
  const dur = v.duration ?? visa.duration.split(/[·;]/)[0].trim();
  const ilr = v.yearsToIlr ? `${v.yearsToIlr} yrs` : '—';

  const SITE = 'https://ukvisainfo.co.uk';
  const articleJsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: `${visa.title} — ${v.label}`, description: v.headline,
    datePublished: '2026-04-08', dateModified: '2026-05-19',
    author: primaryEditorSchema(SITE),
    publisher: { '@type': 'Organization', name: 'UKDesk', url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}/icon.svg` } },
    mainEntityOfPage: `${SITE}/visa/${slug}/${variant}`, inLanguage: 'en-GB',
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Visas', item: `${SITE}/visa-types` },
      { '@type': 'ListItem', position: 3, name: visa.title, item: `${SITE}/visa/${slug}` },
      { '@type': 'ListItem', position: 4, name: v.label, item: `${SITE}/visa/${slug}/${variant}` },
    ],
  };

  return (
    <div className={c.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className={c.wrap}>
        <div className={c.crumb}>
          <Link href="/">Home</Link><span className={c.sep}>›</span>
          <Link href="/visa-types">Visas</Link><span className={c.sep}>›</span>
          <Link href={`/visa/${slug}`}>{visa.title}</Link><span className={c.sep}>›</span>
          <span>{v.label}</span>
        </div>

        <div className={c.toolHead}>
          <span className={c.tag}>{visa.title} · sub-route</span>
          <h1 className={c.h1}>{v.label}</h1>
          <p className={c.intro}>{v.headline}</p>
          <span className={c.trust}><ShieldCheck size={15} /> Sourced from GOV.UK · Updated {visa.updated}</span>
        </div>

        <div className={s.layout}>
          <div className={s.content}>
            <div className={s.answer}>
              <span className={s.answerLbl}>The short answer</span>
              <p>{v.label} is one way to qualify for the {visa.title}. The core rules of the {visa.title} apply — the specifics that set this route apart are below.</p>
            </div>

            <div className={s.facts}>
              <div className={s.fact}><b>{fee}</b><span>Application fee from</span></div>
              <div className={s.fact}><b>{ihs}</b><span>IHS per year</span></div>
              <div className={s.fact}><b>{dur}</b><span>Initial leave</span></div>
              <div className={s.fact}><b>{ilr}</b><span>To settlement (ILR)</span></div>
            </div>

            <h2 id="qualify">Who qualifies for this route</h2>
            <ul className={s.elig}>
              {v.eligibilityHighlights.map((e, i) => (<li key={i} className={s.eligItem}><Check size={18} strokeWidth={2.4} />{e}</li>))}
            </ul>

            {v.notes && v.notes.length > 0 && (
              <>
                <h2 id="good-to-know">Good to know</h2>
                {v.notes.map((n, i) => (<div key={i} className={s.note}><Info size={18} />{n}</div>))}
              </>
            )}

            {others.length > 0 && (
              <>
                <h2 id="other-routes">Other {visa.title} sub-routes</h2>
                <div className={s.subGrid}>
                  {others.map((o) => (
                    <Link key={o.id} href={`/visa/${slug}/${o.id}`} className={s.subCard}>
                      <h3>{o.label}</h3>
                      <p>{o.headline}</p>
                      <span className={s.go}>View <ArrowUpRight size={12} /></span>
                    </Link>
                  ))}
                </div>
              </>
            )}

            <div className={s.srcline}>
              <ShieldCheck size={15} />
              <span>Source: <a href={v.source} target="_blank" rel="noopener noreferrer">GOV.UK — {v.label}</a> · Last verified {visa.updated}</span>
            </div>
            <div style={{ marginTop: 24 }}><EditorByline verified={visa.updated} prefix="Written & verified by" /></div>
          </div>

          <aside className={s.side}>
            <div className={s.card}>
              <h4>This route at a glance</h4>
              <div className={s.krow}><span>Application fee</span><b>{fee}+</b></div>
              <div className={s.krow}><span>IHS / year</span><b>{ihs}</b></div>
              <div className={s.krow}><span>Initial leave</span><b>{dur}</b></div>
              <div className={s.krow}><span>To ILR</span><b>{ilr}</b></div>
              {v.yearsToCitizenship !== undefined && (
                <div className={s.krow}><span>ILR → citizenship</span><b>{v.yearsToCitizenship === 0 ? 'Immediate' : `${v.yearsToCitizenship} yrs`}</b></div>
              )}
            </div>

            <div className={s.ctaCard}>
              <h4>Ready to apply?</h4>
              <p>Start your application on the official GOV.UK service.</p>
              <a className={s.ctaBtn} href={v.source} target="_blank" rel="noopener noreferrer">Apply on GOV.UK <ExternalLink size={13} /></a>
            </div>

            <div className={s.card}>
              <h4>More</h4>
              <Link className={s.linkRow} href={`/visa/${slug}`}>Full {visa.title} guide <ChevronLeft size={14} /></Link>
              <Link className={s.linkRow} href={`/tools/cost-calculator?visa=${slug}`}>Visa cost calculator <ArrowUpRight size={14} /></Link>
              <Link className={s.linkRow} href="/visa-switching">Switching guide <ArrowUpRight size={14} /></Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
