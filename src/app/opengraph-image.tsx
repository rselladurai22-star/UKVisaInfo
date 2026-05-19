import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'UK Visa Info — Plain-English Guide to Every UK Visa Route';
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
          background: 'linear-gradient(135deg, #06192E 0%, #0A2540 55%, #13325F 100%)',
          padding: '72px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Teal glow blob top-right */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,196,180,0.25) 0%, transparent 70%)',
        }} />
        {/* Gold glow blob bottom-left */}
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,161,74,0.18) 0%, transparent 70%)',
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
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #00C4B4, #007F76)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, color: 'white', fontWeight: 900,
            boxShadow: '0 0 0 3px rgba(0,196,180,0.3)',
          }}>
            🇬🇧
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#ffffff', fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
              UK Visa Info
            </span>
            <span style={{ color: '#00C4B4', fontSize: 13, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              ukvisainfo.co.uk
            </span>
          </div>
        </div>

        {/* Main headline */}
        <div style={{
          color: '#ffffff', fontSize: 58, fontWeight: 800,
          lineHeight: 1.1, letterSpacing: '-1.5px',
          maxWidth: 800, marginBottom: 24,
        }}>
          Your Complete Guide to UK Visas
        </div>

        {/* Sub-headline */}
        <div style={{
          color: 'rgba(255,255,255,0.75)', fontSize: 24,
          fontWeight: 400, lineHeight: 1.4, maxWidth: 720, marginBottom: 40,
        }}>
          Eligibility checks, visa costs, document checklists &amp; official links — all free, plain English, updated 2026.
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {['✓ 100% gov.uk sourced', '✓ Updated May 2026', '✓ Independent & Free'].map((badge) => (
            <div key={badge} style={{
              background: 'rgba(0,196,180,0.12)',
              border: '1px solid rgba(0,196,180,0.3)',
              color: '#5EEAD9', fontSize: 14, fontWeight: 500,
              padding: '8px 16px', borderRadius: 100,
            }}>
              {badge}
            </div>
          ))}
        </div>

        {/* Bottom teal bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 6,
          background: 'linear-gradient(90deg, #00C4B4, #C9A14A, #00C4B4)',
        }} />
      </div>
    ),
    { ...size }
  );
}
