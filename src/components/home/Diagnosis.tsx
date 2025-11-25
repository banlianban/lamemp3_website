'use client';

import { useTranslations } from 'next-intl';
import { Card, Button, Progress } from 'antd';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

interface DiagnosisProps {
  score: number;
  onOptimize: () => void;
}

export default function Diagnosis({ score, onOptimize }: DiagnosisProps) {
  const t = useTranslations('Diagnosis');

  const getScoreColor = (s: number) => {
    if (s >= 90) return '#52c41a';
    if (s >= 60) return '#faad14';
    return '#f5222d';
  };

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
               <p className="text-neutral-500">Detailed analysis of your audio file structure.</p>
             </div>

             <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                <h4 className="font-bold text-red-600 mb-3 flex items-center gap-2 text-lg">
                  <XCircle className="w-5 h-5" />
                  Critical Issues Found
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-neutral-700">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {t('issues.vbr')}
                  </li>
                  <li className="flex items-center gap-3 text-neutral-700">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {t('issues.cover')}
                  </li>
                  <li className="flex items-center gap-3 text-neutral-700">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {t('issues.codec')}
                  </li>
                </ul>
             </div>
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-green-700 bg-green-50 px-6 py-3 rounded-xl border border-green-100">
             <CheckCircle2 className="w-5 h-5" />
             <span className="font-medium">Target: 100% Compatibility</span>
          </div>
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
        </div>
      </div>
    </div>
  );
}
