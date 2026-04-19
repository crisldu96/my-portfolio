import * as React from 'react';
import { Metadata } from 'next';
import { Archivo, Space_Grotesk, JetBrains_Mono } from 'next/font/google';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

// project import
import ThemeCustomization from '@/themes';
import { ConfigProvider } from '@/contexts/ConfigContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import LoadingRemover from '@/components/LoadingRemover';
import Schema from './schema';
import '@/styles/cosmic.css';

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

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cristopherpalacios.dev'),
  title: {
    default: 'Cristopher Palacios | Full Stack & AI Developer',
    template: '%s | Cristopher Palacios',
  },
  description:
    'Cristopher Palacios is a Full Stack and AI Developer from Ecuador specializing in React, Next.js, Node.js, and AI-powered applications. Available for freelance and full-time opportunities.',
  keywords: [
    'Cristopher Palacios',
    'Cristopher Palacios developer',
    'Cristopher Palacios web developer',
    'Cristopher Palacios AI developer',
    'Cristopher Palacios full stack developer',
    'Cristopher Palacios front end developer',
    'Cristopher Palacios Ecuador',
    'full stack developer Ecuador',
    'React developer Ecuador',
    'Next.js developer',
    'Node.js developer',
    'AI developer portfolio',
    'TypeScript developer',
    'freelance developer Ecuador',
    'hire full stack developer',
    'hire React developer',
    'hire AI developer',
    'web developer portfolio',
    'software engineer Ecuador',
    'JavaScript developer portfolio',
  ],
  authors: [
    {
      name: 'Cristopher Palacios',
      url: 'https://ec.linkedin.com/in/cristopher-palacios-791704160',
    },
  ],
  creator: 'Cristopher Palacios',
  publisher: 'Cristopher Palacios',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'es_EC',
    url: 'https://cristopherpalacios.dev',
    siteName: 'Cristopher Palacios Portfolio',
    title: 'Cristopher Palacios | Full Stack & AI Developer',
    description:
      'Full Stack and AI Developer from Ecuador. Expert in React, Next.js, Node.js, TypeScript, and AI integrations. Building scalable web applications since 2018.',
    images: [
      {
        url: '/assets/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cristopher Palacios - Full Stack & AI Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cristopher Palacios | Full Stack & AI Developer',
    description:
      'Full Stack and AI Developer from Ecuador. Expert in React, Next.js, Node.js, and AI integrations.',
    images: ['/assets/images/og-image.png'],
    creator: '@cristopherpdev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://cristopherpalacios.dev',
  },
  verification: {
    google: 'mNj4jfVE8P-OKKx9NxV7VpIqedtbaxvAPbTvjzgPiwk',
    other: {
      'msvalidate.01': 'CB538F1B1708E86416170069669EA56C',
    },
  },
};

export default function RootLayout(props: { children: React.ReactNode; }) {
  return (
    <html lang="en" className={`${archivo.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          #app-loading {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: #080C1A;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: opacity 0.4s ease;
          }
          #app-loading.fade-out {
            opacity: 0;
            pointer-events: none;
          }
          .app-loading-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #3B82F6;
            animation: app-loading-bounce 1.2s ease-in-out infinite;
          }
          .app-loading-dot:nth-child(2) { animation-delay: 0.2s; }
          .app-loading-dot:nth-child(3) { animation-delay: 0.4s; }
          @keyframes app-loading-bounce {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}} />
      </head>
      <body>
        <Schema />
        <div id="app-loading" aria-hidden="true">
          <div className="app-loading-dot" />
          <div className="app-loading-dot" />
          <div className="app-loading-dot" />
        </div>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ConfigProvider>
            <LanguageProvider>
              <ThemeCustomization>
                <LoadingRemover />
                {props.children}
              </ThemeCustomization>
            </LanguageProvider>
          </ConfigProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
