import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { APP_TILES, CATEGORIES, type CategoryId } from '../../../data/tools';
import HubToolIndex from '../../../components/HubToolIndex';
import BusinessHub from './BusinessHub';
import TaxIncomeHub from './TaxIncomeHub';
import PropertyHub from './PropertyHub';
import InsuranceHub from './InsuranceHub';
import LoansDebtHub from './LoansDebtHub';
import ImmigrationHub from './ImmigrationHub';
import BenefitsHub from './BenefitsHub';
import FamilyLawHub from './FamilyLawHub';
import EmploymentHub from './EmploymentHub';
import EnergyHub from './EnergyHub';
import SavingsHub from './SavingsHub';
import VehiclesHub from './VehiclesHub';

type RouteParams = { params: Promise<{ category: string }> };

const VALID = new Set<string>(CATEGORIES.map((c) => c.id));

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.id === category);
  if (!cat) return {};
  const count = APP_TILES.filter((t) => t.category === cat.id).length;
  const title = `${cat.label} calculators & tools — ${count}+ free UK tools | UKDesk`;
  const description = `${cat.description}. ${count} free ${cat.label.toLowerCase()} calculators, each checked against GOV.UK, HMRC and ONS. No sign-up.`;
  return {
    title,
    description,
    alternates: { canonical: `/category/${cat.id}` },
    openGraph: { title, description, url: `https://ukvisainfo.co.uk/category/${cat.id}` },
  };
}

const HUBS: Partial<Record<CategoryId, () => ReactNode>> = {
  business: () => <BusinessHub />,
  tax: () => <TaxIncomeHub />,
  property: () => <PropertyHub />,
  insurance: () => <InsuranceHub />,
  loans: () => <LoansDebtHub />,
  immigration: () => <ImmigrationHub />,
  benefits: () => <BenefitsHub />,
  'family-law': () => <FamilyLawHub />,
  employment: () => <EmploymentHub />,
  energy: () => <EnergyHub />,
  savings: () => <SavingsHub />,
  vehicles: () => <VehiclesHub />,
};

export default async function CategoryHub({ params }: RouteParams) {
  const { category } = await params;
  if (!VALID.has(category)) notFound();

  const id = category as CategoryId;
  const hub = HUBS[id];

  return (
    <>
      {hub ? hub() : null}
      <HubToolIndex categoryId={id} />
    </>
  );
}
