import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import {
  Chip,
  Container,
  Divider,
  Stack,
} from '@mui/material';

import AppBar from '@/components/layout/AppBar';
import BlogBackButton from '@/components/blog/BlogBackButton';
import BlogPostDate from '@/components/blog/BlogPostDate';
import { getAllSlugs, getPostBySlug } from '@/lib/blog';

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 style={{ fontWeight: 700, color: '#FAFAFA', marginTop: 32, marginBottom: 16 }} {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 style={{ fontWeight: 600, color: '#FAFAFA', marginTop: 32, marginBottom: 16 }} {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 style={{ fontWeight: 600, color: '#CBD5E1', marginTop: 24, marginBottom: 12 }} {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 style={{ fontWeight: 600, color: '#CBD5E1', marginTop: 16, marginBottom: 8 }} {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p style={{ color: '#CBD5E1', lineHeight: 1.8, marginBottom: 16 }} {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={props.href}
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="blog-mdx-link"
    >
      {props.children}
    </a>
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul style={{ color: '#CBD5E1', paddingLeft: 24, marginBottom: 16 }} {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol style={{ color: '#CBD5E1', paddingLeft: 24, marginBottom: 16 }} {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      style={{
        borderLeft: '4px solid #3B82F6',
        paddingLeft: 24,
        paddingTop: 4,
        paddingBottom: 4,
        marginTop: 24,
        marginBottom: 24,
        backgroundColor: 'rgba(59,130,246,0.06)',
        borderRadius: '0 8px 8px 0',
        color: '#94A3B8',
        fontStyle: 'italic',
      }}
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      style={{
        backgroundColor: 'rgba(59,130,246,0.1)',
        color: '#60A5FA',
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 4,
        fontFamily: 'monospace',
        fontSize: '0.875em',
      }}
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      style={{
        backgroundColor: '#0D1229',
        border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: 8,
        padding: 24,
        overflowX: 'auto',
        marginBottom: 24,
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        lineHeight: 1.7,
        color: '#CBD5E1',
      }}
      {...props}
    />
  ),
  hr: () => <div style={{ marginTop: 32, marginBottom: 32 }}><Divider className="blog-divider" /></div>,
};

async function MDXContent({ content }: { content: string }) {
  const { default: Content } = await evaluate(content, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    useMDXComponents: () => mdxComponents,
  } as Parameters<typeof evaluate>[1]);

  return <Content />;
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://cristopherpalacios.dev/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | Cristopher Palacios`,
      description: post.description,
      url: `https://cristopherpalacios.dev/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      ...(post.image && { images: [{ url: post.image }] }),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    url: `https://cristopherpalacios.dev/blog/${post.slug}`,
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D1229' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <AppBar />
      <Container maxWidth="md" style={{ paddingTop: 112, paddingBottom: 96 }}>
        <div style={{ marginBottom: 40 }}>
          <BlogBackButton />
        </div>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          style={{ color: '#94A3B8', marginBottom: 16 }}
        >
          <BlogPostDate date={post.date} />
          <span style={{ fontSize: '0.75rem' }}>·</span>
          <span style={{ fontSize: '0.75rem' }}>{post.readingTime}</span>
          <span style={{ fontSize: '0.75rem' }}>·</span>
          <span style={{ fontSize: '0.75rem' }}>{post.author}</span>
        </Stack>

        <h2
          style={{
            fontWeight: 700,
            fontFamily: 'var(--font-archivo), sans-serif',
            color: '#FAFAFA',
            lineHeight: 1.25,
            margin: 0,
            marginBottom: 16,
          }}
        >
          {post.title}
        </h2>

        <p
          style={{ color: '#94A3B8', marginBottom: 24, fontSize: '1.1rem', lineHeight: 1.7 }}
        >
          {post.description}
        </p>

        {post.tags && post.tags.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap style={{ marginBottom: 40 }}>
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                className="blog-tag-chip"
              />
            ))}
          </Stack>
        )}

        <div style={{ marginBottom: 40 }}>
          <Divider className="blog-divider" />
        </div>

        <div>
          <MDXContent content={post.content} />
        </div>

        <div style={{ marginTop: 64, marginBottom: 40 }}>
          <Divider className="blog-divider" />
        </div>

        <BlogBackButton />
      </Container>
    </div>
  );
}
