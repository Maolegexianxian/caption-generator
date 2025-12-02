/**
 * 全局加载组件
 * @description 页面切换时显示的加载动画
 */

import { Sparkles } from 'lucide-react';

/**
 * 加载组件
 * @description 显示居中的加载动画和 Logo
 */
export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      {/* 加载动画 */}
      <div className="relative">
        {/* 旋转光环 */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
        
        {/* Logo 图标 */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center animate-pulse">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
      </div>
      
      {/* 加载文字 */}
      <p className="mt-6 text-muted-foreground animate-pulse">
        Loading...
      </p>
    </div>
  );
}
