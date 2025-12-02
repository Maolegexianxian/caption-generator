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
  CardBody
} from '@heroui/react';
import { Sparkles, MessageCircle, Instagram, Twitter, ArrowRight } from 'lucide-react';
import { PlatformId, GenerateResponse, GeneratedCaption, LengthType } from '@/types';
import { PLATFORMS_CONFIG, MOODS_CONFIG, GENERATOR_CONFIG } from '@/config/constants';
import { CaptionCard } from '@/components/caption/caption-card';
import { toast } from 'sonner';

/**
 * 平台图标映射
 */
const platformIcons = {
  [PlatformId.TELEGRAM]: <MessageCircle className="w-4 h-4" />,
  [PlatformId.INSTAGRAM]: <Instagram className="w-4 h-4" />,
  [PlatformId.X]: <Twitter className="w-4 h-4" />,
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
  /** 是否正在生成 */
  const [isGenerating, setIsGenerating] = useState(false);
  /** 生成结果 */
  const [results, setResults] = useState<GeneratedCaption[]>([]);
  /** 是否已执行过生成（用于展示结果区域） */
  const [hasGenerated, setHasGenerated] = useState(false);

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
          includeEmoji: true,
          language: 'en', // 默认英语
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
      <NextUICard className="w-full shadow-xl border border-white/20 bg-white/80 backdrop-blur-md dark:bg-black/80 dark:border-white/10">
        <CardBody className="p-6 sm:p-8 gap-6">
          
          {/* 1. 平台选择 Tabs */}
          <Tabs 
            aria-label="Platform Selection" 
            color="primary" 
            variant="underlined"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-primary text-lg"
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

          {/* 2. 输入区域 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                radius="sm"
                classNames={{
                  label: "text-base font-medium mb-2",
                  inputWrapper: "h-12 border-default-200 hover:border-primary focus-within:border-primary"
                }}
                startContent={<Sparkles className="w-4 h-4 text-default-400" />}
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
                radius="sm"
                classNames={{
                  label: "text-base font-medium mb-2",
                  trigger: "h-12 border-default-200 hover:border-primary focus-within:border-primary"
                }}
              >
                {MOODS_CONFIG.map((m) => (
                  <SelectItem key={m.id} startContent={<span className="text-lg">{m.icon}</span>}>
                    {m.displayName}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {/* 3. 生成按钮 */}
          <div className="flex justify-end mt-2">
            <Button
              color="primary"
              size="lg"
              className="w-full md:w-auto font-semibold text-white shadow-lg shadow-primary/30 bg-gradient-to-r from-primary to-purple-600"
              endContent={!isGenerating && <Sparkles className="w-5 h-5" />}
              isLoading={isGenerating}
              onPress={handleGenerate}
            >
              {isGenerating ? 'Generating Magic...' : 'Generate Captions'}
            </Button>
          </div>

        </CardBody>
      </NextUICard>

      {/* 结果展示区域 */}
      {hasGenerated && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold flex items-center">
              <Sparkles className="w-6 h-6 text-primary mr-2" />
              Generated Results
            </h3>
            <Button 
              variant="light" 
              color="primary" 
              as={Link}
              href="/generator"
              endContent={<ArrowRight className="w-4 h-4" />}
            >
              View More Options
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.map((caption) => (
              <div key={caption.id} className="h-full">
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
