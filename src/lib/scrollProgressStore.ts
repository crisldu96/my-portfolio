export const PROCESS_STEP_COUNT = 5;

type Listener = () => void;

let progress = 0;
const listeners = new Set<Listener>();

export const scrollProgressStore = {
  set(value: number) {
    progress = value;
    listeners.forEach((fn) => fn());
  },
  get() {
    return progress;
  },
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};

export function progressToActiveStep(p: number, steps = PROCESS_STEP_COUNT): number {
  if (Number.isNaN(p)) return 0;
  const clamped = Math.min(Math.max(p, 0), 1);
  return Math.min(steps - 1, Math.floor(clamped * steps));
}

export const PROCESS_DESKTOP_QUERY =
  '(min-width: 768px) and (prefers-reduced-motion: no-preference) and (pointer: fine)';

export const PROCESS_FALLBACK_QUERY =
  '(max-width: 767px), (prefers-reduced-motion: reduce), (pointer: coarse)';
