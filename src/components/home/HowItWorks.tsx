'use client';

import { useTranslations } from 'next-intl';
import { Upload, Stethoscope, Hammer, Download } from 'lucide-react';

export default function HowItWorks() {
  const t = useTranslations('HowItWorks');
  const steps = t.raw('steps');
  const icons = [Upload, Stethoscope, Hammer, Download];

  return (
    <section className="py-12 bg-white text-neutral-900" id="how-it-works">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-neutral-900">
            {t('title')}
          </h2>
          <p className="text-neutral-500 text-sm">
            {t('subtitle')}
          </p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-neutral-100">
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-10" />
          </div>

          <div className="grid md:grid-cols-4 gap-12">
            {steps.map((item: any, index: number) => {
              const Icon = icons[index];
              return (
                <div key={index} className="relative flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-white border-4 border-neutral-100 rounded-full flex items-center justify-center mb-8 z-10 group-hover:border-blue-500 transition-colors duration-500">
                    <Icon className="w-10 h-10 text-neutral-400 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <p className="text-neutral-500 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
