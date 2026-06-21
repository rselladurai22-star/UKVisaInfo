import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'UKDesk, Free UK Calculators, Lookups & Guides';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #1E3A8A 100%)',
          padding: '72px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Blue glow blob top-right */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.35) 0%, transparent 70%)',
        }} />
        {/* Sky glow blob bottom-left */}
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.22) 0%, transparent 70%)',
        }} />
        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <div style={{
            position: 'relative',
            width: 58, height: 58, borderRadius: 16,
            background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 34, color: '#ffffff', fontWeight: 900, letterSpacing: '-1px',
            boxShadow: '0 0 0 3px rgba(37,99,235,0.3)',
          }}>
            U
            <div style={{
              position: 'absolute', top: 11, right: 11,
              width: 9, height: 9, borderRadius: '50%', background: '#7DD3FC',
            }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#ffffff', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              ukdesk
            </span>
            <span style={{ color: '#7DD3FC', fontSize: 13, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              ukvisainfo.co.uk
            </span>
          </div>
        </div>

        {/* Main headline */}
        <div style={{
          color: '#ffffff', fontSize: 58, fontWeight: 800,
          lineHeight: 1.1, letterSpacing: '-1.5px',
          maxWidth: 880, marginBottom: 24,
        }}>
          Every UK tool, calculator and guide.
        </div>

        {/* Sub-headline */}
        <div style={{
          color: 'rgba(255,255,255,0.75)', fontSize: 24,
          fontWeight: 400, lineHeight: 1.4, maxWidth: 760, marginBottom: 40,
        }}>
          Take-home pay, mortgage, stamp duty, council tax, postcode super-lookup, every UK visa route, verified against gov.uk, HMRC and ONS.
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {['✓ gov.uk / HMRC verified', '✓ Updated 2026', '✓ Free · No signup'].map((badge) => (
            <div key={badge} style={{
              background: 'rgba(37,99,235,0.16)',
              border: '1px solid rgba(56,189,248,0.35)',
              color: '#BAE6FD', fontSize: 14, fontWeight: 500,
              padding: '8px 16px', borderRadius: 100,
            }}>
              {badge}
            </div>
          ))}
        </div>

        {/* Bottom blue bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 6,
          background: 'linear-gradient(90deg, #2563EB, #38BDF8, #4F46E5)',
        }} />
      </div>
    ),
    { ...size }
  );
}
