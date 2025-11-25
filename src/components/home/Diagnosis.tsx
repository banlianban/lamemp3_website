'use client';

import { useTranslations } from 'next-intl';
import { Card, Button, Progress } from 'antd';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

interface DiagnosisResult {
  score: number;
  issues: string[];
  details: any;
  needsConversion: boolean;
  riskLevel: string;
}

interface DiagnosisProps {
  score: number;
  onOptimize: () => void;
  diagnosisResult?: DiagnosisResult | null;
}

export default function Diagnosis({ score, onOptimize, diagnosisResult }: DiagnosisProps) {
  const t = useTranslations('Diagnosis');

  const getScoreColor = (s: number) => {
    if (s >= 90) return '#52c41a';
    if (s >= 60) return '#faad14';
    return '#f5222d';
  };

  // 使用真实的诊断数据或默认数据
  const issues = diagnosisResult?.issues || [
    t('issues.vbr'),
    t('issues.cover'),
    t('issues.codec'),
  ];

  const hasIssues = issues.length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 animate-in fade-in zoom-in duration-500">
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-10 text-left">
        <div className="flex flex-col md:flex-row items-center gap-12 mb-12">
          <div className="text-center relative">
            <div className="relative inline-flex items-center justify-center">
               <Progress 
                  type="dashboard" 
                  percent={score} 
                  strokeColor={getScoreColor(score)}
                  trailColor="rgba(0,0,0,0.05)"
                  strokeWidth={8}
                  size={160}
                  format={(percent) => (
                    <div className="flex flex-col items-center">
                      <span className="text-5xl font-bold tracking-tighter" style={{ color: getScoreColor(score) }}>{percent}</span>
                      <span className="text-sm font-medium text-neutral-500 mt-1">{score < 90 ? t('risk') : t('perfect')}</span>
                    </div>
                  )}
               />
            </div>
          </div>

          <div className="flex-1 space-y-6 w-full">
             <div>
               <h3 className="text-2xl font-bold text-neutral-900 mb-2">{t('title')}</h3>
               <p className="text-neutral-500">{t('subtitle')}</p>
             </div>

             {hasIssues ? (
               <div className={`border rounded-xl p-5 ${score >= 90 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                 <h4 className={`font-bold mb-3 flex items-center gap-2 text-lg ${score >= 90 ? 'text-green-600' : 'text-red-600'}`}>
                   {score >= 90 ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                   {score >= 90 ? t('advantagesFound') : t('issuesFound')}
                 </h4>
                 <ul className="space-y-3">
                   {issues.map((issue, index) => (
                     <li key={index} className="flex items-start gap-3 text-neutral-700">
                       <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${score >= 90 ? 'bg-green-500' : 'bg-red-500'}`} />
                       <span>{issue}</span>
                     </li>
                   ))}
                 </ul>
               </div>
             ) : (
               <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                 <h4 className="font-bold text-green-600 mb-3 flex items-center gap-2 text-lg">
                   <CheckCircle2 className="w-5 h-5" />
                   {t('perfectCompatibility')}
                 </h4>
                 <p className="text-neutral-600">{t('perfectCompatibilityDesc')}</p>
               </div>
             )}

             {diagnosisResult?.details && (
               <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
                 <h4 className="font-bold text-neutral-700 mb-3 text-sm">{t('fileDetails')}</h4>
                 <div className="grid grid-cols-2 gap-3 text-xs">
                   <div>
                     <span className="text-neutral-500">{t('format')}:</span>
                     <span className="ml-2 font-medium text-neutral-700">{diagnosisResult.details.format}</span>
                   </div>
                   {diagnosisResult.details.bitrate !== 'Unknown' && (
                     <div>
                       <span className="text-neutral-500">{t('bitrate')}:</span>
                       <span className="ml-2 font-medium text-neutral-700">{diagnosisResult.details.bitrate}</span>
                     </div>
                   )}
                   {diagnosisResult.details.bitrateType !== 'Unknown' && (
                     <div>
                       <span className="text-neutral-500">{t('bitrateType')}:</span>
                       <span className="ml-2 font-medium text-neutral-700">{diagnosisResult.details.bitrateType}</span>
                     </div>
                   )}
                   {diagnosisResult.details.sampleRate !== 'Unknown' && (
                     <div>
                       <span className="text-neutral-500">{t('sampleRate')}:</span>
                       <span className="ml-2 font-medium text-neutral-700">{diagnosisResult.details.sampleRate}</span>
                     </div>
                   )}
                 </div>
               </div>
             )}
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-green-700 bg-green-50 px-6 py-3 rounded-xl border border-green-100">
             <CheckCircle2 className="w-5 h-5" />
             <span className="font-medium">{t('targetCompatibility')}</span>
          </div>
          {score < 100 && (
            <Button 
              type="primary" 
              size="large" 
              onClick={onOptimize}
              className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 rounded-full flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <ShieldCheck className="w-5 h-5" />
              {t('optimizeBtn')}
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
