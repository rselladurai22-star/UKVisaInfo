'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, Slider, Donut,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp, incomeTax, employeeNI, studentLoan } from '../../lib/tax2526';
import { TAX_RELATED } from '../take-home-pay/TakeHome';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';
const GREEN = '#0a7d4f';
const VIOLET = '#7c3aed';

export default function BonusTax() {
  const [salary, setSalary] = useState(45000);
  const [bonus, setBonus] = useState(5000);
  const [pensionPct, setPensionPct] = useState(0);

  const r = useMemo(() => {
    const sacrifice = bonus * (pensionPct / 100);
    const bonusAfterPension = bonus - sacrifice;
    const withBonus = salary + bonusAfterPension;
    const extraTax = incomeTax(withBonus) - incomeTax(salary);
    const extraNI = employeeNI(withBonus) - employeeNI(salary);
    const extraSL = studentLoan(withBonus, 'plan2') - studentLoan(salary, 'plan2'); // illustrative if on Plan 2
    const net = bonusAfterPension - extraTax - extraNI;
    const keepPct = bonus > 0 ? (net / bonus) * 100 : 0;
    return { extraTax, extraNI, net, keepPct, sacrifice, bonusAfterPension, extraSL };
  }, [salary, bonus, pensionPct]);

  const trap = salary < 125140 && salary + bonus > 100000;

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Tax', href: '/category/tax' }, { label: 'Bonus Tax' }]}
      title="Bonus Tax Calculator"
      subtitle="See how much of your bonus you'll actually keep after Income Tax and National Insurance — and how redirecting some into your pension can rescue it from a high marginal rate."
      calcLabel="Calculate bonus"
      inputs={
        <Panel title="Your bonus">
          <div className="space-y-4">
            <Field label="Base annual salary"><MoneyInput value={salary} onChange={setSalary} step={1000} /></Field>
            <Field label="Bonus amount"><MoneyInput value={bonus} onChange={setBonus} step={500} /></Field>
            <Field label={`Sacrifice into pension — ${pensionPct}%`} hint="Avoids tax + NI on that slice"><Slider value={pensionPct} onChange={setPensionPct} min={0} max={100} step={5} /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Bonus you keep" value={gbp(r.net)} sub={`${pct(r.keepPct)} of the bonus`} tone="dark" big />
            <Stat label="Tax + NI taken" value={gbp(r.extraTax + r.extraNI)} sub="on the bonus" tone="accent" />
            {r.sacrifice > 0 && <Stat label="Into pension" value={gbp(r.sacrifice)} sub="tax-free" />}
          </div>
          <Panel title="Where your bonus goes">
            <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
              <Donut centerLabel="Gross bonus" centerValue={gbp(bonus)} segments={[
                { value: r.net, color: GREEN, label: 'You keep' },
                { value: r.extraTax, color: PRIMARY, label: 'Income Tax' },
                { value: r.extraNI, color: ACCENT, label: 'National Insurance' },
                { value: r.sacrifice, color: VIOLET, label: 'Pension' },
              ]} />
              <div className="flex-1 space-y-2 text-sm w-full">
                <div className="flex justify-between"><span className="text-on-surface-variant">Income Tax</span><span className="font-semibold tabular-nums">{gbp(r.extraTax)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">National Insurance</span><span className="font-semibold tabular-nums">{gbp(r.extraNI)}</span></div>
                {r.sacrifice > 0 && <div className="flex justify-between"><span className="text-on-surface-variant">Into pension</span><span className="font-semibold tabular-nums">{gbp(r.sacrifice)}</span></div>}
                <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant">You keep</span><span className="font-bold tabular-nums text-secondary">{gbp(r.net)}</span></div>
              </div>
            </div>
          </Panel>
          {trap && (
            <Callout tone="warn" title="Bonus pushes you into the 60% trap">
              Your salary plus bonus crosses £100,000, where the personal allowance tapers and the effective rate hits
              ~60%. Sacrificing the bonus into your pension can avoid this almost entirely.
            </Callout>
          )}
        </>
      }
    >
      <Guide
        title="How your bonus is taxed"
        intro="A bonus isn't taxed at a special rate — but the way PAYE and National Insurance work can make it look heavily docked. This guide explains what really happens and how to keep more of it."
      >
        <GuideSection kicker="The basics" title="A bonus is just more income">
          <p>Your bonus is added to your earnings and taxed at your normal Income Tax rates — 20%, 40% or 45% depending on your total income — plus National Insurance (8% or 2%) and any student loan. There&apos;s no separate &quot;bonus tax&quot;. If your bonus pushes part of your income into a higher band, only that part is taxed at the higher rate.</p>
        </GuideSection>
        <GuideSection kicker="Why it looks worse" title="The PAYE and NI timing effect">
          <p>Because PAYE often assumes your bonus month is your <em>normal</em> month, it can over-tax that payslip and over-charge NI (which is calculated per period). It usually evens out over the year — Income Tax corrects automatically — but the NI on a one-off bonus genuinely is higher than if the same money were spread across the year. That&apos;s why a big bonus payslip can feel brutally taxed.</p>
        </GuideSection>
        <GuideSection kicker="Keep more" title="Sacrifice the bonus into your pension">
          <p>The most effective move is <strong>bonus sacrifice</strong>: redirect some or all of the bonus into your pension before it&apos;s paid. You avoid Income Tax <em>and</em> National Insurance on the sacrificed amount, and many employers add their NI saving too. For higher earners — especially anyone whose bonus crosses £100,000 into the 60% allowance-taper zone — this can be dramatically more valuable than taking the cash.</p>
          <Callout tone="tip" title="Rescue from the 60% band">If your bonus tips you over £100,000, sacrificing the excess into your pension reclaims your personal allowance — effectively getting more than £1 of value for every £1 sacrificed.</Callout>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Thinking bonuses are taxed at a penalty rate', 'They&apos;re taxed at your normal rates; PAYE/NI timing just makes one payslip look heavier.'],
            ['Not considering pension sacrifice', 'For higher earners it can save 40–60%+ versus taking the cash.'],
            ['Ignoring the £100k taper', 'A bonus over £100k triggers the 60% effective band — plan around it.'],
            ['Forgetting student loan', 'A bonus also attracts 9% (or 6% postgraduate) student-loan deductions above the threshold.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Is a bonus taxed at 40%?', a: 'Only the part of your income above the higher-rate threshold is taxed at 40%. A bonus is taxed at whatever band it falls into, plus NI and any student loan.' },
            { q: 'Why was so much taken from my bonus?', a: 'PAYE may have over-taxed the bonus month and NI is charged per period, so the deduction looks large. Income Tax usually corrects over the year.' },
            { q: 'Can I avoid tax on my bonus?', a: 'You can&apos;t avoid it on cash, but sacrificing it into a pension avoids Income Tax and NI on the sacrificed amount — the most tax-efficient option for many.' },
            { q: 'Will I get a tax refund?', a: 'If PAYE over-taxed your bonus, the Income Tax element typically self-corrects in later payslips or at year end. NI does not refund for a one-off bonus.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={TAX_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
