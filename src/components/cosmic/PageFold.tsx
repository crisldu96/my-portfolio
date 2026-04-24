'use client';

import { useEffect, useState } from 'react';

export default function PageFold() {
  const [phase, setPhase] = useState<'idle' | 'enter' | 'exit'>('idle');

  useEffect(() => {
    const onStart = () => {
      setPhase('enter');
      window.setTimeout(() => setPhase('exit'), 420);
      window.setTimeout(() => setPhase('idle'), 920);
    };
    window.addEventListener('page-fold:start', onStart);
    return () => window.removeEventListener('page-fold:start', onStart);
  }, []);

  if (phase === 'idle') return null;

  return (
    <div className={`page-fold page-fold--${phase}`} aria-hidden="true">
      <div className="page-fold__panel" />
    </div>
  );
}
