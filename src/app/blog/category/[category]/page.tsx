import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BLOG_CATEGORIES, getCategoryMeta, getPostsByCategory, type BlogCategory } from '../../../../data/blog';
import BlogIndexClient from '../../BlogIndexClient';

interface RouteParams {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ category: c.id }));
}

const isCategory = (v: string): v is BlogCategory =>
  BLOG_CATEGORIES.some((c) => c.id === v);

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return { title: 'Category not found' };
  const meta = getCategoryMeta(category);
  return {
    title: `${meta.label} Guides — UK 2025/26 | UKDesk`,
    description: meta.description,
    alternates: { canonical: `/blog/category/${meta.id}` },
    openGraph: {
      title: `${meta.label} Guides — UK 2025/26`,
      description: meta.description,
      url: `https://ukvisainfo.co.uk/blog/category/${meta.id}`,
      type: 'website',
    },
  };
}

export default async function BlogCategoryPage({ params }: RouteParams) {
  const { category } = await params;
  if (!isCategory(category)) notFound();
  const posts = getPostsByCategory(category);
  if (posts.length === 0) notFound();
  return <BlogIndexClient posts={posts} />;
}
