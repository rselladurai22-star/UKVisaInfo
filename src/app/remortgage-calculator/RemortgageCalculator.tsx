'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Slider, Toggle, BarTrack,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { PROPERTY_RELATED } from '../ltv-calculator/LtvCalculator';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

const pay = (loan: number, ratePct: number, years: number) => {
  const i = ratePct / 100 / 12; const n = Math.max(1, Math.round(years * 12));
  return i === 0 ? loan / n : (loan * i) / (1 - Math.pow(1 + i, -n));
};

export default function RemortgageCalculator() {
  const [balance, setBalance] = useState(210000);
  const [term, setTerm] = useState(20);
  const [currentRate, setCurrentRate] = useState(6.8);
  const [newRate, setNewRate] = useState(4.5);
  const [fee, setFee] = useState(999);
  const [addFee, setAddFee] = useState(true);
  const [erc, setErc] = useState(0);
  const [dealYears, setDealYears] = useState(5);

  const r = useMemo(() => {
    const currentMonthly = pay(balance, currentRate, term);
    const newLoan = balance + (addFee ? fee : 0);
    const newMonthly = pay(newLoan, newRate, term);
    const monthlySaving = currentMonthly - newMonthly;
    const upfront = (addFee ? 0 : fee) + erc;
    const grossSavingDeal = monthlySaving * 12 * dealYears;
    const netSavingDeal = grossSavingDeal - upfront - (addFee ? 0 : 0); // fee handled in loan if added
    const totalCost = fee + erc;
    const netSaving = monthlySaving * 12 * dealYears - totalCost + (addFee ? 0 : 0);
    const breakevenMonths = monthlySaving > 0 ? Math.ceil(totalCost / monthlySaving) : Infinity;
    return { currentMonthly, newMonthly, monthlySaving, netSaving, breakevenMonths, totalCost };
  }, [balance, term, currentRate, newRate, fee, addFee, erc, dealYears]);

  const worth = r.monthlySaving > 0 && r.netSaving > 0;

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Property', href: '/category/property' }, { label: 'Remortgage Calculator' }]}
      title="Remortgage Calculator"
      subtitle="Compare your current deal with a new rate to see your monthly saving, how long it takes to recover the fees, and your net saving over the new fixed period."
      inputs={
        <>
          <Panel title="Current mortgage">
            <div className="space-y-4">
              <Field label="Outstanding balance"><MoneyInput value={balance} onChange={setBalance} step={1000} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Current rate, ${pct(currentRate, 2)}`}><Slider value={currentRate} onChange={setCurrentRate} min={0.5} max={10} step={0.05} /></Field>
                <Field label="Years left"><NumberInput value={term} onChange={setTerm} suffix="yrs" /></Field>
              </div>
              <Field label="Early repayment charge (if any)"><MoneyInput value={erc} onChange={setErc} step={250} /></Field>
            </div>
          </Panel>
          <Panel title="New deal">
            <div className="space-y-4">
              <Field label={`New rate, ${pct(newRate, 2)}`}><Slider value={newRate} onChange={setNewRate} min={0.5} max={10} step={0.05} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Product fee"><MoneyInput value={fee} onChange={setFee} step={100} /></Field>
                <Field label={`Deal length, ${dealYears}y`}><Slider value={dealYears} onChange={setDealYears} min={1} max={10} step={1} /></Field>
              </div>
              <Toggle checked={addFee} onChange={setAddFee} label="Add the product fee to the loan" />
            </div>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="New monthly payment" value={gbp(r.newMonthly, 0)} sub={`was ${gbp(r.currentMonthly, 0)}`} tone="dark" big />
            <Stat label="Monthly saving" value={gbp(r.monthlySaving, 0)} sub={r.monthlySaving >= 0 ? 'cheaper' : 'more expensive'} tone="accent" />
            <Stat label="Net saving over deal" value={gbp(r.netSaving)} sub={`${dealYears}y, after fees`} />
          </div>

          <div className={`p-4 rounded-xl border ${worth ? 'bg-primary text-white border-primary' : 'bg-secondary-soft/40 border-secondary/20'}`}>
            <div className="text-xs uppercase tracking-wider font-bold opacity-80">Verdict</div>
            <div className="text-lg sm:text-xl font-display font-extrabold mt-1">
              {r.monthlySaving <= 0
                ? 'The new rate costs more each month'
                : isFinite(r.breakevenMonths)
                  ? `You recover the ${gbp(r.totalCost)} costs in ${r.breakevenMonths} months`
                  : 'No saving at these figures'}
            </div>
          </div>

          <Panel title="Monthly payment: now vs new">
            <BarTrack segments={[{ value: r.currentMonthly, color: ACCENT }, { value: Math.max(0, r.currentMonthly - r.newMonthly), color: 'transparent' }]} />
            <div className="flex justify-between text-xs text-on-surface-variant mt-1"><span>Now {gbp(r.currentMonthly, 0)}</span></div>
            <div className="mt-2"><BarTrack segments={[{ value: r.newMonthly, color: PRIMARY }, { value: Math.max(0, r.currentMonthly - r.newMonthly), color: '#eceef0' }]} /></div>
            <div className="flex justify-between text-xs text-on-surface-variant mt-1"><span>New {gbp(r.newMonthly, 0)}</span><span className="text-secondary font-semibold">save {gbp(r.monthlySaving, 0)}/mo</span></div>
          </Panel>

          <p className="text-[11px] text-on-surface-variant">Estimate only. A real comparison should weigh the total cost over the deal period including all fees, not just the headline rate.</p>
        </>
      }
    >
      <Guide
        title="When does remortgaging pay off?"
        intro="Remortgaging can save thousands, or cost you, once fees and early repayment charges are counted. This guide shows how to compare deals properly, avoid the standard-variable-rate trap, and time your switch."
      >
        <GuideSection kicker="The basics" title="What remortgaging means">
          <p>Remortgaging is switching your existing mortgage to a new deal, either with a new lender or, as a <em>product transfer</em>, a new rate with your current one. People do it to escape a rising standard variable rate, lock in certainty with a fix, release equity, or simply secure a cheaper rate. The decision comes down to one thing: does the saving outweigh the cost of switching?</p>
        </GuideSection>
        <GuideSection kicker="The trap" title="The standard variable rate (SVR)">
          <p>When a fixed or tracker deal ends, you roll onto the lender&apos;s SVR, almost always their most expensive rate, and one that can change at the lender&apos;s discretion. Drifting onto the SVR is the single most common way borrowers overpay, sometimes by hundreds a month. Set a reminder about six months before your deal ends and line up the next one.</p>
          <Callout tone="warn" title="Start early">You can usually agree a new deal up to six months ahead and have it start when your current one ends, avoiding even a single month on the SVR.</Callout>
        </GuideSection>
        <GuideSection kicker="The maths" title="Rate vs fees, compare total cost">
          <p>A headline-low rate often comes with a large product fee (commonly £999 to £1,499), while fee-free deals carry a slightly higher rate. The right choice depends on your balance: on a big loan a low rate with a fee usually wins; on a small loan the fee can outweigh the rate saving. Always compare the <strong>total cost over the deal period</strong>, payments plus fees, not the rate alone. Adding the fee to the loan spreads it but means paying interest on it for years.</p>
        </GuideSection>
        <GuideSection kicker="Costs" title="Early repayment charges and switching costs">
          <p>If you remortgage during a fixed period, you may pay an <strong>early repayment charge</strong> (often 1 to 5% of the balance), frequently large enough to wipe out any saving, so most people switch when their deal ends. Other costs can include valuation and legal fees, though many remortgage deals include these free. The breakeven figure above shows how many months of saving it takes to recover the upfront cost.</p>
        </GuideSection>
        <GuideSection kicker="Leverage" title="Your LTV at remortgage">
          <p>House-price growth and the capital you&apos;ve repaid since you bought may have lowered your LTV into a cheaper band, meaning a better rate than your original deal even if market rates are similar. Always check your current LTV before assuming you can&apos;t improve on your rate.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Lapsing onto the SVR', 'The costliest mistake. Arrange the next deal before your current one ends.'],
            ['Judging by rate alone', 'A big fee can erase the saving on a smaller loan. Compare total cost over the deal.'],
            ['Remortgaging mid-fix', 'Early repayment charges often outweigh the saving, usually wait until the deal ends.'],
            ['Ignoring product transfers', 'Staying with your lender on a new rate can be quicker and fee-light; compare it with switching.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'When should I remortgage?', a: 'Usually as your current fixed or tracker deal is ending, to avoid rolling onto the standard variable rate. You can typically secure a new deal up to six months in advance.' },
            { q: 'Is a remortgage worth it for a small saving?', a: 'Compare the total saving over the deal period against all the fees and any early repayment charge. The breakeven point shows how long until you are genuinely better off.' },
            { q: 'What is a product transfer?', a: 'Switching to a new rate with your existing lender without moving the mortgage. It is often quicker and may avoid legal and valuation work, but you should still compare it against remortgaging elsewhere.' },
            { q: 'Will remortgaging hurt my credit score?', a: 'A new application involves a credit check, which has a small, temporary effect. Provided you keep up payments, the long-term impact is negligible.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={PROPERTY_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
