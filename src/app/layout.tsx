/**
 * 根布局组件
 * @description 应用的根布局，包含全局样式、字体、导航、页脚和 SEO 配置
 * @module app/layout
 */

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SITE_CONFIG } from "@/config/constants";
import { GLOBAL_SEO_CONFIG, HOME_PAGE_SEO } from "@/config/seo";

/**
 * 字体配置
 * @description 使用 Inter 字体作为主要字体，优化加载性能
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

/**
 * 全局元数据配置
 * @description 根级别 SEO 元数据，包含完整的 Open Graph、Twitter Card 和搜索引擎优化配置
 */
export const metadata: Metadata = {
  /** 基础 URL 配置 */
  metadataBase: new URL(SITE_CONFIG.url),
  
  /** 标题配置 */
  title: {
    default: HOME_PAGE_SEO.title,
    template: GLOBAL_SEO_CONFIG.titleTemplate,
  },
  
  /** 页面描述 */
  description: HOME_PAGE_SEO.description,
  
  /** 关键词 */
  keywords: HOME_PAGE_SEO.keywords,
  
  /** 作者信息 */
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  
  /** 网站格式检测 */
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  /** 规范链接和多语言替代 */
  alternates: {
    canonical: SITE_CONFIG.url,
    languages: {
      'en-US': SITE_CONFIG.url,
      'x-default': SITE_CONFIG.url,
    },
  },
  
  /** Open Graph 配置 */
  openGraph: {
    type: "website",
    locale: GLOBAL_SEO_CONFIG.defaultLocale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: HOME_PAGE_SEO.openGraph?.title || HOME_PAGE_SEO.title,
    description: HOME_PAGE_SEO.openGraph?.description || HOME_PAGE_SEO.description,
    images: [
      {
        url: GLOBAL_SEO_CONFIG.defaultOgImage,
        width: GLOBAL_SEO_CONFIG.ogImageWidth,
        height: GLOBAL_SEO_CONFIG.ogImageHeight,
        alt: `${SITE_CONFIG.name} - AI Caption Generator`,
      },
    ],
  },
  
  /** Twitter Card 配置 */
  twitter: {
    card: "summary_large_image",
    site: GLOBAL_SEO_CONFIG.twitterHandle,
    creator: GLOBAL_SEO_CONFIG.twitterHandle,
    title: HOME_PAGE_SEO.title,
    description: HOME_PAGE_SEO.description,
    images: [GLOBAL_SEO_CONFIG.defaultOgImage],
  },
  
  /** 搜索引擎索引配置 */
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  /** 搜索引擎验证 */
  verification: {
    google: GLOBAL_SEO_CONFIG.verification.google || undefined,
    yandex: GLOBAL_SEO_CONFIG.verification.yandex || undefined,
    other: GLOBAL_SEO_CONFIG.verification.bing 
      ? { 'msvalidate.01': GLOBAL_SEO_CONFIG.verification.bing }
      : undefined,
  },
  
  /** 应用分类 */
  category: 'technology',
  
  /** 应用名称（用于 PWA） */
  applicationName: SITE_CONFIG.name,
  
  /** 其他元数据 */
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': SITE_CONFIG.name,
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
  },
};

/**
 * 视口配置
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/**
 * 根布局组件
 * @description 包装整个应用的根布局
 * @param props - 组件属性
 * @param props.children - 子组件
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            {/* 头部导航 */}
            <Header />
            
            {/* 主内容区域 */}
            <main className="flex-1">
              {children}
            </main>
            
            {/* 页脚 */}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
