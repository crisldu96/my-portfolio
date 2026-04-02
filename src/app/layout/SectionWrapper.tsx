import React from 'react';

// material-ui
import { styled } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/material';

interface SectionWrapperProps {
  id?: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const SectionWrapperComponent = styled('div')({
  paddingTop: 100,
  paddingBottom: 100
});

const SectionWrapper = (props: SectionWrapperProps) => {
  return (
    <SectionWrapperComponent id={props.id} sx={props.sx}>
      {props.children}
    </SectionWrapperComponent>
  );
};

export default SectionWrapper;
