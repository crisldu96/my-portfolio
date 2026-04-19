import React from 'react';
import { Metadata } from 'next';
import NextLink from 'next/link';
import {
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
} from '@mui/material';

import AppBar from '@/components/layout/AppBar';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Articles about web development, AI, React, Next.js, and software engineering by Cristopher Palacios.',
  alternates: { canonical: 'https://cristopherpalacios.dev/blog' },
  openGraph: {
    title: 'Blog | Cristopher Palacios',
    description:
      'Articles about web development, AI, React, Next.js, and software engineering by Cristopher Palacios.',
    url: 'https://cristopherpalacios.dev/blog',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D1229' }}>
      <AppBar />
      <Container maxWidth="md" sx={{ pt: 14, pb: 10 }}>
        <h2
          style={{
            fontWeight: 700,
            fontFamily: 'var(--font-archivo), sans-serif',
            color: '#FAFAFA',
            margin: 0,
            marginBottom: 8,
          }}
        >
          Blog
        </h2>
        <p style={{ color: '#94A3B8', marginBottom: 48 }}>
          Thoughts on web development, AI, and software engineering.
        </p>

        {posts.length === 0 ? (
          <p style={{ color: '#94A3B8' }}>No posts published yet.</p>
        ) : (
          <Stack spacing={3}>
            {posts.map((post, index) => (
              <React.Fragment key={post.slug}>
                <NextLink href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <Card
                    sx={{
                      bgcolor: '#111936',
                      border: '1px solid rgba(59,130,246,0.15)',
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        borderColor: 'rgba(59,130,246,0.5)',
                        boxShadow: '0 4px 24px rgba(59,130,246,0.08)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{ mb: 1, color: '#94A3B8' }}
                        alignItems="center"
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
                      </Stack>

                      <h5
                        style={{
                          fontWeight: 600,
                          fontFamily: 'var(--font-archivo), sans-serif',
                          color: '#CBD5E1',
                          lineHeight: 1.4,
                          margin: 0,
                          marginBottom: 12,
                        }}
                      >
                        {post.title}
                      </h5>

                      <p
                        style={{ color: '#94A3B8', marginBottom: 16, lineHeight: 1.7, fontSize: '0.875rem' }}
                      >
                        {post.description}
                      </p>

                      {post.tags && post.tags.length > 0 && (
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
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
                    </CardContent>
                  </Card>
                </NextLink>
                {index < posts.length - 1 && (
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                )}
              </React.Fragment>
            ))}
          </Stack>
        )}
      </Container>
    </div>
  );
}
