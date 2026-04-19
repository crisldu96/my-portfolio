'use client';

import dynamic from 'next/dynamic';
import HeroOverlay from './HeroOverlay';

const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => (
    <div
      className="starfield"
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 40% 50%, #0A0F1E 0%, #000000 70%)',
      }}
    />
  ),
});

export default function HeroSection() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: 600,
        overflow: 'hidden',
      }}
    >
      <HeroScene />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <HeroOverlay />
    </div>
  );
}
