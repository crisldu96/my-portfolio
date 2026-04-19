'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollTriggerConfig {
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  trigger?: gsap.DOMTarget;
  start?: string;
  end?: string;
  stagger?: number;
  childSelector?: string;
}

export function useGsapScrollTrigger<T extends HTMLElement>({
  from = { opacity: 0, y: 60 },
  to = { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
  start = 'top 85%',
  stagger = 0,
  childSelector,
}: ScrollTriggerConfig = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const targets = childSelector
      ? ref.current.querySelectorAll(childSelector)
      : ref.current;

    const tween = gsap.fromTo(targets, from, {
      ...to,
      stagger: stagger || undefined,
      scrollTrigger: {
        trigger: ref.current,
        start,
        once: true,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === ref.current)
        .forEach((t) => t.kill());
    };
  }, []);

  return ref;
}
