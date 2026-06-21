'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

const SMALL_MULT = 0.499;   // 49.9p, RV under £51,000
const STD_MULT = 0.555;     // 55.5p, RV £51,000+
const SBRR_FULL = 12000;    // 100% relief at or below
const SBRR_TAPER_TOP = 15000;

const RELATED = [
  { href: '/vat-calculator', label: 'VAT Calculator', hint: 'Add/remove 20% VAT' },
  { href: '/corporation-tax-calculator', label: 'Corporation Tax', hint: '19% / 25% + marginal relief' },
  { href: '/paye-employer-cost', label: 'Employer Cost', hint: 'True cost of a hire' },
  { href: '/sole-trader-vs-limited', label: 'Sole Trader vs Limited', hint: 'Structure comparison' },
];

export default function BusinessRates() {
  const [rv, setRv] = useState(20000);
  const [onlyProperty, setOnlyProperty] = useState(true);

  const r = useMemo(() => {
    const multiplier = rv >= 51000 ? STD_MULT : SMALL_MULT;
    const grossBill = rv * multiplier;

    // Small Business Rate Relief (only on a single eligible property)
    let reliefPct = 0;
    if (onlyProperty) {
      if (rv <= SBRR_FULL) reliefPct = 1;
      else if (rv < SBRR_TAPER_TOP) reliefPct = (SBRR_TAPER_TOP - rv) / (SBRR_TAPER_TOP - SBRR_FULL);
    }
    const relief = grossBill * reliefPct;
    const netBill = grossBill - relief;
    const monthly = netBill / 12;

    return { multiplier, grossBill, reliefPct, relief, netBill, monthly };
  }, [rv, onlyProperty]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Business', href: '/category/business' }, { label: 'Business Rates' }]}
      title="Business Rates Calculator"
      subtitle="Estimate your 2025/26 business rates bill in England, rateable value × multiplier, with Small Business Rate Relief applied automatically."
      calcLabel="Calculate Business Rates"
      inputs={
        <Panel title="Your Property">
          <div className="space-y-4">
            <Field label="Rateable value (RV)" hint="Find yours on the VOA website, it's the open-market annual rent estimate at 1 April 2024">
              <MoneyInput value={rv} onChange={setRv} step={1000} />
            </Field>
            <Field label="This is my only business property">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={onlyProperty} onChange={(e) => setOnlyProperty(e.target.checked)} className="w-4 h-4 accent-primary" />
                <span className="text-on-surface-variant">Eligible for Small Business Rate Relief</span>
              </label>
            </Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Annual Bill" value={gbp(r.netBill)} sub="After relief" tone="dark" big />
            <Stat label="Per Month" value={gbp(r.monthly)} sub="Typically over 10 instalments" tone="primary" />
            <Stat label="Multiplier" value={`${(r.multiplier * 100).toFixed(1)}p`} sub={rv >= 51000 ? 'Standard' : 'Small business'} tone="accent" />
            <Stat label="Relief Applied" value={pct(r.reliefPct * 100)} sub={r.reliefPct > 0 ? 'Small Business Rate Relief' : 'No relief'} />
          </div>

          <Panel title="How the bill is built">
            <div className="space-y-2 text-sm w-full">
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Rateable value</span><span className="font-semibold tabular-nums">{gbp(rv)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">× Multiplier ({(r.multiplier * 100).toFixed(1)}p)</span><span className="font-semibold tabular-nums">{gbp(r.grossBill)}</span></div>
              {r.relief > 0 && (
                <div className="flex justify-between"><span className="text-on-surface-variant font-medium">− Small Business Rate Relief</span><span className="font-semibold tabular-nums text-primary">−{gbp(r.relief)}</span></div>
              )}
              <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant font-bold">Net annual bill</span><span className="font-bold tabular-nums text-secondary text-base">{gbp(r.netBill)}</span></div>
            </div>
          </Panel>

          {rv <= SBRR_FULL && onlyProperty && (
            <Callout tone="tip" title="You pay nothing">
              With a rateable value of £12,000 or less on your only property, full Small Business Rate Relief means a <strong>£0</strong> bill, but you still need to apply through your local council.
            </Callout>
          )}

          <p className="text-[11px] text-on-surface-variant">Estimate for England, 2025/26. Wales, Scotland and Northern Ireland use different multipliers and reliefs. Other reliefs (retail, charity, rural) may also apply.</p>
        </>
      }
    >
      <Guide
        title="UK Business Rates explained (2025/26)"
        intro="Business rates are the commercial equivalent of council tax, a tax on most non-domestic properties like shops, offices, pubs and warehouses. Your bill is your property's rateable value multiplied by a 'multiplier' set by central government, minus any reliefs you qualify for."
      >
        <GuideSection kicker="The basics" title="Rateable value × multiplier">
          <p>Every non-domestic property has a <strong>rateable value (RV)</strong> set by the Valuation Office Agency (VOA), broadly its estimated annual open-market rent. The current values took effect on 1 April 2023 and reflect rents at 1 April 2021; a new revaluation list applies from April 2026.</p>
          <p>You multiply the RV by the relevant multiplier (pence in the pound) to get the gross bill:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Small business multiplier, 49.9p:</strong> used where RV is below £51,000.</li>
            <li><strong>Standard multiplier, 55.5p:</strong> used where RV is £51,000 or more.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Relief" title="Small Business Rate Relief (SBRR)">
          <p>SBRR can wipe out or sharply reduce your bill if you occupy a single property:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>RV £12,000 or less:</strong> 100% relief, you pay nothing.</li>
            <li><strong>RV £12,001 to £15,000:</strong> relief tapers from 100% down to 0% on a sliding scale.</li>
            <li><strong>RV above £15,000:</strong> no SBRR, but you still benefit from the lower small-business multiplier up to £51,000.</li>
          </ul>
          <p>You generally only get SBRR on one property. Relief is not automatic, apply through your local council.</p>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A shop with £20,000 rateable value">
          <p>Take a single high-street shop with a rateable value of £20,000:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>RV is below £51,000, so the small-business multiplier of 49.9p applies.</li>
            <li>Gross bill: £20,000 × 0.499 = <strong>£9,980</strong>.</li>
            <li>RV is above £15,000, so no Small Business Rate Relief.</li>
            <li>Annual bill ≈ £9,980, usually paid over 10 monthly instalments of about £998.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Other reliefs" title="Reliefs beyond SBRR">
          <p>Depending on your sector and location you may also qualify for retail, hospitality and leisure relief, charitable rate relief (80%), rural rate relief, or transitional relief that caps year-on-year increases. These are not modelled above, check with your council.</p>
          <Callout tone="warn" title="Empty property still gets charged">
            After an initial three-month exemption (six months for industrial property), empty commercial premises usually attract full business rates. Don't assume an empty unit is free.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common business rates mistakes">
          <Mistakes items={[
            ['Not applying for SBRR', 'Relief is not automatic, thousands of small firms overpay because they never claimed it from their council.'],
            ['Claiming SBRR on multiple properties', 'You generally only get relief on one property; taking a second occupied unit can cost you the relief entirely.'],
            ['Ignoring your right to challenge', 'If you think your rateable value is too high you can challenge it through the VOA "Check, Challenge, Appeal" service.'],
            ['Forgetting empty-property rates', 'Vacant units are only exempt for three months, then full rates resume.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Do I pay business rates working from home?', a: 'Usually not, if you only use a room for light office work. But a dedicated business space (a converted garage shop, for example) can be rated. Council tax still applies to the home.' },
            { q: 'How do I find my rateable value?', a: 'Search your property on the Valuation Office Agency (VOA) website at gov.uk. It lists the current rateable value free of charge.' },
            { q: 'Who sets the multipliers?', a: 'Central government sets the multipliers each year, usually rising with inflation. Local councils collect the bills and administer reliefs.' },
            { q: 'Can I pay monthly?', a: 'Yes. Bills are typically spread over 10 monthly instalments by default, and you can request 12 instalments from your council.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
