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
      {/* Top: minimal status pill (left) + availability (right) */}
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

      {/* Center: intentionally empty so the 3D canvas breathes */}
      <div className="hero-content" style={{ pointerEvents: 'auto' }}>
        <div className="hero-text">
          <motion.span
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.25)}
            className="hero-greeting"
          >
            {handleTranslation<string>('heroSection.greeting') || "Hello, I'm"}
          </motion.span>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.4)}
            className="hero-name"
          >
            <span className="hero-name__first">
              {handleTranslation<string>('heroSection.name') || 'Cristopher'}
            </span>
            <span className="hero-name__last">
              {handleTranslation<string>('heroSection.surname') || 'Palacios'}
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.55)}
            className="hero-description"
          >
            {handleTranslation<string>('heroSection.description') ||
              'I build scalable web experiences and intelligent solutions.'}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.7)}
            style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginTop: 12 }}
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

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ pointerEvents: 'auto' }}
        >
          <HeroCoin />
        </motion.div>
      </div>

      {/* Bottom: scroll indicator */}
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
