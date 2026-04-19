'use client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

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
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
              <img
                src="/assets/images/paisaje.jpg"
                alt="Cristopher Palacios"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '12px',
                  filter: 'brightness(0.9)',
                }}
              />
              {/* Glow accent */}
              <div
                style={{
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
              <div
                style={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  display: 'flex',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 4,
                    paddingBottom: 4,
                    borderRadius: '6px',
                    background: 'rgba(8, 12, 26, 0.7)',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${cosmic.line}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-jetbrains-mono), monospace',
                      fontSize: '0.625rem',
                      color: cosmic.cyan,
                      letterSpacing: '0.08em',
                    }}
                  >
                    ID_0421 &middot; CP
                  </span>
                </div>
              </div>
            </div>
          </GlowCard>
        </Grid>

        {/* Right: Content */}
        <Grid item xs={12} md={7} className="about-animate">
          <SectionLabel number="01" label="About" />
          <h2
            style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: '2.75rem',
              fontWeight: 700,
              color: cosmic.textPrimary,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              margin: 0,
              marginBottom: 24,
            }}
          >
            {handleTranslation('aboutMeSection.title')}
          </h2>
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.7,
              color: cosmic.textSecondary,
              marginTop: 0,
              marginBottom: 32,
              maxWidth: 540,
            }}
          >
            {handleTranslation('aboutMeSection.description')}
          </p>

          {/* Stat pills */}
          <Stack direction="row" spacing={2} style={{ marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            {statPills.map((stat) => (
              <div
                key={stat.label}
                style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 8,
                  paddingBottom: 8,
                  borderRadius: '999px',
                  border: `1px solid ${cosmic.line}`,
                  background: 'rgba(22, 32, 64, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
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
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: cosmic.textSecondary,
                    letterSpacing: '0.04em',
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </Stack>

          {/* Currently building indicator */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)',
                animation: 'cosmic-pulse 2s infinite',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: '0.6875rem',
                color: cosmic.textSecondary,
                letterSpacing: '0.08em',
              }}
            >
              CURRENTLY BUILDING
            </span>
          </Stack>
        </Grid>

        {/* Skill cards below */}
        <Grid item xs={12} md={6} className="about-animate">
          <GlowCard>
            <h3
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: cosmic.textPrimary,
                margin: 0,
                marginBottom: 16,
              }}
            >
              {handleTranslation('aboutMeSection.card1Subtitle')}
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: cosmic.textSecondary, margin: 0 }}>
              {handleTranslation('aboutMeSection.card1Description')}
            </p>
          </GlowCard>
        </Grid>
        <Grid item xs={12} md={6} className="about-animate">
          <GlowCard>
            <h3
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: cosmic.textPrimary,
                margin: 0,
                marginBottom: 16,
              }}
            >
              {handleTranslation('aboutMeSection.card2Subtitle')}
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: cosmic.textSecondary, margin: 0 }}>
              {handleTranslation('aboutMeSection.card2Description')}
            </p>
          </GlowCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AboutMeSection;
