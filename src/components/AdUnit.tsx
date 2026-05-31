'use client';

import { useEffect, useRef } from 'react';

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT; // e.g. "ca-pub-9854912596289421"

type Format = 'auto' | 'rectangle' | 'vertical' | 'horizontal';

interface Props {
  slot: string;       // AdSense ad-unit slot ID
  format?: Format;
  className?: string;
  label?: boolean;    // show "Advertisement" label above (recommended by Google)
}

/**
 * Renders a Google AdSense display unit.
 *
 * Requires:
 *  1. NEXT_PUBLIC_ADSENSE_CLIENT env var (e.g. "ca-pub-XXXXXXXXXXXXXXXX")
 *  2. AdSenseScript in layout <head>
 *  3. A valid slot ID from your AdSense dashboard
 *
 * Use slot="responsive-default" as a placeholder until you create
 * real slots in the AdSense dashboard — the component renders nothing
 * server-side, only pushing to adsbygoogle[] on mount.
 */
export default function AdUnit({ slot, format = 'auto', className = '', label = true }: Props) {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT || !slot || pushed.current) return;
    try {
      // @ts-expect-error — adsbygoogle is injected globally by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // silently ignore — ad blocker or script not yet loaded
    }
  }, [slot]);

  if (!CLIENT || !slot) return null;

  return (
    <div className={`ad-unit-wrap ${className}`} aria-label="Advertisement" role="complementary">
      {label && (
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa3b8] mb-1 select-none">
          Advertisement
        </p>
      )}
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
