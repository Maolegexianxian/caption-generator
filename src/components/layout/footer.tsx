/**
 * 网站底部组件
 * @description 包含导航链接、版权信息和社交媒体链接
 */

import Link from 'next/link';
import { Sparkles, MessageCircle, Instagram, Twitter, Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { SITE_CONFIG, CATEGORIES_CONFIG } from '@/config/constants';

/**
 * 底部链接分组类型
 */
interface FooterLinkGroup {
  /** 分组标题 */
  title: string;
  /** 分组内的链接 */
  links: {
    title: string;
    href: string;
  }[];
}

/**
 * 底部链接分组配置
 */
const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: 'Platforms',
    links: [
      { title: 'TG Captions', href: '/tg-captions' },
      { title: 'Instagram Captions', href: '/captions-for-instagram' },
      { title: 'X (Twitter) Captions', href: '/x-captions' },
    ],
  },
  {
    title: 'Popular Categories',
    links: CATEGORIES_CONFIG.slice(0, 6).map((category) => ({
      title: category.displayName,
      href: `/captions-for-instagram/${category.slug}`,
    })),
  },
  {
    title: 'Tools & Resources',
    links: [
      { title: 'AI Caption Generator', href: '/generator' },
      { title: 'Instagram Generator', href: '/generator?platform=instagram' },
      { title: 'TG Generator', href: '/generator?platform=telegram' },
      { title: 'X Generator', href: '/generator?platform=x' },
    ],
  },
];

/**
 * 底部组件
 * @description 网站全局底部，包含导航、版权和相关信息
 */
export function Footer() {
  /** 获取当前年份 */
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo 和描述 */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">{SITE_CONFIG.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              {SITE_CONFIG.description}
            </p>
            {/* 平台图标 */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/tg-captions" 
                className="text-muted-foreground hover:text-primary transition-colors"
                title="Telegram Captions"
              >
                <MessageCircle className="h-5 w-5" />
              </Link>
              <Link 
                href="/captions-for-instagram" 
                className="text-muted-foreground hover:text-primary transition-colors"
                title="Instagram Captions"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link 
                href="/x-captions" 
                className="text-muted-foreground hover:text-primary transition-colors"
                title="X Captions"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* 链接分组 */}
          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold mb-4">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* 版权信息 */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p className="flex items-center">
            © {currentYear} {SITE_CONFIG.name}. Made with 
            <Heart className="h-4 w-4 mx-1 text-red-500" /> 
            for content creators.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
