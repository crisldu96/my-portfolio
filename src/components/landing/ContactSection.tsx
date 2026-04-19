'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';

import { IconBrandLinkedin, IconBrandGithub, IconBrandDeno, IconMail } from '@tabler/icons-react';
import SectionLabel from '../cosmic/SectionLabel';
import GlowCard from '../cosmic/GlowCard';
import { cosmic } from '@/themes/cosmicTokens';
import useLanguage from '@/hooks/useLanguage';
import { useGsapScrollTrigger } from '@/hooks/useGsapScrollTrigger';

const contactMethods = [
  {
    id: 'linkedin',
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/cristopher-palacios-791704160',
    icon: <IconBrandLinkedin size={24} />,
    handle: '@cristopher-palacios',
  },
  {
    id: 'github',
    title: 'GitHub',
    url: 'https://github.com/CristopherPalacios',
    icon: <IconBrandGithub size={24} />,
    handle: '@CristopherPalacios',
  },
  {
    id: 'dev',
    title: 'Dev Community',
    url: 'https://dev.to/cristopher_palacios_4a172',
    icon: <IconBrandDeno size={24} />,
    handle: '@cristopher_palacios',
  },
  {
    id: 'email',
    title: 'Email',
    url: 'mailto:cristopher.palacios@actuaria.com',
    icon: <IconMail size={24} />,
    handle: 'cristopher.palacios@actuaria.com',
  },
];

const ContactSection = () => {
  const { handleTranslation } = useLanguage();
  const gridRef = useGsapScrollTrigger<HTMLDivElement>({
    childSelector: '.contact-card',
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    stagger: 0.1,
  });

  return (
    <Box className="project-info">
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <SectionLabel number="05" label="Contact" />
          <Typography
            sx={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              color: cosmic.textPrimary,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              mb: 2,
            }}
          >
            {handleTranslation('contactSection.title')}
          </Typography>
          <Typography
            sx={{
              fontSize: '1rem',
              color: cosmic.textSecondary,
              maxWidth: 480,
              mx: 'auto',
            }}
          >
            Let&apos;s build something together. Reach out through any of the platforms below.
          </Typography>
        </Box>

        <Grid ref={gridRef} container spacing={2}>
          {contactMethods.map((method) => (
            <Grid key={method.id} item xs={12} sm={6} className="contact-card">
              <Link
                href={method.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textDecoration: 'none', display: 'block' }}
              >
                <GlowCard
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `${cosmic.blue}15`,
                      border: `1px solid ${cosmic.line}`,
                      color: cosmic.cyan,
                      flexShrink: 0,
                    }}
                  >
                    {method.icon}
                  </Box>
                  <Stack spacing={0.25}>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-space-grotesk), sans-serif',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: cosmic.textPrimary,
                      }}
                    >
                      {method.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-jetbrains-mono), monospace',
                        fontSize: '0.6875rem',
                        color: cosmic.textSecondary,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {method.handle}
                    </Typography>
                  </Stack>
                </GlowCard>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactSection;
