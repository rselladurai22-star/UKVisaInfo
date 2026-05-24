'use client';

/**
 * useScenario — read/write the four filter dimensions in the URL.
 *
 * Dimensions:
 *   from   = 'outside' | 'inside'        — apply from inside the UK or outside
 *   fam    = 'solo' | 'partner' | 'kids' | 'family'  — who is coming with you
 *   v      = variant id (e.g. 'standard' | 'isl' | 'stem-phd')
 *   nat    = nationality code (matches visaNationalities)
 *
 * State lives in the URL so it is shareable, back-button friendly and
 * SEO-safe (server re-renders on direct loads).
 */

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export type ApplyFrom = 'outside' | 'inside';
export type Family   = 'solo' | 'partner' | 'kids' | 'family';

export interface Scenario {
  from: ApplyFrom;
  fam: Family;
  v: string;
  nat: string;
}

export const FAMILY_LABEL: Record<Family, string> = {
  solo:    'Just me',
  partner: '+ Partner',
  kids:    '+ Children',
  family:  '+ Partner & children',
};

export function familyCounts(fam: Family): { adults: number; children: number } {
  switch (fam) {
    case 'solo':    return { adults: 1, children: 0 };
    case 'partner': return { adults: 2, children: 0 };
    case 'kids':    return { adults: 1, children: 2 };
    case 'family':  return { adults: 2, children: 2 };
  }
}

interface Options {
  defaultVariant?: string;
  defaultFrom?: ApplyFrom;
}

export function useScenario({ defaultVariant = 'standard', defaultFrom = 'outside' }: Options = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const scenario: Scenario = useMemo(() => ({
    from: (params.get('from') as ApplyFrom) ?? defaultFrom,
    fam:  (params.get('fam')  as Family)    ?? 'solo',
    v:    params.get('v') ?? defaultVariant,
    nat:  params.get('nat') ?? 'india',
  }), [params, defaultFrom, defaultVariant]);

  const setScenario = useCallback((next: Partial<Scenario>) => {
    const merged = { ...scenario, ...next };
    const usp = new URLSearchParams();
    if (merged.from !== defaultFrom)   usp.set('from', merged.from);
    if (merged.fam  !== 'solo')        usp.set('fam',  merged.fam);
    if (merged.v    !== defaultVariant)usp.set('v',    merged.v);
    if (merged.nat  !== 'india')       usp.set('nat',  merged.nat);
    const qs = usp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [scenario, defaultFrom, defaultVariant, router, pathname]);

  return { scenario, setScenario };
}
