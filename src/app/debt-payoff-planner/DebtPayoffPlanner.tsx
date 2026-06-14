'use client';

import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  gbp, CalcShell, Panel, Stat, Field, MoneyInput, Slider,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { LOANS_RELATED } from '../personal-loan-calculator/PersonalLoan';

interface Debt { id: number; name: string; balance: number; apr: number; min: number }
type Strat = 'avalanche' | 'snowball';

const fmtYM = (m: number) => {
  if (m >= 1200) return '100y+';
  const y = Math.floor(m / 12); const mm = m % 12;
  return y <= 0 ? `${mm}m` : mm === 0 ? `${y}y` : `${y}y ${mm}m`;
};

function simulate(debts: Debt[], extra: number, strat: Strat) {
  const open = debts.map((d) => ({ ...d }));
  const budget = debts.reduce((s, d) => s + d.min, 0) + extra;
  let interest = 0, m = 0;
  const order: string[] = [];
  const cleared = new Set<number>();
  while (open.some((d) => d.balance > 0.005) && m < 1200) {
    m++;
    for (const d of open) if (d.balance > 0) { const it = d.balance * (d.apr / 1200); d.balance += it; interest += it; }
    let avail = budget;
    for (const d of open) if (d.balance > 0) { const pay = Math.min(d.min, d.balance, avail); d.balance -= pay; avail -= pay; }
    const targets = [...open].filter((d) => d.balance > 0).sort((a, b) => (strat === 'avalanche' ? b.apr - a.apr : a.balance - b.balance));
    for (const t of targets) { if (avail <= 0) break; const pay = Math.min(t.balance, avail); t.balance -= pay; avail -= pay; }
    for (const d of open) if (d.balance <= 0.005 && !cleared.has(d.id)) { cleared.add(d.id); order.push(d.name); }
  }
  return { months: m, interest, order };
}

export default function DebtPayoffPlanner() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: 'Credit card', balance: 4000, apr: 24.9, min: 100 },
    { id: 2, name: 'Car loan', balance: 6000, apr: 7.9, min: 180 },
    { id: 3, name: 'Store card', balance: 1200, apr: 29.9, min: 40 },
  ]);
  const [extra, setExtra] = useState(150);

  const update = (id: number, k: keyof Debt, v: number) => setDebts((ds) => ds.map((d) => (d.id === id ? { ...d, [k]: v } : d)));
  const add = () => setDebts((ds) => [...ds, { id: Date.now(), name: `Debt ${ds.length + 1}`, balance: 1000, apr: 19.9, min: 30 }]);
  const remove = (id: number) => setDebts((ds) => ds.filter((d) => d.id !== id));

  const r = useMemo(() => {
    const valid = debts.filter((d) => d.balance > 0);
    const av = simulate(valid, extra, 'avalanche');
    const sn = simulate(valid, extra, 'snowball');
    const totalBalance = valid.reduce((s, d) => s + d.balance, 0);
    return { av, sn, totalBalance, saving: sn.interest - av.interest };
  }, [debts, extra]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Loans', href: '/category/loans' }, { label: 'Debt Payoff Planner' }]}
      title="Debt Payoff Planner"
      subtitle="Add your debts and a spare monthly amount, and compare the two proven payoff strategies — avalanche (cheapest) and snowball (most motivating) — to see how fast you could be debt-free."
      calcLabel="Build my plan"
      inputs={
        <>
          <Panel title="Your debts" action={<button onClick={add} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"><Plus className="h-3.5 w-3.5" /> Add</button>}>
            <div className="space-y-4">
              {debts.map((d) => (
                <div key={d.id} className="rounded-lg border border-outline-variant p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <input value={d.name} onChange={(e) => setDebts((ds) => ds.map((x) => (x.id === d.id ? { ...x, name: e.target.value } : x)))} className="bg-transparent text-sm font-semibold outline-none border-b border-transparent focus:border-primary" />
                    {debts.length > 1 && <button onClick={() => remove(d.id)} aria-label="Remove" className="text-on-surface-variant hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Field label="Balance"><MoneyInput value={d.balance} onChange={(v) => update(d.id, 'balance', v)} step={100} /></Field>
                    <Field label="APR %"><MoneyInput value={d.apr} onChange={(v) => update(d.id, 'apr', v)} step={1} /></Field>
                    <Field label="Min /mo"><MoneyInput value={d.min} onChange={(v) => update(d.id, 'min', v)} step={5} /></Field>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Extra you can pay">
            <Field label={`Spare monthly budget — ${gbp(extra)}`} hint="On top of the minimum payments"><Slider value={extra} onChange={setExtra} min={0} max={1000} step={10} /></Field>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Avalanche" value={fmtYM(r.av.months)} sub={`${gbp(r.av.interest)} interest`} tone="dark" />
            <Stat label="Snowball" value={fmtYM(r.sn.months)} sub={`${gbp(r.sn.interest)} interest`} tone="accent" />
          </div>
          <Callout tone="tip" title={`Avalanche saves ${gbp(Math.max(0, r.saving))} in interest`}>
            Both clear {gbp(r.totalBalance)} of debt. The <strong>avalanche</strong> (highest APR first) is the
            cheapest; the <strong>snowball</strong> (smallest balance first) clears individual debts sooner for
            motivation. Pick whichever you&apos;ll stick to.
          </Callout>
          <Panel title="Avalanche payoff order (cheapest)">
            <ol className="space-y-1.5 text-sm">
              {r.av.order.map((name, idx) => (
                <li key={name + idx} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary-soft/40 text-primary text-[11px] font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                  <span>{name}</span>
                </li>
              ))}
              {r.av.order.length === 0 && <li className="text-on-surface-variant">Add debts to see the order.</li>}
            </ol>
          </Panel>
        </>
      }
    >
      <Guide
        title="The fastest way to clear multiple debts"
        intro="When you owe on several cards and loans, the order you pay them off changes how much interest you pay and how motivated you stay. This guide explains the snowball and avalanche methods and how to build a plan that works."
      >
        <GuideSection kicker="The principle" title="Minimums everywhere, extra on one">
          <p>The core of any payoff plan is simple: pay the <strong>minimum on every debt</strong> to stay current, then throw every spare pound at <strong>one target debt</strong>. When that debt clears, its old payment rolls onto the next target — a snowballing effect that accelerates as you go. The only question is which debt to target first, and that&apos;s where the two methods differ.</p>
        </GuideSection>
        <GuideSection kicker="Method 1" title="The avalanche (cheapest)">
          <p>The <strong>avalanche</strong> method targets the debt with the <strong>highest APR</strong> first, regardless of balance. Mathematically this is the cheapest route — you kill your most expensive interest first, so you pay the least overall and usually clear everything fastest. If you&apos;re disciplined and motivated by saving money, avalanche wins.</p>
        </GuideSection>
        <GuideSection kicker="Method 2" title="The snowball (most motivating)">
          <p>The <strong>snowball</strong> method targets the <strong>smallest balance</strong> first. You clear individual debts quickly, which delivers early wins and momentum — behavioural research suggests many people stick with it better. It can cost a little more interest than avalanche, but the best plan is the one you actually finish. If you&apos;ve struggled to stay motivated, snowball may be the smarter choice.</p>
          <Callout tone="tip" title="A hybrid works too">Some people clear one tiny balance first for a quick win (snowball), then switch to highest-APR (avalanche). The planner shows both so you can choose.</Callout>
        </GuideSection>
        <GuideSection kicker="Boost it" title="Finding extra to pay">
          <p>Even a small extra payment dramatically shortens the timeline. Free up cash by cutting subscriptions, switching to 0% balance transfers on expensive cards (so payments clear the balance, not interest), and putting any windfalls straight onto the target debt. Avoid taking on new debt while you repay — and if your debts are unaffordable, get free advice from StepChange, National Debtline or Citizens Advice.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Spreading extra across all debts', 'Focus all spare cash on one target; minimums on the rest. Spreading it slows everything.'],
            ['Missing a minimum payment', 'Fees and credit-score damage outweigh any gain. Always cover every minimum.'],
            ['Choosing a method you won&apos;t stick to', 'Avalanche is cheapest, but a snowball you finish beats an avalanche you quit.'],
            ['Taking on new debt mid-plan', 'New borrowing resets your progress. Pause new credit until you&apos;re clear.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Snowball or avalanche — which is better?', a: 'Avalanche (highest APR first) costs the least interest. Snowball (smallest balance first) clears debts faster for motivation. Both work; pick the one you&apos;ll stick to.' },
            { q: 'Should I save or clear debt first?', a: 'Keep a small emergency buffer (e.g. £1,000), then prioritise clearing high-interest debt — its rate almost always beats savings interest. Maintain pension contributions if matched by an employer.' },
            { q: 'Do balance transfers help a payoff plan?', a: 'Yes — moving expensive card debt to a 0% deal means your payments clear the balance instead of interest, accelerating either method.' },
            { q: 'What if I can&apos;t afford the minimums?', a: 'Seek free debt advice immediately (StepChange, National Debtline, Citizens Advice). Solutions like a Debt Management Plan may suit better than a payoff plan.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={LOANS_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}

// force rebuild 20260614T221951Z
