import React from 'react';

// material-ui
import { styled } from '@mui/material/styles';

// project import
import AppBar from '@/components/layout/AppBar';

// custom stlye
const HeaderWrapperComponent = styled('div')(({ theme }) => ({
  overflowX: 'hidden',
  overflowY: 'clip',
  background:
    theme.palette.mode === 'dark'
      ? theme.palette.background.default
      : `linear-gradient(360deg, ${theme.palette.grey[100]} 1.09%, ${theme.palette.background.paper} 100%)`,
  [theme.breakpoints.down('md')]: {}
}));

const HeaderWrapper = (props: { children: React.ReactNode; }) => {
  return (
    <HeaderWrapperComponent id="home">
      <AppBar />
      {props.children}
    </HeaderWrapperComponent>
  );
};

export default HeaderWrapper;