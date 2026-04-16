import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    return React.createElement('img', { src, alt, ...props })
  },
}))

vi.mock('framer-motion', () => {
  const createMotionComponent = (tag: string) => {
    return ({ children, ...props }: Record<string, unknown>) => {
      const filteredProps: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(props)) {
        if (
          !key.startsWith('while') &&
          !key.startsWith('animate') &&
          !key.startsWith('initial') &&
          !key.startsWith('exit') &&
          !key.startsWith('transition') &&
          !key.startsWith('variants') &&
          key !== 'drag' &&
          key !== 'dragConstraints' &&
          key !== 'layout' &&
          key !== 'layoutId'
        ) {
          filteredProps[key] = value
        }
      }
      return React.createElement(tag, filteredProps, children as React.ReactNode)
    }
  }

  return {
    motion: new Proxy({}, {
      get: (_target, prop: string) => createMotionComponent(prop),
    }),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useScroll: () => ({ scrollYProgress: { onChange: vi.fn() } }),
    useTransform: () => 0,
    useInView: () => true,
    useAnimation: () => ({
      start: vi.fn(),
      stop: vi.fn(),
      set: vi.fn(),
    }),
    useMotionValue: () => ({ get: () => 0, set: vi.fn(), onChange: vi.fn() }),
    useSpring: () => ({ get: () => 0, set: vi.fn() }),
    useReducedMotion: () => false,
  }
})

vi.mock('react-slick', () => ({
  default: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'slick-slider' }, children),
}))

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

const originalError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('act(')) return
    originalError.call(console, ...args)
  }
})
afterAll(() => {
  console.error = originalError
})
