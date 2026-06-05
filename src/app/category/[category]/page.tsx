import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { APP_TILES, CATEGORIES } from '../../../data/tools';
import BusinessHub from './BusinessHub';
import TaxIncomeHub from './TaxIncomeHub';
import PropertyHub from './PropertyHub';
import InsuranceHub from './InsuranceHub';
import LoansDebtHub from './LoansDebtHub';

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

export default async function CategoryHub({ params }: RouteParams) {
  const { category } = await params;
  if (!VALID.has(category)) notFound();

  if (category === 'business') return <BusinessHub />;
  if (category === 'tax') return <TaxIncomeHub />;
  if (category === 'property') return <PropertyHub />;
  if (category === 'insurance') return <InsuranceHub />;
  if (category === 'loans-debt') return <LoansDebtHub />;

  notFound();
}
