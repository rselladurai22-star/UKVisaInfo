'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, Slider,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { SAVINGS_RELATED } from '../pension-calculator/PensionCalculator';

const FULL_WEEKLY = 230.25; // new State Pension 2025/26
const FULL_ANNUAL = FULL_WEEKLY * 52;

export default function StatePension() {
  const [yearsNow, setYearsNow] = useState(20);
  const [yearsToAdd, setYearsToAdd] = useState(10);

  const r = useMemo(() => {
    const total = Math.min(35, yearsNow + yearsToAdd);
    const qualifies = total >= 10;
    const weekly = qualifies ? FULL_WEEKLY * (total / 35) : 0;
    const annual = weekly * 52;
    const toFull = Math.max(0, 35 - total);
    const fourWeekly = weekly * 4;
    return { total, qualifies, weekly, annual, toFull, fourWeekly, fullWeekly: FULL_WEEKLY };
  }, [yearsNow, yearsToAdd]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Savings', href: '/category/savings' }, { label: 'State Pension' }]}
      title="State Pension Forecast"
      subtitle="Estimate your new State Pension from your National Insurance qualifying years. You need 35 years for the full amount and at least 10 to get anything."
      calcLabel="Estimate my pension"
      inputs={
        <Panel title="Your NI record">
          <div className="space-y-4">
            <Field label={`Qualifying years so far, ${yearsNow}`} hint="Check yours on GOV.UK"><Slider value={yearsNow} onChange={setYearsNow} min={0} max={45} /></Field>
            <Field label={`More years before retirement, ${yearsToAdd}`} hint="Years you'll still work / get credits"><Slider value={yearsToAdd} onChange={setYearsToAdd} min={0} max={45} /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Weekly pension" value={gbp(r.weekly, 2)} sub={`${pct((r.total / 35) * 100, 0)} of full`} tone="dark" big />
            <Stat label="Annual pension" value={gbp(r.annual)} sub={`${r.total} of 35 years`} tone="accent" />
            <Stat label="Every 4 weeks" value={gbp(r.fourWeekly, 2)} sub="how it's paid" />
          </div>
          {!r.qualifies && (
            <Callout tone="warn" title="Below the 10-year minimum">
              With fewer than 10 qualifying years you get no State Pension. You have {r.total}, aim for at least 10,
              and 35 for the full amount.
            </Callout>
          )}
          <Panel title="Progress to the full pension">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-on-surface-variant">{r.total} of 35 qualifying years</span>
              <span className="font-bold tabular-nums text-primary">{pct((r.total / 35) * 100, 0)}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(r.total / 35) * 100}%` }} />
            </div>
            <p className="mt-3 text-sm text-on-surface-variant">
              {r.toFull > 0
                ? <>You need <strong className="text-secondary">{r.toFull} more qualifying year{r.toFull === 1 ? '' : 's'}</strong> for the full {gbp(FULL_WEEKLY, 2)}/week.</>
                : <>You&apos;re on track for the full new State Pension of {gbp(FULL_WEEKLY, 2)}/week.</>}
            </p>
          </Panel>
          <Callout tone="info" title="Check your official forecast">
            This is an estimate based on the new State Pension. Your real forecast can differ due to contracting-out,
            gaps you can fill, and transitional rules. Get the definitive figure at gov.uk/check-state-pension.
          </Callout>
        </>
      }
    >
      <Guide
        title="The State Pension explained"
        intro="The State Pension is the foundation of most people's retirement income. This guide explains how it's earned through National Insurance, how much you can get, and how to boost it."
      >
        <GuideSection kicker="The basics" title="How the new State Pension works">
          <p>The new State Pension is paid to people reaching State Pension age on or after 6 April 2016. The full amount is <strong>£230.25 a week</strong> (about £11,973 a year) in 2025/26. What you get depends on your <strong>National Insurance (NI) record</strong>: you typically need <strong>35 qualifying years</strong> for the full amount and at least <strong>10 years</strong> to get anything at all. Each qualifying year adds roughly 1/35th of the full pension.</p>
        </GuideSection>
        <GuideSection kicker="Earning it" title="Qualifying years and NI credits">
          <p>You build qualifying years by paying NI through work or self-employment, or by receiving <strong>NI credits</strong>, for example while claiming Child Benefit for a child under 12, receiving certain benefits, or caring. Gaps can appear from time abroad, low earnings or career breaks. You can check your record and any gaps on GOV.UK, and often <strong>fill gaps</strong> by paying voluntary Class 3 contributions, which can be excellent value.</p>
          <Callout tone="tip" title="Filling gaps can pay back fast">A single voluntary year (around £900) can add roughly £330 a year to your pension, recovered in under three years of retirement and paid for life. Check eligibility before deadlines.</Callout>
        </GuideSection>
        <GuideSection kicker="When" title="State Pension age">
          <p>The State Pension age is currently <strong>66</strong>, rising to <strong>67</strong> between 2026 and 2028, and to <strong>68</strong> thereafter. It&apos;s the same for men and women. You don&apos;t have to take it the moment you reach State Pension age, <strong>deferring</strong> increases your eventual payments (currently by about 1% for every 9 weeks deferred, roughly 5.8% a year), which can suit those still working.</p>
        </GuideSection>
        <GuideSection kicker="In context" title="It's a foundation, not the whole plan">
          <p>The full State Pension is below what most people need for a comfortable retirement, so it works best alongside workplace and personal pensions. The &quot;triple lock&quot; currently raises it each year by the highest of inflation, average earnings growth or 2.5%, helping it keep pace. Use it as the secure base and build private pension savings on top.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Assuming you&apos;ll get the full amount', 'Many people have gaps or were contracted out. Check your forecast rather than assuming.'],
            ['Missing NI credits while caring', 'Claim Child Benefit (even if opting out of payment) and carer&apos;s credits to protect your record.'],
            ['Leaving fillable gaps too late', 'Voluntary contributions have deadlines. Review your record well before State Pension age.'],
            ['Treating it as enough on its own', 'It&apos;s a foundation, build a workplace or personal pension on top.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How many years do I need for the full State Pension?', a: 'Usually 35 qualifying NI years for the full new State Pension, and at least 10 years to get any. Each year is worth about 1/35th of the full amount.' },
            { q: 'How much is the full State Pension?', a: '£230.25 a week (about £11,973 a year) in 2025/26 for the new State Pension. It&apos;s paid every four weeks.' },
            { q: 'Can I increase my State Pension?', a: 'Yes, fill NI gaps with voluntary contributions, claim credits you&apos;re entitled to, or defer taking it to increase the weekly amount.' },
            { q: 'What is the State Pension age?', a: 'Currently 66, rising to 67 between 2026 and 2028, then to 68. Check your exact date on GOV.UK.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={SAVINGS_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
