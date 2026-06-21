import type { Metadata } from 'next';
import { BLOG_POSTS } from '../../data/blog';
import BlogIndexClient from './BlogIndexClient';

export const metadata: Metadata = {
  title: 'UKDesk Blog, UK Finance, Visa & Life Guides 2026',
  description:
    'Plain-English guides on UK money, visas, property and life admin. Take-home pay explained, visa fee updates, mortgage tips, HMRC 2026/27 changes and more.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'UKDesk Blog, UK Finance, Visa & Life Guides 2026',
    description: 'Plain-English guides on UK money, visas, property and life admin. Updated for 2026.',
    url: 'https://ukvisainfo.co.uk/blog',
  },
};

export default function BlogIndex() {
  return <BlogIndexClient posts={BLOG_POSTS} />;
}
