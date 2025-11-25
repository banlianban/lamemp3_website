'use client';

import { Badge } from 'antd';
import { XCircle, CheckCircle } from 'lucide-react';

export default function DiagnosticDemo() {
  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-900/50" id="lab">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
            为什么你的歌在车里放不出来？
          </h2>
          <p className="text-lg text-neutral-500 dark:text-neutral-400">
            基于 100 分评分体系，深度分析音频文件兼容性
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 不及格卡片 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 border-t-4 border-t-red-500 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">常见问题</h3>
              <Badge status="error" text={<span className="text-red-500 font-medium">不及格</span>} />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400">
                <XCircle className="shrink-0" size={20} />
                <span className="font-medium">动态码率 VBR (导致卡顿)</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400">
                <XCircle className="shrink-0" size={20} />
                <span className="font-medium">封面图片 &gt; 1MB (读盘慢/死机)</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400">
                <XCircle className="shrink-0" size={20} />
                <span className="font-medium">编码器 Lavc (兼容差)</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400">
                <XCircle className="shrink-0" size={20} />
                <span className="font-medium">ID3 标签乱码 (显示乱码)</span>
              </div>
            </div>
          </div>

          {/* 满分卡片 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 border-t-4 border-t-green-500 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">优化后</h3>
              <Badge status="success" text={<span className="text-green-500 font-medium">满分</span>} />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400">
                <CheckCircle className="shrink-0" size={20} />
                <span className="font-medium">恒定码率 CBR 320k</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400">
                <CheckCircle className="shrink-0" size={20} />
                <span className="font-medium">标准 LAME 编码器</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400">
                <CheckCircle className="shrink-0" size={20} />
                <span className="font-medium">采样率 44.1kHz</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400">
                <CheckCircle className="shrink-0" size={20} />
                <span className="font-medium">纯净 ID3v2 标签</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

