# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # ESLint via Next.js
npm run start    # Start production server
```

## Architecture

Single-page portfolio built with **Next.js App Router**, **MUI v6**, and **TypeScript**. No backend — all content is static JSON.

### Provider stack (layout.tsx)
```
AppRouterCacheProvider (MUI/Emotion SSR)
  └─ ConfigProvider      → theme settings persisted in localStorage ('jp-config-ts')
       └─ LanguageProvider → i18n via lodash _.get() on JSON dictionaries
            └─ ThemeCustomization → MUI theme built from config
```

### Content / i18n
All visible text lives in `src/data/text-content-en.json` and `text-content-es.json`. Locale is driven by `ConfigContext.locale` (`'en'` | `'es'`). To translate a key use the `useLanguage()` hook:
```ts
const { handleTraslation } = useLanguage();
const text = handleTraslation('headerSection.title');
```

### Theme
- `src/themes/palette.tsx` — generates MUI palette from `navType` (`'light'`|`'dark'`) and `presetColor`
- `src/themes/compStyleOverride.tsx` — global MUI component overrides
- `src/config.ts` — default values (`navType: 'dark'`, `presetColor: 'theme7'`, font: `Poppins`)
- SCSS theme files in `src/assets/scss/` are supplementary; MUI sx/styled is preferred

### Page sections (src/app/page.tsx)
Each section is a component in `src/components/landing/` wrapped by `SectionWrapper` (adds padding + bg color) or `HeaderWrapper` (adds AppBar). Sections in order: Header → About → Experience → Skills → Projects → Contact.

### Routing
Only two routes: `/` (home, single-page) and `/about`. The app is effectively a single-page site with anchor-based navigation (`id` props on `SectionWrapper`).

### Key hooks
- `useConfig()` — access/mutate theme config from `ConfigContext`
- `useLanguage()` — access `handleTraslation` from `LanguageContext`
