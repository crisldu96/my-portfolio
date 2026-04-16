import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ReactNode } from 'react'
import { ConfigProvider } from '@/contexts/ConfigContext'
import useConfig from '@/hooks/useConfig'

const wrapper = ({ children }: { children: ReactNode }) => (
  <ConfigProvider>{children}</ConfigProvider>
)

describe('ConfigContext', () => {
  beforeEach(() => {
    vi.mocked(window.localStorage.getItem).mockReturnValue(null)
  })

  it('provides default locale as "en"', () => {
    const { result } = renderHook(() => useConfig(), { wrapper })
    expect(result.current.locale).toBe('en')
  })

  it('provides default navType as "dark"', () => {
    const { result } = renderHook(() => useConfig(), { wrapper })
    expect(result.current.navType).toBe('dark')
  })

  it('provides default borderRadius as 8', () => {
    const { result } = renderHook(() => useConfig(), { wrapper })
    expect(result.current.borderRadius).toBe(8)
  })

  it('onChangeMenuType switches navType between dark and light', () => {
    const { result } = renderHook(() => useConfig(), { wrapper })

    act(() => {
      result.current.onChangeMenuType('light')
    })

    expect(result.current.navType).toBe('light')

    act(() => {
      result.current.onChangeMenuType('dark')
    })

    expect(result.current.navType).toBe('dark')
  })

  it('onChangeLocale updates locale value', () => {
    const { result } = renderHook(() => useConfig(), { wrapper })

    act(() => {
      result.current.onChangeLocale('es')
    })

    expect(result.current.locale).toBe('es')
  })

  it('persists config to localStorage under key "jp-config-ts" on change', () => {
    const { result } = renderHook(() => useConfig(), { wrapper })

    act(() => {
      result.current.onChangeLocale('es')
    })

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'jp-config-ts',
      expect.stringContaining('"locale":"es"')
    )
  })

  it('onChangeContainer toggles the container boolean', () => {
    const { result } = renderHook(() => useConfig(), { wrapper })
    const initial = result.current.container

    act(() => {
      result.current.onChangeContainer()
    })

    expect(result.current.container).toBe(!initial)
  })

  it('reads stored config from localStorage on mount', () => {
    vi.mocked(window.localStorage.getItem).mockReturnValue(
      JSON.stringify({
        layout: 'vertical',
        drawerType: 'default',
        fontFamily: 'Roboto',
        borderRadius: 4,
        outlinedFilled: true,
        navType: 'light',
        presetColor: 'default',
        locale: 'es',
        rtlLayout: false,
      })
    )

    const { result } = renderHook(() => useConfig(), { wrapper })
    expect(result.current.locale).toBe('es')
    expect(result.current.navType).toBe('light')
  })
})
