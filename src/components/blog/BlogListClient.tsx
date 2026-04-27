'use client';

import React from 'react';
import NextLink from 'next/link';

import useLanguage from '@/hooks/useLanguage';
import useConfig from '@/hooks/useConfig';
import type { BlogPost } from '@/lib/blog';

interface BlogListClientProps {
  posts: BlogPost[];
}

export default function BlogListClient({ posts }: BlogListClientProps) {
  const { handleTranslation } = useLanguage();
  const { locale } = useConfig();
  const dateLocale = locale === 'es' ? 'es-ES' : 'en-US';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingTop: 112, paddingBottom: 80, paddingLeft: 24, paddingRight: 24 }}>
      <h2
        style={{
          fontWeight: 700,
          fontFamily: 'var(--font-archivo), sans-serif',
          color: '#FAFAFA',
          margin: 0,
          marginBottom: 8,
        }}
        suppressHydrationWarning
      >
        {handleTranslation('blogPage.title')}
      </h2>
      <p style={{ color: '#94A3B8', marginBottom: 48 }} suppressHydrationWarning>
        {handleTranslation('blogPage.subtitle')}
      </p>

      {posts.length === 0 ? (
        <p style={{ color: '#94A3B8' }} suppressHydrationWarning>
          {handleTranslation('blogPage.empty')}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {posts.map((post, index) => (
            <React.Fragment key={post.slug}>
              <NextLink href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <div className="blog-list-card">
                  <div style={{ padding: 24 }}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 16,
                        marginBottom: 8,
                        color: '#94A3B8',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.75rem' }} suppressHydrationWarning>
                        {new Date(post.date).toLocaleDateString(dateLocale, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <span style={{ fontSize: '0.75rem' }}>·</span>
                      <span style={{ fontSize: '0.75rem' }}>{post.readingTime}</span>
                    </div>

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
                      <div style={{ display: 'flex', flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="blog-list-chip"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              height: 24,
                              padding: '0 10px',
                              borderRadius: 16,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </NextLink>
              {index < posts.length - 1 && (
                <hr className="blog-list-divider" style={{ border: 'none', borderTop: '1px solid', margin: 0 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
