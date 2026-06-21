'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, Slider, Toggle,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp, incomeTax, employeeNI } from '../../lib/tax2526';
import { TAX_RELATED } from '../take-home-pay/TakeHome';

export default function SalarySacrifice() {
  const [salary, setSalary] = useState(50000);
  const [sacrifice, setSacrifice] = useState(5000);
  const [employerAddsNI, setEmployerAddsNI] = useState(true);

  const r = useMemo(() => {
    const before = salary - incomeTax(salary) - employeeNI(salary);
    const adj = Math.max(0, salary - sacrifice);
    const after = adj - incomeTax(adj) - employeeNI(adj);
    const taxSaved = incomeTax(salary) - incomeTax(adj);
    const niSaved = employeeNI(salary) - employeeNI(adj);
    const netCost = before - after; // drop in take-home
    const employerNI = employerAddsNI ? sacrifice * 0.15 : 0;
    const intoPension = sacrifice + employerNI;
    const costPerPound = intoPension > 0 ? netCost / intoPension : 0;
    return { before, after, taxSaved, niSaved, netCost, intoPension, employerNI, costPerPound };
  }, [salary, sacrifice, employerAddsNI]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Tax', href: '/category/tax' }, { label: 'Salary Sacrifice' }]}
      title="Salary Sacrifice Calculator"
      subtitle="See how sacrificing salary into your pension cuts Income Tax and National Insurance, so a big pension contribution costs your take-home far less than you'd think."
      calcLabel="Calculate saving"
      inputs={
        <Panel title="Your sacrifice">
          <div className="space-y-4">
            <Field label="Gross annual salary"><MoneyInput value={salary} onChange={setSalary} step={1000} /></Field>
            <Field label={`Amount to sacrifice, ${gbp(sacrifice)}`} hint="Into pension (or EV, cycle scheme)"><Slider value={sacrifice} onChange={setSacrifice} min={0} max={Math.max(1000, Math.round(salary * 0.6))} step={250} /></Field>
            <Toggle checked={employerAddsNI} onChange={setEmployerAddsNI} label="Employer adds their NI saving (15%) to my pension" />
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Into your pension" value={gbp(r.intoPension)} sub={r.employerNI > 0 ? `inc. ${gbp(r.employerNI)} employer NI` : 'your contribution'} tone="dark" big />
            <Stat label="Real cost to you" value={gbp(r.netCost)} sub="drop in take-home" tone="accent" />
            <Stat label="Cost per £1 saved" value={gbp(r.costPerPound, 2)} sub="for £1 in pension" />
          </div>
          <Panel title="Tax & NI saved">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-on-surface-variant">Income Tax saved</span><span className="font-semibold tabular-nums text-secondary">{gbp(r.taxSaved)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">National Insurance saved</span><span className="font-semibold tabular-nums text-secondary">{gbp(r.niSaved)}</span></div>
              {r.employerNI > 0 && <div className="flex justify-between"><span className="text-on-surface-variant">Employer NI added</span><span className="font-semibold tabular-nums text-secondary">{gbp(r.employerNI)}</span></div>}
              <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant">Take-home: before → after</span><span className="font-bold tabular-nums">{gbp(r.before / 12, 0)} → {gbp(r.after / 12, 0)}/mo</span></div>
            </div>
          </Panel>
          <Callout tone="tip" title="Why this beats a normal pension contribution">
            Salary sacrifice cuts National Insurance as well as Income Tax, and many employers pass on their NI
            saving too. So {gbp(r.intoPension)} can land in your pension for just {gbp(r.netCost)} of take-home.
          </Callout>
        </>
      }
    >
      <Guide
        title="Salary sacrifice explained"
        intro="Salary sacrifice is one of the most powerful, legitimate tax savings available to employees. This guide explains how it works, the National Insurance bonus, and the points to watch."
      >
        <GuideSection kicker="The basics" title="What salary sacrifice is">
          <p>Salary sacrifice means agreeing to give up part of your gross salary in exchange for a non-cash benefit, most commonly an employer pension contribution, but also electric-car schemes and the cycle-to-work scheme. Because you never &quot;receive&quot; the sacrificed pay, you don&apos;t pay <strong>Income Tax or National Insurance</strong> on it. That dual saving makes it more efficient than paying into a pension from your take-home.</p>
        </GuideSection>
        <GuideSection kicker="The edge" title="The National Insurance bonus">
          <p>An ordinary pension contribution saves Income Tax but not employee NI. Salary sacrifice saves <strong>both</strong>. On top, your employer saves their NI (15% from April 2025) on the sacrificed amount, and many generous employers <strong>add that saving to your pension too</strong>, boosting your pot at no extra cost to you. The calculator lets you include this.</p>
          <Callout tone="tip" title="Especially powerful at £100k+">Sacrificing salary below £100,000 reclaims your tapered personal allowance, where the effective relief can exceed 60%. For high earners, it&apos;s often the single best tax move.</Callout>
        </GuideSection>
        <GuideSection kicker="Watch out" title="When sacrifice can backfire">
          <p>Because it lowers your <strong>gross</strong> salary, salary sacrifice can reduce things linked to salary: mortgage affordability, life cover or income protection based on salary, maternity/statutory pay, and you can&apos;t sacrifice below the National Minimum Wage. It can also slightly reduce State Pension qualifying earnings in rare low-pay cases. For most middle and higher earners the benefits far outweigh these, but check before sacrificing a large amount.</p>
        </GuideSection>
        <GuideSection kicker="Beyond pensions" title="EV and cycle schemes">
          <p>The same mechanism powers <strong>electric-car</strong> salary-sacrifice schemes (very tax-efficient thanks to low benefit-in-kind rates on EVs) and the <strong>cycle-to-work</strong> scheme. You pay for the car or bike from pre-tax salary, saving tax and NI, though a small benefit-in-kind charge applies to cars. These can be excellent value if your employer offers them.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Sacrificing below minimum wage', 'You can&apos;t reduce pay below the NMW, employers cap the sacrifice accordingly.'],
            ['Ignoring salary-linked benefits', 'Mortgage, life cover and statutory pay may be based on the lower salary. Check first.'],
            ['Forgetting the employer NI bonus', 'Ask whether your employer passes on their NI saving, it materially boosts your pension.'],
            ['Over-sacrificing past the annual allowance', 'Pension contributions above the £60,000 annual allowance can trigger a tax charge.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much does salary sacrifice save?', a: 'You save Income Tax and employee NI on the sacrificed amount, typically 28% (basic rate) to 42%+ (higher rate), more if your employer adds their NI saving. The calculator shows the real cost.' },
            { q: 'Does it reduce my pension contributions?', a: 'No, it increases what goes into your pension. It reduces your gross cash salary, not your pension.' },
            { q: 'Will it affect my mortgage application?', a: 'It can, because lenders look at gross salary. Some count pension sacrifice back; check with a broker if you&apos;re about to apply.' },
            { q: 'Is salary sacrifice worth it?', a: 'For most middle and higher earners, yes, the combined tax and NI saving is substantial, especially with an employer NI top-up or near the £100k allowance taper.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={TAX_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
