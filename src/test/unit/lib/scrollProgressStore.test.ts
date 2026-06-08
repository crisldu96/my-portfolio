import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  scrollProgressStore,
  progressToActiveStep,
  PROCESS_STEP_COUNT,
} from '@/lib/scrollProgressStore';

describe('scrollProgressStore', () => {
  const cleanups: Array<() => void> = [];
  afterEach(() => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  });

  beforeEach(() => {
    scrollProgressStore.set(0);
  });

  it('almacena y devuelve el progreso', () => {
    scrollProgressStore.set(0.42);
    expect(scrollProgressStore.get()).toBe(0.42);
  });

  it('notifica a los suscriptores en cada set', () => {
    let calls = 0;
    const unsubscribe = scrollProgressStore.subscribe(() => {
      calls += 1;
    });
    cleanups.push(unsubscribe);
    scrollProgressStore.set(0.1);
    scrollProgressStore.set(0.2);
    expect(calls).toBe(2);
    unsubscribe();
  });

  it('deja de notificar tras desuscribirse', () => {
    let calls = 0;
    const unsubscribe = scrollProgressStore.subscribe(() => {
      calls += 1;
    });
    cleanups.push(unsubscribe);
    unsubscribe();
    scrollProgressStore.set(0.5);
    expect(calls).toBe(0);
  });
});

describe('progressToActiveStep', () => {
  it('mapea el inicio al paso 0', () => {
    expect(progressToActiveStep(0)).toBe(0);
  });

  it('mapea el final al último paso', () => {
    expect(progressToActiveStep(1)).toBe(PROCESS_STEP_COUNT - 1);
  });

  it('mapea el centro al paso central', () => {
    expect(progressToActiveStep(0.5)).toBe(2);
  });

  it('clampa valores fuera de rango', () => {
    expect(progressToActiveStep(-0.3)).toBe(0);
    expect(progressToActiveStep(1.7)).toBe(PROCESS_STEP_COUNT - 1);
  });

  it('devuelve 0 ante NaN', () => {
    expect(progressToActiveStep(Number.NaN)).toBe(0);
  });

  it('clampa Infinity al último paso', () => {
    expect(progressToActiveStep(Infinity)).toBe(PROCESS_STEP_COUNT - 1);
  });
});
