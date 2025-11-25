'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import './DiagnosisDemo.css';

const DIMENSIONS = [
  { label: 'bitrate', bad: 'vbr', good: 'cbr' },
  { label: 'cover', bad: 'coverLarge', good: 'coverOptimized' },
  { label: 'tag', bad: 'tagUnsupported', good: 'tagStandard' },
  { label: 'encoding', bad: 'encodingUnknown', good: 'encodingLame' },
  { label: 'sampleRate', bad: 'sampleRateResampled', good: 'sampleRateStandard' },
  { label: 'channels', bad: 'channelsStereo', good: 'channelsJoint' },
  { label: 'junk', bad: 'junkPresent', good: 'junkCleaned' },
];

export default function DiagnosisDemo() {
  const t = useTranslations('Diagnosis');

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="diagnosis">
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-16">
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900 leading-tight">
              {t('title')}
            </h2>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              {t('subtitle')}
            </p>
            
            <div className="space-y-6">
               <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-neutral-200 hover:border-blue-200 transition-colors">
                 <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                   <AlertTriangle className="w-6 h-6" />
                 </div>
                 <div>
                   <h4 className="text-lg font-bold text-neutral-900 mb-1">{t('smartDiagnosis.title')}</h4>
                   <p className="text-neutral-500 text-sm">{t('smartDiagnosis.desc')}</p>
                 </div>
               </div>
            </div>
          </div>

          <div className="md:w-1/2 w-full">
             <div className="relative bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                <div className="grid grid-cols-2 divide-x divide-neutral-100">
                   {/* Before State */}
                   <div className="p-6 bg-gradient-to-br from-amber-50/80 to-orange-50/80 relative overflow-hidden">
                     <div className="flex items-center gap-3 mb-4 relative z-10">
                       <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                         <XCircle size={20} />
                       </div>
                       <span className="font-bold text-amber-700">{t('demo.before')}</span>
                     </div>
                     
                     <div className="h-[280px] overflow-hidden relative">
                        <div className="scroll-container">
                           {[...DIMENSIONS, ...DIMENSIONS].map((item, i) => (
                             <div key={`bad-${i}`} className="p-3 rounded-lg bg-white/60 border border-amber-100/50 backdrop-blur-sm mb-3">
                               <div className="text-xs text-amber-600 uppercase font-bold mb-1">{t(`demo.${item.label}`)}</div>
                               <div className="text-neutral-900 font-mono text-sm">{t(`demo.${item.bad}`)}</div>
                             </div>
                           ))}
                        </div>
                        {/* Gradients for fade effect */}
                        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-amber-50 to-transparent z-10 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-amber-50 to-transparent z-10 pointer-events-none" />
                     </div>
                   </div>

                   {/* After State */}
                   <div className="p-6 bg-gradient-to-br from-green-50/80 to-emerald-50/80 relative overflow-hidden">
                     <div className="flex items-center gap-3 mb-4 relative z-10">
                       <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                         <CheckCircle2 size={20} />
                       </div>
                       <span className="font-bold text-green-600">{t('demo.after')}</span>
                     </div>

                     <div className="h-[280px] overflow-hidden relative">
                        <div className="scroll-container">
                           {[...DIMENSIONS, ...DIMENSIONS].map((item, i) => (
                             <div key={`good-${i}`} className="p-3 rounded-lg bg-white/60 border border-green-100/50 backdrop-blur-sm mb-3">
                               <div className="text-xs text-green-600 uppercase font-bold mb-1">{t(`demo.${item.label}`)}</div>
                               <div className="text-neutral-900 font-mono text-sm">{t(`demo.${item.good}`)}</div>
                             </div>
                           ))}
                        </div>
                        {/* Gradients for fade effect */}
                        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-green-50 to-transparent z-10 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-50 to-transparent z-10 pointer-events-none" />
                     </div>
                   </div>
                </div>
                
                {/* Arrow Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full border border-neutral-200 flex items-center justify-center z-20 text-neutral-400 shadow-sm">
                  <ArrowRight className="w-5 h-5" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
