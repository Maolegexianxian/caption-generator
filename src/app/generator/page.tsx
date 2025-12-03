/**
 * AI 文案生成器页面
 * @description 完整版本的 AI 文案生成工具页面，支持 URL 参数传递
 * @module app/generator/page
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SITE_CONFIG } from '@/config/constants';
import { GeneratorClient } from './generator-client';
import { Skeleton } from '@/components/ui/skeleton';
import { GENERATOR_PAGE_SEO, GLOBAL_SEO_CONFIG } from '@/config/seo';
import { 
  SoftwareApplicationJsonLd, 
  Breadcrumb, 
  BreadcrumbContainer,
  type BreadcrumbItem
} from '@/components/seo';

/**
 * 页面元数据 - SEO 优化
 * @description 生成器页面完整的 SEO 元数据配置
 */
export const metadata: Metadata = {
  title: GENERATOR_PAGE_SEO.title,
  description: GENERATOR_PAGE_SEO.description,
  keywords: GENERATOR_PAGE_SEO.keywords,
  alternates: {
    canonical: `${SITE_CONFIG.url}/generator`,
  },
  openGraph: {
    title: GENERATOR_PAGE_SEO.openGraph?.title || GENERATOR_PAGE_SEO.title,
    description: GENERATOR_PAGE_SEO.openGraph?.description || GENERATOR_PAGE_SEO.description,
    url: `${SITE_CONFIG.url}/generator`,
    type: 'website',
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: GLOBAL_SEO_CONFIG.defaultOgImage,
        width: GLOBAL_SEO_CONFIG.ogImageWidth,
        height: GLOBAL_SEO_CONFIG.ogImageHeight,
        alt: 'AI Caption Generator Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: GENERATOR_PAGE_SEO.title,
    description: GENERATOR_PAGE_SEO.description,
    images: [GLOBAL_SEO_CONFIG.defaultOgImage],
  },
};

/**
 * 面包屑配置
 */
const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Caption Generator', isCurrent: true },
];

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
 * @returns 生成器页面 JSX
 */
export default function GeneratorPage() {
  return (
    <div className="min-h-screen">
      {/* SEO 结构化数据 */}
      <SoftwareApplicationJsonLd
        name={`${SITE_CONFIG.name} - AI Caption Generator`}
        description={GENERATOR_PAGE_SEO.description}
        applicationCategory="UtilitiesApplication"
        operatingSystem="Web"
        ratingValue="4.8"
        ratingCount="1250"
      />
      
      {/* 面包屑导航 */}
      <BreadcrumbContainer>
        <Breadcrumb items={breadcrumbItems} />
      </BreadcrumbContainer>

      {/* Hero 区域 */}
      <section className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold bg-primary/10 text-primary mb-4">
              ✨ AI-Powered
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              AI Caption Generator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Generate engaging captions for your social media posts. 
              Choose your platform, select a mood, and let AI create the perfect caption for you.
            </p>
          </div>
        </div>
      </section>

      {/* 主内容区域 */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* 使用 Suspense 包装客户端组件 */}
          <Suspense fallback={<PageSkeleton />}>
            <GeneratorClient />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
