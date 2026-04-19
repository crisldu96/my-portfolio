'use client';

import Link from '@mui/material/Link';
import { motion } from 'framer-motion';
import PillButton from '../PillButton';
import { cosmic } from '@/themes/cosmicTokens';
import useLanguage from '@/hooks/useLanguage';

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
});

const fadeScale = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.6, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function HeroOverlay() {
  const { handleTranslation } = useLanguage();

  return (
    <div className="hero-overlay">
      {/* Top spacer */}
      <div className="hero-overlay-top" />

      {/* Center: Split layout - Text left, Photo right */}
      <div className="hero-content" style={{ pointerEvents: 'auto' }}>
        {/* Left: Personal intro */}
        <div className="hero-text">
          <motion.span
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.2)}
            className="hero-greeting"
          >
            {handleTranslation<string>('heroSection.greeting') || "Hello, I'm"}
          </motion.span>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.35)}
            className="hero-name"
          >
            <span className="hero-name__first">
              {handleTranslation<string>('heroSection.name') || 'Cristopher'}
            </span>
            <span className="hero-name__last">
              {handleTranslation<string>('heroSection.surname') || 'Palacios'}
            </span>
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.5)}
            className="hero-role-pill"
          >
            <span className="hero-role-dot" />
            <span className="hero-role-text">
              {handleTranslation<string>('heroSection.role') || 'Full Stack & AI Developer'}
            </span>
          </motion.div>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.65)}
            className="hero-description"
          >
            {handleTranslation<string>('heroSection.description') ||
              'I build scalable web experiences and intelligent solutions.'}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.8)}
            style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}
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
                fontWeight: 600,
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
              {handleTranslation<string>('appBar.item5') || 'My Projects'}
            </PillButton>
          </motion.div>
        </div>

        {/* Right: Photo */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeScale}
          className="hero-photo-wrapper"
        >
          <div className="hero-photo-glow" />
          <img
            src="/assets/images/header-1.png"
            alt="Cristopher Palacios"
            width={380}
            height={380}
            className="hero-photo"
          />
          <div className="hero-photo-ring" />
        </motion.div>
      </div>

      {/* Bottom row */}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="hero-avail-dot" />
          <span
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.6875rem',
              color: cosmic.textSecondary,
              letterSpacing: '0.08em',
            }}
          >
            AVAILABLE FOR WORK
          </span>
        </div>
      </div>
    </div>
  );
}
