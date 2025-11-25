'use client';

import { useTranslations } from 'next-intl';
import { Languages } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function Footer() {
  const t = useTranslations('Footer');
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const isZh = pathname.startsWith('/zh');
    
    if (isZh) {
      // Switch to English: Remove /zh prefix
      const newPath = pathname.replace(/^\/zh/, '') || '/';
      router.push(newPath);
    } else {
      // Switch to Chinese: Add /zh prefix
      // Note: Assuming default is English (no prefix or /en)
      const newPath = `/zh${pathname === '/' ? '' : pathname}`;
      router.push(newPath);
    }
  };

  return (
    <footer id="about" className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">
            {t('copyright')}
          </p>
          
          <div className="flex items-center gap-4 text-neutral-500">
            <button 
              onClick={toggleLanguage}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-2"
              aria-label="Switch Language"
            >
              <Languages size={20} />
              <span className="text-sm font-medium">
                {pathname.startsWith('/zh') ? 'English' : '中文'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
