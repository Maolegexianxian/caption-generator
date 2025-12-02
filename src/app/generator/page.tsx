/**
 * AI 文案生成器页面
 * @description 完整版本的 AI 文案生成工具页面，支持 URL 参数传递
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SITE_CONFIG } from '@/config/constants';
import { GeneratorClient } from './generator-client';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 页面元数据
 */
export const metadata: Metadata = {
  title: 'AI Caption Generator',
  description: `Generate perfect captions for Telegram, Instagram, and X (Twitter) with our AI-powered tool. ${SITE_CONFIG.description}`,
  keywords: [
    'ai caption generator',
    'social media caption generator',
    'instagram caption generator',
    'telegram caption generator',
    'twitter caption generator',
  ],
};

/**
 * 加载骨架屏组件
 */
function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <Skeleton className="h-[600px] w-full rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </div>
  );
}

/**
 * 生成器页面组件
 * @description 提供完整的 AI 文案生成功能，支持 URL 参数
 */
export default function GeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          AI Caption Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Generate engaging captions for your social media posts. 
          Choose your platform, select a mood, and let AI create the perfect caption for you.
        </p>
      </div>

      {/* 主内容区域 - 使用 Suspense 包装客户端组件 */}
      <Suspense fallback={<PageSkeleton />}>
        <GeneratorClient />
      </Suspense>
    </div>
  );
}
