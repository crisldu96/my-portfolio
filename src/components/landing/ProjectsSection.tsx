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
  title: string;
  caption: string;
  tags: string[];
  image: string;
  link: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: 'Data Collection Portal',
    caption: 'Enterprise data collection platform with role-based access and real-time analytics.',
    tags: ['React', 'Node.js', 'AWS'],
    image: App1.src,
    link: 'https://portal.actuaria.com/authentication/login',
    featured: true,
  },
  {
    title: 'Kin Analytics',
    caption: 'Business intelligence web platform for actuarial data visualization and reporting.',
    tags: ['Next.js', 'TypeScript', 'D3.js'],
    image: App2.src,
    link: 'https://www.kinanalytics.com/',
    featured: true,
  },
  {
    title: 'Arupo — Legaltech',
    caption: 'Legal process automation app streamlining document workflows for law firms.',
    tags: ['React', 'Python', 'PostgreSQL'],
    image: App3.src,
    link: 'https://www.arupo.io',
  },
  {
    title: 'Actuarial Platform',
    caption: 'Full-featured actuarial calculation and reporting platform for insurance companies.',
    tags: ['React', 'FastAPI', 'DynamoDB'],
    image: App4.src,
    link: 'https://actuaria.com',
  },
  {
    title: 'Data Management App',
    caption: 'Provisions and financial data management system with audit trails and exports.',
    tags: ['Next.js', 'NestJS', 'AWS'],
    image: App5.src,
    link: 'https://sistema-provisiones.actuaria.com.ec',
  },
];

function ProjectCard({ project }: { project: Project }) {
  const isFeatured = project.featured;

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
            alt={project.title}
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
              >
                FEATURED
              </span>
            </div>
          )}
        </div>

        {/* Meta */}
        <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <h3
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: isFeatured ? '1.25rem' : '1.0625rem',
                fontWeight: 600,
                color: cosmic.textPrimary,
                margin: 0,
              }}
            >
              {project.title}
            </h3>
            <IconButton
              component="a"
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                color: cosmic.textSecondary,
                '&:hover': { color: cosmic.cyan },
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
          >
            {project.caption}
          </p>

          <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
            {project.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.6875rem',
                  height: 24,
                  background: 'rgba(22, 32, 64, 0.6)',
                  border: `1px solid ${cosmic.line}`,
                  color: cosmic.textSecondary,
                }}
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
        <SectionLabel number="04" label="Projects" />
        <h2
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontSize: '2.75rem',
            fontWeight: 700,
            color: cosmic.textPrimary,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: 12,
            marginTop: 0,
          }}
        >
          {handleTranslation('projectSection.title')}
        </h2>
        <p style={{ fontSize: '1rem', color: cosmic.textSecondary, margin: 0 }}>
          {handleTranslation('projectSection.description')}
        </p>
      </div>

      <Grid ref={gridRef} container spacing={3}>
        {/* Featured projects -- span 2 columns */}
        {featured.map((p) => (
          <Grid key={p.title} item xs={12} md={6} className="project-card">
            <ProjectCard project={p} />
          </Grid>
        ))}
        {/* Regular projects */}
        {regular.map((p) => (
          <Grid key={p.title} item xs={12} sm={6} md={4} className="project-card">
            <ProjectCard project={p} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProjectsSection;
