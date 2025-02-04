import React, { useMemo } from 'react';
import { useTheme, styled, SxProps, Theme } from '@mui/material/styles';
import BgDark from '../assets/images/landing/bg-hero-block-dark.png';
import BgLight from '../assets/images/landing/bg-hero-block-light.png';

const HeaderAnimationImage = styled('img')({
  maxWidth: '100%',
  filter: 'drop-shadow(0px 0px 50px rgb(33 150 243 / 30%))'
});

const ImageBackground = (props: { sx?: SxProps<Theme>; }) => {
  const { sx } = props;
  const theme = useTheme();

  const imageSource = useMemo(() => {
    return theme.palette.mode === 'dark' ? BgDark.src : BgLight.src;
  }, [theme.palette.mode]); // Dependencia en theme.palette.mode

  return useMemo(() => (
    <HeaderAnimationImage
      src={imageSource}
      alt="Cristopher Palacios Portfolio"
      sx={{
        display: { xs: 'none', md: 'flex' },
        position: 'absolute',
        filter: 'none',
        width: '50%',
        transformOrigin: '50% 50%',
        transform: 'rotateY(0deg)',
        // Evita el parpadeo en cambios de tema
        transition: 'opacity 0.3s ease-in-out',
        ...sx
      }}
    />
  ), [imageSource]); // Dependencia en imageSource
};

export default ImageBackground;