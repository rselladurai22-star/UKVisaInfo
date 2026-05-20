'use client';

import { useState, useMemo } from 'react';
import { calculateIHT, NRB, RNRB } from '../../lib/iht/calc';
import { CalcCard, NumberField, ResultBox, fmtGBP, fmtPct } from '../../components/calc-shell/CalcFormPrimitives';

export default function IhtClient() {
  const [estate, setEstate] = useState('900000');
  const [charity, setCharity] = useState('0');
  const [spouse, setSpouse] = useState('0');
  const [homeToDescendants, setHomeToDescendants] = useState(true);
  const [tnrb, setTnrb] = useState('0');
  const [trnrb, setTrnrb] = useState('0');

  const result = useMemo(() => calculateIHT({
    estateValue: parseFloat(estate) || 0,
    charityGift: parseFloat(charity) || 0,
    spouseLegacy: parseFloat(spouse) || 0,
    homeToDescendants,
    transferredNrb: parseFloat(tnrb) || 0,
    transferredRnrb: parseFloat(trnrb) || 0,
  }), [estate, charity, spouse, homeToDescendants, tnrb, trnrb]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Total estate value" prefix="£" value={estate} onChange={setEstate} hint="Property + savings + investments + chattels." />
        <NumberField label="Legacy to spouse / civil partner" prefix="£" value={spouse} onChange={setSpouse} hint="Fully exempt from IHT." />
        <NumberField label="Charity legacy" prefix="£" value={charity} onChange={setCharity} hint="10%+ of baseline drops the rate to 36%." />
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#76777e] block mb-2">Family home to descendants?</span>
          <div className="inline-flex p-1 bg-[#f3f4f5] rounded-lg">
            {([{ v: true, l: 'Yes' }, { v: false, l: 'No' }] as const).map((o) => (
              <button
                key={String(o.v)}
                type="button"
                onClick={() => setHomeToDescendants(o.v)}
                className={`px-4 py-2 text-[13.5px] font-semibold rounded-md transition-colors ${homeToDescendants === o.v ? 'bg-white text-[#0A2540] shadow-sm' : 'text-[#76777e]'}`}
              >
                {o.l}
              </button>
            ))}
          </div>
          <span className="block mt-1 text-[11.5px] text-[#76777e]">Children / grandchildren = yes (unlocks £175k RNRB).</span>
        </div>
      </div>

      <details className="mt-5">
        <summary className="text-[12.5px] font-semibold text-[#0A2540] cursor-pointer">Late spouse&rsquo;s unused allowances? (optional)</summary>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberField label={`Transferred NRB (max £${NRB.toLocaleString()})`} prefix="£" value={tnrb} onChange={setTnrb} />
          <NumberField label={`Transferred RNRB (max £${RNRB.toLocaleString()})`} prefix="£" value={trnrb} onChange={setTrnrb} />
        </div>
      </details>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultBox label="Inheritance tax" value={fmtGBP(result.iht)} primary sub={`${fmtPct(result.rateApplied)} rate${result.charityRateUsed ? ' (charity)' : ''}`} />
        <ResultBox label="Net to heirs" value={fmtGBP(result.netToHeirs)} accent="#15803d" />
        <ResultBox label="Taxable estate" value={fmtGBP(result.taxableEstate)} muted sub={`After NRB £${result.totalNrb.toLocaleString()} + RNRB £${result.rnrbAfterTaper.toLocaleString()}`} />
      </div>

      {!result.charityRateUsed && result.taxableEstate > 0 && (result.charityShortfall ?? 0) > 0 && (
        <p className="mt-5 text-[12.5px] text-[#76777e] bg-[#fafbfc] border border-[#E5E7EB] rounded-xl p-3">
          To unlock the 36% reduced rate you&rsquo;d need to leave at least {fmtGBP((result.charityShortfall ?? 0) + (parseFloat(charity) || 0))} to charity &mdash; that&rsquo;s {fmtGBP(result.charityShortfall ?? 0)} more than currently.
        </p>
      )}

      <div className="mt-6 pt-6 border-t border-[#E5E7EB] grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-[13px]">
        <Row label="Gross estate" value={fmtGBP(result.grossEstate)} />
        <Row label="Spouse exempt" value={`–${fmtGBP(result.spouseExempt)}`} muted />
        <Row label="Charity exempt" value={`–${fmtGBP(result.charityExempt)}`} muted />
        <Row label="Net estate" value={fmtGBP(result.netEstate)} bold />
        <Row label={`NRB (incl. transferred)`} value={`–${fmtGBP(result.totalNrb)}`} muted />
        <Row label={`RNRB (after taper)`} value={`–${fmtGBP(result.rnrbAfterTaper)}`} muted />
      </div>
    </CalcCard>
  );
}

function Row({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-[#E5E7EB]/40">
      <span className={muted ? 'text-[#76777e]' : 'text-[#0A2540]'}>{label}</span>
      <span className={`tabular-nums ${bold ? 'font-bold text-[#0A2540]' : 'text-[#0A2540]'}`}
        style={bold ? { fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' } : undefined}>{value}</span>
    </div>
  );
}
