/**
 * Hashtag 服务
 * @description 提供 Hashtag 的查询、推荐和管理功能
 * @note 当前版本使用静态配置数据，无需数据库
 */

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
 * 获取分类相关的 Hashtag（静态配置版本）
 * @param categoryId - 分类 ID
 * @param limit - 数量限制
 * @returns Hashtag 列表
 */
export async function getHashtagsByCategory(categoryId: string, limit = 15): Promise<string[]> {
  // 直接从配置获取
  const configHashtags = CATEGORY_HASHTAGS[categoryId] || [];
  return configHashtags.slice(0, limit);
}

/**
 * 获取热门 Hashtag（静态配置版本）
 * @param limit - 数量限制
 * @param platformId - 平台 ID（可选）
 * @returns Hashtag 列表
 */
export async function getPopularHashtags(limit = 20, platformId?: PlatformId): Promise<string[]> {
  // 根据平台选择通用 Hashtag
  const platformKey = platformId === PlatformId.X ? 'x' 
    : platformId === PlatformId.TELEGRAM ? 'telegram' 
    : 'instagram';
  return GENERIC_HASHTAGS[platformKey].slice(0, limit);
}

/**
 * 搜索 Hashtag（静态配置版本）
 * @param query - 搜索关键词
 * @param limit - 数量限制
 * @returns Hashtag 列表
 */
export async function searchHashtags(query: string, limit = 10): Promise<string[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = query.toLowerCase();
  const allHashtags: string[] = [];
  
  // 从所有分类收集 hashtags
  Object.values(CATEGORY_HASHTAGS).forEach(tags => {
    allHashtags.push(...tags);
  });
  
  // 从通用 hashtags 收集
  Object.values(GENERIC_HASHTAGS).forEach(tags => {
    allHashtags.push(...tags);
  });
  
  // 去重并搜索
  const uniqueHashtags = [...new Set(allHashtags)];
  const matchedHashtags = uniqueHashtags
    .filter(tag => tag.toLowerCase().includes(normalizedQuery))
    .slice(0, limit);

  return matchedHashtags;
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
 * 增加 Hashtag 使用次数（静态版本 - 无操作）
 * @param tags - Hashtag 列表
 * @note 当前版本不追踪使用次数
 */
export async function incrementHashtagUsage(tags: string[]): Promise<void> {
  // 静态配置版本，无需追踪使用次数
  // 后续接入数据库后可启用
  void tags;
}

/**
 * 获取 Hashtag 统计信息（静态配置版本）
 * @returns 统计数据
 */
export async function getHashtagStats(): Promise<{
  totalCount: number;
  topHashtags: Array<{ tag: string; usageCount: number }>;
}> {
  // 从配置计算总数
  const allHashtags: string[] = [];
  
  Object.values(CATEGORY_HASHTAGS).forEach(tags => {
    allHashtags.push(...tags);
  });
  Object.values(GENERIC_HASHTAGS).forEach(tags => {
    allHashtags.push(...tags);
  });
  
  const uniqueHashtags = [...new Set(allHashtags)];
  
  // 返回前10个作为"热门"
  const topHashtags = uniqueHashtags.slice(0, 10).map(tag => ({
    tag,
    usageCount: 0, // 静态版本没有使用统计
  }));

  return {
    totalCount: uniqueHashtags.length,
    topHashtags,
  };
}
