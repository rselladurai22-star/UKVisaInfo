import Link from 'next/link';
import type { ReactNode } from 'react';
import { ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';
import FaqJsonLd, { type FaqItem } from './FaqJsonLd';
import EditorByline from '../EditorByline';
import Methodology from './Methodology';
import CalcArticle, { type ArticleSection } from './CalcArticle';
import c from './calcLayout.module.css';

export interface CalcLayoutProps {
  crumb: { label: string; href?: string }[];
  eyebrow: string;
  title: string;
  deck: string;
  verified?: string;
  /** Canonical path (used by callers for metadata/canonical links). */
  url?: string;
  /** The interactive calculator (client component). */
  children: ReactNode;
  methodology?: { summary: string; govUrl?: string; govLabel?: string };
  article: { heading: string; readingTime?: string; sections: ArticleSection[] };
  faqs?: FaqItem[];
  /** Optional meta cards rendered in a sticky right rail. */
  sidebar?: ReactNode;
  disclaimer?: string;
  editorVerified?: string;
  hideByline?: boolean;
}

export default function CalcLayout({
  crumb, eyebrow, title, deck, verified = 'gov.uk verified',
  url, children, methodology, article, faqs, sidebar, disclaimer,
  editorVerified = 'May 2026', hideByline = false,
}: CalcLayoutProps) {
  const main = (
    <div style={{ minWidth: 0 }}>
      {!hideByline && (
        <div style={{ marginBottom: 16 }}><EditorByline verified={editorVerified} /></div>
      )}

      {children}

      {methodology ? (
        <Methodology summary={methodology.summary} govUrl={methodology.govUrl} govLabel={methodology.govLabel} />
      ) : (
        <Methodology summary="This calculator uses current UK government rules, HMRC rates and ONS data, verified against the primary sources we list site-wide." />
      )}

      <CalcArticle heading={article.heading} readingTime={article.readingTime} sections={article.sections} />

      {disclaimer && <p className={c.disclaimer}>{disclaimer}</p>}
    </div>
  );

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {faqs && faqs.length > 0 && <FaqJsonLd faqs={faqs} />}

      {/* ───────────── HERO ───────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.55]"
          style={{
            background:
              'radial-gradient(55% 80% at 15% 0%, #ECFDF5 0%, transparent 60%), radial-gradient(45% 65% at 95% 10%, #FBF6E7 0%, transparent 65%)',
          }}
        />
        <div className="container-page pt-10 pb-12 sm:pt-16 sm:pb-16 lg:pt-20">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-on-surface-variant">
            {crumb.map((b, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                {b.href ? (
                  <Link href={b.href} className="transition hover:text-primary">{b.label}</Link>
                ) : (
                  <span className="text-primary">{b.label}</span>
                )}
                {i < crumb.length - 1 && <ChevronRight className="h-3 w-3 opacity-50" />}
              </span>
            ))}
          </nav>

          <div className="mt-6 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-container-lowest px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              {eyebrow}
            </span>

            <h1 className="h-1 mt-5">
              {title}
            </h1>
            <p className="t-lead mt-5 max-w-2xl">
              {deck}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              <li className="inline-flex items-center gap-1.5 rounded-full border border-secondary/20 bg-secondary-soft px-3 py-1.5 text-xs font-semibold text-secondary">
                <ShieldCheck className="h-3.5 w-3.5" />
                {verified}
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-container-lowest/80 px-3 py-1.5 text-xs font-medium text-on-surface-variant">
                Free · No sign-up
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-container-lowest/80 px-3 py-1.5 text-xs font-medium text-on-surface-variant">
                Updated 2026/27
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────── BODY ───────────── */}
      <div className="container-page pb-20 pt-10">
        {sidebar ? (
          <div className={c.withSidebar}>
            {main}
            <aside><div className={c.sideStack}>{sidebar}</div></aside>
          </div>
        ) : main}
      </div>
    </div>
  );
}
