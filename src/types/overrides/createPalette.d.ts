import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteColor {
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
  }

  interface SimplePaletteColorOptions {
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
  }

  interface TypeText {
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

  interface Palette {
    orange: PaletteColor;
    dark: PaletteColor;
    cosmic: CosmicPalette;
  }

  interface PaletteOptions {
    orange?: PaletteColorOptions;
    dark?: PaletteColorOptions;
    cosmic?: CosmicPalette;
  }
}
