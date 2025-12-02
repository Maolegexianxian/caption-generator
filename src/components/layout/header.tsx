/**
 * 网站头部导航组件
 * @description 包含 Logo、主导航菜单和移动端菜单
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Sparkles, MessageCircle, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SearchBox } from '@/components/search/search-box';
import { cn } from '@/lib/utils';
import { SITE_CONFIG } from '@/config/constants';

/**
 * 导航链接配置类型
 */
interface NavLink {
  /** 链接标题 */
  title: string;
  /** 链接路径 */
  href: string;
  /** 链接图标组件 */
  icon?: React.ComponentType<{ className?: string }>;
  /** 链接描述 */
  description?: string;
}

/**
 * 主导航链接配置
 */
const mainNavLinks: NavLink[] = [
  {
    title: 'TG Captions',
    href: '/tg-captions',
    icon: MessageCircle,
    description: 'Captions for Telegram',
  },
  {
    title: 'Instagram Captions',
    href: '/captions-for-instagram',
    icon: Instagram,
    description: 'Captions for Instagram',
  },
  {
    title: 'X Captions',
    href: '/x-captions',
    icon: Twitter,
    description: 'Captions for X (Twitter)',
  },
  {
    title: 'Generator',
    href: '/generator',
    icon: Sparkles,
    description: 'AI Caption Generator',
  },
];

/**
 * 头部导航组件
 * @description 响应式导航栏，支持桌面端和移动端
 */
export function Header() {
  /** 移动端菜单开关状态 */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  /** 当前路径 */
  const pathname = usePathname();

  /**
   * 检查链接是否为当前激活状态
   * @param href - 链接路径
   * @returns 是否激活
   */
  const isActiveLink = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">{SITE_CONFIG.name}</span>
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center space-x-1">
            {mainNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isActiveLink(link.href);
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    isActive 
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-muted-foreground'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4 mr-2" />}
                  {link.title}
                </Link>
              );
            })}
          </nav>

          {/* 搜索框 */}
          <div className="hidden md:block w-64">
            <SearchBox />
          </div>

          {/* 移动端菜单按钮 */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">打开菜单</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {/* 移动端 Logo */}
                <Link 
                  href="/" 
                  className="flex items-center space-x-2 mb-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Sparkles className="h-6 w-6 text-primary" />
                  <span className="font-bold text-xl">{SITE_CONFIG.name}</span>
                </Link>

                {/* 移动端导航链接 */}
                <nav className="flex flex-col space-y-2">
                  {mainNavLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = isActiveLink(link.href);
                    
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors',
                          'hover:bg-accent hover:text-accent-foreground',
                          isActive 
                            ? 'bg-accent text-accent-foreground' 
                            : 'text-muted-foreground'
                        )}
                      >
                        {Icon && <Icon className="h-5 w-5 mr-3" />}
                        <div>
                          <div>{link.title}</div>
                          {link.description && (
                            <div className="text-xs text-muted-foreground">
                              {link.description}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
