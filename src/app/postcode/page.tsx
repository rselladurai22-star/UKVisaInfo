import type { Metadata } from 'next';
import {
  Building2, Vote, MapPin, Stethoscope, Shield, Globe2, TreePine, Briefcase,
} from 'lucide-react';
import PostcodeSearch from '../../components/postcode/PostcodeSearch';

export const metadata: Metadata = {
  title: 'UK Postcode Lookup — Council, MP, NHS, Police, Ward & More',
  description:
    'Enter any UK postcode and instantly see your council, MP, parliamentary constituency, NHS region, police force, electoral ward and region — all on one page. Free, no signup.',
  alternates: { canonical: '/postcode' },
  openGraph: {
    title: 'UK Postcode Lookup',
    description: 'Council, MP, NHS, Police, Ward and more — for any UK postcode, on one page.',
    url: 'https://ukvisainfo.co.uk/postcode',
    type: 'website',
  },
};

const FEATURES: { icon: typeof Building2; label: string; desc: string }[] = [
  { icon: Building2,   label: 'Your council',          desc: 'Local authority that runs your bin collection, council tax and parking.' },
  { icon: Vote,        label: 'Your MP',               desc: 'Sitting Member of Parliament + party + when they took office.' },
  { icon: MapPin,      label: 'Constituency & ward',   desc: 'Parliamentary constituency for voting + electoral ward.' },
  { icon: Stethoscope, label: 'NHS region & ICB',      desc: 'Your NHS region and Integrated Care Board.' },
  { icon: Shield,      label: 'Police force',          desc: 'The force responsible for your area — useful for crime reporting.' },
  { icon: Globe2,      label: 'Region & country',      desc: 'England / Scotland / Wales / Northern Ireland + statistical region.' },
  { icon: TreePine,    label: 'Geo coordinates',       desc: 'Latitude / longitude for further local lookups.' },
  { icon: Briefcase,   label: 'LSOA / MSOA codes',     desc: 'Statistical area codes used for census + ONS data.' },
];

const EXAMPLES = [
  { code: 'SW1A 1AA', label: 'Buckingham Palace' },
  { code: 'M1 1AE',   label: 'Manchester city centre' },
  { code: 'EH1 1YZ',  label: 'Edinburgh Royal Mile' },
  { code: 'B1 1HQ',   label: 'Birmingham' },
  { code: 'CF10 1AA', label: 'Cardiff' },
  { code: 'BT1 5GS',  label: 'Belfast' },
];

export default function PostcodeLandingPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Subtle ambient dot pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[600px] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(118,119,126,0.18) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '-12px -12px',
          opacity: 0.16,
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
        }}
      />

      {/* ════════════════════════════════════════
          HERO — single big search input
      ════════════════════════════════════════ */}
      <header className="relative max-w-3xl mx-auto px-4 md:px-8 pt-[120px] md:pt-[150px] pb-12 md:pb-16 text-center">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full bg-[#e1e3e4] text-[#45464d] mb-5"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <MapPin className="w-3 h-3" />
          UK Postcode Lookup
        </span>

        <h1
          className="font-bold text-[#101a36] tracking-[-0.025em] text-balance"
          style={{
            fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
            fontSize: 'clamp(2.25rem, 6vw, 3.5rem)',
            lineHeight: '1.05',
          }}
        >
          Everything about your UK postcode, on one page.
        </h1>

        <p
          className="mt-5 text-[16px] md:text-[18px] text-[#45464d] leading-[1.55] max-w-2xl mx-auto"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Council, MP, NHS region, police force, ward, constituency and more — instantly. Free, no signup, works for every UK postcode.
        </p>

        <div className="mt-9 md:mt-10">
          <PostcodeSearch variant="hero" />
        </div>

        {/* Example chips */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <span
            className="text-[11.5px] text-[#76777e] font-medium pr-1"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Try:
          </span>
          {EXAMPLES.map((ex) => (
            <a
              key={ex.code}
              href={`/postcode/${ex.code.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#45464d] hover:text-[#101a36] hover:bg-white hover:border-[#101a36] bg-[#f3f4f5] border border-[#E5E7EB] px-2.5 py-1 rounded-md transition-colors duration-100"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span className="font-semibold tabular-nums">{ex.code}</span>
              <span className="text-[#76777e]">· {ex.label}</span>
            </a>
          ))}
        </div>
      </header>

      {/* ════════════════════════════════════════
          WHAT YOU GET — 8 feature cards
      ════════════════════════════════════════ */}
      <section className="relative max-w-[1280px] mx-auto px-4 md:px-10 pb-16 md:pb-24">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            What you get
          </p>
          <h2
            className="font-bold text-[#101a36] tracking-[-0.015em]"
            style={{
              fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            }}
          >
            Eight datapoints. One postcode. Zero forms.
          </h2>
          <p
            className="mt-3 text-[15px] md:text-[16px] text-[#45464d] leading-[1.55]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            All sourced from official open data — postcodes.io, UK Parliament Members API and ONS.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]"
              >
                <span
                  className="inline-flex w-10 h-10 rounded-full bg-[#dae2ff] text-[#101a36] items-center justify-center mb-3"
                  aria-hidden="true"
                >
                  <Icon className="w-[18px] h-[18px]" />
                </span>
                <h3
                  className="font-semibold text-[#101a36] text-[15px] leading-tight mb-1.5"
                  style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
                >
                  {f.label}
                </h3>
                <p
                  className="text-[13px] text-[#45464d] leading-[1.55]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════
          TRUST / PRIVACY STRIP
      ════════════════════════════════════════ */}
      <section className="relative max-w-3xl mx-auto px-4 md:px-8 pb-20 md:pb-28 text-center">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-7 md:p-9 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]">
          <h3
            className="font-semibold text-[#101a36] text-[18px] md:text-[20px] mb-3"
            style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
          >
            Built on official open data
          </h3>
          <p
            className="text-[14px] md:text-[15px] text-[#45464d] leading-[1.6]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            We use <strong className="text-[#101a36]">postcodes.io</strong> (open-source) for the core lookup,
            the <strong className="text-[#101a36]">UK Parliament Members API</strong> for current MP details,
            and ONS region/area codes. Nothing is stored — your postcode never leaves the request.
          </p>
        </div>
      </section>
    </div>
  );
}
