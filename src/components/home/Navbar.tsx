'use client';

import { Button } from 'antd';
import Link from 'next/link';
import { Music, Github } from 'lucide-react';
import { ThemeSwitch } from '@lobehub/ui';
import { useTheme } from 'antd-style';
import { useTranslations } from 'next-intl';

// Navigation component
export default function Navbar() {
  const theme = useTheme();
  const t = useTranslations('Navigation');
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-all">
      <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105">
            <Music size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-neutral-900 dark:text-white">
            LameMP3
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#diagnosis" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('diagnosis')}</Link>
          <Link href="#features" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('features')}</Link>
          <Link href="#car-support" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('carSupport')}</Link>
          <Link href="#faq" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('faq')}</Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeSwitch themeMode="auto" onThemeSwitch={() => {}} />
          <Button 
            type="text"
            icon={<Github size={20} />} 
            href="https://github.com/lobehub/lobe-ui" 
            target="_blank"
            className="!flex !items-center !justify-center !w-9 !h-9 !rounded-lg !text-neutral-600 dark:!text-neutral-400 hover:!bg-neutral-100 dark:hover:!bg-neutral-800 hover:!text-neutral-900 dark:hover:!text-white"
          />
        </div>
      </div>
    </header>
  );
}

