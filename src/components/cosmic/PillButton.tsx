'use client';

import Button, { ButtonProps } from '@mui/material/Button';
import { cosmic } from '@/themes/cosmicTokens';

interface PillButtonProps extends ButtonProps {
  glowColor?: string;
}

export default function PillButton({ glowColor, sx, children, ...props }: PillButtonProps) {
  const glow = glowColor || cosmic.blue;

  return (
    <Button
      {...props}
      sx={{
        borderRadius: '999px',
        px: 3.25,
        py: 1.75,
        fontFamily: 'var(--font-archivo), sans-serif',
        fontWeight: 500,
        fontSize: '0.9375rem',
        textTransform: 'none',
        whiteSpace: 'nowrap',
        ...(props.variant === 'outlined'
          ? {
              borderColor: `${glow}4D`,
              color: cosmic.textPrimary,
              '&:hover': {
                borderColor: glow,
                background: `${glow}14`,
              },
            }
          : {}),
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}
