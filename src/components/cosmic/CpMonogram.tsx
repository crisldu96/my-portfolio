'use client';

import { cosmic } from '@/themes/cosmicTokens';

export default function CpMonogram() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        border: `1px solid ${cosmic.blue}`,
        background: `${cosmic.blue}1A`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      className="cp-monogram"
    >
      <span
        style={{
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          fontWeight: 700,
          fontSize: '0.875rem',
          color: cosmic.textPrimary,
          letterSpacing: '0.02em',
        }}
      >
        CP
      </span>
    </div>
  );
}
