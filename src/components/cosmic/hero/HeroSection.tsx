'use client';

import HeroOverlay from './HeroOverlay';

export default function HeroSection() {
  return (
    <div
      data-testid="hero-section"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: 600,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 70% 50%, #122046 0%, #060912 75%)',
      }}
    >
      <div className="hero-stars" aria-hidden />
      <HeroOverlay />
    </div>
  );
}
