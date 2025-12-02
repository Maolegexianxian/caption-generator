/**
 * 文案列表客户端组件
 * @description 支持"生成类似"功能的文案列表包装组件
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { CaptionCard } from './caption-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Caption, GeneratedCaption, PlatformId } from '@/types';
import { cn } from '@/lib/utils';

/**
 * 排序选项类型
 */
type SortOption = 'default' | 'shortest' | 'longest';

/**
 * 文案列表客户端组件属性
 */
interface CaptionListClientProps {
  /** 文案数据列表 */
  captions: (Caption | GeneratedCaption)[];
  /** 平台类型 */
  platform: PlatformId;
  /** 分类 ID */
  categoryId?: string;
  /** 是否显示 Hashtag */
  showHashtags?: boolean;
  /** 是否正在加载 */
  loading?: boolean;
  /** 加载骨架屏数量 */
  skeletonCount?: number;
  /** 空状态提示文本 */
  emptyText?: string;
  /** 自定义类名 */
  className?: string;
  /** 是否显示排序选项 */
  showSort?: boolean;
  /** 是否显示加载更多 */
  showLoadMore?: boolean;
  /** 每页显示数量 */
  pageSize?: number;
}

/**
 * 加载骨架屏组件
 */
function CaptionSkeleton() {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="pt-2 border-t">
        <Skeleton className="h-3 w-16 mb-2" />
        <div className="flex flex-wrap gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-5 w-16 rounded-full" />
          ))}
        </div>
      </div>
      <div className="flex justify-between pt-2 border-t">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

/**
 * 空状态组件
 */
function EmptyState({ text }: { text: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl mb-4">📝</div>
      <h3 className="text-lg font-medium text-muted-foreground">{text}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Try adjusting your filters or generate new captions
      </p>
    </div>
  );
}

/**
 * 文案列表客户端组件
 * @description 支持排序、分页和"生成类似"功能
 * @param props - 组件属性
 */
export function CaptionListClient({
  captions,
  platform,
  categoryId,
  showHashtags = true,
  loading = false,
  skeletonCount = 6,
  emptyText = 'No captions found',
  className,
  showSort = true,
  showLoadMore = true,
  pageSize = 12,
}: CaptionListClientProps) {
  /** 路由 */
  const router = useRouter();
  /** 排序选项 */
  const [sortOption, setSortOption] = useState<SortOption>('default');
  /** 当前显示数量 */
  const [displayCount, setDisplayCount] = useState(pageSize);

  /**
   * 获取文案字符长度
   * @param caption - 文案对象
   * @returns 字符长度
   */
  const getCharacterCount = (caption: Caption | GeneratedCaption): number => {
    if ('characterCount' in caption && typeof caption.characterCount === 'number') {
      return caption.characterCount;
    }
    return caption.content.length;
  };

  /**
   * 排序后的文案列表
   */
  const sortedCaptions = useMemo(() => {
    const sorted = [...captions];
    
    if (sortOption === 'shortest') {
      sorted.sort((a, b) => getCharacterCount(a) - getCharacterCount(b));
    } else if (sortOption === 'longest') {
      sorted.sort((a, b) => getCharacterCount(b) - getCharacterCount(a));
    }
    
    return sorted;
  }, [captions, sortOption]);

  /**
   * 当前显示的文案
   */
  const displayedCaptions = sortedCaptions.slice(0, displayCount);

  /**
   * 是否还有更多
   */
  const hasMore = displayCount < sortedCaptions.length;

  /**
   * 处理"生成类似"点击
   * @param caption - 文案对象
   */
  const handleGenerateSimilar = (caption: Caption | GeneratedCaption) => {
    // 构建生成器 URL 参数
    const params = new URLSearchParams();
    
    // 设置平台
    params.set('platform', platform);
    
    // 设置分类
    if (categoryId) {
      params.set('category', categoryId);
    }
    
    // 从文案内容提取关键词（取前几个词作为关键词）
    const content = caption.content;
    const words = content
      .replace(/[^\w\s]/g, ' ') // 移除标点
      .split(/\s+/)
      .filter(word => word.length > 3) // 只保留长度>3的词
      .slice(0, 3); // 取前3个词
    
    if (words.length > 0) {
      params.set('keywords', words.join(', '));
    }

    // 跳转到生成器页面
    router.push(`/generator?${params.toString()}`);
  };

  /**
   * 加载更多
   */
  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + pageSize, sortedCaptions.length));
  };

  return (
    <div className="space-y-4">
      {/* 排序和统计 */}
      {showSort && captions.length > 0 && !loading && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {captions.length} captions
            </Badge>
          </div>
          <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="shortest">Shortest first</SelectItem>
              <SelectItem value="longest">Longest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 文案列表 */}
      <div
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
          className
        )}
      >
        {/* 加载状态 */}
        {loading && (
          <>
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <CaptionSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        )}

        {/* 空状态 */}
        {!loading && captions.length === 0 && (
          <EmptyState text={emptyText} />
        )}

        {/* 文案卡片列表 */}
        {!loading &&
          displayedCaptions.map((caption) => {
            const id = 'id' in caption ? caption.id : '';
            
            return (
              <CaptionCard
                key={id}
                caption={caption}
                platform={platform}
                showHashtags={showHashtags}
                onGenerateSimilar={() => handleGenerateSimilar(caption)}
              />
            );
          })}
      </div>

      {/* 加载更多按钮 */}
      {showLoadMore && hasMore && !loading && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={handleLoadMore}>
            Load More ({sortedCaptions.length - displayCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}
