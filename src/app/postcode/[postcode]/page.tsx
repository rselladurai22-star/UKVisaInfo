import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Building2, Vote, MapPin, Stethoscope, Shield, Globe2, Compass,
  Briefcase, ExternalLink, ShieldCheck,
} from 'lucide-react';
import PostcodeSearch from '../../../components/postcode/PostcodeSearch';
import { lookupPostcode, formatPostcode, normalisePostcode } from '../../../lib/postcode/lookup';

interface RouteParams { params: Promise<{ postcode: string }> }

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { postcode } = await params;
  const display = formatPostcode(postcode);
  const data = await lookupPostcode(postcode);
  if (!data) {
    return { title: `Postcode ${display} not found`, robots: { index: false, follow: true } };
  }
  const title = `${display}, ${data.council} · ${data.constituency} · UK Postcode Lookup`;
  const description = `${display} is in ${data.council} (${data.country}). Constituency: ${data.constituency}${data.mp ? `, MP ${data.mp}` : ''}. NHS area: ${data.nhsRegion}. Police: ${data.policeForce}.`;
  return {
    title, description,
    alternates: { canonical: `/postcode/${normalisePostcode(postcode)}` },
    openGraph: { title, description, url: `https://ukvisainfo.co.uk/postcode/${normalisePostcode(postcode)}`, type: 'article' },
    // Per-postcode results are user-driven lookup output, not editorial content.
    // We keep them browsable (e.g. for sharing a specific lookup) but hide them
    // from Google so they cannot dilute the site's quality signal, only the
    // /postcode landing page is indexed.
    robots: {
      index: false, follow: true,
      googleBot: { index: false, follow: true },
    },
  };
}

export default async function PostcodeResultPage({ params }: RouteParams) {
  const { postcode } = await params;
  const data = await lookupPostcode(postcode);
  if (!data) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-2xl mx-auto px-4 md:px-8 pt-[140px] text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#D9152B] mb-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Not found
          </p>
          <h1
            className="font-bold text-[#101a36] text-[28px] md:text-[36px] mb-3 tracking-[-0.015em]"
            style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
          >
            We couldn&apos;t look up <span className="tabular-nums">{formatPostcode(postcode)}</span>.
          </h1>
          <p
            className="text-[#45464d] text-[15px] md:text-[16px] leading-[1.55] mb-8"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Check the spelling and try again. Make sure it&apos;s a valid current UK postcode (BFPO and overseas territories aren&apos;t covered).
          </p>
          <PostcodeSearch variant="hero" />
          <Link
            href="/postcode"
            className="inline-flex items-center gap-1.5 text-[14px] text-[#45464d] hover:text-[#101a36] mt-7"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to postcode lookup
          </Link>
        </div>
      </div>
    );
  }

  const display = formatPostcode(data.postcode);
  const mapUrl = `https://www.openstreetmap.org/?mlat=${data.latitude}&mlon=${data.longitude}#map=15/${data.latitude}/${data.longitude}`;

  return (
    <div className="bg-white min-h-screen relative">
      {/* Dot pattern background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[600px] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(118,119,126,0.18) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '-12px -12px',
          opacity: 0.14,
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
        }}
      />

      <div className="relative max-w-[1100px] mx-auto px-4 md:px-8 pt-[100px] md:pt-[120px] pb-20">

        {/* Top bar, back link + compact search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Link
            href="/postcode"
            className="inline-flex items-center gap-1.5 text-[13.5px] text-[#45464d] hover:text-[#101a36] font-medium transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <ArrowLeft className="w-4 h-4" />
            New postcode
          </Link>
          <div className="w-full sm:w-[320px]">
            <PostcodeSearch variant="compact" initial={display} />
          </div>
        </div>

        {/* Hero, the postcode + headline summary */}
        <header className="mb-8 md:mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[rgba(16,185,129,0.12)] text-[#00714d]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <ShieldCheck className="w-3 h-3" />
              Verified · gov + ONS
            </span>
            <span
              className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#e1e3e4] text-[#45464d]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {data.country}
            </span>
          </div>

          <h1
            className="font-bold text-[#101a36] tracking-[-0.025em] tabular-nums leading-tight"
            style={{
              fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            }}
          >
            {display}
          </h1>
          <p
            className="mt-3 text-[16px] md:text-[18px] text-[#45464d] leading-[1.55] max-w-3xl"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <strong className="text-[#101a36] font-semibold">{data.council}</strong>
            {data.ward && <> · {data.ward} ward</>}
            {' '}· <strong className="text-[#101a36] font-semibold">{data.constituency}</strong> constituency
            {' '}· {data.region} region
          </p>
        </header>

        {/* RESULTS GRID, 6 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">

          {/* COUNCIL */}
          <ResultCard
            icon={Building2}
            label="Local council"
            value={data.council}
            sub={data.country}
            extras={[
              data.ward && { k: 'Ward', v: data.ward },
              data.parish && { k: 'Parish', v: data.parish },
            ]}
          />

          {/* MP / CONSTITUENCY */}
          <ResultCard
            icon={Vote}
            label="Member of Parliament"
            value={data.mp ?? 'See constituency'}
            sub={data.mpParty ? `${data.mpParty}${data.mpSince ? ` · since ${data.mpSince}` : ''}` : data.constituency}
            extras={[{ k: 'Constituency', v: data.constituency }]}
            cta={{
              label: 'Write to your MP',
              href: `https://www.writetothem.com/who?pc=${encodeURIComponent(data.postcode)}`,
              external: true,
            }}
          />

          {/* NHS */}
          <ResultCard
            icon={Stethoscope}
            label="NHS region"
            value={data.nhsRegion}
            sub={data.icb ? `ICB: ${data.icb}` : 'Find a GP, dentist or pharmacy near you'}
            extras={[]}
            cta={{
              label: 'Find a GP near you',
              href: `https://www.nhs.uk/service-search/find-a-gp/results/${encodeURIComponent(data.postcode)}`,
              external: true,
            }}
          />

          {/* POLICE */}
          <ResultCard
            icon={Shield}
            label="Police force"
            value={data.policeForce}
            sub={`Crimes mapped by ${data.policeForce}`}
            extras={[]}
            cta={{
              label: 'Crime map on police.uk',
              href: 'https://www.police.uk/pu/your-area/',
              external: true,
            }}
          />

          {/* REGION */}
          <ResultCard
            icon={Globe2}
            label="Region"
            value={data.region}
            sub={`${data.country}`}
            extras={[
              { k: 'Outcode', v: data.outcode },
              { k: 'Incode', v: data.incode },
            ]}
          />

          {/* COORDINATES + MAP */}
          <ResultCard
            icon={Compass}
            label="Coordinates"
            value={`${data.latitude.toFixed(5)}, ${data.longitude.toFixed(5)}`}
            sub="WGS-84 latitude / longitude"
            extras={[
              { k: 'LSOA', v: data.lsoa },
              { k: 'MSOA', v: data.msoa },
            ]}
            cta={{ label: 'Open on OpenStreetMap', href: mapUrl, external: true }}
          />
        </div>

        {/* WHAT YOU CAN DO HERE, related calculators */}
        <section className="mt-12 md:mt-16">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Related tools
          </p>
          <h2
            className="font-bold text-[#101a36] mb-6 tracking-[-0.015em]"
            style={{
              fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            }}
          >
            What you might want next
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <RelatedLink
              href="/tools/sponsor-search"
              title="UK sponsor search"
              desc="Find licensed Skilled Worker sponsors in your area."
            />
            <RelatedLink
              href="/visa-types/skilled-worker"
              title="Skilled Worker visa guide"
              desc={`Apply from any postcode, fee, salary thresholds and process for ${data.country === 'Northern Ireland' ? 'NI' : data.country}.`}
            />
            <RelatedLink
              href="/visa-types"
              title="Find your UK visa"
              desc="14 visa routes with verified gov.uk fees."
            />
            <RelatedLink
              href="/tools/cost-calculator"
              title="Visa cost calculator"
              desc="Add up Home Office fees + IHS + dependants."
            />
          </div>
        </section>

        {/* SOURCE STRIP */}
        <div className="mt-12 bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-start gap-3 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.04)]">
          <span className="w-9 h-9 rounded-full bg-[rgba(16,185,129,0.12)] text-[#00714d] flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </span>
          <div className="flex-1">
            <p
              className="text-[13px] text-[#45464d] leading-[1.55]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Data sourced from <strong className="text-[#101a36]">postcodes.io</strong> (Office for National Statistics open data) and the <strong className="text-[#101a36]">UK Parliament Members API</strong>. Updated on every lookup; cached for 24 hours.
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-[12px]">
              <a
                href="https://postcodes.io"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#101a36] font-semibold hover:underline"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                postcodes.io <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://members-api.parliament.uk"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#101a36] font-semibold hover:underline"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Parliament Members API <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────── */

function ResultCard({
  icon: Icon, label, value, sub, extras, cta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  extras?: ({ k: string; v: string } | false | null | undefined)[];
  cta?: { label: string; href: string; external?: boolean };
}) {
  const validExtras = (extras ?? []).filter(Boolean) as { k: string; v: string }[];
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 md:p-6 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)] flex flex-col">
      <div className="flex items-center gap-2.5 mb-4">
        <span
          className="inline-flex w-9 h-9 rounded-full bg-[#dae2ff] text-[#101a36] items-center justify-center flex-shrink-0"
        >
          <Icon className="w-[17px] h-[17px]" />
        </span>
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {label}
        </p>
      </div>

      <p
        className="font-bold text-[#101a36] text-[18px] md:text-[20px] leading-[1.25] tracking-[-0.01em]"
        style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
      >
        {value}
      </p>
      {sub && (
        <p
          className="mt-1.5 text-[13px] text-[#45464d]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {sub}
        </p>
      )}

      {validExtras.length > 0 && (
        <dl className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-1.5">
          {validExtras.map(({ k, v }) => (
            <div key={k} className="flex items-baseline justify-between gap-3">
              <dt
                className="text-[11.5px] text-[#76777e] font-medium"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {k}
              </dt>
              <dd
                className="text-[12.5px] font-semibold text-[#101a36] text-right tabular-nums"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {v}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {cta && (
        <div className="mt-auto pt-4">
          <a
            href={cta.href}
            {...(cta.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#101a36] hover:underline"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {cta.label}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}

function RelatedLink({
  href, title, desc,
}: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 bg-white border border-[#E5E7EB] rounded-xl p-4 hover:border-[#101a36] transition-colors duration-100 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.04)]"
    >
      <span className="inline-flex w-9 h-9 rounded-full bg-[#f3f4f5] group-hover:bg-[#dae2ff] text-[#101a36] items-center justify-center flex-shrink-0 transition-colors">
        <Briefcase className="w-[16px] h-[16px]" />
      </span>
      <div className="flex-1 min-w-0">
        <div
          className="font-semibold text-[14.5px] text-[#101a36] leading-tight"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
        >
          {title}
        </div>
        <div
          className="text-[12.5px] text-[#45464d] mt-0.5 leading-snug"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {desc}
        </div>
      </div>
      <MapPin className="w-4 h-4 text-[#c1c8d6] flex-shrink-0 mt-0.5 group-hover:text-[#101a36] transition-colors" />
    </Link>
  );
}
