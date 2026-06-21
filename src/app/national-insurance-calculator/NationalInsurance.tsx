'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, Choice, BarTrack,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp, employeeNI, class4NI, PT, UEL } from '../../lib/tax2526';
import { TAX_RELATED } from '../take-home-pay/TakeHome';

type Kind = 'employed' | 'self';
const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

export default function NationalInsurance() {
  const [kind, setKind] = useState<Kind>('employed');
  const [income, setIncome] = useState(35000);

  const r = useMemo(() => {
    const rate1 = kind === 'employed' ? 0.08 : 0.06;
    const ni = kind === 'employed' ? employeeNI(income) : class4NI(income);
    const mainBand = income > PT ? (Math.min(income, UEL) - PT) * rate1 : 0;
    const upperBand = income > UEL ? (income - UEL) * 0.02 : 0;
    const effRate = income > 0 ? (ni / income) * 100 : 0;
    return { ni, mainBand, upperBand, rate1, effRate };
  }, [kind, income]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Tax', href: '/category/tax' }, { label: 'National Insurance' }]}
      title="National Insurance Calculator"
      subtitle="Work out your National Insurance for 2025/26, Class 1 if you're employed, Class 4 if you're self-employed, with a band-by-band breakdown."
      calcLabel="Calculate NI"
      inputs={
        <Panel title="Your earnings">
          <div className="space-y-4">
            <Field label="You are">
              <Choice<Kind> name="kind" value={kind} onChange={setKind} options={[
                { value: 'employed', label: 'Employed (Class 1)' },
                { value: 'self', label: 'Self-employed (Class 4)' },
              ]} />
            </Field>
            <Field label={kind === 'employed' ? 'Gross annual salary' : 'Annual profit'}><MoneyInput value={income} onChange={setIncome} step={1000} /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="NI per year" value={gbp(r.ni)} sub={`${pct(r.effRate)} of income`} tone="dark" big />
            <Stat label="Per month" value={gbp(r.ni / 12)} tone="accent" />
            <Stat label="Per week" value={gbp(r.ni / 52)} />
          </div>
          <Panel title="Band breakdown">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-on-surface-variant">£0 to £12,570 (0%)</span><span className="font-semibold">£0</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">£12,570 to £50,270 ({pct(r.rate1 * 100, 0)})</span><span className="font-semibold tabular-nums">{gbp(r.mainBand)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Above £50,270 (2%)</span><span className="font-semibold tabular-nums">{gbp(r.upperBand)}</span></div>
              <BarTrack segments={[{ value: r.mainBand, color: PRIMARY }, { value: r.upperBand, color: ACCENT }]} />
              <div className="flex justify-between pt-1 border-t border-outline-variant"><span className="text-on-surface-variant">Total NI</span><span className="font-bold tabular-nums">{gbp(r.ni)}</span></div>
            </div>
          </Panel>
          <p className="text-[11px] text-on-surface-variant">Estimate on 2025/26 rates. Class 1 employee NI is per pay period in practice, so a bonus month can differ. Excludes employer NI and Class 2.</p>
        </>
      }
    >
      <Guide
        title="National Insurance explained"
        intro="National Insurance funds the State Pension and certain benefits. What you pay depends on whether you're employed or self-employed. This guide covers the classes, rates and thresholds for 2025/26."
      >
        <GuideSection kicker="Employees" title="Class 1 National Insurance">
          <p>Employees pay <strong>Class 1</strong> NI through PAYE: <strong>8%</strong> on earnings between the primary threshold (£12,570) and the upper earnings limit (£50,270), then <strong>2%</strong> on everything above. Your employer also pays employer&apos;s NI on top (which doesn&apos;t come out of your pay but is a real cost of employing you). NI is usually calculated each pay period rather than annually, so an irregular month can look different.</p>
        </GuideSection>
        <GuideSection kicker="Self-employed" title="Class 4 (and Class 2)">
          <p>Sole traders pay <strong>Class 4</strong> NI on profit: <strong>6%</strong> between £12,570 and £50,270, then 2% above, collected through Self Assessment. <strong>Class 2</strong> NI is now voluntary for most, but paying it (a small weekly amount) can protect your State Pension and benefit entitlement if your profits are low, often worth doing.</p>
        </GuideSection>
        <GuideSection kicker="Why it matters" title="What NI buys you">
          <p>Unlike Income Tax, NI builds entitlement: <strong>qualifying years</strong> count towards your State Pension (you need about 35 for the full amount) and some contributory benefits. If you have gaps, from time abroad, low earnings or caring, you can sometimes fill them with voluntary contributions, which can be excellent value for your future pension.</p>
          <Callout tone="tip" title="Check your NI record">A quick look at your NI record on GOV.UK shows qualifying years and any gaps you could fill, small voluntary payments can add meaningfully to your State Pension.</Callout>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Thinking NI is just another tax', 'It builds State Pension and benefit entitlement, qualifying years matter for retirement.'],
            ['Ignoring voluntary Class 2', 'Low-profit sole traders can lose pension years by not paying the small voluntary contribution.'],
            ['Expecting a bonus to be taxed the same as salary', 'NI is period-based, so a bonus month can carry more NI than a steady salary.'],
            ['Forgetting gaps can be filled', 'Past gaps can sometimes be paid up, check before the deadlines.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much National Insurance do I pay?', a: 'Employees pay 8% on earnings from £12,570 to £50,270 and 2% above. The self-employed pay Class 4 at 6% and 2%. The calculator shows your figure.' },
            { q: 'Do I pay NI after State Pension age?', a: 'No, you stop paying NI once you reach State Pension age, even if you keep working (you should tell your employer).' },
            { q: 'What is the difference between Class 1, 2 and 4?', a: 'Class 1 is for employees, Class 2 and Class 4 are for the self-employed (Class 2 now voluntary, Class 4 on profits). Different classes build different entitlements.' },
            { q: 'Does NI count towards my pension?', a: 'Yes, qualifying NI years build your State Pension (around 35 for the full amount) and some benefits.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={TAX_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
