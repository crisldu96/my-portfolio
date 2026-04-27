'use client';

import Container from '@mui/material/Container';

import SectionLabel from '../cosmic/SectionLabel';
import GlowCard from '../cosmic/GlowCard';
import { cosmic } from '@/themes/cosmicTokens';
import useLanguage from '@/hooks/useLanguage';
import { useGsapScrollTrigger } from '@/hooks/useGsapScrollTrigger';

interface TimelineEntry {
  yearKey: string;
  role: string;
  company: string;
  descriptionKey: string;
  itemsKey: string;
  tech: string[];
}

const timeline: TimelineEntry[] = [
  {
    yearKey: 'experienceSection.year1',
    role: 'experienceSection.subtitle1',
    company: 'Actuaria',
    descriptionKey: 'experienceSection.description1',
    itemsKey: 'experienceSection.items1',
    tech: ['React', 'TypeScript', 'GCP', 'Material-UI', 'SCRUM'],
  },
  {
    yearKey: 'experienceSection.year2',
    role: 'experienceSection.subtitle2',
    company: 'Freelance',
    descriptionKey: 'experienceSection.description2',
    itemsKey: 'experienceSection.items2',
    tech: ['JavaScript', 'Node.js', 'Python', 'HTML/CSS'],
  },
];

const ExperienceSection = () => {
  const { handleTranslation } = useLanguage();
  const timelineRef = useGsapScrollTrigger<HTMLDivElement>({
    childSelector: '.timeline-entry',
    from: { opacity: 0, x: -40 },
    to: { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' },
    stagger: 0.25,
  });

  return (
    <Container maxWidth="lg">
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <SectionLabel number="02" label={handleTranslation('experienceSection.sectionLabel')} />
        <h2 className="section-headline" style={{ marginBottom: 0 }}>
          <span className="reveal-on-scroll">
            <span>{handleTranslation('experienceSection.title')}</span>
          </span>
        </h2>
      </div>

      <div ref={timelineRef} style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
        {/* Vertical glowing line */}
        <div className="timeline-line" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {timeline.map((entry, idx) => (
            <div key={idx} className="timeline-entry">
              {/* Timeline dot */}
              <div className="timeline-dot" />

              {/* Year pill */}
              <div className="timeline-year-pill">
                <span
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    fontSize: '0.6875rem',
                    color: cosmic.cyan,
                    letterSpacing: '0.08em',
                  }}
                  suppressHydrationWarning
                >
                  {handleTranslation(entry.yearKey)}
                </span>
              </div>

              <GlowCard>
                <h3
                  style={{
                    fontFamily: 'var(--font-space-grotesk), sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: cosmic.textPrimary,
                    marginBottom: 4,
                    marginTop: 0,
                  }}
                >
                  {handleTranslation(entry.role)}
                </h3>
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: cosmic.cyan,
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    letterSpacing: '0.04em',
                    marginBottom: 16,
                    marginTop: 0,
                  }}
                >
                  @ {entry.company}
                </p>

                <p
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    color: cosmic.textSecondary,
                    marginBottom: 20,
                    marginTop: 0,
                  }}
                >
                  {handleTranslation(entry.descriptionKey)}
                </p>

                {/* Achievement bullets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {handleTranslation<string[]>(entry.itemsKey).map((item: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          background: cosmic.cyan,
                          marginTop: 8,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: cosmic.textSecondary }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tech stack chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {entry.tech.map((t) => (
                    <span
                      key={t}
                      className="experience-tech-chip"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default ExperienceSection;
