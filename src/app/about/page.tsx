import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck, Mail, BookOpen, CheckCircle2, ExternalLink, Sparkles, Building2,
} from 'lucide-react';
import { EDITORS, PRIMARY_EDITOR, primaryEditorSchema } from '../../data/editorialTeam';

const INK     = '#0B0F19';
const CREAM   = '#FAFAF7';
const PAPER   = '#FFFFFF';
const EMERALD = '#047857';
const GOLD    = '#B8860B';
const SLATE   = '#475569';
const MUTED   = '#94908A';
const HAIR    = 'rgba(11,15,25,0.08)';

const SITE = 'https://ukvisainfo.co.uk';

export const metadata: Metadata = {
  title: 'About UKDesk — Who Writes &amp; Verifies the Content',
  description:
    'About ukvisainfo.co.uk: the named editor behind the site, our source-first methodology, advertising disclosure, and how to reach us. Independent UK editorial.',
  alternates: { canonical: '/about' },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: `${SITE}/about`,
    name: 'About UKDesk',
    description: 'Editorial site explaining UK immigration, tax and admin in plain English. Named editor, gov.uk-verified sources.',
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE}#org`,
      name: 'UKDesk',
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/icon.svg` },
      founder: primaryEditorSchema(SITE),
      email: 'contact@ukvisainfo.co.uk',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'editorial',
        email: 'contact@ukvisainfo.co.uk',
        availableLanguage: ['English'],
        areaServed: 'GB',
      },
    },
    mainEntity: primaryEditorSchema(SITE),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />

      <div style={{ background: CREAM, minHeight: '100vh' }}>
        <div className="max-w-3xl mx-auto px-5 md:px-8 pt-[120px] pb-20">

          {/* HERO */}
          <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] mb-4" style={{ color: GOLD }}>
            About
          </p>
          <h1 className="mb-5"
              style={{
                fontFamily: 'Fraunces, serif', fontWeight: 600,
                fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
                lineHeight: 1.02, letterSpacing: '-0.032em', color: INK,
              }}>
            Independent, plainly-written UK admin.
          </h1>
          <p className="text-[16.5px] leading-[1.6] mb-12" style={{ color: SLATE }}>
            UKDesk is an editorial site covering UK immigration, tax,
            property and council-level admin. We translate dense official
            rules into plain English so applicants can decide before they
            spend time or money on a form.
          </p>

          {/* EDITOR PROFILES */}
          <Section eyebrow="01 — The team" title="Who writes the content">
            {EDITORS.map((e) => (
              <article id={e.id} key={e.id} className="rounded-3xl p-6 md:p-7 mb-4 scroll-mt-32"
                       style={{ background: PAPER, border: `1px solid ${HAIR}` }}>
                <div className="flex items-start gap-5">
                  <span aria-hidden
                        className="w-16 h-16 rounded-2xl inline-flex items-center justify-center text-[22px] font-bold flex-shrink-0"
                        style={{ background: INK, color: CREAM, fontFamily: 'Fraunces, serif', letterSpacing: '-0.015em' }}>
                    {e.initials}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[18px] font-semibold" style={{ color: INK, fontFamily: 'Fraunces, serif' }}>
                      {e.name}
                    </p>
                    <p className="text-[13.5px] font-semibold mt-0.5" style={{ color: EMERALD }}>
                      {e.role}
                    </p>
                    <p className="mt-2 text-[12.5px] leading-[1.6]" style={{ color: SLATE }}>
                      {e.scope}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-[14px] leading-[1.7]" style={{ color: INK }}>
                  {e.bio}
                </p>

                <div className="mt-5 pt-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3"
                     style={{ borderTop: `1px solid ${HAIR}` }}>
                  <div>
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-2"
                       style={{ color: MUTED }}>
                      Areas researched
                    </p>
                    <ul className="space-y-1.5">
                      {e.expertise.map((x, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12.5px] leading-[1.55]"
                            style={{ color: SLATE }}>
                          <CheckCircle2 className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: EMERALD }} />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-2"
                       style={{ color: MUTED }}>
                      Contact
                    </p>
                    <ul className="space-y-1.5 text-[12.5px]" style={{ color: SLATE }}>
                      <li className="flex items-center gap-2">
                        <Mail className="w-3 h-3" style={{ color: MUTED }} />
                        <a href={`mailto:${e.email}`} className="hover:underline font-semibold" style={{ color: INK }}>
                          {e.email}
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <BookOpen className="w-3 h-3" style={{ color: MUTED }} />
                        <Link href="/editorial-policy" className="hover:underline font-semibold" style={{ color: INK }}>
                          Editorial policy
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </Section>

          {/* WHAT THIS SITE IS / ISN'T */}
          <Section eyebrow="02 — Scope" title="What UKDesk is &amp; isn’t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card title="What UKDesk is" tone="emerald" icon={CheckCircle2} items={[
                'Editorial research compiled by a named editor',
                'Source-first — every figure links to its gov.uk page',
                'Updated within 7 days of every fee uplift',
                'Free to read; no paywall, no signup',
              ]} />
              <Card title="What UKDesk isn’t" tone="amber" icon={ShieldCheck} items={[
                'Not the UK Home Office or gov.uk',
                'Not legal advice — we are not OISC/SRA regulated',
                'Not a paid-placement site — ads do not influence content',
                'Not anonymous — the editor is named on every page',
              ]} />
            </div>
          </Section>

          {/* METHODOLOGY */}
          <Section eyebrow="03 — How we work" title="Editorial methodology, in short">
            <ul className="space-y-3">
              <Bullet>
                <strong style={{ color: INK }}>Source-first.</strong> Every fee,
                threshold and rule on this site traces to a gov.uk, HMRC or ONS
                page. The full bibliography lives at{' '}
                <Link href="/sources" className="underline font-semibold" style={{ color: INK }}>/sources</Link>.
              </Bullet>
              <Bullet>
                <strong style={{ color: INK }}>Re-verified at each fee uplift.</strong>{' '}
                The entire site is re-audited within 7 days of a Home Office fee
                table change. Every article carries a visible &ldquo;Verified&rdquo; date.
              </Bullet>
              <Bullet>
                <strong style={{ color: INK }}>Plain English, not paraphrased.</strong>{' '}
                We rewrite from the applicant&apos;s decision path — we do not
                copy or restate the gov.uk text verbatim.
              </Bullet>
              <Bullet>
                <strong style={{ color: INK }}>Open to correction.</strong>{' '}
                Spotted an error? Email{' '}
                <a href={`mailto:${PRIMARY_EDITOR.email}?subject=Correction`} className="underline font-semibold" style={{ color: INK }}>
                  {PRIMARY_EDITOR.email}
                </a>{' '}
                — corrections within 48 hours for material errors.
              </Bullet>
            </ul>
            <p className="mt-5">
              <Link href="/editorial-policy"
                    className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold"
                    style={{ color: EMERALD }}>
                Full editorial policy <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </p>
          </Section>

          {/* FUNDING */}
          <Section eyebrow="04 — Independence" title="How UKDesk is funded">
            <p style={p()}>
              UKDesk is reader-supported through Google AdSense display ads and
              clearly-marked affiliate links to services applicants commonly need
              (English-language tests, money transfer, document scanning). Advertising
              has zero influence on which visa routes we cover or how we describe
              them. The full advertising disclosure is in the{' '}
              <Link href="/terms#advertising" className="underline font-semibold" style={{ color: INK }}>Terms of Use</Link>{' '}
              and the funding model is detailed in the{' '}
              <Link href="/editorial-policy#independence-amp-how-ukdesk-is-funded" className="underline font-semibold" style={{ color: INK }}>
                editorial policy
              </Link>.
            </p>
          </Section>

          {/* CONTACT BLOCK */}
          <Section eyebrow="05 — Contact" title="Reach us">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ContactCard icon={Sparkles} label="Editorial queries &amp; corrections"
                           email="contact@ukvisainfo.co.uk"
                           desc="Suggest a correction, propose a topic, or flag a stale figure. Responses within 48 hours (Mon–Fri, UK)." />
              <ContactCard icon={Building2} label="Privacy &amp; data requests"
                           email="privacy@ukvisainfo.co.uk"
                           desc="UK GDPR subject-access requests, data-removal requests, advertising opt-outs." />
            </div>
          </Section>

        </div>
      </div>
    </>
  );
}

/* ──────────────── helpers ──────────────── */

function p() {
  return { color: SLATE, fontSize: '15px', lineHeight: '1.7' } as React.CSSProperties;
}

function Section({ eyebrow, title, children }:
  { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color: GOLD }}>
        {eyebrow}
      </p>
      <h2 className="mb-5"
          style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '1.7rem', letterSpacing: '-0.024em', lineHeight: 1.1, color: INK }}
          dangerouslySetInnerHTML={{ __html: title }} />
      {children}
    </section>
  );
}

function Card({ title, tone, icon: Icon, items }:
  { title: string; tone: 'emerald' | 'amber';
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    items: string[] }) {
  const bg = tone === 'emerald' ? 'rgba(4,120,87,0.06)' : 'rgba(245,158,11,0.08)';
  const border = tone === 'emerald' ? 'rgba(4,120,87,0.20)' : 'rgba(245,158,11,0.28)';
  const text = tone === 'emerald' ? EMERALD : '#92400e';
  return (
    <div className="rounded-2xl p-5"
         style={{ background: bg, border: `1px solid ${border}` }}>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-3 inline-flex items-center gap-1.5"
         style={{ color: text }}>
        <Icon className="w-3 h-3" strokeWidth={2.5} />
        {title}
      </p>
      <ul className="space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13px] leading-[1.55]" style={{ color: INK }}>
            <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: text }} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[14px] leading-[1.65]" style={{ color: SLATE }}>
      <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: EMERALD }} />
      <span className="flex-1">{children}</span>
    </li>
  );
}

function ContactCard({ icon: Icon, label, email, desc }:
  { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    label: string; email: string; desc: string }) {
  return (
    <div className="rounded-2xl p-5"
         style={{ background: PAPER, border: `1px solid ${HAIR}` }}>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(4,120,87,0.10)', color: EMERALD }}>
          <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
        </span>
        <p className="text-[13px] font-semibold"
           style={{ color: INK }}
           dangerouslySetInnerHTML={{ __html: label }} />
      </div>
      <a href={`mailto:${email}`}
         className="text-[14px] font-semibold inline-flex items-center gap-1 mb-2 hover:underline"
         style={{ color: INK }}>
        {email}
      </a>
      <p className="text-[12.5px] leading-[1.55]" style={{ color: SLATE }}>{desc}</p>
    </div>
  );
}
