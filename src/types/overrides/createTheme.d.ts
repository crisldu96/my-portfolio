import type { CustomShadowProps } from '../default-theme';

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadowProps;
  }
  interface ThemeOptions {
    customShadows?: CustomShadowProps;
  }
}
