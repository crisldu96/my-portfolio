import * as React from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

// project import
import ThemeCustomization from '@/themes';
import { ConfigProvider } from '@/contexts/ConfigContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function RootLayout(props: { children: React.ReactNode; }) {
  return (
    <html lang="en">
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
