import React from 'react';
import { Metadata } from 'next';
import NextLink from 'next/link';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
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
    <Box sx={{ minHeight: '100vh', bgcolor: '#0D1229' }}>
      <AppBar />
      <Container maxWidth="md" sx={{ pt: 14, pb: 10 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontFamily: 'var(--font-archivo), sans-serif',
            color: '#FAFAFA',
            mb: 1,
          }}
        >
          Blog
        </Typography>
        <Typography variant="body1" sx={{ color: '#94A3B8', mb: 6 }}>
          Thoughts on web development, AI, and software engineering.
        </Typography>

        {posts.length === 0 ? (
          <Typography sx={{ color: '#94A3B8' }}>No posts published yet.</Typography>
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
                        <Typography variant="caption">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Typography>
                        <Typography variant="caption">·</Typography>
                        <Typography variant="caption">{post.readingTime}</Typography>
                      </Stack>

                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          fontFamily: 'var(--font-archivo), sans-serif',
                          color: '#CBD5E1',
                          mb: 1.5,
                          lineHeight: 1.4,
                        }}
                      >
                        {post.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ color: '#94A3B8', mb: 2, lineHeight: 1.7 }}
                      >
                        {post.description}
                      </Typography>

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
    </Box>
  );
}
