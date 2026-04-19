import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NextLink from 'next/link';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import {
  Button,
  Chip,
  Container,
  Divider,
  Link,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import AppBar from '@/components/layout/AppBar';
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
    <Link
      href={props.href}
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      sx={{ color: '#3B82F6', '&:hover': { color: '#60A5FA' } }}
    >
      {props.children}
    </Link>
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
  hr: () => <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 4 }} />,
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
      <Container maxWidth="md" sx={{ pt: 14, pb: 12 }}>
        <NextLink href="/blog" passHref legacyBehavior>
          <Button
            component="a"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 5, color: '#94A3B8', textTransform: 'none', pl: 0 }}
          >
            Back to Blog
          </Button>
        </NextLink>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ color: '#94A3B8', mb: 2 }}
        >
          <span style={{ fontSize: '0.75rem' }}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
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
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 5 }}>
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  bgcolor: 'rgba(59,130,246,0.1)',
                  color: '#3B82F6',
                  border: '1px solid rgba(59,130,246,0.3)',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                }}
              />
            ))}
          </Stack>
        )}

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 5 }} />

        <div>
          <MDXContent content={post.content} />
        </div>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mt: 8, mb: 5 }} />

        <NextLink href="/blog" passHref legacyBehavior>
          <Button
            component="a"
            startIcon={<ArrowBackIcon />}
            sx={{ color: '#94A3B8', textTransform: 'none', pl: 0 }}
          >
            Back to Blog
          </Button>
        </NextLink>
      </Container>
    </div>
  );
}
