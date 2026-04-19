'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import SectionLabel from '../cosmic/SectionLabel';
import GlowCard from '../cosmic/GlowCard';
import { cosmic } from '@/themes/cosmicTokens';
import useLanguage from '@/hooks/useLanguage';
import { useGsapScrollTrigger } from '@/hooks/useGsapScrollTrigger';

import { IconBrowser, IconServer, IconBrain, IconCloud } from '@tabler/icons-react';

interface SkillTag {
  name: string;
  size: 'lg' | 'md' | 'sm';
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  tint: string;
  skills: SkillTag[];
}

const categories: SkillCategory[] = [
  {
    title: 'Frontend',
    icon: <IconBrowser size={22} />,
    tint: cosmic.blue,
    skills: [
      { name: 'React', size: 'lg' },
      { name: 'Next.js', size: 'lg' },
      { name: 'TypeScript', size: 'lg' },
      { name: 'JavaScript', size: 'md' },
      { name: 'Material-UI', size: 'md' },
      { name: 'HTML/CSS', size: 'md' },
      { name: 'Tailwind', size: 'sm' },
      { name: 'SASS', size: 'sm' },
      { name: 'Bootstrap', size: 'sm' },
    ],
  },
  {
    title: 'Backend',
    icon: <IconServer size={22} />,
    tint: cosmic.cyan,
    skills: [
      { name: 'Node.js', size: 'lg' },
      { name: 'Java', size: 'md' },
      { name: 'Spring Boot', size: 'md' },
      { name: 'Python', size: 'md' },
      { name: 'MySQL', size: 'md' },
      { name: 'REST APIs', size: 'sm' },
    ],
  },
  {
    title: 'AI / ML',
    icon: <IconBrain size={22} />,
    tint: cosmic.violet,
    skills: [
      { name: 'OpenAI', size: 'lg' },
      { name: 'LangChain', size: 'md' },
      { name: 'TensorFlow', size: 'sm' },
      { name: 'NLP', size: 'sm' },
      { name: 'RAG', size: 'sm' },
    ],
  },
  {
    title: 'DevOps',
    icon: <IconCloud size={22} />,
    tint: cosmic.cyan,
    skills: [
      { name: 'GCP', size: 'lg' },
      { name: 'AWS', size: 'md' },
      { name: 'Docker', size: 'md' },
      { name: 'CI/CD', size: 'sm' },
      { name: 'Git', size: 'md' },
      { name: 'Figma', size: 'sm' },
    ],
  },
];

const sizeStyles = {
  lg: { fontSize: '0.875rem', px: 2.25, py: 0.875 },
  md: { fontSize: '0.8125rem', px: 1.75, py: 0.625 },
  sm: { fontSize: '0.75rem', px: 1.5, py: 0.5 },
};

const SkillsSection = () => {
  const { handleTranslation } = useLanguage();
  const gridRef = useGsapScrollTrigger<HTMLDivElement>({
    childSelector: '.skill-card',
    from: { opacity: 0, y: 40, scale: 0.95 },
    to: { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' },
    stagger: 0.12,
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <SectionLabel number="03" label="Skills" />
        <Typography
          sx={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontSize: { xs: '2rem', md: '2.75rem' },
            fontWeight: 700,
            color: cosmic.textPrimary,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            mb: 1.5,
          }}
        >
          {handleTranslation('skillsSection.title')}
        </Typography>
        <Typography sx={{ fontSize: '1rem', color: cosmic.textSecondary }}>
          {handleTranslation('skillsSection.subtitle')}
        </Typography>
      </Box>

      <Grid ref={gridRef} container spacing={3}>
        {categories.map((cat) => (
          <Grid key={cat.title} item xs={12} sm={6} lg={3} className="skill-card">
            <GlowCard sx={{ height: '100%' }}>
              {/* Category header */}
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${cat.tint}15`,
                    border: `1px solid ${cat.tint}30`,
                    color: cat.tint,
                  }}
                >
                  {cat.icon}
                </Box>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-space-grotesk), sans-serif',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: cosmic.textPrimary,
                  }}
                >
                  {cat.title}
                </Typography>
              </Stack>

              {/* Skill tags */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {cat.skills.map((skill) => {
                  const s = sizeStyles[skill.size];
                  return (
                    <Box
                      key={skill.name}
                      sx={{
                        ...s,
                        borderRadius: '8px',
                        border: `1px solid ${cat.tint}25`,
                        background: `${cat.tint}0A`,
                        color: cosmic.textSecondary,
                        fontFamily: 'var(--font-jetbrains-mono), monospace',
                        lineHeight: 1,
                        transition: 'all 0.2s ease',
                        cursor: 'default',
                        '&:hover': {
                          borderColor: `${cat.tint}50`,
                          color: cosmic.textPrimary,
                          background: `${cat.tint}15`,
                        },
                      }}
                    >
                      {skill.name}
                    </Box>
                  );
                })}
              </Box>
            </GlowCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SkillsSection;
