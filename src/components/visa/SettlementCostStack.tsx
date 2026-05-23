/**
 * SettlementCostStack — visual cost breakdown (Editorial Premium)
 * Pure white card, Fraunces serif numbers, emerald bars, ink-on-cream total.
 */

import Link from 'next/link';
import { Calculator, ShieldCheck, ExternalLink, ArrowRight, AlertCircle } from 'lucide-react';
import type { RouteBreakdown } from '../../data/settlementFees';

const INK     = '#1A1F36';
const CREAM   = '#FCFCFD';
const PAPER   = '#FFFFFF';
const EMERALD = '#635BFF';
const GOLD    = '#5851DB';
const SLATE   = '#3C4257';
const MUTED   = '#697386';
const HAIR    = '#E3E8EE';

const POUND = (n: number) => '£' + n.toLocaleString('en-GB');

export default function SettlementCostStack({
  breakdown, calculatorVisaParam,
}: {
  breakdown: RouteBreakdown;
  calculatorVisaParam?: string;
}) {
  const max = Math.max(1, ...breakdown.lines.map((l) => l.amount));

  return (
    <div
      className="my-8 rounded-3xl p-7 md:p-8"
      style={{
        background: PAPER,
        border: `1px solid ${HAIR}`,
        boxShadow: '0 2px 16px -8px rgba(26,31,54,0.10)',
      }}>
      <div className="flex items-start justify-between gap-3 mb-6 pb-5" style={{ borderBottom: `1px solid ${HAIR}` }}>
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-1.5 inline-flex items-center gap-1.5"
             style={{ color: GOLD }}>
            <Calculator className="w-3 h-3" />
            Cost stack
          </p>
          <h3
            style={{
              fontFamily: '"Inter Tight", Inter, sans-serif',
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: '-0.022em',
              color: INK,
              lineHeight: 1.15,
            }}>
            {breakdown.title}
          </h3>
        </div>
        <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full flex-shrink-0"
             style={{ background: 'rgba(99,91,255,0.10)', border: '1px solid rgba(99,91,255,0.22)', color: EMERALD }}>
          <ShieldCheck className="w-3 h-3" />
          gov.uk verified
        </div>
      </div>

      {/* Stacked bars */}
      <ol className="space-y-3 mb-6">
        {breakdown.lines.map((line) => {
          const pct = breakdown.total === 0 ? 0 : (line.amount / max) * 100;
          return (
            <li key={line.label} className="grid grid-cols-12 gap-3 items-center">
              <span className="col-span-12 sm:col-span-5 text-[14px] font-medium" style={{ color: INK }}>
                {line.label}
              </span>
              <div className="col-span-9 sm:col-span-5 relative h-7 rounded-lg overflow-hidden"
                   style={{ background: 'rgba(26,31,54,0.04)' }}>
                <div
                  className="absolute inset-y-0 left-0 rounded-lg transition-[width] duration-500 ease-out"
                  style={{
                    width: `${Math.max(2, pct)}%`,
                    background: `linear-gradient(90deg, ${EMERALD} 0%, ${EMERALD} 70%, ${GOLD} 100%)`,
                  }}
                />
              </div>
              <span className="col-span-3 sm:col-span-2 text-right text-[14px] tabular-nums"
                    style={{
                      color: INK,
                      fontFamily: '"Inter Tight", Inter, sans-serif',
                      fontWeight: 600,
                      letterSpacing: '-0.012em',
                    }}>
                {POUND(line.amount)}
              </span>
              <span className="col-span-12 -mt-1 text-[10.5px]" style={{ color: MUTED }}>
                Source: {line.source}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Total bar */}
      <div
        className="rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ background: INK, color: CREAM }}>
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: '#FDE68A' }}>
            Total {breakdown.perPerson ? 'per person' : ''}
          </p>
          <div className="mt-1.5 tabular-nums"
               style={{
                 fontFamily: '"Inter Tight", Inter, sans-serif',
                 fontWeight: 700,
                 fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                 letterSpacing: '-0.025em',
                 lineHeight: 1,
                 color: CREAM,
               }}>
            {POUND(breakdown.total)}
          </div>
        </div>
        {calculatorVisaParam !== undefined && (
          <Link
            href={`/tools/cost-calculator${calculatorVisaParam ? `?visa=${calculatorVisaParam}` : ''}`}
            className="inline-flex items-center gap-2 font-semibold px-5 py-3 rounded-xl text-[13px] transition-colors active:scale-[0.98] hover:bg-[#FDE68A]"
            style={{ background: CREAM, color: INK }}>
            <Calculator className="w-3.5 h-3.5" />
            Calculate your full cost
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Note */}
      {breakdown.note && (
        <div className="mt-5 flex items-start gap-2.5 p-4 rounded-xl"
             style={{ background: '#FBF6E7', border: '1px solid rgba(88,81,219,0.25)' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
          <p className="text-[13px] leading-[1.6]" style={{ color: '#5C4A12' }}>{breakdown.note}</p>
        </div>
      )}

      {/* Verified link out */}
      <div className="mt-5 pt-4 flex items-center justify-between text-[11.5px]"
           style={{ borderTop: `1px solid ${HAIR}`, color: MUTED }}>
        <span>Every figure verified against gov.uk on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.</span>
        <a
          href="https://www.gov.uk/government/publications/visa-regulations-revised-table"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold transition-colors"
          style={{ color: EMERALD }}>
          gov.uk fee table <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
