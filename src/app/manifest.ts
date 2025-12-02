/**
 * Web App Manifest 配置
 * @description 配置 PWA 相关属性，支持添加到主屏幕
 */

import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/constants';

/**
 * 生成 Web App Manifest
 * @description 定义应用图标、名称、主题色等 PWA 属性
 * @returns manifest 配置对象
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.name,
    short_name: 'Captions',
    description: SITE_CONFIG.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#7c3aed',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
