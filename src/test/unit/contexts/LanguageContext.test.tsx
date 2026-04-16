import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ReactNode } from 'react'
import { ConfigProvider } from '@/contexts/ConfigContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import useConfig from '@/hooks/useConfig'
import useLanguage from '@/hooks/useLanguage'

function makeWrapper(locale?: string) {
  return ({ children }: { children: ReactNode }) => {
    if (locale) {
      vi.mocked(window.localStorage.getItem).mockReturnValue(
        JSON.stringify({
          layout: 'vertical',
          drawerType: 'default',
          fontFamily: 'Roboto',
          borderRadius: 8,
          outlinedFilled: true,
          navType: 'dark',
          presetColor: 'default',
          locale,
          rtlLayout: false,
        })
      )
    }
    return (
      <ConfigProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </ConfigProvider>
    )
  }
}

describe('LanguageContext', () => {
  beforeEach(() => {
    vi.mocked(window.localStorage.getItem).mockReturnValue(null)
  })

  it('returns English text by default for a known key', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: makeWrapper() })
    expect(result.current.handleTranslation('appBar.item1')).toBe('Home')
  })

  it('returns English text for appBar navigation labels', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: makeWrapper() })
    expect(result.current.handleTranslation('appBar.item2')).toBe('About Me')
    expect(result.current.handleTranslation('appBar.item6')).toBe('Contact Me')
  })

  it('returns Spanish text when locale is "es"', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: makeWrapper('es') })
    expect(result.current.handleTranslation('appBar.item1')).toBe('Inicio')
    expect(result.current.handleTranslation('appBar.item6')).toBe('Contactame')
  })

  it('returns Spanish section titles when locale is "es"', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: makeWrapper('es') })
    expect(result.current.handleTranslation('contactSection.title')).toBe('Contáctame en:')
  })

  it('returns undefined for a missing key (lodash _.get behavior)', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: makeWrapper() })
    expect(result.current.handleTranslation('nonexistent.key')).toBeUndefined()
  })

  it('returns nested array values correctly', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: makeWrapper() })
    const items = result.current.handleTranslation<{ src: string; label: string }[]>('skillsSection.items')
    expect(Array.isArray(items)).toBe(true)
    expect(items[0].label).toBe('React')
  })

  it('locale change updates translations reactively', () => {
    const CombinedHook = () => ({
      config: useConfig(),
      language: useLanguage(),
    })

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ConfigProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </ConfigProvider>
    )

    const { result } = renderHook(() => CombinedHook(), { wrapper })

    expect(result.current.language.handleTranslation('appBar.item1')).toBe('Home')

    act(() => {
      result.current.config.onChangeLocale('es')
    })

    expect(result.current.language.handleTranslation('appBar.item1')).toBe('Inicio')
  })
})
