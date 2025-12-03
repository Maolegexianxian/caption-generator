/**
 * 搜索 API 路由
 * @description 提供全站文案搜索功能，支持按平台、分类、情绪筛选
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { captions, categories, moods } from '@/db/schema';
import { eq, and, like, desc, sql, or, inArray } from 'drizzle-orm';
import { ApiResponse, PlatformId } from '@/types';

/**
 * 搜索结果类型
 */
interface SearchResult {
  /** 文案列表 */
  captions: Array<{
    id: string;
    content: string;
    formattedContent: string | null;
    platformId: string | null;
    categoryId: string | null;
    moodId: string | null;
    characterCount: number | null;
    copyCount: number | null;
  }>;
  /** 匹配的分类 */
  categories: Array<{
    id: string;
    displayName: string;
    slug: string;
    icon: string | null;
  }>;
  /** 匹配的情绪标签 */
  moods: Array<{
    id: string;
    displayName: string;
    slug: string;
    icon: string | null;
  }>;
  /** 总数 */
  total: number;
  /** 查询关键词 */
  query: string;
}

/**
 * GET /api/search
 * @description 搜索文案、分类和情绪标签
 * @param request - Next.js 请求对象
 * @returns 搜索结果
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<SearchResult>>> {
  try {
    const { searchParams } = new URL(request.url);
    
    /** 搜索关键词 */
    const query = searchParams.get('q') || '';
    /** 平台 ID */
    const platformId = searchParams.get('platform') as PlatformId | null;
    /** 分类 ID */
    const categoryId = searchParams.get('category');
    /** 情绪 ID 列表（逗号分隔） */
    const moodIdsParam = searchParams.get('moods');
    const moodIds = moodIdsParam ? moodIdsParam.split(',').filter(Boolean) : [];
    /** 每页数量 */
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    /** 偏移量 */
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // 如果没有搜索关键词且没有筛选条件，返回空结果
    if (!query && !platformId && !categoryId && moodIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          captions: [],
          categories: [],
          moods: [],
          total: 0,
          query: '',
        },
      });
    }

    // 构建文案查询条件
    const captionConditions = [];
    
    // 关键词搜索（搜索内容）
    if (query) {
      captionConditions.push(like(captions.content, `%${query}%`));
    }
    
    // 平台筛选
    if (platformId && Object.values(PlatformId).includes(platformId)) {
      captionConditions.push(eq(captions.platformId, platformId));
    }
    
    // 分类筛选
    if (categoryId) {
      captionConditions.push(eq(captions.categoryId, categoryId));
    }
    
    // 情绪筛选
    if (moodIds.length > 0) {
      captionConditions.push(inArray(captions.moodId, moodIds));
    }
    
    // 只查询启用的文案
    captionConditions.push(eq(captions.isActive, true));

    // 查询文案
    const captionResults = await db
      .select({
        id: captions.id,
        content: captions.content,
        formattedContent: captions.formattedContent,
        platformId: captions.platformId,
        categoryId: captions.categoryId,
        moodId: captions.moodId,
        characterCount: captions.characterCount,
        copyCount: captions.copyCount,
      })
      .from(captions)
      .where(and(...captionConditions))
      .orderBy(desc(captions.copyCount))
      .limit(limit)
      .offset(offset);

    // 获取总数
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(captions)
      .where(and(...captionConditions));
    
    const total = countResult[0]?.count || 0;

    // 搜索匹配的分类（如果有关键词）
    let categoryResults: Array<{
      id: string;
      displayName: string;
      slug: string;
      icon: string | null;
    }> = [];
    
    if (query) {
      categoryResults = await db
        .select({
          id: categories.id,
          displayName: categories.displayName,
          slug: categories.slug,
          icon: categories.icon,
        })
        .from(categories)
        .where(
          and(
            eq(categories.isActive, true),
            or(
              like(categories.name, `%${query}%`),
              like(categories.displayName, `%${query}%`)
            )
          )
        )
        .limit(10);
    }

    // 搜索匹配的情绪标签（如果有关键词）
    let moodResults: Array<{
      id: string;
      displayName: string;
      slug: string;
      icon: string | null;
    }> = [];
    
    if (query) {
      moodResults = await db
        .select({
          id: moods.id,
          displayName: moods.displayName,
          slug: moods.slug,
          icon: moods.icon,
        })
        .from(moods)
        .where(
          and(
            eq(moods.isActive, true),
            or(
              like(moods.name, `%${query}%`),
              like(moods.displayName, `%${query}%`)
            )
          )
        )
        .limit(10);
    }

    return NextResponse.json({
      success: true,
      data: {
        captions: captionResults,
        categories: categoryResults,
        moods: moodResults,
        total,
        query,
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
        errorCode: 'SEARCH_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/search
 * @description 处理 CORS 预检请求
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
