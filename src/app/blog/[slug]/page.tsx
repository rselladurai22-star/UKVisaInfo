import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BLOG_POSTS, getPost } from '../../../data/blog';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://ukvisainfo.co.uk/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: RouteParams) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated,
    author: { '@type': 'Organization', name: 'UK Visa Info' },
    publisher: {
      '@type': 'Organization',
      name: 'UK Visa Info',
      url: 'https://ukvisainfo.co.uk',
    },
    mainEntityOfPage: `https://ukvisainfo.co.uk/blog/${slug}`,
    keywords: post.tags.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> All articles
        </Link>

        <header className="mb-10 pb-8 border-b border-outline-variant/30">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold uppercase tracking-widest text-secondary bg-secondary/10 rounded-full px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-on-surface-variant mb-6">
            {post.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readMinutes} min read
            </span>
          </div>
        </header>

        <div className="prose-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => (
                <h2 className="text-2xl md:text-3xl font-bold text-primary mt-10 mb-4">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold text-primary mt-8 mb-3">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-base leading-relaxed text-on-surface mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 space-y-2 mb-5 text-on-surface">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 space-y-2 mb-5 text-on-surface">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-secondary underline decoration-secondary/40 hover:decoration-secondary underline-offset-2 font-medium"
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-primary">{children}</strong>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-6 rounded-lg border border-outline-variant/30">
                  <table className="w-full text-sm">{children}</table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-surface-container-low border-b border-outline-variant/30">
                  {children}
                </thead>
              ),
              th: ({ children }) => (
                <th className="text-left px-4 py-3 font-bold text-primary text-xs uppercase tracking-wider">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 border-t border-outline-variant/20">
                  {children}
                </td>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-secondary pl-4 italic text-on-surface-variant my-4">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-surface-container text-secondary px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              ),
            }}
          >
            {post.body}
          </ReactMarkdown>
        </div>

        <footer className="mt-12 pt-8 border-t border-outline-variant/30">
          <div className="bg-surface-container-low rounded-xl p-6">
            <h3 className="text-lg font-bold text-primary mb-2">
              Find the right UK visa route
            </h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Take our 60-second quiz to see which UK visa matches your
              situation.
            </p>
            <Link
              href="/eligibility"
              className="inline-flex items-center gap-2 bg-secondary text-white font-bold px-5 py-2.5 rounded-xl hover:bg-secondary/90 transition-colors text-sm"
            >
              Start eligibility check
            </Link>
          </div>
        </footer>
      </article>
    </>
  );
}
