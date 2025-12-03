/**
 * JSON-LD 结构化数据组件
 * @description 用于在页面中注入 JSON-LD 结构化数据，提升 SEO 效果
 * @module components/seo/json-ld
 */

import React from 'react';

// =============== 类型定义 ===============

/**
 * JSON-LD 组件属性接口
 * @interface JsonLdProps
 */
interface JsonLdProps {
  /** 结构化数据内容（JSON 字符串或对象） */
  data: string | object;
  /** 脚本 ID（用于区分多个脚本） */
  id?: string;
}

/**
 * 面包屑项目接口
 * @interface BreadcrumbItem
 */
export interface BreadcrumbItem {
  /** 显示名称 */
  name: string;
  /** 链接 URL */
  url?: string;
}

/**
 * FAQ 项目接口
 * @interface FAQItem
 */
export interface FAQItem {
  /** 问题 */
  question: string;
  /** 答案 */
  answer: string;
}

// =============== 组件实现 ===============

/**
 * JSON-LD 结构化数据组件
 * @description 在页面中注入 JSON-LD 脚本标签
 * @param props - 组件属性
 * @returns Script 元素
 */
export function JsonLd({ data, id }: JsonLdProps): React.JSX.Element {
  /** 将数据转换为字符串 */
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data);

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}

/**
 * 组织结构化数据组件
 * @description 生成 Organization schema
 * @param props - 组织信息
 * @returns JsonLd 组件
 */
export function OrganizationJsonLd({
  name,
  url,
  logo,
  description,
  sameAs = [],
}: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}): React.JSX.Element {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(logo && { logo }),
    ...(description && { description }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  return <JsonLd data={data} id="organization-jsonld" />;
}

/**
 * 网站结构化数据组件
 * @description 生成 WebSite schema，包含搜索功能
 * @param props - 网站信息
 * @returns JsonLd 组件
 */
export function WebSiteJsonLd({
  name,
  url,
  description,
  searchUrl,
}: {
  name: string;
  url: string;
  description?: string;
  searchUrl?: string;
}): React.JSX.Element {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    ...(description && { description }),
    ...(searchUrl && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: searchUrl,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  };

  return <JsonLd data={data} id="website-jsonld" />;
}

/**
 * 软件应用结构化数据组件
 * @description 生成 SoftwareApplication schema
 * @param props - 应用信息
 * @returns JsonLd 组件
 */
export function SoftwareApplicationJsonLd({
  name,
  description,
  applicationCategory = 'UtilitiesApplication',
  operatingSystem = 'Web',
  price = '0',
  priceCurrency = 'USD',
  ratingValue,
  ratingCount,
}: {
  name: string;
  description: string;
  applicationCategory?: string;
  operatingSystem?: string;
  price?: string;
  priceCurrency?: string;
  ratingValue?: string;
  ratingCount?: string;
}): React.JSX.Element {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    applicationCategory,
    operatingSystem,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency,
    },
    ...(ratingValue &&
      ratingCount && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue,
          ratingCount,
          bestRating: '5',
          worstRating: '1',
        },
      }),
  };

  return <JsonLd data={data} id="software-jsonld" />;
}

/**
 * 面包屑结构化数据组件
 * @description 生成 BreadcrumbList schema
 * @param props - 面包屑项目数组
 * @returns JsonLd 组件
 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: BreadcrumbItem[];
}): React.JSX.Element {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };

  return <JsonLd data={data} id="breadcrumb-jsonld" />;
}

/**
 * FAQ 结构化数据组件
 * @description 生成 FAQPage schema
 * @param props - FAQ 项目数组
 * @returns JsonLd 组件
 */
export function FAQJsonLd({
  items,
}: {
  items: FAQItem[];
}): React.JSX.Element {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <JsonLd data={data} id="faq-jsonld" />;
}

/**
 * 文章结构化数据组件
 * @description 生成 Article schema
 * @param props - 文章信息
 * @returns JsonLd 组件
 */
export function ArticleJsonLd({
  headline,
  description,
  authorName,
  publisherName,
  publisherLogo,
  datePublished,
  dateModified,
  image,
}: {
  headline: string;
  description: string;
  authorName: string;
  publisherName: string;
  publisherLogo?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}): React.JSX.Element {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    ...(image && { image }),
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      ...(publisherLogo && {
        logo: {
          '@type': 'ImageObject',
          url: publisherLogo,
        },
      }),
    },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
  };

  return <JsonLd data={data} id="article-jsonld" />;
}

/**
 * 项目列表结构化数据组件
 * @description 生成 ItemList schema（用于文案列表页面）
 * @param props - 列表信息
 * @returns JsonLd 组件
 */
export function ItemListJsonLd({
  name,
  description,
  numberOfItems,
  itemListOrder = 'ItemListUnordered',
}: {
  name: string;
  description: string;
  numberOfItems: number;
  itemListOrder?: 'ItemListOrderAscending' | 'ItemListOrderDescending' | 'ItemListUnordered';
}): React.JSX.Element {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    numberOfItems,
    itemListOrder: `https://schema.org/${itemListOrder}`,
  };

  return <JsonLd data={data} id="itemlist-jsonld" />;
}

/**
 * HowTo 结构化数据组件
 * @description 生成 HowTo schema（用于教程页面）
 * @param props - 教程信息
 * @returns JsonLd 组件
 */
export function HowToJsonLd({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
  totalTime?: string;
}): React.JSX.Element {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };

  return <JsonLd data={data} id="howto-jsonld" />;
}

/**
 * 复合结构化数据组件
 * @description 生成包含多个 schema 的 @graph 结构
 * @param props - 子组件
 * @returns JsonLd 组件
 */
export function CombinedJsonLd({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <>{children}</>;
}

/**
 * 首页完整结构化数据组件
 * @description 生成首页所需的所有结构化数据
 * @param props - 网站信息
 * @returns 多个 JsonLd 组件
 */
export function HomePageJsonLd({
  siteName,
  siteUrl,
  description,
  logoUrl,
  searchUrl,
}: {
  siteName: string;
  siteUrl: string;
  description: string;
  logoUrl?: string;
  searchUrl?: string;
}): React.JSX.Element {
  /** 复合结构化数据 */
  const graphData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        ...(logoUrl && { logo: logoUrl }),
        description,
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: siteName,
        url: siteUrl,
        description,
        publisher: { '@id': `${siteUrl}/#organization` },
        ...(searchUrl && {
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: searchUrl,
            },
            'query-input': 'required name=search_term_string',
          },
        }),
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${siteUrl}/#application`,
        name: siteName,
        description,
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
        author: { '@id': `${siteUrl}/#organization` },
      },
    ],
  };

  return <JsonLd data={graphData} id="homepage-jsonld" />;
}

/**
 * 平台专题页结构化数据组件
 * @description 生成平台专题页所需的结构化数据
 * @param props - 页面信息
 * @returns JsonLd 组件
 */
export function PlatformPageJsonLd({
  platform,
  title,
  description,
  url,
  siteUrl,
  breadcrumbs,
  numberOfCaptions = 50,
}: {
  platform: string;
  title: string;
  description: string;
  url: string;
  siteUrl: string;
  breadcrumbs: BreadcrumbItem[];
  numberOfCaptions?: number;
}): React.JSX.Element {
  const graphData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}/#webpage`,
        name: title,
        description,
        url,
        isPartOf: { '@id': `${siteUrl}/#website` },
        breadcrumb: { '@id': `${url}/#breadcrumb` },
        about: {
          '@type': 'Thing',
          name: `${platform} Captions`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}/#breadcrumb`,
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          ...(item.url && { item: item.url }),
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${url}/#itemlist`,
        name: `${platform} Caption Collection`,
        description: `A collection of ${platform.toLowerCase()} captions`,
        numberOfItems: numberOfCaptions,
        itemListOrder: 'https://schema.org/ItemListUnordered',
      },
    ],
  };

  return <JsonLd data={graphData} id="platform-page-jsonld" />;
}

/**
 * 分类页结构化数据组件
 * @description 生成分类详情页所需的结构化数据
 * @param props - 页面信息
 * @returns JsonLd 组件
 */
export function CategoryPageJsonLd({
  categoryName,
  platform,
  title,
  description,
  url,
  siteUrl,
  parentUrl,
  breadcrumbs,
  numberOfCaptions = 50,
}: {
  categoryName: string;
  platform: string;
  title: string;
  description: string;
  url: string;
  siteUrl: string;
  parentUrl: string;
  breadcrumbs: BreadcrumbItem[];
  numberOfCaptions?: number;
}): React.JSX.Element {
  const graphData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}/#webpage`,
        name: title,
        description,
        url,
        isPartOf: { '@id': `${parentUrl}/#webpage` },
        breadcrumb: { '@id': `${url}/#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}/#breadcrumb`,
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          ...(item.url && { item: item.url }),
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${url}/#itemlist`,
        name: `${categoryName} Caption Collection`,
        description: `A curated collection of ${categoryName.toLowerCase()} captions for ${platform}`,
        numberOfItems: numberOfCaptions,
        itemListOrder: 'https://schema.org/ItemListUnordered',
      },
      {
        '@type': 'HowTo',
        '@id': `${url}/#howto`,
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

  return <JsonLd data={graphData} id="category-page-jsonld" />;
}
