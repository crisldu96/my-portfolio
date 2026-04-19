'use client';

import { useEffect, useRef, useState } from 'react';

const LERP = 0.18;
const RING_LERP = 0.12;

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarse || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (hidden) setHidden(false);
    };
    const onDown = () => setActive(true);
    const onUp = () => setActive(false);
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    const tick = () => {
      dotPos.current.x += (target.current.x - dotPos.current.x) * LERP;
      dotPos.current.y += (target.current.y - dotPos.current.y) * LERP;
      ringPos.current.x += (target.current.x - ringPos.current.x) * RING_LERP;
      ringPos.current.y += (target.current.y - ringPos.current.y) * RING_LERP;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, hidden]);

  useEffect(() => {
    if (!enabled) return;
    const interactiveSelector = 'a, button, input, textarea, select, label, [role="button"], [data-cursor="hover"]';
    const over = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest(interactiveSelector)) setActive(true);
    };
    const out = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest(interactiveSelector)) setActive(false);
    };
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    return () => {
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        className={`cursor-ring${active ? ' cursor-ring--active' : ''}${hidden ? ' cursor-ring--hidden' : ''}`}
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className={`cursor-dot${active ? ' cursor-dot--active' : ''}${hidden ? ' cursor-dot--hidden' : ''}`}
        aria-hidden="true"
      />
    </>
  );
}
