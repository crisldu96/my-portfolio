'use client';

import { useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  scrollProgressStore,
  progressToActiveStep,
  PROCESS_STEP_COUNT,
} from '@/lib/scrollProgressStore';
import { getLenis } from '@/lib/lenisInstance';

// Ensure plugins are registered before the hook runs, regardless of provider effect order.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

interface Options {
  rootRef: RefObject<HTMLDivElement | null>;
  pinRef: RefObject<HTMLDivElement | null>;
  stepCount?: number;
  panelSelector?: string;
  onStepChange: (step: number) => void;
}

export function useProcessScrollytelling({
  rootRef,
  pinRef,
  stepCount = PROCESS_STEP_COUNT,
  panelSelector = '.process-step',
  onStepChange,
}: Options) {
  const stRef = useRef<ScrollTrigger | null>(null);
  const lastStep = useRef<number>(-1);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        '(min-width: 768px) and (prefers-reduced-motion: no-preference) and (pointer: fine)',
        () => {
          const panels = gsap.utils.toArray<HTMLElement>(panelSelector, rootRef.current!);
          if (!panels.length) return;

          gsap.set(panels, { opacity: 0, yPercent: 8 });
          gsap.set(panels[0], { opacity: 1, yPercent: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinRef.current!,
              start: 'top top',
              end: () => '+=' + Math.round(stepCount * 0.9 * window.innerHeight),
              pin: true,
              pinSpacing: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                scrollProgressStore.set(self.progress);
                const step = progressToActiveStep(self.progress, stepCount);
                if (step !== lastStep.current) {
                  lastStep.current = step;
                  onStepChange(step);
                }
              },
            },
          });

          panels.forEach((panel, i) => {
            if (i === 0) return;
            tl.to(panels[i - 1], { opacity: 0, yPercent: -8, duration: 0.5 }, i)
              .to(panel, { opacity: 1, yPercent: 0, duration: 0.5 }, i);
          });

          stRef.current = tl.scrollTrigger ?? null;
          onStepChange(0);
        }
      );

      mm.add('(max-width: 767px), (prefers-reduced-motion: reduce), (pointer: coarse)', () => {
        // Static baseline: scene at a representative frame; no pin/scrub.
        scrollProgressStore.set(1);
        stRef.current = null;
        onStepChange(0);
      });
    },
    { scope: rootRef }
  );

  const scrollToStep = (i: number) => {
    const st = stRef.current;
    const lenis = getLenis();
    if (st) {
      const target = st.start + (st.end - st.start) * ((i + 0.5) / stepCount);
      if (lenis) lenis.scrollTo(target, { duration: 1 });
      else window.scrollTo({ top: target, behavior: 'smooth' });
      return;
    }
    // Fallback (mobile/reduced): scroll the step article into view.
    const el = document.getElementById(`proceso-step-${i}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return { scrollToStep };
}
