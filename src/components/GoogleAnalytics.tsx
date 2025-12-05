'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { clientLogger } from '@/lib/logger';

// TypeScript 类型定义
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = 'G-VRG80YE6YB';
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    // 设置全局变量供内联脚本使用
    if (typeof window !== 'undefined') {
      (window as any).__GA4_DEBUG__ = isDev;
    }
    clientLogger.log('🔍 [GA4] GoogleAnalytics component mounted');
    clientLogger.log('🔍 [GA4] Measurement ID:', GA_MEASUREMENT_ID);
    clientLogger.log('🔍 [GA4] Current path:', window.location.pathname);
  }, [isDev]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={() => {
          clientLogger.log('✅ [GA4] gtag.js script loaded successfully');
        }}
        onError={(e) => {
          clientLogger.error('❌ [GA4] Failed to load gtag.js script:', e);
        }}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        onLoad={() => {
          clientLogger.log('✅ [GA4] Analytics configuration script loaded');
          clientLogger.log('✅ [GA4] dataLayer:', window.dataLayer);
          clientLogger.log('✅ [GA4] gtag function:', typeof window.gtag);
        }}
        onError={(e) => {
          clientLogger.error('❌ [GA4] Failed to load analytics configuration:', e);
        }}
        dangerouslySetInnerHTML={{
          __html: `
            var isDev = window.__GA4_DEBUG__ || false;
            if (isDev) {
              console.log('🚀 [GA4] Initializing dataLayer and gtag...');
            }
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            if (isDev) {
              console.log('🚀 [GA4] Configuring GA with ID: ${GA_MEASUREMENT_ID}');
            }
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
            if (isDev) {
              console.log('✅ [GA4] GA configured successfully for path:', window.location.pathname);
              console.log('✅ [GA4] window.gtag is now available:', typeof window.gtag);
            }
          `,
        }}
      />
    </>
  );
}

