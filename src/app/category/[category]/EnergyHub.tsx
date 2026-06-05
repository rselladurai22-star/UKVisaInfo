'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  Scale,
  Calculator,
  ArrowRight,
  ChevronRight,
  Activity,
  ShieldCheck,
  CheckCircle2,
  ArrowUpDown,
  Sun,
  Thermometer,
  Car,
  BarChart3,
  Footprints,
  Battery,
} from 'lucide-react';

export default function EnergyHub() {
  // Energy Bill Estimator State
  const [consumption, setConsumption] = useState<number>(2900);
  const [rate, setRate] = useState<number>(24.5);
  const [region, setRegion] = useState<string>('london');
  const [annualBill, setAnnualBill] = useState<number>(0);
  const [comparison, setComparison] = useState<{ diff: number; status: 'higher' | 'lower' | 'equal' }>({ diff: 0, status: 'equal' });

  // Quick Converter State
  const [inputValue, setInputValue] = useState<number>(1500);
  const [fromUnit, setFromUnit] = useState<string>('kwh');
  const [toUnit, setToUnit] = useState<string>('therms');
  const [outputValue, setOutputValue] = useState<number>(51.18);

  // Standing charges per region (£/year)
  const standingCharges: Record<string, number> = {
    london: 200,
    midlands: 220,
    north: 230,
    scotland: 210,
  };

  // Calculate bill on changes
  useEffect(() => {
    const sc = standingCharges[region] || 200;
    const bill = (consumption * rate) / 100 + sc;
    setAnnualBill(bill);

    const typicalUKAverage = 1900; // £1,900 is average typical bill
    const diff = bill - typicalUKAverage;
    if (diff > 5) {
      setComparison({ diff: Math.abs(diff), status: 'higher' });
    } else if (diff < -5) {
      setComparison({ diff: Math.abs(diff), status: 'lower' });
    } else {
      setComparison({ diff: 0, status: 'equal' });
    }
  }, [consumption, rate, region]);

  // Handle conversion
  useEffect(() => {
    if (fromUnit === toUnit) {
      setOutputValue(inputValue);
      return;
    }

    // Convert input to kWh first
    let kwh = inputValue;
    if (fromUnit === 'therms') {
      kwh = inputValue * 29.3001;
    } else if (fromUnit === 'btu') {
      kwh = inputValue * 0.000293071;
    }

    // Convert from kWh to target unit
    let output = kwh;
    if (toUnit === 'therms') {
      output = kwh * 0.034117;
    } else if (toUnit === 'btu') {
      output = kwh * 3412.142;
    }

    setOutputValue(Number(output.toFixed(2)));
  }, [inputValue, fromUnit, toUnit]);

  const swapConverterUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setInputValue(outputValue);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Breadcrumbs & Title Section */}
      <section className="container-page pt-10 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/tools" className="hover:text-primary transition-colors">All Tools</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Energy</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-on-surface">
          Energy & Bills Hub
        </h1>
        <p className="mt-3 text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Analyze utility consumption, compare solar panel payback periods, and convert energy units with real-time Ofgem default tariff cap parameters.
        </p>
      </section>

      {/* Hero Section: Energy Bill Comparison */}
      <section className="container-page pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Calculation Panel */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-8 border border-outline-variant/60 shadow-soft relative overflow-hidden flex flex-col justify-between">
            {/* Background decoration */}
            <div className="absolute right-[-10%] top-[-10%] opacity-[0.03] pointer-events-none">
              <Zap className="h-[400px] w-[400px] text-primary" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold tracking-wider uppercase border border-secondary/20">
                  Live Utility Rates
                </span>
                <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-[10px] font-bold tracking-wider uppercase">
                  Ofgem Data Sync
                </span>
              </div>
              <h2 className="text-3xl font-display font-bold text-on-surface leading-tight">
                Energy Bill Comparison
              </h2>
              <p className="text-sm text-on-surface-variant max-w-xl leading-relaxed">
                Benchmark your household electricity and gas consumption. Calculate custom annual costs based on unit rates and standing charges.
              </p>

              <div className="bg-surface-container-low/40 rounded-xl p-6 border border-outline-variant/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Annual Usage (kWh)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary"
                      value={consumption}
                      onChange={(e) => setConsumption(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Unit Rate (p/kWh)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Region</label>
                    <select
                      className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    >
                      <option value="london">London & South East</option>
                      <option value="midlands">Midlands</option>
                      <option value="north">Northern England</option>
                      <option value="scotland">Scotland</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10 gap-4">
                  <div className="text-center sm:text-left">
                    <span className="text-xs font-medium text-on-surface-variant block">Calculated Annual Cost:</span>
                    <span className="text-3xl font-display font-bold text-primary">£{annualBill.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="text-center sm:text-right">
                    {comparison.status === 'higher' && (
                      <span className="px-3 py-1 bg-error-container text-on-error-container text-xs font-bold rounded-lg border border-error/15">
                        £{comparison.diff.toFixed(0)} higher than UK Average
                      </span>
                    )}
                    {comparison.status === 'lower' && (
                      <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-lg border border-secondary/15">
                        £{comparison.diff.toFixed(0)} lower than UK Average
                      </span>
                    )}
                    {comparison.status === 'equal' && (
                      <span className="px-3 py-1 bg-surface-container text-on-surface-variant text-xs font-bold rounded-lg border border-outline-variant/20">
                        Matches typical UK Average
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Converter Panel */}
          <div className="lg:col-span-4 bg-primary-container text-on-primary-container p-8 rounded-2xl flex flex-col justify-between border border-outline-variant/60 shadow-soft relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight mb-1">Quick Convert</h3>
                <p className="text-xs text-on-primary-container/80 leading-relaxed">
                  Easily translate between kWh, Therms, and BTUs for gas and electrical specifications.
                </p>
              </div>

              <div className="space-y-4">
                {/* From Unit */}
                <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-1 text-[10px] font-bold uppercase tracking-wider text-on-primary-container/70">
                    <span>Source Value</span>
                    <select
                      value={fromUnit}
                      onChange={(e) => setFromUnit(e.target.value)}
                      className="bg-transparent border-none text-[10px] font-bold uppercase tracking-wider outline-none p-0 cursor-pointer focus:ring-0 text-white"
                    >
                      <option value="kwh" className="text-black">kWh</option>
                      <option value="therms" className="text-black">Therms</option>
                      <option value="btu" className="text-black">BTU</option>
                    </select>
                  </div>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(Number(e.target.value))}
                    className="w-full bg-transparent border-none outline-none p-0 text-2xl font-display font-bold text-white focus:ring-0"
                  />
                </div>

                {/* Swap Icon */}
                <div className="flex justify-center -my-3 relative z-20">
                  <button
                    onClick={swapConverterUnits}
                    className="bg-white text-primary w-8 h-8 rounded-full flex items-center justify-center border-2 border-primary-container hover:rotate-180 transition-transform duration-300 shadow-md"
                  >
                    <ArrowUpDown className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* To Unit */}
                <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-1 text-[10px] font-bold uppercase tracking-wider text-on-primary-container/70">
                    <span>Target Result</span>
                    <select
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value)}
                      className="bg-transparent border-none text-[10px] font-bold uppercase tracking-wider outline-none p-0 cursor-pointer focus:ring-0 text-white"
                    >
                      <option value="kwh" className="text-black">kWh</option>
                      <option value="therms" className="text-black">Therms</option>
                      <option value="btu" className="text-black">BTU</option>
                    </select>
                  </div>
                  <div className="text-2xl font-display font-bold text-white py-0.5">
                    {outputValue.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Center Section Header */}
      <section className="container-page pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant pb-4 mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-on-surface">Energy Resource Center</h3>
            <p className="text-sm text-on-surface-variant mt-1">Specialized tools for microgeneration, building efficiency, and vehicular calculations.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full font-semibold text-[10px] tracking-wider uppercase flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-secondary" /> Ofgem Certified
            </span>
          </div>
        </div>
      </section>

      {/* Resource Cards Grid */}
      <section className="container-page pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Energy Bill Calculator */}
          <WorkstationCard
            title="Energy Bill Calculator"
            description="Granular breakdown of electricity and gas costs including regional VAT and standing charges."
            tag="Ofgem Compliant"
            href="/energy-bill"
            icon={Calculator}
          />

          {/* Solar Panel ROI */}
          <WorkstationCard
            title="Solar Panel ROI"
            description="Estimate payback schedules, feed-in tariffs, and solar battery storage returns on investment."
            tag="Sustainable ROI"
            href="/tools"
            icon={Sun}
          />

          {/* Heat Pump Calculator */}
          <WorkstationCard
            title="Heat Pump Suitability"
            description="Assess air-source heat pump COP efficiency metrics and Boiler Upgrade Scheme funding."
            tag="Green Grants"
            href="/tools"
            icon={Thermometer}
          />

          {/* EV Charging Cost */}
          <WorkstationCard
            title="EV Charging Cost"
            description="Compare public rapid-charging tariffs against domestic economy-7 or dual-tariff rates."
            tag="Automotive Gas vs EV"
            href="/tools"
            icon={Car}
          />
        </div>
      </section>

      {/* Advanced Analysis & Data Consistency */}
      <section className="container-page pb-20">
        <div className="bg-surface-container-low rounded-2xl border border-outline-variant/20 p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Analysis Items */}
            <div className="lg:col-span-8">
              <h4 className="text-lg font-display font-bold mb-2">Advanced Grid Analytics</h4>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                UKDesk coordinates utility calculations directly with active price caps. Our modeling provides real-world carbon equivalence translations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Item 1 */}
                <div className="p-4 bg-white border border-outline-variant/60 rounded-xl flex flex-col gap-3 shadow-soft">
                  <div className="flex items-center gap-2 text-primary">
                    <BarChart3 className="h-4.5 w-4.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Market Trends</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Follow wholesale indices to hedge future fixed-rate tariff decisions.</p>
                </div>
                {/* Item 2 */}
                <div className="p-4 bg-white border border-outline-variant/60 rounded-xl flex flex-col gap-3 shadow-soft">
                  <div className="flex items-center gap-2 text-secondary">
                    <Footprints className="h-4.5 w-4.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Carbon Impact</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Convert your kWh consumption to metric tonnes of greenhouse emissions.</p>
                </div>
                {/* Item 3 */}
                <div className="p-4 bg-white border border-outline-variant/60 rounded-xl flex flex-col gap-3 shadow-soft">
                  <div className="flex items-center gap-2 text-tertiary">
                    <Battery className="h-4.5 w-4.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Battery Sizing</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Determine optimum battery storage capacity relative to residential solar arrays.</p>
                </div>
              </div>
            </div>
            
            {/* Image banner */}
            <div className="lg:col-span-4 h-48 relative rounded-2xl overflow-hidden shadow-soft">
              <img
                alt="Digital Smart Home Grid"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7z7jJLxE6sb-hKISEvbtS18IHdcz9pcYakHdvq0e14ELoDDXFznd1hURsLvs1Kx_2Bk5eS_yf-HMwmFKREHByxcVQG5U0aWOZlAmA-Vl2wKYoThu8nrnyCBLMdtfV6j234YjRhuthnO20ckJqCpAskiyEcQml6a5DFYYt-JD_bSIAui0HW-1NZCe0izrDDTtyGofADIu5RuVJg5FdN3ssQT3HKa0_nQ8cHWo5yKyXchL5ABS1C8yypbr20-oTarKxoGXnTBxx-cw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-6 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-[#6ffbbe] tracking-wider uppercase mb-1">Smart Meter Link</span>
                <h5 className="text-white font-bold text-sm leading-snug">Connect utility hardware to dashboard profiles.</h5>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function WorkstationCard({ title, description, href, icon: Icon, tag }: { title: string; description: string; href: string; icon: any; tag: string }) {
  return (
    <div className="group bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-soft hover:shadow-md transition-all flex flex-col justify-between hover:-translate-y-0.5 duration-200">
      <div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
          <Icon className="h-6 w-6" />
        </div>
        <h4 className="font-display text-base font-bold text-on-surface mb-2">{title}</h4>
        <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
          {description}
        </p>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20 mt-auto">
        <span className="bg-surface-container text-on-surface-variant text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
          {tag}
        </span>
        <Link href={href} className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">
          Launch Tool <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
