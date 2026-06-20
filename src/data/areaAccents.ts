/**
 * Area accent palette — a disciplined COOL spectrum used to colour-code each
 * category across the homepage directory and the /tools index. Blue stays the
 * brand + interaction colour; these hues only tint the icon tile, the card's
 * top rule and the count badge so areas are instantly distinguishable while
 * the surface stays calm and cohesive.
 */
import type { CategoryId } from './tools';

export const AREA_ACCENT: Record<CategoryId, string> = {
  property:     '#2563eb', // blue
  immigration:  '#4f46e5', // indigo
  tax:          '#0284c7', // sky
  employment:   '#0891b2', // cyan
  savings:      '#0d9488', // teal
  business:     '#7c3aed', // violet
  benefits:     '#3b82f6', // bright blue
  vehicles:     '#0ea5e9', // light sky
  insurance:    '#6366f1', // soft indigo
  loans:        '#4338ca', // deep indigo
  estate:       '#0e7490', // deep cyan
  'family-law': '#5b21b6', // deep violet
  energy:       '#0369a1', // deep sky
};

/** Hex → rgba string at a given alpha (0–1). */
export const tint = (hex: string, a: number) => {
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
