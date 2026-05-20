import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Briefcase, GraduationCap, Plane, Users, Stethoscope, LayoutGrid, Rocket, History,
  ShieldCheck, ArrowRight, ArrowUpRight, Sparkles, Calculator, Search, Scale,
  FileSearch, Compass, Crown, Clock, TrendingUp, Flag,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Every UK Visa Route 2026 — Skilled Worker, Student, Family, Visitor & More',
  description:
    'The complete UK visa hub. Skilled Worker, Student, Family, Visitor, Health & Care, Global Talent, Graduate, Innovator Founder, plus ILR and citizenship — fees, eligibility and processing times verified against gov.uk 8 April 2026.',
  alternates: { canonical: '/visa-types' },
  openGraph: {
    title: 'Every UK Visa Route 2026 — Plain-English Guide',
    description:
      'Skilled Worker, Student, Family, Visitor, Health & Care, Global Talent, Graduate and more. Fees, eligibility and processing times — gov.uk verified.',
    url: 'https://ukvisainfo.co.uk/visa-types',
  },
};

/* ─────────────────────────────────────────────
   BRAND TOKENS
───────────────────────────────────────────── */
const NAVY = '#0A2540';
const TEAL = '#00C4B4';
const GOLD = '#C9A14A';
const ROSE = '#E11D48';
const BLUE = '#2563EB';
const VIOLET = '#7C3AED';
const EMERALD = '#10B981';
const AMBER = '#F59E0B';

/* ─────────────────────────────────────────────
   DATA — 8 primary routes + 6 secondary
───────────────────────────────────────────── */

interface VisaCard {
  slug: string;
  title: string;
  blurb: string;
  meta: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}

const PRIMARY: VisaCard[] = [
  { slug: 'skilled-worker',    title: 'Skilled Worker',    blurb: 'Sponsored UK employment, 5 yrs to ILR.',     meta: 'from £41,700 salary', icon: Briefcase,    accent: TEAL    },
  { slug: 'student',           title: 'Student',           blurb: 'Degree-level study at a licensed sponsor.',  meta: 'fee £558',            icon: GraduationCap,accent: BLUE    },
  { slug: 'visitor',           title: 'Standard Visitor',  blurb: 'Tourism or business — up to 6 months.',      meta: 'fee £135',            icon: Plane,        accent: GOLD    },
  { slug: 'family',            title: 'Family / Spouse',   blurb: 'Join a settled UK partner.',                 meta: '£29,000 income req.', icon: Users,        accent: ROSE    },
  { slug: 'health',            title: 'Health & Care',     blurb: 'NHS, social care, eligible care roles.',     meta: 'IHS waived',          icon: Stethoscope,  accent: EMERALD },
  { slug: 'talent',            title: 'Global Talent',     blurb: 'Endorsed leaders in arts, science, tech.',   meta: 'no sponsor needed',   icon: LayoutGrid,   accent: VIOLET  },
  { slug: 'innovator-founder', title: 'Innovator Founder', blurb: 'Endorsed founders building UK businesses.',  meta: 'fee £1,357',          icon: Rocket,       accent: AMBER   },
  { slug: 'graduate',          title: 'Graduate',          blurb: 'Stay 2 years after a UK degree.',            meta: 'no sponsor needed',   icon: History,      accent: NAVY    },
];

const SECONDARY: VisaCard[] = [
  { slug: 'ilr',            title: 'ILR',               blurb: 'Indefinite Leave to Remain — settlement.', meta: 'fee £3,226',  icon: ShieldCheck, accent: GOLD    },
  { slug: 'citizenship',    title: 'British Citizenship', blurb: 'Naturalisation after ILR + 12 months.',  meta: 'fee £1,839',  icon: Crown,       accent: ROSE    },
  { slug: 'euss',           title: 'EU Settlement',     blurb: 'EU/EEA citizens with pre-Brexit residence.', meta: 'free',         icon: Flag,        accent: BLUE    },
  { slug: 'bno',            title: 'Hong Kong BN(O)',   blurb: 'BN(O) status holders and dependants.',     meta: '5 yrs to ILR',  icon: Flag,        accent: VIOLET  },
  { slug: 'long-residence', title: '10-Year Long Residence', blurb: 'ILR after 10 continuous lawful yrs.', meta: 'fee £3,029',   icon: Clock,       accent: NAVY    },
  { slug: 'ancestry',       title: 'UK Ancestry',       blurb: 'Commonwealth + UK-born grandparent.',      meta: '5 yrs to ILR',  icon: History,     accent: EMERALD },
];

const STATS = [
  { v: '14',       label: 'Visa routes covered' },
  { v: '270',      label: 'SOC codes with going rates' },
  { v: '126,530',  label: 'Licensed UK sponsors' },
  { v: '100%',     label: 'gov.uk verified' },
];

interface Tool { href: string; title: string; desc: string; icon: React.ComponentType<{ className?: string }>; accent: string }

const TOOLS: Tool[] = [
  { href: '/eligibility',            title: 'Eligibility quiz',     desc: 'Find your route in 60 seconds.',         icon: Compass,    accent: TEAL    },
  { href: '/tools/cost-calculator',  title: 'Visa cost calculator', desc: 'Fees + IHS + dependants, total bill.',   icon: Calculator, accent: GOLD    },
  { href: '/tools/salary-checker',   title: 'SOC salary checker',   desc: 'All 270 occupations + going rates.',     icon: TrendingUp, accent: BLUE    },
  { href: '/tools/sponsor-search',   title: 'Sponsor search',       desc: '126,530 licensed UK employers.',         icon: Search,     accent: NAVY    },
  { href: '/tools/compare',          title: 'Visa comparison',      desc: 'Side-by-side route comparison.',         icon: Scale,      accent: EMERALD },
  { href: '/tools/refusal-analyzer', title: 'Refusal analyzer',     desc: 'Decode your refusal letter.',            icon: FileSearch, accent: ROSE    },
];

const COUNTRIES: { code: string; flag: string; name: string }[] = [
  { code: 'india',       flag: '🇮🇳', name: 'India' },
  { code: 'nigeria',     flag: '🇳🇬', name: 'Nigeria' },
  { code: 'pakistan',    flag: '🇵🇰', name: 'Pakistan' },
  { code: 'philippines', flag: '🇵🇭', name: 'Philippines' },
  { code: 'bangladesh',  flag: '🇧🇩', name: 'Bangladesh' },
  { code: 'china',       flag: '🇨🇳', name: 'China' },
  { code: 'usa',         flag: '🇺🇸', name: 'USA' },
];

const GUIDES = [
  { href: '/blog/uk-skilled-worker-visa-salary-threshold-2026',    title: 'Skilled Worker salary thresholds 2026', read: '8 min', tag: 'Skilled Worker', accent: TEAL  },
  { href: '/blog/uk-family-visa-minimum-income-2026-what-counts',  title: 'Family visa £29,000 — what counts',     read: '7 min', tag: 'Family',          accent: ROSE  },
  { href: '/blog/uk-evisa-final-deadline-2026-how-to-migrate',     title: 'eVisa migration — beat the deadline',   read: '6 min', tag: 'eVisa',           accent: GOLD  },
];

/* ─────────────────────────────────────────────
   PAGE — server component
───────────────────────────────────────────── */

export default function VisaTypesPage() {
  return (
    <div className="bg-white">

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative pt-[100px] md:pt-[130px] pb-12 md:pb-16 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[480px] pointer-events-none -z-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(10,37,64,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,37,64,0.05) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 85%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-center">

            {/* Left */}
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-[#f3f4f5] text-[#45464d] mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>
                <ShieldCheck className="w-3 h-3" />
                UK visas · 2026 · gov.uk verified
              </span>

              <h1
                className="font-bold text-[#0A2540] tracking-[-0.025em]"
                style={{
                  fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                  fontSize: 'clamp(2.25rem, 6vw, 3.75rem)',
                  lineHeight: '1.05',
                  textWrap: 'balance' as React.CSSProperties['textWrap'],
                }}
              >
                Every UK visa route, <span style={{ color: TEAL }}>sorted.</span>
              </h1>

              <p
                className="mt-5 text-[16px] md:text-[18px] text-[#45464d] leading-[1.55] max-w-2xl"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Plain-English guides to all 14 UK visa routes — Skilled Worker, Student, Family, Visitor, Health & Care, Global Talent, Graduate, plus ILR and citizenship. Every fee, threshold and date verified against the 8 April 2026 gov.uk fee table.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/eligibility"
                  className="inline-flex items-center gap-2 bg-[#0A2540] hover:bg-[#13325F] text-white text-[14px] font-semibold px-5 py-3 rounded-lg active:scale-[0.98] transition-all duration-100"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Sparkles className="w-4 h-4" />
                  Start eligibility quiz
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/tools/cost-calculator"
                  className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#0A2540] border border-[#E5E7EB] hover:border-[#0A2540] px-5 py-3 rounded-lg transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Calculator className="w-4 h-4" />
                  Visa cost calculator
                </Link>
              </div>
            </div>

            {/* Right — passport-style decorative card */}
            <div className="hidden lg:flex justify-end">
              <div
                className="relative w-full max-w-[360px] aspect-[5/7] rounded-3xl p-7 text-white overflow-hidden"
                style={{ background: 'linear-gradient(155deg, #0A2540 0%, #06192E 60%, #13325F 100%)' }}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.10] pointer-events-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />
                <div className="relative">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    United Kingdom of Great Britain
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Visa & Immigration · 2026
                  </div>

                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(145deg, rgba(0,196,180,0.18), rgba(201,161,74,0.18))', border: '1px solid rgba(255,255,255,0.18)' }}>
                    <Crown className="w-8 h-8 text-[#C9A14A]" />
                  </div>

                  <div className="mt-6 space-y-2 text-[11px] font-mono text-white/75 tabular-nums">
                    <Row label="Routes covered"   value="14"      />
                    <Row label="Sub-variants"     value="30+"     />
                    <Row label="SOC occupations"  value="270"     />
                    <Row label="Sponsors listed"  value="126,530" />
                  </div>

                  <div className="mt-8 pt-5 border-t border-white/15">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5EEAD9]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      UKDesk · Visa hub
                    </div>
                    <div className="text-[14.5px] mt-1 leading-snug font-bold" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                      Independent · gov.uk sourced · free
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS STRIP
      ════════════════════════════════════════ */}
      <section className="border-y border-[#E5E7EB] bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-7 md:py-9">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="font-bold text-[#0A2540] tabular-nums tracking-[-0.015em]"
                  style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.1rem)' }}
                >
                  {s.v}
                </div>
                <div className="mt-1 text-[12px] text-[#76777e]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PRIMARY VISA GRID
      ════════════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <Eyebrow>Main routes</Eyebrow>
          <SectionTitle>Eight routes cover ~95% of UK applicants.</SectionTitle>
          <p className="mt-3 text-[15px] md:text-[16px] text-[#45464d] leading-[1.55] max-w-2xl mb-8 md:mb-10" style={{ fontFamily: 'Inter, sans-serif' }}>
            Pick a route to see fees, eligibility, the application steps, and the gov.uk reference links.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {PRIMARY.map((v) => <VisaTile key={v.slug} v={v} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECONDARY VISA GRID — ILR / Citizenship / etc.
      ════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-[#fafbfc] border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <Eyebrow>Settlement &amp; further routes</Eyebrow>
          <SectionTitle>From ILR to British citizenship.</SectionTitle>
          <p className="mt-3 text-[15px] md:text-[16px] text-[#45464d] leading-[1.55] max-w-2xl mb-8 md:mb-10" style={{ fontFamily: 'Inter, sans-serif' }}>
            After your main route, here are the long-stay and settlement options. Each links to a full guide with current fees and the path to citizenship.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {SECONDARY.map((v) => <VisaTile key={v.slug} v={v} />)}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/settlement"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#0A2540] hover:underline"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Side-by-side settlement comparison
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FREE TOOLS
      ════════════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <Eyebrow>Free tools</Eyebrow>
          <SectionTitle>Pick the route — then run the numbers.</SectionTitle>

          <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {TOOLS.map((t) => <ToolCard key={t.href} t={t} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BY COUNTRY
      ════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-[#fafbfc] border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <Eyebrow>By country</Eyebrow>
          <SectionTitle>Applying from your country.</SectionTitle>
          <p className="mt-3 text-[15px] md:text-[16px] text-[#45464d] leading-[1.55] max-w-2xl mb-8 md:mb-10" style={{ fontFamily: 'Inter, sans-serif' }}>
            Country-specific notes: TB tests, application centres, common pitfalls and trusted communities.
          </p>

          <div className="flex flex-wrap gap-2.5">
            {COUNTRIES.map((c) => (
              <Link
                key={c.code}
                href={`/from/${c.code}`}
                className="group inline-flex items-center gap-2 bg-white border border-[#E5E7EB] hover:border-[#0A2540] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-6px_rgba(16,26,54,0.10)] rounded-full pl-2.5 pr-4 py-1.5 transition-all duration-150"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <span className="text-[18px] leading-none">{c.flag}</span>
                <span className="text-[13.5px] font-semibold text-[#0A2540]">{c.name}</span>
                <ArrowRight className="w-3 h-3 text-[#76777e] group-hover:text-[#0A2540] group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
            <Link
              href="/from"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0A2540] hover:underline px-3 py-1.5"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              All country guides
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURED GUIDES
      ════════════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8 md:mb-10">
            <div>
              <Eyebrow>From the desk</Eyebrow>
              <SectionTitle>In-depth visa guides.</SectionTitle>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#0A2540] hover:underline"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              All articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {GUIDES.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="group block bg-white border border-[#E5E7EB] rounded-xl p-6 hover:border-[#0A2540] hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-8px_rgba(16,26,54,0.15)] transition-all duration-150"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-[10.5px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-md"
                    style={{ background: `${g.accent}14`, color: g.accent, fontFamily: 'Inter, sans-serif' }}
                  >
                    {g.tag}
                  </span>
                  <span className="text-[11px] text-[#76777e]" style={{ fontFamily: 'Inter, sans-serif' }}>{g.read}</span>
                </div>
                <h3
                  className="font-bold text-[#0A2540] text-[16px] md:text-[17px] leading-[1.3] tracking-[-0.005em]"
                  style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
                >
                  {g.title}
                </h3>
                <span className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#0A2540] group-hover:gap-2 transition-[gap] duration-100" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Read article <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════ */}
      <section className="py-16 md:py-20 border-t border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl p-8 md:p-12 text-white" style={{ background: 'linear-gradient(135deg, #0A2540 0%, #13325F 100%)' }}>
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.10] pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
              }}
            />
            <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5EEAD9] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <Sparkles className="inline w-3 h-3 mr-1 -mt-0.5" /> 60-second quiz
                </p>
                <h2
                  className="font-bold tracking-[-0.015em] leading-[1.15]"
                  style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(1.5rem, 3.2vw, 2.1rem)' }}
                >
                  Not sure which visa? Take the eligibility quiz.
                </h2>
                <p className="mt-2 text-[14.5px] md:text-[15px] text-[#bcc5e9] leading-[1.55] max-w-xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Answer a handful of questions about your situation. We{`'`}ll match you to the most likely UK route and link the gov.uk reference.
                </p>
              </div>
              <Link
                href="/eligibility"
                className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-[#0A2540] bg-[#5EEAD9] hover:bg-[#7BEFE0] px-5 py-3 rounded-lg active:scale-[0.98] transition-all duration-100 flex-shrink-0"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Start the quiz
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#76777e] mb-2"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-bold text-[#0A2540] tracking-[-0.015em]"
      style={{
        fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
        fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
        lineHeight: '1.15',
      }}
    >
      {children}
    </h2>
  );
}

function VisaTile({ v }: { v: VisaCard }) {
  const Icon = v.icon;
  return (
    <Link
      href={`/visa/${v.slug}`}
      className="group relative bg-white border border-[#E5E7EB] rounded-xl p-5 md:p-6 hover:border-[#0A2540] hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-8px_rgba(16,26,54,0.15)] transition-all duration-150 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="inline-flex w-11 h-11 rounded-xl items-center justify-center"
          style={{ background: `${v.accent}14`, color: v.accent }}
        >
          <Icon className="w-5 h-5" />
        </span>
        <span
          className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.06em] px-2 py-0.5 rounded-md tabular-nums"
          style={{ background: `${v.accent}10`, color: v.accent, fontFamily: 'Inter, sans-serif' }}
        >
          {v.meta}
        </span>
      </div>
      <div>
        <h3
          className="font-bold text-[#0A2540] text-[15.5px] md:text-[16px] tracking-[-0.005em]"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
        >
          {v.title}
        </h3>
        <p className="mt-1 text-[12.5px] text-[#45464d] leading-[1.5]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {v.blurb}
        </p>
      </div>
      <span
        className="mt-1 inline-flex items-center gap-1 text-[12.5px] font-semibold group-hover:gap-2 transition-[gap] duration-100"
        style={{ color: v.accent, fontFamily: 'Inter, sans-serif' }}
      >
        View route <ArrowRight className="w-3.5 h-3.5" />
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-xl"
        style={{ background: v.accent }}
      />
    </Link>
  );
}

function ToolCard({ t }: { t: Tool }) {
  const Icon = t.icon;
  return (
    <Link
      href={t.href}
      className="group block bg-white border border-[#E5E7EB] rounded-xl p-5 md:p-6 hover:border-[#0A2540] hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-8px_rgba(16,26,54,0.15)] transition-all duration-150"
    >
      <span
        className="inline-flex w-11 h-11 rounded-xl items-center justify-center mb-3.5"
        style={{ background: `${t.accent}14`, color: t.accent }}
      >
        <Icon className="w-5 h-5" />
      </span>
      <h3
        className="font-bold text-[#0A2540] text-[15px] tracking-[-0.005em]"
        style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
      >
        {t.title}
      </h3>
      <p className="mt-1 text-[12.5px] text-[#45464d] leading-snug" style={{ fontFamily: 'Inter, sans-serif' }}>
        {t.desc}
      </p>
      <span
        className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#0A2540] group-hover:gap-2 transition-[gap] duration-100"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        Open <ArrowRight className="w-3 h-3" />
      </span>
    </Link>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-white/55">{label}</span>
      <span className="text-white font-bold tabular-nums">{value}</span>
    </div>
  );
}

