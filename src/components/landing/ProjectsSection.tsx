'use client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';

import { IconExternalLink, IconBrandGithub } from '@tabler/icons-react';
import SectionLabel from '../cosmic/SectionLabel';
import { cosmic } from '@/themes/cosmicTokens';
import useLanguage from '@/hooks/useLanguage';
import { useGsapScrollTrigger } from '@/hooks/useGsapScrollTrigger';

import App1 from '../../assets/images/landing/projects/app-1-portal.png';
import App2 from '../../assets/images/landing/projects/app-2-kin.png';
import App3 from '../../assets/images/landing/projects/app-3-arupo.png';
import App4 from '../../assets/images/landing/projects/app-4-af.png';
import App5 from '../../assets/images/landing/projects/app-5-provisiones.png';

interface Project {
  slug: string;
  tags: string[];
  image: string;
  link: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    slug: 'portal',
    tags: ['React', 'Node.js', 'AWS'],
    image: App1.src,
    link: 'https://portal.actuaria.com/authentication/login',
    featured: true,
  },
  {
    slug: 'kin',
    tags: ['Next.js', 'TypeScript', 'D3.js'],
    image: App2.src,
    link: 'https://www.kinanalytics.com/',
    featured: true,
  },
  {
    slug: 'arupo',
    tags: ['React', 'Python', 'PostgreSQL'],
    image: App3.src,
    link: 'https://www.arupo.io',
  },
  {
    slug: 'actuaria',
    tags: ['React', 'FastAPI', 'DynamoDB'],
    image: App4.src,
    link: 'https://actuaria.com',
  },
  {
    slug: 'provisions',
    tags: ['Next.js', 'NestJS', 'AWS'],
    image: App5.src,
    link: 'https://sistema-provisiones.actuaria.com.ec',
  },
];

function ProjectCard({ project }: { project: Project }) {
  const { handleTranslation } = useLanguage();
  const isFeatured = project.featured;
  const title = handleTranslation<string>(`projectSection.projects.${project.slug}.title`);
  const caption = handleTranslation<string>(`projectSection.projects.${project.slug}.caption`);

  return (
    <div
      className="project-card-outer"
      style={{
        position: 'relative',
        borderRadius: '20px',
        padding: '1px',
        background: cosmic.gradientBorder,
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          borderRadius: '19px',
          background: cosmic.bg1,
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Image area */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            aspectRatio: isFeatured ? '16 / 8.5' : '16 / 10',
          }}
        >
          <img
            className="project-image"
            src={project.image}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(8,12,26,0.7) 0%, transparent 50%)',
            }}
          />
          {isFeatured && (
            <div
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 4,
                paddingBottom: 4,
                borderRadius: '6px',
                background: `${cosmic.cyan}20`,
                border: `1px solid ${cosmic.cyan}40`,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.625rem',
                  color: cosmic.cyan,
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                }}
                suppressHydrationWarning
              >
                {handleTranslation('projectSection.featured')}
              </span>
            </div>
          )}
        </div>

        {/* Meta */}
        <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" style={{ marginBottom: 8 }}>
            <h3
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: isFeatured ? '1.25rem' : '1.0625rem',
                fontWeight: 600,
                color: cosmic.textPrimary,
                margin: 0,
              }}
              suppressHydrationWarning
            >
              {title}
            </h3>
            <IconButton
              className="project-link-btn"
              component="a"
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              style={{
                color: cosmic.textSecondary,
              }}
            >
              <IconExternalLink size={16} />
            </IconButton>
          </Stack>

          <p
            style={{
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              color: cosmic.textSecondary,
              marginBottom: 16,
              marginTop: 0,
              flex: 1,
            }}
            suppressHydrationWarning
          >
            {caption}
          </p>

          <Stack direction="row" spacing={0.75} style={{ flexWrap: 'wrap', gap: 4 }}>
            {project.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                className="project-tag-chip"
              />
            ))}
          </Stack>
        </div>
      </div>
    </div>
  );
}

const ProjectsSection = () => {
  const { handleTranslation } = useLanguage();
  const featured = projects.filter((p) => p.featured);
  const regular = projects.filter((p) => !p.featured);
  const gridRef = useGsapScrollTrigger<HTMLDivElement>({
    childSelector: '.project-card',
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
    stagger: 0.15,
  });

  return (
    <Container maxWidth="lg">
      <style>{`
        .project-card-outer:hover {
          transform: translateY(-4px);
        }
        .project-card-outer:hover .project-image {
          transform: scale(1.03);
        }
      `}</style>
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <SectionLabel number="04" label={handleTranslation('projectSection.sectionLabel')} />
        <h2 className="section-headline" style={{ marginBottom: 12 }}>
          <span className="reveal-on-scroll">
            <span>{handleTranslation('projectSection.title')}</span>
          </span>
        </h2>
        <p style={{ fontSize: '1rem', color: cosmic.textSecondary, margin: 0 }}>
          {handleTranslation('projectSection.description')}
        </p>
      </div>

      <Grid ref={gridRef} container spacing={3}>
        {/* Featured projects -- span 2 columns */}
        {featured.map((p) => (
          <Grid key={p.slug} item xs={12} md={6} className="project-card">
            <ProjectCard project={p} />
          </Grid>
        ))}
        {/* Regular projects */}
        {regular.map((p) => (
          <Grid key={p.slug} item xs={12} sm={6} md={4} className="project-card">
            <ProjectCard project={p} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProjectsSection;
