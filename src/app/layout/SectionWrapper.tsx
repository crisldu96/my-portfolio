import React from 'react';

// material-ui
import { styled } from '@mui/material/styles';

interface SectionWrapperProps {
  id?: string;
  children: React.ReactNode;
  sx?: { bgcolor: string; };
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