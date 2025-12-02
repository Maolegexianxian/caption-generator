/**
 * Robots.txt 配置
 * @description 配置搜索引擎爬虫规则
 */

import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/constants';

/**
 * 生成 robots.txt 配置
 * @description 定义搜索引擎爬虫的访问规则
 * @returns robots.txt 配置对象
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/static/',
        ],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
