'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, NumberInput,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

const BUS_GRANT = 7500; // Boiler Upgrade Scheme

const RELATED = [
  { href: '/energy-bill', label: 'Energy Bill', hint: 'Ofgem price cap' },
  { href: '/solar-panel-roi', label: 'Solar Panel ROI', hint: 'Payback + export tariff' },
  { href: '/ev-charging-cost', label: 'EV Charging Cost', hint: 'Home vs public' },
  { href: '/cost-of-living-uk', label: 'Cost of Living', hint: 'Household spending guide' },
];

export default function HeatPump() {
  const [heatDemand, setHeatDemand] = useState(12000); // kWh/year
  const [boilerEff, setBoilerEff] = useState(90);      // %
  const [scop, setScop] = useState(3.2);
  const [gasPrice, setGasPrice] = useState(7);         // p/kWh
  const [elecPrice, setElecPrice] = useState(27);      // p/kWh
  const [installCost, setInstallCost] = useState(13000);

  const r = useMemo(() => {
    const gasInput = heatDemand / (boilerEff / 100);
    const gasCost = gasInput * (gasPrice / 100);
    const hpInput = heatDemand / scop;
    const hpCost = hpInput * (elecPrice / 100);
    const annualSaving = gasCost - hpCost;
    const netInstall = Math.max(0, installCost - BUS_GRANT);
    const payback = annualSaving > 0 ? netInstall / annualSaving : 0;
    return { gasCost, hpCost, annualSaving, netInstall, payback, hpInput };
  }, [heatDemand, boilerEff, scop, gasPrice, elecPrice, installCost]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Energy', href: '/category/energy' }, { label: 'Heat Pump' }]}
      title="Heat Pump Cost Calculator"
      subtitle="Compare the running cost of an air source heat pump against a gas boiler, and see the payback after the £7,500 Boiler Upgrade Scheme grant."
      calcLabel="Compare Heating Costs"
      inputs={
        <Panel title="Your Home & Prices">
          <div className="space-y-4">
            <Field label="Annual heat demand (kWh)" hint="A typical home needs ~12,000 kWh of heat a year"><NumberInput value={heatDemand} onChange={setHeatDemand} min={0} step={500} suffix=" kWh" /></Field>
            <Field label="Gas boiler efficiency (%)"><NumberInput value={boilerEff} onChange={setBoilerEff} min={50} step={1} suffix="%" /></Field>
            <Field label="Heat pump SCOP" hint="Seasonal efficiency — typically 3.0–3.5"><NumberInput value={scop} onChange={setScop} min={1} step={0.1} /></Field>
            <Field label="Gas price (p/kWh)"><NumberInput value={gasPrice} onChange={setGasPrice} min={0} step={0.5} suffix="p" /></Field>
            <Field label="Electricity price (p/kWh)"><NumberInput value={elecPrice} onChange={setElecPrice} min={0} step={1} suffix="p" /></Field>
            <Field label="Heat pump install cost"><NumberInput value={installCost} onChange={setInstallCost} min={0} step={500} suffix=" £" /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Heat Pump Running Cost" value={gbp(r.hpCost)} sub="Per year" tone="dark" big />
            <Stat label="Gas Boiler Running Cost" value={gbp(r.gasCost)} sub="Per year" tone="primary" />
            <Stat label="Annual Saving" value={gbp(r.annualSaving)} sub={r.annualSaving >= 0 ? 'Heat pump cheaper' : 'Gas cheaper'} tone="accent" />
            <Stat label="Payback" value={r.annualSaving > 0 ? `${r.payback.toFixed(1)} yrs` : '—'} sub={`After £${BUS_GRANT.toLocaleString()} grant`} />
          </div>

          <Panel title="The numbers">
            <div className="space-y-2 text-sm w-full">
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Install cost</span><span className="font-semibold tabular-nums">{gbp(installCost)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">− Boiler Upgrade Scheme grant</span><span className="font-semibold tabular-nums text-primary">−{gbp(BUS_GRANT)}</span></div>
              <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant font-bold">Net cost to you</span><span className="font-bold tabular-nums text-secondary text-base">{gbp(r.netInstall)}</span></div>
            </div>
          </Panel>

          {r.annualSaving < 0 && (
            <Callout tone="warn" title="Heat pump costs more to run here">
              At these prices the heat pump runs costlier than gas, mainly because electricity is much pricier per kWh than gas. A higher SCOP, a special heat-pump electricity tariff, or solar can flip this.
            </Callout>
          )}

          <p className="text-[11px] text-on-surface-variant">Estimate only. Running cost depends heavily on real-world SCOP, your tariff and how well your home is insulated. The Boiler Upgrade Scheme grant applies in England and Wales subject to eligibility.</p>
        </>
      }
    >
      <Guide
        title="Heat pumps vs gas boilers: the running cost"
        intro="Air source heat pumps are central to the UK's plan to decarbonise home heating, and a £7,500 government grant cuts the upfront cost. But whether one saves you money depends on its efficiency and the gap between gas and electricity prices. Here's how the maths works."
      >
        <GuideSection kicker="The principle" title="Efficiency is everything">
          <p>A gas boiler is about 90% efficient — it turns 1 kWh of gas into roughly 0.9 kWh of heat. A heat pump is different: it moves heat rather than burning fuel, delivering 3 or more units of heat per unit of electricity. That ratio is the <strong>SCOP</strong> (Seasonal Coefficient of Performance), typically 3.0–3.5 for a well-installed system.</p>
        </GuideSection>

        <GuideSection kicker="The price gap" title="Why running cost is a close call">
          <p>Electricity costs around four times as much as gas per kWh under the price cap. A heat pump's 3× efficiency advantage roughly offsets — but not always beats — that price gap. The better the SCOP and the smaller the gas-to-electricity price ratio, the more a heat pump saves. A leaky, poorly-insulated home forces the pump to work harder and lowers its real-world SCOP.</p>
          <Callout tone="tip" title="Special tariffs change the picture">
            Heat-pump and time-of-use electricity tariffs can cut the unit rate substantially, often turning a marginal case into a clear saving. Pairing with solar helps too.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Grants" title="The Boiler Upgrade Scheme">
          <p>In England and Wales, the <strong>Boiler Upgrade Scheme</strong> gives a £7,500 grant towards an air source (or £7,500 for ground source) heat pump, paid to your installer and knocked off the price. Scotland has its own Home Energy Scotland grants and interest-free loans. This brings a typical £13,000 install down to around £5,500 net.</p>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A typical home">
          <p>A home needing 12,000 kWh of heat a year: a 90% gas boiler burns about 13,300 kWh of gas, costing roughly £930 at 7p. A heat pump with a SCOP of 3.2 uses about 3,750 kWh of electricity, costing about £1,010 at 27p — slightly more to run at standard rates. On a heat-pump tariff nearer 15p, the same pump costs about £560, saving around £370 a year.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common heat pump mistakes">
          <Mistakes items={[
            ['Comparing on standard electricity rates', 'Heat-pump tariffs and time-of-use deals materially lower running cost.'],
            ['Skipping insulation', 'A poorly-insulated home cripples the real-world SCOP and inflates bills.'],
            ['Oversizing or undersizing', 'A proper heat-loss survey is essential; the wrong size wastes money or underheats.'],
            ['Ignoring the grant deadline', 'The Boiler Upgrade Scheme has limited funding windows — check current availability.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Are heat pumps cheaper to run than gas?', a: 'Sometimes. On standard rates it can be a close call, but with a good SCOP, a heat-pump tariff or solar, they usually win.' },
            { q: 'How much does a heat pump cost to install?', a: 'Typically £10,000–£15,000 before the £7,500 Boiler Upgrade Scheme grant, which brings the net cost down substantially.' },
            { q: 'What is SCOP?', a: 'The Seasonal Coefficient of Performance — the average units of heat produced per unit of electricity over a year. Higher is better; 3.2 means 3.2 kWh of heat per kWh of electricity.' },
            { q: 'Do heat pumps work in cold weather?', a: 'Yes. They work down to well below freezing, though efficiency falls in very cold spells. Good design and insulation keep performance acceptable.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
