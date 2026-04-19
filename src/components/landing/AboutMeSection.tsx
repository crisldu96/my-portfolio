'use client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import SectionLabel from '../cosmic/SectionLabel';
import GlowCard from '../cosmic/GlowCard';
import { cosmic } from '@/themes/cosmicTokens';
import useLanguage from '@/hooks/useLanguage';
import { useGsapScrollTrigger } from '@/hooks/useGsapScrollTrigger';

const statPills = [
  { value: '5+', label: 'Years' },
  { value: '20+', label: 'Projects' },
  { value: 'EN/ES', label: 'Bilingual' },
];

const AboutMeSection = () => {
  const { handleTranslation } = useLanguage();
  const sectionRef = useGsapScrollTrigger<HTMLDivElement>({
    childSelector: '.about-animate',
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
    stagger: 0.15,
  });

  return (
    <Container maxWidth="lg">
      <Grid ref={sectionRef} container spacing={6} alignItems="center">
        {/* Left: Avatar card */}
        <Grid item xs={12} md={5} className="about-animate">
          <GlowCard gradient>
            <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
              <Box
                component="img"
                src="/assets/images/paisaje.jpg"
                alt="Cristopher Palacios"
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '12px',
                  filter: 'brightness(0.9)',
                }}
              />
              {/* Glow accent */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${cosmic.blue}40, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />
              {/* Technical overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  display: 'flex',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '6px',
                    background: 'rgba(8, 12, 26, 0.7)',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${cosmic.line}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-jetbrains-mono), monospace',
                      fontSize: '0.625rem',
                      color: cosmic.cyan,
                      letterSpacing: '0.08em',
                    }}
                  >
                    ID_0421 &middot; CP
                  </Typography>
                </Box>
              </Box>
            </Box>
          </GlowCard>
        </Grid>

        {/* Right: Content */}
        <Grid item xs={12} md={7} className="about-animate">
          <SectionLabel number="01" label="About" />
          <Typography
            sx={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 700,
              color: cosmic.textPrimary,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              mb: 3,
            }}
          >
            {handleTranslation('aboutMeSection.title')}
          </Typography>
          <Typography
            sx={{
              fontSize: '1rem',
              lineHeight: 1.7,
              color: cosmic.textSecondary,
              mb: 4,
              maxWidth: 540,
            }}
          >
            {handleTranslation('aboutMeSection.description')}
          </Typography>

          {/* Stat pills */}
          <Stack direction="row" spacing={2} sx={{ mb: 4, flexWrap: 'wrap', gap: 1.5 }}>
            {statPills.map((stat) => (
              <Box
                key={stat.label}
                sx={{
                  px: 2.5,
                  py: 1,
                  borderRadius: '999px',
                  border: `1px solid ${cosmic.line}`,
                  background: 'rgba(22, 32, 64, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    background: cosmic.gradientText,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: cosmic.textSecondary,
                    letterSpacing: '0.04em',
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Stack>

          {/* Currently building indicator */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)',
                animation: 'cosmic-pulse 2s infinite',
              }}
            />
            <Typography
              sx={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: '0.6875rem',
                color: cosmic.textSecondary,
                letterSpacing: '0.08em',
              }}
            >
              CURRENTLY BUILDING
            </Typography>
          </Stack>
        </Grid>

        {/* Skill cards below */}
        <Grid item xs={12} md={6} className="about-animate">
          <GlowCard>
            <Typography
              sx={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: cosmic.textPrimary,
                mb: 2,
              }}
            >
              {handleTranslation('aboutMeSection.card1Subtitle')}
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', lineHeight: 1.7, color: cosmic.textSecondary }}>
              {handleTranslation('aboutMeSection.card1Description')}
            </Typography>
          </GlowCard>
        </Grid>
        <Grid item xs={12} md={6} className="about-animate">
          <GlowCard>
            <Typography
              sx={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: cosmic.textPrimary,
                mb: 2,
              }}
            >
              {handleTranslation('aboutMeSection.card2Subtitle')}
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', lineHeight: 1.7, color: cosmic.textSecondary }}>
              {handleTranslation('aboutMeSection.card2Description')}
            </Typography>
          </GlowCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AboutMeSection;
