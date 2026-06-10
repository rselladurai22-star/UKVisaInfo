'use client';

/**
 * ApplyCta — picks the right gov.uk apply URL based on the user's
 * "apply from" choice in ScenarioBar.
 *
 * It also shows the source URL in plain text so the user can verify
 * exactly where they will be sent.
 */

import { ExternalLink, ShieldCheck } from 'lucide-react';
import { useScenario } from './useScenario';
import { APPLY_LINKS } from '../../../data/visaApplyLinks';

const INK     = '#18181B';
const CREAM   = '#FFFFFF';
const EMERALD = '#6366F1';

interface Props {
  slug: string;
  visaTitle: string;
  fallbackUrl: string;
  defaultVariant: string;
}

export default function ApplyCta({ slug, visaTitle, fallbackUrl, defaultVariant }: Props) {
  const { scenario } = useScenario({ defaultVariant });
  const link = APPLY_LINKS[slug]?.[scenario.from] ?? fallbackUrl;

  return (
    <div className="relative overflow-hidden rounded-3xl p-7 md:p-10"
         style={{ background: INK, color: CREAM }}>
      <div aria-hidden className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full pointer-events-none"
           style={{ background: 'rgba(4,120,87,0.28)', filter: 'blur(80px)' }} />
      <div aria-hidden className="absolute inset-0 opacity-[0.08] pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)', backgroundSize: '22px 22px' }} />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-md">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-3 inline-flex items-center gap-1.5"
             style={{ color: '#FDE68A' }}>
            <ShieldCheck className="w-3 h-3" />
            Direct apply · gov.uk
          </p>
          <h3 className="mb-3"
              style={{ fontFamily: 'var(--font-grotesk), sans-serif', fontWeight: 600, fontSize: 'clamp(1.5rem, 2.8vw, 2rem)', letterSpacing: '-0.028em', lineHeight: 1.08, color: CREAM }}>
            Apply for the <span style={{ fontStyle: 'italic', color: '#A7F3D0' }}>{visaTitle}</span> {scenario.from === 'inside' ? 'from inside the UK' : 'from outside the UK'}
          </h3>
          <p className="text-[13.5px] leading-[1.6]" style={{ color: 'rgba(250,250,247,0.65)' }}>
            We send you straight to the first page of the official application — no agents, no fees on top.
          </p>
          <p className="mt-3 text-[11.5px] font-mono break-all" style={{ color: 'rgba(250,250,247,0.45)' }}>
            {link}
          </p>
        </div>
        <a href={link} target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold px-7 py-3.5 rounded-xl active:scale-[0.98] transition-all shrink-0"
           style={{ background: CREAM, color: INK, boxShadow: '0 6px 18px -6px rgba(0,0,0,0.40)' }}>
          Start application
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
