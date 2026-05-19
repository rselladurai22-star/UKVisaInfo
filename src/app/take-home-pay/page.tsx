import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, ArrowRight, ShieldCheck } from 'lucide-react';
import TakeHomeCalculator from '../../components/take-home/TakeHomeCalculator';

export const metadata: Metadata = {
  title: 'UK Take-Home Pay Calculator 2026/27 — PAYE, NI, Student Loan, Pension',
  description:
    'Free UK take-home pay calculator. Enter your salary and instantly see net pay after income tax, National Insurance, student loan repayments, pension contributions and salary sacrifice. 2026/27 HMRC rates.',
  alternates: { canonical: '/take-home-pay' },
  openGraph: {
    title: 'UK Take-Home Pay Calculator 2026/27',
    description: 'Net pay after tax, NI, student loan and pension. HMRC-verified 2026/27 rates.',
    url: 'https://ukvisainfo.co.uk/take-home-pay',
    type: 'website',
  },
};

export default function TakeHomePayPage() {
  return (
    <div className="bg-white min-h-screen relative">
      {/* Subtle dot pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[400px] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(118,119,126,0.18) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '-12px -12px',
          opacity: 0.16,
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-4 md:px-10 pt-[100px] md:pt-[120px] pb-20">

        {/* ── HERO ── */}
        <header className="text-center max-w-3xl mx-auto pb-10 md:pb-14">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full bg-[#e1e3e4] text-[#45464d] mb-5"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <Calculator className="w-3 h-3" />
            Take-Home Pay · 2026/27 tax year
          </span>

          <h1
            className="font-bold text-[#101a36] tracking-[-0.025em] text-balance"
            style={{
              fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
              fontSize: 'clamp(2.25rem, 6vw, 3.5rem)',
              lineHeight: '1.05',
            }}
          >
            What you actually take home.
          </h1>

          <p
            className="mt-5 text-[16px] md:text-[18px] text-[#45464d] leading-[1.55] max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Enter your salary and instantly see net pay after Income Tax, National Insurance, student loan, pension and salary sacrifice — verified against HMRC's 2026/27 published rates.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#15803d]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <ShieldCheck className="w-3.5 h-3.5" />
            HMRC-verified · Free · No signup
          </div>
        </header>

        {/* ── CALCULATOR ── */}
        <TakeHomeCalculator initialSalary={50000} />

        {/* ── RELATED TOOLS ── */}
        <section className="mt-16 md:mt-20">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Related tools
          </p>
          <h2
            className="font-bold text-[#101a36] tracking-[-0.015em] mb-6"
            style={{
              fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            }}
          >
            What you might calculate next
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RelatedCard
              href="/tools/salary-checker"
              title="Skilled Worker salary checker"
              desc="Check your salary against the UK visa minimum + going rates for 270 SOC codes."
            />
            <RelatedCard
              href="/tools/cost-calculator"
              title="UK visa cost calculator"
              desc="Total cost of any UK visa: Home Office fee, IHS and dependants. Verified gov.uk."
            />
            <RelatedCard
              href="/postcode"
              title="UK Postcode lookup"
              desc="Council, MP, NHS region, police force and more for any UK postcode."
            />
          </div>
        </section>

        {/* ── HOW IT WORKS / SOURCE ── */}
        <section className="mt-12 bg-white border border-[#E5E7EB] rounded-xl p-6 md:p-8 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.04)]">
          <h2
            className="font-bold text-[#101a36] text-[18px] md:text-[20px] mb-4"
            style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
          >
            How the 2026/27 numbers work
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 text-[14px] text-[#45464d] leading-[1.65]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <div>
              <h3 className="font-semibold text-[#101a36] mb-1.5" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>Income Tax (rUK)</h3>
              <p>Personal Allowance £12,570 (tapers £1-for-£2 above £100k). Basic rate 20% up to £50,270, higher rate 40% up to £125,140, additional rate 45% above.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#101a36] mb-1.5" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>Income Tax (Scotland)</h3>
              <p>Starter 19% · Basic 20% · Intermediate 21% · Higher 42% · Advanced 45% · Top 48%. Different thresholds — toggle the Scotland box.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#101a36] mb-1.5" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>National Insurance</h3>
              <p>8% on earnings between £12,570 and £50,270 (the Primary Threshold and Upper Earnings Limit). 2% on earnings above the UEL.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#101a36] mb-1.5" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>Student loans</h3>
              <p>9% above plan-specific threshold (Plan 1 £26,065 · Plan 2 £28,470 · Plan 4 £32,745 · Plan 5 £25,000) · Postgraduate Loan 6% above £21,000.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#101a36] mb-1.5" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>Pension</h3>
              <p>Net-pay arrangement — your contribution reduces taxable pay AND NI base (when sacrificed) or just taxable pay (relief at source). We assume net-pay.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#101a36] mb-1.5" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>Salary sacrifice</h3>
              <p>Pre-tax + pre-NI deduction for benefits like cycle-to-work, EV lease or additional pension. Reduces both your tax AND NI base.</p>
            </div>
          </div>
          <p
            className="mt-6 pt-4 border-t border-[#E5E7EB] text-[12px] text-[#76777e]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            For guidance only. This calculator does not account for benefits in kind, taxable expenses, K-codes, marriage allowance transfer, blind person's allowance, child benefit High-Income Charge or pension annual-allowance taper. For complex situations, check with HMRC or a chartered accountant.
          </p>
        </section>
      </div>
    </div>
  );
}

function RelatedCard({
  href, title, desc,
}: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group block bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-[#101a36] transition-colors duration-100 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.04)]"
    >
      <h3
        className="font-semibold text-[15px] text-[#101a36] leading-tight mb-1.5"
        style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
      >
        {title}
      </h3>
      <p
        className="text-[12.5px] text-[#45464d] leading-[1.55] mb-3"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {desc}
      </p>
      <span
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#101a36] group-hover:gap-2 transition-[gap] duration-100"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        Open <ArrowRight className="w-3 h-3" />
      </span>
    </Link>
  );
}
