'use client';

import { useTranslations } from 'next-intl';
import { Languages, Mail } from 'lucide-react';
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
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
            <p>
              {t('copyright')}
            </p>
            <a 
              href="mailto:car@lamemp3.com"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
            >
              <Mail size={16} />
              <span>car@lamemp3.com</span>
            </a>
          </div>
          
          <div className="flex items-center gap-4 text-neutral-500">
            <a
              href="https://x.com/mp3covers"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-2"
              aria-label="X (Twitter)"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
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
