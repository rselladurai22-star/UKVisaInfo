'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Wallet,
  Gavel,
  BookOpen,
  ShieldAlert,
  Leaf,
  Users,
  Building2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

type Band = 'basic' | 'higher' | 'additional';

const BAND_RATE: Record<Band, number> = { basic: 0.2, higher: 0.4, additional: 0.45 };
const BAND_LABEL: Record<Band, string> = { basic: 'Basic (20%)', higher: 'Higher (40%)', additional: 'Additional (45%)' };
const STRESS_RATE = 0.055; // typical BTL ICR stress rate

const gbp = (n: number) =>
  '£' + Math.round(n).toLocaleString('en-GB');

const TOC = [
  { id: 'section-24', label: 'Section 24 Tax Trap' },
  { id: 'ownership', label: 'Ownership Structures' },
  { id: 'performance', label: 'Performance Ecosystem' },
  { id: 'optimization', label: 'Yield Optimization' },
  { id: 'compliance', label: 'Regulatory Compliance' },
  { id: 'cgt', label: 'CGT Strategy' },
];

export default function LandlordSuite() {
  const [price, setPrice] = useState(450000);
  const [rent, setRent] = useState(2250); // monthly
  const [opPct, setOpPct] = useState(15);
  const [depositPct, setDepositPct] = useState(25);
  const [rate, setRate] = useState(5.5); // mortgage pay rate %
  const [band, setBand] = useState<Band>('higher');

  const r = useMemo(() => {
    const annualRent = rent * 12;
    const loan = price * (1 - depositPct / 100);
    const deposit = price * (depositPct / 100);
    const interest = loan * (rate / 100);
    const opCost = annualRent * (opPct / 100);

    const grossYield = price > 0 ? (annualRent / price) * 100 : 0;

    // Section 24: interest is NOT an allowable expense; 20% credit instead.
    const taxableIncome = Math.max(0, annualRent - opCost);
    const taxOnIncome = taxableIncome * BAND_RATE[band];
    const interestCredit = interest * 0.2;
    const taxDue = Math.max(0, taxOnIncome - interestCredit);

    // Pre-S24 (old rules) tax, for the "impact" delta.
    const oldTaxable = Math.max(0, annualRent - opCost - interest);
    const oldTax = oldTaxable * BAND_RATE[band];
    const section24Impact = Math.max(0, taxDue - oldTax);

    const netBeforeTax = annualRent - opCost - interest;
    const netAfterTax = netBeforeTax - taxDue;

    const cashInvested = deposit + price * 0.05; // deposit + ~5% buying costs
    const roi = cashInvested > 0 ? (netAfterTax / cashInvested) * 100 : 0;

    // Lender ICR: rent vs stressed interest.
    const stressedInterest = loan * STRESS_RATE;
    const icr = stressedInterest > 0 ? (annualRent / stressedInterest) * 100 : 0;
    const icrRequired = band === 'basic' ? 125 : 145;

    return {
      annualRent,
      grossYield,
      netAfterTax,
      roi,
      icr,
      icrRequired,
      section24Impact,
      taxDue,
    };
  }, [price, rent, opPct, depositPct, rate, band]);

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <section className="container-page pt-10 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/category/property" className="hover:text-primary transition-colors">Property</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Landlord Suite</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight">
          Buy-to-Let &amp; Landlord Calculator
        </h1>
        <p className="mt-3 text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
          Model yield and ROI, pass the BTL mortgage ICR stress test, and see the Section 24 tax
          impact for higher-rate landlords — one workstation for the whole investment decision.
        </p>
      </section>

      {/* ── Workstation: Yield + Tax bento ───────────────────────── */}
      <section className="container-page pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Yield & Net Architecture */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-soft p-5">
            <div className="flex items-center gap-2 mb-4 border-b border-outline-variant pb-3">
              <Wallet className="h-5 w-5 text-primary" />
              <h2 className="font-display font-bold text-sm">Yield &amp; Net Architecture</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Field label="Purchase Price">
                  <NumberInput value={price} onChange={setPrice} prefix="£" />
                </Field>
                <Field label="Monthly Rent">
                  <NumberInput value={rent} onChange={setRent} prefix="£" />
                </Field>
                <Field label={`Operating Expenses (${opPct}%)`}>
                  <input
                    type="range" min={0} max={40} value={opPct}
                    onChange={(e) => setOpPct(Number(e.target.value))}
                    className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </Field>
                <Field label={`Deposit (${depositPct}%)`}>
                  <input
                    type="range" min={5} max={100} value={depositPct}
                    onChange={(e) => setDepositPct(Number(e.target.value))}
                    className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </Field>
                <Field label={`Mortgage Rate (${rate}%)`}>
                  <input
                    type="range" min={0} max={12} step={0.1} value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </Field>
              </div>

              <div className="bg-primary-soft/25 rounded-lg p-4 flex flex-col justify-center items-center text-center border border-primary-soft">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Gross Yield</span>
                <div className="text-4xl font-display font-black text-primary">{r.grossYield.toFixed(2)}%</div>
                <p className="text-[10px] text-primary/70 mt-1">Benchmark: 4.5% – 7.2%</p>
              </div>

              <div className="space-y-3 py-1">
                <Stat label="Net Profit (after tax)" value={gbp(r.netAfterTax)} />
                <Stat label="Est. ROI (leveraged)" value={`${r.roi.toFixed(2)}%`} accent="text-secondary" />
                <Stat
                  label="Mortgage ICR"
                  value={`${Math.round(r.icr)}%`}
                  accent={r.icr >= r.icrRequired ? 'text-secondary' : 'text-red-600'}
                />
                <p className="text-[10px] text-on-surface-variant leading-tight">
                  Lender needs ≥ {r.icrRequired}% ICR ({band === 'basic' ? 'basic' : 'higher'}-rate). Stress
                  rate {(STRESS_RATE * 100).toFixed(1)}%.
                </p>
              </div>
            </div>
          </div>

          {/* Tax Liability / Section 24 */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-soft p-5">
            <div className="flex items-center gap-2 mb-4 border-b border-outline-variant pb-3">
              <Gavel className="h-5 w-5 text-orange-500" />
              <h2 className="font-display font-bold text-sm">Tax Liability Analysis</h2>
            </div>

            <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">Tax band</label>
            <select
              value={band}
              onChange={(e) => setBand(e.target.value as Band)}
              className="w-full mb-4 bg-surface border border-outline-variant rounded px-3 py-1.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            >
              {(['basic', 'higher', 'additional'] as Band[]).map((b) => (
                <option key={b} value={b}>{BAND_LABEL[b]}</option>
              ))}
            </select>

            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-[11px]">
                <span className="font-bold text-on-surface">Section 24 impact</span>
                <span className="text-red-600 font-bold">−{gbp(r.section24Impact)}/yr</span>
              </div>
              <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full"
                  style={{ width: `${Math.min(100, (r.section24Impact / Math.max(1, r.taxDue)) * 100)}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-on-surface-variant leading-snug mb-4">
              Mortgage interest relief is restricted to a flat 20% credit. For higher- and
              additional-rate landlords this raises the effective tax rate sharply.
            </p>

            <div className="flex items-center justify-between bg-surface-container rounded-lg p-3">
              <span className="text-[11px] text-on-surface-variant">Annual tax due (est.)</span>
              <span className="text-sm font-display font-bold">{gbp(r.taxDue)}</span>
            </div>
            <p className="mt-4 text-[10px] text-on-surface-variant italic">
              Estimates only — not tax advice. Excludes personal allowance interactions and other income.
            </p>
          </div>
        </div>
      </section>

      {/* ── Flagship guide with sticky sidebar ───────────────────── */}
      <div className="container-page pb-20 flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-60 flex-shrink-0">
          <div className="lg:sticky lg:top-24 border border-outline-variant bg-surface-container-lowest rounded-xl p-4 shadow-soft">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> In this guide
            </h3>
            <nav className="space-y-1">
              {TOC.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className="block text-xs py-2 px-3 rounded-md text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                >
                  {t.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 pt-5 border-t border-outline-variant">
              <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">Related tools</h4>
              <div className="space-y-2 text-[11px]">
                <Link href="/stamp-duty-calculator" className="block text-on-surface-variant hover:text-primary">Stamp Duty calculator</Link>
                <Link href="/mortgage-affordability" className="block text-on-surface-variant hover:text-primary">Mortgage affordability</Link>
                <Link href="/rental-yield-calculator" className="block text-on-surface-variant hover:text-primary">Rental yield (standalone)</Link>
                <Link href="/property-cgt-calculator" className="block text-on-surface-variant hover:text-primary">Property CGT</Link>
              </div>
            </div>
          </div>
        </aside>

        <article className="flex-1 max-w-3xl">
          {/* Section 24 */}
          <section id="section-24" className="scroll-mt-24 mb-14">
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-5">Section 24: the landlord tax trap</h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg mb-6">
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="h-4 w-4 text-red-600" />
                <h4 className="text-red-700 font-bold text-sm">Technical summary</h4>
              </div>
              <p className="text-sm text-red-700/80 leading-relaxed">
                Introduced in the Finance Act 2015, Section 24 removed individual landlords&apos; ability to
                deduct finance costs from rental income before tax. Tax is now charged on turnover, not profit,
                with a flat 20% credit on interest instead.
              </p>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-on-surface-variant">
              <p>
                For decades, buy-to-let was taxed like any business: revenue minus expenses equals taxable
                profit. The phased change between 2017 and 2020 decoupled mortgage interest from allowable
                expenses for individual owners. Basic-rate taxpayers are broadly neutral; higher- (40%) and
                additional-rate (45%) landlords face a sharp erosion of net cash flow.
              </p>
              <p>
                Take a property earning £15,000 rent with £10,000 mortgage interest. Under the old rules the
                taxable profit was £5,000 — a 40% taxpayer paid £2,000 and kept £3,000. Under Section 24 the
                taxable income is the full £15,000: tax of £6,000 minus a £2,000 credit (20% of interest) =
                £4,000 due. Cash left? Just £1,000 — a 66% fall in net income with no change in performance.
              </p>
            </div>
          </section>

          <hr className="border-outline-variant my-10" />

          {/* Ownership */}
          <section id="ownership" className="scroll-mt-24 mb-14">
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-5">Limited company vs personal ownership</h2>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
              The most common Section 24 mitigation is an SPV (special purpose vehicle) limited company.
              Companies are currently exempt from the restriction, so they can still deduct interest as a
              business expense.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <CaseCard
                icon={<Users className="h-5 w-5" />}
                title="Personal ownership"
                points={[
                  ['Lower financing costs', 'Personal BTL rates are typically 0.5–1.5% below commercial rates.'],
                  ['Capital gains perks', 'Individuals keep a CGT allowance and simpler disposals.'],
                  ['Low complexity', 'No corporation tax returns or £1k–£3k/yr accounting fees.'],
                ]}
              />
              <CaseCard
                icon={<Building2 className="h-5 w-5" />}
                title="SPV limited company"
                points={[
                  ['Interest deductibility', '100% of interest is an allowable expense — vital for leveraged portfolios.'],
                  ['Reinvestment power', 'Profits taxed at 19–25%, not 40–45%, compounding faster.'],
                  ['Inheritance planning', 'Shares in a family investment company can be gifted to cut future IHT.'],
                ]}
              />
            </div>
          </section>

          <hr className="border-outline-variant my-10" />

          {/* Performance */}
          <section id="performance" className="scroll-mt-24 mb-14">
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-5">Property performance ecosystem</h2>
            <p className="text-sm text-on-surface-variant mb-5 leading-relaxed">
              Successful investing needs a holistic view of gross revenue, operating leakage and tax drag —
              not just headline rent.
            </p>
            <div className="space-y-3 text-sm text-on-surface-variant leading-relaxed">
              <p><strong className="text-on-surface">Gross rent</strong> — top-line potential, set by local supply/demand and the property&apos;s finish.</p>
              <p><strong className="text-on-surface">Operating leakage</strong> — management (8–15%), maintenance reserve (~10% of rent), insurance, and the priciest cost of all: void periods.</p>
              <p><strong className="text-on-surface">Finance &amp; tax drag</strong> — the silent killers. A Section 24-optimised portfolio can be the difference between freedom and a loss-making hobby.</p>
            </div>
          </section>

          <hr className="border-outline-variant my-10" />

          {/* Optimization */}
          <section id="optimization" className="scroll-mt-24 mb-14">
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-5">Advanced yield optimisation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <TipCard icon={<Leaf className="h-5 w-5" />} title="EPC retrofitting" body="Reaching EPC 'C' unlocks green mortgages with lower rates and protects letability under MEES rules." />
              <TipCard icon={<Users className="h-5 w-5" />} title="Direct management" body="Tech platforms (OpenRent, Rentman) avoid the 10–15% agency fee while keeping compliance automated." />
              <TipCard icon={<Building2 className="h-5 w-5" />} title="Strategy pivot" body="Single-let → HMO or serviced accommodation can multiply gross revenue, at the cost of complexity and licensing." />
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              In a high-rate environment, passive investing is dead. Focus on <strong className="text-on-surface">Net
              Operating Income</strong>: every £100 saved on maintenance and every month of void avoided drops
              straight to the bottom line with no extra tax.
            </p>
          </section>

          <hr className="border-outline-variant my-10" />

          {/* Compliance */}
          <section id="compliance" className="scroll-mt-24 mb-14">
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-5">Regulatory compliance framework</h2>
            <p className="text-sm text-on-surface-variant mb-5 leading-relaxed">
              Non-compliance can trigger Rent Repayment Orders or heavy fines. Three pillars matter most.
            </p>
            <div className="overflow-hidden border border-outline-variant rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container border-b border-outline-variant">
                  <tr>
                    <th className="px-4 py-3 font-bold">Requirement</th>
                    <th className="px-4 py-3 font-bold">Frequency</th>
                    <th className="px-4 py-3 font-bold">Risk level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  <ComplianceRow req="Gas Safety Certificate (CP12)" freq="Annual" risk="Critical (criminal)" tone="red" />
                  <ComplianceRow req="Electrical Safety (EICR)" freq="5-yearly" risk="High (£30k fine)" tone="red" />
                  <ComplianceRow req="Right-to-Rent checks" freq="Pre-tenancy" risk="Mandatory" tone="orange" />
                  <ComplianceRow req="Selective / HMO licensing" freq="Varies by council" risk="Critical (RRO risk)" tone="red" />
                </tbody>
              </table>
            </div>
          </section>

          {/* CGT CTA */}
          <section id="cgt" className="scroll-mt-24">
            <div className="bg-on-surface text-surface rounded-2xl p-7 relative overflow-hidden">
              <h2 className="text-2xl font-display font-bold mb-3">Capital Gains Tax (CGT) strategy</h2>
              <p className="text-sm text-surface/70 mb-6 max-w-2xl leading-relaxed">
                Residential disposals are taxed at 18% and 24% — higher than other assets. Capital-works
                deductions for structural improvements and timing sales across tax years can save tens of
                thousands on exit.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/property-cgt-calculator"
                  className="inline-flex items-center gap-1.5 bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-primary-container transition-colors"
                >
                  Calculate CGT liability <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/find-immigration-solicitor"
                  className="inline-flex items-center gap-1.5 bg-surface/10 text-surface px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-surface/20 transition-colors border border-surface/20"
                >
                  Talk to a tax specialist
                </Link>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}

/* ── small building blocks ─────────────────────────────────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">{label}</label>
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, prefix }: { value: number; onChange: (n: number) => void; prefix?: string }) {
  return (
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">{prefix}</span>}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full bg-surface border border-outline-variant rounded ${prefix ? 'pl-7' : 'pl-3'} pr-3 py-1.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none`}
      />
    </div>
  );
}

function Stat({ label, value, accent = 'text-on-surface' }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex justify-between border-b border-outline-variant pb-1">
      <span className="text-xs text-on-surface-variant">{label}</span>
      <span className={`text-xs font-bold ${accent}`}>{value}</span>
    </div>
  );
}

function CaseCard({ icon, title, points }: { icon: React.ReactNode; title: string; points: [string, string][] }) {
  return (
    <div className="border-l-2 border-primary pl-4">
      <h4 className="font-display font-bold mb-3 flex items-center gap-2">
        <span className="text-primary">{icon}</span> {title}
      </h4>
      <ul className="text-sm space-y-3">
        {points.map(([h, b]) => (
          <li key={h} className="flex gap-2 text-on-surface-variant">
            <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
            <span><strong className="text-on-surface">{h}:</strong> {b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TipCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="bg-surface-container-low rounded-lg border border-outline-variant p-4">
      <span className="text-primary block mb-2">{icon}</span>
      <h5 className="font-display font-bold text-sm mb-1">{title}</h5>
      <p className="text-xs text-on-surface-variant leading-relaxed">{body}</p>
    </div>
  );
}

function ComplianceRow({ req, freq, risk, tone }: { req: string; freq: string; risk: string; tone: 'red' | 'orange' }) {
  return (
    <tr>
      <td className="px-4 py-3">{req}</td>
      <td className="px-4 py-3 text-on-surface-variant">{freq}</td>
      <td className="px-4 py-3">
        <span className={`font-bold ${tone === 'red' ? 'text-red-600' : 'text-orange-600'}`}>{risk}</span>
      </td>
    </tr>
  );
}
