'use client';

import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import { cosmic } from '@/themes/cosmicTokens';

interface GlowCardProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  gradient?: boolean;
}

export default function GlowCard({ children, sx, gradient = false }: GlowCardProps) {
  if (gradient) {
    return (
      <Box
        sx={{
          position: 'relative',
          borderRadius: '20px',
          p: '1px',
          background: cosmic.gradientBorder,
        }}
      >
        <Box
          sx={{
            borderRadius: '19px',
            background: cosmic.bg1,
            height: '100%',
            p: 3.5,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: cosmic.glowBlueStrong,
              transform: 'translateY(-2px)',
            },
            ...sx,
          }}
        >
          {children}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: 'rgba(22, 32, 64, 0.6)',
        border: `1px solid ${cosmic.line}`,
        borderRadius: '20px',
        p: 3.5,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(59, 130, 246, 0.05)',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: cosmic.lineStrong,
          boxShadow: cosmic.glowBlue,
          transform: 'translateY(-2px)',
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
