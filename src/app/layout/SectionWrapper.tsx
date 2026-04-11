import React from 'react';

// material-ui
import { styled } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/material';

interface SectionWrapperProps {
  id?: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const SectionWrapperComponent = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(12),
  },
}));

const SectionWrapper = (props: SectionWrapperProps) => {
  return (
    <SectionWrapperComponent id={props.id} sx={props.sx}>
      {props.children}
    </SectionWrapperComponent>
  );
};

export default SectionWrapper;
