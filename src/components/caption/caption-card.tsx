/**
 * 文案卡片组件
 * @description 展示单条文案内容，支持复制和生成相似功能
 */

'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles, Hash, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RewriteDialog } from '@/components/caption/rewrite-dialog';
import { cn, copyToClipboard, formatHashtags } from '@/lib/utils';
import { CaptionCardProps, PlatformId } from '@/types';

/**
 * 文案卡片组件
 * @description 卡片样式展示文案，支持一键复制和查看 Hashtag
 * @param props - 组件属性
 */
export function CaptionCard({
  caption,
  hashtags = [],
  showHashtags = true,
  onCopy,
  onGenerateSimilar,
  platform = PlatformId.INSTAGRAM,
}: CaptionCardProps) {
  /** 复制成功状态 */
  const [copied, setCopied] = useState(false);
  /** Hashtag 复制成功状态 */
  const [hashtagsCopied, setHashtagsCopied] = useState(false);

  /**
   * 获取文案内容
   * @returns 文案文本内容
   */
  const getContent = (): string => {
    if ('formattedContent' in caption && caption.formattedContent) {
      return caption.formattedContent;
    }
    return caption.content;
  };

  /**
   * 获取 Hashtag 列表
   * @returns Hashtag 数组
   */
  const getHashtags = (): string[] => {
    if ('hashtags' in caption && Array.isArray(caption.hashtags)) {
      return caption.hashtags;
    }
    return hashtags;
  };

  /**
   * 更新复制统计（异步，不阻塞用户操作）
   * @param captionId - 文案 ID
   */
  const updateCopyStats = async (captionId: string) => {
    try {
      await fetch(`/api/captions/${captionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'copy' }),
      });
    } catch (error) {
      // 统计更新失败不影响用户体验，静默处理
      console.debug('Failed to update copy stats:', error);
    }
  };

  /**
   * 处理复制文案
   */
  const handleCopyCaption = async () => {
    const content = getContent();
    const captionHashtags = getHashtags();
    
    // 根据平台格式化复制内容
    let textToCopy = content;
    
    // Instagram: 文案 + 空行 + hashtags
    if (platform === PlatformId.INSTAGRAM && captionHashtags.length > 0 && showHashtags) {
      textToCopy = `${content}\n\n${formatHashtags(captionHashtags)}`;
    }
    // X: 文案 + hashtags（在末尾，数量较少）
    else if (platform === PlatformId.X && captionHashtags.length > 0 && showHashtags) {
      const limitedHashtags = captionHashtags.slice(0, 2);
      textToCopy = `${content} ${formatHashtags(limitedHashtags)}`;
    }

    const success = await copyToClipboard(textToCopy);
    
    if (success) {
      setCopied(true);
      toast.success('Caption copied!', {
        description: 'Ready to paste to your social media',
      });
      onCopy?.(textToCopy);
      
      // 更新复制统计（如果文案有 ID）
      const captionId = 'id' in caption ? caption.id : null;
      if (captionId && typeof captionId === 'string' && captionId.length > 0) {
        updateCopyStats(captionId);
      }
      
      // 3秒后重置状态
      setTimeout(() => setCopied(false), 3000);
    } else {
      toast.error('Failed to copy', {
        description: 'Please try again',
      });
    }
  };

  /**
   * 处理复制 Hashtag
   */
  const handleCopyHashtags = async () => {
    const captionHashtags = getHashtags();
    const hashtagText = formatHashtags(captionHashtags);
    
    const success = await copyToClipboard(hashtagText);
    
    if (success) {
      setHashtagsCopied(true);
      toast.success('Hashtags copied!');
      
      setTimeout(() => setHashtagsCopied(false), 3000);
    }
  };

  /** 获取字符数 */
  const characterCount = 'characterCount' in caption 
    ? caption.characterCount 
    : getContent().length;

  /** 获取 Hashtag 列表 */
  const displayHashtags = getHashtags();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      {/* 顶部装饰条 */}
      <div className="h-1 bg-gradient-to-r from-primary/60 via-purple-500/60 to-pink-500/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="p-5 space-y-4">
        {/* 文案内容 */}
        <div className="min-h-[90px]">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 group-hover:text-foreground transition-colors">
            {getContent()}
          </p>
        </div>

        {/* Hashtag 区域 */}
        {showHashtags && displayHashtags.length > 0 && (
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground flex items-center font-medium">
                <Hash className="h-3 w-3 mr-1" />
                Hashtags ({displayHashtags.length})
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs hover:bg-primary/10"
                      onClick={handleCopyHashtags}
                    >
                      {hashtagsCopied ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy hashtags only</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {displayHashtags.slice(0, 8).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs font-normal px-2 py-0.5 bg-primary/5 hover:bg-primary/10 transition-colors cursor-default"
                >
                  #{tag}
                </Badge>
              ))}
              {displayHashtags.length > 8 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{displayHashtags.length - 8} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* 操作按钮区域 */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          {/* 字符数显示 */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              {characterCount} chars
            </span>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-1">
            {/* 生成相似按钮 */}
            {onGenerateSimilar && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-muted-foreground hover:text-primary"
                      onClick={onGenerateSimilar}
                    >
                      <Sparkles className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">Similar</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Generate similar captions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* AI 改写按钮 */}
            <RewriteDialog
              originalContent={getContent()}
              platformId={platform}
              trigger={
                <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-primary">
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Rewrite</span>
                </Button>
              }
            />

            {/* 复制按钮 */}
            <Button
              variant={copied ? 'default' : 'default'}
              size="sm"
              className={cn(
                'h-8 min-w-[85px] font-medium shadow-sm',
                copied 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-primary hover:bg-primary/90'
              )}
              onClick={handleCopyCaption}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
