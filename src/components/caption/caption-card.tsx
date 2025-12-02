/**
 * 文案卡片组件
 * @description 展示单条文案内容，支持复制和生成相似功能
 */

'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4 space-y-3">
        {/* 文案内容 */}
        <div className="min-h-[80px]">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {getContent()}
          </p>
        </div>

        {/* Hashtag 区域 */}
        {showHashtags && displayHashtags.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground flex items-center">
                <Hash className="h-3 w-3 mr-1" />
                Hashtags
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
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
            <div className="flex flex-wrap gap-1">
              {displayHashtags.slice(0, 10).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs font-normal"
                >
                  #{tag}
                </Badge>
              ))}
              {displayHashtags.length > 10 && (
                <Badge variant="outline" className="text-xs">
                  +{displayHashtags.length - 10} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* 操作按钮区域 */}
        <div className="flex items-center justify-between pt-2 border-t">
          {/* 字符数显示 */}
          <span className="text-xs text-muted-foreground">
            {characterCount} characters
          </span>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-2">
            {/* 生成相似按钮 */}
            {onGenerateSimilar && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={onGenerateSimilar}
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      Similar
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Generate similar captions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* 复制按钮 */}
            <Button
              variant={copied ? 'default' : 'secondary'}
              size="sm"
              className={cn(
                'h-8 min-w-[80px]',
                copied && 'bg-green-500 hover:bg-green-600'
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
