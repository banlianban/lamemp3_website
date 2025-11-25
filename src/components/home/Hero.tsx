'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileMusic, Loader2, CheckCircle, Download, Disc } from 'lucide-react';
import { Button, Upload as AntUpload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import Diagnosis from './Diagnosis';

const { Dragger } = AntUpload;

export default function Hero() {
  const t = useTranslations('Hero');
  const [file, setFile] = useState<UploadFile | null>(null);
  const [status, setStatus] = useState<'idle' | 'diagnosing' | 'diagnosed' | 'converting' | 'completed'>('idle');
  const [score, setScore] = useState(0);

  const handleUpload = (info: any) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      setFile(info.file);
    }
    if (status === 'done') {
      startDiagnosis();
    }
  };

  const customRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };

  const startDiagnosis = () => {
    setStatus('diagnosing');
    setTimeout(() => {
      setScore(45);
      setStatus('diagnosed');
    }, 2000);
  };

  const handleOptimize = () => {
    setStatus('converting');
    setTimeout(() => {
      setScore(100);
      setStatus('completed');
      message.success('Optimization complete!');
    }, 3000);
  };

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    customRequest: customRequest,
    onChange: handleUpload,
    accept: '.mp3,.flac,.wav,.ape,.m4a,.aac',
  };

  return (
    <section id="converter" className="relative pt-32 pb-6 overflow-hidden min-h-[65vh] flex flex-col justify-center bg-white">
      {/* Clean White Background with subtle diffuse gradients */}
      <div className="absolute inset-0 bg-white">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-100 blur-[120px]" />
         </div>
      </div>

      <div className="container relative mx-auto px-4 text-center max-w-5xl z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 text-sm text-neutral-600 mb-6">
           <Disc className="w-4 h-4 text-blue-600" />
           <span>{t('tagline')}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-neutral-900">
           {t('title')}
        </h1>
        <p className="text-lg md:text-xl text-neutral-500 mb-12 max-w-3xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>

        <div className="transition-all duration-500 transform pb-12">
          {status === 'idle' && (
            <div className="max-w-3xl mx-auto">
              <Dragger 
                {...props} 
                className="!border-0 !bg-transparent !p-0 [&>.ant-upload-drag]:!border-0 [&>.ant-upload-drag]:!bg-transparent group"
                style={{ border: 'none', background: 'none' }}
              >
                <div className="p-8 rounded-3xl bg-slate-50 border-2 border-dashed border-neutral-200 group-hover:border-blue-500 transition-all duration-300 relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-2xl font-semibold text-neutral-900 mb-3">
                      {t('dropzone.main')}
                    </p>
                    <p className="text-base text-neutral-500 mb-8">
                      {t('dropzone.sub')}
                    </p>
                    <Button type="primary" size="large" className="h-14 px-10 text-lg font-medium bg-neutral-900 text-white hover:bg-neutral-800 border-0 rounded-full transition-all">
                      {t('dropzone.button')}
                    </Button>
                    <p className="mt-6 text-xs text-neutral-400 uppercase tracking-widest">
                      {t('dropzone.privacy')}
                    </p>
                  </div>
                </div>
              </Dragger>
            </div>
          )}

          {status === 'diagnosing' && (
             <div className="max-w-xl mx-auto bg-white p-12 rounded-3xl border border-neutral-200">
               <div className="relative w-20 h-20 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-ping" />
                  <Loader2 className="w-20 h-20 text-blue-600 animate-spin relative z-10" />
               </div>
               <h3 className="text-2xl font-bold text-neutral-900 mb-2">{t('dropzone.diagnosing')}</h3>
               <p className="text-neutral-500">Analyzing codec, bitrate, and metadata...</p>
             </div>
          )}

          {status === 'diagnosed' && (
            <Diagnosis score={score} onOptimize={handleOptimize} />
          )}

          {status === 'converting' && (
             <div className="max-w-xl mx-auto bg-white p-12 rounded-3xl border border-neutral-200">
               <div className="mb-8 relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 rounded-full border-t-4 border-blue-600 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-r-4 border-purple-600 animate-spin-reverse" />
                  <FileMusic className="w-10 h-10 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
               </div>
               <h3 className="text-2xl font-bold text-neutral-900 animate-pulse">{t('dropzone.converting')}</h3>
               <p className="text-neutral-500 mt-2">Re-encoding with LAME 3.100...</p>
             </div>
          )}

          {status === 'completed' && (
            <div className="max-w-2xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="bg-white rounded-3xl border border-green-100 p-12">
                 <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                   <CheckCircle className="w-12 h-12 text-green-600" />
                 </div>
                 <h3 className="text-3xl font-bold text-neutral-900 mb-4">Optimization Successful!</h3>
                 <p className="text-neutral-500 text-lg mb-10">Your file is now 100% compatible with car stereos.</p>
                 <Button 
                   type="primary" 
                   size="large" 
                   icon={<Download className="w-5 h-5" />}
                   className="h-16 px-12 text-lg font-bold bg-green-600 hover:bg-green-500 border-0 rounded-full"
                 >
                   Download MP3
                 </Button>
               </div>
               <Button type="text" onClick={() => { setStatus('idle'); setFile(null); }} className="mt-6 text-neutral-500 hover:text-neutral-900">
                 Process another file
               </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
