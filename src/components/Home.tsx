'use client';

/**
 * UKDesk — Homepage shell.
 * Picks one of 4 layout variants based on the ?v= query param:
 *   ?v=dashboard | ?v=search | ?v=wizard | ?v=grid
 * Defaults to Grid. Floating switcher pinned top-right lets you flip
 * between them — once a winner is chosen the other 3 + the switcher can be removed.
 */

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import HomeDashboard from './home/HomeDashboard';
import HomeSearch from './home/HomeSearch';
import HomeWizard from './home/HomeWizard';
import HomeGrid from './home/HomeGrid';
import VariantSwitcher from './home/VariantSwitcher';
import type { VariantId } from './home/tokens';

const VARIANTS: Record<VariantId, () => React.JSX.Element> = {
  dashboard: HomeDashboard,
  search:    HomeSearch,
  wizard:    HomeWizard,
  grid:      HomeGrid,
};

export default function Home() {
  return (
    <Suspense fallback={<div style={{ paddingTop: 88 }} />}>
      <HomeInner />
    </Suspense>
  );
}

function HomeInner() {
  const sp = useSearchParams();
  const raw = sp.get('v');
  const v: VariantId = raw && raw in VARIANTS ? (raw as VariantId) : 'grid';
  const Variant = VARIANTS[v];
  return (
    <>
      <VariantSwitcher current={v} />
      <Variant />
    </>
  );
}
