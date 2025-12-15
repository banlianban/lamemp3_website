'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from 'antd';
import { Globe, Car } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const t = useTranslations('Navigation');
  
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = pathname.split('/')[1] || 'en';

  const handleLanguageChange = () => {
    const newLocale = currentLocale === 'en' ? 'zh' : 'en';
    const pathSegments = pathname.split('/').filter(Boolean);
    pathSegments[0] = newLocale;
    const newPath = '/' + pathSegments.join('/');
    router.push(newPath);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${currentLocale}`} className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white">
            <Car className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            LameMP3
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#diagnosis" className="text-sm font-medium hover:text-blue-600 transition-colors">
            {t('diagnosis')}
          </Link>
          <Link href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">
            {t('features')}
          </Link>
          <Link href="#car-support" className="text-sm font-medium hover:text-blue-600 transition-colors">
            {t('carSupport')}
          </Link>
          <Link href="#faq" className="text-sm font-medium hover:text-blue-600 transition-colors">
            {t('faq')}
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            type="default"
            href="https://x.com/mp3covers"
            target="_blank"
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            }
            className="!flex !items-center !justify-center !gap-2 border-neutral-300 hover:border-blue-500 transition-colors [&_.ant-btn-icon]:!flex [&_.ant-btn-icon]:!items-center [&_.ant-btn-icon]:!justify-center"
            aria-label="X (Twitter)"
          >
            X-Twitter
          </Button>
          <Button 
            type="default"
            icon={<Globe className="w-4 h-4" />}
            onClick={handleLanguageChange}
            className="!flex !items-center !justify-center !gap-2 border-neutral-300 hover:border-blue-500 transition-colors [&_.ant-btn-icon]:!flex [&_.ant-btn-icon]:!items-center [&_.ant-btn-icon]:!justify-center"
          >
            {currentLocale === 'zh' ? '中文' : 'English'}
          </Button>
        </div>

        {/* Mobile Language Button */}
        <div className="md:hidden flex items-center gap-4">
          <a
            href="https://x.com/mp3covers"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-neutral-600"
            aria-label="X (Twitter)"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
           <button 
            className="p-2 text-neutral-600"
            onClick={handleLanguageChange}
          >
            <Globe className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
