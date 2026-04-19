// material-ui
import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// types
import { ColorProps } from '../types';
import { defaultColor, theme1, theme2, theme3, theme4, theme5, theme6 } from './colorTokens';

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (navType: PaletteMode, presetColor: string) => {
  let colors: ColorProps;
  switch (presetColor) {
    case 'theme1':
      colors = theme1;
      break;
    case 'theme2':
      colors = theme2;
      break;
    case 'theme3':
      colors = theme3;
      break;
    case 'theme4':
      colors = theme4;
      break;
    case 'theme5':
      colors = theme5;
      break;
    case 'theme6':
      colors = theme6;
      break;
    case 'default':
    default:
      colors = defaultColor;
  }

  const c = colors ?? {};

  const primaryLight = navType === 'dark' ? (c.darkPrimaryLight ?? '#e3f2fd') : (c.primaryLight ?? '#e3f2fd');
  const primaryMain = navType === 'dark' ? (c.darkPrimaryMain ?? '#2196f3') : (c.primaryMain ?? '#2196f3');
  const primaryDark = navType === 'dark' ? (c.darkPrimaryDark ?? '#1565c0') : (c.primaryDark ?? '#1565c0');
  const primary200 = navType === 'dark' ? (c.darkPrimary200 ?? '#90caf9') : (c.primary200 ?? '#90caf9');
  const primary800 = navType === 'dark' ? (c.darkPrimary800 ?? '#1565c0') : (c.primary800 ?? '#1565c0');

  const secondaryLight = navType === 'dark' ? (c.darkSecondaryLight ?? '#ede7f6') : (c.secondaryLight ?? '#ede7f6');
  const secondaryMain = navType === 'dark' ? (c.darkSecondaryMain ?? '#9c27b0') : (c.secondaryMain ?? '#9c27b0');
  const secondaryDark = navType === 'dark' ? (c.darkSecondaryDark ?? '#6a0080') : (c.secondaryDark ?? '#6a0080');
  const secondary200 = navType === 'dark' ? (c.darkSecondary200 ?? '#ce93d8') : (c.secondary200 ?? '#ce93d8');
  const secondary800 = navType === 'dark' ? (c.darkSecondary800 ?? '#6a0080') : (c.secondary800 ?? '#6a0080');

  return createTheme({
    palette: {
      mode: navType,
      common: {
        black: c.darkPaper ?? '#212121'
      },
      primary: {
        light: primaryLight,
        main: primaryMain,
        dark: primaryDark,
        200: primary200,
        800: primary800
      },
      secondary: {
        light: secondaryLight,
        main: secondaryMain,
        dark: secondaryDark,
        200: secondary200,
        800: secondary800
      },
      error: {
        light: c.errorLight ?? '#ef9a9a',
        main: c.errorMain ?? '#f44336',
        dark: c.errorDark ?? '#c62828'
      },
      orange: {
        light: c.orangeLight ?? '#fbe9e7',
        main: c.orangeMain ?? '#ffab91',
        dark: c.orangeDark ?? '#d84315'
      },
      warning: {
        light: c.warningLight ?? '#fff8e1',
        main: c.warningMain ?? '#ffe57f',
        dark: c.warningDark ?? '#ffc107'
      },
      success: {
        light: c.successLight ?? '#b9f6ca',
        200: c.success200 ?? '#69f0ae',
        main: c.successMain ?? '#00e676',
        dark: c.successDark ?? '#00c853'
      },
      grey: {
        50: c.grey50 ?? '#fafafa',
        100: c.grey100 ?? '#f5f5f5',
        500: navType === 'dark' ? (c.darkTextSecondary ?? '#8492c4') : (c.grey500 ?? '#9e9e9e'),
        600: navType === 'dark' ? (c.darkTextTitle ?? '#bdc8f0') : (c.grey900 ?? '#212121'),
        700: navType === 'dark' ? (c.darkTextPrimary ?? '#bdc8f0') : (c.grey700 ?? '#616161'),
        900: navType === 'dark' ? (c.darkTextPrimary ?? '#bdc8f0') : (c.grey900 ?? '#212121')
      },
      dark: {
        light: c.darkTextPrimary ?? '#bdc8f0',
        main: c.darkLevel1 ?? '#29314f',
        dark: c.darkLevel2 ?? '#212946',
        800: c.darkBackground ?? '#1a223f',
        900: c.darkPaper ?? '#111936'
      },
      text: {
        primary: navType === 'dark' ? (c.darkTextPrimary ?? '#bdc8f0') : (c.grey700 ?? '#616161'),
        secondary: navType === 'dark' ? (c.darkTextSecondary ?? '#8492c4') : (c.grey500 ?? '#9e9e9e'),
        dark: navType === 'dark' ? (c.darkTextPrimary ?? '#bdc8f0') : (c.grey900 ?? '#212121'),
        hint: c.grey100 ?? '#f5f5f5'
      },
      divider: navType === 'dark' ? (c.darkTextPrimary ?? '#bdc8f0') : (c.grey200 ?? '#eeeeee'),
      background: {
        paper: navType === 'dark' ? (c.darkLevel2 ?? '#212946') : (c.paper ?? '#ffffff'),
        default: navType === 'dark' ? (c.darkPaper ?? '#111936') : (c.paper ?? '#ffffff')
      },
      cosmic: {
        cyan: '#00D4FF',
        violet: '#7C3AED',
        blue: '#3B82F6',
        line: 'rgba(59, 130, 246, 0.15)',
        lineStrong: 'rgba(59, 130, 246, 0.4)',
        bg0: '#080C1A',
        bg1: '#0D1530',
        bg2: '#162040',
      }
    }
  });
};

export default Palette;
