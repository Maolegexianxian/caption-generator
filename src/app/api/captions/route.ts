/**
 * 文案列表 API 路由
 * @description 查询文案列表，支持筛选、排序和分页
 */

import { NextRequest, NextResponse } from 'next/server';
import { queryCaptions, CaptionQueryParams } from '@/services/caption-service';
import { PlatformId, LengthType } from '@/types';

/**
 * GET /api/captions
 * @description 获取文案列表
 * @param request - Next.js 请求对象
 * @returns 文案列表响应
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 解析查询参数
    const params: CaptionQueryParams = {
      platformId: searchParams.get('platform') as PlatformId | undefined,
      categoryId: searchParams.get('category') || undefined,
      moodIds: searchParams.get('moods')?.split(',').filter(Boolean),
      lengthType: searchParams.get('length') as LengthType | undefined,
      searchTerm: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sort') as 'newest' | 'popular' | 'shortest' | 'longest') || 'newest',
      limit: parseInt(searchParams.get('limit') || '20', 10),
      offset: parseInt(searchParams.get('offset') || '0', 10),
    };

    // 查询文案
    const result = await queryCaptions(params);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Captions API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch captions',
        errorCode: 'FETCH_ERROR',
      },
      { status: 500 }
    );
  }
}
