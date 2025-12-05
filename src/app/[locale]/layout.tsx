import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import ClientProviders from '@/components/ClientProviders';
import Navbar from '@/components/layout/Navbar';
import StructuredData from '@/components/StructuredData';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import "../globals.css";
import { locales } from '@/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const baseUrl = 'https://lomemp3.com';
  
  const isDefaultLocale = locale === 'en';
  const currentUrl = isDefaultLocale ? baseUrl : `${baseUrl}/${locale}`;
  
  const title = t('title');
  const description = t('description');
  
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s | LameMP3`,
    },
    description,
    keywords: [
      'Car MP3 Converter',
      'LAME encoder',
      'CBR 320kbps',
      'MP3 fix',
      'car audio compatibility',
      'USB music player',
      '车载MP3转换',
      '车机音乐',
      '乱码修复',
      'LAME编码',
    ],
    authors: [{ name: 'LameMP3' }],
    creator: 'LameMP3',
    publisher: 'LameMP3',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      url: currentUrl,
      title,
      description,
      siteName: 'LameMP3',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.png`],
      creator: '@lamemp3',
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
    manifest: '/site.webmanifest',
    alternates: {
      canonical: currentUrl,
      languages: {
        'en': baseUrl,
        'zh': `${baseUrl}/zh`,
        'x-default': baseUrl,
      },
    },
    verification: {
      // google: 'your-google-verification-code',
    },
    category: 'technology',
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <StructuredData locale={locale} messages={messages as any} />
        {/* 提前初始化 dataLayer，确保埋点函数可以立即使用 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        <NextIntlClientProvider messages={messages}>
          <ClientProviders>
            <Navbar />
            {children}
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
