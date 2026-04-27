import React from 'react';
import { Metadata } from 'next';

import AppBar from '@/components/layout/AppBar';
import BlogListClient from '@/components/blog/BlogListClient';
import { getAllPosts } from '@/lib/blog';
import '@/styles/cosmic.css';

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
      <BlogListClient posts={posts} />
    </div>
  );
}
