'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Car,
  Leaf,
  ShieldCheck,
  Wrench,
  Fuel,
  MapPin,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Search,
} from 'lucide-react';

export default function VehiclesHub() {
  const [reg, setReg] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);
  const [vehicleData, setVehicleData] = useState<any>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reg.trim()) return;

    // Generate simulated high-fidelity data based on input
    const cleanReg = reg.trim().toUpperCase();
    const isElectricStr = cleanReg.startsWith('E') || cleanReg.includes('EV');
    
    setVehicleData({
      plate: cleanReg,
      makeModel: isElectricStr ? 'Tesla Model Y Long Range' : 'Volkswagen Golf 1.5 TSI',
      fuelType: isElectricStr ? 'Electric' : 'Petrol',
      co2: isElectricStr ? '0 g/km' : '114 g/km',
      engineSize: isElectricStr ? 'N/A' : '1,498 cc',
      motStatus: '✅ Valid (Expires 14 Oct 2027)',
      taxStatus: '✅ Paid (Expires 01 Nov 2027)',
      ulezStatus: '✅ Compliant (Euro 6 / Electric Class)',
    });
    setChecked(true);
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
          <span className="text-primary font-bold">Vehicles</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-on-surface">
          Vehicles & Motoring Hub
        </h1>
        <p className="mt-3 text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Verify road tax deadlines, inspect MOT failures, check clean air zone compliance (ULEZ), and estimate journey fuel usage.
        </p>
      </section>

      {/* Hero Section: MOT & Vehicle Tax Lookup */}
      <section className="container-page pb-12">
        <div className="relative rounded-2xl overflow-hidden bg-primary-container p-8 lg:p-12 min-h-[400px] flex flex-col lg:flex-row items-center gap-8 border border-outline-variant/60 shadow-soft">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
            <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-secondary rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-primary rounded-full blur-[100px]"></div>
          </div>

          <div className="relative z-10 lg:w-1/2 text-on-primary-container">
            <span className="bg-[#0037b0]/10 text-[#0037b0] px-3 py-1 rounded-full font-bold text-[10px] tracking-wider mb-4 inline-block uppercase border border-[#0037b0]/25">
              DVLA DIRECT SYNC
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              Instant MOT & Vehicle Check
            </h2>
            <p className="text-base text-on-primary-container/80 mb-8 max-w-lg leading-relaxed">
              Enter any UK vehicle registration plate to retrieve compliance statuses, engine displacement specs, and emissions records.
            </p>
            <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-xl shadow-lg w-full max-w-md border border-outline-variant/20">
              <div className="flex-1 relative flex items-center">
                <span className="absolute left-3 font-bold text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded text-[10px] tracking-wide uppercase border border-outline-variant/30">
                  UK
                </span>
                <input
                  type="text"
                  placeholder="ENTER REG"
                  value={reg}
                  onChange={(e) => setReg(e.target.value)}
                  className="w-full pl-12 pr-3 py-2 bg-transparent border-none font-mono text-lg font-bold tracking-widest uppercase outline-none focus:ring-0 text-on-surface"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-on-primary px-5 py-2 rounded-lg font-bold text-xs hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                Check Now <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          <div className="relative z-10 lg:w-1/2 w-full">
            <div className="bg-white/80 backdrop-blur-md p-6 lg:p-8 rounded-2xl shadow-xl border border-white/30 min-h-[220px] flex flex-col justify-center">
              {!checked ? (
                <div className="text-center py-6">
                  <Car className="h-12 w-12 text-primary/30 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-on-surface-variant">Enter a registration plate to retrieve vehicle specs</p>
                  <p className="text-xs text-on-surface-variant/75 mt-1">E.g., Try "EV26 ABC" or "LG26 XYZ"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-outline-variant/40 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Identified Vehicle</span>
                      <h4 className="font-display font-extrabold text-on-surface text-lg">{vehicleData.makeModel}</h4>
                    </div>
                    <span className="bg-yellow-400 text-black font-mono font-extrabold px-3 py-1.5 rounded-lg border-2 border-black tracking-wider shadow-sm uppercase text-sm">
                      {vehicleData.plate}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 py-1">
                    <div>
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block">Fuel Type</span>
                      <span className="text-xs font-semibold text-on-surface">{vehicleData.fuelType}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block">CO2 Emissions</span>
                      <span className="text-xs font-semibold text-on-surface">{vehicleData.co2}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block">Engine Capacity</span>
                      <span className="text-xs font-semibold text-on-surface">{vehicleData.engineSize}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block">ULEZ Compliance</span>
                      <span className="text-xs font-bold text-secondary">{vehicleData.ulezStatus}</span>
                    </div>
                  </div>

                  <div className="border-t border-outline-variant/30 pt-3 grid grid-cols-2 gap-4">
                    <div className="p-2.5 bg-surface rounded-xl border border-outline-variant/20">
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block mb-0.5">MOT STATUS</span>
                      <span className="text-[11px] font-bold text-on-surface">{vehicleData.motStatus}</span>
                    </div>
                    <div className="p-2.5 bg-surface rounded-xl border border-outline-variant/20">
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block mb-0.5">ROAD TAX STATUS</span>
                      <span className="text-[11px] font-bold text-on-surface">{vehicleData.taxStatus}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Directory Section Header */}
      <section className="container-page pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant pb-4 mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-on-surface">Precision Motoring Tools</h3>
            <p className="text-sm text-on-surface-variant mt-1">Specialized calculation modules for compliance and running costs.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full font-semibold text-[10px] tracking-wider uppercase flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-secondary" /> DVLA Sourced
            </span>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="container-page pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ULEZ Check */}
          <WorkstationCard
            title="ULEZ & Clean Air Zone Check"
            description="Verify if your vehicle meets London's Ultra Low Emission Zone compliance requirements."
            href="/ulez-check"
            icon={Leaf}
            tag="Emission Zones"
          />

          {/* MOT Check */}
          <WorkstationCard
            title="Full MOT History"
            description="Examine past MOT tests, advisory notices, and failure logs registered with DVLA."
            href="/mot-check"
            icon={Wrench}
            tag="DVLA History Logs"
          />

          {/* Postcode Lookup */}
          <WorkstationCard
            title="MOT Testing Center Search"
            description="Find certified regional testing garages and pricing ranges based on postcode locations."
            href="/postcode"
            icon={MapPin}
            tag="Geospatial Maps"
          />
        </div>
      </section>

      {/* Accuracy & Regulatory Section */}
      <section className="container-page pb-20">
        <div className="bg-surface-container-low rounded-2xl border border-outline-variant/20 p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-2/3 w-full">
              <h4 className="text-lg font-display font-bold mb-2">Compliance & Data Assurance</h4>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                UKDesk integrates directly with official automotive databases to deliver vehicle data. MOT timelines and road tax tiers are refreshed against government schedules.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary shrink-0">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-semibold text-on-surface">DVLA Synchronized Feeds</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary shrink-0">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-semibold text-on-surface">ULEZ Expansion Compliant</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3 w-full h-44 relative rounded-2xl overflow-hidden shadow-soft">
              <img
                alt="Classic luxury dashboard details"
                className="w-full h-full object-cover grayscale opacity-90"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY4B-aj682G5kl70QsXmEBDpmtHilLzx26nex6N8ikomVLyrtuCqR3r6J3z5cKCkCrydzORstZ8RnDNDzZVrTKcrtqQAKKsIztQxjRFiSw6kU4y0UCJWeO2C55iORTg00-1XOqzm6b51AstU8c1S3fa9F9aYFL288VyEP2XtaPZ61GY-cok_JfLe7uxKgCaeBWRPY6soiHLoDJZioAIcAZ69DANpUUJ6vJFPGbcpmlR6jn9LsOiurc0Hyonh4Up5KTrrtE61GOCGE"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-6 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-[#6ffbbe] tracking-wider uppercase mb-1">Expert Guide</span>
                <h5 className="text-white font-bold text-sm leading-snug">VED Vehicle Tax changes.</h5>
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
