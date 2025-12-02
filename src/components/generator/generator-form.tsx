/**
 * AI 文案生成器表单组件
 * @description 提供完整的生成参数输入界面
 */

'use client';

import { useState, useCallback } from 'react';
import { Sparkles, RefreshCw, MessageCircle, Instagram, Twitter } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useGeneratorStore, selectCanGenerate } from '@/store/generator-store';
import { 
  PlatformId, 
  LengthType, 
  GeneratorFormProps,
  GenerateResponse,
} from '@/types';
import { 
  PLATFORMS_CONFIG, 
  CATEGORIES_CONFIG, 
  MOODS_CONFIG,
  LANGUAGES_CONFIG,
  LENGTH_CONFIG,
  GENERATOR_CONFIG,
} from '@/config/constants';

/**
 * 平台图标映射
 */
const platformIcons: Record<PlatformId, React.ComponentType<{ className?: string }>> = {
  [PlatformId.TELEGRAM]: MessageCircle,
  [PlatformId.INSTAGRAM]: Instagram,
  [PlatformId.X]: Twitter,
};

/**
 * 生成器表单组件
 * @description 提供 AI 文案生成的完整参数输入界面
 * @param props - 组件属性
 */
export function GeneratorForm({
  initialPlatform,
  initialCategory,
  initialMoods,
  simplified = false,
  onGenerate,
}: GeneratorFormProps) {
  /** 生成器状态 */
  const {
    platform,
    category,
    moods,
    keywords,
    lengthType,
    layoutPreset,
    language,
    includeHashtags,
    includeEmoji,
    isGenerating,
    setPlatform,
    setCategory,
    setMoods,
    setKeywords,
    setLengthType,
    setLayoutPreset,
    setLanguage,
    setIncludeHashtags,
    setIncludeEmoji,
    setResults,
    setIsGenerating,
    setError,
  } = useGeneratorStore();

  /** 是否可以提交 */
  const canGenerate = useGeneratorStore(selectCanGenerate);

  /**
   * 初始化状态（仅在首次渲染时）
   */
  useState(() => {
    if (initialPlatform) setPlatform(initialPlatform);
    if (initialCategory) setCategory(initialCategory);
    if (initialMoods) setMoods(initialMoods);
  });

  /**
   * 切换情绪标签选择
   * @param moodId - 情绪 ID
   */
  const toggleMood = useCallback((moodId: string) => {
    const newMoods = moods.includes(moodId)
      ? moods.filter(id => id !== moodId)
      : [...moods, moodId];
    setMoods(newMoods);
  }, [moods, setMoods]);

  /**
   * 处理生成请求
   */
  const handleGenerate = async () => {
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

      // 处理 API 响应格式：{ success: true, data: GenerateResponse }
      if (result.success && result.data) {
        const generateResponse = result.data as GenerateResponse;
        if (generateResponse.success && generateResponse.captions) {
          setResults(generateResponse.captions);
          onGenerate?.(generateResponse);
          toast.success('Captions generated!', {
            description: `${generateResponse.captions.length} captions ready to copy`,
          });
        } else {
          const errorMsg = generateResponse.error || 'Generation failed';
          setError(errorMsg);
          toast.error('Generation failed', { description: errorMsg });
        }
      } else {
        const errorMsg = result.error || 'Generation failed';
        setError(errorMsg);
        toast.error('Generation failed', { description: errorMsg });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMsg);
      toast.error('Failed to generate', { description: errorMsg });
    } finally {
      setIsGenerating(false);
    }
  };

  /** 获取当前平台配置 */
  const currentPlatformConfig = PLATFORMS_CONFIG[platform];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          AI Caption Generator
        </CardTitle>
        <CardDescription>
          Generate engaging captions for your social media posts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 平台选择 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Platform</Label>
          <Tabs 
            value={platform} 
            onValueChange={(value) => setPlatform(value as PlatformId)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              {Object.values(PlatformId).map((platformId) => {
                const config = PLATFORMS_CONFIG[platformId];
                const Icon = platformIcons[platformId];
                
                return (
                  <TabsTrigger 
                    key={platformId} 
                    value={platformId}
                    className="flex items-center"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {config.displayName}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
          <p className="text-xs text-muted-foreground">
            {currentPlatformConfig.description}
          </p>
        </div>

        {/* 分类选择 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Category (Optional)</Label>
          <Select 
            value={category || ''} 
            onValueChange={(value) => setCategory(value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No specific category</SelectItem>
              {CATEGORIES_CONFIG.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <span className="flex items-center">
                    <span className="mr-2">{cat.icon}</span>
                    {cat.displayName}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 情绪/风格选择 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Mood & Style
            {moods.length > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({moods.length} selected)
              </span>
            )}
          </Label>
          <div className="flex flex-wrap gap-2">
            {MOODS_CONFIG.map((mood) => {
              const isSelected = moods.includes(mood.id);
              
              return (
                <Badge
                  key={mood.id}
                  variant={isSelected ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-all',
                    isSelected 
                      ? 'bg-primary hover:bg-primary/90' 
                      : 'hover:bg-accent'
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

        {/* 关键词输入 */}
        <div className="space-y-3">
          <Label htmlFor="keywords" className="text-sm font-medium">
            Keywords (Optional)
          </Label>
          <Textarea
            id="keywords"
            placeholder="e.g., sunset beach, birthday, summer vibes..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="resize-none"
            rows={2}
          />
          <p className="text-xs text-muted-foreground">
            Add specific topics or themes to personalize your captions
          </p>
        </div>

        {/* 高级选项（非简化版本显示） */}
        {!simplified && (
          <>
            {/* 排版预设选择 */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Format Preset</Label>
              <Select 
                value={layoutPreset || ''} 
                onValueChange={(value) => setLayoutPreset(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Auto (Recommended)</SelectItem>
                  {currentPlatformConfig.layoutPresets.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      <div className="flex flex-col">
                        <span>{preset.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {preset.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose a format optimized for {currentPlatformConfig.displayName}
              </p>
            </div>

            {/* 语言和长度选择 */}
            <div className="grid grid-cols-2 gap-4">
              {/* 语言选择 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES_CONFIG.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name} ({lang.nativeName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 长度偏好 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Length</Label>
                <Select 
                  value={lengthType} 
                  onValueChange={(value) => setLengthType(value as LengthType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(LENGTH_CONFIG).map((config) => (
                      <SelectItem key={config.id} value={config.id}>
                        {config.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 附加选项 */}
            <div className="flex flex-wrap gap-6">
              {/* Hashtag 开关 */}
              <div className="flex items-center space-x-3">
                <Switch
                  id="include-hashtags"
                  checked={includeHashtags}
                  onCheckedChange={setIncludeHashtags}
                />
                <Label 
                  htmlFor="include-hashtags" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Include Hashtags
                </Label>
              </div>

              {/* Emoji 开关 */}
              <div className="flex items-center space-x-3">
                <Switch
                  id="include-emoji"
                  checked={includeEmoji}
                  onCheckedChange={setIncludeEmoji}
                />
                <Label 
                  htmlFor="include-emoji" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Include Emojis
                </Label>
              </div>
            </div>
          </>
        )}

        {/* 生成按钮 */}
        <Button
          size="lg"
          className="w-full"
          disabled={!canGenerate}
          onClick={handleGenerate}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Captions
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
