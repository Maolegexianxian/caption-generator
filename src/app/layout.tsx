/**
 * 根布局组件
 * @description 应用的根布局，包含全局样式、字体、导航和页脚
 */

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SITE_CONFIG, SEO_CONFIG } from "@/config/constants";

/**
 * 字体配置
 * @description 使用 Inter 字体作为主要字体
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/**
 * 全局元数据配置
 * @description SEO 相关的元数据配置
 */
export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    template: `%s ${SEO_CONFIG.titleSuffix}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "caption generator",
    "instagram captions",
    "telegram captions",
    "twitter captions",
    "x captions",
    "social media captions",
    "ai caption generator",
    "tg captions",
    "captions for instagram",
  ],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
