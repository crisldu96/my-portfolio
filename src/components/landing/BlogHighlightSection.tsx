'use client';

import * as React from 'react';
import NextLink from 'next/link';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import SectionLabel from '../cosmic/SectionLabel';
import { cosmic } from '@/themes/cosmicTokens';
import useLanguage from '@/hooks/useLanguage';
import useConfig from '@/hooks/useConfig';
import { useGsapScrollTrigger } from '@/hooks/useGsapScrollTrigger';
import type { BlogPost } from '@/lib/blog';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';

interface BlogHighlightSectionProps {
  posts: BlogPost[];
}

const formatDate = (iso: string, locale: string) => {
  try {
    return new Date(iso).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
};

const BlogHighlightSection = ({ posts }: BlogHighlightSectionProps) => {
  const { handleTranslation } = useLanguage();
  const { locale } = useConfig();
  const dateLocale = locale === 'es' ? 'es-ES' : 'en-US';

  const gridRef = useGsapScrollTrigger<HTMLDivElement>({
    childSelector: '.blog-highlight-card',
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
    stagger: 0.15,
  });

  const handleCardClick = (slug: string, title: string) => {
    trackEvent(ANALYTICS_EVENTS.BLOG_POST_CLICKED, {
      slug,
      title,
      source: 'home_highlight',
    });
  };

  const handleViewAllClick = () => {
    trackEvent(ANALYTICS_EVENTS.BLOG_HIGHLIGHT_CTA_CLICKED, {
      target: '/blog',
    });
  };

  return (
    <Container maxWidth="lg">
      <style>{`
        .blog-highlight-card-outer {
          position: relative;
          border-radius: 20px;
          padding: 1px;
          background: ${cosmic.gradientBorder};
          transition: transform 0.3s ease;
          height: 100%;
        }
        .blog-highlight-card-outer:hover {
          transform: translateY(-4px);
        }
        .blog-highlight-card-inner {
          border-radius: 19px;
          background: ${cosmic.bg1};
          height: 100%;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .blog-highlight-link {
          text-decoration: none;
          display: block;
          height: 100%;
        }
        .blog-highlight-tag {
          display: inline-flex;
          align-items: center;
          height: 22px;
          padding: 0 10px;
          border-radius: 16px;
          background-color: rgba(59,130,246,0.1);
          color: ${cosmic.blue};
          border: 1px solid rgba(59,130,246,0.3);
          font-weight: 500;
          font-size: 0.7rem;
        }
        .blog-highlight-read-more {
          color: ${cosmic.cyan};
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 0.8125rem;
          letter-spacing: 0.05em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: gap 0.3s ease;
        }
        .blog-highlight-card-outer:hover .blog-highlight-read-more {
          gap: 10px;
        }
        .blog-highlight-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          border-radius: 999px;
          border: 1px solid ${cosmic.lineStrong};
          background: rgba(59,130,246,0.08);
          color: ${cosmic.textPrimary};
          font-family: var(--font-space-grotesk), sans-serif;
          font-weight: 600;
          font-size: 0.9375rem;
          letter-spacing: 0.02em;
          text-decoration: none;
          transition: gap 0.3s ease, background 0.3s ease, border-color 0.3s ease;
        }
        .blog-highlight-cta:hover {
          gap: 14px;
          background: rgba(59,130,246,0.15);
          border-color: ${cosmic.cyan};
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <SectionLabel
          number="05"
          label={handleTranslation('blogHighlightSection.sectionLabel')}
        />
        <h2 className="section-headline" style={{ marginBottom: 12 }}>
          <span className="reveal-on-scroll">
            <span>{handleTranslation('blogHighlightSection.title')}</span>
          </span>
        </h2>
        <p
          style={{
            fontSize: '1rem',
            color: cosmic.textSecondary,
            maxWidth: 560,
            margin: '0 auto',
          }}
          suppressHydrationWarning
        >
          {handleTranslation('blogHighlightSection.description')}
        </p>
      </div>

      {posts.length === 0 ? (
        <p
          style={{
            textAlign: 'center',
            color: cosmic.textSecondary,
            fontSize: '0.9375rem',
          }}
          suppressHydrationWarning
        >
          {handleTranslation('blogHighlightSection.empty')}
        </p>
      ) : (
        <Grid ref={gridRef} container spacing={3}>
          {posts.map((post) => (
            <Grid
              key={post.slug}
              item
              xs={12}
              md={4}
              className="blog-highlight-card"
            >
              <NextLink
                href={`/blog/${post.slug}`}
                className="blog-highlight-link"
                onClick={() => handleCardClick(post.slug, post.title)}
                aria-label={post.title}
              >
                <div className="blog-highlight-card-outer">
                  <div className="blog-highlight-card-inner">
                    <div
                      style={{
                        display: 'flex',
                        gap: 12,
                        fontFamily: 'var(--font-jetbrains-mono), monospace',
                        fontSize: '0.75rem',
                        color: cosmic.textSecondary,
                        letterSpacing: '0.05em',
                      }}
                    >
                      <span>{formatDate(post.date, dateLocale)}</span>
                      <span>·</span>
                      <span>{post.readingTime}</span>
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-space-grotesk), sans-serif',
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: cosmic.textPrimary,
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {post.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        color: cosmic.textSecondary,
                        margin: 0,
                        flex: 1,
                      }}
                    >
                      {post.description}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 6,
                        }}
                      >
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="blog-highlight-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <span className="blog-highlight-read-more">
                      {handleTranslation('blogHighlightSection.readMore')}
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </NextLink>
            </Grid>
          ))}
        </Grid>
      )}

      <div style={{ textAlign: 'center', marginTop: 56 }}>
        <NextLink
          href="/blog"
          className="blog-highlight-cta"
          onClick={handleViewAllClick}
        >
          {handleTranslation('blogHighlightSection.viewAll')}
          <span aria-hidden="true">→</span>
        </NextLink>
      </div>
    </Container>
  );
};

export default BlogHighlightSection;
