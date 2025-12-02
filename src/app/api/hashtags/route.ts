/**
 * Hashtag API 路由
 * @description 处理 Hashtag 查询和推荐请求
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getRecommendedHashtags,
  getHashtagsByCategory,
  getPopularHashtags,
  searchHashtags,
} from '@/services/hashtag-service';
import { PlatformId } from '@/types';

/**
 * GET /api/hashtags
 * @description 获取推荐的 Hashtag
 * @query categoryId - 分类 ID
 * @query keywords - 关键词
 * @query platformId - 平台 ID
 * @query limit - 数量限制
 * @query search - 搜索关键词（如果提供则执行搜索）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const categoryId = searchParams.get('categoryId') || undefined;
    const keywords = searchParams.get('keywords') || undefined;
    const platformId = searchParams.get('platformId') as PlatformId | undefined;
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const search = searchParams.get('search');

    // 如果有搜索关键词，执行搜索
    if (search) {
      const results = await searchHashtags(search, limit);
      return NextResponse.json({
        success: true,
        data: {
          hashtags: results,
          type: 'search',
        },
      });
    }

    // 如果只有分类 ID，获取分类相关 Hashtag
    if (categoryId && !keywords && !platformId) {
      const results = await getHashtagsByCategory(categoryId, limit);
      return NextResponse.json({
        success: true,
        data: {
          hashtags: results,
          type: 'category',
        },
      });
    }

    // 如果没有任何参数，返回热门 Hashtag
    if (!categoryId && !keywords && !platformId) {
      const results = await getPopularHashtags(limit);
      return NextResponse.json({
        success: true,
        data: {
          hashtags: results,
          type: 'popular',
        },
      });
    }

    // 综合推荐
    const results = await getRecommendedHashtags({
      categoryId,
      keywords,
      platformId,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: {
        hashtags: results,
        type: 'recommended',
      },
    });
  } catch (error) {
    console.error('Hashtag API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get hashtags',
      },
      { status: 500 }
    );
  }
}
