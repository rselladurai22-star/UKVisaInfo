/**
 * Shared design tokens for homepage variants.
 * Imported by HomeDashboard, HomeSearch, HomeWizard, HomeGrid, VariantSwitcher.
 */
export const FONT         = '"Inter", -apple-system, system-ui, sans-serif';
export const FONT_DISPLAY = '"Space Grotesk", -apple-system, system-ui, sans-serif';
export const FONT_MONO    = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
export const FONT_SERIF   = '"Playfair Display", ui-serif, Georgia, serif';

export const INK    = '#213343';
export const PAPER  = '#FFFFFF';
export const SOFT   = '#F5F8FA';
export const ORANGE = '#FF7A59';
export const ORANGE_DARK = '#FF5C35';
export const SLATE  = '#516F90';
export const MUTED  = '#7C98B6';
export const HAIR   = 'rgba(33,51,67,0.08)';

export type VariantId = 'dashboard' | 'search' | 'wizard' | 'grid';

export const VARIANT_META: Record<VariantId, { label: string; short: string }> = {
  dashboard: { label: 'Dashboard', short: 'D' },
  search:    { label: 'Search',    short: 'S' },
  wizard:    { label: 'Wizard',    short: 'W' },
  grid:      { label: 'Grid',      short: 'G' },
};
