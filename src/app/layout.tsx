import * as React from 'react';
import { Metadata } from 'next';
import { Archivo, Space_Grotesk, JetBrains_Mono } from 'next/font/google';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

// project import
import ThemeCustomization from '@/themes';
import { ConfigProvider } from '@/contexts/ConfigContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import LoadingRemover from '@/components/LoadingRemover';
import CustomCursor from '@/components/cosmic/CustomCursor';
import RevealController from '@/components/cosmic/RevealController';
import LenisProvider from '@/components/cosmic/LenisProvider';
import PageFold from '@/components/cosmic/PageFold';
import { social } from '@/config/social';
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
      url: social.linkedin,
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
            background:
              radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.18), transparent 60%),
              radial-gradient(ellipse at 70% 80%, rgba(124,58,237,0.14), transparent 60%),
              #080C1A;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 24px;
            transition: opacity 0.6s ease, clip-path 0.9s cubic-bezier(0.76,0,0.24,1);
          }
          #app-loading.fade-out {
            opacity: 0;
            pointer-events: none;
            clip-path: inset(100% 0 0 0);
          }
          .app-loading-mono {
            position: relative;
            width: 88px;
            height: 88px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 14px;
            border: 1px solid rgba(59,130,246,0.5);
            background: rgba(59,130,246,0.08);
            box-shadow: 0 0 48px rgba(59,130,246,0.2);
            animation: app-loading-pulse 2s ease-in-out infinite;
            overflow: hidden;
          }
          .app-loading-mono::before {
            content: '';
            position: absolute;
            inset: -1px;
            border-radius: 14px;
            border: 1px solid transparent;
            background: linear-gradient(135deg, rgba(59,130,246,0.9), rgba(0,212,255,0.6), rgba(124,58,237,0.8)) border-box;
            -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
                    mask-composite: exclude;
            opacity: 0.8;
            animation: app-loading-rotate 3.5s linear infinite;
          }
          .app-loading-mono-text {
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 700;
            font-size: 28px;
            letter-spacing: 0.02em;
            color: #F0F4FF;
            text-shadow: 0 0 18px rgba(59,130,246,0.5);
          }
          .app-loading-line {
            width: 160px;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(59,130,246,0.7), rgba(0,212,255,0.8), transparent);
            position: relative;
            overflow: hidden;
            border-radius: 2px;
          }
          .app-loading-line::after {
            content: '';
            position: absolute;
            top: 0; left: -40%;
            width: 40%; height: 100%;
            background: linear-gradient(90deg, transparent, #F0F4FF, transparent);
            animation: app-loading-scan 1.3s ease-in-out infinite;
          }
          .app-loading-caption {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            letter-spacing: 0.32em;
            text-transform: uppercase;
            color: #8899BB;
          }
          @keyframes app-loading-pulse {
            0%, 100% { box-shadow: 0 0 48px rgba(59,130,246,0.2); }
            50% { box-shadow: 0 0 72px rgba(0,212,255,0.35); }
          }
          @keyframes app-loading-rotate {
            to { transform: rotate(360deg); }
          }
          @keyframes app-loading-scan {
            0% { left: -40%; }
            100% { left: 100%; }
          }
          @media (prefers-reduced-motion: reduce) {
            .app-loading-mono, .app-loading-mono::before, .app-loading-line::after {
              animation: none;
            }
          }
        `}} />
      </head>
      <body>
        <Schema />
        <div id="app-loading" aria-hidden="true">
          <div className="app-loading-mono">
            <span className="app-loading-mono-text">CP</span>
          </div>
          <div className="app-loading-line" />
          <span className="app-loading-caption">Loading experience</span>
        </div>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ConfigProvider>
            <LanguageProvider>
              <ThemeCustomization>
                <LoadingRemover />
                <CustomCursor />
                <RevealController />
                <LenisProvider />
                <PageFold />
                {props.children}
              </ThemeCustomization>
            </LanguageProvider>
          </ConfigProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
