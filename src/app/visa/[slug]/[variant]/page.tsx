import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VISA_DETAILS } from '../../../../data/visaDetails';
import { VISA_VARIANTS, getVariants } from '../../../../data/visaVariants';
import VariantGuide from '../../../../components/visa/VariantGuide';

interface RouteParams { params: Promise<{ slug: string; variant: string }> }

export function generateStaticParams() {
  const all: { slug: string; variant: string }[] = [];
  for (const [slug, vars] of Object.entries(VISA_VARIANTS)) {
    for (const v of vars) all.push({ slug, variant: v.id });
  }
  return all;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug, variant } = await params;
  const visa = VISA_DETAILS[slug as keyof typeof VISA_DETAILS];
  const v = getVariants(slug).find((x) => x.id === variant);
  if (!visa || !v) return { title: 'Sub-route not found' };
  const title = `${visa.title} — ${v.label} (2026 Guide)`;
  const description = `Complete guide for ${v.label}. ${v.headline}. Eligibility, costs, and how to apply. Updated April 2026, sourced from gov.uk.`;
  return {
    title, description,
    alternates: { canonical: `/visa/${slug}/${variant}` },
    openGraph: {
      title, description,
      url: `https://ukvisainfo.co.uk/visa/${slug}/${variant}`,
      type: 'article',
    },
  };
}

export default async function VariantPage({ params }: RouteParams) {
  const { slug, variant } = await params;
  const visa = VISA_DETAILS[slug as keyof typeof VISA_DETAILS];
  const v = getVariants(slug).find((x) => x.id === variant);
  if (!visa || !v) notFound();

  const otherVariants = getVariants(slug).filter((x) => x.id !== variant);

  return (
    <VariantGuide
      visa={visa}
      variant={v}
      otherVariants={otherVariants}
      slug={slug}
    />
  );
}
