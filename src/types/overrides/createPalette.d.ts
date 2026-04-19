// eslint-disable-next-line
import * as createPalette from '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  interface PaletteColor {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }

  export interface TypeText {
    dark: string;
    hint: string;
  }

  interface CosmicPalette {
    cyan: string;
    violet: string;
    blue: string;
    line: string;
    lineStrong: string;
    bg0: string;
    bg1: string;
    bg2: string;
  }

  interface PaletteOptions {
    orange?: PaletteColorOptions;
    dark?: PaletteColorOptions;
    icon?: IconPaletteColorOptions;
    cosmic?: CosmicPalette;
  }
  interface Palette {
    orange: PaletteColor;
    dark: PaletteColor;
    icon: IconPaletteColor;
    cosmic: CosmicPalette;
  }
}
