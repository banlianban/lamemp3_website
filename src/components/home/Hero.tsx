'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileMusic, Loader2, CheckCircle, Download, Disc } from 'lucide-react';
import { Button, Upload as AntUpload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import Diagnosis from './Diagnosis';
import {
  trackFileSelectClick,
  trackFileSelectResult,
  trackFileScoreResult,
  trackConvertStart,
  trackConvertResult,
} from '@/lib/analytics';
import { clientLogger } from '@/lib/logger';

const { Dragger } = AntUpload;

interface DiagnosisResult {
  score: number;
  issues: string[];
  details: any;
  needsConversion: boolean;
  riskLevel: string;
}

export default function Hero() {
  const t = useTranslations('Hero');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'diagnosing' | 'diagnosed' | 'converting' | 'completed'>('idle');
  const [score, setScore] = useState(0);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const [convertedFileName, setConvertedFileName] = useState<string>('');

  const handleUpload = (info: any) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      setFile(info.file.originFileObj);
    }
    if (status === 'done') {
      // 埋点：选择文件结果 - 成功
      trackFileSelectResult('success');
      startDiagnosis(info.file.originFileObj);
    } else if (status === 'error') {
      // 埋点：选择文件结果 - 失败
      trackFileSelectResult('error', info.file.error?.message || '文件选择失败');
    }
  };

  const customRequest = ({ file, onSuccess, onError }: any) => {
    // 直接标记为成功，实际上传在诊断时进行
    setTimeout(() => {
      onSuccess("ok");
    }, 100);
  };

  const startDiagnosis = async (uploadedFile: File) => {
    setStatus('diagnosing');
    
    try {
      const formData = new FormData();
      formData.append('audio_file', uploadedFile);

      const response = await fetch('/api/diagnose', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(t('dropzone.errors.diagnosisError'));
      }

      const result: DiagnosisResult = await response.json();
      setScore(result.score);
      setDiagnosisResult(result);
      setStatus('diagnosed');
      
      // 埋点：评分文件结果 - 成功
      trackFileScoreResult(result.score, 'success');
      
      clientLogger.log('诊断结果:', result);
    } catch (error: any) {
      clientLogger.error('诊断错误:', error);
      // 埋点：评分文件结果 - 失败
      trackFileScoreResult(0, 'error', error?.message || '诊断失败');
      message.error(t('dropzone.errors.diagnosisFailed'));
      setStatus('idle');
    }
  };

  const handleOptimize = async () => {
    if (!file) {
      message.error(t('dropzone.errors.uploadFirst'));
      return;
    }

    // 埋点：点击开始转换
    trackConvertStart();

    setStatus('converting');
    
    try {
      const formData = new FormData();
      formData.append('audio_file', file);
      formData.append('mode', 'cbr');
      formData.append('bitrate', '128');
      formData.append('force_convert', 'on'); // 强制重新编码以确保兼容性

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: t('dropzone.errors.convertError') }));
        throw new Error(errorData.error || t('dropzone.errors.convertError'));
      }

      // 获取文件 blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // 从响应头获取文件名或使用默认名称
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = `${file.name.replace(/\.[^/.]+$/, '')}_converted.mp3`;
      
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          fileName = decodeURIComponent(matches[1].replace(/['"]/g, ''));
        }
      }

      setConvertedFileUrl(url);
      setConvertedFileName(fileName);
      setScore(100);
      setStatus('completed');
      
      // 埋点：文件转换结果 - 成功
      trackConvertResult('success');
      
      message.success(t('dropzone.success.optimizeComplete'));
    } catch (error: any) {
      clientLogger.error('转换错误:', error);
      // 埋点：文件转换结果 - 失败
      trackConvertResult('error', error?.message || '转换失败');
      message.error(error.message || t('dropzone.errors.convertFailed'));
      setStatus('diagnosed');
    }
  };

  const handleDownload = () => {
    if (convertedFileUrl && convertedFileName) {
      const link = document.createElement('a');
      link.href = convertedFileUrl;
      link.download = convertedFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success(t('dropzone.errors.downloadStarted'));
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setFile(null);
    setScore(0);
    setDiagnosisResult(null);
    
    // 清理 blob URL
    if (convertedFileUrl) {
      URL.revokeObjectURL(convertedFileUrl);
      setConvertedFileUrl(null);
    }
    setConvertedFileName('');
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
                beforeUpload={() => {
                  // 埋点：点击选择文件
                  trackFileSelectClick();
                  return true;
                }}
              >
                <div className="p-8 rounded-3xl bg-slate-50 border-2 border-dashed border-neutral-200 group-hover:border-blue-500 transition-all duration-300 relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-2xl font-semibold text-neutral-900 mb-3">
                      {t('dropzone.main')}
                    </p>
                    <p className="text-base text-neutral-500 mb-8">
                      {t('dropzone.sub')}
                    </p>
                    <Button 
                      type="primary" 
                      size="large" 
                      className="h-14 px-10 text-lg font-medium bg-neutral-900 text-white hover:bg-neutral-800 border-0 rounded-full transition-all"
                      onClick={() => {
                        // 埋点：点击选择文件（按钮点击）
                        trackFileSelectClick();
                      }}
                    >
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
               <p className="text-neutral-500">{t('dropzone.diagnosingDesc')}</p>
             </div>
          )}

          {status === 'diagnosed' && (
            <Diagnosis score={score} onOptimize={handleOptimize} onReset={handleReset} diagnosisResult={diagnosisResult} />
          )}

          {status === 'converting' && (
             <div className="max-w-xl mx-auto bg-white p-12 rounded-3xl border border-neutral-200">
               <div className="mb-8 relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 rounded-full border-t-4 border-blue-600 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-r-4 border-purple-600 animate-spin-reverse" />
                  <FileMusic className="w-10 h-10 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
               </div>
               <h3 className="text-2xl font-bold text-neutral-900 animate-pulse">{t('dropzone.converting')}</h3>
               <p className="text-neutral-500 mt-2">{t('dropzone.convertingDesc')}</p>
             </div>
          )}

          {status === 'completed' && (
            <div className="max-w-2xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="bg-white rounded-3xl border border-green-100 p-12">
                 <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                   <CheckCircle className="w-12 h-12 text-green-600" />
                 </div>
                 <h3 className="text-3xl font-bold text-neutral-900 mb-4">{t('dropzone.completed.title')}</h3>
                 <p className="text-neutral-500 text-lg mb-10">{t('dropzone.completed.desc')}</p>
                 <Button 
                   type="primary" 
                   size="large" 
                   icon={<Download className="w-5 h-5" />}
                   onClick={handleDownload}
                   className="h-16 px-12 text-lg font-bold bg-green-600 hover:bg-green-500 border-0 rounded-full"
                 >
                   {t('dropzone.completed.download')}
                 </Button>
               </div>
               <Button type="text" onClick={handleReset} className="mt-6 text-neutral-500 hover:text-neutral-900">
                 {t('dropzone.completed.another')}
               </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
