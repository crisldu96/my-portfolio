'use client';

import Link from '@mui/material/Link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import PillButton from '../PillButton';
import { cosmic } from '@/themes/cosmicTokens';
import useLanguage from '@/hooks/useLanguage';

const HeroCoin = dynamic(() => import('./HeroCoin'), { ssr: false });

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
});

export default function HeroOverlay() {
  const { handleTranslation } = useLanguage();

  return (
    <div className="hero-overlay">
      <div className="hero-overlay-top">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp(0.1)}
          className="hero-role-pill"
        >
          <span className="hero-role-dot" />
          <span className="hero-role-text">
            {handleTranslation<string>('heroSection.role') || 'Full Stack & AI Developer'}
          </span>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp(0.15)}
          className="hero-avail-badge"
        >
          <div className="hero-avail-dot" />
          <span className="hero-avail-text" suppressHydrationWarning>
            {handleTranslation<string>('heroSection.available') || 'AVAILABLE FOR WORK'}
          </span>
        </motion.div>
      </div>

      <div className="hero-content" style={{ pointerEvents: 'auto' }}>
        <div className="hero-text">
          <motion.span
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.25)}
            className="hero-eyebrow"
          >
            {handleTranslation<string>('heroSection.eyebrow') || 'Cristopher Palacios'}
          </motion.span>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.4)}
            className="hero-headline"
            aria-label="Cristopher Palacios — Full Stack & AI Developer"
          >
            <span className="hero-headline__lead">
              {handleTranslation<string>('heroSection.headlinePart1') || 'I build'}
            </span>{' '}
            <span className="hero-headline__accent">
              {handleTranslation<string>('heroSection.headlineAccent') || 'fast, scalable web apps'}
            </span>
            <span className="hero-headline__tail">
              {handleTranslation<string>('heroSection.headlinePart2') || ', and AI-powered products.'}
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.55)}
            className="hero-description"
          >
            {handleTranslation<string>('heroSection.description') ||
              'I work with teams and startups around the world, turning ideas into digital products that scale.'}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.62)}
            className="hero-chips"
          >
            <span className="hero-chip hero-chip--accent">
              {handleTranslation<string>('heroSection.chipYears') || '5+ years'}
            </span>
            <span className="hero-chip hero-chip--accent">
              {handleTranslation<string>('heroSection.chipProjects') || '10+ projects'}
            </span>
            <span className="hero-chip">React</span>
            <span className="hero-chip">Next.js</span>
            <span className="hero-chip">Node</span>
            <span className="hero-chip">
              {handleTranslation<string>('heroSection.chipTechAi') || 'AI / LLMs'}
            </span>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.7)}
            style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginTop: 16 }}
          >
            <PillButton
              variant="contained"
              component={Link}
              href="/#contact"
              size="small"
              sx={{
                fontSize: '0.8125rem',
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 700,
                py: 1.25,
                px: 3.5,
              }}
            >
              {handleTranslation<string>('heroSection.letsTalk') || "LET'S TALK"}
            </PillButton>
            <PillButton
              variant="outlined"
              component={Link}
              href="/#projects"
              size="small"
              sx={{
                fontSize: '0.8125rem',
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 500,
                py: 1.25,
                px: 3.5,
              }}
            >
              {handleTranslation<string>('heroSection.viewProjects') || 'View projects'}
            </PillButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ pointerEvents: 'auto', position: 'relative' }}
        >
          <div className="hero-glow-halo" aria-hidden />
          <HeroCoin />
          <span className="hero-coin-hint" aria-hidden>
            {handleTranslation<string>('heroSection.coinHint') || 'Click or drag to spin'}
          </span>
        </motion.div>
      </div>

      <div
        className="hero-bottom"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          pointerEvents: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 1,
              height: 40,
              background: `linear-gradient(to bottom, ${cosmic.cyan}, transparent)`,
              opacity: 0.5,
            }}
          />
          <span className="hero-scroll-text">
            {handleTranslation<string>('heroSection.scrollDown') || 'SCROLL TO EXPLORE'}
          </span>
        </div>
      </div>
    </div>
  );
}
