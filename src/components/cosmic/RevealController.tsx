'use client';

import { useMaskReveal } from '@/hooks/useMaskReveal';

export default function RevealController() {
  useMaskReveal('.reveal-on-scroll');
  return null;
}
