/**
 * 文案列表组件
 * @description 以网格布局展示多条文案卡片
 */

'use client';

import { CaptionCard } from './caption-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Caption, GeneratedCaption, PlatformId } from '@/types';
import { cn } from '@/lib/utils';

/**
 * 文案列表组件属性
 */
interface CaptionListProps {
  /** 文案数据列表 */
  captions: (Caption | GeneratedCaption)[];
  /** 平台类型 */
  platform?: PlatformId;
  /** 是否显示 Hashtag */
  showHashtags?: boolean;
  /** 是否正在加载 */
  loading?: boolean;
  /** 加载骨架屏数量 */
  skeletonCount?: number;
  /** 空状态提示文本 */
  emptyText?: string;
  /** 生成相似文案回调 */
  onGenerateSimilar?: (caption: Caption | GeneratedCaption) => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * 加载骨架屏组件
 * @description 文案卡片加载时的占位骨架
 */
function CaptionSkeleton() {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      {/* 文案内容骨架 */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      {/* Hashtag 骨架 */}
      <div className="pt-2 border-t">
        <Skeleton className="h-3 w-16 mb-2" />
        <div className="flex flex-wrap gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-5 w-16 rounded-full" />
          ))}
        </div>
      </div>
      {/* 操作区域骨架 */}
      <div className="flex justify-between pt-2 border-t">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

/**
 * 空状态组件
 * @description 列表为空时的提示
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
 * 文案列表组件
 * @description 响应式网格布局展示文案卡片列表
 * @param props - 组件属性
 */
export function CaptionList({
  captions,
  platform = PlatformId.INSTAGRAM,
  showHashtags = true,
  loading = false,
  skeletonCount = 6,
  emptyText = 'No captions found',
  onGenerateSimilar,
  className,
}: CaptionListProps) {
  return (
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
        captions.map((caption) => {
          const id = 'id' in caption ? caption.id : '';
          
          return (
            <CaptionCard
              key={id}
              caption={caption}
              platform={platform}
              showHashtags={showHashtags}
              onGenerateSimilar={
                onGenerateSimilar
                  ? () => onGenerateSimilar(caption)
                  : undefined
              }
            />
          );
        })}
    </div>
  );
}
