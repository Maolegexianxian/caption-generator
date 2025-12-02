/**
 * 简化版生成器组件
 * @description 用于嵌入 SEO 专题页的简化版 AI 文案生成器
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CaptionCard } from '@/components/caption/caption-card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  PlatformId, 
  LengthType, 
  GenerateResponse, 
  GeneratedCaption 
} from '@/types';
import { MOODS_CONFIG } from '@/config/constants';

/**
 * 简化版生成器组件属性
 */
interface SimplifiedGeneratorProps {
  /** 预设平台 */
  platform: PlatformId;
  /** 预设分类 ID */
  categoryId?: string;
  /** 预设情绪 ID 列表 */
  moodIds?: string[];
  /** 标题文本 */
  title?: string;
  /** 描述文本 */
  description?: string;
  /** 主题色类名 */
  themeClass?: string;
  /** 按钮主题色类名 */
  buttonClass?: string;
}

/**
 * 简化版生成器组件
 * @description 精简的生成器界面，只包含关键词输入和情绪选择
 * @param props - 组件属性
 */
export function SimplifiedGenerator({
  platform,
  categoryId,
  moodIds = [],
  title = 'Quick Caption Generator',
  description = 'Enter a topic and get instant AI-generated captions',
  themeClass = 'bg-primary/5',
  buttonClass = 'bg-primary hover:bg-primary/90',
}: SimplifiedGeneratorProps) {
  /** 关键词输入 */
  const [keywords, setKeywords] = useState('');
  /** 选中的情绪 */
  const [selectedMoods, setSelectedMoods] = useState<string[]>(moodIds);
  /** 是否正在生成 */
  const [isGenerating, setIsGenerating] = useState(false);
  /** 生成结果 */
  const [results, setResults] = useState<GeneratedCaption[]>([]);
  /** 是否已生成 */
  const [hasGenerated, setHasGenerated] = useState(false);

  /**
   * 切换情绪选择
   * @param moodId - 情绪 ID
   */
  const toggleMood = (moodId: string) => {
    setSelectedMoods(prev => 
      prev.includes(moodId) 
        ? prev.filter(id => id !== moodId)
        : [...prev, moodId]
    );
  };

  /**
   * 处理生成请求
   */
  const handleGenerate = async () => {
    if (!keywords.trim()) {
      toast.error('Please enter a topic', {
        description: 'What should the caption be about?',
      });
      return;
    }

    setIsGenerating(true);
    setResults([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platformId: platform,
          categoryId: categoryId || 'general',
          moodIds: selectedMoods,
          keywords,
          lengthType: LengthType.MEDIUM,
          count: 4, // 简化版生成4条
          includeHashtags: true,
          includeEmoji: true,
          language: 'en',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      const generateResponse = data.data as GenerateResponse;

      if (generateResponse.success) {
        setResults(generateResponse.captions);
        setHasGenerated(true);
        toast.success('Captions generated!', {
          description: `${generateResponse.captions.length} captions ready to copy`,
        });
      } else {
        throw new Error(generateResponse.error || 'Generation failed');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate captions', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * 构建完整生成器链接
   */
  const getFullGeneratorLink = () => {
    const params = new URLSearchParams();
    params.set('platform', platform);
    if (categoryId) params.set('category', categoryId);
    if (selectedMoods.length > 0) params.set('mood', selectedMoods.join(','));
    if (keywords) params.set('keywords', keywords);
    return `/generator?${params.toString()}`;
  };

  return (
    <Card className={cn('w-full', themeClass)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 关键词输入 */}
        <div className="space-y-2">
          <Label htmlFor="keywords" className="text-sm font-medium">
            Topic / Keywords
          </Label>
          <Input
            id="keywords"
            placeholder="e.g., sunset beach, birthday party, coffee morning..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="bg-background"
          />
        </div>

        {/* 情绪选择（只显示前6个） */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Mood (optional)
          </Label>
          <div className="flex flex-wrap gap-2">
            {MOODS_CONFIG.slice(0, 6).map((mood) => {
              const isSelected = selectedMoods.includes(mood.id);
              return (
                <Badge
                  key={mood.id}
                  variant={isSelected ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-all',
                    isSelected && 'bg-primary'
                  )}
                  onClick={() => toggleMood(mood.id)}
                >
                  <span className="mr-1">{mood.icon}</span>
                  {mood.displayName}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            className={cn('flex-1', buttonClass)}
            disabled={isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Captions
              </>
            )}
          </Button>
          <Button variant="outline" asChild>
            <Link href={getFullGeneratorLink()}>
              More Options
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* 生成结果 */}
        {hasGenerated && results.length > 0 && (
          <div className="pt-4 border-t space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Generated Captions</h4>
              <Link 
                href={getFullGeneratorLink()} 
                className="text-sm text-primary hover:underline flex items-center"
              >
                Generate more
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {results.map((caption) => (
                <CaptionCard
                  key={caption.id}
                  caption={caption}
                  platform={platform}
                  showHashtags={platform === PlatformId.INSTAGRAM}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
