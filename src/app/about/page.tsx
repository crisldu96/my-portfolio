'use client';

import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NextLink from 'next/link';
import { motion } from 'framer-motion';

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
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: isDark ? 'background.default' : '#FAFAFA',
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="md">
        <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
          <NextLink href="/" passHref legacyBehavior>
            <Button
              component="a"
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 4, color: 'text.secondary' }}
            >
              Back to Home
            </Button>
          </NextLink>
        </motion.div>

        {/* Hero */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              fontFamily: 'var(--font-archivo), sans-serif',
              color: isDark ? '#FAFAFA' : '#18181B',
              mb: 1,
            }}
          >
            Cristopher Palacios
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 500,
              color: theme.palette.primary.main,
              mb: 4,
            }}
          >
            Full Stack Developer
          </Typography>
        </motion.div>

        {/* Bio */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }}>
          <Stack spacing={2.5} sx={{ mb: 6 }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                color: isDark ? '#bdc8f0' : '#3F3F46',
                textAlign: 'justify',
              }}
            >
              I am a Full Stack Developer with a strong focus on building scalable,
              maintainable web applications. My experience spans the entire development
              lifecycle -- from designing intuitive user interfaces with React and Next.js
              to architecting robust backend services with Node.js and cloud infrastructure.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                color: isDark ? '#bdc8f0' : '#3F3F46',
                textAlign: 'justify',
              }}
            >
              I thrive in environments where clean code, thoughtful architecture, and
              continuous improvement are valued. Whether it is optimizing database queries,
              implementing CI/CD pipelines, or crafting pixel-perfect interfaces, I bring
              the same level of care and precision to every layer of the stack.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                color: isDark ? '#bdc8f0' : '#3F3F46',
                textAlign: 'justify',
              }}
            >
              Currently based in Ecuador, I work with teams and clients across the globe,
              turning complex business requirements into elegant, production-ready solutions.
            </Typography>
          </Stack>
        </motion.div>

        {/* Tech Stack */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontFamily: 'var(--font-archivo), sans-serif',
              color: isDark ? '#FAFAFA' : '#18181B',
              mb: 2,
            }}
          >
            Tech Stack
          </Typography>
          <Grid container spacing={1} sx={{ mb: 6 }}>
            {techStack.map((tech) => (
              <Grid item key={tech}>
                <Chip
                  label={tech}
                  variant="outlined"
                  sx={{
                    borderColor: isDark ? '#3F3F46' : '#E4E4E7',
                    color: isDark ? '#bdc8f0' : '#3F3F46',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: theme.palette.primary.main,
                      color: '#fff',
                      borderColor: theme.palette.primary.main,
                    },
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
              href="https://ec.linkedin.com/in/cristopher-palacios-791704160"
              target="_blank"
              variant="contained"
              size="large"
              startIcon={<LinkedInIcon />}
              sx={{
                bgcolor: '#2563EB',
                '&:hover': { bgcolor: '#1d4ed8' },
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
              }}
            >
              Connect on LinkedIn
            </Button>
            <NextLink href="/#contact" passHref legacyBehavior>
              <Button
                component="a"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: isDark ? '#3F3F46' : '#E4E4E7',
                  color: isDark ? '#FAFAFA' : '#18181B',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  '&:hover': {
                    borderColor: '#2563EB',
                    color: '#2563EB',
                  },
                }}
              >
                Get in Touch
              </Button>
            </NextLink>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
