'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Choice,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import RelatedGuides from '../../components/RelatedGuides';
import { gbp } from '../../lib/tax2526';

// CMS 2025 thresholds (gross weekly income)
const FLAT_RATE = 7;
const BASIC_RATE = { 1: 0.12, 2: 0.16, 3: 0.19 };       // £200–£800
const REDUCED_RATE_ABOVE_800 = { 1: 0.09, 2: 0.12, 3: 0.15 };

// shared care: nights per year → fraction reduction
function sharedCareReduction(nights: number): number {
  if (nights >= 175) return 0.5;
  if (nights >= 156) return 3 / 7;
  if (nights >= 104) return 2 / 7;
  if (nights >= 52) return 1 / 7;
  return 0;
}

const RELATED = [
  { href: '/spousal-maintenance-calculator', label: 'Spousal Maintenance', hint: 'Ongoing support estimate' },
  { href: '/divorce-cost-calculator', label: 'Divorce Cost', hint: 'Court + legal fees' },
  { href: '/financial-settlement-calculator', label: 'Financial Settlement', hint: 'Asset split estimate' },
  { href: '/take-home-pay', label: 'Take-Home Pay', hint: 'Net pay after tax & NI' },
];

export default function ChildMaintenance() {
  const [grossWeekly, setGrossWeekly] = useState(600);
  const [children, setChildren] = useState(2);
  const [otherChildren, setOtherChildren] = useState(0);
  const [nights, setNights] = useState(0);

  const r = useMemo(() => {
    const n = Math.min(3, Math.max(1, children)) as 1 | 2 | 3;

    // Reduce gross income for "relevant other children" living with paying parent
    const otherChildReduction = otherChildren === 0 ? 0 : otherChildren === 1 ? 0.11 : otherChildren === 2 ? 0.14 : 0.16;
    const adjustedGross = grossWeekly * (1 - otherChildReduction);

    let band: string;
    let weekly = 0;
    if (adjustedGross < 7) {
      band = 'Nil / below threshold';
      weekly = 0;
    } else if (adjustedGross <= 100) {
      band = 'Flat rate';
      weekly = FLAT_RATE;
    } else if (adjustedGross <= 200) {
      band = 'Reduced rate';
      // simplified reduced rate: flat £7 + a percentage of income over £100
      weekly = FLAT_RATE + (adjustedGross - 100) * (BASIC_RATE[n] * 0.5);
    } else if (adjustedGross <= 800) {
      band = 'Basic rate';
      weekly = adjustedGross * BASIC_RATE[n];
    } else {
      band = 'Basic plus';
      const capped = Math.min(adjustedGross, 3000);
      weekly = 800 * BASIC_RATE[n] + (capped - 800) * REDUCED_RATE_ABOVE_800[n];
    }

    const reduction = sharedCareReduction(nights);
    const afterShared = weekly * (1 - reduction);

    return { band, weekly, reduction, afterShared, monthly: afterShared * 52 / 12, annual: afterShared * 52, adjustedGross };
  }, [grossWeekly, children, otherChildren, nights]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Family Law', href: '/category/family-law' }, { label: 'Child Maintenance' }]}
      title="Child Maintenance Calculator"
      subtitle="Estimate child maintenance using the Child Maintenance Service (CMS) formula — gross income rates of 12/16/19%, with shared-care reductions."
      calcLabel="Calculate Maintenance"
      inputs={
        <Panel title="Paying Parent's Details">
          <div className="space-y-4">
            <Field label="Gross weekly income" hint="Before tax, after pension contributions"><MoneyInput value={grossWeekly} onChange={setGrossWeekly} step={25} /></Field>
            <Field label="Children to pay for">
              <Choice<'1' | '2' | '3'>
                name="children"
                value={String(Math.min(3, children)) as '1' | '2' | '3'}
                onChange={(v) => setChildren(Number(v))}
                options={[
                  { value: '1', label: '1 child', desc: '12% basic rate' },
                  { value: '2', label: '2 children', desc: '16% basic rate' },
                  { value: '3', label: '3 or more', desc: '19% basic rate' },
                ]}
              />
            </Field>
            <Field label="Other children living with paying parent" hint="Reduces the income the calculation is based on"><NumberInput value={otherChildren} onChange={setOtherChildren} min={0} step={1} /></Field>
            <Field label="Nights per year child stays with paying parent" hint="Shared care reduces the amount"><NumberInput value={nights} onChange={setNights} min={0} step={1} suffix=" nights" /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Weekly Maintenance" value={gbp(r.afterShared, 2)} sub={r.band} tone="dark" big />
            <Stat label="Per Month" value={gbp(r.monthly)} sub="Approximate" tone="primary" />
            <Stat label="Before Shared Care" value={gbp(r.weekly, 2)} sub={r.reduction > 0 ? `−${(r.reduction * 100).toFixed(0)}% applied` : 'No reduction'} tone="accent" />
            <Stat label="Per Year" value={gbp(r.annual)} sub="Estimated" />
          </div>

          <Panel title="How it's worked out">
            <div className="space-y-2 text-sm w-full">
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Income used</span><span className="font-semibold tabular-nums">{gbp(r.adjustedGross)}/wk</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Rate band</span><span className="font-semibold tabular-nums">{r.band}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Before shared care</span><span className="font-semibold tabular-nums">{gbp(r.weekly, 2)}/wk</span></div>
              {r.reduction > 0 && <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Shared-care reduction</span><span className="font-semibold tabular-nums text-primary">−{(r.reduction * 100).toFixed(0)}%</span></div>}
              <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant font-bold">Weekly maintenance</span><span className="font-bold tabular-nums text-secondary text-base">{gbp(r.afterShared, 2)}</span></div>
            </div>
          </Panel>

          <Callout tone="info" title="Family-based arrangements are an option">
            Parents can agree maintenance privately without the CMS. The CMS figure is a useful benchmark, and the CMS charges fees if it collects payments for you.
          </Callout>

          <p className="text-[11px] text-on-surface-variant">Estimate based on CMS rules. Simplified for incomes over £800/week and reduced-rate bands. The CMS uses HMRC income data; actual assessments may differ. Income over £3,000/week is excluded.</p>
        </>
      }
    >
      <Guide
        title="How child maintenance is calculated"
        intro="When parents separate, the parent the child doesn't mainly live with usually pays child maintenance. The Child Maintenance Service (CMS) uses a set formula based on the paying parent's gross income, the number of children, and how often the child stays over. Here's how it works."
      >
        <GuideSection kicker="The rates" title="Basic rate percentages">
          <p>For gross weekly income between £200 and £800, the CMS basic rate is a percentage of income:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>1 child:</strong> 12%</li>
            <li><strong>2 children:</strong> 16%</li>
            <li><strong>3 or more:</strong> 19%</li>
          </ul>
          <p>Income between £800 and £3,000 a week is charged at lower "basic plus" rates (9% / 12% / 15%) on the portion above £800. Income over £3,000 a week is outside the CMS, and the receiving parent can apply to court for a "top-up".</p>
        </GuideSection>

        <GuideSection kicker="Lower incomes" title="Flat and reduced rates">
          <p>Below £200 a week, different rules apply: a <strong>reduced rate</strong> between £100 and £200, and a <strong>flat rate</strong> of £7 a week for income of £100 or less or for those on certain benefits.</p>
        </GuideSection>

        <GuideSection kicker="Shared care" title="Nights reduce the bill">
          <p>If the child stays overnight with the paying parent, maintenance is reduced on a sliding scale:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>52–103 nights a year: reduced by 1/7.</li>
            <li>104–155 nights: reduced by 2/7.</li>
            <li>156–174 nights: reduced by 3/7.</li>
            <li>175+ nights: reduced by half, plus a further small reduction.</li>
          </ul>
          <Callout tone="tip" title="Other children count too">
            If the paying parent has other children living with them, their gross income is reduced before the percentage is applied — lowering the maintenance for the children in this calculation.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="Two children, £600 a week, no shared care">
          <p>A paying parent earning £600 gross a week with two children and no overnight stays falls in the basic rate band. The calculation is £600 × 16% = £96 a week, or about £416 a month. If the children stayed 60 nights a year, the 1/7 reduction would bring it to about £82.29 a week.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common child maintenance mistakes">
          <Mistakes items={[
            ['Forgetting pension contributions reduce income', 'The CMS uses gross income after pension contributions, which can lower the figure.'],
            ['Ignoring shared-care nights', 'Overnight stays meaningfully reduce maintenance — keep an accurate record.'],
            ['Assuming the CMS is free', 'If the CMS collects and passes on payments, both parents pay collection fees; a direct arrangement avoids them.'],
            ['Overlooking the £3,000 cap', 'Very high earners are only assessed up to £3,000/week by the CMS; the rest needs a court top-up.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Does child maintenance depend on the receiving parent\'s income?', a: 'No. The CMS formula is based only on the paying parent\'s gross income, the number of children and shared care — not the other parent\'s earnings.' },
            { q: 'Can we agree our own amount?', a: 'Yes. A family-based arrangement avoids CMS fees. The CMS calculation is a helpful benchmark for what is fair.' },
            { q: 'Does maintenance stop at 16?', a: 'It usually continues while the child is in full-time non-advanced education (up to 20) or until they leave school.' },
            { q: 'What if the paying parent is self-employed?', a: 'The CMS uses their gross income from HMRC records; complex or disputed income can be investigated, but it can be harder to assess.' },
          ]} />
        </GuideSection>
        <RelatedGuides calc="/child-maintenance-calculator" />
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
