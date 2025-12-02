/**
 * 生成器客户端组件
 * @description 处理 URL 参数并初始化生成器状态
 */

'use client';

import { useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { GeneratorForm } from '@/components/generator/generator-form';
import { GeneratorResults } from '@/components/generator/generator-results';
import { useGeneratorStore } from '@/store/generator-store';
import { PlatformId, LengthType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { GENERATOR_CONFIG } from '@/config/constants';
import { toast } from 'sonner';

/**
 * URL 参数处理组件
 * @description 从 URL 读取参数并初始化生成器状态
 */
function UrlParamsHandler() {
  /** 获取 URL 搜索参数 */
  const searchParams = useSearchParams();
  
  /** 获取 store 方法 */
  const { 
    setPlatform, 
    setCategory, 
    setMoods, 
    setKeywords,
    setLengthType,
    setLayoutPreset,
  } = useGeneratorStore();

  /**
   * 从 URL 参数初始化生成器状态
   */
  useEffect(() => {
    // 读取平台参数
    const platform = searchParams.get('platform');
    if (platform) {
      const platformMap: Record<string, PlatformId> = {
        'telegram': PlatformId.TELEGRAM,
        'tg': PlatformId.TELEGRAM,
        'instagram': PlatformId.INSTAGRAM,
        'ig': PlatformId.INSTAGRAM,
        'x': PlatformId.X,
        'twitter': PlatformId.X,
      };
      const platformId = platformMap[platform.toLowerCase()];
      if (platformId) {
        setPlatform(platformId);
      }
    }

    // 读取分类参数
    const category = searchParams.get('category');
    if (category) {
      setCategory(category);
    }

    // 读取情绪参数（支持多个，用逗号分隔）
    const mood = searchParams.get('mood');
    if (mood) {
      const moods = mood.split(',').map(m => m.trim()).filter(Boolean);
      if (moods.length > 0) {
        setMoods(moods);
      }
    }

    // 读取关键词参数
    const keywords = searchParams.get('keywords') || searchParams.get('topic');
    if (keywords) {
      setKeywords(keywords);
    }

    // 读取长度参数
    const length = searchParams.get('length');
    if (length) {
      const lengthMap: Record<string, LengthType> = {
        'short': LengthType.SHORT,
        'medium': LengthType.MEDIUM,
        'long': LengthType.LONG,
      };
      const lengthType = lengthMap[length.toLowerCase()];
      if (lengthType) {
        setLengthType(lengthType);
      }
    }

    // 读取排版预设参数
    const preset = searchParams.get('preset');
    if (preset) {
      setLayoutPreset(preset);
    }
  }, [searchParams, setPlatform, setCategory, setMoods, setKeywords, setLengthType, setLayoutPreset]);

  return null;
}

/**
 * 加载骨架屏组件
 */
function GeneratorSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <div className="space-y-4">
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </div>
  );
}

/**
 * 生成器主内容组件
 * @description 包含表单和结果展示
 */
function GeneratorContent() {
  /** 获取 store 状态和方法 */
  const { 
    setResults, 
    setIsGenerating, 
    setError,
    platform,
    language,
    moods,
    category,
    keywords,
    lengthType,
    layoutPreset,
    includeHashtags,
    includeEmoji,
  } = useGeneratorStore();

  /**
   * 处理重新生成
   * @description 使用当前参数重新调用 API 生成文案
   */
  const handleRegenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platformId: platform,
          language,
          moodIds: moods,
          categoryId: category,
          keywords,
          lengthType,
          layoutPresetId: layoutPreset,
          includeHashtags,
          includeEmoji,
          count: GENERATOR_CONFIG.defaultCount,
        }),
      });

      const result = await response.json();

      if (result.success || result.data?.success) {
        const captions = result.captions || result.data?.captions || [];
        setResults(captions);
        toast.success('Captions regenerated!', {
          description: `${captions.length} new captions generated`,
        });
      } else {
        const errorMsg = result.error || result.data?.error || 'Regeneration failed';
        setError(errorMsg);
        toast.error('Failed to regenerate', {
          description: errorMsg,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMsg);
      toast.error('Failed to regenerate', {
        description: errorMsg,
      });
    } finally {
      setIsGenerating(false);
    }
  }, [
    platform, language, moods, category, keywords, lengthType, 
    layoutPreset, includeHashtags, includeEmoji,
    setResults, setIsGenerating, setError
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {/* 生成器表单 */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <GeneratorForm />
      </div>

      {/* 生成结果 */}
      <div>
        <GeneratorResults 
          showRegenerate={true}
          onRegenerate={handleRegenerate}
        />
      </div>
    </div>
  );
}

/**
 * 生成器客户端包装组件
 * @description 包装 URL 参数处理和主内容
 */
export function GeneratorClient() {
  return (
    <Suspense fallback={<GeneratorSkeleton />}>
      <UrlParamsHandler />
      <GeneratorContent />
    </Suspense>
  );
}
