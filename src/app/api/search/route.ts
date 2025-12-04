/**
 * 搜索 API 路由
 * @description 提供全站文案搜索功能，支持按平台、分类、情绪筛选
 * @note 当前版本使用静态配置数据，无需数据库
 */

import { NextRequest, NextResponse } from 'next/server';
import { CATEGORIES_CONFIG, MOODS_CONFIG } from '@/config/constants';
import { ApiResponse, PlatformId } from '@/types';

/**
 * 搜索结果类型
 */
interface SearchResult {
  /** 文案列表 - 当前版本不支持文案搜索 */
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
 * @description 搜索分类和情绪标签（静态配置版本）
 * @param request - Next.js 请求对象
 * @returns 搜索结果
 * @note 当前版本不支持文案搜索，仅搜索分类和情绪
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<SearchResult>>> {
  try {
    const { searchParams } = new URL(request.url);
    
    /** 搜索关键词 */
    const query = searchParams.get('q') || '';

    // 如果没有搜索关键词，返回空结果
    if (!query) {
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

    const normalizedQuery = query.toLowerCase();

    // 搜索匹配的分类（从静态配置）
    const categoryResults = CATEGORIES_CONFIG
      .filter(cat => 
        cat.name.toLowerCase().includes(normalizedQuery) ||
        cat.displayName.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 10)
      .map(cat => ({
        id: cat.id,
        displayName: cat.displayName,
        slug: cat.slug,
        icon: cat.icon,
      }));

    // 搜索匹配的情绪标签（从静态配置）
    const moodResults = MOODS_CONFIG
      .filter(mood => 
        mood.name.toLowerCase().includes(normalizedQuery) ||
        mood.displayName.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 10)
      .map(mood => ({
        id: mood.id,
        displayName: mood.displayName,
        slug: mood.slug,
        icon: mood.icon,
      }));

    return NextResponse.json({
      success: true,
      data: {
        captions: [], // 当前版本不支持文案搜索
        categories: categoryResults,
        moods: moodResults,
        total: categoryResults.length + moodResults.length,
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
