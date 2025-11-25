'use client';

import { Music } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="pt-20 pb-10 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Music size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-neutral-900 dark:text-white">
                LameMP3
              </span>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs">
              专为车载音响优化的 MP3 转换工具，解决老旧车机无法播放、乱码等问题。
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-6">相关工具</h4>
            <div className="flex flex-col gap-4">
              <Link href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FLAC 转 MP3</Link>
              <Link href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">WAV 转 MP3</Link>
              <Link href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">APE 转 MP3</Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-6">关于</h4>
            <div className="flex flex-col gap-4">
              <Link href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">隐私协议</Link>
              <Link href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">服务条款</Link>
              <Link href="https://github.com/lobehub/lobe-ui" target="_blank" className="text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Lobe UI</Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-100 dark:border-neutral-800 text-center text-sm text-neutral-400 dark:text-neutral-600">
          © {new Date().getFullYear()} LameMP3.com. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

