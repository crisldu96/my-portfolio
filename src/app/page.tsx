'use client';
import * as React from 'react';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import HeaderWrapper from './layout/HeaderWrapper';
import HeroSection from '@/components/cosmic/hero/HeroSection';
import SectionWrapper from './layout/SectionWrapper';
import SectionDivider from '@/components/cosmic/SectionDivider';
import ScrollProgress from '@/components/cosmic/ScrollProgress';
import MusicPlayer from '@/components/cosmic/MusicPlayer';
import GsapProvider from '@/components/cosmic/GsapProvider';
import ExperienceSection from '@/components/landing/ExperienceSection';
import SkillsSection from '@/components/landing/SkillsSection';
import ProjectsSection from '@/components/landing/ProjectsSection';
import AboutMeSection from '@/components/landing/AboutMeSection';
import dynamic from 'next/dynamic';

const AboutBackground3D = dynamic(() => import('@/components/cosmic/AboutBackground3D'), { ssr: false });
import ContactSection from '@/components/landing/ContactSection';
import { cosmic } from '@/themes/cosmicTokens';

export default function Home() {
  return (
    <GsapProvider>
      <ScrollProgress />
      <MusicPlayer />

      {/* Hero Section */}
      <HeaderWrapper>
        <HeroSection />
      </HeaderWrapper>

      <SectionDivider fromColor={cosmic.bg0} toColor={cosmic.bg1} height={24} />

      {/* About Section */}
      <SectionWrapper id="about" sx={{ bgcolor: cosmic.bg1, position: 'relative', overflow: 'hidden' }}>
        <div className="cosmic-ambient" data-accent="cyan" />
        <AboutBackground3D />
        <div className="dotgrid" />
        <div className="section-content"><AboutMeSection /></div>
      </SectionWrapper>

      <SectionDivider fromColor={cosmic.bg1} toColor={cosmic.bg0} height={24} />

      {/* Experience Section */}
      <SectionWrapper id="experience" sx={{ bgcolor: cosmic.bg0, position: 'relative', overflow: 'hidden' }}>
        <div className="cosmic-ambient" data-accent="violet" />
        <div className="starfield" />
        <div className="section-content"><ExperienceSection /></div>
      </SectionWrapper>

      <SectionDivider fromColor={cosmic.bg0} toColor={cosmic.bg1} height={24} />

      {/* Skills Section */}
      <SectionWrapper id="skills" sx={{ bgcolor: cosmic.bg1, position: 'relative', overflow: 'hidden' }}>
        <div className="cosmic-ambient" data-accent="blue" />
        <div className="dotgrid" />
        <div className="section-content"><SkillsSection /></div>
      </SectionWrapper>

      <SectionDivider fromColor={cosmic.bg1} toColor={cosmic.bg0} height={24} />

      {/* Projects Section */}
      <SectionWrapper id="projects" sx={{ bgcolor: cosmic.bg0, position: 'relative', overflow: 'hidden' }}>
        <div className="cosmic-ambient" data-accent="rose" />
        <div className="starfield" />
        <div className="section-content"><ProjectsSection /></div>
      </SectionWrapper>

      <SectionDivider fromColor={cosmic.bg0} toColor={cosmic.bg1} height={24} />

      {/* Contact Section */}
      <SectionWrapper id="contact" sx={{ bgcolor: cosmic.bg1, position: 'relative', overflow: 'hidden' }}>
        <div className="cosmic-ambient" data-accent="amber" />
        <div className="dotgrid" />
        <div className="section-content"><ContactSection /></div>
      </SectionWrapper>
    </GsapProvider>
  );
}
