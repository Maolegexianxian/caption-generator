/**
 * Robots.txt 配置
 * @description 配置搜索引擎爬虫规则，优化 SEO 抓取效率
 * @module app/robots
 */

import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/constants';

/**
 * 生成 robots.txt 配置
 * @description 定义搜索引擎爬虫的访问规则，包含多个爬虫的特定配置
 * @returns robots.txt 配置对象
 */
export default function robots(): MetadataRoute.Robots {
  /** 网站基础 URL */
  const baseUrl = SITE_CONFIG.url;

  return {
    rules: [
      // =============== 通用爬虫规则 ===============
      {
        /** 所有爬虫 */
        userAgent: '*',
        /** 允许访问的路径 */
        allow: [
          '/',
          '/generator',
          '/captions-for-instagram',
          '/captions-for-instagram/*',
          '/tg-captions',
          '/tg-captions/*',
          '/x-captions',
          '/x-captions/*',
          '/faq',
          '/privacy',
          '/terms',
        ],
        /** 禁止访问的路径 */
        disallow: [
          '/api/',
          '/api/*',
          '/_next/',
          '/_next/*',
          '/static/',
          '/_vercel/',
          '/*.json$',
          '/batch/',
          '/batch/*',
        ],
        /** 抓取延迟（秒） */
        crawlDelay: 1,
      },

      // =============== Googlebot 特定规则 ===============
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/generator',
          '/captions-for-instagram',
          '/captions-for-instagram/*',
          '/tg-captions',
          '/tg-captions/*',
          '/x-captions',
          '/x-captions/*',
          '/faq',
        ],
        disallow: [
          '/api/',
          '/_next/',
          '/batch/',
        ],
      },

      // =============== Googlebot-Image 规则 ===============
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/og-image.png',
          '/logo.png',
          '/icon-*.png',
          '/*.svg',
        ],
        disallow: [
          '/api/',
        ],
      },

      // =============== Bingbot 特定规则 ===============
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/generator',
          '/captions-for-instagram',
          '/captions-for-instagram/*',
          '/tg-captions',
          '/tg-captions/*',
          '/x-captions',
          '/x-captions/*',
          '/faq',
        ],
        disallow: [
          '/api/',
          '/_next/',
          '/batch/',
        ],
        crawlDelay: 2,
      },

      // =============== 社交媒体爬虫规则 ===============
      {
        userAgent: 'Twitterbot',
        allow: '/',
      },
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        userAgent: 'TelegramBot',
        allow: '/',
      },

      // =============== 恶意爬虫阻止 ===============
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
      {
        userAgent: 'MJ12bot',
        disallow: '/',
      },
      {
        userAgent: 'DotBot',
        disallow: '/',
      },
    ],
    
    /** 网站地图 URL */
    sitemap: `${baseUrl}/sitemap.xml`,
    
    /** 主机声明 */
    host: baseUrl,
  };
}
