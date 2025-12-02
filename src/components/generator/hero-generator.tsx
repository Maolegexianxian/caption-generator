/**
 * 首页 Hero 生成器组件
 * @description 首页核心交互组件，支持无需跳转直接生成文案
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Tabs, 
  Tab, 
  Input, 
  Select, 
  SelectItem, 
  Button, 
  Card as NextUICard, 
  CardBody,
  Switch
} from '@heroui/react';
import { Sparkles, MessageCircle, Instagram, Twitter, ArrowRight, Wand2, Globe } from 'lucide-react';
import { PlatformId, GenerateResponse, GeneratedCaption, LengthType } from '@/types';
import { PLATFORMS_CONFIG, MOODS_CONFIG, LANGUAGES_CONFIG } from '@/config/constants';
import { CaptionCard } from '@/components/caption/caption-card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * 平台图标映射
 */
const platformIcons = {
  [PlatformId.TELEGRAM]: <MessageCircle className="w-5 h-5" />,
  [PlatformId.INSTAGRAM]: <Instagram className="w-5 h-5" />,
  [PlatformId.X]: <Twitter className="w-5 h-5" />,
};

/**
 * 获取平台主题色配置
 */
const getPlatformTheme = (platform: PlatformId) => {
  switch (platform) {
    case PlatformId.INSTAGRAM:
      return {
        primary: "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500",
        text: "text-pink-600",
        border: "group-data-[selected=true]:border-pink-600",
        tabContent: "group-data-[selected=true]:text-pink-600",
        buttonShadow: "shadow-pink-500/25",
        iconColor: "text-pink-500"
      };
    case PlatformId.TELEGRAM:
      return {
        primary: "bg-[#229ED9]",
        text: "text-[#229ED9]",
        border: "group-data-[selected=true]:border-[#229ED9]",
        tabContent: "group-data-[selected=true]:text-[#229ED9]",
        buttonShadow: "shadow-blue-500/25",
        iconColor: "text-[#229ED9]"
      };
    case PlatformId.X:
      return {
        primary: "bg-black dark:bg-white",
        text: "text-black dark:text-white",
        border: "group-data-[selected=true]:border-black dark:group-data-[selected=true]:border-white",
        tabContent: "group-data-[selected=true]:text-black dark:group-data-[selected=true]:text-white",
        buttonShadow: "shadow-gray-500/25",
        iconColor: "text-black dark:text-white"
      };
    default:
      return {
        primary: "bg-primary",
        text: "text-primary",
        border: "group-data-[selected=true]:border-primary",
        tabContent: "group-data-[selected=true]:text-primary",
        buttonShadow: "shadow-primary/25",
        iconColor: "text-primary"
      };
  }
};

/**
 * Hero 生成器组件
 */
export function HeroGenerator() {
  // =============== 状态管理 ===============
  
  /** 当前选择的平台 */
  const [platform, setPlatform] = useState<PlatformId>(PlatformId.INSTAGRAM);
  /** 主题/关键词 */
  const [topic, setTopic] = useState('');
  /** 情绪/风格 */
  const [mood, setMood] = useState<string>('');
  /** 语言选择 */
  const [language, setLanguage] = useState<string>('en');
  /** 是否包含 Emoji */
  const [includeEmoji, setIncludeEmoji] = useState(true);
  /** 是否正在生成 */
  const [isGenerating, setIsGenerating] = useState(false);
  /** 生成结果 */
  const [results, setResults] = useState<GeneratedCaption[]>([]);
  /** 是否已执行过生成（用于展示结果区域） */
  const [hasGenerated, setHasGenerated] = useState(false);
  /** 是否展开高级选项 */
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 获取当前平台主题
  const theme = getPlatformTheme(platform);

  // =============== 事件处理 ===============

  /**
   * 处理生成操作
   */
  const handleGenerate = async () => {
    // 基础验证
    if (!topic.trim()) {
      toast.error('Please enter a topic', {
        description: 'What should the caption be about?',
      });
      return;
    }

    setIsGenerating(true);
    setResults([]);
    
    try {
      // 构建请求参数
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platformId: platform,
          categoryId: 'general', // 首页默认通用分类
          moodIds: mood ? [mood] : [],
          keywords: topic,
          lengthType: LengthType.MEDIUM,
          count: 3, // 首页快速生成，数量少一点以提高速度
          includeHashtags: true,
          includeEmoji,
          language,
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
        toast.success('Captions generated successfully!');
      } else {
        throw new Error(generateResponse.error || 'Generation failed');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate captions', {
        description: error instanceof Error ? error.message : 'Please try again later',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* 生成器表单卡片 */}
      <NextUICard className="w-full shadow-2xl border border-white/20 bg-white/90 backdrop-blur-xl dark:bg-zinc-900/90 dark:border-white/10 overflow-visible">
        <CardBody className="p-6 sm:p-8 gap-8">
          
          {/* 1. 平台选择 Tabs */}
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground ml-1">Select Platform</span>
            <Tabs 
              aria-label="Platform Selection" 
              variant="underlined"
              classNames={{
                tabList: "gap-8 w-full relative rounded-none p-0 border-b border-divider",
                cursor: cn("w-full", theme.primary),
                tab: "max-w-fit px-0 h-12",
                tabContent: cn("text-default-500 group-data-[selected=true]:font-semibold transition-colors", theme.tabContent)
              }}
              selectedKey={platform}
              onSelectionChange={(key) => setPlatform(key as PlatformId)}
            >
              {Object.values(PlatformId).map((id) => (
                <Tab
                  key={id}
                  title={
                    <div className="flex items-center space-x-2">
                      {platformIcons[id]}
                      <span>{PLATFORMS_CONFIG[id].displayName}</span>
                    </div>
                  }
                />
              ))}
            </Tabs>
          </div>

          {/* 2. 输入区域 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 主题输入框 (占据 2/3) */}
            <div className="md:col-span-2">
              <Input
                type="text"
                label="Topic or Keywords"
                placeholder="e.g., Sunset at the beach, New coffee shop..."
                value={topic}
                onValueChange={setTopic}
                variant="bordered"
                labelPlacement="outside"
                radius="md"
                size="lg"
                classNames={{
                  label: "text-base font-medium mb-2 text-foreground/80",
                  inputWrapper: "h-14 border-default-200 hover:border-default-400 focus-within:border-foreground/50 bg-default-50/50 transition-colors",
                  innerWrapper: "gap-3",
                  input: "text-base"
                }}
                startContent={<Sparkles className={cn("w-5 h-5", theme.iconColor)} />}
              />
            </div>

            {/* 情绪选择 (占据 1/3) */}
            <div className="md:col-span-1">
              <Select
                label="Tone / Mood"
                placeholder="Select a tone"
                selectedKeys={mood ? [mood] : []}
                onChange={(e) => setMood(e.target.value)}
                variant="bordered"
                labelPlacement="outside"
                radius="md"
                size="lg"
                classNames={{
                  label: "text-base font-medium mb-2 text-foreground/80",
                  trigger: "h-14 border-default-200 hover:border-default-400 focus-within:border-foreground/50 bg-default-50/50 transition-colors",
                  value: "text-base"
                }}
                startContent={<Wand2 className={cn("w-5 h-5", theme.iconColor)} />}
              >
                {MOODS_CONFIG.map((m) => (
                  <SelectItem key={m.id} startContent={<span className="text-lg">{m.icon}</span>}>
                    {m.displayName}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {/* 3. 高级选项（可折叠） */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
            >
              <span className={cn("mr-2 transition-transform", showAdvanced && "rotate-90")}>▶</span>
              Advanced Options
            </button>
            
            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-default-50/50 rounded-lg border border-default-200">
                {/* 语言选择 */}
                <Select
                  label="Language"
                  selectedKeys={[language]}
                  onChange={(e) => setLanguage(e.target.value)}
                  variant="bordered"
                  labelPlacement="outside"
                  radius="md"
                  size="sm"
                  classNames={{
                    label: "text-sm font-medium text-foreground/80",
                    trigger: "h-10 border-default-200",
                  }}
                  startContent={<Globe className="w-4 h-4 text-default-400" />}
                >
                  {LANGUAGES_CONFIG.map((lang) => (
                    <SelectItem key={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </Select>

                {/* Emoji 开关 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground/80">Include Emojis</span>
                  <Switch
                    isSelected={includeEmoji}
                    onValueChange={setIncludeEmoji}
                    size="sm"
                    classNames={{
                      wrapper: cn(includeEmoji && theme.primary)
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. 生成按钮 */}
          <div className="flex justify-end pt-2">
            <Button
              size="lg"
              className={cn(
                "w-full md:w-auto font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90",
                theme.primary,
                theme.buttonShadow
              )}
              endContent={!isGenerating && <Sparkles className="w-5 h-5" />}
              isLoading={isGenerating}
              onPress={handleGenerate}
            >
              {isGenerating ? 'Creating Magic...' : 'Generate Captions'}
            </Button>
          </div>

        </CardBody>
      </NextUICard>

      {/* 结果展示区域 */}
      {hasGenerated && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-bold flex items-center text-foreground">
              <Sparkles className={cn("w-6 h-6 mr-2", theme.text)} />
              Generated Results
            </h3>
            <Button 
              variant="light" 
              className={cn("font-medium", theme.text)}
              as={Link}
              href="/generator"
              endContent={<ArrowRight className="w-4 h-4" />}
            >
              View All Options
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.map((caption, index) => (
              <div 
                key={caption.id} 
                className="h-full animate-in zoom-in-95 fade-in duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CaptionCard 
                  caption={caption}
                  platform={platform}
                  showHashtags={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

