/**
 * Hashtag 服务
 * @description 提供 Hashtag 的查询、推荐和管理功能
 */

import { db } from '@/db';
import { hashtags, categoryHashtags } from '@/db/schema';
import { eq, desc, inArray, sql, like } from 'drizzle-orm';
import { CATEGORY_HASHTAGS, GENERIC_HASHTAGS } from '@/config/constants';
import { PlatformId } from '@/types';

/**
 * Hashtag 推荐参数
 */
export interface HashtagRecommendParams {
  /** 分类 ID */
  categoryId?: string;
  /** 关键词 */
  keywords?: string;
  /** 平台 ID */
  platformId?: PlatformId;
  /** 数量限制 */
  limit?: number;
}

/**
 * 获取分类相关的 Hashtag
 * @param categoryId - 分类 ID
 * @param limit - 数量限制
 * @returns Hashtag 列表
 */
export async function getHashtagsByCategory(categoryId: string, limit = 15): Promise<string[]> {
  try {
    // 首先从数据库获取
    const dbResults = await db
      .select({
        tag: hashtags.tag,
        usageCount: hashtags.usageCount,
      })
      .from(categoryHashtags)
      .innerJoin(hashtags, eq(categoryHashtags.hashtagId, hashtags.id))
      .where(eq(categoryHashtags.categoryId, categoryId))
      .orderBy(desc(hashtags.usageCount))
      .limit(limit);

    if (dbResults.length > 0) {
      return dbResults.map(r => r.tag);
    }

    // 如果数据库没有数据，使用配置文件中的数据
    const configHashtags = CATEGORY_HASHTAGS[categoryId] || [];
    return configHashtags.slice(0, limit);
  } catch (error) {
    console.error('Error getting category hashtags:', error);
    // 降级到配置数据
    return (CATEGORY_HASHTAGS[categoryId] || []).slice(0, limit);
  }
}

/**
 * 获取热门 Hashtag
 * @param limit - 数量限制
 * @param platformId - 平台 ID（可选）
 * @returns Hashtag 列表
 */
export async function getPopularHashtags(limit = 20, platformId?: PlatformId): Promise<string[]> {
  try {
    const results = await db
      .select({
        tag: hashtags.tag,
      })
      .from(hashtags)
      .orderBy(desc(hashtags.usageCount))
      .limit(limit);

    if (results.length > 0) {
      return results.map(r => r.tag);
    }

    // 降级到通用 Hashtag（根据平台选择）
    const platformKey = platformId === PlatformId.X ? 'x' 
      : platformId === PlatformId.TELEGRAM ? 'telegram' 
      : 'instagram';
    return GENERIC_HASHTAGS[platformKey].slice(0, limit);
  } catch (error) {
    console.error('Error getting popular hashtags:', error);
    // 降级处理
    const platformKey = platformId === PlatformId.X ? 'x' 
      : platformId === PlatformId.TELEGRAM ? 'telegram' 
      : 'instagram';
    return GENERIC_HASHTAGS[platformKey].slice(0, limit);
  }
}

/**
 * 搜索 Hashtag
 * @param query - 搜索关键词
 * @param limit - 数量限制
 * @returns Hashtag 列表
 */
export async function searchHashtags(query: string, limit = 10): Promise<string[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const results = await db
      .select({
        tag: hashtags.tag,
      })
      .from(hashtags)
      .where(like(hashtags.tag, `%${query.toLowerCase()}%`))
      .orderBy(desc(hashtags.usageCount))
      .limit(limit);

    return results.map(r => r.tag);
  } catch (error) {
    console.error('Error searching hashtags:', error);
    return [];
  }
}

/**
 * 获取推荐 Hashtag（综合推荐）
 * @param params - 推荐参数
 * @returns Hashtag 列表
 */
export async function getRecommendedHashtags(params: HashtagRecommendParams): Promise<string[]> {
  const {
    categoryId,
    keywords,
    platformId,
    limit = 15,
  } = params;

  const result: string[] = [];

  // 1. 优先获取分类相关的 Hashtag
  if (categoryId) {
    const categoryTags = await getHashtagsByCategory(categoryId, Math.ceil(limit * 0.6));
    result.push(...categoryTags);
  }

  // 2. 如果有关键词，搜索相关 Hashtag
  if (keywords && keywords.trim().length > 0) {
    const keywordParts = keywords.split(/\s+/).filter(k => k.length > 2);
    for (const keyword of keywordParts.slice(0, 3)) {
      const searchTags = await searchHashtags(keyword, 3);
      result.push(...searchTags);
    }
  }

  // 3. 补充热门 Hashtag
  if (result.length < limit) {
    const popularTags = await getPopularHashtags(limit - result.length, platformId);
    result.push(...popularTags);
  }

  // 4. 根据平台限制数量
  let platformLimit = limit;
  if (platformId === PlatformId.X) {
    platformLimit = Math.min(limit, 3); // X 最多 2-3 个
  } else if (platformId === PlatformId.TELEGRAM) {
    platformLimit = Math.min(limit, 5); // Telegram 3-5 个
  }

  // 去重并限制数量
  const uniqueTags = [...new Set(result)];
  return uniqueTags.slice(0, platformLimit);
}

/**
 * 增加 Hashtag 使用次数
 * @param tags - Hashtag 列表
 */
export async function incrementHashtagUsage(tags: string[]): Promise<void> {
  if (!tags || tags.length === 0) return;

  try {
    // 获取现有的 Hashtag
    const normalizedTags = tags.map(t => t.toLowerCase().replace(/^#/, ''));
    
    const existingTags = await db
      .select({ id: hashtags.id, tag: hashtags.tag })
      .from(hashtags)
      .where(inArray(hashtags.tag, normalizedTags));

    // 更新使用次数
    for (const tag of existingTags) {
      await db
        .update(hashtags)
        .set({ usageCount: sql`${hashtags.usageCount} + 1` })
        .where(eq(hashtags.id, tag.id));
    }
  } catch (error) {
    console.error('Error incrementing hashtag usage:', error);
  }
}

/**
 * 获取 Hashtag 统计信息
 * @returns 统计数据
 */
export async function getHashtagStats(): Promise<{
  totalCount: number;
  topHashtags: Array<{ tag: string; usageCount: number }>;
}> {
  try {
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(hashtags);

    const topTags = await db
      .select({
        tag: hashtags.tag,
        usageCount: hashtags.usageCount,
      })
      .from(hashtags)
      .orderBy(desc(hashtags.usageCount))
      .limit(10);

    return {
      totalCount: countResult[0]?.count || 0,
      topHashtags: topTags.map(t => ({
        tag: t.tag,
        usageCount: t.usageCount || 0,
      })),
    };
  } catch (error) {
    console.error('Error getting hashtag stats:', error);
    return {
      totalCount: 0,
      topHashtags: [],
    };
  }
}
