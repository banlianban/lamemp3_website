'use client';

import { ThemeProvider } from '@lobehub/ui';
import { PropsWithChildren } from 'react';
import { ConfigProvider } from 'antd';
import { useEffect } from 'react';
import { message } from 'antd';

export default function ClientProviders({ children }: PropsWithChildren) {

  useEffect(() => {
    message.config({
      top: 64,
      duration: 3,
      maxCount: 3,
    });
  }, []);

  return (
    <ThemeProvider themeMode="auto">
      <ConfigProvider>
        {children}
      </ConfigProvider>
    </ThemeProvider>
  );
}

