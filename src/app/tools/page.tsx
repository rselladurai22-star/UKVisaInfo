import type { Metadata } from 'next';
import { CATEGORIES } from '../../data/tools';
import { HUB_TOOLS } from '../../data/hubTools';
import ToolsClient from './ToolsClient';

const LIVE_TOTAL = CATEGORIES.reduce(
  (n, c) => n + (HUB_TOOLS[c.id] ?? []).reduce((m, g) => m + g.items.filter((i) => i.status === 'live').length, 0),
  0,
);

export const metadata: Metadata = {
  title: `All UK Calculators & Tools — ${LIVE_TOTAL} Free Tools | UKDesk`,
  description:
    'Every free UKDesk calculator in one place — mortgage, stamp duty, take-home pay, council tax, dividends, capital gains, ISAs, pensions, bills and more. Checked against GOV.UK, HMRC and ONS. No sign-up.',
  alternates: { canonical: '/tools' },
  openGraph: {
    title: 'All UK Calculators & Tools — UKDesk',
    description: `${LIVE_TOTAL} free UKDesk calculators, grouped by topic. No sign-up.`,
    url: 'https://ukvisainfo.co.uk/tools',
  },
};

export default function ToolsIndexPage() {
  return <ToolsClient />;
}
