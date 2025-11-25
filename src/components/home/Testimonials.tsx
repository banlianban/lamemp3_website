'use client';

import { useTranslations } from 'next-intl';
import { Quote } from 'lucide-react';
import { Carousel } from 'antd';
import { useRef } from 'react';

export default function Testimonials() {
  const t = useTranslations('Testimonials');
  const list = t.raw('list');
  const carouselRef = useRef<any>(null);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-neutral-900">
          {t('title')}
        </h2>

        <div className="px-16 py-8 overflow-visible">
          <Carousel 
            arrows 
            infinite 
            slidesToShow={2} 
            slidesToScroll={1}
            dots={true}
            responsive={[
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                }
              }
            ]}
            className="pb-12 overflow-visible [&>.slick-prev]:!text-neutral-400 [&>.slick-prev]:!left-[-50px] [&>.slick-next]:!text-neutral-400 [&>.slick-next]:!right-[-50px] [&>.slick-dots_li_button]:!bg-neutral-300 [&>.slick-dots_li.slick-active_button]:!bg-blue-600"
          >
            {list.map((item: any, index: number) => (
              <div key={index} className="px-4 overflow-visible pt-8">
                <div className="bg-white p-8 rounded-3xl border border-neutral-200 relative transition-all duration-300 h-full min-h-[240px] flex flex-col justify-between overflow-visible">
                   <div className="absolute -top-6 -left-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg z-10">
                      <Quote className="w-7 h-7 text-white fill-current" />
                   </div>
                   <p className="text-lg text-neutral-600 italic leading-relaxed pt-2">"{item.content}"</p>
                   <div className="mt-4">
                      <div className="text-neutral-900 font-bold text-sm">{item.author}</div>
                      <div className="text-xs text-neutral-500">{item.role}</div>
                   </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
