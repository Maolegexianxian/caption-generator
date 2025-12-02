/**
 * 生成历史 API 路由
 * @description 处理生成历史的查询和管理
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getGenerationHistory,
  saveGenerationHistory,
} from '@/services/history-service';
import { PlatformId } from '@/types';

/**
 * GET /api/history
 * @description 获取生成历史
 * @query sessionId - 会话 ID（可选）
 * @query limit - 数量限制
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // 获取生成历史
    const history = await getGenerationHistory({
      sessionId: sessionId || undefined,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: {
        history,
        count: history.length,
      },
    });
  } catch (error) {
    console.error('History API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get history',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/history
 * @description 创建生成历史记录
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      sessionId,
      platformId,
      categoryId,
      moodIds,
      keywords,
      generatedContent,
    } = body;

    // 验证必填字段
    if (!platformId || !generatedContent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: platformId, generatedContent',
        },
        { status: 400 }
      );
    }

    // 获取用户 IP（可选）
    const forwardedFor = request.headers.get('x-forwarded-for');
    const userIp = forwardedFor?.split(',')[0]?.trim() || 'unknown';

    // 创建历史记录
    const record = await saveGenerationHistory({
      sessionId: sessionId || `session_${Date.now()}`,
      platformId: platformId as PlatformId,
      categoryId,
      moodId: moodIds?.[0] || undefined,
      keywords,
      generatedCaptions: generatedContent,
      userIp,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: record.id,
        createdAt: record.createdAt,
      },
    });
  } catch (error) {
    console.error('History create error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create history',
      },
      { status: 500 }
    );
  }
}
