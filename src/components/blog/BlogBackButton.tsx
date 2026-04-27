'use client';

import NextLink from 'next/link';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useLanguage from '@/hooks/useLanguage';

export default function BlogBackButton() {
  const { handleTranslation } = useLanguage();

  return (
    <NextLink href="/blog" passHref legacyBehavior>
      <Button
        component="a"
        startIcon={<ArrowBackIcon />}
        className="blog-back-btn"
        suppressHydrationWarning
      >
        {handleTranslation('blogPage.backToBlog')}
      </Button>
    </NextLink>
  );
}
