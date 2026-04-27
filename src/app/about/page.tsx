'use client';

import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Chip,
  Container,
  Grid,
  Link,
  Stack,
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import { social } from '@/config/social';
import useLanguage from '@/hooks/useLanguage';

const techStack = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Express',
  'NestJS',
  'PostgreSQL',
  'MongoDB',
  'AWS',
  'Docker',
  'GraphQL',
  'MUI',
  'Tailwind CSS',
  'Git',
  'CI/CD',
  'Python',
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

export default function About() {
  const theme = useTheme();
  const { handleTranslation } = useLanguage();
  const isDark = theme.palette.mode === 'dark';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: isDark ? undefined : '#FAFAFA',
        paddingTop: 96,
        paddingBottom: 96,
      }}
    >
      <Container maxWidth="md">
        <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
          <NextLink href="/" passHref legacyBehavior>
            <Button
              component="a"
              startIcon={<ArrowBackIcon />}
              className="about-back-btn"
              style={{ marginBottom: 32 }}
              suppressHydrationWarning
            >
              {handleTranslation('aboutPage.backToHome')}
            </Button>
          </NextLink>
        </motion.div>

        {/* Hero */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
          <h1
            style={{
              fontSize: '3.5rem',
              fontWeight: 700,
              fontFamily: 'var(--font-archivo), sans-serif',
              color: isDark ? '#FAFAFA' : '#18181B',
              margin: 0,
              marginBottom: 8,
            }}
          >
            Cristopher Palacios
          </h1>
          <h4
            style={{
              fontWeight: 500,
              color: theme.palette.primary.main,
              margin: 0,
              marginBottom: 32,
            }}
            suppressHydrationWarning
          >
            {handleTranslation('aboutPage.role')}
          </h4>
        </motion.div>

        {/* Bio */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }}>
          <Stack spacing={2.5} style={{ marginBottom: 48 }}>
            <p
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.8,
                color: isDark ? '#bdc8f0' : '#3F3F46',
                textAlign: 'justify',
                margin: 0,
              }}
              suppressHydrationWarning
            >
              {handleTranslation('aboutPage.bio1')}
            </p>
            <p
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.8,
                color: isDark ? '#bdc8f0' : '#3F3F46',
                textAlign: 'justify',
                margin: 0,
              }}
              suppressHydrationWarning
            >
              {handleTranslation('aboutPage.bio2')}
            </p>
            <p
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.8,
                color: isDark ? '#bdc8f0' : '#3F3F46',
                textAlign: 'justify',
                margin: 0,
              }}
              suppressHydrationWarning
            >
              {handleTranslation('aboutPage.bio3')}
            </p>
          </Stack>
        </motion.div>

        {/* Tech Stack */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.3 }}>
          <h5
            style={{
              fontWeight: 600,
              fontFamily: 'var(--font-archivo), sans-serif',
              color: isDark ? '#FAFAFA' : '#18181B',
              margin: 0,
              marginBottom: 16,
            }}
            suppressHydrationWarning
          >
            {handleTranslation('aboutPage.techStackTitle')}
          </h5>
          <Grid container spacing={1} style={{ marginBottom: 48 }}>
            {techStack.map((tech) => (
              <Grid item key={tech}>
                <Chip
                  label={tech}
                  variant="outlined"
                  className="about-tech-chip"
                  style={{
                    borderColor: isDark ? '#3F3F46' : '#E4E4E7',
                    color: isDark ? '#bdc8f0' : '#3F3F46',
                    fontWeight: 500,
                    transition: 'all 0.2s ease-in-out',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.4 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={Link}
              href={social.linkedin}
              target="_blank"
              variant="contained"
              size="large"
              startIcon={<LinkedInIcon />}
              className="about-linkedin-btn"
              style={{
                backgroundColor: '#2563EB',
                textTransform: 'none',
                fontWeight: 600,
                paddingLeft: 32,
                paddingRight: 32,
              }}
              suppressHydrationWarning
            >
              {handleTranslation('aboutPage.connectLinkedIn')}
            </Button>
            <NextLink href="/#contact" passHref legacyBehavior>
              <Button
                component="a"
                variant="outlined"
                size="large"
                className="about-contact-btn"
                style={{
                  borderColor: isDark ? '#3F3F46' : '#E4E4E7',
                  color: isDark ? '#FAFAFA' : '#18181B',
                  textTransform: 'none',
                  fontWeight: 600,
                  paddingLeft: 32,
                  paddingRight: 32,
                }}
                suppressHydrationWarning
              >
                {handleTranslation('aboutPage.getInTouch')}
              </Button>
            </NextLink>
          </Stack>
        </motion.div>
      </Container>
    </div>
  );
}
