import { ImageResponse } from 'next/og';
import { VISA_DETAILS } from '../../../data/visaDetails';

export const runtime = 'edge';
export const alt = 'UK Visa Info — visa route preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const ACCENTS: Record<string, string> = {
  Work: '#d9152b', Study: '#2563eb', Family: '#7c3aed', Visit: '#0891b2',
};

export default async function Image({ params }: { params: { slug: string } }) {
  const v = VISA_DETAILS[params.slug];
  const title = v?.title ?? 'UK Visa';
  const category = v?.category ?? 'Visa';
  const accent = ACCENTS[category] ?? '#d9152b';
  const fee = v?.fee ?? '—';
  const processing = v?.processing.outside ?? '—';

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
        {/* dot pattern */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.4) 1px, transparent 0)',
            backgroundSize: '24px 24px',
            opacity: 0.25,
          }}
        />
        {/* accent glow */}
        <div
          style={{
            position: 'absolute', right: -150, top: -150,
            width: 520, height: 520, borderRadius: 9999,
            background: `${accent}40`, filter: 'blur(120px)',
          }}
        />

        {/* brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, #c9112a, #8b001d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 800,
          }}>
            🇬🇧
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
            UK Visa <span style={{ color: '#d9152b' }}>Info</span>
          </div>
        </div>

        {/* category pill */}
        <div style={{ display: 'flex', marginTop: 'auto', marginBottom: 20 }}>
          <div
            style={{
              display: 'flex', alignItems: 'center',
              padding: '8px 16px', borderRadius: 9999,
              background: `${accent}30`,
              fontSize: 16, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'white',
            }}
          >
            {category}  visa
          </div>
        </div>

        {/* title */}
        <div
          style={{
            fontSize: title.length > 30 ? 80 : 96,
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: '-0.035em',
            maxWidth: 1000,
            position: 'relative',
          }}
        >
          {title}
        </div>

        {/* facts row */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 32,
            marginTop: 32, paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: 20, position: 'relative',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Fee from</span>
            <span style={{ fontWeight: 700, color: '#ffbf47' }}>{shortFee(fee)}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Processing</span>
            <span style={{ fontWeight: 700 }}>{processing}</span>
          </div>
          <span style={{ marginLeft: 'auto', color: '#ffbf47', fontWeight: 700, fontSize: 18 }}>
            ukvisainfo.co.uk →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function shortFee(fee: string): string {
  const m = fee.match(/£[\d,]+/);
  return m ? m[0] : fee;
}
