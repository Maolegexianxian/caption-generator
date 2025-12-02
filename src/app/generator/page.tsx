/**
 * AI 文案生成器页面
 * @description 完整版本的 AI 文案生成工具页面
 */

import type { Metadata } from 'next';
import { GeneratorForm } from '@/components/generator/generator-form';
import { GeneratorResults } from '@/components/generator/generator-results';
import { SITE_CONFIG } from '@/config/constants';

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
 * 生成器页面组件
 * @description 提供完整的 AI 文案生成功能
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

      {/* 主内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* 生成器表单 */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <GeneratorForm />
        </div>

        {/* 生成结果 */}
        <div>
          <GeneratorResults />
        </div>
      </div>
    </div>
  );
}
