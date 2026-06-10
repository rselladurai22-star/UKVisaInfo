import type { CSSProperties } from 'react';
import {
  BadgePoundSterling, Search, Scale, FileSearch,
} from 'lucide-react';
import { APP_TILES, SUBCATEGORIES, type CategoryId, type IconComponent } from '../data/tools';
import s from '../components/calc/calc.module.css';

/** Maps each category to its --uk-cN brand colour index (1–8). */
export const CAT_INDEX: Record<CategoryId, number> = {
  tax:         1,
  property:    2,
  employment:  4,
  savings:     5,
  business:    6,
  benefits:    7,
  vehicles:    8,
  insurance:   4,
  loans:       5,
  estate:      2,
  'family-law': 4,
  energy:      8,
};



export const catVar = (c: number): CSSProperties =>
  ({ ['--tc']: `var(--uk-c${c})`, ['--tctx']: `var(--uk-c${c}-tx)` } as CSSProperties);

/** Normalised card item — works for both AppTiles and standalone tools. */
export interface HubItem { href: string; label: string; hint: string; icon: IconComponent; accent: string; }
export interface HubSection { id: string; label: string; title: string; description: string; items: HubItem[]; }

/** Build the grouped sections for a category hub, in sub-group order, with a trailing "More" group for anything ungrouped. */
export function getHubSections(id: CategoryId): HubSection[] {
  const pool: HubItem[] = APP_TILES
    .filter((t) => t.category === id)
    .map((t) => ({ href: t.href, label: t.label, hint: t.hint, icon: t.icon, accent: t.accent }));



  const used = new Set<string>();
  const sections: HubSection[] = [];

  for (const g of SUBCATEGORIES[id]) {
    const items = g.hrefs
      .map((href) => pool.find((p) => p.href === href))
      .filter((x): x is HubItem => Boolean(x));
    items.forEach((i) => used.add(i.href));
    if (items.length) sections.push({ id: g.id, label: g.label, title: g.title, description: g.description, items });
  }

  const leftover = pool.filter((p) => !used.has(p.href));
  if (leftover.length) {
    sections.push({ id: 'more', label: 'Also in this category', title: 'More tools', description: '', items: leftover });
  }
  return sections;
}

/** Tinted icon chip shown at the top of each tool card. */
export function CardIcon({ Icon, accent }: { Icon: IconComponent; accent: string }) {
  return (
    <span
      className={s.relCardIcon}
      style={{ background: `color-mix(in srgb, ${accent} 13%, transparent)`, color: accent }}
    >
      <Icon size={20} />
    </span>
  );
}
