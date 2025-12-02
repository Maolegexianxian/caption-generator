/**
 * 全局错误处理组件
 * @description 处理运行时错误并提供友好的错误界面
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * 错误组件属性
 */
interface ErrorProps {
  /** 错误对象 */
  error: Error & { digest?: string };
  /** 重试函数 */
  reset: () => void;
}

/**
 * 错误处理组件
 * @description 显示错误信息并提供重试和返回首页选项
 * @param props - 组件属性
 */
export default function Error({ error, reset }: ErrorProps) {
  /** 记录错误到控制台 */
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          {/* 错误图标 */}
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          
          <CardTitle className="text-xl">
            Something went wrong!
          </CardTitle>
          <CardDescription>
            We encountered an unexpected error. Don&apos;t worry, you can try again or go back to the homepage.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* 错误详情（仅开发环境显示） */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p className="font-mono text-destructive break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
          
          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={reset}
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              asChild
              className="flex-1"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
