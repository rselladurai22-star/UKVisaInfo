'use client';

/**
 * Variant C — Question-driven wizard.
 * Hero: "What do you want to do today?" + 4 intent cards.
 * Each card expands inline to show relevant tools.
 */

import Link from 'next/link';
import { useState } from 'react';
import { Calculator, Search, Scale, BookOpen, ArrowRight } from 'lucide-react';
import { APP_TILES } from '../../data/tools';
import { FONT, FONT_DISPLAY, INK, PAPER, SOFT, ORANGE, SLATE, MUTED, HAIR } from './tokens';

type Intent = 'calculate' | 'lookup' | 'compare' | 'learn';

const INTENTS: { id: Intent; icon: typeof Calculator; label: string; lede: string; toolHrefs: string[] }[] = [
  {
    id: 'calculate',
    icon: Calculator,
    label: 'Calculate',
    lede: 'A number you need now — pay, tax, mortgage, fees.',
    toolHrefs: [
      '/take-home-pay', '/stamp-duty-calculator', '/mortgage-affordability',
      '/national-insurance', '/dividend-tax', '/inheritance-tax',
    ],
  },
  {
    id: 'lookup',
    icon: Search,
    label: 'Look up',
    lede: 'A fact about a place, person, or status.',
    toolHrefs: [
      '/postcode', '/council-tax-band', '/mot-check',
      '/ulez-check', '/tax-code', '/skilled-worker-points-check',
    ],
  },
  {
    id: 'compare',
    icon: Scale,
    label: 'Compare',
    lede: 'Two options side-by-side, decide what fits.',
    toolHrefs: [
      '/tools/compare', '/salary-compare', '/sole-trader-vs-limited',
      '/ir35-calculator', '/visa-types',
    ],
  },
  {
    id: 'learn',
    icon: BookOpen,
    label: 'Learn',
    lede: 'A long-form guide to the rules behind the numbers.',
    toolHrefs: [],
  },
];

export default function HomeWizard() {
  const [open, setOpen] = useState<Intent | null>('calculate');

  return (
    <div style={{ background: PAPER, color: INK, fontFamily: FONT, paddingTop: 88 }}>

      {/* Hero */}
      <section style={{ paddingTop: 64, paddingBottom: 40 }}>
        <div className="max-w-[1100px] mx-auto px-5 md:px-10 text-center">
          <p style={{
            fontFamily: FONT, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: ORANGE,
            marginBottom: 18,
          }}>
            UKDesk · Free UK reference
          </p>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.4rem, 5.4vw, 4.4rem)',
            lineHeight: 1.02, letterSpacing: '-0.035em',
            color: INK, marginBottom: 20,
            maxWidth: '22ch', marginLeft: 'auto', marginRight: 'auto',
          }}>
            What do you want to do today?
          </h1>
          <p style={{
            fontFamily: FONT, fontSize: 18, lineHeight: 1.6,
            color: SLATE, maxWidth: 580, margin: '0 auto',
          }}>
            Pick an intent and we'll surface the tools that fit. {APP_TILES.length} live
            calculators, sourced from gov.uk, HMRC and ONS.
          </p>
        </div>
      </section>

      {/* 4 intent cards */}
      <section style={{ paddingBottom: 32 }}>
        <div className="max-w-[1100px] mx-auto px-5 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {INTENTS.map((it) => {
              const isOn = open === it.id;
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setOpen(isOn ? null : it.id)}
                  aria-expanded={isOn}
                  style={{
                    background: isOn ? ORANGE : PAPER,
                    color: isOn ? '#FFFFFF' : INK,
                    border: `1px solid ${isOn ? ORANGE : HAIR}`,
                    borderRadius: 18,
                    padding: '22px 20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 150ms',
                  }}
                >
                  <it.icon className="w-6 h-6 mb-3" style={{ color: isOn ? '#FFFFFF' : ORANGE }} />
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20,
                    letterSpacing: '-0.02em', lineHeight: 1.15,
                  }}>
                    {it.label}
                  </div>
                  <p style={{
                    fontFamily: FONT, fontSize: 13, lineHeight: 1.4,
                    color: isOn ? 'rgba(255,255,255,0.85)' : SLATE,
                    marginTop: 6,
                  }}>
                    {it.lede}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Expanded panel for the selected intent */}
      {open && (
        <section style={{ paddingBottom: 80 }}>
          <div className="max-w-[1100px] mx-auto px-5 md:px-10">
            <div style={{
              background: SOFT, borderRadius: 24, padding: '30px 30px 26px',
            }}>
              <ExpandedPanel intent={open} />
            </div>
          </div>
        </section>
      )}

      <section style={{ paddingBottom: 80 }}>
        <div className="max-w-[1100px] mx-auto px-5 md:px-10 text-center">
          <Link href="/tools"
                style={{
                  fontFamily: FONT, fontSize: 14, fontWeight: 600,
                  color: INK, textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
            Or browse all {APP_TILES.length} tools <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ExpandedPanel({ intent }: { intent: Intent }) {
  const it = INTENTS.find((x) => x.id === intent)!;

  if (intent === 'learn') {
    return (
      <div>
        <p style={{
          fontFamily: FONT, fontSize: 11, fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: ORANGE,
          marginBottom: 10,
        }}>
          Learn — long-form guides
        </p>
        <h3 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
          letterSpacing: '-0.022em', color: INK, marginBottom: 14,
        }}>
          Plain-English deep dives on UK rules
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/blog" style={btnPrimary()}>Open the blog <ArrowRight className="w-4 h-4" /></Link>
          <Link href="/news" style={btnGhost()}>Latest news</Link>
        </div>
      </div>
    );
  }

  const tools = it.toolHrefs.map((h) => APP_TILES.find((t) => t.href === h)!).filter(Boolean);

  return (
    <div>
      <p style={{
        fontFamily: FONT, fontSize: 11, fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: ORANGE,
        marginBottom: 10,
      }}>
        {it.label} — popular tools
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {tools.map((t) => (
          <Link key={t.href} href={t.href}
                style={{
                  display: 'block', background: PAPER, borderRadius: 14,
                  border: `1px solid ${HAIR}`,
                  padding: '16px 18px',
                  textDecoration: 'none', color: INK,
                  transition: 'all 150ms',
                }}
                className="hover:-translate-y-0.5 hover:shadow-card">
            <div style={{
              fontFamily: FONT, fontSize: 14, fontWeight: 600,
              color: INK, marginBottom: 4,
            }}>
              {t.label}
            </div>
            <div style={{ fontFamily: FONT, fontSize: 12.5, color: SLATE, lineHeight: 1.4 }}>
              {t.hint}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function btnPrimary() {
  return {
    fontFamily: FONT, fontSize: 14, fontWeight: 600,
    background: ORANGE, color: '#FFFFFF',
    padding: '10px 18px', borderRadius: 12,
    textDecoration: 'none',
    display: 'inline-flex', alignItems: 'center', gap: 6,
  } as React.CSSProperties;
}

function btnGhost() {
  return {
    fontFamily: FONT, fontSize: 14, fontWeight: 600,
    background: PAPER, color: INK,
    padding: '10px 18px', borderRadius: 12,
    border: `1px solid ${HAIR}`,
    textDecoration: 'none',
  } as React.CSSProperties;
}
