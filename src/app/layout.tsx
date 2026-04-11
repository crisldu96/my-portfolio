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
            background: #6366F1;
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
        <div id="app-loading" aria-hidden="true">
          <div className="app-loading-dot" />
          <div className="app-loading-dot" />
          <div className="app-loading-dot" />
        </div>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            function remove() {
              var el = document.getElementById('app-loading');
              if (!el) return;
              el.classList.add('fade-out');
              setTimeout(function() { el && el.parentNode && el.parentNode.removeChild(el); }, 450);
            }
            if (document.readyState === 'complete') {
              remove();
            } else {
              window.addEventListener('load', remove);
            }
          })();
        `}} />
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
