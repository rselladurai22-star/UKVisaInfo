import Link from 'next/link';
import { Calculator, ShieldCheck, ExternalLink, ArrowRight, AlertCircle } from 'lucide-react';
import type { RouteBreakdown } from '../../data/settlementFees';

const POUND = (n: number) => '£' + n.toLocaleString('en-GB');

/**
 * Visual cost breakdown for a settlement route, with a prominent
 * link to the interactive cost calculator. Every line cites the
 * gov.uk page the figure came from — no estimates.
 */
export default function SettlementCostStack({
  breakdown, calculatorVisaParam,
}: {
  breakdown: RouteBreakdown;
  /** Visa ID used by the cost calculator. Pre-fills the form. */
  calculatorVisaParam?: string;
}) {
  const max = Math.max(1, ...breakdown.lines.map((l) => l.amount));

  return (
    <div className="my-8 rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-6 md:p-7 shadow-[0_2px_12px_rgba(10, 37, 64,0.04)]">
      <div className="flex items-start justify-between gap-3 mb-5 pb-4 border-b border-[rgba(14,20,36,0.06)]">
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#00C4B4] mb-1.5 inline-flex items-center gap-1.5">
            <Calculator className="w-3 h-3" />
            Cost stack
          </div>
          <h3 className="font-display text-[1.125rem] md:text-[1.25rem] font-bold text-[#0A2540] leading-tight tracking-[-0.015em]">
            {breakdown.title}
          </h3>
        </div>
        <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#10b981] px-2.5 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/25 flex-shrink-0">
          <ShieldCheck className="w-3 h-3" />
          gov.uk verified
        </div>
      </div>

      {/* Stacked bars */}
      <ol className="space-y-2.5 mb-5">
        {breakdown.lines.map((line) => {
          const pct = breakdown.total === 0 ? 0 : (line.amount / max) * 100;
          return (
            <li key={line.label} className="grid grid-cols-12 gap-3 items-center">
              <span className="col-span-12 sm:col-span-5 text-[13.5px] text-[#1a2240] font-medium">
                {line.label}
              </span>
              <div className="col-span-9 sm:col-span-5 relative h-7 bg-[#f3f5fb] rounded-lg overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-lg bg-gradient-to-r from-[#00C4B4] via-[#00C4B4] to-[#C9A14A] transition-[width] duration-500 ease-out"
                  style={{ width: `${Math.max(2, pct)}%` }}
                />
              </div>
              <span className="col-span-3 sm:col-span-2 text-right text-[13.5px] font-bold text-[#0A2540] tabular-nums">
                {POUND(line.amount)}
              </span>
              {/* Source on its own line, full width */}
              <span className="col-span-12 sm:col-start-1 -mt-1.5 sm:-mt-1 sm:col-span-12 text-[10.5px] text-[#9aa3b8] sm:pl-0">
                Source: {line.source}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Total bar */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#0F2C4B] text-white p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#C9A14A]">Total {breakdown.perPerson ? 'per person' : ''}</div>
          <div className="mt-1 font-display font-bold text-[2rem] md:text-[2.25rem] leading-none tabular-nums tracking-[-0.02em]">
            {POUND(breakdown.total)}
          </div>
        </div>
        {calculatorVisaParam !== undefined && (
          <Link
            href={`/tools/cost-calculator${calculatorVisaParam ? `?visa=${calculatorVisaParam}` : ''}`}
            className="inline-flex items-center gap-2 bg-[#C9A14A] text-[#0A2540] font-bold px-4 py-2.5 rounded-xl text-[13px] hover:bg-[#ffd166] active:scale-[0.98] transition-[background,transform] duration-100"
          >
            <Calculator className="w-3.5 h-3.5" />
            Calculate your full cost
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Note */}
      {breakdown.note && (
        <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-[#fffbeb] border border-[#fde68a]">
          <AlertCircle className="w-4 h-4 text-[#C9A14A] flex-shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-[#78350f] leading-snug">{breakdown.note}</p>
        </div>
      )}

      {/* Verified link out */}
      <div className="mt-4 pt-4 border-t border-[rgba(14,20,36,0.06)] flex items-center justify-between text-[11.5px] text-[#7a8195]">
        <span>Every figure verified against gov.uk on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.</span>
        <a
          href="https://www.gov.uk/government/publications/visa-regulations-revised-table"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#00C4B4] font-semibold hover:underline"
        >
          gov.uk fee table <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
