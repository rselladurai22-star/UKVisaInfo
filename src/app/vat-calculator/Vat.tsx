'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Choice, Toggle,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

const RELATED = [
  { href: '/self-employed-tax', label: 'Self-Employed Tax', hint: 'Sole trader tax & Class 4' },
  { href: '/sole-trader-vs-limited', label: 'Sole Trader vs Limited', hint: 'Structure comparison' },
  { href: '/corporation-tax-calculator', label: 'Corporation Tax', hint: '19% / 25% + marginal relief' },
  { href: '/director-dividend', label: 'Dividend Tax', hint: 'Director salary & dividends' },
];

const FRS_SECTORS = [
  { value: '16.5', label: 'Limited Cost Trader (16.5%)', desc: 'Spend very little on relevant goods (e.g. service businesses)' },
  { value: '14.5', label: 'IT / Computer Consultancy (14.5%)', desc: 'Software developers, IT support, tech consultants' },
  { value: '12.5', label: 'Catering / Accommodation (12.5%)', desc: 'Hotels, restaurants, cafes, catering services' },
  { value: '11.0', label: 'Advertising / Journalism (11.0%)', desc: 'PR, copywriters, marketers, designers' },
  { value: '7.5', label: 'Retailing (7.5%)', desc: 'Retail shops, e-commerce stores' },
  { value: '12.0', label: 'General / Other (12.0%)', desc: 'Other business sectors not listed' },
];

export default function Vat() {
  const [amount, setAmount] = useState(1000);
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [rateType, setRateType] = useState<'standard' | 'reduced' | 'custom'>('standard');
  const [customRate, setCustomRate] = useState(20);

  // FRS comparison states
  const [compareFrs, setCompareFrs] = useState(false);
  const [annualTurnover, setAnnualTurnover] = useState(100000);
  const [frsSectorRate, setFrsSectorRate] = useState('16.5');
  const [firstYearDiscount, setFirstYearDiscount] = useState(true);
  const [annualInputVat, setAnnualInputVat] = useState(1500);

  const r = useMemo(() => {
    const ratePct = rateType === 'standard' ? 20 : rateType === 'reduced' ? 5 : customRate;
    const rate = ratePct / 100;

    let net = 0;
    let vat = 0;
    let gross = 0;

    if (mode === 'add') {
      net = amount;
      vat = amount * rate;
      gross = net + vat;
    } else {
      gross = amount;
      net = amount / (1 + rate);
      vat = gross - net;
    }

    // FRS calculation
    const baseFrsRate = parseFloat(frsSectorRate);
    const activeFrsRate = Math.max(0, baseFrsRate - (firstYearDiscount ? 1 : 0));
    
    // Assume annual turnover is gross sales
    const annualNetSales = annualTurnover / (1 + rate);
    const annualSalesVatCollected = annualTurnover - annualNetSales;
    
    const standardVatPaid = Math.max(0, annualSalesVatCollected - annualInputVat);
    const standardNetPosition = annualNetSales + annualInputVat; // Net sales + recovered VAT

    const frsTaxPaid = annualTurnover * (activeFrsRate / 100);
    const frsNetPosition = annualTurnover - frsTaxPaid; // Gross sales - flat tax paid

    const frsSavings = frsNetPosition - standardNetPosition;
    const isFrsBetter = frsSavings > 0;

    return {
      ratePct,
      net,
      vat,
      gross,
      activeFrsRate,
      standardVatPaid,
      frsTaxPaid,
      frsSavings,
      isFrsBetter,
      standardNetPosition,
      frsNetPosition,
    };
  }, [amount, mode, rateType, customRate, compareFrs, annualTurnover, frsSectorRate, firstYearDiscount, annualInputVat]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Business', href: '/category/business' }, { label: 'VAT Calculator' }]}
      title="VAT Calculator"
      subtitle="Free UK VAT calculator. Add or remove standard rate 20%, reduced rate 5%, or custom VAT rates. Plus, compare your options under the Flat Rate Scheme."
      calcLabel="Calculate VAT"
      inputs={
        <div className="space-y-4">
          <Panel title="VAT Calculation Settings">
            <div className="space-y-4">
              <Field label="Calculation Mode">
                <Choice<'add' | 'remove'>
                  name="mode"
                  value={mode}
                  onChange={setMode}
                  options={[
                    { value: 'add', label: 'Add VAT to net amount', desc: 'Calculate VAT and gross price from net' },
                    { value: 'remove', label: 'Remove VAT from gross amount', desc: 'Calculate VAT and net price from gross' },
                  ]}
                />
              </Field>
              <Field label="Amount to calculate"><MoneyInput value={amount} onChange={setAmount} step={100} /></Field>
              <Field label="VAT Rate Selection">
                <Choice<'standard' | 'reduced' | 'custom'>
                  name="rateType"
                  value={rateType}
                  onChange={setRateType}
                  options={[
                    { value: 'standard', label: 'Standard Rate (20%)', desc: 'Applies to most goods and services' },
                    { value: 'reduced', label: 'Reduced Rate (5%)', desc: 'Energy, sanitary products, children car seats' },
                    { value: 'custom', label: 'Custom Rate (%)', desc: 'Enter a custom percentage below' },
                  ]}
                />
              </Field>
              {rateType === 'custom' && (
                <Field label="Custom VAT Rate (%)">
                  <NumberInput value={customRate} onChange={setCustomRate} suffix="%" min={0} step={0.5} />
                </Field>
              )}
            </div>
          </Panel>

          <Toggle
            checked={compareFrs}
            onChange={setCompareFrs}
            label={<strong>Compare with Flat Rate Scheme (FRS)</strong>}
          />

          {compareFrs && (
            <Panel title="Flat Rate Scheme (FRS) Inputs">
              <div className="space-y-4">
                <Field label="Estimated Annual Gross Turnover" hint="Your total sales including VAT"><MoneyInput value={annualTurnover} onChange={setAnnualTurnover} step={5000} /></Field>
                <Field label="Your Business Sector FRS Rate">
                  <Choice<string>
                    name="frsSector"
                    value={frsSectorRate}
                    onChange={setFrsSectorRate}
                    options={FRS_SECTORS}
                  />
                </Field>
                <Toggle
                  checked={firstYearDiscount}
                  onChange={setFirstYearDiscount}
                  label="In first year of VAT registration (1% discount)"
                />
                <Field label="Annual Reclaimable Input VAT" hint="VAT paid on business purchases (can only reclaim under standard scheme)"><MoneyInput value={annualInputVat} onChange={setAnnualInputVat} step={500} /></Field>
              </div>
            </Panel>
          )}
        </div>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="VAT Amount" value={gbp(r.vat, 2)} sub={`${r.ratePct}% rate`} tone="dark" big />
            <Stat label="Net Amount (Excl. VAT)" value={gbp(r.net, 2)} sub="Without tax" tone="primary" />
            <Stat label="Gross Amount (Incl. VAT)" value={gbp(r.gross, 2)} sub="Total price" tone="accent" />
          </div>

          <Panel title="Calculation Details">
            <div className="space-y-2 text-sm w-full">
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Net Price (Excluding VAT)</span><span className="font-semibold tabular-nums">{gbp(r.net, 2)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">VAT Element ({r.ratePct}%)</span><span className="font-semibold tabular-nums text-primary">{gbp(r.vat, 2)}</span></div>
              <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant font-bold">Gross Price (Including VAT)</span><span className="font-bold tabular-nums text-secondary text-base">{gbp(r.gross, 2)}</span></div>
            </div>
          </Panel>

          {compareFrs && (
            <Panel title="Flat Rate Scheme (FRS) vs Standard VAT Comparison">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl border border-outline-variant bg-surface-container-lowest">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Standard VAT (Annual)</span>
                    <div className="text-lg font-bold text-primary tabular-nums mt-1">{gbp(r.standardNetPosition)}</div>
                    <span className="text-[11px] text-on-surface-variant">Net sales kept + expenses VAT reclaimed</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-outline-variant bg-surface-container-lowest">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Flat Rate Scheme (Annual)</span>
                    <div className="text-lg font-bold text-secondary tabular-nums mt-1">{gbp(r.frsNetPosition)}</div>
                    <span className="text-[11px] text-on-surface-variant">Gross turnover minus {r.activeFrsRate}% flat rate</span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${r.isFrsBetter ? 'border-emerald-500 bg-emerald-50/25' : 'border-blue-500 bg-blue-50/25'} text-sm`}>
                  <h4 className="font-bold text-on-surface flex items-center gap-2">
                    {r.isFrsBetter ? 'Flat Rate Scheme is Better' : 'Standard Scheme is Better'}
                  </h4>
                  <p className="mt-1 text-on-surface-variant leading-relaxed">
                    By choosing the {r.isFrsBetter ? 'Flat Rate Scheme' : 'Standard Scheme'}, your business retains{' '}
                    <strong>{gbp(Math.abs(r.frsSavings))}</strong> more per year. FRS simplifies bookkeeping but rules out reclaiming VAT on daily purchases.
                  </p>
                </div>
              </div>
            </Panel>
          )}

          {annualTurnover >= 90000 && (
            <Callout tone="warn" title="VAT Registration Threshold">
              Your turnover is at or above the 2025/26 UK VAT registration threshold of <strong>£90,000</strong>. You are legally required to register for VAT unless you qualify for an exemption.
            </Callout>
          )}
          
          <p className="text-[11px] text-on-surface-variant">Estimates are based on 2025/26 HMRC guidelines. Ensure you follow Making Tax Digital rules for VAT returns.</p>
        </>
      }
    >
      <Guide
        title="Understanding UK Value Added Tax (VAT)"
        intro="VAT is a consumption tax charged on most goods and services in the UK. Managing VAT is one of the most critical aspects of running a business. This guide covers the basics, thresholds, FRS, and common pitfalls."
      >
        <GuideSection kicker="VAT Basics" title="How to Calculate VAT (Formula)">
          <p>Calculating VAT is simple when you know the formulas. To add VAT to an amount, multiply the net price by the VAT rate and add it to the original figure:</p>
          <pre className="bg-surface-container p-3 rounded-lg text-xs font-mono tabular-nums text-on-surface">
            Gross Price = Net Price × (1 + VAT Rate){'\n'}
            Example (20% VAT): £100 × 1.20 = £120. VAT = £20.
          </pre>
          <p>To remove VAT from a gross amount (finding the net price before VAT was added), divide the gross price by 1 plus the VAT rate:</p>
          <pre className="bg-surface-container p-3 rounded-lg text-xs font-mono tabular-nums text-on-surface">
            Net Price = Gross Price / (1 + VAT Rate){'\n'}
            Example (20% VAT): £120 / 1.20 = £100. VAT = £20.
          </pre>
        </GuideSection>

        <GuideSection kicker="Thresholds" title="VAT Registration & Deregistration (2025/26)">
          <p>You must register your business for VAT if your VAT-taxable turnover goes over <strong>£90,000</strong> in any 12-month period, or if you expect it to cross that threshold in the next 30 days. You can also choose to register voluntarily if your turnover is below £90,000, which can help you reclaim VAT on purchases if your clients are other VAT-registered businesses.</p>
          <p>If your turnover drops below <strong>£88,000</strong>, you can apply to deregister from VAT and stop charging it. Keeping track of rolling 12-month turnover is vital to avoid penalties from HMRC.</p>
        </GuideSection>

        <GuideSection kicker="FRS" title="What is the VAT Flat Rate Scheme?">
          <p>The Flat Rate Scheme (FRS) is designed to simplify bookkeeping for small businesses. Instead of tracking the VAT on every single purchase and sale, you charge standard VAT (20%) as normal, but pay a fixed, lower percentage of your total gross turnover directly to HMRC.</p>
          <p>Key details of FRS:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>No Input Tax:</strong> You cannot reclaim VAT on business expenses (except capital purchases over £2,000).</li>
            <li><strong>1% Discount:</strong> You get a 1% discount on your flat rate during the first 12 months of VAT registration.</li>
            <li><strong>Limited Cost Trader Rate (16.5%):</strong> If you spend very little on relevant goods (less than 2% of turnover or £1,000 a year), you are classified as a limited cost trader and must pay a high flat rate of 16.5%.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Practical Example" title="Worked Example: IT Consultant">
          <p>Consider an IT consultant earning £100,000 gross turnover (inclusive of VAT), meaning their net sales are £83,333.33 and they collected £16,666.67 in VAT. They have £1,500 of input VAT to reclaim on equipment and bills.</p>
          <p>Under the **Standard Scheme**:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>VAT paid to HMRC = £16,666.67 - £1,500 = £15,166.67.</li>
            <li>Net profit kept = £83,333.33. (Total cash retained: £84,833.33).</li>
          </ul>
          <p>Under the **Flat Rate Scheme (IT Consultant rate is 14.5% - 1% discount = 13.5%)**:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>VAT paid to HMRC = £100,000 × 13.5% = £13,500.</li>
            <li>Net cash retained = £100,000 - £13,500 = £86,500.</li>
            <li><strong>Difference:</strong> The FRS keeps £86,500 vs £84,833.33, saving the business £1,666.67 in its first year!</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common VAT Mistakes">
          <Mistakes items={[
            ['Missing the £90,000 registration threshold', 'This is a rolling 12-month limit, not a tax-year limit. Failing to register on time leads to severe retrospective penalties.'],
            ['Failing to recognize the "Limited Cost Trader" rules', 'Many service businesses register for FRS thinking they will pay 14.5% or 12%, only to find they buy no physical goods, triggering the 16.5% rate which is rarely profitable.'],
            ['Trying to reclaim VAT without a valid invoice', 'You must have a full VAT receipt showing the vendor’s VAT registration number to claim input VAT back.'],
            ['Charging VAT before your registration is active', 'You cannot charge VAT or issue VAT invoices until HMRC issues your registration number. You can, however, increase your gross prices temporarily during the wait.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'What are the different UK VAT rates?', a: 'Standard rate (20%) applies to most goods. Reduced rate (5%) applies to items like domestic utilities. Zero rate (0%) applies to books, basic foods, and children’s clothing.' },
            { q: 'Can I reclaim VAT on my startup expenses?', a: 'Yes. You can reclaim VAT on goods purchased up to 4 years before registration, and services purchased up to 6 months before registration, provided they were bought for the business.' },
            { q: 'What is Making Tax Digital (MTD)?', a: 'MTD is a government initiative requiring all VAT-registered businesses to keep digital records and submit their VAT returns using compatible software (e.g. Xero, QuickBooks).' },
            { q: 'Are dividends subject to VAT?', a: 'No, dividends are corporate profit distributions and are completely outside the scope of VAT.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
