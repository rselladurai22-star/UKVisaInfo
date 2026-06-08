import type { Metadata } from 'next';
import MotCheck from './MotCheck';

export const metadata: Metadata = {
  title: 'MOT & Tax Check by Reg Plate UK 2025/26 — DVSA & DVLA | UKDesk',
  description:
    'Free UK MOT and tax checker. Validate any registration plate, see its era, then jump to the official DVSA MOT history and DVLA vehicle tax-status services — no sign-up.',
  alternates: { canonical: '/mot-check' },
  openGraph: {
    title: 'MOT & Tax Check by Reg Plate UK 2025/26',
    description: 'Validate a UK reg and open official DVSA MOT history and DVLA tax checks.',
    url: 'https://ukvisainfo.co.uk/mot-check',
    type: 'article',
  },
};

export default function Page() {
  return <MotCheck />;
}
