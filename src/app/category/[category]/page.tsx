import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { APP_TILES, CATEGORIES, type CategoryId } from '../../../data/tools';
import HubToolIndex from '../../../components/HubToolIndex';

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
  const title = `${cat.label} calculators & tools — free UK tools | UKDesk`;
  const description = `${cat.description}. Free ${cat.label.toLowerCase()} calculators, each checked against GOV.UK, HMRC and ONS. No sign-up.${count ? '' : ''}`;
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
  return <HubToolIndex categoryId={category as CategoryId} />;
}
