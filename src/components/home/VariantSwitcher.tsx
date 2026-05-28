'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FONT, FONT_DISPLAY, INK, ORANGE, MUTED, HAIR, VARIANT_META, type VariantId } from './tokens';

/** Floating switcher pinned top-right. 4 buttons. Highlights the current variant. */
export default function VariantSwitcher({ current }: { current: VariantId }) {
  const sp = useSearchParams();
  const buildHref = (v: VariantId) => {
    const next = new URLSearchParams(sp.toString());
    next.set('v', v);
    return `/?${next.toString()}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        right: 20,
        zIndex: 60,
        background: '#FFFFFF',
        border: `1px solid ${HAIR}`,
        borderRadius: 999,
        padding: '5px 6px',
        boxShadow: '0 8px 28px -10px rgba(33,51,67,0.20), 0 2px 6px rgba(33,51,67,0.06)',
        display: 'flex',
        gap: 3,
      }}
      aria-label="Homepage variant switcher"
    >
      <span style={{
        fontFamily: FONT, fontSize: 10, fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: MUTED, padding: '6px 8px 6px 10px',
        display: 'flex', alignItems: 'center',
      }}>
        Layout
      </span>
      {(Object.keys(VARIANT_META) as VariantId[]).map((v) => {
        const isOn = current === v;
        return (
          <Link
            key={v}
            href={buildHref(v)}
            title={VARIANT_META[v].label}
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 12,
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: 999,
              background: isOn ? ORANGE : 'transparent',
              color: isOn ? '#FFFFFF' : INK,
              textDecoration: 'none',
              transition: 'background 120ms',
            }}
          >
            {VARIANT_META[v].label}
          </Link>
        );
      })}
    </div>
  );
}
