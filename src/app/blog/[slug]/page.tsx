import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NextLink from 'next/link';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import AppBar from '@/components/layout/AppBar';
import { getAllSlugs, getPostBySlug } from '@/lib/blog';

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Typography variant="h3" sx={{ fontWeight: 700, color: '#FAFAFA', mt: 4, mb: 2 }} {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Typography variant="h4" sx={{ fontWeight: 600, color: '#FAFAFA', mt: 4, mb: 2 }} {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Typography variant="h5" sx={{ fontWeight: 600, color: '#CBD5E1', mt: 3, mb: 1.5 }} {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Typography variant="h6" sx={{ fontWeight: 600, color: '#CBD5E1', mt: 2, mb: 1 }} {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <Typography
      variant="body1"
      component="p"
      sx={{ color: '#CBD5E1', lineHeight: 1.8, mb: 2 }}
      {...props}
    />
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
    <Box
      component="ul"
      sx={{ color: '#CBD5E1', pl: 3, mb: 2, '& li': { mb: 0.5, lineHeight: 1.8 } }}
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <Box
      component="ol"
      sx={{ color: '#CBD5E1', pl: 3, mb: 2, '& li': { mb: 0.5, lineHeight: 1.8 } }}
      {...props}
    />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <Box
      component="blockquote"
      sx={{
        borderLeft: '4px solid #3B82F6',
        pl: 3,
        py: 0.5,
        my: 3,
        bgcolor: 'rgba(59,130,246,0.06)',
        borderRadius: '0 8px 8px 0',
        color: '#94A3B8',
        fontStyle: 'italic',
      }}
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <Box
      component="code"
      sx={{
        bgcolor: 'rgba(59,130,246,0.1)',
        color: '#60A5FA',
        px: 0.75,
        py: 0.25,
        borderRadius: 1,
        fontFamily: 'monospace',
        fontSize: '0.875em',
      }}
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <Box
      component="pre"
      sx={{
        bgcolor: '#0D1229',
        border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: 2,
        p: 3,
        overflowX: 'auto',
        mb: 3,
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        lineHeight: 1.7,
        color: '#CBD5E1',
        '& code': {
          bgcolor: 'transparent',
          color: 'inherit',
          px: 0,
          py: 0,
          borderRadius: 0,
          fontSize: 'inherit',
        },
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
    <Box sx={{ minHeight: '100vh', bgcolor: '#0D1229' }}>
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
          <Typography variant="caption">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
          <Typography variant="caption">·</Typography>
          <Typography variant="caption">{post.readingTime}</Typography>
          <Typography variant="caption">·</Typography>
          <Typography variant="caption">{post.author}</Typography>
        </Stack>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontFamily: 'var(--font-archivo), sans-serif',
            color: '#FAFAFA',
            mb: 2,
            lineHeight: 1.25,
          }}
        >
          {post.title}
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: '#94A3B8', mb: 3, fontSize: '1.1rem', lineHeight: 1.7 }}
        >
          {post.description}
        </Typography>

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

        <Box sx={{ '& > *:first-of-type': { mt: 0 } }}>
          <MDXContent content={post.content} />
        </Box>

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
    </Box>
  );
}
