/**
 * VisaHub v3 — mobile-first editorial directory of every UK visa /
 * settlement / citizenship route. Server component, driven by VISA_DETAILS.
 *
 * Layout: hero → three entry cards → sticky scrollable category nav →
 * grouped full-width route rows (1-col phone, 2-col desktop).
 */
import Link from 'next/link';
import {
  ArrowRight, ArrowUpRight, Sparkles, RefreshCw, Scale,
  Briefcase, GraduationCap, Users, Plane, ShieldCheck,
  Clock, Banknote,
} from 'lucide-react';
import { VISA_DETAILS, type VisaDetail } from '../data/visaDetails';
import EditorByline from './EditorByline';
import s from './visa/visaHub.module.css';

type GroupId = 'work' | 'study' | 'family' | 'visit' | 'settlement';

const GROUPS: { id: GroupId; label: string; blurb: string; Icon: typeof Briefcase }[] = [
  { id: 'work',       label: 'Work & business',          blurb: 'Work for a UK employer or build a business here.', Icon: Briefcase },
  { id: 'study',      label: 'Study',                    blurb: 'Courses, child study and post-study work.',        Icon: GraduationCap },
  { id: 'family',     label: 'Family & partner',         blurb: 'Join or stay with family in the UK.',              Icon: Users },
  { id: 'visit',      label: 'Visit',                    blurb: 'Short stays — tourism, business or family.',       Icon: Plane },
  { id: 'settlement', label: 'Settlement & citizenship', blurb: 'Indefinite leave to remain and becoming British.', Icon: ShieldCheck },
];

const SETTLEMENT = new Set(['ilr', 'citizenship', 'euss', 'bno', 'long-residence']);

function groupOf(slug: string, v: VisaDetail): GroupId {
  if (SETTLEMENT.has(slug)) return 'settlement';
  if (v.category === 'Study') return 'study';
  if (v.category === 'Family') return 'family';
  if (v.category === 'Visit') return 'visit';
  return 'work';
}

const shortFee = (fee: string) => fee.match(/£[\d,]+/)?.[0] ?? null;

const WAYS = [
  { href: '/eligibility', Icon: Sparkles, title: 'Not sure which visa?', desc: 'Answer 6 questions — matched in 60 seconds.', primary: true },
  { href: '/visa-types/visa-switching', Icon: RefreshCw, title: 'Already in the UK?', desc: 'Routes you can switch into without leaving.' },
  { href: '/visa-types/compare', Icon: Scale, title: 'Torn between two?', desc: 'Compare cost, time and settlement side by side.' },
];

export default function VisaHub() {
  const entries = Object.entries(VISA_DETAILS);
  const total = entries.length;

  return (
    <div className="bg-surface min-h-screen">
      <div className="container-page">
        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 pt-5 text-xs font-medium text-on-surface-variant">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="opacity-50">›</span>
          <span className="text-primary font-semibold">Visas</span>
        </nav>

        {/* hero */}
        <header className={s.hero}>
          <span className={s.eyebrow}>
            <ShieldCheck size={13} /> UK visa hub · GOV.UK sourced
          </span>
          <h1 className={s.title}>Every UK visa route, explained.</h1>
          <p className={s.deck}>
            Work, study, family, visiting, settlement and citizenship — {total} routes, each with
            the cost, timeline and requirements in plain English.
          </p>
          <span className={s.trust}>
            <ShieldCheck size={15} /> Verified against GOV.UK · Updated 2026
          </span>

          {/* entry points */}
          <div className={s.ways}>
            {WAYS.map((w) => {
              const Icon = w.Icon;
              return (
                <Link key={w.href} href={w.href} className={`${s.way} ${w.primary ? s.wayPrimary : ''}`}>
                  <span className={s.wayIcon}><Icon size={19} /></span>
                  <span className="min-w-0">
                    <b>{w.title}</b>
                    <span>{w.desc}</span>
                  </span>
                  <ArrowRight size={17} className={s.wayArrow} />
                </Link>
              );
            })}
          </div>
        </header>
      </div>

      {/* sticky category nav — swipes horizontally on phones */}
      <div className="container-page">
        <nav aria-label="Visa categories" className={s.catNav}>
          {GROUPS.map((g) => {
            const n = entries.filter(([slug, v]) => groupOf(slug, v) === g.id).length;
            if (!n) return null;
            const Icon = g.Icon;
            return (
              <a key={g.id} href={`#${g.id}`} className={s.catLink}>
                <Icon size={14} />
                {g.label}
                <span className={s.catCount}>{n}</span>
              </a>
            );
          })}
        </nav>

        {/* grouped route rows */}
        {GROUPS.map((g) => {
          const routes = entries.filter(([slug, v]) => groupOf(slug, v) === g.id);
          if (!routes.length) return null;
          const Icon = g.Icon;
          return (
            <section key={g.id} id={g.id} className={s.group}>
              <div className={s.groupHead}>
                <span className={s.groupIcon}><Icon size={20} /></span>
                <h2>{g.label}</h2>
              </div>
              <p className={s.groupBlurb}>{g.blurb}</p>

              <div className={s.routes}>
                {routes.map(([slug, v]) => {
                  const fee = shortFee(v.fee);
                  return (
                    <Link key={slug} href={`/visa-types/${slug}`} className={s.route}>
                      <span className={s.routeTop}>
                        <h3>{v.title}</h3>
                        <ArrowUpRight size={16} className={s.routeArrow} />
                      </span>
                      <p>{v.tagline}</p>
                      <span className={s.chips}>
                        {fee && (
                          <span className={`${s.chip} ${s.chipFee}`}>
                            <Banknote size={12} /> From {fee}
                          </span>
                        )}
                        {v.processing?.outside && (
                          <span className={s.chip}>
                            <Clock size={12} /> {v.processing.outside} decision
                          </span>
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div className={s.byline}>
          <EditorByline verified="May 2026" prefix="Edited & verified by" />
        </div>
      </div>
    </div>
  );
}
