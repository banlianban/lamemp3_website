'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// TypeScript 类型定义
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = 'G-VRG80YE6YB';

  useEffect(() => {
    console.log('🔍 [GA4] GoogleAnalytics component mounted');
    console.log('🔍 [GA4] Measurement ID:', GA_MEASUREMENT_ID);
    console.log('🔍 [GA4] Current path:', window.location.pathname);
  }, []);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={() => {
          console.log('✅ [GA4] gtag.js script loaded successfully');
        }}
        onError={(e) => {
          console.error('❌ [GA4] Failed to load gtag.js script:', e);
        }}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ [GA4] Analytics configuration script loaded');
          console.log('✅ [GA4] dataLayer:', window.dataLayer);
          console.log('✅ [GA4] gtag function:', typeof window.gtag);
        }}
        onError={(e) => {
          console.error('❌ [GA4] Failed to load analytics configuration:', e);
        }}
        dangerouslySetInnerHTML={{
          __html: `
            console.log('🚀 [GA4] Initializing dataLayer and gtag...');
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            console.log('🚀 [GA4] Configuring GA with ID: ${GA_MEASUREMENT_ID}');
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
            console.log('✅ [GA4] GA configured successfully for path:', window.location.pathname);
            console.log('✅ [GA4] window.gtag is now available:', typeof window.gtag);
          `,
        }}
      />
    </>
  );
}

