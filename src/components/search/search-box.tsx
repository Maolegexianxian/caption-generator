/**
 * 搜索框组件
 * @description 全站搜索功能，支持搜索分类和文案
 */

'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn, debounce } from '@/lib/utils';
import { CATEGORIES_CONFIG, MOODS_CONFIG, PLATFORMS_CONFIG } from '@/config/constants';
import { PlatformId } from '@/types';

/**
 * 搜索结果项类型
 */
interface SearchResult {
  /** 结果类型 */
  type: 'category' | 'mood' | 'platform';
  /** 唯一标识 */
  id: string;
  /** 显示标题 */
  title: string;
  /** 描述 */
  description?: string;
  /** 图标 */
  icon?: string;
  /** 跳转链接 */
  href: string;
}

/**
 * 搜索框组件属性
 */
interface SearchBoxProps {
  /** 占位符文本 */
  placeholder?: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 搜索框组件
 * @description 提供全站搜索功能，使用对话框展示搜索结果
 * @param props - 组件属性
 */
export function SearchBox({ 
  placeholder = 'Search captions, categories...', 
  className 
}: SearchBoxProps) {
  /** 搜索关键词 */
  const [query, setQuery] = useState('');
  /** 搜索结果 */
  const [results, setResults] = useState<SearchResult[]>([]);
  /** 对话框开关状态 */
  const [open, setOpen] = useState(false);
  /** 输入框引用 */
  const inputRef = useRef<HTMLInputElement>(null);
  /** 路由 */
  const router = useRouter();

  /**
   * 执行搜索
   * @param searchQuery - 搜索关键词
   */
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // 搜索分类
    CATEGORIES_CONFIG.forEach((category) => {
      if (
        category.name.toLowerCase().includes(lowerQuery) ||
        category.displayName.toLowerCase().includes(lowerQuery) ||
        category.description?.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          type: 'category',
          id: category.id,
          title: category.displayName,
          description: category.description,
          icon: category.icon,
          href: `/captions-for-instagram/${category.slug}`,
        });
      }
    });

    // 搜索情绪标签
    MOODS_CONFIG.forEach((mood) => {
      if (
        mood.name.toLowerCase().includes(lowerQuery) ||
        mood.displayName.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          type: 'mood',
          id: mood.id,
          title: mood.displayName,
          description: `${mood.displayName} captions`,
          icon: mood.icon,
          href: `/generator?mood=${mood.id}`,
        });
      }
    });

    // 搜索平台
    Object.values(PlatformId).forEach((platformId) => {
      const platform = PLATFORMS_CONFIG[platformId];
      if (
        platform.name.toLowerCase().includes(lowerQuery) ||
        platform.displayName.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          type: 'platform',
          id: platform.id,
          title: platform.displayName,
          description: platform.description,
          href: `/${platform.slug}`,
        });
      }
    });

    setResults(searchResults.slice(0, 10));
  }, []);

  /**
   * 防抖搜索
   * @description 使用 useMemo 创建防抖函数避免重复创建
   */
  const debouncedSearch = useMemo(
    () => debounce((q: string) => performSearch(q), 200),
    [performSearch]
  );

  /**
   * 处理输入变化
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  /**
   * 处理结果点击
   */
  const handleResultClick = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    setResults([]);
    router.push(result.href);
  };

  /**
   * 清空搜索
   */
  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  /**
   * 键盘快捷键监听
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K 打开搜索
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'relative w-full justify-start text-sm text-muted-foreground',
            className
          )}
        >
          <Search className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline-flex">{placeholder}</span>
          <span className="sm:hidden">Search</span>
          <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0">
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle className="sr-only">Search</DialogTitle>
          {/* 搜索输入框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="pl-10 pr-10"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* 搜索结果 */}
        <ScrollArea className="max-h-[400px]">
          <div className="p-4 pt-2">
            {results.length === 0 && query && (
              <p className="text-sm text-muted-foreground text-center py-6">
                No results found for &quot;{query}&quot;
              </p>
            )}

            {results.length === 0 && !query && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">
                    Quick Links
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(PlatformId).map((platformId) => {
                      const platform = PLATFORMS_CONFIG[platformId];
                      return (
                        <Badge
                          key={platform.id}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => {
                            setOpen(false);
                            router.push(`/${platform.slug}`);
                          }}
                        >
                          {platform.displayName}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">
                    Popular Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES_CONFIG.slice(0, 6).map((category) => (
                      <Badge
                        key={category.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => {
                          setOpen(false);
                          router.push(`/captions-for-instagram/${category.slug}`);
                        }}
                      >
                        <span className="mr-1">{category.icon}</span>
                        {category.displayName}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-1">
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent text-left transition-colors"
                    onClick={() => handleResultClick(result)}
                  >
                    {result.icon && (
                      <span className="text-xl flex-shrink-0">{result.icon}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{result.title}</div>
                      {result.description && (
                        <div className="text-sm text-muted-foreground truncate">
                          {result.description}
                        </div>
                      )}
                    </div>
                    <Badge variant="outline" className="flex-shrink-0 text-xs">
                      {result.type}
                    </Badge>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
