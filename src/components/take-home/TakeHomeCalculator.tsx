'use client';

import { useMemo, useState } from 'react';
import {
  Banknote, Calculator, Info, TrendingUp, ShieldCheck, ExternalLink,
} from 'lucide-react';
import {
  calculateTakeHome, STUDENT_LOAN_PLAN_LABEL,
  type StudentLoanPlan, type CalcResult,
} from '../../lib/take-home/calc';

function formatGBP(n: number, opts: { decimals?: number } = {}): string {
  return n.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: opts.decimals ?? 0,
    maximumFractionDigits: opts.decimals ?? 0,
  });
}
function formatPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

export default function TakeHomeCalculator({ initialSalary = 50000 }: { initialSalary?: number }) {
  const [salary, setSalary] = useState(initialSalary);
  const [pensionPct, setPensionPct] = useState(5);
  const [salarySacrifice, setSalarySacrifice] = useState(0);
  const [studentLoan, setStudentLoan] = useState<StudentLoanPlan>('none');
  const [scotland, setScotland] = useState(false);

  const result: CalcResult = useMemo(
    () => calculateTakeHome({ salary, pensionPct, salarySacrifice, studentLoan, scotland }),
    [salary, pensionPct, salarySacrifice, studentLoan, scotland]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

      {/* ── INPUTS ───────────────────────────── */}
      <aside className="lg:col-span-5 space-y-4">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-3"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Your details
          </p>

          {/* Salary — primary input */}
          <label className="block mb-5">
            <span
              className="block text-[13px] font-semibold text-[#101a36] mb-1.5"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Annual gross salary
            </span>
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#76777e] text-[18px] font-semibold"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >£</span>
              <input
                type="number"
                inputMode="decimal"
                value={salary || ''}
                onChange={(e) => setSalary(Math.max(0, +e.target.value || 0))}
                min={0} step={1000}
                className="w-full pl-8 pr-3 py-3 text-[20px] font-semibold text-[#101a36] bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#101a36] focus:ring-2 focus:ring-[#101a36]/10 tabular-nums"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <input
              type="range"
              value={salary}
              onChange={(e) => setSalary(+e.target.value)}
              min={10000} max={250000} step={1000}
              className="w-full mt-3 accent-[#101a36]"
              aria-label="Salary slider"
            />
            <div className="mt-1 flex justify-between text-[10.5px] text-[#76777e] tabular-nums" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span>£10k</span><span>£250k</span>
            </div>
          </label>

          {/* Pension % */}
          <label className="block mb-5">
            <div className="flex items-baseline justify-between mb-1.5">
              <span
                className="text-[13px] font-semibold text-[#101a36]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Pension contribution
              </span>
              <span
                className="text-[13px] font-semibold text-[#101a36] tabular-nums"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {pensionPct}%
              </span>
            </div>
            <input
              type="range"
              value={pensionPct}
              onChange={(e) => setPensionPct(+e.target.value)}
              min={0} max={50} step={1}
              className="w-full accent-[#101a36]"
            />
            <div className="mt-1 text-[11.5px] text-[#76777e]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Employee contribution (relief at source / net-pay).
            </div>
          </label>

          {/* Salary sacrifice */}
          <label className="block mb-5">
            <span
              className="block text-[13px] font-semibold text-[#101a36] mb-1.5"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Salary sacrifice
              <span className="ml-1.5 text-[#76777e] font-normal">(cycle, EV, additional pension)</span>
            </span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#76777e] text-[14px] font-medium">£</span>
              <input
                type="number"
                inputMode="decimal"
                value={salarySacrifice || ''}
                onChange={(e) => setSalarySacrifice(Math.max(0, +e.target.value || 0))}
                min={0} step={100}
                placeholder="0"
                className="w-full pl-8 pr-3 py-2.5 text-[14px] font-semibold text-[#101a36] bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#101a36] focus:ring-2 focus:ring-[#101a36]/10 tabular-nums"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          </label>

          {/* Student loan plan */}
          <label className="block mb-5">
            <span
              className="block text-[13px] font-semibold text-[#101a36] mb-1.5"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Student loan
            </span>
            <select
              value={studentLoan}
              onChange={(e) => setStudentLoan(e.target.value as StudentLoanPlan)}
              className="w-full px-3 py-2.5 text-[14px] font-medium text-[#101a36] bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#101a36] focus:ring-2 focus:ring-[#101a36]/10"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {(Object.keys(STUDENT_LOAN_PLAN_LABEL) as StudentLoanPlan[]).map((p) => (
                <option key={p} value={p}>{STUDENT_LOAN_PLAN_LABEL[p]}</option>
              ))}
            </select>
          </label>

          {/* Scotland toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={scotland}
              onChange={(e) => setScotland(e.target.checked)}
              className="w-4 h-4 accent-[#101a36] rounded"
            />
            <span
              className="text-[13.5px] text-[#101a36] font-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              I pay Scottish income tax
            </span>
          </label>
        </div>

        {/* Source strip */}
        <div className="bg-[#f3f4f5] border border-[#E5E7EB] rounded-xl p-4">
          <div
            className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2 flex items-center gap-1.5"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <ShieldCheck className="w-3 h-3" /> Verified · 2026/27 tax year
          </div>
          <p
            className="text-[12px] text-[#45464d] leading-[1.55]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            All bands and rates sourced from HMRC published 2026/27 guidance. Personal allowance £12,570 (tapers above £100k). NI 8% (main) + 2% (above UEL).
          </p>
          <a
            href="https://www.gov.uk/income-tax-rates"
            target="_blank" rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#101a36] hover:underline"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            gov.uk tax rates <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </aside>

      {/* ── RESULTS ─────────────────────────── */}
      <main className="lg:col-span-7 space-y-5">

        {/* Headline take-home */}
        <div className="bg-[#101a36] text-white rounded-xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-56 h-56 bg-[#dae2ff] rounded-full opacity-10 blur-3xl pointer-events-none" />
          <div className="relative">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#bcc5e9] mb-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Take-home pay · annual
            </p>
            <p
              className="font-bold tabular-nums tracking-[-0.02em] leading-none"
              style={{
                fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              }}
            >
              {formatGBP(result.netAnnual)}
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
              <Stat label="Monthly" value={formatGBP(result.netMonthly, { decimals: 0 })} sub="per month" />
              <Stat label="Weekly"  value={formatGBP(result.netWeekly,  { decimals: 0 })} sub="per week" />
            </div>
          </div>
        </div>

        {/* Breakdown card */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 md:p-7 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]">
          <div className="flex items-center gap-2 mb-5">
            <Calculator className="w-4 h-4 text-[#101a36]" />
            <h3
              className="font-bold text-[#101a36] text-[16px] md:text-[17px]"
              style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
            >
              How we got there
            </h3>
          </div>
          <dl className="divide-y divide-[#E5E7EB]">
            <DlRow label="Gross salary" value={formatGBP(result.grossSalary)} bold />
            {result.salarySacrifice > 0 && (
              <DlRow label="Less: salary sacrifice" value={`–${formatGBP(result.salarySacrifice)}`} muted />
            )}
            {result.pensionContribution > 0 && (
              <DlRow
                label={`Less: pension (${(result.pensionContribution / result.grossSalary * 100).toFixed(0)}%)`}
                value={`–${formatGBP(result.pensionContribution)}`}
                muted
              />
            )}
            <DlRow label="Taxable pay" value={formatGBP(result.taxablePayAfterPension)} bold />
            <DlRow label="Personal allowance" value={formatGBP(result.personalAllowance)} muted />
            <DlRow
              label={`Income tax${result.incomeTaxBands.length ? ` (${result.incomeTaxBands[result.incomeTaxBands.length - 1].label})` : ''}`}
              value={`–${formatGBP(result.incomeTax)}`}
              color="#D9152B"
            />
            <DlRow
              label="National Insurance"
              value={`–${formatGBP(result.nationalInsurance)}`}
              color="#D9152B"
            />
            {result.studentLoanRepayment > 0 && (
              <DlRow
                label={`Student loan (${STUDENT_LOAN_PLAN_LABEL[result.studentLoanPlan]})`}
                value={`–${formatGBP(result.studentLoanRepayment)}`}
                color="#D9152B"
              />
            )}
            <DlRow
              label="Take-home"
              value={formatGBP(result.netAnnual)}
              big
            />
          </dl>
        </div>

        {/* Rate insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard
            icon={TrendingUp}
            label="Marginal rate"
            value={formatPct(result.marginalRate)}
            sub="On your next £1 earned"
          />
          <InfoCard
            icon={Banknote}
            label="Effective rate"
            value={formatPct(result.effectiveRate)}
            sub="Total deductions as % of gross"
          />
        </div>

        {/* Band-by-band tax detail */}
        {result.incomeTaxBands.length > 0 && (
          <details className="bg-white border border-[#E5E7EB] rounded-xl p-5 group">
            <summary
              className="flex items-center gap-2 cursor-pointer font-semibold text-[14px] text-[#101a36] list-none"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Info className="w-4 h-4" />
              Band-by-band tax breakdown
              <span className="ml-auto text-[#76777e] group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <table className="w-full text-[13px] mt-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#76777e]">
                  <th className="py-2">Band</th>
                  <th className="py-2 text-right">Taxed on</th>
                  <th className="py-2 text-right">Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-[#101a36] tabular-nums">
                {result.incomeTaxBands.map((b, i) => (
                  <tr key={i}>
                    <td className="py-2">{b.label}</td>
                    <td className="py-2 text-right">{formatGBP(b.taxOn)}</td>
                    <td className="py-2 text-right font-semibold">{formatGBP(b.tax)}</td>
                  </tr>
                ))}
                {result.niBands.map((b, i) => (
                  <tr key={`ni-${i}`}>
                    <td className="py-2">NI {b.label}</td>
                    <td className="py-2 text-right">{formatGBP(b.taxOn)}</td>
                    <td className="py-2 text-right font-semibold">{formatGBP(b.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        )}
      </main>
    </div>
  );
}

/* ── Subcomponents ────────────────────────────────────────── */

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#bcc5e9] mb-1"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {label}
      </p>
      <p
        className="font-bold tabular-nums leading-tight"
        style={{
          fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
          fontSize: 'clamp(1.25rem, 3vw, 1.625rem)',
        }}
      >
        {value}
      </p>
      <p className="text-[11px] text-[#bcc5e9]/70 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
        {sub}
      </p>
    </div>
  );
}

function DlRow({
  label, value, bold, big, muted, color,
}: {
  label: string; value: string;
  bold?: boolean; big?: boolean; muted?: boolean; color?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt
        className={`text-[13.5px] ${muted ? 'text-[#76777e]' : 'text-[#45464d]'} ${bold ? 'font-semibold !text-[#101a36]' : ''}`}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {label}
      </dt>
      <dd
        className={`tabular-nums ${big ? 'text-[20px] font-bold' : bold ? 'text-[14.5px] font-semibold' : 'text-[14px] font-medium'}`}
        style={{
          fontFamily: big ? '"Plus Jakarta Sans", Inter, sans-serif' : 'Inter, sans-serif',
          color: color ?? (big ? '#10b981' : '#101a36'),
        }}
      >
        {value}
      </dd>
    </div>
  );
}

function InfoCard({
  icon: Icon, label, value, sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; sub: string;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="inline-flex w-8 h-8 rounded-full bg-[#dae2ff] text-[#101a36] items-center justify-center">
          <Icon className="w-4 h-4" />
        </span>
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {label}
        </p>
      </div>
      <p
        className="font-bold text-[#101a36] tabular-nums tracking-[-0.01em]"
        style={{
          fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
          fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
        }}
      >
        {value}
      </p>
      <p className="text-[12.5px] text-[#45464d] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
        {sub}
      </p>
    </div>
  );
}
