import { ImageResponse } from 'next/og';
import { getPost } from '../../../data/blog';

export const runtime = 'edge';
export const alt = 'UK Visa Info — article preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  const title = post?.title ?? 'UK Visa Info';
  const category = post?.tags[0] ?? 'Guide';
  const readMin = post?.readMinutes ?? 5;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          background: 'linear-gradient(135deg, #0A2540 0%, #0F2C4B 60%, #1c2c63 100%)',
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
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201, 161, 74,0.4) 1px, transparent 0)',
            backgroundSize: '24px 24px',
            opacity: 0.25,
          }}
        />
        {/* red glow */}
        <div
          style={{
            position: 'absolute', right: -120, top: -120,
            width: 480, height: 480, borderRadius: 9999,
            background: 'rgba(0, 196, 180,0.25)', filter: 'blur(100px)',
          }}
        />

        {/* brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, #00A89A, #007F76)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 800,
          }}>
            🇬🇧
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
            UK Visa <span style={{ color: '#00C4B4' }}>Info</span>
          </div>
        </div>

        {/* category */}
        <div
          style={{
            display: 'flex', alignItems: 'center',
            marginTop: 'auto', marginBottom: 20,
            fontSize: 16, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#C9A14A',
            position: 'relative',
          }}
        >
          {category}  ·  {readMin} min read
        </div>

        {/* title */}
        <div
          style={{
            fontSize: title.length > 80 ? 56 : 72,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            maxWidth: 1000,
            position: 'relative',
          }}
        >
          {title}
        </div>

        {/* footer line */}
        <div
          style={{
            display: 'flex', alignItems: 'center',
            marginTop: 32, paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: 18, color: 'rgba(255,255,255,0.5)',
            position: 'relative',
          }}
        >
          <span>ukvisainfo.co.uk</span>
          <span style={{ marginLeft: 'auto', color: '#C9A14A', fontWeight: 700 }}>
            Read the full guide →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
