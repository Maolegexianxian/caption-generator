/**
 * 批量生成页面
 * @description 为内容创作者提供批量生成多天文案的功能
 */

import { Metadata } from 'next';
import { BatchGenerator } from '@/components/generator/batch-generator';
import { SITE_CONFIG } from '@/config/constants';

/**
 * 页面元数据
 */
export const metadata: Metadata = {
  title: `Batch Caption Generator - ${SITE_CONFIG.name}`,
  description: 'Generate multiple days of social media captions at once. Plan your content calendar with AI-powered batch caption generation for Instagram, Twitter, and Telegram.',
  keywords: [
    'batch caption generator',
    'content calendar',
    'social media planning',
    'bulk caption generation',
    'instagram captions batch',
  ],
  openGraph: {
    title: `Batch Caption Generator - ${SITE_CONFIG.name}`,
    description: 'Generate multiple days of social media captions at once.',
    type: 'website',
  },
};

/**
 * 批量生成页面组件
 */
export default function BatchPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3">
          Batch Caption Generator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Plan your content calendar by generating multiple days of captions at once.
          Perfect for content creators who want to stay consistent with their posting schedule.
        </p>
      </div>

      {/* 批量生成器 */}
      <BatchGenerator />

      {/* 使用说明 */}
      <div className="mt-12 prose prose-sm dark:prose-invert max-w-none">
        <h2 className="text-xl font-semibold mb-4">How to Use</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg">
            <div className="text-2xl mb-2">1️⃣</div>
            <h3 className="font-medium mb-1">Choose Your Platform</h3>
            <p className="text-sm text-muted-foreground">
              Select Instagram, Twitter/X, or Telegram to optimize captions for your platform.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl mb-2">2️⃣</div>
            <h3 className="font-medium mb-1">Set Your Topic</h3>
            <p className="text-sm text-muted-foreground">
              Enter a theme or topic for your content series (e.g., fitness journey, travel diary).
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl mb-2">3️⃣</div>
            <h3 className="font-medium mb-1">Generate & Export</h3>
            <p className="text-sm text-muted-foreground">
              Generate captions for multiple days and export them as CSV or TXT.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
