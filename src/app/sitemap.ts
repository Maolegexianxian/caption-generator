/**
 * 网站地图生成
 * @description 自动生成 sitemap.xml 用于 SEO 优化
 */

import { MetadataRoute } from 'next';
import { CATEGORIES_CONFIG, SITE_CONFIG } from '@/config/constants';

/**
 * Telegram 分类配置
 */
const TG_CATEGORIES = [
  'channel',
  'group', 
  'bot',
  'status',
  'announcement',
  'promo',
];

/**
 * X 分类配置
 */
const X_CATEGORIES = [
  'post',
  'thread',
  'quote',
  'reply',
  'tech',
  'crypto',
  'ai',
  'startup',
  'life',
  'humor',
  'motivation',
  'opinion',
];

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

  /** 静态页面配置 */
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/generator`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/captions-for-instagram`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tg-captions`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/x-captions`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  /** Instagram 分类页面 */
  const instagramCategoryPages: MetadataRoute.Sitemap = CATEGORIES_CONFIG.map(
    (category) => ({
      url: `${baseUrl}/captions-for-instagram/${category.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  );

  /** Telegram 分类页面 */
  const telegramCategoryPages: MetadataRoute.Sitemap = TG_CATEGORIES.map(
    (category) => ({
      url: `${baseUrl}/tg-captions/${category}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  );

  /** X 分类页面 */
  const xCategoryPages: MetadataRoute.Sitemap = X_CATEGORIES.map(
    (category) => ({
      url: `${baseUrl}/x-captions/${category}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  );

  return [
    ...staticPages,
    ...instagramCategoryPages,
    ...telegramCategoryPages,
    ...xCategoryPages,
  ];
}
