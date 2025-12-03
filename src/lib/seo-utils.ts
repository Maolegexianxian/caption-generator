/**
 * SEO 工具函数模块
 * @description 提供 SEO 相关的工具函数，包括元数据生成、结构化数据处理等
 * @module lib/seo-utils
 */

import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/constants';
import {
  PageSeoConfig,
  GLOBAL_SEO_CONFIG,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  BreadcrumbListSchema,
} from '@/config/seo';

// =============== 类型定义 ===============

/**
 * 面包屑项目接口
 * @interface BreadcrumbItem
 */
export interface BreadcrumbItem {
  /** 显示名称 */
  name: string;
  /** 链接 URL（最后一项不需要） */
  url?: string;
}

/**
 * 元数据生成选项接口
 * @interface MetadataOptions
 */
export interface MetadataOptions {
  /** 页面标题 */
  title: string;
  /** 页面描述 */
  description: string;
  /** 关键词数组 */
  keywords?: string[];
  /** 规范链接路径（相对路径） */
  canonicalPath?: string;
  /** Open Graph 图片路径 */
  ogImage?: string;
  /** 是否不允许索引 */
  noIndex?: boolean;
  /** 是否不允许跟踪链接 */
  noFollow?: boolean;
  /** Open Graph 类型 */
  ogType?: 'website' | 'article';
  /** 文章发布日期 */
  publishedTime?: string;
  /** 文章修改日期 */
  modifiedTime?: string;
  /** 备用语言版本 */
  alternates?: Record<string, string>;
}

// =============== 元数据生成函数 ===============

/**
 * 生成页面元数据
 * @description 根据提供的选项生成符合 Next.js Metadata 规范的元数据对象
 * @param options - 元数据选项
 * @returns Next.js Metadata 对象
 */
export function generateMetadata(options: MetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonicalPath,
    ogImage,
    noIndex = false,
    noFollow = false,
    ogType = 'website',
    publishedTime,
    modifiedTime,
    alternates,
  } = options;

  /** 完整的规范链接 URL */
  const canonicalUrl = canonicalPath
    ? `${SITE_CONFIG.url}${canonicalPath}`
    : undefined;

  /** OG 图片完整 URL */
  const ogImageUrl = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : `${SITE_CONFIG.url}${ogImage}`
    : GLOBAL_SEO_CONFIG.defaultOgImage;

  /** 构建元数据对象 */
  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    openGraph: {
      type: ogType,
      locale: GLOBAL_SEO_CONFIG.defaultLocale,
      url: canonicalUrl || SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: GLOBAL_SEO_CONFIG.ogImageWidth,
          height: GLOBAL_SEO_CONFIG.ogImageHeight,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: GLOBAL_SEO_CONFIG.twitterHandle,
      site: GLOBAL_SEO_CONFIG.twitterHandle,
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: GLOBAL_SEO_CONFIG.verification.google || undefined,
      yandex: GLOBAL_SEO_CONFIG.verification.yandex || undefined,
      other: GLOBAL_SEO_CONFIG.verification.bing
        ? { 'msvalidate.01': GLOBAL_SEO_CONFIG.verification.bing }
        : undefined,
    },
  };

  return metadata;
}

/**
 * 从 PageSeoConfig 生成元数据
 * @description 将 PageSeoConfig 转换为 Next.js Metadata
 * @param config - 页面 SEO 配置
 * @param canonicalPath - 规范链接路径
 * @returns Next.js Metadata 对象
 */
export function generateMetadataFromConfig(
  config: PageSeoConfig,
  canonicalPath?: string
): Metadata {
  return generateMetadata({
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    canonicalPath,
    ogImage: config.openGraph?.image,
    noIndex: config.noIndex,
    noFollow: config.noFollow,
    ogType: config.openGraph?.type,
  });
}

// =============== 结构化数据生成函数 ===============

/**
 * 生成首页结构化数据
 * @description 生成首页所需的所有结构化数据（Organization, WebSite, SoftwareApplication）
 * @returns JSON-LD 字符串
 */
export function generateHomePageStructuredData(): string {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...generateOrganizationSchema(),
        '@id': `${SITE_CONFIG.url}/#organization`,
      },
      {
        ...generateWebSiteSchema(),
        '@id': `${SITE_CONFIG.url}/#website`,
        publisher: { '@id': `${SITE_CONFIG.url}/#organization` },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_CONFIG.url}/#application`,
        name: SITE_CONFIG.name,
        description: SITE_CONFIG.description,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '1250',
          bestRating: '5',
          worstRating: '1',
        },
        author: { '@id': `${SITE_CONFIG.url}/#organization` },
      },
    ],
  };

  return JSON.stringify(structuredData);
}

/**
 * 生成页面结构化数据（带面包屑）
 * @description 生成通用页面的结构化数据，包括面包屑导航
 * @param breadcrumbs - 面包屑项目数组
 * @param pageTitle - 页面标题
 * @param pageDescription - 页面描述
 * @returns JSON-LD 字符串
 */
export function generatePageStructuredData(
  breadcrumbs: BreadcrumbItem[],
  pageTitle: string,
  pageDescription: string
): string {
  /** 生成面包屑 Schema */
  const breadcrumbSchema = generateBreadcrumbSchema(
    breadcrumbs.map((item) => ({
      name: item.name,
      url: item.url ? `${SITE_CONFIG.url}${item.url}` : undefined,
    }))
  );

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_CONFIG.url}/#webpage`,
        name: pageTitle,
        description: pageDescription,
        isPartOf: { '@id': `${SITE_CONFIG.url}/#website` },
        breadcrumb: { '@id': `${SITE_CONFIG.url}/#breadcrumb` },
      },
      {
        ...breadcrumbSchema,
        '@id': `${SITE_CONFIG.url}/#breadcrumb`,
      },
    ],
  };

  return JSON.stringify(structuredData);
}

/**
 * 生成专题页面结构化数据
 * @description 生成平台专题页面的结构化数据
 * @param platform - 平台名称
 * @param title - 页面标题
 * @param description - 页面描述
 * @param breadcrumbs - 面包屑项目数组
 * @returns JSON-LD 字符串
 */
export function generatePlatformPageStructuredData(
  platform: 'instagram' | 'telegram' | 'x',
  title: string,
  description: string,
  breadcrumbs: BreadcrumbItem[]
): string {
  const platformSlug = {
    instagram: 'captions-for-instagram',
    telegram: 'tg-captions',
    x: 'x-captions',
  }[platform];

  /** 生成面包屑 Schema */
  const breadcrumbSchema = generateBreadcrumbSchema(
    breadcrumbs.map((item) => ({
      name: item.name,
      url: item.url ? `${SITE_CONFIG.url}${item.url}` : undefined,
    }))
  );

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_CONFIG.url}/${platformSlug}/#webpage`,
        name: title,
        description,
        url: `${SITE_CONFIG.url}/${platformSlug}`,
        isPartOf: { '@id': `${SITE_CONFIG.url}/#website` },
        breadcrumb: { '@id': `${SITE_CONFIG.url}/${platformSlug}/#breadcrumb` },
        about: {
          '@type': 'Thing',
          name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Captions`,
        },
      },
      {
        ...breadcrumbSchema,
        '@id': `${SITE_CONFIG.url}/${platformSlug}/#breadcrumb`,
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_CONFIG.url}/${platformSlug}/#itemlist`,
        name: `${title} Collection`,
        description: `A collection of ${platform} captions`,
        numberOfItems: 50,
        itemListOrder: 'https://schema.org/ItemListUnordered',
      },
    ],
  };

  return JSON.stringify(structuredData);
}

/**
 * 生成分类页面结构化数据
 * @description 生成分类详情页面的结构化数据
 * @param categoryName - 分类名称
 * @param categorySlug - 分类 slug
 * @param platform - 平台名称
 * @param breadcrumbs - 面包屑项目数组
 * @param captionCount - 文案数量
 * @returns JSON-LD 字符串
 */
export function generateCategoryPageStructuredData(
  categoryName: string,
  categorySlug: string,
  platform: 'instagram' | 'telegram' | 'x',
  breadcrumbs: BreadcrumbItem[],
  captionCount: number = 50
): string {
  const platformSlug = {
    instagram: 'captions-for-instagram',
    telegram: 'tg-captions',
    x: 'x-captions',
  }[platform];

  const pageUrl = `${SITE_CONFIG.url}/${platformSlug}/${categorySlug}`;

  /** 生成面包屑 Schema */
  const breadcrumbSchema = generateBreadcrumbSchema(
    breadcrumbs.map((item) => ({
      name: item.name,
      url: item.url ? `${SITE_CONFIG.url}${item.url}` : undefined,
    }))
  );

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}/#webpage`,
        name: `${categoryName} Captions`,
        description: `Best ${categoryName.toLowerCase()} captions for ${platform}`,
        url: pageUrl,
        isPartOf: { '@id': `${SITE_CONFIG.url}/${platformSlug}/#webpage` },
        breadcrumb: { '@id': `${pageUrl}/#breadcrumb` },
      },
      {
        ...breadcrumbSchema,
        '@id': `${pageUrl}/#breadcrumb`,
      },
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}/#itemlist`,
        name: `${categoryName} Caption Collection`,
        description: `A curated collection of ${categoryName.toLowerCase()} captions for ${platform}`,
        numberOfItems: captionCount,
        itemListOrder: 'https://schema.org/ItemListUnordered',
      },
      {
        '@type': 'HowTo',
        '@id': `${pageUrl}/#howto`,
        name: `How to Write ${categoryName} Captions`,
        description: `Learn how to write engaging ${categoryName.toLowerCase()} captions for ${platform}`,
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Choose Your Mood',
            text: 'Select the mood or tone that matches your content',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Browse Captions',
            text: `Browse our collection of ${categoryName.toLowerCase()} captions`,
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Copy and Customize',
            text: 'Copy the caption you like and customize it to fit your style',
          },
        ],
      },
    ],
  };

  return JSON.stringify(structuredData);
}

// =============== URL 工具函数 ===============

/**
 * 生成规范链接 URL
 * @description 根据路径生成完整的规范链接 URL
 * @param path - 相对路径
 * @returns 完整的规范链接 URL
 */
export function generateCanonicalUrl(path: string): string {
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // 移除尾部斜杠（除了根路径）
  const cleanPath = normalizedPath === '/' ? '' : normalizedPath.replace(/\/$/, '');
  return `${SITE_CONFIG.url}${cleanPath}`;
}

/**
 * 生成多语言替代链接
 * @description 根据路径生成不同语言版本的链接
 * @param path - 相对路径
 * @param locales - 语言代码数组
 * @returns 语言到 URL 的映射对象
 */
export function generateAlternateLanguages(
  path: string,
  locales: string[] = ['en', 'zh', 'es', 'pt', 'fr']
): Record<string, string> {
  const alternates: Record<string, string> = {};
  
  for (const locale of locales) {
    if (locale === 'en') {
      // 英文版本使用默认路径
      alternates[locale] = generateCanonicalUrl(path);
    } else {
      // 其他语言版本添加语言前缀
      alternates[locale] = generateCanonicalUrl(`/${locale}${path}`);
    }
  }

  // 添加 x-default
  alternates['x-default'] = generateCanonicalUrl(path);

  return alternates;
}

// =============== 文本工具函数 ===============

/**
 * 截断文本用于 meta description
 * @description 将文本截断到指定长度，确保在单词边界处截断
 * @param text - 原始文本
 * @param maxLength - 最大长度（默认 160）
 * @returns 截断后的文本
 */
export function truncateForMetaDescription(
  text: string,
  maxLength: number = 160
): string {
  if (text.length <= maxLength) {
    return text;
  }

  // 在单词边界处截断
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated.substring(0, maxLength - 3) + '...';
}

/**
 * 生成 SEO 友好的 slug
 * @description 将文本转换为 URL 友好的 slug
 * @param text - 原始文本
 * @returns URL 友好的 slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-') // 空格转换为连字符
    .replace(/-+/g, '-') // 合并多个连字符
    .replace(/^-|-$/g, ''); // 移除首尾连字符
}

/**
 * 合并关键词并去重
 * @description 合并多个关键词数组并去除重复项
 * @param keywordArrays - 关键词数组的数组
 * @returns 去重后的关键词数组
 */
export function mergeKeywords(...keywordArrays: string[][]): string[] {
  const merged = keywordArrays.flat();
  return [...new Set(merged.map((k) => k.toLowerCase()))];
}
