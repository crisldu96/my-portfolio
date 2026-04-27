'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
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
  titleKey: string;
  icon: React.ReactNode;
  tint: string;
  skills: SkillTag[];
}

const categories: SkillCategory[] = [
  {
    titleKey: 'skillsSection.categories.frontend',
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
    titleKey: 'skillsSection.categories.backend',
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
    titleKey: 'skillsSection.categories.ai',
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
    titleKey: 'skillsSection.categories.devops',
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
  lg: { fontSize: '0.875rem', paddingLeft: 18, paddingRight: 18, paddingTop: 7, paddingBottom: 7 },
  md: { fontSize: '0.8125rem', paddingLeft: 14, paddingRight: 14, paddingTop: 5, paddingBottom: 5 },
  sm: { fontSize: '0.75rem', paddingLeft: 12, paddingRight: 12, paddingTop: 4, paddingBottom: 4 },
};

const SkillTagChip = ({ skill, tint }: { skill: SkillTag; tint: string }) => {
  const [hovered, setHovered] = useState(false);
  const s = sizeStyles[skill.size];

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...s,
        borderRadius: 8,
        border: `1px solid ${tint}${hovered ? '50' : '25'}`,
        background: `${tint}${hovered ? '15' : '0A'}`,
        color: hovered ? cosmic.textPrimary : cosmic.textSecondary,
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        lineHeight: 1,
        transition: 'all 0.2s ease',
        cursor: 'default',
      }}
    >
      {skill.name}
    </span>
  );
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
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <SectionLabel number="03" label={handleTranslation('skillsSection.sectionLabel')} />
        <h2 className="section-headline" style={{ marginBottom: 12 }}>
          <span className="reveal-on-scroll">
            <span>{handleTranslation('skillsSection.title')}</span>
          </span>
        </h2>
        <p style={{ fontSize: '1rem', color: cosmic.textSecondary, margin: 0 }}>
          {handleTranslation('skillsSection.subtitle')}
        </p>
      </div>

      <Grid ref={gridRef} container spacing={3}>
        {categories.map((cat) => (
          <Grid key={cat.titleKey} item xs={12} sm={6} lg={3} className="skill-card">
            <GlowCard style={{ height: '100%' }}>
              {/* Category header */}
              <Stack direction="row" alignItems="center" spacing={1.5} style={{ marginBottom: 24 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${cat.tint}15`,
                    border: `1px solid ${cat.tint}30`,
                    color: cat.tint,
                  }}
                >
                  {cat.icon}
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-space-grotesk), sans-serif',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: cosmic.textPrimary,
                  }}
                  suppressHydrationWarning
                >
                  {handleTranslation(cat.titleKey)}
                </span>
              </Stack>

              {/* Skill tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {cat.skills.map((skill) => (
                  <SkillTagChip key={skill.name} skill={skill} tint={cat.tint} />
                ))}
              </div>
            </GlowCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SkillsSection;
