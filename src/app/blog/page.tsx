import type { Metadata } from 'next';
import { BLOG_POSTS } from '../../data/blog';
import BlogIndexClient from './BlogIndexClient';

export const metadata: Metadata = {
  title: 'UK Visa Blog — Guides, Updates & Explainers 2026',
  description:
    'In-depth articles on UK visa rules, fees, eligibility and processing. Updated for 2026 with salary thresholds, IHS rates, Family visa income rules and eVisa transition.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'UK Visa Blog — Guides & Explainers',
    description: 'In-depth UK visa guides updated for 2026.',
    url: 'https://ukvisainfo.co.uk/blog',
  },
};

export default function BlogIndex() {
  return <BlogIndexClient posts={BLOG_POSTS} />;
}
