import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Mail, ShieldCheck, Clock, AlertTriangle, BookOpen, ExternalLink,
  Sparkles, MessageCircle, FileText,
} from 'lucide-react';
import { PRIMARY_EDITOR } from '../../data/editorialTeam';

const INK     = '#18181B';
const CREAM   = '#FFFFFF';
const PAPER   = '#FFFFFF';
const EMERALD = '#6366F1';
const GOLD    = '#6366F1';
const SLATE   = '#3F3F46';
const MUTED   = '#6B7280';
const HAIR    = 'rgba(11,15,25,0.08)';

const SITE = 'https://ukvisainfo.co.uk';

export const metadata: Metadata = {
  title: 'Contact — UKDesk Editorial &amp; Privacy',
  description:
    'How to reach UKDesk: editorial corrections, privacy &amp; data requests, advertising opt-outs. Response within 48 hours, Monday to Friday (UK time).',
  alternates: { canonical: '/contact' },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: `${SITE}/contact`,
    name: 'Contact UKDesk',
    description: 'Editorial and privacy contact details for ukvisainfo.co.uk.',
    publisher: { '@type': 'Organization', '@id': `${SITE}#org`, name: 'UKDesk', url: SITE },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />

      <div style={{ background: CREAM, minHeight: '100vh' }}>
        <div className="max-w-3xl mx-auto px-5 md:px-8 pt-[120px] pb-20">

          {/* HERO */}
          <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] mb-4" style={{ color: GOLD }}>
            Contact
          </p>
          <h1 className="mb-5"
              style={{
                fontFamily: 'var(--font-grotesk), sans-serif', fontWeight: 600,
                fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
                lineHeight: 1.02, letterSpacing: '-0.032em', color: INK,
              }}>
            Reach UKDesk
          </h1>
          <p className="text-[16.5px] leading-[1.6] mb-12" style={{ color: SLATE }}>
            UKDesk is a small, named editorial operation. There is no support
            ticketing system, no chatbot, and no overseas call centre — emails
            go straight to the editor. Responses within 48 hours, Monday to
            Friday (UK time).
          </p>

          {/* PRIMARY CONTACTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <ContactCard
              icon={MessageCircle}
              tone="emerald"
              label="Editorial &amp; corrections"
              email="contact@ukvisainfo.co.uk"
              examples={[
                'Spotted a stale figure or broken citation',
                'Want to propose a topic or guide',
                'Pitch a question for the FAQ block',
                'Press / publishing enquiry',
              ]}
            />
            <ContactCard
              icon={ShieldCheck}
              tone="gold"
              label="Privacy &amp; data requests"
              email="privacy@ukvisainfo.co.uk"
              examples={[
                'UK GDPR subject-access request',
                'Data-removal request',
                'Advertising / cookie opt-out',
                'Cookie / CMP technical issue',
              ]}
            />
          </div>

          {/* WHO YOU WILL HEAR FROM */}
          <Section eyebrow="01 — Who responds" title="Who you’ll hear from">
            <div className="rounded-3xl p-6 flex items-start gap-5"
                 style={{ background: PAPER, border: `1px solid ${HAIR}` }}>
              <span aria-hidden
                    className="w-14 h-14 rounded-2xl inline-flex items-center justify-center text-[18px] font-bold flex-shrink-0"
                    style={{ background: INK, color: CREAM, fontFamily: 'var(--font-grotesk), sans-serif' }}>
                {PRIMARY_EDITOR.initials}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-semibold" style={{ color: INK, fontFamily: 'var(--font-grotesk), sans-serif' }}>
                  {PRIMARY_EDITOR.name}
                </p>
                <p className="text-[12.5px] font-semibold mt-0.5" style={{ color: EMERALD }}>
                  {PRIMARY_EDITOR.role}
                </p>
                <p className="mt-2 text-[13.5px] leading-[1.6]" style={{ color: SLATE }}>
                  {PRIMARY_EDITOR.scope}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-[12px]">
                  <Link href={PRIMARY_EDITOR.profileUrl}
                        className="inline-flex items-center gap-1 font-semibold"
                        style={{ color: INK }}>
                    Full editor profile <ExternalLink className="w-3 h-3" />
                  </Link>
                  <span style={{ color: MUTED }}>·</span>
                  <Link href="/editorial-policy"
                        className="inline-flex items-center gap-1 font-semibold"
                        style={{ color: INK }}>
                    Editorial policy <BookOpen className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </Section>

          {/* RESPONSE TIMES */}
          <Section eyebrow="02 — Turnaround" title="How long we take">
            <div className="rounded-3xl overflow-hidden"
                 style={{ background: PAPER, border: `1px solid ${HAIR}` }}>
              <Row icon={Clock} label="Material editorial errors (wrong fee, broken rule, missed gov.uk change)"
                   value="≤ 48 hours" emphasis />
              <Row icon={Mail} label="General corrections, typo reports, citation requests"
                   value="≤ 7 days" />
              <Row icon={ShieldCheck} label="Privacy &amp; data-access requests (UK GDPR statutory deadline)"
                   value="≤ 30 days" />
              <Row icon={FileText} label="Press, publishing or partnership enquiries"
                   value="≤ 14 days" last />
            </div>
          </Section>

          {/* WHAT WE CAN'T HELP WITH */}
          <Section eyebrow="03 — Boundaries" title="What we can’t help with">
            <div className="rounded-2xl p-5 flex items-start gap-3 mb-4"
                 style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.28)' }}>
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#92400e' }} />
              <p className="text-[13px] leading-[1.6]" style={{ color: '#5C3D10' }}>
                UKDesk is editorial research, not a regulated immigration adviser.
                We can&apos;t review your application, advise on your case, or
                represent you with the Home Office. For those, you need an{' '}
                <a href="https://www.gov.uk/government/organisations/immigration-services-commissioner"
                   target="_blank" rel="noopener noreferrer"
                   className="underline font-semibold" style={{ color: '#5C3D10' }}>
                  OISC-registered adviser
                </a>{' '}
                or an SRA-regulated immigration solicitor.
              </p>
            </div>
            <ul className="space-y-2.5">
              <Bullet>Reviewing or scoring an individual visa application before submission.</Bullet>
              <Bullet>Telling you whether you specifically will be granted a visa.</Bullet>
              <Bullet>Submitting an application or appeal on your behalf.</Bullet>
              <Bullet>Acting as a sponsor, referee, or character witness.</Bullet>
              <Bullet>Recommending one solicitor over another &mdash; we don&apos;t hold a panel.</Bullet>
            </ul>
          </Section>

          {/* MAILING / LEGAL ADDRESS */}
          <Section eyebrow="04 — Postal contact" title="Where we’re based">
            <p style={{ color: SLATE, fontSize: '14px', lineHeight: '1.7' }}>
              UKDesk operates from the United Kingdom. Editorial correspondence
              should be sent by email &mdash; postal mail is not routinely
              monitored. For statutory or legal service of documents that
              require a postal address, please first request one by email to{' '}
              <a href="mailto:privacy@ukvisainfo.co.uk" className="underline font-semibold" style={{ color: INK }}>
                privacy@ukvisainfo.co.uk
              </a>.
            </p>
          </Section>

          {/* RESOURCES */}
          <Section eyebrow="05 — Before you write" title="Quick links that often answer the question">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Quick href="/editorial-policy" icon={BookOpen}
                     title="Editorial policy"
                     desc="How we research, verify, update and correct content." />
              <Quick href="/sources" icon={ShieldCheck}
                     title="Sources cited"
                     desc="Every gov.uk / HMRC / ONS page UKDesk relies on." />
              <Quick href="/about" icon={Sparkles}
                     title="About &amp; editor profile"
                     desc="Who runs UKDesk, our scope and editorial independence." />
              <Quick href="/terms#disclaimer" icon={AlertTriangle}
                     title="Full legal disclaimer"
                     desc="Why nothing on UKDesk is legal advice and what that means for you." />
            </div>
          </Section>

        </div>
      </div>
    </>
  );
}

/* ──────────────── helpers ──────────────── */

function Section({ eyebrow, title, children }:
  { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color: GOLD }}>
        {eyebrow}
      </p>
      <h2 className="mb-5"
          style={{ fontFamily: 'var(--font-grotesk), sans-serif', fontWeight: 600, fontSize: '1.7rem', letterSpacing: '-0.024em', lineHeight: 1.1, color: INK }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function ContactCard({ icon: Icon, tone, label, email, examples }:
  { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    tone: 'emerald' | 'gold';
    label: string;
    email: string;
    examples: string[] }) {
  const color = tone === 'emerald' ? EMERALD : '#92400e';
  const bg = tone === 'emerald' ? 'rgba(4,120,87,0.08)' : 'rgba(184,134,11,0.12)';
  return (
    <div className="rounded-3xl p-6"
         style={{ background: PAPER, border: `1px solid ${HAIR}` }}>
      <div className="flex items-center gap-3 mb-4">
        <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: bg, color }}>
          <Icon className="w-4 h-4" strokeWidth={2.2} />
        </span>
        <p className="text-[14px] font-semibold flex-1"
           style={{ color: INK }}
           dangerouslySetInnerHTML={{ __html: label }} />
      </div>
      <a href={`mailto:${email}`}
         className="text-[16px] font-semibold inline-flex items-center gap-1.5 mb-4 hover:underline"
         style={{ color: INK }}>
        {email}
      </a>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-2"
         style={{ color: MUTED }}>
        Use this for
      </p>
      <ul className="space-y-1.5">
        {examples.map((e, i) => (
          <li key={i} className="flex items-start gap-2 text-[12.5px] leading-[1.55]" style={{ color: SLATE }}>
            <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: color }} />
            <span>{e}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Row({ icon: Icon, label, value, emphasis, last }:
  { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    label: string; value: string; emphasis?: boolean; last?: boolean }) {
  return (
    <div className="flex items-start gap-4 px-6 py-4"
         style={{ borderBottom: last ? 'none' : `1px solid ${HAIR}` }}>
      <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(4,120,87,0.08)', color: EMERALD }}>
        <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
      </span>
      <div className="flex-1 text-[13.5px] leading-[1.55]"
           style={{ color: INK }}
           dangerouslySetInnerHTML={{ __html: label }} />
      <span className="text-[12.5px] tabular-nums flex-shrink-0 ml-2"
            style={{
              fontFamily: 'var(--font-grotesk), sans-serif', fontWeight: 600,
              color: emphasis ? EMERALD : INK,
              letterSpacing: '-0.01em',
            }}
            dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[13.5px] leading-[1.65]" style={{ color: SLATE }}>
      <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: MUTED }} />
      <span className="flex-1">{children}</span>
    </li>
  );
}

function Quick({ href, icon: Icon, title, desc }:
  { href: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    title: string; desc: string }) {
  return (
    <Link href={href}
          className="group rounded-2xl p-4 flex items-start gap-3"
          style={{ background: PAPER, border: `1px solid ${HAIR}` }}>
      <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(4,120,87,0.08)', color: EMERALD }}>
        <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold mb-1"
           style={{ color: INK }}
           dangerouslySetInnerHTML={{ __html: title }} />
        <p className="text-[12.5px] leading-[1.55]" style={{ color: SLATE }}>{desc}</p>
      </div>
      <ExternalLink className="w-3.5 h-3.5 mt-1 flex-shrink-0 transition-transform group-hover:translate-x-0.5"
                    style={{ color: MUTED }} />
    </Link>
  );
}
