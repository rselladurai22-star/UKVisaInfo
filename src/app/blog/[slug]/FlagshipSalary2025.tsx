/**
 * Flagship article, "UK Salary After Tax 2025/26".
 * 100% bespoke, magazine-grade layout. Does NOT use the legacy ArticleBody /
 * markdown-block system. Self-contained premium components, Clean Slate Blue.
 */

import Link from 'next/link';
import {
  ArrowRight, CheckCircle2, ChevronRight, ChevronDown, AlertTriangle, Lightbulb, TrendingUp, Wallet, Calculator,
  XCircle, ClipboardList, Award, ShieldCheck, Target, Sparkles,
} from 'lucide-react';
import type { BlogPost, BlogCategory, BlogCategoryMeta, RelatedTool } from '../../../data/blog';
import BlogShell, { type BlogCta } from '../../../components/blog/BlogShell';
import {
  ScrollRevealManager, ReadingPosition, ArticleTocRail, CountUpStat,
  SalaryExplorer, AnimatedRetentionBars, CompositionChart, MarginalRateChart,
  StickyCalcCta,
} from './flagship-islands';

const TOC_ITEMS = [
  { id: 'key-takeaways', label: 'Key takeaways' },
  { id: 'how-it-works', label: 'How pay works' },
  { id: 'table', label: 'The full table' },
  { id: 'thresholds', label: 'The 3 thresholds' },
  { id: 'good-salary', label: 'Is it a good salary?' },
  { id: 'new-to-uk', label: 'New to the UK' },
  { id: 'employed-vs-self', label: 'Employed vs self-employed' },
  { id: 'bonuses', label: 'Bonuses & lumpy pay' },
  { id: 'households', label: 'Couples & households' },
  { id: 'milestones', label: 'Salary milestones' },
  { id: 'international', label: 'UK vs abroad' },
  { id: 'insights', label: 'Strategic insights' },
  { id: 'mistakes', label: 'Mistakes & tips' },
  { id: 'payslip', label: 'Read your payslip' },
  { id: 'faq', label: 'FAQ' },
  { id: 'action-plan', label: 'Action plan' },
];

const gbp = (n: number) => `£${n.toLocaleString('en-GB')}`;

interface Row { gross: number; tax: number; ni: number; net: number; month: number }
const ROWS: Row[] = [
  { gross: 15000, tax: 486, ni: 194, net: 14320, month: 1193 },
  { gross: 20000, tax: 1486, ni: 594, net: 17920, month: 1493 },
  { gross: 25000, tax: 2486, ni: 994, net: 21520, month: 1793 },
  { gross: 30000, tax: 3486, ni: 1394, net: 25120, month: 2093 },
  { gross: 35000, tax: 4486, ni: 1794, net: 28720, month: 2393 },
  { gross: 40000, tax: 5486, ni: 2194, net: 32320, month: 2693 },
  { gross: 45000, tax: 6486, ni: 2594, net: 35920, month: 2993 },
  { gross: 50000, tax: 7486, ni: 2994, net: 39520, month: 3293 },
  { gross: 55000, tax: 9432, ni: 3111, net: 42457, month: 3538 },
  { gross: 60000, tax: 11432, ni: 3211, net: 45357, month: 3780 },
  { gross: 65000, tax: 13432, ni: 3311, net: 48257, month: 4021 },
  { gross: 70000, tax: 15432, ni: 3411, net: 51157, month: 4263 },
  { gross: 75000, tax: 17432, ni: 3511, net: 54057, month: 4505 },
  { gross: 80000, tax: 19432, ni: 3611, net: 56957, month: 4746 },
  { gross: 90000, tax: 23432, ni: 3811, net: 62757, month: 5230 },
  { gross: 100000, tax: 27432, ni: 4011, net: 68557, month: 5713 },
  { gross: 125000, tax: 42432, ni: 4511, net: 78057, month: 6505 },
  { gross: 150000, tax: 53703, ni: 5011, net: 91286, month: 7607 },
];

/* ── tiny presentational helpers ─────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">{children}</p>;
}

function H2({ id, kicker, children }: { id: string; kicker?: string; children: React.ReactNode }) {
  return (
    <div className="fa-reveal mt-14 scroll-mt-24" id={id} data-reveal>
      {kicker && <Eyebrow>{kicker}</Eyebrow>}
      <h2 className="mt-2 font-display text-[clamp(24px,3.5vw,32px)] font-extrabold leading-tight tracking-[-0.025em] text-slate-900">{children}</h2>
    </div>
  );
}

function Callout({ tone, icon: Icon, title, children }: { tone: 'blue' | 'amber' | 'rose' | 'emerald'; icon: any; title: string; children: React.ReactNode }) {
  const map = {
    blue: 'border-blue-200 bg-blue-50/70 text-blue-900',
    amber: 'border-amber-200 bg-amber-50/70 text-amber-900',
    rose: 'border-rose-200 bg-rose-50/70 text-rose-900',
    emerald: 'border-emerald-200 bg-emerald-50/70 text-emerald-900',
  } as const;
  const ic = { blue: 'text-blue-600', amber: 'text-amber-600', rose: 'text-rose-600', emerald: 'text-emerald-600' } as const;
  return (
    <div className={`my-6 rounded-2xl border px-5 py-4 ${map[tone]}`}>
      <p className="flex items-center gap-2 text-[14px] font-bold">
        <Icon className={`h-4 w-4 ${ic[tone]}`} /> {title}
      </p>
      <div className="mt-1.5 text-[14.5px] leading-relaxed text-slate-700">{children}</div>
    </div>
  );
}

export default function FlagshipSalary2025({ post, category, catMeta, cta, relatedTools }: { post: BlogPost; category: BlogCategory; catMeta: BlogCategoryMeta; cta: BlogCta; relatedTools: RelatedTool[] }) {
  return (
    <BlogShell
      post={post}
      category={category}
      catMeta={catMeta}
      cta={cta}
      relatedTools={relatedTools}
      breadcrumbLabel="salary after tax"
      heroAurora
      showBottomCta={false}
      title={<>UK Salary After Tax 2025/26: <span className="ink-cs">the complete take-home pay guide.</span></>}
      description={<>Here is exactly what every UK salary is worth once income tax and National Insurance have taken their share. You get the full table from {gbp(15000)} to {gbp(150000)}, the three thresholds that quietly reshape your pay, and the practical moves people use to keep more of what they earn.</>}
      topSlot={
        <>
          <FlagshipStyles />
          <ScrollRevealManager />
          <ReadingPosition minutes={post.readMinutes} />
          <StickyCalcCta />
          {/* Active TOC rail, xl screens only, sits in the left gutter */}
          <div className="fa-toc-wrap">
            <ArticleTocRail items={TOC_ITEMS} />
          </div>
        </>
      }
    >

        {/* EXECUTIVE SUMMARY */}
        <section className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white shadow-cs">
          <div className="border-b border-slate-100 bg-white/60 px-5 py-3.5 sm:px-6">
            <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              <ClipboardList className="h-4 w-4 text-blue-600" /> Executive summary
            </p>
          </div>
          <div className="space-y-3 px-5 py-5 text-[15px] leading-relaxed text-slate-700 sm:px-6">
            <p>Your gross salary is a headline, not the money you actually live on. In 2025/26, two deductions stand between the number on your contract and the cash in your account: <strong>income tax</strong> and <strong>National Insurance (NI)</strong>. How much they take depends almost entirely on <em>where</em> your salary sits against a set of fixed thresholds.</p>
            <p>Those thresholds are frozen until April 2028. So every pay rise quietly pushes a little more of your income into higher bands, a stealth tax increase economists call <strong>fiscal drag</strong>. This guide shows you the real numbers, explains the three break-points that matter most, and lays out exactly what to do at each stage of your career.</p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-slate-200 sm:grid-cols-4">
            {[
              { v: gbp(12570), l: 'Personal allowance' },
              { v: gbp(50270), l: '40% band begins' },
              { v: gbp(100000), l: '60% trap starts' },
              { v: gbp(125140), l: '45% band begins' },
            ].map((s) => (
              <div key={s.l} className="bg-white px-4 py-4">
                <p className="font-display text-[19px] font-extrabold tabular-nums tracking-[-0.02em] text-slate-900">{s.v}</p>
                <p className="mt-0.5 text-[12px] text-slate-500">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* KEY TAKEAWAYS */}
        <H2 id="key-takeaways" kicker="The short version">Key takeaways</H2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            'A £30,000 salary is worth about £25,120 a year, or roughly £2,093 a month, before pension or student loan.',
            'You keep 72p of every extra pound up to £50,270. Above that line you keep only 58p once the 40% band starts.',
            'Between £100,000 and £125,140 your effective rate hits 60%, the harshest marginal rate in the whole system.',
            'Pension contributions are the single most powerful legal way to cut tax and win back lost allowances.',
            'Frozen thresholds until 2028 mean more of your pay is taxed at higher rates with every passing year.',
            'Scotland sets its own bands, so these figures apply to England, Wales and Northern Ireland.',
          ].map((t) => (
            <li key={t} className="flex gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-blue-600" />
              <span className="text-[14px] leading-snug text-slate-700">{t}</span>
            </li>
          ))}
        </ul>

        {/* STAT HIGHLIGHTS */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Wallet, v: '£2,093', l: 'monthly on £30k' },
            { icon: TrendingUp, v: '72p', l: 'kept per £1 (basic)' },
            { icon: AlertTriangle, v: '60%', l: 'rate at £100k, £125k' },
            { icon: ShieldCheck, v: '2028', l: 'thresholds frozen until' },
          ].map((s) => (
            <div key={s.l} className="fa-lift rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 px-4 py-4 shadow-cs">
              <s.icon className="h-5 w-5 text-blue-600" />
              <CountUpStat value={s.v} className="mt-3 block font-display text-2xl font-extrabold tabular-nums tracking-[-0.02em] text-slate-900" />
              <p className="mt-0.5 text-[12px] leading-tight text-slate-500">{s.l}</p>
            </div>
          ))}
        </div>

        {/* INTRO PROSE */}
        <H2 id="how-it-works" kicker="The mechanics">How your salary becomes take-home pay</H2>
        <p className="mt-4 text-[16.5px] leading-relaxed text-slate-700">
          Every ordinary salary in England, Wales and Northern Ireland passes through the same two-stage deduction before it reaches you. Once you understand the order things happen in, and the thresholds each stage uses, the big table below reads like a story rather than a spreadsheet.
        </p>
        <p className="mt-3 text-[16.5px] leading-relaxed text-slate-700">
          <strong>Income tax</strong> is charged in slices, a bit like filling a glass. The first {gbp(12570)} is your personal allowance and is completely tax-free. The next slice up to {gbp(50270)} is taxed at the 20% basic rate. From there to {gbp(125140)} the rate is 40%, and anything above {gbp(125140)} is taxed at 45%. The part people most often get wrong is this: only the money that falls <em>inside</em> each band is taxed at that band&rsquo;s rate. Crossing a threshold never re-taxes your whole salary. You are always better off earning more, even if a slice of it is taxed harder.
        </p>
        <p className="mt-3 text-[16.5px] leading-relaxed text-slate-700">
          <strong>National Insurance</strong> runs alongside income tax on its own set of break-points. In 2025/26 employees pay 8% on earnings between {gbp(12570)} and {gbp(50270)}, then just 2% on everything above. This is the reason your take-home sometimes grows <em>faster</em> per pound than you would expect just above the higher-rate line. The NI rate drops sharply at exactly the point where the income-tax rate jumps, and the two partly cancel out.
        </p>
        <p className="mt-3 text-[16.5px] leading-relaxed text-slate-700">
          There is one last wrinkle worth knowing. The two systems define &ldquo;income&rdquo; slightly differently. Income tax looks at your total taxable income for the whole year, including some benefits in kind and savings interest. Employee NI is worked out per pay period on earnings from work alone. For a steady monthly salary you will never notice the difference. It only shows up when you get a large one-off bonus, or when your pay is irregular and the NI on a single payslip does not quite match the annual table. When the two disagree, trust the annual figures here as your reference point.
        </p>

        {/* PROCESS FLOW */}
        <ProcessFlow />

        {/* THE TABLE */}
        <H2 id="table" kicker="The data">The full take-home pay table</H2>
        <p className="mt-4 text-[16.5px] leading-relaxed text-slate-700">
          The table below assumes a standard tax code (1257L), no pension and no student loan. The <strong>monthly</strong> column is the one that matters day to day, because it is what actually lands in your bank account each payday.
        </p>

        {/* Interactive salary explorer */}
        <SalaryExplorer />

        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 shadow-cs">
          <table className="fa-table w-full min-w-[560px] border-collapse text-[14px]">
            <thead>
              <tr className="bg-slate-900 text-left text-white">
                <th className="px-4 py-3 font-semibold">Gross salary</th>
                <th className="px-4 py-3 text-right font-semibold">Income tax</th>
                <th className="px-4 py-3 text-right font-semibold">NI</th>
                <th className="px-4 py-3 text-right font-semibold">Take-home / yr</th>
                <th className="px-4 py-3 text-right font-semibold">Per month</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {ROWS.map((r, i) => {
                const milestone = r.gross === 50000 || r.gross === 100000;
                return (
                  <tr key={r.gross} className={`${i % 2 ? 'bg-slate-50/60' : 'bg-white'} ${milestone ? 'ring-1 ring-inset ring-blue-200' : ''}`}>
                    <td className="px-4 py-2.5 font-bold text-slate-900">{gbp(r.gross)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{gbp(r.tax)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{gbp(r.ni)}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-900">{gbp(r.net)}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-blue-700">{gbp(r.month)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 font-mono text-[11.5px] text-slate-400">Highlighted rows sit at the two thresholds that bend the curve. Source: HMRC rates &amp; thresholds 2025/26.</p>

        {/* Visual composition of each salary */}
        <CompositionChart />

        {/* THE THREE THRESHOLDS */}
        <H2 id="thresholds" kicker="Where it bends">The three thresholds that change everything</H2>
        <p className="mt-4 text-[16.5px] leading-relaxed text-slate-700">
          Take-home pay does not rise in a straight line. Three break-points decide how much of each extra pound you actually get to keep. The chart below shows the cliff edges at a glance, and the notes after it explain what is happening at each one.
        </p>

        <ThresholdLine />

        <AnimatedRetentionBars />

        <MarginalRateChart />

        <h3 className="mt-8 font-display text-[20px] font-bold tracking-[-0.01em] text-slate-900">£50,270: the higher-rate line</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
          Below this point you keep about 72p of every extra pound. Cross it and the income-tax rate doubles to 40%, while NI drops to 2%, so you now keep just 58p. You can see this in the table: take-home growth visibly slows between {gbp(50000)} and {gbp(55000)}. It is the first moment a pay rise starts to feel smaller than it looks on paper.
        </p>

        <h3 className="mt-6 font-display text-[20px] font-bold tracking-[-0.01em] text-slate-900">£100,000: the 60% trap</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
          For every £2 you earn over {gbp(100000)}, you lose £1 of your personal allowance. That slow clawback creates an <strong>effective 60% marginal rate</strong> all the way up to {gbp(125140)}. Look at how little extra net pay {gbp(125000)} delivers over {gbp(100000)} in the table. That tiny gap is the trap in plain sight. We break it down fully in our <Link href="/blog/how-much-tax-on-100000-salary-uk-2025-26" className="font-semibold text-blue-700 hover:underline">£100k tax trap guide</Link>.
        </p>

        <h3 className="mt-6 font-display text-[20px] font-bold tracking-[-0.01em] text-slate-900">£125,140: the additional rate</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
          Your personal allowance is now completely gone, and the 45% rate applies to everything above this point. Oddly, your marginal rate actually <em>falls</em> here, from 60% back to about 47%. It feels backwards, but it makes sense once you realise there is no allowance left to lose, so the clawback that caused the 60% band has nothing left to bite on.
        </p>

        <Callout tone="amber" icon={AlertTriangle} title="A pay rise isn't always what it looks like">
          A raise that pushes you past {gbp(50270)} or {gbp(100000)} is taxed far harder on the part above the line. Always look at the <em>extra take-home</em> you will actually receive, not the headline rise. The <Link href="/take-home-pay" className="font-semibold text-amber-800 underline">take-home calculator</Link> shows you the before-and-after in seconds.
        </Callout>

        {/* BAND BREAKDOWN TABLE */}
        <H2 id="bands" kicker="Reference">Income tax &amp; NI bands at a glance</H2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 shadow-cs">
          <table className="w-full min-w-[560px] border-collapse text-[14px]">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="px-4 py-3 font-semibold text-slate-700">Band</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Income range</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Income tax</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">NI</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">You keep</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Personal allowance', `£0, ${gbp(12570)}`, '0%', '0%', '100p'],
                ['Basic rate', `${gbp(12570)}, ${gbp(50270)}`, '20%', '8%', '72p'],
                ['Higher rate', `${gbp(50270)}, ${gbp(100000)}`, '40%', '2%', '58p'],
                ['Allowance taper', `${gbp(100000)}, ${gbp(125140)}`, '60%*', '2%', '38p'],
                ['Additional rate', `${gbp(125140)}+`, '45%', '2%', '53p'],
              ].map((r) => (
                <tr key={r[0]} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 font-semibold text-slate-900">{r[0]}</td>
                  <td className="px-4 py-2.5 text-slate-600 tabular-nums">{r[1]}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-600">{r[2]}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-600">{r[3]}</td>
                  <td className="px-4 py-2.5 text-right font-bold tabular-nums text-blue-700">{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 font-mono text-[11.5px] text-slate-400">*Effective rate created by personal-allowance withdrawal, not a statutory band.</p>

        {/* WHAT THE BASELINE LEAVES OUT */}
        <H2 id="omits" kicker="The fine print">What the baseline table leaves out</H2>
        <p className="mt-4 text-[16.5px] leading-relaxed text-slate-700">
          The figures above are a deliberately clean baseline: standard tax code, no pension, no student loan, no benefits in kind. Real payslips are messier than that. Three things move most people&rsquo;s actual take-home away from the table, and for some they add up to hundreds of pounds a month.
        </p>

        <h3 className="mt-7 font-display text-[20px] font-bold tracking-[-0.01em] text-slate-900">1. Pension contributions</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
          Money you pay into a workplace pension before tax lowers your take-home <em>today</em>, but it is the most efficient way to keep more of a higher salary over your lifetime. Under auto-enrolment the minimum is 8% of qualifying earnings (5% from you, 3% from your employer), though many employers match more if you ask. Because the contributions come out before income tax, and under salary sacrifice before NI too, a basic-rate taxpayer effectively pays just 80p for every £1 saved, and a higher-rate taxpayer pays 60p. Inside the {gbp(100000)} to {gbp(125140)} band, the effective cost can drop below 40p per £1. There are few deals like it anywhere in personal finance.
        </p>

        <h3 className="mt-6 font-display text-[20px] font-bold tracking-[-0.01em] text-slate-900">2. Student loan repayments</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
          Student loan repayments are a fixed percentage of any income above a plan-specific threshold. Technically they are not a tax, but on your payslip they behave exactly like one. Which plan you are on depends on where and when you studied.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 shadow-cs">
          <table className="w-full min-w-[560px] border-collapse text-[14px]">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="px-4 py-3 font-semibold text-slate-700">Plan</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Who&rsquo;s on it</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Threshold</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Rate</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {[
                ['Plan 1', 'Pre-2012 (Eng/Wales), NI', gbp(26065), '9%'],
                ['Plan 2', '2012 to 2023 (Eng/Wales)', gbp(28470), '9%'],
                ['Plan 4', 'Scottish borrowers', gbp(32745), '9%'],
                ['Plan 5', 'From Aug 2023 (England)', gbp(25000), '9%'],
                ['Postgraduate', "Master's / PhD loans", gbp(21000), '6%'],
              ].map((r) => (
                <tr key={r[0]} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 font-semibold text-slate-900">{r[0]}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r[1]}</td>
                  <td className="px-4 py-2.5 text-right text-slate-600">{r[2]}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-blue-700">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
          A Plan 2 borrower earning {gbp(40000)} repays 9% of the {gbp(11530)} that sits above {gbp(28470)}. That is roughly {gbp(1038)} a year, or about {gbp(86)} a month off the baseline figure. Postgraduate loan repayments stack <em>on top</em> of all this, so someone with both can lose 15% of every pound above the higher threshold.
        </p>

        <h3 className="mt-6 font-display text-[20px] font-bold tracking-[-0.01em] text-slate-900">3. You live in Scotland</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
          Income tax is devolved, and Scotland runs <strong>six</strong> bands rather than three. In 2025/26 there is a 19% starter rate and a 21% intermediate rate at the lower end, then a 42% higher rate that begins around {gbp(43663)}, well before the {gbp(50270)} line used elsewhere, plus a 45% advanced rate and a 48% top rate. In practice, mid-to-high earners in Scotland keep slightly less than this table shows, while the lowest earners keep a little more. NI is not devolved, so that part is identical wherever you live in the UK.
        </p>

        <Callout tone="blue" icon={Lightbulb} title="Get your exact number">
          The only way to capture your tax code, pension, student-loan plan and region all at once is to model them together. The <Link href="/take-home-pay" className="font-semibold text-blue-800 underline">take-home pay calculator</Link> does exactly that and shows your monthly figure to the pound.
        </Callout>

        {/* IS THIS A GOOD SALARY */}
        <H2 id="good-salary" kicker="Context">Is your salary actually good? It depends where you live</H2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          Take-home pay only tells you half the story. The other half is what that money has to cover. A {gbp(35000)} salary feels very different in Newcastle than it does in central London, where rent alone can swallow more than half of your net pay. Before you judge a number as good or bad, set it against the place you will actually spend it.
        </p>
        <p className="mt-3 text-[16px] leading-relaxed text-slate-700">
          For reference, the median full-time salary in the UK is around {gbp(37430)} a year. Anything above that puts you in the top half of earners. But median pay varies sharply by region, and so does the cost of a roof over your head. The quick guide below shows roughly where a single salary sits in each area, before you factor in housing.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { area: 'London', tag: 'High cost', median: '£44,370', note: 'Highest pay in the UK, but rent and travel erase much of the premium.', tone: 'rose' },
            { area: 'South East', tag: 'Above average', median: '£38,500', note: 'Strong salaries with commuter-belt housing costs to match.', tone: 'amber' },
            { area: 'North & Midlands', tag: 'Goes further', median: '£33,000', note: 'Lower headline pay, but your take-home stretches noticeably further.', tone: 'emerald' },
          ].map((r) => {
            const ring = r.tone === 'rose' ? 'border-rose-200' : r.tone === 'amber' ? 'border-amber-200' : 'border-emerald-200';
            const chip = r.tone === 'rose' ? 'bg-rose-100 text-rose-700' : r.tone === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';
            return (
              <div key={r.area} className={`rounded-2xl border ${ring} bg-white p-5 shadow-cs`}>
                <div className="flex items-center justify-between">
                  <p className="font-display text-[16px] font-bold text-slate-900">{r.area}</p>
                  <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${chip}`}>{r.tag}</span>
                </div>
                <p className="mt-3 font-display text-[24px] font-extrabold tabular-nums tracking-[-0.02em] text-slate-900">{r.median}</p>
                <p className="text-[11.5px] text-slate-500">median full-time salary</p>
                <p className="mt-3 text-[13px] leading-relaxed text-slate-600">{r.note}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          The practical takeaway is simple. Do not chase a bigger headline number in a city where the cost of living eats the difference. A {gbp(40000)} job in Leeds can leave you with more spare cash at the end of the month than a {gbp(50000)} job in London once rent, transport and the higher tax band are accounted for. Always think in terms of money left after the essentials, not money before them.
        </p>

        {/* NEW TO THE UK */}
        <H2 id="new-to-uk" kicker="For new arrivals">New to the UK? How take-home pay affects your visa</H2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          If you have moved to the UK on a work visa, take-home pay matters for more than just budgeting. Several immigration routes set a minimum <em>gross</em> salary you must be paid, and it is easy to confuse that figure with the money you actually receive. The salary thresholds in the rules are always before tax, so your bank balance will look smaller than the number on your visa letter.
        </p>
        <p className="mt-3 text-[16px] leading-relaxed text-slate-700">
          A Skilled Worker visa, for example, generally requires a gross salary at or above a set floor that the Home Office updates each year, alongside the going rate for your specific job. What you take home after tax and NI has no bearing on whether you meet the rule, but it has everything to do with whether the job is genuinely affordable once you are here. Many new arrivals are surprised that a salary which clears the visa threshold still feels tight after London rent and the upfront cost of settling in.
        </p>
        <Callout tone="blue" icon={ShieldCheck} title="Visa salary vs take-home: two different numbers">
          Visa salary rules use your <strong>gross</strong> pay. This table shows your <strong>net</strong> pay. Use the gross figure to check you meet the immigration threshold, and the net figure to plan your real monthly budget. If you are weighing up a job offer, run it through our <Link href="/skilled-worker-points-check" className="font-semibold text-blue-800 underline">Skilled Worker points check</Link> and the <Link href="/take-home-pay" className="font-semibold text-blue-800 underline">take-home calculator</Link> together.
        </Callout>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          One more point that catches people out: most visa holders have &ldquo;no recourse to public funds&rdquo; so the benefits and tax credits that lift some UK households are not available to you. That makes your take-home pay your entire safety net in the early years, which is all the more reason to know your real monthly number before you accept an offer or sign a tenancy.
        </p>

        {/* EMPLOYEE VS SELF-EMPLOYED */}
        <H2 id="employed-vs-self" kicker="Two routes">Employee or self-employed? The same salary pays differently</H2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          The table on this page is for employees paid through PAYE. If you work for yourself, the maths changes. Self-employed people pay a different class of National Insurance, file their own tax through Self Assessment, and can deduct legitimate business expenses before tax is calculated. The result is that {gbp(40000)} of employment income and {gbp(40000)} of self-employed profit do not leave you with the same amount in the bank.
        </p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 shadow-cs">
          <table className="w-full min-w-[560px] border-collapse text-[14px]">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="px-4 py-3 font-semibold text-slate-700">Feature</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Employee (PAYE)</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Self-employed</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['How tax is paid', 'Deducted automatically each payday', 'Self Assessment, twice a year'],
                ['National Insurance', 'Class 1 (8% then 2%)', 'Class 4 (6% then 2%) + flat Class 2 if profits are high enough'],
                ['Expenses', 'Very limited', 'Genuine business costs reduce taxable profit'],
                ['Pension', 'Auto-enrolment with employer top-up', 'You arrange and fund it yourself'],
                ['Sick & holiday pay', 'Paid by employer', 'None; you cover your own gaps'],
                ['Income stability', 'Predictable monthly pay', 'Variable; budget for lean months'],
              ].map((r) => (
                <tr key={r[0]} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 font-semibold text-slate-900">{r[0]}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r[1]}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          Self-employment can leave more in your pocket on the same headline figure, mainly through expenses and slightly lower NI, but it strips away the safety nets employees take for granted. There is no holiday pay, no sick pay and no employer pension contribution. If you are choosing between a contract and a permanent role, compare the <em>net of everything</em>, including the value of those benefits, not just the day rate against the salary.
        </p>

        {/* BONUSES & IRREGULAR PAY */}
        <H2 id="bonuses" kicker="Lumpy pay">Why a bonus looks like it gets taxed to death</H2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          Almost everyone has had the same shock: a {gbp(5000)} bonus lands and barely half of it reaches your account. It feels like punishment for doing well, but nothing unfair is happening. The PAYE system treats the month you receive a bonus as if you earned that much <em>every</em> month, so it briefly taxes you as though your annual salary were far higher than it really is.
        </p>
        <p className="mt-3 text-[16px] leading-relaxed text-slate-700">
          The good news is that it usually corrects itself. Over the following months your tax code catches up, and any over-deduction is refunded automatically through your pay. By the end of the tax year you will have paid exactly the right amount on the bonus, no more. The only time to act is if the over-deduction is large and you need the cash sooner, in which case your HMRC personal tax account can sometimes speed up the adjustment.
        </p>
        <Callout tone="emerald" icon={Lightbulb} title="The smartest thing to do with a bonus">
          If your bonus would push you over {gbp(50270)} or {gbp(100000)}, paying some or all of it straight into your pension through salary sacrifice can sidestep the higher rate entirely. Near {gbp(100000)}, that move can turn a heavily taxed bonus into one of the best-value pension contributions you will ever make.
        </Callout>

        {/* COUPLES & HOUSEHOLDS */}
        <H2 id="households" kicker="Two incomes">Take-home pay for couples and households</H2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          The UK taxes individuals, not households, which has a few quirks worth knowing if you share your finances with a partner. Two people each earning {gbp(45000)} take home far more between them than one person earning {gbp(90000)}, even though the household total is identical. That is because each partner gets their own personal allowance and their own basic-rate band, and neither one crosses into the higher-rate or 60% zones.
        </p>
        <p className="mt-3 text-[16px] leading-relaxed text-slate-700">
          There are a couple of small levers couples can pull. <strong>Marriage Allowance</strong> lets a non-taxpayer transfer {gbp(1260)} of their personal allowance to a basic-rate partner, worth up to {gbp(252)} a year. And where one partner earns over {gbp(60000)}, the High Income Child Benefit Charge starts to claw back Child Benefit, so balancing income between partners, where that is genuinely possible, can keep more of it. None of these are huge sums on their own, but they are easy wins that go unclaimed every year.
        </p>
        <p className="mt-3 text-[16px] leading-relaxed text-slate-700">
          The bigger picture for households is the {gbp(100000)} line. Beyond the 60% tax band, crossing it also removes access to tax-free childcare and the 15 to 30 free childcare hours, which for a family with young children can be worth thousands of pounds. For a working parent, a raise from {gbp(99000)} to {gbp(105000)} can genuinely leave the household worse off once lost childcare support is counted. It is one of the few situations where turning down money, or redirecting it into a pension, is the rational choice.
        </p>

        {/* SALARY MILESTONES */}
        <H2 id="milestones" kicker="By the number">Salary milestones, decoded</H2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          A handful of salary figures get searched far more than any others, because they sit at meaningful life or tax moments. Here is what each one really means once you look past the headline.
        </p>
        <div className="mt-5 space-y-4">
          {[
            ['£30,000', 'Close to the UK median full-time salary. Comfortably basic-rate: you keep about 72p of every extra pound, so career progression here is efficient and predictable.'],
            ['£50,000', 'The last rung before the 40% band, and until recently the High-Income Child Benefit Charge too. A classic point to start pension sacrifice and stay basic-rate.'],
            ['£60,000', 'Firmly higher-rate. Your first real taste of 40% tax. Worth reviewing benefits in kind (company car, medical insurance) as they are taxed at your marginal rate.'],
            ['£100,000', 'The single most important number in UK personal tax. Crossing it triggers the 60% effective band and the loss of free childcare hours for working parents, often a bigger hit than the tax itself.'],
          ].map(([k, d]) => (
            <div key={k} className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-baseline sm:gap-5">
              <span className="font-display text-[22px] font-extrabold tabular-nums tracking-[-0.02em] text-blue-700 sm:w-28 sm:flex-none">{k}</span>
              <span className="text-[14.5px] leading-relaxed text-slate-600">{d}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          For full salary-by-salary breakdowns, see <Link href="/blog/how-much-tax-on-60000-salary-uk-2025-26" className="font-semibold text-blue-700 hover:underline">£60,000 after tax</Link> and <Link href="/blog/how-much-tax-on-100000-salary-uk-2025-26" className="font-semibold text-blue-700 hover:underline">the £100,000 trap</Link>.
        </p>

        {/* HOW THE UK COMPARES */}
        <H2 id="international" kicker="Zoom out">How UK take-home pay compares abroad</H2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          If you are deciding whether to move to the UK, or comparing an offer here against one elsewhere, it helps to see how the UK sits among comparable countries. On the whole, the UK is a middling-tax country. You keep more of your salary than you would in most of Western Europe, but less than in lower-tax economies like the United States or the Gulf states, where there is often no income tax at all.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { c: 'United Kingdom', keep: '~72%', note: 'On a typical £40k salary, basic rate plus 8% NI.' },
            { c: 'Germany & France', keep: '~60 to 65%', note: 'Higher social contributions take a larger slice.' },
            { c: 'UAE / Gulf', keep: '~100%', note: 'No personal income tax, though living costs vary.' },
          ].map((r) => (
            <div key={r.c} className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 p-5 shadow-cs">
              <p className="font-display text-[15px] font-bold text-slate-900">{r.c}</p>
              <p className="mt-2 font-display text-[26px] font-extrabold tabular-nums tracking-[-0.02em] text-blue-700">{r.keep}</p>
              <p className="text-[11.5px] text-slate-500">of a mid salary kept</p>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-600">{r.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          These are rough comparisons, and headline tax is only part of the picture. The UK bundles healthcare into NI through the NHS, so a lower-tax country with private medical costs can end up more expensive in practice. When you weigh up a move, compare what is left after tax <em>and</em> after the essentials that your home country might provide for free.
        </p>

        {/* STRATEGIC INSIGHTS */}
        <H2 id="insights" kicker="Best practice">Strategic insights for 2025/26</H2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          Beyond the headline thresholds, a few simple habits separate the people who quietly optimise their pay from those who simply receive whatever lands. None of them require an accountant.
        </p>
        <ul className="mt-5 space-y-3">
          {[
            ['Treat marginal rate as the real number', 'Your average tax rate is comforting but useless for decisions. What matters when you take on a bonus, a side income or a pension contribution is the rate on the next pound, your marginal rate. Anchor every choice to that.'],
            ['Use the tax year, not the calendar year', 'Allowances reset every 6 April. Pension top-ups, ISA contributions and Gift Aid all have year-end deadlines. Plan in March, not December.'],
            ['Front-load pensions in trap years', 'If a bonus pushes you into the 60% band, redirecting it into a pension is close to a 60% government top-up. Few investments beat that instantly guaranteed return.'],
            ['Keep evidence for HMRC', 'Higher-rate relief on personal pension contributions and Gift Aid often has to be claimed through Self Assessment. Keep your records, because this is money HMRC will not refund automatically.'],
          ].map(([t, d]) => (
            <li key={t} className="flex gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
              <TrendingUp className="mt-0.5 h-5 w-5 flex-none text-blue-600" />
              <div>
                <p className="text-[14.5px] font-bold text-slate-900">{t}</p>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-slate-600">{d}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* WORKED EXAMPLES */}
        <H2 id="examples" kicker="In practice">Three worked examples</H2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { name: 'Priya', role: 'Graduate, £30,000', net: gbp(2093), note: 'Comfortably basic-rate. Every extra £1,000 of salary adds about £720 take-home.' },
            { name: 'Marcus', role: 'Manager, £55,000', net: gbp(3538), note: 'Just into higher rate. Pension salary-sacrifice back under £50,270 restores 72p-per-£1.' },
            { name: 'Aisha', role: 'Director, £110,000', net: gbp(6000), note: 'Inside the 60% trap. £10k into pension reclaims allowance and costs only ~£4k net.' },
          ].map((p) => (
            <div key={p.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-cs">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 font-display text-[13px] font-bold text-blue-700">{p.name[0]}</span>
                <div>
                  <p className="text-[13.5px] font-bold text-slate-900">{p.name}</p>
                  <p className="text-[11.5px] text-slate-500">{p.role}</p>
                </div>
              </div>
              <p className="mt-3 font-display text-[22px] font-extrabold tabular-nums text-slate-900">{p.net}<span className="text-[13px] font-semibold text-slate-400">/mo</span></p>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{p.note}</p>
            </div>
          ))}
        </div>

        {/* DECISION MATRIX */}
        <H2 id="decision" kicker="Strategy">Decision matrix: keeping more of your salary</H2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          The right move depends entirely on where you sit. This matrix maps the most effective, fully legal levers against the effort involved and who they suit best, so you can find yours at a glance.
        </p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 shadow-cs">
          <table className="w-full min-w-[600px] border-collapse text-[14px]">
            <thead>
              <tr className="bg-slate-900 text-left text-white">
                <th className="px-4 py-3 font-semibold">Strategy</th>
                <th className="px-4 py-3 font-semibold">Best for</th>
                <th className="px-4 py-3 font-semibold">Effort</th>
                <th className="px-4 py-3 font-semibold">Impact</th>
                <th className="px-4 py-3 text-center font-semibold">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Pension salary sacrifice', 'Anyone near a threshold', 'Low', 'Very high', true],
                ['Marriage Allowance transfer', 'One partner under PA', 'Low', 'Low (£252)', true],
                ['Gift Aid donations', 'Higher-rate givers', 'Low', 'Medium', true],
                ['EV via salary sacrifice', '£50k, £125k earners', 'Medium', 'High', true],
                ['Lump-sum bonus, unplanned', 'Nobody', 'Low', 'Negative', false],
              ].map((r) => (
                <tr key={r[0] as string} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 font-semibold text-slate-900">{r[0]}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r[1]}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r[2]}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r[3]}</td>
                  <td className="px-4 py-2.5 text-center">
                    {r[4] ? <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-600" /> : <XCircle className="mx-auto h-5 w-5 text-rose-500" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DECISION TREE */}
        <PensionDecisionTree />

        {/* PROS & CONS */}
        <H2 id="pros-cons" kicker="The trade-off">Pension salary sacrifice: pros &amp; cons</H2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
            <p className="flex items-center gap-2 text-[14px] font-bold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> Pros</p>
            <ul className="mt-3 space-y-2 text-[14px] text-slate-700">
              {['Cuts income tax and NI in one move', 'Reclaims personal allowance in the 60% zone', 'Employer often passes on their NI saving', 'Builds retirement wealth automatically'].map((t) => (
                <li key={t} className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-emerald-500" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
            <p className="flex items-center gap-2 text-[14px] font-bold text-rose-800"><XCircle className="h-4 w-4" /> Cons</p>
            <ul className="mt-3 space-y-2 text-[14px] text-slate-700">
              {['Money is locked until age 55 (57 from 2028)', 'Lowers the salary used for mortgages', 'Annual allowance caps at £60,000', 'Can reduce some statutory pay calculations'].map((t) => (
                <li key={t} className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-rose-400" />{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* COMMON MISTAKES + EXPERT TIPS */}
        <H2 id="mistakes" kicker="Avoid these">Common mistakes &amp; expert tips</H2>
        <div className="mt-5 space-y-3">
          {[
            ['Mistake', 'Assuming a threshold re-taxes your whole salary.', 'Only the slice inside each band is taxed at that rate. Crossing £50,270 never makes you worse off overall.'],
            ['Mistake', 'Ignoring an emergency tax code after a job change.', 'A wrong code (e.g. BR or 0T) can over-deduct for months. Check it on your payslip and via your HMRC app.'],
            ['Tip', 'Time large bonuses across two tax years where possible.', 'Splitting a bonus can keep you under £100,000 in each year and dodge the 60% band entirely.'],
            ['Tip', 'Use the £2-for-£1 maths to your advantage.', 'Near £100k, every £1,000 sacrificed into a pension can effectively cost you as little as £400 net.'],
          ].map(([k, t, d], i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
              <span className={`mt-0.5 flex-none ${k === 'Tip' ? 'text-blue-600' : 'text-rose-500'}`}>
                {k === 'Tip' ? <Lightbulb className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
              </span>
              <div>
                <p className="text-[14.5px] font-bold text-slate-900">{t}</p>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-slate-600">{d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FUTURE TRENDS */}
        <H2 id="future" kicker="Looking ahead">Future trends: fiscal drag to 2028</H2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          The personal allowance and the higher-rate threshold have been frozen since 2021, and they are set to stay frozen until April 2028. As wages rise with inflation, more of everyone&rsquo;s income gets dragged into higher bands without a single rate ever changing. It is a stealth tax rise, and the Office for Budget Responsibility expects it to pull millions more workers into the 40% band by 2028.
        </p>
        <Callout tone="blue" icon={Target} title="What this means for you">
          Build the habit now: review your salary against the {gbp(50270)} and {gbp(100000)} lines every April, and treat pension sacrifice as the default tool for staying the right side of them. Small annual adjustments beat one painful correction later.
        </Callout>

        {/* READ YOUR PAYSLIP */}
        <H2 id="payslip" kicker="Practical">How to read your payslip line by line</H2>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          The table tells you what you <em>should</em> take home. Your payslip tells you what you <em>actually</em> did. Reconciling the two takes about two minutes a month, and it catches the errors that quietly cost people the most: wrong tax codes, a missed pension match, or emergency-rate deductions left running after a job change.
        </p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 shadow-cs">
          <table className="w-full min-w-[560px] border-collapse text-[14px]">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="px-4 py-3 font-semibold text-slate-700">Payslip line</th>
                <th className="px-4 py-3 font-semibold text-slate-700">What it means</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Watch for</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Tax code', 'How much tax-free allowance you get', 'Should read 1257L for most. BR, 0T or D0 means over-taxing.'],
                ['Gross pay', 'Earnings before any deduction', 'Should match contract ÷ 12, plus any bonus.'],
                ['PAYE / income tax', 'Tax collected at source by HMRC', 'Spikes after a raise can mean a code lag; it self-corrects.'],
                ['National Insurance', 'Class 1 employee NI', '8% band then 2%; never on the first £12,570.'],
                ['Pension', 'Your contribution (and sometimes employer)', 'Confirm the employer match is actually applied.'],
                ['Net pay', 'What hits your bank', 'Compare against this guide&rsquo;s monthly column.'],
              ].map((r) => (
                <tr key={r[0]} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 font-semibold text-slate-900">{r[0]}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r[1]}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          If your net pay is clearly lower than this table suggests and your tax code looks wrong, contact HMRC through the official app or your personal tax account. Overpaid tax within the current tax year is usually put right automatically through an updated code. For earlier years, you can claim the refund directly, and it is often money that would otherwise sit unclaimed.
        </p>

        {/* GLOSSARY */}
        <H2 id="glossary" kicker="Reference">Key terms in 30 seconds</H2>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ['Personal allowance', 'The slice of income taxed at 0%, which is £12,570 for most people in 2025/26.'],
            ['Marginal rate', 'The tax + NI rate on your next pound earned, not your average.'],
            ['Fiscal drag', 'Frozen thresholds pulling more income into higher bands as wages rise.'],
            ['Salary sacrifice', 'Swapping gross salary for a benefit (usually pension) before tax and NI.'],
            ['PAYE', 'Pay As You Earn: tax collected by your employer before you&rsquo;re paid.'],
            ['Tax code', 'The HMRC code that tells your employer how much to deduct.'],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <dt className="text-[13.5px] font-bold text-slate-900">{t}</dt>
              <dd className="mt-0.5 text-[13px] leading-relaxed text-slate-600">{d}</dd>
            </div>
          ))}
        </dl>

        {/* FAQ */}
        <H2 id="faq" kicker="Questions">Frequently asked questions</H2>
        <div className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-cs">
          {[
            ['How much is £30,000 a year after tax?', `About ${gbp(25120)} a year, or roughly ${gbp(2093)} a month in 2025/26, before any pension or student loan.`],
            ['How much is £40,000 after tax?', `About ${gbp(32320)} a year, or around ${gbp(2693)} a month, before pension or student loan deductions.`],
            ['How much do you take home on £50,000?', `About ${gbp(39520)} a year (${gbp(3293)} a month). £50,000 sits just below the £50,270 higher-rate threshold, so almost all of it is basic-rate.`],
            ['How much is £100,000 after tax?', `About ${gbp(68557)} a year, or ${gbp(5713)} a month. Income just above £100,000 is taxed especially hard because the personal allowance is withdrawn.`],
            ['Does this table apply to Scotland?', 'No. Scotland sets its own income tax bands, so Scottish take-home pay differs, particularly at higher salaries. These figures are for England, Wales and Northern Ireland.'],
            ['Do these figures include pension or student loan?', 'No, the table is a clean baseline. Both reduce take-home further. Run your exact situation through the take-home pay calculator for a precise figure.'],
          ].map(([q, a]) => (
            <details key={q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-slate-900">
                {q}
                <ChevronRight className="h-4 w-4 flex-none text-slate-400 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-slate-600">{a}</p>
            </details>
          ))}
        </div>

        {/* ACTION PLAN */}
        <H2 id="action-plan" kicker="Do this next">Your 5-step action plan</H2>
        <ol className="mt-5 space-y-3">
          {[
            ['Find your number', 'Locate your gross salary in the table to get your real monthly take-home baseline.'],
            ['Check your tax code', 'Confirm it reads 1257L on your payslip; query anything else with HMRC immediately.'],
            ['Map your thresholds', 'Note how far you are from £50,270 and £100,000. These are your planning lines.'],
            ['Model a pension sacrifice', 'Use the take-home calculator to see the before/after of contributing 5 to 15% pre-tax.'],
            ['Re-check every April', 'Frozen thresholds mean a yearly review keeps you ahead of fiscal drag.'],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-blue-600 font-mono text-[13px] font-bold text-white">{i + 1}</span>
              <div>
                <p className="text-[14.5px] font-bold text-slate-900">{t}</p>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-slate-600">{d}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* FINAL VERDICT */}
        <div className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 p-7 text-white shadow-cs-lg sm:p-9">
          <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-blue-300"><Sparkles className="h-4 w-4" /> Final verdict</p>
          <h2 className="mt-3 font-display text-[clamp(22px,3.2vw,30px)] font-extrabold leading-tight tracking-[-0.02em]">
            Your salary is fixed. What you keep isn&rsquo;t.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-300">
            The 2025/26 system quietly rewards people who understand three numbers, {gbp(50270)}, {gbp(100000)} and {gbp(125140)}, and just as quietly penalises those who do not. You cannot change the rates, but you can change where your taxable income lands. For most people sitting near a threshold, a modest pension contribution is the single highest-return financial decision available, full stop.
          </p>
          <Link href="/take-home-pay" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-[14px] font-bold text-slate-900 transition-transform hover:-translate-y-0.5">
            <Calculator className="h-4 w-4" /> Calculate your exact take-home <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-10 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12.5px] leading-relaxed text-slate-500">
          Figures are 2025/26 estimates for England, Wales and Northern Ireland and assume no pension or student loan. Treat them as a guide and check your own payslip and tax code, or run your exact salary through the calculator. This is information, not financial advice.
        </p>
    </BlogShell>
  );
}

/* ── Process flow, gross to net ─────────────────────────── */
function ProcessFlow() {
  const steps = [
    { n: 1, label: 'Gross salary', detail: 'Your headline contract figure', tag: null },
    { n: 2, label: 'Personal allowance', detail: 'First £12,570 is tax-free', tag: '0% tax' },
    { n: 3, label: 'Income tax', detail: 'Charged in bands on the rest', tag: '20% → 40% → 45%' },
    { n: 4, label: 'National Insurance', detail: 'Employee Class 1, runs in parallel', tag: '8% then 2%' },
  ];
  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white shadow-cs">
      <figcaption className="flex items-center gap-2 border-b border-slate-100 bg-white/60 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
        <TrendingUp className="h-4 w-4 text-blue-600" /> Gross to net: the journey of every pound
      </figcaption>
      <ol className="px-5 py-6 sm:px-6">
        {steps.map((s, i) => (
          <li key={s.n} className="relative flex gap-4 pb-6 last:pb-0">
            {/* connector line */}
            {i < steps.length - 1 && (
              <span aria-hidden className="absolute left-[15px] top-9 h-[calc(100%-1.5rem)] w-px bg-slate-200" />
            )}
            <span className="relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-blue-600 font-mono text-[13px] font-bold text-white shadow-sm">{s.n}</span>
            <div className="flex flex-1 flex-wrap items-center justify-between gap-2 pt-0.5">
              <div>
                <p className="text-[15px] font-bold text-slate-900">{s.label}</p>
                <p className="text-[13px] text-slate-500">{s.detail}</p>
              </div>
              {s.tag && (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 font-mono text-[11px] font-bold text-blue-700">{s.tag}</span>
              )}
            </div>
          </li>
        ))}
      </ol>
      <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-900 px-5 py-4 sm:px-6">
        <Wallet className="h-5 w-5 flex-none text-blue-300" />
        <p className="text-[14px] font-bold text-white">Net / take-home pay</p>
        <ArrowRight className="h-4 w-4 text-slate-500" />
        <span className="font-mono text-[12px] font-semibold text-slate-300">paid monthly</span>
      </div>
    </figure>
  );
}

/* ── Pension decision tree ───────────────────────────────── */
function PensionDecisionTree() {
  const node = 'rounded-xl border bg-white px-4 py-3 text-[13.5px] leading-snug shadow-sm';
  const Branch = ({ label, tone }: { label: string; tone: 'yes' | 'no' }) => (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider ${tone === 'yes' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
      {label}
    </span>
  );
  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white shadow-cs">
      <figcaption className="flex items-center gap-2 border-b border-slate-100 bg-white/60 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
        <Target className="h-4 w-4 text-blue-600" /> Should you sacrifice into a pension?
      </figcaption>
      <div className="space-y-4 px-5 py-6 sm:px-6">
        {/* root question */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3 text-center text-[14.5px] font-bold text-slate-900">
          Are you within £5k of £50,270 or £100,000?
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* YES branch */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
            <Branch label="Yes" tone="yes" />
            <div className={`mt-3 ${node} border-slate-200`}>
              <p className="font-semibold text-slate-900">Sacrifice enough to drop a band</p>
            </div>
            <div className="my-2 flex justify-center"><ChevronDown className="h-4 w-4 text-slate-400" /></div>
            <div className="rounded-xl border border-emerald-300 bg-white px-4 py-3 text-center">
              <p className="font-display text-[16px] font-extrabold text-emerald-700">Reclaim 72p, 60p per £1</p>
              <p className="text-[12px] text-slate-500">The highest-return move available</p>
            </div>
          </div>

          {/* NO branch */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <Branch label="No" tone="no" />
            <div className={`mt-3 ${node} border-slate-200`}>
              <p className="font-semibold text-slate-900">Is your pension below 15% of pay?</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-center">
                <Branch label="Yes" tone="yes" />
                <p className="mt-2 text-[13px] font-semibold text-slate-700">Top up to 15%</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-center">
                <Branch label="No" tone="no" />
                <p className="mt-2 text-[13px] font-semibold text-slate-700">Maintain; review yearly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ── #10 Threshold number line ───────────────────────────── */
function ThresholdLine() {
  const marks = [
    { x: 8, v: '£12,570', l: 'Allowance', tone: '#10b981' },
    { x: 33, v: '£50,270', l: '40% starts', tone: '#6366f1' },
    { x: 64, v: '£100,000', l: '60% trap', tone: '#e11d48' },
    { x: 82, v: '£125,140', l: '45% starts', tone: '#7c3aed' },
  ];
  return (
    <figure className="fa-reveal my-7 rounded-2xl border border-slate-200 bg-white px-5 pb-10 pt-6 shadow-cs sm:px-8" data-reveal>
      <figcaption className="mb-8 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">The thresholds on one line</figcaption>
      <div className="relative h-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-blue-400 to-rose-500">
        {marks.map((m) => (
          <div key={m.v} className="absolute -top-1 flex -translate-x-1/2 flex-col items-center" style={{ left: `${m.x}%` }}>
            <span className="h-4 w-4 rounded-full border-2 border-white shadow" style={{ background: m.tone }} />
            <span className="mt-2 font-display text-[13px] font-extrabold tabular-nums text-slate-900">{m.v}</span>
            <span className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">{m.l}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

/* ── Scoped animation styles (gated behind reduced-motion) ─ */
function FlagshipStyles() {
  return (
    <style>{`
      /* #2 scroll reveal */
      .fa-reveal { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s cubic-bezier(.22,1.36,1); }
      .fa-reveal.fa-in { opacity: 1; transform: none; }

      /* #11 hover lift */
      .fa-lift { transition: transform .2s ease, box-shadow .2s ease; }
      .fa-lift:hover { transform: translateY(-3px); }

      /* #7 table row hover */
      .fa-table tbody tr { transition: background-color .15s ease; }
      .fa-table tbody tr:hover { background-color: #eff6ff !important; }

      /* #13 hero aurora */
      .fa-aurora::before.fa-aurora::after {
        content: ""; position: absolute; border-radius: 9999px; filter: blur(60px); opacity: .5;
      }
      .fa-aurora::before { width: 420px; height: 420px; top: -160px; right: -80px;
        background: radial-gradient(circle, rgba(59,130,246.35), transparent 70%); animation: fa-drift 18s ease-in-out infinite; }
      .fa-aurora::after { width: 360px; height: 360px; top: -120px; left: -60px;
        background: radial-gradient(circle, rgba(99,102,241.28), transparent 70%); animation: fa-drift 22s ease-in-out infinite reverse; }
      @keyframes fa-drift { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,20px) scale(1.08); } }

      /* #9 line draw */
      .fa-line { stroke-dasharray: 1; stroke-dashoffset: 1; }
      .fa-line-in { stroke-dasharray: 1; stroke-dashoffset: 0; transition: stroke-dashoffset 1.4s ease; }
      .fa-area { opacity: 0; }
      .fa-area-in { opacity: 1; transition: opacity 1s ease .4s; }

      /* #12 FAQ open animation */
      details.group > *:not(summary) { animation: fa-fade .35s ease; }
      details.group summary { transition: color .15s ease; }
      details.group[open] summary { color: #1d4ed8; }
      @keyframes fa-fade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }

      /* #5 range slider */
      .fa-range { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 9999px;
        background: linear-gradient(90deg, #2563eb, #6366f1); outline: none; }
      .fa-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px;
        border-radius: 9999px; background: #fff; border: 3px solid #2563eb; box-shadow: 0 2px 6px rgba(37,99,235.4);
        cursor: pointer; transition: transform .12s ease; }
      .fa-range::-webkit-slider-thumb:active { transform: scale(1.15); }
      .fa-range::-moz-range-thumb { width: 22px; height: 22px; border-radius: 9999px; background: #fff;
        border: 3px solid #2563eb; box-shadow: 0 2px 6px rgba(37,99,235.4); cursor: pointer; }

      /* #1 TOC rail, only when the viewport has room in the left gutter */
      .fa-toc-wrap { display: none; }
      @media (min-width: 1280px) {
        .fa-toc-wrap { display: block; position: fixed; top: 120px; left: max(24px, calc((100vw - 768px) / 2 - 220px));
          width: 200px; z-index: 30; }
      }

      /* #15 reduced motion, disable everything, show final state */
      @media (prefers-reduced-motion: reduce) {
        .fa-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
        .fa-lift.fa-table tbody tr { transition: none !important; }
        .fa-aurora::before.fa-aurora::after { animation: none !important; }
        .fa-line-in.fa-area-in { transition: none !important; stroke-dashoffset: 0 !important; opacity: 1 !important; }
        details.group > *:not(summary) { animation: none !important; }
      }
    `}</style>
  );
}
