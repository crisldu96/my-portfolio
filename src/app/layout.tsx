import * as React from 'react';
import { Metadata } from 'next';
import { Archivo, Space_Grotesk } from 'next/font/google';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

// project import
import ThemeCustomization from '@/themes';
import { ConfigProvider } from '@/contexts/ConfigContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cristopher Palacios | Full Stack Developer',
  description: 'Full Stack Developer specializing in React, Node.js, and cloud solutions. Building modern web applications.',
  keywords: ['Full Stack Developer', 'React', 'Node.js', 'TypeScript', 'Next.js'],
  authors: [{ name: 'Cristopher Palacios' }],
  openGraph: {
    title: 'Cristopher Palacios | Full Stack Developer',
    description: 'Full Stack Developer specializing in React, Node.js, and cloud solutions.',
    type: 'website',
  },
};

export default function RootLayout(props: { children: React.ReactNode; }) {
  return (
    <html lang="en" className={`${archivo.variable} ${spaceGrotesk.variable}`}>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ConfigProvider>
            <LanguageProvider>
              <ThemeCustomization>
                {props.children}
              </ThemeCustomization>
            </LanguageProvider>
          </ConfigProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
