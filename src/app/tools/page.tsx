import type { Metadata } from 'next';
import { APP_TILES } from '../../data/tools';
import { VISA_TOOLS } from '../../lib/categoryMeta';
import ToolsClient from './ToolsClient';

const TOTAL = APP_TILES.length + VISA_TOOLS.length;

export const metadata: Metadata = {
  title: `All UK Calculators & Tools — ${TOTAL} Free Tools | UKDesk`,
  description:
    'Every free UKDesk tool in one place — take-home pay, stamp duty, mortgage, council tax, dividend & capital gains tax, ISAs, pensions, child benefit, visa fees and more. Checked against GOV.UK, HMRC and ONS.',
  alternates: { canonical: '/tools' },
  openGraph: {
    title: 'All UK Calculators & Tools — UKDesk',
    description: `${TOTAL} free UKDesk calculators, grouped by topic. No sign-up.`,
    url: 'https://ukvisainfo.co.uk/tools',
  },
};

export default function ToolsIndexPage() {
  return <ToolsClient />;
}
