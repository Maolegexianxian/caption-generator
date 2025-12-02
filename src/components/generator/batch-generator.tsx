/**
 * 批量生成组件
 * @description 为同一主题批量生成多天的发帖文案，支持导出
 */

'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  FileText, 
  Loader2, 
  Calendar,
  Copy,
  Check,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { cn, copyToClipboard } from '@/lib/utils';
import { PlatformId, LengthType, GeneratedCaption, GenerateResponse } from '@/types';
import { PLATFORMS_CONFIG, MOODS_CONFIG } from '@/config/constants';

/** 平台配置数组 */
const PLATFORMS_ARRAY = Object.values(PLATFORMS_CONFIG);

/**
 * 批量生成结果项
 */
interface BatchItem {
  /** 日期标签 */
  dayLabel: string;
  /** 生成的文案 */
  captions: GeneratedCaption[];
}

/**
 * 批量生成组件
 */
export function BatchGenerator() {
  /** 平台选择 */
  const [platform, setPlatform] = useState<PlatformId>(PlatformId.INSTAGRAM);
  /** 主题/关键词 */
  const [topic, setTopic] = useState('');
  /** 选中的情绪 */
  const [selectedMood, setSelectedMood] = useState<string>('');
  /** 生成天数 */
  const [days, setDays] = useState(7);
  /** 每天生成数量 */
  const [captionsPerDay, setCaptionsPerDay] = useState(2);
  /** 是否正在生成 */
  const [isGenerating, setIsGenerating] = useState(false);
  /** 生成进度 */
  const [progress, setProgress] = useState(0);
  /** 批量生成结果 */
  const [batchResults, setBatchResults] = useState<BatchItem[]>([]);
  /** 复制状态 */
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  /**
   * 生成日期标签
   */
  const getDayLabel = (dayOffset: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  /**
   * 处理批量生成
   */
  const handleBatchGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic', {
        description: 'What should the captions be about?',
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setBatchResults([]);

    const results: BatchItem[] = [];

    try {
      for (let i = 0; i < days; i++) {
        // 更新进度
        setProgress(Math.round(((i + 1) / days) * 100));

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platformId: platform,
            categoryId: 'general',
            moodIds: selectedMood ? [selectedMood] : [],
            keywords: `${topic} day ${i + 1}`,
            lengthType: LengthType.MEDIUM,
            count: captionsPerDay,
            includeHashtags: true,
            includeEmoji: true,
            language: 'en',
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to generate day ${i + 1}`);
        }

        const generateResponse = data.data as GenerateResponse;

        if (generateResponse.success) {
          results.push({
            dayLabel: getDayLabel(i),
            captions: generateResponse.captions,
          });
          // 实时更新结果
          setBatchResults([...results]);
        }

        // 添加小延迟避免请求过快
        if (i < days - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      toast.success('Batch generation complete!', {
        description: `Generated ${results.length * captionsPerDay} captions for ${days} days`,
      });
    } catch (error) {
      console.error('Batch generation error:', error);
      toast.error('Generation failed', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  /**
   * 复制单条文案
   */
  const handleCopySingle = async (content: string, index: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopiedIndex(index);
      toast.success('Copied!');
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  /**
   * 复制全部文案
   */
  const handleCopyAll = async () => {
    const allContent = batchResults
      .map(item => {
        const captions = item.captions
          .map(c => c.content)
          .join('\n\n');
        return `📅 ${item.dayLabel}\n${captions}`;
      })
      .join('\n\n---\n\n');

    const success = await copyToClipboard(allContent);
    if (success) {
      toast.success('All captions copied!');
    }
  };

  /**
   * 导出为 CSV
   */
  const handleExportCSV = () => {
    const headers = ['Day', 'Date', 'Caption', 'Hashtags', 'Character Count'];
    const rows = batchResults.flatMap((item, dayIndex) =>
      item.captions.map((caption) => [
        `Day ${dayIndex + 1}`,
        item.dayLabel,
        `"${caption.content.replace(/"/g, '""')}"`,
        caption.hashtags?.join(' ') || '',
        caption.content.length.toString(),
      ])
    );

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    downloadFile(csvContent, `captions-${topic}-${days}days.csv`, 'text/csv');
    toast.success('CSV exported!');
  };

  /**
   * 导出为 TXT
   */
  const handleExportTXT = () => {
    const txtContent = batchResults
      .map((item, dayIndex) => {
        const header = `=== Day ${dayIndex + 1} - ${item.dayLabel} ===\n`;
        const captions = item.captions
          .map((c, i) => `[${i + 1}] ${c.content}\n${c.hashtags?.map(h => `#${h}`).join(' ') || ''}`)
          .join('\n\n');
        return header + captions;
      })
      .join('\n\n' + '='.repeat(40) + '\n\n');

    downloadFile(txtContent, `captions-${topic}-${days}days.txt`, 'text/plain');
    toast.success('TXT exported!');
  };

  /**
   * 下载文件
   */
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * 清除结果
   */
  const handleClear = () => {
    setBatchResults([]);
    toast.info('Results cleared');
  };

  return (
    <div className="space-y-6">
      {/* 设置面板 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Batch Caption Generator
          </CardTitle>
          <CardDescription>
            Generate multiple days of captions for consistent posting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 平台和主题 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select 
                value={platform} 
                onValueChange={(v) => setPlatform(v as PlatformId)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS_ARRAY.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <span className="mr-2">{p.icon}</span>
                      {p.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Topic / Theme</Label>
              <Input
                placeholder="e.g., fitness journey, coffee shop..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          </div>

          {/* 情绪选择 */}
          <div className="space-y-2">
            <Label>Mood (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {MOODS_CONFIG.slice(0, 8).map((mood) => (
                <Badge
                  key={mood.id}
                  variant={selectedMood === mood.id ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedMood(
                    selectedMood === mood.id ? '' : mood.id
                  )}
                >
                  <span className="mr-1">{mood.icon}</span>
                  {mood.displayName}
                </Badge>
              ))}
            </div>
          </div>

          {/* 天数和数量 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Days to generate</Label>
                <span className="text-sm text-muted-foreground">{days} days</span>
              </div>
              <Slider
                value={[days]}
                onValueChange={(values: number[]) => setDays(values[0])}
                min={3}
                max={30}
                step={1}
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Captions per day</Label>
                <span className="text-sm text-muted-foreground">{captionsPerDay}</span>
              </div>
              <Slider
                value={[captionsPerDay]}
                onValueChange={(values: number[]) => setCaptionsPerDay(values[0])}
                min={1}
                max={5}
                step={1}
              />
            </div>
          </div>

          {/* 生成按钮 */}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              disabled={isGenerating || !topic.trim()}
              onClick={handleBatchGenerate}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating... {progress}%
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate {days * captionsPerDay} Captions
                </>
              )}
            </Button>
          </div>

          {/* 进度条 */}
          {isGenerating && (
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 结果区域 */}
      {batchResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Generated Captions</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyAll}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy All
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-1" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportTXT}>
                  <FileText className="h-4 w-4 mr-1" />
                  TXT
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {batchResults.map((item, dayIndex) => (
                <div key={dayIndex} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <Calendar className="h-3 w-3 mr-1" />
                      Day {dayIndex + 1}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {item.dayLabel}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {item.captions.map((caption, captionIndex) => {
                      const copyKey = `${dayIndex}-${captionIndex}`;
                      return (
                        <div
                          key={captionIndex}
                          className={cn(
                            'p-3 rounded-lg border bg-card relative group',
                            'hover:border-primary/50 transition-colors'
                          )}
                        >
                          <p className="text-sm pr-8">{caption.content}</p>
                          {caption.hashtags && caption.hashtags.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {caption.hashtags.slice(0, 5).map(h => `#${h}`).join(' ')}
                            </p>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleCopySingle(caption.content, copyKey)}
                          >
                            {copiedIndex === copyKey ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
