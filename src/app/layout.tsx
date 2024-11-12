import * as React from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

// project import
import ThemeCustomization from '@/themes';
import { ConfigProvider } from '@/contexts/ConfigContext';

export default function RootLayout(props: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ConfigProvider>
            <ThemeCustomization>
              {props.children}
            </ThemeCustomization>
          </ConfigProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
