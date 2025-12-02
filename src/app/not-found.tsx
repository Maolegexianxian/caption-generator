/**
 * 404 页面组件
 * @description 自定义 404 页面，提供友好的错误提示和导航
 */

import Link from 'next/link';
import { Home, Search, Sparkles, ArrowLeft, MessageCircle, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * 404 未找到页面组件
 */
export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 动画数字 */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-muted-foreground/20 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🔍</div>
          </div>
        </div>

        {/* 错误信息 */}
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          The caption you&apos;re looking for seems to have wandered off. 
          Don&apos;t worry, we have plenty more amazing captions waiting for you!
        </p>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" asChild>
            <Link href="/">
              <Home className="h-5 w-5 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/generator">
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Captions
            </Link>
          </Button>
        </div>

        {/* 推荐平台卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
          <Link href="/tg-captions">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="font-medium">TG Captions</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/captions-for-instagram">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Instagram className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
                <p className="font-medium">Instagram</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/x-captions">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Twitter className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                </div>
                <p className="font-medium">X Captions</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 返回上一页 - 使用客户端组件实现 */}
        <div className="mt-8">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
