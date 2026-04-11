'use client';
import * as React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// project imports
import HeaderWrapper from './layout/HeaderWrapper';
import HeaderSection from '@/components/landing/HeaderSection';
import SectionWrapper from './layout/SectionWrapper';
import ExperienceSection from '@/components/landing/ExperienceSection';
import SkillsSection from '@/components/landing/SkillsSection';
import ProjectsSection from '@/components/landing/ProjectsSection';
import AboutMeSection from '@/components/landing/AboutMeSection';
import ContactSection from '@/components/landing/ContactSection';


export default function Home() {
  const theme = useTheme();

  return (
    <>
      {/* Home Section */}
      <HeaderWrapper>
        <HeaderSection />
      </HeaderWrapper>

      {/* Developer about Section */}
      <SectionWrapper id="about" sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.dark' : 'background.default' }}>
        <AboutMeSection />
      </SectionWrapper>

      {/* Developer Experience Section */}
      <SectionWrapper id="experience" sx={{ bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.100' }}>
        <ExperienceSection />
      </SectionWrapper>

      {/* Skills Section */}
      <SectionWrapper id="skills" sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.dark' : 'background.default' }}>
        <SkillsSection />
      </SectionWrapper>

      {/* Projects Section */}
      <SectionWrapper id="projects" sx={{ bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.100' }}>
        <ProjectsSection />
      </SectionWrapper>

      {/* Contact Section */}
      <SectionWrapper id="contact" sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.dark' : 'background.default' }}>
        <ContactSection />
      </SectionWrapper>
    </>
  );
}
