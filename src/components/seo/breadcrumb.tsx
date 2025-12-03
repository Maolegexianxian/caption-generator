/**
 * 面包屑导航组件
 * @description 用于页面导航和 SEO 优化的面包屑组件
 * @module components/seo/breadcrumb
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

// =============== 类型定义 ===============

/**
 * 面包屑项目接口
 * @interface BreadcrumbItem
 */
export interface BreadcrumbItem {
  /** 显示名称 */
  label: string;
  /** 链接 URL（最后一项不需要） */
  href?: string;
  /** 是否为当前页面 */
  isCurrent?: boolean;
}

/**
 * 面包屑组件属性接口
 * @interface BreadcrumbProps
 */
interface BreadcrumbProps {
  /** 面包屑项目数组 */
  items: BreadcrumbItem[];
  /** 是否显示首页图标 */
  showHomeIcon?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 分隔符 */
  separator?: React.ReactNode;
  /** 项目最大显示长度（超过则截断） */
  maxLength?: number;
}

// =============== 组件实现 ===============

/**
 * 面包屑导航组件
 * @description 显示页面层级结构的导航组件，支持 SEO 优化
 * @param props - 组件属性
 * @returns 面包屑导航 JSX
 */
export function Breadcrumb({
  items,
  showHomeIcon = true,
  className,
  separator,
  maxLength = 30,
}: BreadcrumbProps): React.JSX.Element {
  /** 默认分隔符 */
  const defaultSeparator = (
    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
  );

  /** 使用的分隔符 */
  const separatorElement = separator || defaultSeparator;

  /**
   * 截断过长的文本
   * @param text - 原始文本
   * @returns 截断后的文本
   */
  const truncateText = (text: string): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.substring(0, maxLength - 3)}...`;
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'flex items-center text-sm text-muted-foreground',
        className
      )}
    >
      <ol className="flex items-center flex-wrap gap-1.5">
        {items.map((item, index) => {
          /** 是否为第一项 */
          const isFirst = index === 0;
          /** 是否为最后一项 */
          const isLast = index === items.length - 1;
          /** 是否为当前页面 */
          const isCurrent = item.isCurrent || isLast;

          return (
            <li
              key={`breadcrumb-${index}`}
              className="flex items-center"
            >
              {/* 分隔符（非第一项显示） */}
              {!isFirst && (
                <span className="mx-2" aria-hidden="true">
                  {separatorElement}
                </span>
              )}

              {/* 面包屑链接或文本 */}
              {item.href && !isCurrent ? (
                <Link
                  href={item.href}
                  className={cn(
                    'transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded',
                    isFirst && showHomeIcon && 'flex items-center'
                  )}
                >
                  {isFirst && showHomeIcon && (
                    <Home className="h-4 w-4 mr-1" aria-hidden="true" />
                  )}
                  <span className="hover:underline underline-offset-4">
                    {truncateText(item.label)}
                  </span>
                </Link>
              ) : (
                <span
                  className={cn(
                    'font-medium',
                    isCurrent && 'text-foreground',
                    isFirst && showHomeIcon && 'flex items-center'
                  )}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {isFirst && showHomeIcon && (
                    <Home className="h-4 w-4 mr-1" aria-hidden="true" />
                  )}
                  {truncateText(item.label)}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * 面包屑容器组件
 * @description 为面包屑提供统一的背景样式
 * @param props - 组件属性
 * @returns 面包屑容器 JSX
 */
export function BreadcrumbContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <section
      className={cn(
        'bg-muted/30 py-4 border-b',
        className
      )}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  );
}

// =============== 预设面包屑配置 ===============

/**
 * 生成首页面包屑
 * @returns 首页面包屑项目数组
 */
export function getHomeBreadcrumb(): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/', isCurrent: true },
  ];
}

/**
 * 生成平台专题页面包屑
 * @param platform - 平台标识
 * @param platformName - 平台显示名称
 * @returns 面包屑项目数组
 */
export function getPlatformBreadcrumbs(
  platform: 'instagram' | 'telegram' | 'x',
  platformName: string
): BreadcrumbItem[] {
  const slugMap = {
    instagram: '/captions-for-instagram',
    telegram: '/tg-captions',
    x: '/x-captions',
  };

  return [
    { label: 'Home', href: '/' },
    { label: platformName, href: slugMap[platform], isCurrent: true },
  ];
}

/**
 * 生成分类页面包屑
 * @param platform - 平台标识
 * @param platformName - 平台显示名称
 * @param categoryName - 分类显示名称
 * @param categorySlug - 分类 slug
 * @returns 面包屑项目数组
 */
export function getCategoryBreadcrumbs(
  platform: 'instagram' | 'telegram' | 'x',
  platformName: string,
  categoryName: string,
  categorySlug: string
): BreadcrumbItem[] {
  const slugMap = {
    instagram: '/captions-for-instagram',
    telegram: '/tg-captions',
    x: '/x-captions',
  };

  const platformPath = slugMap[platform];

  return [
    { label: 'Home', href: '/' },
    { label: platformName, href: platformPath },
    { label: categoryName, href: `${platformPath}/${categorySlug}`, isCurrent: true },
  ];
}

/**
 * 生成生成器页面包屑
 * @returns 面包屑项目数组
 */
export function getGeneratorBreadcrumbs(): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: 'Caption Generator', href: '/generator', isCurrent: true },
  ];
}

/**
 * 生成 FAQ 页面包屑
 * @returns 面包屑项目数组
 */
export function getFAQBreadcrumbs(): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: 'FAQ', href: '/faq', isCurrent: true },
  ];
}

/**
 * 生成隐私政策页面包屑
 * @returns 面包屑项目数组
 */
export function getPrivacyBreadcrumbs(): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: 'Privacy Policy', href: '/privacy', isCurrent: true },
  ];
}

/**
 * 生成服务条款页面包屑
 * @returns 面包屑项目数组
 */
export function getTermsBreadcrumbs(): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: 'Terms of Service', href: '/terms', isCurrent: true },
  ];
}

export default Breadcrumb;
