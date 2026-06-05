import type { Metadata } from 'next';
import LandlordSuite from './LandlordSuite';

export const metadata: Metadata = {
  title: 'Buy-to-Let & Landlord Calculator 2026 — Yield, Section 24 Tax & CGT',
  description:
    'UK landlord workstation: model rental yield, ROI and the BTL mortgage ICR stress test, see the Section 24 tax impact for higher-rate landlords, and weigh personal vs SPV limited-company ownership — all in one place.',
  alternates: { canonical: '/buy-to-let-calculator' },
  openGraph: {
    title: 'Buy-to-Let & Landlord Calculator 2026 — Yield, Section 24 Tax & CGT',
    description:
      'Model rental yield, ROI, the ICR stress test and the Section 24 tax trap for UK buy-to-let in one landlord workstation.',
    url: 'https://ukvisainfo.co.uk/buy-to-let-calculator',
  },
};

export default function BuyToLetPage() {
  return <LandlordSuite />;
}
