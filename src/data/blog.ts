// Blog post registry. Each post is an indexable long-form article
// targeting a specific low-competition UK desk query.

export type BlogCategory =
  | 'money' | 'property' | 'business' | 'benefits'
  | 'family' | 'motoring' | 'energy' | 'estate';

export interface RelatedTool {
  href: string;
  label: string;
  hint: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  updated: string; // ISO
  readMinutes: number;
  tags: string[];
  body: string; // markdown
  /** Topic silo. Optional on legacy posts — inferred as 'money' if absent. */
  category?: BlogCategory;
  /** Calculators/tools to cross-link from the article (cluster model). */
  relatedTools?: RelatedTool[];
}

export interface BlogCategoryMeta {
  id: BlogCategory;
  label: string;
  description: string;
  accent: string; // hex
}

export const BLOG_CATEGORIES: BlogCategoryMeta[] = [
  { id: 'money',    label: 'Money & Tax',         description: 'Income tax, take-home pay, savings, pensions and HMRC.', accent: '#00875A' },
  { id: 'property', label: 'Property & Mortgages', description: 'Buying, mortgages, stamp duty and renting in the UK.', accent: '#00875A' },
  { id: 'business', label: 'Business & Self-Employed', description: 'VAT, corporation tax, sole trader vs limited and more.', accent: '#006c49' },
  { id: 'benefits', label: 'Benefits & Support',  description: 'Universal Credit, childcare, council tax and disability help.', accent: '#00875A' },
  { id: 'family',   label: 'Family & Law',        description: 'Divorce, maintenance, wills and family finances.', accent: '#ba1a1a' },
  { id: 'motoring', label: 'Motoring & Vehicles', description: 'Road tax, running costs, EVs and clean-air zones.', accent: '#00875A' },
  { id: 'energy',   label: 'Energy & Bills',      description: 'Price cap, solar, heat pumps and cutting household bills.', accent: '#006c49' },
  { id: 'estate',   label: 'Estate & Inheritance', description: 'Inheritance tax, probate, wills and estate planning.', accent: '#623c00' },
];

export const getCategoryMeta = (id: BlogCategory): BlogCategoryMeta =>
  BLOG_CATEGORIES.find((c) => c.id === id) ?? BLOG_CATEGORIES[0];

/** Category of a post — explicit field, or 'money' if absent. */
export const postCategory = (post: BlogPost): BlogCategory => post.category ?? 'money';

export const getPostsByCategory = (id: BlogCategory): BlogPost[] =>
  BLOG_POSTS.filter((p) => postCategory(p) === id);


import { GUIDE_POSTS } from './blogGuides';

/** All blog posts, newest multi-category guides first.
 *  Post bodies live in blogGuides.ts to keep each module a
 *  size the compiler handles; add new posts to blogGuides.ts. */
export const BLOG_POSTS: BlogPost[] = [...GUIDE_POSTS];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
