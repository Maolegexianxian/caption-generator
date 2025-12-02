/**
 * 生成结果展示组件
 * @description 展示 AI 生成的文案列表
 */

'use client';

import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CaptionList } from '@/components/caption/caption-list';
import { useGeneratorStore } from '@/store/generator-store';

/**
 * 生成结果组件属性
 */
interface GeneratorResultsProps {
  /** 是否显示重新生成按钮 */
  showRegenerate?: boolean;
  /** 重新生成回调 */
  onRegenerate?: () => void;
}

/**
 * 生成结果展示组件
 * @description 展示生成的文案结果，支持重新生成和错误提示
 * @param props - 组件属性
 */
export function GeneratorResults({
  showRegenerate = true,
  onRegenerate,
}: GeneratorResultsProps) {
  /** 从 store 获取状态 */
  const { 
    results, 
    isGenerating, 
    error, 
    platform,
  } = useGeneratorStore();

  /** 是否有结果 */
  const hasResults = results.length > 0;
  /** 是否显示内容 */
  const showContent = hasResults || isGenerating || error;

  if (!showContent) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          {isGenerating ? 'Generating Captions...' : 'Generated Captions'}
        </CardTitle>
        
        {showRegenerate && hasResults && !isGenerating && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Generation Failed</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* 生成结果列表 */}
        <CaptionList
          captions={results}
          platform={platform}
          showHashtags={true}
          loading={isGenerating}
          skeletonCount={6}
          emptyText={error ? 'No captions generated' : 'Click Generate to create captions'}
        />

        {/* 结果统计 */}
        {hasResults && !isGenerating && (
          <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {results.length} caption{results.length !== 1 ? 's' : ''} generated
            </span>
            <span>
              Click on any card to copy
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
