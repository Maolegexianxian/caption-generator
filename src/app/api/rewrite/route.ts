/**
 * 文案改写 API 路由
 * @description 处理 AI 文案改写请求
 */

import { NextRequest, NextResponse } from 'next/server';
import { rewriteCaption, RewriteRequest } from '@/services/ai-service';
import { PlatformId } from '@/types';

/**
 * POST /api/rewrite
 * @description 改写文案内容
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证必需字段
    if (!body.originalContent || typeof body.originalContent !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Original content is required' },
        { status: 400 }
      );
    }

    // 验证平台
    const platformId = body.platformId || PlatformId.INSTAGRAM;
    if (!Object.values(PlatformId).includes(platformId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid platform' },
        { status: 400 }
      );
    }

    // 验证风格
    const validStyles = ['casual', 'professional', 'humorous', 'emotional', 'concise'];
    const style = body.style || 'casual';
    if (!validStyles.includes(style)) {
      return NextResponse.json(
        { success: false, error: 'Invalid style' },
        { status: 400 }
      );
    }

    // 构建请求
    const rewriteRequest: RewriteRequest = {
      originalContent: body.originalContent,
      platformId,
      style: style as RewriteRequest['style'],
      targetLanguage: body.targetLanguage,
      keepEmoji: body.keepEmoji !== false,
    };

    // 调用改写服务
    const result = await rewriteCaption(rewriteRequest);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        rewrites: result.results,
      },
    });
  } catch (error) {
    console.error('Rewrite API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to rewrite caption',
      },
      { status: 500 }
    );
  }
}
