import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Find your UK visa in 60 seconds';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          background: 'linear-gradient(135deg, #0a1530 0%, #13204a 60%, #1c2c63 100%)',
          padding: 64,
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.4) 1px, transparent 0)',
            backgroundSize: '24px 24px',
            opacity: 0.25,
          }}
        />
        <div style={{ position: 'absolute', right: -150, top: -150, width: 520, height: 520, borderRadius: 9999, background: 'rgba(217,21,43,0.3)', filter: 'blur(120px)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #c9112a, #8b001d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
            🇬🇧
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
            UK Visa <span style={{ color: '#d9152b' }}>Info</span>
          </div>
        </div>

        <div style={{ display: 'flex', marginTop: 'auto', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px 18px', borderRadius: 9999, background: 'rgba(255,191,71,0.2)', fontSize: 16, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#ffbf47' }}>
            ⚡ 60-second quiz
          </div>
        </div>

        <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.035em', maxWidth: 1000, position: 'relative' }}>
          Find your UK visa<br />
          <span style={{ background: 'linear-gradient(90deg, #ffbf47, #ff9f43)', backgroundClip: 'text', color: 'transparent' }}>in 60 seconds.</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 20, color: 'rgba(255,255,255,0.5)', position: 'relative' }}>
          <span>Free · No signup · gov.uk sourced</span>
          <span style={{ marginLeft: 'auto', color: '#ffbf47', fontWeight: 700 }}>
            ukvisainfo.co.uk/eligibility →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
