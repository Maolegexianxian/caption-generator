/**
 * 文案改写对话框组件
 * @description 提供 AI 文案改写和翻译功能
 */

'use client';

import { useState } from 'react';
import { Loader2, RefreshCw, Languages, Sparkles, Copy, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { PlatformId } from '@/types';
import { copyToClipboard } from '@/lib/utils';

/** 改写风格选项 */
const REWRITE_STYLES = [
  { value: 'casual', label: 'Casual', description: 'Friendly and conversational' },
  { value: 'professional', label: 'Professional', description: 'Polished and formal' },
  { value: 'humorous', label: 'Humorous', description: 'Fun and witty' },
  { value: 'emotional', label: 'Emotional', description: 'Heartfelt and touching' },
  { value: 'concise', label: 'Concise', description: 'Short and impactful' },
] as const;

/** 语言选项 */
const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'es', label: 'Español' },
  { value: 'pt', label: 'Português' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
] as const;

/**
 * 组件属性
 */
interface RewriteDialogProps {
  /** 原始文案内容 */
  originalContent: string;
  /** 平台 ID */
  platformId: PlatformId;
  /** 触发按钮（可选） */
  trigger?: React.ReactNode;
}

/**
 * 文案改写对话框组件
 * @param props - 组件属性
 */
export function RewriteDialog({ originalContent, platformId, trigger }: RewriteDialogProps) {
  /** 对话框开关状态 */
  const [open, setOpen] = useState(false);
  /** 改写风格 */
  const [style, setStyle] = useState<string>('casual');
  /** 翻译目标语言 */
  const [targetLanguage, setTargetLanguage] = useState<string>('es');
  /** 改写结果 */
  const [rewrites, setRewrites] = useState<string[]>([]);
  /** 翻译结果 */
  const [translatedContent, setTranslatedContent] = useState<string>('');
  /** 加载状态 */
  const [isLoading, setIsLoading] = useState(false);
  /** 已复制的索引 */
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  /**
   * 执行改写
   */
  const handleRewrite = async () => {
    setIsLoading(true);
    setRewrites([]);

    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalContent,
          platformId,
          style,
          keepEmoji: true,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to rewrite');
      }

      setRewrites(data.data.rewrites);
      toast.success('Captions rewritten successfully!');
    } catch (error) {
      console.error('Rewrite error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to rewrite caption');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 执行翻译
   */
  const handleTranslate = async () => {
    setIsLoading(true);
    setTranslatedContent('');

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: originalContent,
          sourceLanguage: 'en',
          targetLanguage,
          preserveTone: true,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to translate');
      }

      setTranslatedContent(data.data.translatedContent);
      toast.success('Caption translated successfully!');
    } catch (error) {
      console.error('Translate error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to translate caption');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 复制内容
   */
  const handleCopy = async (content: string, index: number) => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopiedIndex(index);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      toast.error('Failed to copy');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Rewrite
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Caption Tools
          </DialogTitle>
          <DialogDescription>
            Rewrite or translate your caption with AI
          </DialogDescription>
        </DialogHeader>

        {/* 原始内容预览 */}
        <div className="p-3 bg-muted rounded-lg text-sm">
          <p className="text-muted-foreground text-xs mb-1">Original:</p>
          <p className="line-clamp-3">{originalContent}</p>
        </div>

        <Tabs defaultValue="rewrite" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rewrite">
              <RefreshCw className="h-4 w-4 mr-1" />
              Rewrite
            </TabsTrigger>
            <TabsTrigger value="translate">
              <Languages className="h-4 w-4 mr-1" />
              Translate
            </TabsTrigger>
          </TabsList>

          {/* 改写标签页 */}
          <TabsContent value="rewrite" className="space-y-4">
            <div className="flex gap-2">
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {REWRITE_STYLES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      <div>
                        <span>{s.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {s.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleRewrite} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* 改写结果 */}
            {rewrites.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {rewrites.map((rewrite, index) => (
                  <Card key={index} className="relative">
                    <CardContent className="p-3 pr-10">
                      <p className="text-sm">{rewrite}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8"
                        onClick={() => handleCopy(rewrite, index)}
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* 翻译标签页 */}
          <TabsContent value="translate" className="space-y-4">
            <div className="flex gap-2">
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleTranslate} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Languages className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* 翻译结果 */}
            {translatedContent && (
              <Card className="relative">
                <CardContent className="p-3 pr-10">
                  <p className="text-sm">{translatedContent}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => handleCopy(translatedContent, -1)}
                  >
                    {copiedIndex === -1 ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
