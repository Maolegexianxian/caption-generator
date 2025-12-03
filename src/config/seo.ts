/**
 * SEO 配置模块
 * @description 集中管理所有 SEO 相关配置，包括元数据、结构化数据、Open Graph 等
 * @module config/seo
 */

import { SITE_CONFIG } from './constants';

// =============== 类型定义 ===============

/**
 * 页面 SEO 配置接口
 * @interface PageSeoConfig
 */
export interface PageSeoConfig {
  /** 页面标题 */
  title: string;
  /** 页面描述 */
  description: string;
  /** 关键词数组 */
  keywords: string[];
  /** 规范链接 URL */
  canonicalUrl?: string;
  /** Open Graph 配置 */
  openGraph?: OpenGraphConfig;
  /** Twitter 卡片配置 */
  twitter?: TwitterCardConfig;
  /** 是否允许搜索引擎索引 */
  noIndex?: boolean;
  /** 是否允许搜索引擎跟踪链接 */
  noFollow?: boolean;
}

/**
 * Open Graph 配置接口
 * @interface OpenGraphConfig
 */
export interface OpenGraphConfig {
  /** OG 标题 */
  title?: string;
  /** OG 描述 */
  description?: string;
  /** OG 图片 URL */
  image?: string;
  /** OG 图片 Alt 文本 */
  imageAlt?: string;
  /** OG 类型 */
  type?: 'website' | 'article';
  /** OG 地区 */
  locale?: string;
}

/**
 * Twitter 卡片配置接口
 * @interface TwitterCardConfig
 */
export interface TwitterCardConfig {
  /** 卡片类型 */
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  /** Twitter 账号 */
  site?: string;
  /** 创建者账号 */
  creator?: string;
}

/**
 * 结构化数据类型
 * @interface StructuredDataConfig
 */
export interface StructuredDataConfig {
  /** 组织信息 */
  organization?: OrganizationSchema;
  /** 网站信息 */
  website?: WebSiteSchema;
  /** 软件应用信息 */
  softwareApplication?: SoftwareApplicationSchema;
  /** FAQ 信息 */
  faqPage?: FAQPageSchema;
  /** 面包屑导航 */
  breadcrumb?: BreadcrumbListSchema;
  /** 文章信息 */
  article?: ArticleSchema;
}

/**
 * 组织 Schema 接口
 */
export interface OrganizationSchema {
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

/**
 * 网站 Schema 接口
 */
export interface WebSiteSchema {
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  potentialAction?: SearchActionSchema;
}

/**
 * 搜索操作 Schema 接口
 */
export interface SearchActionSchema {
  '@type': 'SearchAction';
  target: {
    '@type': 'EntryPoint';
    urlTemplate: string;
  };
  'query-input': string;
}

/**
 * 软件应用 Schema 接口
 */
export interface SoftwareApplicationSchema {
  '@type': 'SoftwareApplication';
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  offers?: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    ratingCount: string;
  };
}

/**
 * FAQ 页面 Schema 接口
 */
export interface FAQPageSchema {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

/**
 * 面包屑导航 Schema 接口
 */
export interface BreadcrumbListSchema {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * 文章 Schema 接口
 */
export interface ArticleSchema {
  '@type': 'Article';
  headline: string;
  description: string;
  author: {
    '@type': 'Organization' | 'Person';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished?: string;
  dateModified?: string;
}

// =============== 全局 SEO 配置 ===============

/**
 * 全局 SEO 配置常量
 * @description 定义网站级别的 SEO 配置
 */
export const GLOBAL_SEO_CONFIG = {
  /** 网站名称 */
  siteName: SITE_CONFIG.name,
  /** 网站 URL */
  siteUrl: SITE_CONFIG.url,
  /** 默认标题模板 */
  titleTemplate: '%s | Caption Generator',
  /** 默认标题后缀 */
  titleSuffix: ' | Caption Generator',
  /** 默认描述 */
  defaultDescription: SITE_CONFIG.description,
  /** 默认 OG 图片 */
  defaultOgImage: `${SITE_CONFIG.url}/og-image.png`,
  /** 默认 OG 图片宽度 */
  ogImageWidth: 1200,
  /** 默认 OG 图片高度 */
  ogImageHeight: 630,
  /** 默认语言 */
  defaultLocale: 'en_US',
  /** 支持的语言列表 */
  supportedLocales: ['en_US', 'zh_CN', 'es_ES', 'pt_BR', 'fr_FR'],
  /** Twitter 账号 */
  twitterHandle: '@captiongenerator',
  /** 验证码配置 */
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
  },
} as const;

// =============== 页面特定 SEO 配置 ===============

/**
 * 首页 SEO 配置
 */
export const HOME_PAGE_SEO: PageSeoConfig = {
  title: `${SITE_CONFIG.name} - AI-Powered Social Media Captions`,
  description: 'Generate perfect captions for Telegram, Instagram, and X (Twitter) with AI. Free caption generator with ready-to-copy captions optimized for each platform.',
  keywords: [
    'caption generator',
    'ai caption generator',
    'instagram captions',
    'telegram captions',
    'twitter captions',
    'x captions',
    'social media captions',
    'tg captions',
    'captions for instagram',
    'free caption generator',
  ],
  openGraph: {
    title: 'Caption Generator - Create Perfect Social Media Captions with AI',
    description: 'Generate engaging captions for Telegram, Instagram, and X (Twitter) in seconds. Free AI-powered caption generator.',
    type: 'website',
  },
};

/**
 * 生成器页面 SEO 配置
 */
export const GENERATOR_PAGE_SEO: PageSeoConfig = {
  title: 'AI Caption Generator - Create Social Media Captions Instantly',
  description: 'Use our advanced AI to generate unique, engaging captions for Instagram, Telegram, and X (Twitter). Customize by mood, category, and platform.',
  keywords: [
    'ai caption generator',
    'caption generator online',
    'instagram caption generator',
    'telegram caption generator',
    'twitter caption generator',
    'free caption maker',
    'social media caption tool',
  ],
  openGraph: {
    title: 'AI Caption Generator - Free Social Media Caption Tool',
    description: 'Generate unlimited captions for any platform. AI-powered, free, and instant.',
    type: 'website',
  },
};

/**
 * Instagram 专题页 SEO 配置
 */
export const INSTAGRAM_PAGE_SEO: PageSeoConfig = {
  title: 'Captions for Instagram - Best Instagram Caption Ideas 2024',
  description: 'Find the perfect captions for Instagram. Browse our collection of Instagram captions for selfies, travel, food, couples, and more. Copy and paste ready!',
  keywords: [
    'captions for instagram',
    'instagram captions',
    'instagram caption ideas',
    'best instagram captions',
    'instagram quotes',
    'ig captions',
    'instagram bio',
    'instagram captions 2024',
    'cute instagram captions',
    'funny instagram captions',
  ],
  openGraph: {
    title: 'Captions for Instagram - 1000+ Best Caption Ideas',
    description: 'Find perfect Instagram captions for selfies, travel, food, couples and more. Free to copy and use!',
    type: 'website',
  },
};

/**
 * Telegram 专题页 SEO 配置
 */
export const TELEGRAM_PAGE_SEO: PageSeoConfig = {
  title: 'TG Captions - Best Telegram Channel & Group Captions 2024',
  description: 'Find the perfect TG captions for your Telegram channels and groups. Browse our collection of Telegram captions for channels, announcements, and posts. Copy and paste ready!',
  keywords: [
    'tg captions',
    'telegram captions',
    'telegram channel captions',
    'telegram group captions',
    'telegram bio',
    'telegram quotes',
    'telegram status',
    'telegram channel description',
    'tg channel captions',
  ],
  openGraph: {
    title: 'TG Captions - Best Telegram Caption Ideas',
    description: 'Find perfect TG captions for your Telegram channels and groups. Free to copy and use!',
    type: 'website',
  },
};

/**
 * X (Twitter) 专题页 SEO 配置
 */
export const X_PAGE_SEO: PageSeoConfig = {
  title: 'X Captions - Best Twitter Captions & Tweet Ideas 2024',
  description: 'Find the perfect captions for X (Twitter). Browse our collection of tweet ideas, thread starters, and viral post templates. All within 280 characters!',
  keywords: [
    'x captions',
    'twitter captions',
    'tweet ideas',
    'twitter quotes',
    'viral tweets',
    'twitter thread',
    'x post ideas',
    'twitter bio ideas',
    'funny tweets',
    'twitter captions 2024',
  ],
  openGraph: {
    title: 'X Captions - Best Twitter Caption Ideas',
    description: 'Find perfect tweets and thread starters. Optimized for 280 characters!',
    type: 'website',
  },
};

/**
 * FAQ 页面 SEO 配置
 */
export const FAQ_PAGE_SEO: PageSeoConfig = {
  title: 'FAQ - Frequently Asked Questions About Caption Generator',
  description: `Frequently asked questions about ${SITE_CONFIG.name}. Learn how to use our AI caption generator, supported platforms, and more.`,
  keywords: [
    'caption generator faq',
    'how to use caption generator',
    'ai caption generator help',
    'caption generator guide',
    'caption generator questions',
  ],
  openGraph: {
    title: 'FAQ - Caption Generator Help',
    description: 'Get answers to common questions about our AI caption generator.',
    type: 'website',
  },
};

/**
 * 隐私政策页面 SEO 配置
 */
export const PRIVACY_PAGE_SEO: PageSeoConfig = {
  title: 'Privacy Policy - Caption Generator',
  description: `Privacy Policy for ${SITE_CONFIG.name}. Learn how we collect, use, and protect your data.`,
  keywords: [
    'privacy policy',
    'data protection',
    'caption generator privacy',
  ],
  noIndex: false,
};

/**
 * 服务条款页面 SEO 配置
 */
export const TERMS_PAGE_SEO: PageSeoConfig = {
  title: 'Terms of Service - Caption Generator',
  description: `Terms of Service for ${SITE_CONFIG.name}. Read our terms and conditions for using the service.`,
  keywords: [
    'terms of service',
    'terms and conditions',
    'caption generator terms',
  ],
  noIndex: false,
};

// =============== 结构化数据模板 ===============

/**
 * 生成组织结构化数据
 * @returns Organization JSON-LD schema
 */
export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description,
    sameAs: [
      // 添加社交媒体链接
      // 'https://twitter.com/captiongenerator',
      // 'https://instagram.com/captiongenerator',
    ],
  };
}

/**
 * 生成网站结构化数据
 * @returns WebSite JSON-LD schema
 */
export function generateWebSiteSchema(): WebSiteSchema {
  return {
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * 生成软件应用结构化数据
 * @returns SoftwareApplication JSON-LD schema
 */
export function generateSoftwareApplicationSchema(): SoftwareApplicationSchema {
  return {
    '@type': 'SoftwareApplication',
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
    },
  };
}

/**
 * 生成面包屑结构化数据
 * @param items - 面包屑项目数组
 * @returns BreadcrumbList JSON-LD schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
): BreadcrumbListSchema {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

/**
 * 生成 FAQ 结构化数据
 * @param faqs - FAQ 问答数组
 * @returns FAQPage JSON-LD schema
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): FAQPageSchema {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * 生成文章结构化数据
 * @param article - 文章信息
 * @returns Article JSON-LD schema
 */
export function generateArticleSchema(article: {
  headline: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
}): ArticleSchema {
  return {
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    ...(article.datePublished && { datePublished: article.datePublished }),
    ...(article.dateModified && { dateModified: article.dateModified }),
  };
}

// =============== 分类页面 SEO 工具 ===============

/**
 * 生成分类页面 SEO 配置
 * @param categoryName - 分类显示名称
 * @param categorySlug - 分类 URL slug
 * @param platform - 平台名称
 * @returns 分类页面 SEO 配置
 */
export function generateCategoryPageSeo(
  categoryName: string,
  categorySlug: string,
  platform: 'instagram' | 'telegram' | 'x' = 'instagram'
): PageSeoConfig {
  const platformNames = {
    instagram: 'Instagram',
    telegram: 'Telegram',
    x: 'X (Twitter)',
  };

  const platformDisplay = platformNames[platform];
  const lowerCategoryName = categoryName.toLowerCase();

  return {
    title: `${categoryName} Captions for ${platformDisplay} - Best ${categoryName} Caption Ideas`,
    description: `Find the perfect ${lowerCategoryName} captions for ${platformDisplay}. Browse our curated collection of ${lowerCategoryName} captions with hashtags. Copy and paste ready!`,
    keywords: [
      `${lowerCategoryName} captions for ${platform}`,
      `${platform} ${lowerCategoryName} captions`,
      `${lowerCategoryName} ${platform} quotes`,
      `best ${lowerCategoryName} captions`,
      `${lowerCategoryName} hashtags`,
      `${lowerCategoryName} captions 2024`,
    ],
    openGraph: {
      title: `${categoryName} Captions for ${platformDisplay}`,
      description: `Browse ${lowerCategoryName} captions optimized for ${platformDisplay}. Free to copy and use!`,
      type: 'website',
    },
  };
}

/**
 * 生成情绪/风格页面 SEO 配置
 * @param moodName - 情绪/风格显示名称
 * @param moodSlug - 情绪/风格 URL slug
 * @param platform - 平台名称
 * @returns 情绪页面 SEO 配置
 */
export function generateMoodPageSeo(
  moodName: string,
  moodSlug: string,
  platform: 'instagram' | 'telegram' | 'x' = 'instagram'
): PageSeoConfig {
  const platformNames = {
    instagram: 'Instagram',
    telegram: 'Telegram',
    x: 'X (Twitter)',
  };

  const platformDisplay = platformNames[platform];
  const lowerMoodName = moodName.toLowerCase();

  return {
    title: `${moodName} Captions for ${platformDisplay} - ${moodName} Caption Ideas`,
    description: `Find ${lowerMoodName} captions for ${platformDisplay}. Browse our collection of ${lowerMoodName} and ${lowerMoodName} captions with the perfect vibe. Copy and paste ready!`,
    keywords: [
      `${lowerMoodName} captions for ${platform}`,
      `${platform} ${lowerMoodName} captions`,
      `${lowerMoodName} quotes`,
      `${lowerMoodName} ${platform} captions`,
      `${lowerMoodName} captions 2024`,
    ],
    openGraph: {
      title: `${moodName} Captions for ${platformDisplay}`,
      description: `Browse ${lowerMoodName} captions for ${platformDisplay}. Free to copy and use!`,
      type: 'website',
    },
  };
}
