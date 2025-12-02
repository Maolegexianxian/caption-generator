/**
 * 应用 Providers 组件
 * @description 包装所有必要的 Context Provider，如主题、UI 库等
 */

'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { HeroUIProvider } from '@heroui/react';
import { Toaster } from '@/components/ui/sonner';

/**
 * Providers 组件属性
 */
interface ProvidersProps {
  /** 子组件 */
  children: ReactNode;
}

/**
 * 应用全局 Providers
 * @description 包装主题、UI 库和 Toast 通知等全局功能
 * @param props - 组件属性
 * @returns 包装后的子组件
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <HeroUIProvider>
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
          }}
        />
      </HeroUIProvider>
    </ThemeProvider>
  );
}
