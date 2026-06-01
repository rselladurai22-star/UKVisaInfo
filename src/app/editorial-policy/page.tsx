import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, RefreshCw, BookOpen, AlertTriangle, Mail, CheckCircle2, ExternalLink } from 'lucide-react';
import { PRIMARY_EDITOR } from '../../data/editorialTeam';

const INK     = '#18181B';
const CREAM   = '#FFFFFF';
const PAPER   = '#FFFFFF';
const EMERALD = '#6366F1';
const GOLD    = '#6366F1';
const SLATE   = '#3F3F46';
const MUTED   = '#6B7280';
const HAIR    = 'rgba(11,15,25,0.08)';

export const metadata: Metadata = {
  title: 'Editorial Policy — How UKDesk Researches & Verifies',
  description:
    'How UKDesk produces and verifies content: source-first sourcing from gov.uk / HMRC / ONS, named editor, update cadence, correction policy, and conflict of interest disclosure.',
  alternates: { canonical: '/editorial-policy' },
  robots: { index: true, follow: true },
};

export default function EditorialPolicyPage() {
  const e = PRIMARY_EDITOR;
  return (
    <div style={{ background: CREAM, minHeight: '100vh' }}>
      <div className="max-w-3xl mx-auto px-5 md:px-8 pt-[120px] pb-20">

        <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] mb-4" style={{ color: GOLD }}>
          Editorial standards
        </p>
        <h1 className="mb-5"
            style={{
              fontFamily: 'var(--font-grotesk), sans-serif', fontWeight: 600,
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              lineHeight: 1.02, letterSpacing: '-0.032em', color: INK,
            }}>
          How UKDesk researches, writes &amp; verifies
        </h1>
        <p className="text-[16.5px] leading-[1.6] mb-12" style={{ color: SLATE }}>
          Last reviewed 19 May 2026. This policy explains exactly how every figure
          and every claim on UKDesk is sourced, checked and updated — so you can
          decide how much to trust us.
        </p>

        {/* WHO WRITES */}
        <Section icon={BookOpen} eyebrow="01" title="Who writes the content">
          <div className="rounded-3xl p-6 flex items-start gap-5 mb-4"
               style={{ background: PAPER, border: `1px solid ${HAIR}` }}>
            <span aria-hidden
                  className="w-14 h-14 rounded-2xl inline-flex items-center justify-center text-[18px] font-bold flex-shrink-0"
                  style={{ background: INK, color: CREAM, fontFamily: 'var(--font-grotesk), sans-serif' }}>
              {e.initials}
            </span>
            <div>
              <p className="text-[15.5px] font-semibold" style={{ color: INK }}>
                {e.name} — {e.role}
              </p>
              <p className="mt-1.5 text-[13.5px] leading-[1.6]" style={{ color: SLATE }}>
                {e.bio}
              </p>
              <Link href="/about#ukdesk-editorial"
                    className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold"
                    style={{ color: EMERALD }}>
                Full profile <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
          <p style={p()}>
            UKDesk does not republish anonymous AI-generated content. Every article
            is written by the named editor above, who is personally accountable
            for accuracy. Corrections can be requested at any time —{' '}
            <a href={`mailto:${e.email}`} className="underline font-semibold" style={{ color: INK }}>
              {e.email}
            </a>.
          </p>
        </Section>

        {/* SOURCES */}
        <Section icon={ShieldCheck} eyebrow="02" title="Where the figures come from">
          <p style={p()}>
            UKDesk content is &ldquo;source-first&rdquo;. Every fee, threshold, processing
            time and rule on this site is traced to a specific official source. We
            only use four classes of source:
          </p>
          <ul className="space-y-3 mt-5">
            <SourceRow href="https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026"
                       label="Home Office visa &amp; nationality fee table" sub="UKDesk's primary source for every visa fee on the site." />
            <SourceRow href="https://www.gov.uk/browse/visas-immigration"
                       label="gov.uk — Visas and Immigration"  sub="Eligibility, document checklists, application steps." />
            <SourceRow href="https://www.gov.uk/government/organisations/hm-revenue-customs"
                       label="HM Revenue &amp; Customs (HMRC)"     sub="PAYE rates, NI thresholds, tax codes, SDLT, CGT, IHT." />
            <SourceRow href="https://www.ons.gov.uk/"
                       label="Office for National Statistics (ONS)" sub="Cost-of-living, salary distribution, regional data." />
          </ul>
          <p className="mt-5" style={p()}>
            Every page on UKDesk shows the gov.uk URL it was verified against,
            either inline next to the figure or in a &ldquo;Source&rdquo; row near the
            bottom of the page. If you spot a figure without a citation, please{' '}
            <a href={`mailto:${e.email}?subject=Missing%20citation`} className="underline font-semibold" style={{ color: INK }}>
              email me
            </a>{' '}
            and I will add one or remove the figure.
          </p>
        </Section>

        {/* VERIFICATION PROCESS */}
        <Section icon={CheckCircle2} eyebrow="03" title="How each article is verified">
          <ol className="space-y-4">
            <Step n={1} title="Read the gov.uk source end-to-end">
              For each visa or rule, the relevant gov.uk pages are read in full —
              not summarised by an AI. Footnotes and appendices count.
            </Step>
            <Step n={2} title="Cross-check every figure against a second page">
              Headline fees are confirmed against both the visa-route page and the
              master fee table. Mismatches between gov.uk pages do happen — the
              master table is treated as authoritative.
            </Step>
            <Step n={3} title="Compare against the previous published version">
              When a fee changes, we capture the old value, the new value, and the
              effective date — and update the article&apos;s &ldquo;Last verified&rdquo; line.
            </Step>
            <Step n={4} title="Write in plain English (not a paraphrase of gov.uk)">
              Articles are rewritten from scratch with the applicant&apos;s decision
              path in mind — what they need to know to decide if a route fits, in
              what order, and what they have to do next.
            </Step>
            <Step n={5} title="Publish with a verification date">
              Every article carries a clearly visible &ldquo;Verified against gov.uk on
              [date]&rdquo; line and links to the cited sources.
            </Step>
          </ol>
        </Section>

        {/* UPDATE CADENCE */}
        <Section icon={RefreshCw} eyebrow="04" title="How often content is updated">
          <ul className="space-y-3">
            <Bullet>
              <strong style={{ color: INK }}>Fee-table changes:</strong> the entire
              site is re-audited within 7 days of each Home Office fee uplift
              (typically every April and October).
            </Bullet>
            <Bullet>
              <strong style={{ color: INK }}>Rule changes:</strong> when the
              Immigration Rules or a Statement of Changes is laid before
              Parliament, affected articles are re-written within 14 days.
            </Bullet>
            <Bullet>
              <strong style={{ color: INK }}>Routine review:</strong> every YMYL
              article is reviewed at minimum every 6 months even if the rules
              have not changed, and the &ldquo;Last verified&rdquo; date is bumped.
            </Bullet>
            <Bullet>
              <strong style={{ color: INK }}>News-driven updates:</strong> if a
              gov.uk announcement materially changes a route (e.g. closure of
              overseas care-worker recruitment in July 2025), the relevant
              article is updated within 48 hours and a news entry is published.
            </Bullet>
          </ul>
        </Section>

        {/* CORRECTIONS */}
        <Section icon={AlertTriangle} eyebrow="05" title="Corrections policy">
          <p style={p()}>
            If you find an error — outdated figure, broken citation, missing
            requirement, anything — please email{' '}
            <a href={`mailto:${e.email}?subject=Correction`} className="underline font-semibold" style={{ color: INK }}>
              {e.email}
            </a>. Corrections are made within 48 hours of receipt for material
            errors (anything that could affect an application decision) and
            within 7 days for minor issues. We do not silently edit — every
            correction updates the &ldquo;Last verified&rdquo; line and is logged.
          </p>
        </Section>

        {/* INDEPENDENCE & FUNDING */}
        <Section icon={Mail} eyebrow="06" title="Independence &amp; how UKDesk is funded">
          <p style={p()}>
            UKDesk is reader-supported through:
          </p>
          <ul className="space-y-3 mt-4">
            <Bullet>
              <strong style={{ color: INK }}>Display advertising</strong> served by
              Google AdSense. Ads do not influence which routes are covered or
              how rules are described. Advertisers cannot pay for editorial
              placement or favourable mentions.
            </Bullet>
            <Bullet>
              <strong style={{ color: INK }}>Affiliate links</strong> to specific
              services applicants commonly need — English-language test bookings,
              international money transfer, document scanning. Affiliate links
              are marked accordingly and the editor only links to services
              personally tried or independently reviewed.
            </Bullet>
          </ul>
          <p className="mt-4" style={p()}>
            UKDesk does not accept paid placements, sponsored articles, or PR
            agency outreach. The full advertising disclosure is in the{' '}
            <Link href="/terms#advertising" className="underline font-semibold" style={{ color: INK }}>
              Terms of Use
            </Link>.
          </p>
        </Section>

        {/* WHAT WE ARE NOT */}
        <Section icon={ShieldCheck} eyebrow="07" title="What UKDesk is not">
          <ul className="space-y-3">
            <Bullet><strong style={{ color: INK }}>Not legal advice.</strong> UKDesk
              is editorial research, not regulated immigration or financial advice.
              For decisions on your own application, consult an SRA-regulated
              solicitor or an OISC-registered adviser.</Bullet>
            <Bullet><strong style={{ color: INK }}>Not the Home Office.</strong> We
              do not process applications, refunds, or appeals. Applications must
              be submitted on gov.uk.</Bullet>
            <Bullet><strong style={{ color: INK }}>Not affiliated with gov.uk.</strong>
              {' '}We are an independent editorial site that cites gov.uk.</Bullet>
          </ul>
        </Section>

        {/* CONTACT */}
        <div className="mt-14 rounded-3xl p-6 flex items-start gap-4"
             style={{ background: PAPER, border: `1px solid ${HAIR}` }}>
          <span className="w-10 h-10 rounded-xl inline-flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(4,120,87,0.10)', color: EMERALD }}>
            <Mail className="w-4 h-4" strokeWidth={2.2} />
          </span>
          <div className="flex-1">
            <p className="text-[15px] font-semibold" style={{ color: INK }}>
              Editorial enquiries &amp; corrections
            </p>
            <p className="mt-1 text-[13px]" style={{ color: SLATE }}>
              <a href={`mailto:${e.email}`} className="underline font-semibold" style={{ color: INK }}>{e.email}</a>
              {' · '}
              <a href="mailto:privacy@ukvisainfo.co.uk" className="underline font-semibold" style={{ color: INK }}>privacy@ukvisainfo.co.uk</a>
              {' · '}
              Responses within 48 hours, Mon–Fri (UK time).
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─────────── helpers ─────────── */

function p() {
  return { color: SLATE, fontSize: '15px', lineHeight: '1.7' } as React.CSSProperties;
}

function Section({ icon: Icon, eyebrow, title, children }:
  { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    eyebrow: string; title: string; children: React.ReactNode }) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return (
    <section id={slug} className="mt-12 scroll-mt-32">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(184,134,11,0.14)', color: GOLD }}>
          <Icon className="w-4 h-4" strokeWidth={2.2} />
        </span>
        <span className="text-[10.5px] font-bold uppercase tracking-[0.22em]"
              style={{ color: MUTED }}>
          {eyebrow}
        </span>
      </div>
      <h2 className="mb-5"
          style={{ fontFamily: 'var(--font-grotesk), sans-serif', fontWeight: 600, fontSize: '1.7rem', letterSpacing: '-0.024em', lineHeight: 1.1, color: INK }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-4">
      <span aria-hidden
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 tabular-nums text-[13px]"
            style={{ background: INK, color: CREAM, fontFamily: 'var(--font-grotesk), sans-serif', fontWeight: 700 }}>
        {n}
      </span>
      <div className="flex-1">
        <p className="text-[14.5px] font-semibold" style={{ color: INK }}>{title}</p>
        <p className="mt-1 text-[13.5px] leading-[1.65]" style={{ color: SLATE }}>{children}</p>
      </div>
    </li>
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

function SourceRow({ href, label, sub }: { href: string; label: string; sub: string }) {
  return (
    <li className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: PAPER, border: `1px solid ${HAIR}` }}>
      <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(4,120,87,0.10)', color: EMERALD }}>
        <ShieldCheck className="w-3.5 h-3.5" />
      </span>
      <div className="flex-1 min-w-0">
        <a href={href} target="_blank" rel="noopener noreferrer"
           className="text-[14px] font-semibold inline-flex items-center gap-1.5 hover:underline"
           style={{ color: INK }}>
          {label}
          <ExternalLink className="w-3 h-3" style={{ color: MUTED }} />
        </a>
        <p className="mt-0.5 text-[12.5px]" style={{ color: SLATE }}>{sub}</p>
      </div>
    </li>
  );
}
