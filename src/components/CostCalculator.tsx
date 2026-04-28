'use client';

import { useState } from 'react';
import { 
  Calculator, Info, RefreshCw, 
  CreditCard, ShieldPlus, Zap, 
  HelpCircle, ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

export default function CostCalculator() {
  const [visaType, setVisaType] = useState('Skilled Worker');
  const [years, setYears] = useState(3);
  const [priority, setPriority] = useState('Standard');
  const [location, setLocation] = useState('Outside UK');

  // April 2026 fees
  const baseFees: Record<string, number> = {
    'Skilled Worker': 827,
    'Health and Care': 304,
    'Student': 565,
    'Standard Visitor': 127,
    'Family': 1938,
  };

  const ihsPerYear = visaType === 'Student' ? 776 : visaType === 'Health and Care' ? 0 : 1035;
  const isVisitor = visaType === 'Standard Visitor';
  
  const applicationFee = baseFees[visaType] || 0;
  const ihsFee = isVisitor ? 0 : ihsPerYear * years;
  const priorityFee = priority === 'Priority' ? 500 : priority === 'Super' ? 1000 : 0;
  
  const total = applicationFee + ihsFee + priorityFee;

  const applyUrls: Record<string, string> = {
    'Skilled Worker': 'https://www.gov.uk/skilled-worker-visa/apply-from-outside-the-uk',
    'Health and Care': 'https://www.gov.uk/health-care-worker-visa',
    'Student': 'https://www.gov.uk/student-visa/apply',
    'Standard Visitor': 'https://www.gov.uk/standard-visitor/apply-standard-visitor-visa',
    'Family': 'https://www.gov.uk/uk-family-visa/apply-partner',
  };

  const emailEstimate = () => {
    const subject = encodeURIComponent(`UK Visa Cost Estimate — ${visaType}`);
    const body = encodeURIComponent(
      `Visa: ${visaType}\nLocation: ${location}\nDuration: ${isVisitor ? 'N/A' : years + ' years'}\nService: ${priority}\n\n` +
      `Application Fee: £${applicationFee}\nIHS: £${ihsFee}\nPriority: £${priorityFee}\nTotal: £${total}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-primary mb-4">Cost Calculator</h1>
        <p className="text-on-surface-variant max-w-2xl leading-relaxed">
          Estimate the total cost of your UK visa application, including the Immigration Health Surcharge (IHS) and priority service fees.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Calculator Settings */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-diplomat border border-outline-variant/30 space-y-10">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <Calculator className="w-5 h-5 text-secondary" /> 1. Application Details
            </h3>
            
            <div className="space-y-4">
              <label className="block text-sm font-bold text-primary">Visa Category</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.keys(baseFees).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setVisaType(cat)}
                    className={`px-6 py-4 rounded-lg border-2 text-left transition-all ${
                      visaType === cat 
                      ? 'border-secondary bg-secondary/5 ring-4 ring-secondary/5' 
                      : 'border-outline-variant/20 hover:border-outline-variant/50'
                    }`}
                  >
                    <span className={`block font-bold text-sm ${visaType === cat ? 'text-secondary' : 'text-primary'}`}>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-primary">Application Location</label>
                <div className="flex bg-surface-container-low p-1 rounded-lg">
                  {['Outside UK', 'Inside UK'].map(loc => (
                    <button
                      key={loc}
                      onClick={() => setLocation(loc)}
                      className={`flex-grow py-2 rounded-md font-bold text-[10px] uppercase tracking-widest transition-all ${
                        location === loc ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant/60'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {!isVisitor && (
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-primary">Duration (Years)</label>
                  <select 
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm font-bold focus:ring-secondary"
                  >
                    {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>{y} {y === 1 ? 'Year' : 'Years'}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-outline-variant/10">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" /> 2. Processing Speed
            </h3>
            <div className="space-y-3">
              {[
                { id: 'Standard', t: 'Standard Service', d: 'Decision within 3-8 weeks', p: 'Included' },
                { id: 'Priority', t: 'Priority Service', d: 'Decision within 5 working days', p: '+ £500' },
                { id: 'Super', t: 'Super Priority', d: 'Decision by next working day', p: '+ £1,000' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setPriority(opt.id)}
                  className={`w-full flex items-center justify-between p-6 rounded-xl border-2 transition-all ${
                    priority === opt.id ? 'border-primary bg-primary text-white shadow-lg' : 'border-outline-variant/20 bg-surface-container-low hover:border-outline-variant/50'
                  }`}
                >
                  <div className="text-left">
                    <span className="block font-bold text-sm">{opt.t}</span>
                    <span className={`block text-xs ${priority === opt.id ? 'text-white/60' : 'text-on-surface-variant'}`}>{opt.d}</span>
                  </div>
                  <span className="font-mono text-xs">{opt.p}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculation Summary */}
        <div className="lg:col-span-5 sticky top-28">
          <div className="bg-primary text-white rounded-xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/10">
              <h3 className="font-bold text-xl mb-1">Cost Summary</h3>
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Estimated Total (GBP)</p>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-baseline opacity-70">
                  <span className="text-sm">Application Fee ({location})</span>
                  <span className="font-mono text-sm">£{applicationFee.toLocaleString()}</span>
                </div>
                {!isVisitor && (
                  <div className="flex justify-between items-baseline opacity-70">
                    <span className="text-sm">Immigration Health Surcharge (IHS)</span>
                    <span className="font-mono text-sm">£{ihsFee.toLocaleString()}</span>
                  </div>
                )}
                {priorityFee > 0 && (
                  <div className="flex justify-between items-baseline opacity-70">
                    <span className="text-sm">{priority} Service Fee</span>
                    <span className="font-mono text-sm">£{priorityFee.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-white/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-secondary">Total Paid Today</span>
                  <span className="text-4xl font-extrabold tracking-tighter">£{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <a href={applyUrls[visaType]} target="_blank" rel="noopener noreferrer" className="w-full py-5 bg-secondary hover:bg-secondary/90 transition-all text-white font-bold text-sm uppercase tracking-widest rounded shadow-xl flex items-center justify-center gap-2">
                  Start Application <ChevronRight className="w-4 h-4" />
                </a>
                <button onClick={emailEstimate} className="w-full py-4 bg-white/5 hover:bg-white/10 transition-all text-white/70 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded">
                   Email Estimation <CreditCard className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-8 bg-black/20">
               <div className="flex gap-4">
                  <ShieldPlus className="w-10 h-10 text-white/20 flex-shrink-0" />
                  <p className="text-[10px] text-white/50 leading-relaxed uppercase font-medium tracking-wider">
                    All fees are non-refundable even if your visa is refused. Rates reflect the April 2026 Home Office fee schedule.
                  </p>
               </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-surface-container-high rounded-lg flex items-start gap-4 shadow-sm border border-black/5">
             <HelpCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
             <div>
                <h4 className="font-bold text-primary text-sm mb-1">Maintenance Funds</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  You may also need to prove you have at least <strong>£1,270</strong> in personal savings held for 28 consecutive days.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
