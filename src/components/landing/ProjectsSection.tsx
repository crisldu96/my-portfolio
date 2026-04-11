'use client';

import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Grid, IconButton, Link, Typography, Stack, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { IconChevronRight, IconChevronLeft, IconExternalLink } from '@tabler/icons-react';
import useLanguage from '@/hooks/useLanguage';

import App1 from '../../assets/images/landing/projects/app-1-portal.png';
import App2 from '../../assets/images/landing/projects/app-2-kin.png';
import App3 from '../../assets/images/landing/projects/app-3-arupo.png';
import App4 from '../../assets/images/landing/projects/app-4-af.png';
import App5 from '../../assets/images/landing/projects/app-5-provisiones.png';

const projects = [
  {
    title: 'Data Collection Portal',
    caption: 'Enterprise data collection platform with role-based access and real-time analytics.',
    tags: ['React', 'Node.js', 'AWS'],
    image: App1.src,
    link: 'https://portal.actuaria.com/authentication/login',
  },
  {
    title: 'Kin Analytics',
    caption: 'Business intelligence web platform for actuarial data visualization and reporting.',
    tags: ['Next.js', 'TypeScript', 'D3.js'],
    image: App2.src,
    link: 'https://www.kinanalytics.com/',
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

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
};

const ProjectsSection = () => {
  const theme = useTheme();
  const { handleTranslation } = useLanguage();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + projects.length) % projects.length);
  };

  const project = projects[index];

  return (
    <Grid container spacing={5} justifyContent="center">
      {/* Header */}
      <Grid item xs={12} md={7} sx={{ textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' }, mb: 1 }}>
          {handleTranslation('projectSection.title')}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 400, color: 'text.secondary' }} align="center">
          {handleTranslation('projectSection.description')}
        </Typography>
      </Grid>

      {/* Carousel */}
      <Grid item xs={12}>
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 3,
                  overflow: 'hidden',
                  height: { xs: 320, sm: 420, md: 520 },
                  maxWidth: 900,
                  mx: 'auto',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(129,140,248,0.15)'
                    : '0 25px 60px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  '&:hover img': { transform: 'scale(1.03)' },
                }}
              >
                {/* Image */}
                <Box
                  component="img"
                  src={project.image}
                  alt={project.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease',
                    display: 'block',
                  }}
                />

                {/* Gradient overlay for text contrast */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(8,12,26,0.97) 0%, rgba(8,12,26,0.6) 45%, transparent 100%)',
                  }}
                />

                {/* Content overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: { xs: 2.5, md: 4 },
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {project.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(129,140,248,0.2)',
                            color: '#A5B4FC',
                            border: '1px solid rgba(129,140,248,0.3)',
                            fontSize: '0.7rem',
                            height: 22,
                            backdropFilter: 'blur(8px)',
                          }}
                        />
                      ))}
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography
                        variant="h3"
                        sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: '1.25rem', md: '1.75rem' } }}
                      >
                        {project.title}
                      </Typography>
                      <IconButton
                        component={Link}
                        href={project.link}
                        target="_blank"
                        size="small"
                        sx={{ color: '#A5B4FC', '&:hover': { color: '#fff' } }}
                      >
                        <IconExternalLink size={18} />
                      </IconButton>
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(255,255,255,0.75)', maxWidth: 520, lineHeight: 1.6 }}
                    >
                      {project.caption}
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </motion.div>
          </AnimatePresence>

          {/* Arrow buttons */}
          <IconButton
            onClick={() => paginate(-1)}
            sx={{
              position: 'absolute',
              left: { xs: 8, md: 'calc(50% - 480px)' },
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(13,18,41,0.85)' : 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(129,140,248,0.25)' : 'rgba(0,0,0,0.1)',
              color: theme.palette.mode === 'dark' ? '#A5B4FC' : 'inherit',
              zIndex: 10,
              width: 44, height: 44,
              '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(79,70,229,0.3)' : 'rgba(0,0,0,0.1)' },
            }}
          >
            <IconChevronLeft size={20} />
          </IconButton>
          <IconButton
            onClick={() => paginate(1)}
            sx={{
              position: 'absolute',
              right: { xs: 8, md: 'calc(50% - 480px)' },
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(13,18,41,0.85)' : 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(129,140,248,0.25)' : 'rgba(0,0,0,0.1)',
              color: theme.palette.mode === 'dark' ? '#A5B4FC' : 'inherit',
              zIndex: 10,
              width: 44, height: 44,
              '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(79,70,229,0.3)' : 'rgba(0,0,0,0.1)' },
            }}
          >
            <IconChevronRight size={20} />
          </IconButton>
        </Box>

        {/* Dot indicators */}
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 3 }}>
          {projects.map((_, i) => (
            <Box
              key={i}
              onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
              sx={{
                width: i === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                bgcolor: i === index
                  ? (theme.palette.mode === 'dark' ? '#818CF8' : '#4F46E5')
                  : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'),
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ProjectsSection;
