/**
 * 网站地图生成
 * @description 自动生成 sitemap.xml 用于 SEO 优化，包含所有页面的 URL 配置
 * @module app/sitemap
 */

import { MetadataRoute } from 'next';
import { CATEGORIES_CONFIG, MOODS_CONFIG, SITE_CONFIG } from '@/config/constants';

// =============== 分类配置 ===============

/**
 * Telegram 分类配置
 * @description Telegram 平台特定的内容类型分类
 */
const TG_CATEGORIES = [
  'channel',
  'group', 
  'bot',
  'status',
  'announcement',
  'promo',
] as const;

/**
 * X (Twitter) 分类配置
 * @description X 平台特定的内容类型和话题分类
 */
const X_CATEGORIES = [
  // 内容类型
  'post',
  'thread',
  'quote',
  'reply',
  // 话题分类
  'tech',
  'crypto',
  'ai',
  'startup',
  'life',
  'humor',
  'motivation',
  'opinion',
] as const;

// =============== 工具函数 ===============

/**
 * 生成页面 URL 配置
 * @param url - 页面 URL
 * @param options - 配置选项
 * @returns 网站地图条目
 */
function createSitemapEntry(
  url: string,
  options: {
    lastModified?: Date;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
  } = {}
): MetadataRoute.Sitemap[0] {
  const { lastModified = new Date(), changeFrequency = 'weekly', priority = 0.7 } = options;
  
  return {
    url,
    lastModified,
    changeFrequency,
    priority,
  };
}

// =============== 网站地图生成 ===============

/**
 * 生成网站地图
 * @description 返回所有页面的 URL 配置，供搜索引擎抓取
 * @returns 网站地图配置数组
 */
export default function sitemap(): MetadataRoute.Sitemap {
  /** 基础 URL */
  const baseUrl = SITE_CONFIG.url;

  /** 当前日期 */
  const now = new Date();

  // =============== 静态页面 ===============

  /** 核心静态页面配置 */
  const staticPages: MetadataRoute.Sitemap = [
    // 首页 - 最高优先级
    createSitemapEntry(baseUrl, { 
      lastModified: now, 
      changeFrequency: 'daily', 
      priority: 1.0 
    }),
    
    // 生成器页面 - 核心工具
    createSitemapEntry(`${baseUrl}/generator`, { 
      lastModified: now, 
      changeFrequency: 'weekly', 
      priority: 0.95 
    }),
    
    // 平台专题页面 - 高优先级
    createSitemapEntry(`${baseUrl}/captions-for-instagram`, { 
      lastModified: now, 
      changeFrequency: 'daily', 
      priority: 0.9 
    }),
    createSitemapEntry(`${baseUrl}/tg-captions`, { 
      lastModified: now, 
      changeFrequency: 'daily', 
      priority: 0.9 
    }),
    createSitemapEntry(`${baseUrl}/x-captions`, { 
      lastModified: now, 
      changeFrequency: 'daily', 
      priority: 0.9 
    }),
    
    // 辅助页面 - 较低优先级
    createSitemapEntry(`${baseUrl}/faq`, { 
      lastModified: now, 
      changeFrequency: 'monthly', 
      priority: 0.5 
    }),
    createSitemapEntry(`${baseUrl}/privacy`, { 
      lastModified: now, 
      changeFrequency: 'yearly', 
      priority: 0.2 
    }),
    createSitemapEntry(`${baseUrl}/terms`, { 
      lastModified: now, 
      changeFrequency: 'yearly', 
      priority: 0.2 
    }),
  ];

  // =============== Instagram 分类页面 ===============

  /** Instagram 内容分类页面 */
  const instagramCategoryPages: MetadataRoute.Sitemap = CATEGORIES_CONFIG.map(
    (category) => createSitemapEntry(
      `${baseUrl}/captions-for-instagram/${category.slug}`,
      { lastModified: now, changeFrequency: 'weekly', priority: 0.8 }
    )
  );

  /** Instagram 情绪/风格分类页面 */
  const instagramMoodPages: MetadataRoute.Sitemap = MOODS_CONFIG.map(
    (mood) => createSitemapEntry(
      `${baseUrl}/captions-for-instagram?mood=${mood.slug}`,
      { lastModified: now, changeFrequency: 'weekly', priority: 0.7 }
    )
  );

  // =============== Telegram 分类页面 ===============

  /** Telegram 分类页面 */
  const telegramCategoryPages: MetadataRoute.Sitemap = TG_CATEGORIES.map(
    (category) => createSitemapEntry(
      `${baseUrl}/tg-captions/${category}`,
      { lastModified: now, changeFrequency: 'weekly', priority: 0.8 }
    )
  );

  /** Telegram 情绪/风格分类页面 */
  const telegramMoodPages: MetadataRoute.Sitemap = MOODS_CONFIG.map(
    (mood) => createSitemapEntry(
      `${baseUrl}/generator?platform=telegram&mood=${mood.id}`,
      { lastModified: now, changeFrequency: 'weekly', priority: 0.6 }
    )
  );

  // =============== X (Twitter) 分类页面 ===============

  /** X 分类页面 */
  const xCategoryPages: MetadataRoute.Sitemap = X_CATEGORIES.map(
    (category) => createSitemapEntry(
      `${baseUrl}/x-captions/${category}`,
      { lastModified: now, changeFrequency: 'weekly', priority: 0.8 }
    )
  );

  /** X 情绪/风格分类页面 */
  const xMoodPages: MetadataRoute.Sitemap = MOODS_CONFIG.map(
    (mood) => createSitemapEntry(
      `${baseUrl}/generator?platform=x&mood=${mood.id}`,
      { lastModified: now, changeFrequency: 'weekly', priority: 0.6 }
    )
  );

  // =============== 生成器预设页面 ===============

  /** 生成器平台预设页面 */
  const generatorPresetPages: MetadataRoute.Sitemap = [
    createSitemapEntry(`${baseUrl}/generator?platform=instagram`, { 
      lastModified: now, 
      changeFrequency: 'weekly', 
      priority: 0.7 
    }),
    createSitemapEntry(`${baseUrl}/generator?platform=telegram`, { 
      lastModified: now, 
      changeFrequency: 'weekly', 
      priority: 0.7 
    }),
    createSitemapEntry(`${baseUrl}/generator?platform=x`, { 
      lastModified: now, 
      changeFrequency: 'weekly', 
      priority: 0.7 
    }),
  ];

  // =============== 合并所有页面 ===============

  return [
    ...staticPages,
    ...instagramCategoryPages,
    ...instagramMoodPages,
    ...telegramCategoryPages,
    ...telegramMoodPages,
    ...xCategoryPages,
    ...xMoodPages,
    ...generatorPresetPages,
  ];
}
