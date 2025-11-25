'use client';

import { useTranslations } from 'next-intl';
import { Gauge, Disc, Tags } from 'lucide-react';

export default function Features() {
  const t = useTranslations('Features');

  const icons = [Gauge, Disc, Tags];
  
  return (
    <section className="py-12 bg-white" id="features">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-neutral-900">
            {t('title')}
          </h2>
          <p className="text-neutral-500 text-sm">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {t.raw('list').map((item: any, index: number) => {
            const Icon = icons[index];
            
            return (
              <div key={index} className="group relative p-8 rounded-3xl bg-neutral-50 border border-neutral-200 hover:bg-white transition-all duration-300">
                <div className="w-16 h-16 mb-4 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300">
                   <Icon size={32} className="text-neutral-900 group-hover:text-white transition-colors" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2 text-neutral-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-base text-neutral-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
