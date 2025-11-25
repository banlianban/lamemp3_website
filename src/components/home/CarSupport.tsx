'use client';

import { useTranslations } from 'next-intl';
import { CarFront, Radio } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function CarSupport() {
  const t = useTranslations('CarSupport');
  const list = t.raw('list') as string[];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollSpeed = 0.3; // 滚动速度

    const scroll = () => {
      scrollAmount += scrollSpeed;
      if (scrollContainer.scrollWidth && scrollAmount >= scrollContainer.scrollWidth / 2) {
        scrollAmount = 0;
      }
      scrollContainer.scrollLeft = scrollAmount;
    };

    const intervalId = setInterval(scroll, 20);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // 将列表复制两份以实现无缝循环
  const doubledList = [...list, ...list];
  
  // 将列表分成3行
  const rows = 3;
  const itemsPerRow = Math.ceil(doubledList.length / rows);

  return (
    <section id="car-support" className="py-12 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-neutral-900">
            {t('title')}
          </h2>
          <p className="text-neutral-500 text-sm">
            {t('more')}
          </p>
        </div>

        <div 
          ref={scrollRef}
          className="overflow-x-scroll scrollbar-hide"
          style={{ 
            maskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)'
          }}
        >
          <div className="grid grid-rows-3 gap-2" style={{ 
            gridAutoFlow: 'column',
            gridAutoColumns: 'max-content',
            width: 'max-content'
          }}>
            {doubledList.map((item: string, index: number) => (
              <div key={index} className="group flex items-center gap-2 px-3 py-2 bg-white hover:bg-blue-50 border border-neutral-200 hover:border-blue-100 rounded-lg transition-all duration-300 cursor-default whitespace-nowrap">
                <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 group-hover:text-blue-600 group-hover:bg-white transition-all flex-shrink-0">
                  {(index % list.length) < 8 ? <CarFront size={14} /> : <Radio size={14} />}
                </div>
                <span className="font-medium text-neutral-700 group-hover:text-blue-900 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
