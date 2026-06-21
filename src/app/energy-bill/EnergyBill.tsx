'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, NumberInput,
  Donut, Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import RelatedGuides from '../../components/RelatedGuides';
import { gbp } from '../../lib/tax2526';
import { calcEnergyBill, CAP, TDCV } from '../../lib/energy/calc';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

const RELATED = [
  { href: '/solar-panel-roi', label: 'Solar Panel ROI', hint: 'Payback + export tariff' },
  { href: '/heat-pump-calculator', label: 'Heat Pump', hint: 'Running cost vs gas' },
  { href: '/ev-charging-cost', label: 'EV Charging Cost', hint: 'Home vs public' },
  { href: '/cost-of-living-uk', label: 'Cost of Living', hint: 'Household spending guide' },
];

export default function EnergyBill() {
  const [elec, setElec] = useState(TDCV.electricity);
  const [gas, setGas] = useState(TDCV.gas);

  const r = useMemo(() => calcEnergyBill({ electricityKwh: elec, gasKwh: gas }), [elec, gas]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Energy', href: '/category/energy' }, { label: 'Energy Bill' }]}
      title="Energy Bill Calculator"
      subtitle={`Estimate your annual gas and electricity bill under the Ofgem price cap (${CAP.windowLabel}).`}
      calcLabel="Estimate My Bill"
      inputs={
        <Panel title="Your Usage">
          <div className="space-y-4">
            <Field label="Electricity used per year (kWh)" hint={`Typical home uses ~${TDCV.electricity.toLocaleString()} kWh`}>
              <NumberInput value={elec} onChange={setElec} min={0} step={100} suffix=" kWh" />
            </Field>
            <Field label="Gas used per year (kWh)" hint={`Typical home uses ~${TDCV.gas.toLocaleString()} kWh`}>
              <NumberInput value={gas} onChange={setGas} min={0} step={500} suffix=" kWh" />
            </Field>
            <p className="text-[11px] text-on-surface-variant">Find your annual kWh on a recent bill or your in-home display. Leave at the defaults for an Ofgem typical household.</p>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Annual Bill" value={gbp(r.totalAnnual)} sub="Gas + electricity" tone="dark" big />
            <Stat label="Per Month" value={gbp(r.monthlyAvg)} sub="Average direct debit" tone="primary" />
            <Stat label="Electricity" value={gbp(r.electricityAnnual)} sub={`${CAP.electricity.unitPence}p/kWh + standing`} tone="accent" />
            <Stat label="Gas" value={gbp(r.gasAnnual)} sub={`${CAP.gas.unitPence}p/kWh + standing`} />
          </div>

          <Panel title="Gas vs electricity">
            <Donut
              centerLabel="Per year"
              centerValue={gbp(r.totalAnnual)}
              segments={[
                { value: r.electricityAnnual, color: PRIMARY, label: 'Electricity' },
                { value: r.gasAnnual, color: ACCENT, label: 'Gas' },
              ]}
            />
          </Panel>

          <Callout tone={r.vsTypical > 0 ? 'warn' : 'tip'} title={r.vsTypical > 0 ? 'Above the typical household' : 'Below the typical household'}>
            Your estimated bill is <strong>{gbp(Math.abs(r.vsTypical))}</strong> {r.vsTypical > 0 ? 'more' : 'less'} than the Ofgem typical bill of {gbp(r.typicalBill)} a year for an average home.
          </Callout>

          <p className="text-[11px] text-on-surface-variant">Estimate at GB-average Direct Debit cap rates for {CAP.windowLabel}. Your real rates vary by region and payment method. The cap changes every quarter.</p>
        </>
      }
    >
      <Guide
        title="Understanding your energy bill and the price cap"
        intro="Most UK households are on a tariff governed by Ofgem's price cap, which limits the unit rate and standing charge suppliers can charge. Your bill is simply the energy you use multiplied by the unit rate, plus a daily standing charge for each fuel. Here's how it works."
      >
        <GuideSection kicker="The building blocks" title="Unit rate + standing charge">
          <p>Every energy bill has two parts for each fuel:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Unit rate</strong>, the price per kWh of energy you actually use.</li>
            <li><strong>Standing charge</strong>, a fixed daily fee just for being connected, regardless of usage.</li>
          </ul>
          <p>For {CAP.windowLabel}, the GB-average capped rates are about {CAP.electricity.unitPence}p/kWh for electricity and {CAP.gas.unitPence}p/kWh for gas, plus daily standing charges of roughly {CAP.electricity.standingPence}p and {CAP.gas.standingPence}p.</p>
        </GuideSection>

        <GuideSection kicker="The cap" title="What the price cap really limits">
          <p>The Ofgem cap is widely misunderstood. It does <strong>not</strong> cap your total bill, it caps the unit rate and standing charge. If you use more energy, you pay more. The "typical bill" figure Ofgem quotes is just the cap applied to an average household's usage ({TDCV.electricity.toLocaleString()} kWh electricity, {TDCV.gas.toLocaleString()} kWh gas).</p>
          <Callout tone="warn" title="The cap changes every quarter">
            Ofgem resets the cap four times a year. Rates can jump or fall noticeably between quarters, so an estimate is only accurate for the current cap window.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Standing charges" title="The cost you pay even using nothing">
          <p>Standing charges have risen sharply and are now a meaningful chunk of bills, over £300 a year for a dual-fuel home before you use any energy. They cover network maintenance and policy costs. They're the same whether you're away all month or running everything, which frustrates low users.</p>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A typical household">
          <p>An average home using {TDCV.electricity.toLocaleString()} kWh of electricity and {TDCV.gas.toLocaleString()} kWh of gas pays roughly {gbp(calcEnergyBill({ electricityKwh: TDCV.electricity, gasKwh: TDCV.gas }).totalAnnual)} a year at current capped rates, split between the two fuels, with standing charges adding a fixed amount on top of usage.</p>
        </GuideSection>

        <GuideSection kicker="Cutting bills" title="Where the savings are">
          <ul className="list-disc pl-5 space-y-2">
            <li>Heating dominates gas use, turning the thermostat down 1°C can save around 10% of heating cost.</li>
            <li>Draught-proofing, loft and cavity-wall insulation cut waste cheaply.</li>
            <li>Check whether a fixed deal below the cap is available before switching.</li>
            <li>Submit regular meter readings so you're billed on actual, not estimated, usage.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common energy bill mistakes">
          <Mistakes items={[
            ['Thinking the cap limits your total bill', 'It caps unit rates and standing charges, not the amount you owe.'],
            ['Ignoring standing charges', 'You pay over £300 a year before using any energy on a dual-fuel home.'],
            ['Relying on estimated readings', 'Estimates can over- or under-bill; regular meter readings keep you accurate.'],
            ['Assuming fixed deals always beat the cap', 'Compare the fixed unit rate against the current cap before committing.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Does the price cap limit my total bill?', a: 'No. It caps the unit rate and standing charge. Use more energy and you pay more, there is no ceiling on the total.' },
            { q: 'How often does the cap change?', a: 'Every quarter. Ofgem announces the next cap a few weeks before each three-month window starts.' },
            { q: 'Why are my rates different from the averages?', a: 'Unit rates and standing charges vary across the 14 GB regions and by payment method (Direct Debit is usually cheapest).' },
            { q: 'Should I fix my tariff?', a: 'A fixed deal gives certainty and can beat the cap, but you may pay an exit fee if you leave early. Compare the fixed unit rate against the current cap.' },
          ]} />
        </GuideSection>
        <RelatedGuides calc="/energy-bill" />
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
