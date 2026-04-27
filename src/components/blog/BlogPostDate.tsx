'use client';

import useConfig from '@/hooks/useConfig';

interface BlogPostDateProps {
  date: string;
}

export default function BlogPostDate({ date }: BlogPostDateProps) {
  const { locale } = useConfig();
  const dateLocale = locale === 'es' ? 'es-ES' : 'en-US';

  return (
    <span style={{ fontSize: '0.75rem' }} suppressHydrationWarning>
      {new Date(date).toLocaleDateString(dateLocale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </span>
  );
}
