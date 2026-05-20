'use client';

import { useState, useMemo } from 'react';
import { Check, X, ExternalLink, Car, ShieldCheck } from 'lucide-react';
import { inspectReg } from '../../lib/mot/reg';

export default function MotCheckClient() {
  const [reg, setReg] = useState<string>('AB12 CDE');
  const info = useMemo(() => inspectReg(reg), [reg]);
  const clean = info.normalised.replace(/\s+/g, '');

  return (
    <div className="max-w-3xl mx-auto space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Reg-plate input */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-7 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.06)]">
        <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#76777e]">UK number plate</span>
        <div className="mt-3 inline-flex items-center bg-[#FFEC4F] border-[3px] border-black rounded-lg px-5 py-2.5 shadow-[2px_2px_0_0_rgba(0,0,0,0.6)]">
          <input
            type="text"
            value={reg}
            onChange={(e) => setReg(e.target.value)}
            placeholder="AB12 CDE"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            className="bg-transparent text-[28px] md:text-[34px] font-black tracking-[0.08em] uppercase outline-none placeholder:text-black/35 w-[10ch] tabular-nums"
            style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', color: '#000' }}
          />
        </div>
        <div className="mt-3 flex items-center gap-2 text-[12.5px]">
          {info.valid ? (
            <>
              <span className="inline-flex w-5 h-5 rounded-full bg-[#dcfce7] text-[#15803d] items-center justify-center">
                <Check className="w-3 h-3" />
              </span>
              <span className="text-[#0A2540]">
                Valid format · {info.era === 'modern' ? `${info.ageHint}` : info.ageHint}
              </span>
            </>
          ) : (
            <>
              <span className="inline-flex w-5 h-5 rounded-full bg-[#fee2e2] text-[#b91c1c] items-center justify-center">
                <X className="w-3 h-3" />
              </span>
              <span className="text-[#7f1d1d]">
                Not a recognised UK plate format. Try the modern style: two letters, two numbers, three letters (e.g. AB12 CDE).
              </span>
            </>
          )}
        </div>
      </div>

      {/* Official check links */}
      {info.valid && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href={`https://www.check-mot.service.gov.uk/?registration=${encodeURIComponent(clean)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white border border-[#E5E7EB] hover:border-[#0A2540] rounded-xl p-5 md:p-6 transition-colors flex flex-col gap-3"
          >
            <span className="inline-flex w-11 h-11 rounded-xl items-center justify-center" style={{ background: '#00C4B414', color: '#00C4B4' }}>
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-[#0A2540] text-[15.5px]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                Check MOT history
              </h3>
              <p className="mt-1 text-[12.5px] text-[#76777e] leading-snug">
                Official DVSA service. Shows expiry date, full pass/fail history and recorded advisories for {info.normalised}.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#0A2540] group-hover:gap-2 transition-[gap]">
              Open on gov.uk <ExternalLink className="w-3 h-3" />
            </span>
          </a>

          <a
            href="https://www.vehicleenquiry.service.gov.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white border border-[#E5E7EB] hover:border-[#0A2540] rounded-xl p-5 md:p-6 transition-colors flex flex-col gap-3"
          >
            <span className="inline-flex w-11 h-11 rounded-xl items-center justify-center" style={{ background: '#C9A14A14', color: '#C9A14A' }}>
              <Car className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-[#0A2540] text-[15.5px]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                Check tax status (VED)
              </h3>
              <p className="mt-1 text-[12.5px] text-[#76777e] leading-snug">
                Official DVLA vehicle enquiry. Shows tax-disc expiry, SORN status, CO₂ emissions and tax band.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#0A2540] group-hover:gap-2 transition-[gap]">
              Open on gov.uk <ExternalLink className="w-3 h-3" />
            </span>
          </a>
        </div>
      )}

      <p className="text-[12px] text-[#76777e] leading-relaxed">
        We don{`'`}t store or transmit your reg plate. Both gov.uk services are free, public and the authoritative source for MOT and tax status — anything else (paid HPI / data checks) builds on these same DVLA records.
      </p>
    </div>
  );
}
