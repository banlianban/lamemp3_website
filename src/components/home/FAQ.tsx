'use client';

import { useTranslations } from 'next-intl';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function FAQ() {
  const t = useTranslations('FAQ');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12 bg-white" id="faq">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-neutral-900">
          {t('title')}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {t.raw('list').map((item: any, index: number) => (
            <div 
              key={index}
              className="bg-neutral-50 rounded-2xl border border-neutral-200 overflow-hidden h-fit transition-colors hover:border-neutral-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-lg text-neutral-900 pr-4">
                  {item.q}
                </span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                )}
              </button>
              
              <div 
                className={clsx(
                  "px-6 transition-all duration-300 ease-in-out overflow-hidden",
                  openIndex === index ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <p className="text-neutral-600 leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
