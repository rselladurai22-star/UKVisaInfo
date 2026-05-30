/**
 * VisaHub — clean, skimmable index of every UK visa / settlement / citizenship
 * route. Server component, driven by VISA_DETAILS. Vivid styling.
 */
import type { CSSProperties } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ArrowUpRight, Sparkles, RefreshCw, Scale,
  Briefcase, GraduationCap, Users, Plane, ShieldCheck,
} from 'lucide-react';
import { VISA_DETAILS, type VisaDetail } from '../data/visaDetails';
import EditorByline from './EditorByline';
import s from './calc/calc.module.css';

type GroupId = 'work' | 'study' | 'family' | 'visit' | 'settlement';

const GROUPS: { id: GroupId; label: string; blurb: string; c: number; Icon: typeof Briefcase }[] = [
  { id: 'work',       label: 'Work & business',          blurb: 'Work for a UK employer or build a business here.', c: 1, Icon: Briefcase },
  { id: 'study',      label: 'Study',                    blurb: 'Courses, child study and post-study work.',        c: 4, Icon: GraduationCap },
  { id: 'family',     label: 'Family & partner',         blurb: 'Join or stay with family in the UK.',              c: 7, Icon: Users },
  { id: 'visit',      label: 'Visit',                    blurb: 'Short stays — tourism, business or family.',        c: 3, Icon: Plane },
  { id: 'settlement', label: 'Settlement & citizenship', blurb: 'Indefinite leave to remain and becoming British.',  c: 5, Icon: ShieldCheck },
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
const cVar = (c: number): CSSProperties => ({ ['--tctx']: `var(--uk-c${c}-tx)` } as CSSProperties);

const WAYS = [
  { href: '/eligibility',   Icon: Sparkles, title: 'Not sure which visa?', desc: 'Answer 6 questions — get matched in 60 seconds.', cta: 'Take the quiz', grad: true },
  { href: '/visa-switching', Icon: RefreshCw, title: 'Already in the UK?', desc: 'See which routes you can switch into without leaving.', cta: 'Switching guide' },
  { href: '/tools/compare',  Icon: Scale, title: 'Torn between two?', desc: 'Compare any two routes on cost, time and settlement.', cta: 'Compare routes' },
];

export default function VisaHub() {
  const entries = Object.entries(VISA_DETAILS);
  const total = entries.length;

  return (
    <div className={s.page}>
      <div className={s.wrap}>
        <div className={s.crumb}><Link href="/">Home</Link><span className={s.sep}>›</span><span>Visas</span></div>

        <div className={s.toolHead} style={{ maxWidth: 760 }}>
          <span className={s.tag}>UK visa hub</span>
          <h1 className={s.h1}>Every UK visa route, explained</h1>
          <p className={s.intro}>
            Work, study, family, visiting, settlement and citizenship — {total} routes, each with the cost,
            timeline and requirements in plain English. Verified against GOV.UK.
          </p>
          <span className={s.trust}><ShieldCheck size={15} /> Sourced from GOV.UK · Updated 2026</span>
        </div>

        {/* ways in */}
        <div className={s.relGrid} style={{ paddingBottom: 8 }}>
          {WAYS.map((w) => {
            const Icon = w.Icon;
            const grad = w.grad;
            return (
              <Link key={w.href} href={w.href} style={{
                display: 'block', borderRadius: 16, padding: 20, textDecoration: 'none',
                background: grad ? 'var(--uk-grad)' : '#fff',
                border: grad ? 'none' : '1px solid var(--uk-line-strong)',
                color: grad ? '#fff' : 'var(--uk-ink)',
                boxShadow: grad ? 'var(--uk-shadow-md)' : 'none',
              }}>
                <Icon size={20} color={grad ? '#fff' : 'var(--uk-indigo)'} />
                <div style={{ fontFamily: 'var(--font-grotesk), sans-serif', fontWeight: 700, fontSize: 16, marginTop: 12, color: grad ? '#fff' : 'var(--uk-ink)' }}>{w.title}</div>
                <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 4, color: grad ? 'rgba(255,255,255,.9)' : 'var(--uk-muted)' }}>{w.desc}</div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, marginTop: 12, color: grad ? '#fff' : 'var(--uk-indigo-strong)' }}>{w.cta} <ArrowRight size={14} /></span>
              </Link>
            );
          })}
        </div>

        {/* jump nav */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '24px 0', borderBottom: '1px solid var(--uk-line)' }}>
          {GROUPS.map((g) => {
            const n = entries.filter(([slug, v]) => groupOf(slug, v) === g.id).length;
            if (!n) return null;
            return (
              <a key={g.id} href={`#${g.id}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600,
                color: 'var(--uk-text)', background: 'var(--uk-soft)', border: '1px solid var(--uk-line)',
                padding: '7px 13px', borderRadius: 999, textDecoration: 'none',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: 3, background: `var(--uk-c${g.c})` }} />
                {g.label}
                <span style={{ color: 'var(--uk-muted)', fontVariantNumeric: 'tabular-nums' }}>{n}</span>
              </a>
            );
          })}
        </div>

        {/* groups */}
        {GROUPS.map((g) => {
          const routes = entries.filter(([slug, v]) => groupOf(slug, v) === g.id);
          if (!routes.length) return null;
          const Icon = g.Icon;
          return (
            <section key={g.id} id={g.id} style={{ scrollMarginTop: 88, paddingTop: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 6 }}>
                <span style={{ width: 44, height: 44, borderRadius: 12, background: `var(--uk-c${g.c})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Icon size={22} /></span>
                <h2 style={{ fontFamily: 'var(--font-grotesk), sans-serif', fontWeight: 700, fontSize: '1.55rem', letterSpacing: '-0.025em', color: 'var(--uk-ink)', margin: 0 }}>{g.label}</h2>
                <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600, color: 'var(--uk-muted)', fontVariantNumeric: 'tabular-nums' }}>{routes.length}</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--uk-muted)', margin: '0 0 18px 57px' }}>{g.blurb}</p>

              <div className={s.relGrid}>
                {routes.map(([slug, v]) => {
                  const fee = shortFee(v.fee);
                  return (
                    <Link key={slug} href={`/visa/${slug}`} className={s.relCard} style={cVar(g.c)}>
                      <h3>{v.title}</h3>
                      <p>{v.tagline}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '12px 0 0' }}>
                        {fee && <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--uk-text)', background: 'var(--uk-soft)', border: '1px solid var(--uk-line)', padding: '3px 9px', borderRadius: 999 }}>From {fee}</span>}
                        {v.processing?.outside && <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--uk-text)', background: 'var(--uk-soft)', border: '1px solid var(--uk-line)', padding: '3px 9px', borderRadius: 999 }}>{v.processing.outside} decision</span>}
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, marginTop: 14, color: `var(--uk-c${g.c}-tx)` }}>View route <ArrowUpRight size={13} /></span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div style={{ padding: '48px 0 60px' }}>
          <EditorByline verified="May 2026" prefix="Edited & verified by" />
        </div>
      </div>
    </div>
  );
}
