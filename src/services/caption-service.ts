/**
 * 文案服务层
 * @description 提供文案的数据库操作，包括查询、创建、更新等
 */

import { db } from '@/db';
import { captions, hashtags, categoryHashtags } from '@/db/schema';
import { eq, desc, asc, and, inArray, sql, like } from 'drizzle-orm';
import { PlatformId, LengthType } from '@/types';
import { generateUniqueId } from '@/lib/utils';

/**
 * 文案查询参数
 */
export interface CaptionQueryParams {
  /** 平台 ID */
  platformId?: PlatformId;
  /** 分类 ID */
  categoryId?: string;
  /** 情绪 ID 列表 */
  moodIds?: string[];
  /** 长度类型 */
  lengthType?: LengthType;
  /** 搜索关键词 */
  searchTerm?: string;
  /** 排序方式 */
  sortBy?: 'newest' | 'popular' | 'shortest' | 'longest';
  /** 每页数量 */
  limit?: number;
  /** 偏移量 */
  offset?: number;
}

/**
 * 文案查询结果
 */
export interface CaptionQueryResult {
  /** 文案列表 */
  captions: typeof captions.$inferSelect[];
  /** 总数 */
  total: number;
  /** 是否有更多 */
  hasMore: boolean;
}

/**
 * 创建文案参数
 */
export interface CreateCaptionParams {
  /** 文案内容 */
  content: string;
  /** 格式化后的内容 */
  formattedContent?: string;
  /** 平台 ID */
  platformId: PlatformId;
  /** 分类 ID */
  categoryId?: string;
  /** 情绪 ID */
  moodId?: string;
  /** 语言代码 */
  language?: string;
  /** 长度类型 */
  lengthType?: LengthType;
  /** Hashtag 列表 */
  hashtags?: string[];
  /** 是否包含 emoji */
  hasEmoji?: boolean;
}

/**
 * 根据条件查询文案
 * @param params - 查询参数
 * @returns 文案列表和分页信息
 */
export async function queryCaptions(params: CaptionQueryParams): Promise<CaptionQueryResult> {
  const {
    platformId,
    categoryId,
    moodIds,
    lengthType,
    searchTerm,
    sortBy = 'newest',
    limit = 20,
    offset = 0,
  } = params;

  try {
    // 构建查询条件
    const conditions = [];
    
    if (platformId) {
      conditions.push(eq(captions.platformId, platformId));
    }
    
    if (categoryId) {
      conditions.push(eq(captions.categoryId, categoryId));
    }
    
    if (moodIds && moodIds.length > 0) {
      conditions.push(inArray(captions.moodId, moodIds));
    }
    
    if (lengthType) {
      conditions.push(eq(captions.lengthType, lengthType));
    }
    
    if (searchTerm) {
      conditions.push(like(captions.content, `%${searchTerm}%`));
    }

    // 构建排序
    let orderBy;
    switch (sortBy) {
      case 'popular':
        orderBy = desc(captions.copyCount);
        break;
      case 'shortest':
        orderBy = asc(captions.characterCount);
        break;
      case 'longest':
        orderBy = desc(captions.characterCount);
        break;
      case 'newest':
      default:
        orderBy = desc(captions.createdAt);
        break;
    }

    // 执行查询
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const results = await db
      .select()
      .from(captions)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // 获取总数
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(captions)
      .where(whereClause);
    
    const total = countResult[0]?.count || 0;

    return {
      captions: results,
      total,
      hasMore: offset + results.length < total,
    };
  } catch (error) {
    console.error('Error querying captions:', error);
    throw new Error('Failed to query captions');
  }
}

/**
 * 根据 ID 获取单条文案
 * @param id - 文案 ID
 * @returns 文案对象或 null
 */
export async function getCaptionById(id: string) {
  try {
    const result = await db
      .select()
      .from(captions)
      .where(eq(captions.id, id))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error('Error getting caption:', error);
    return null;
  }
}

/**
 * 创建新文案
 * @param params - 创建参数
 * @returns 创建的文案对象
 */
export async function createCaption(params: CreateCaptionParams) {
  const {
    content,
    formattedContent,
    platformId,
    categoryId,
    moodId,
    language = 'en',
    lengthType,
  } = params;

  try {
    const id = generateUniqueId();
    const now = new Date().toISOString();
    
    // 计算长度类型（如果未提供）
    const calculatedLengthType = lengthType || calculateLengthType(content.length);
    
    const newCaption = {
      id,
      content,
      formattedContent: formattedContent || content,
      platformId,
      categoryId: categoryId || null,
      moodId: moodId || null,
      language,
      lengthType: calculatedLengthType,
      characterCount: content.length,
      copyCount: 0,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(captions).values(newCaption);
    
    return newCaption;
  } catch (error) {
    console.error('Error creating caption:', error);
    throw new Error('Failed to create caption');
  }
}

/**
 * 更新文案复制次数
 * @param id - 文案 ID
 */
export async function incrementCaptionCopyCount(id: string) {
  try {
    await db
      .update(captions)
      .set({ 
        copyCount: sql`${captions.copyCount} + 1`,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(captions.id, id));
  } catch (error) {
    console.error('Error incrementing copy count:', error);
  }
}

/**
 * 更新文案查看次数
 * @param id - 文案 ID
 */
export async function incrementCaptionViewCount(id: string) {
  try {
    await db
      .update(captions)
      .set({ 
        viewCount: sql`${captions.viewCount} + 1`,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(captions.id, id));
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
}

/**
 * 获取分类下的 Hashtag 列表
 * @param categoryId - 分类 ID
 * @returns Hashtag 列表
 */
export async function getHashtagsByCategory(categoryId: string): Promise<string[]> {
  try {
    const result = await db
      .select({
        tag: hashtags.tag,
      })
      .from(categoryHashtags)
      .innerJoin(hashtags, eq(categoryHashtags.hashtagId, hashtags.id))
      .where(eq(categoryHashtags.categoryId, categoryId));
    
    return result.map(r => r.tag);
  } catch (error) {
    console.error('Error getting hashtags:', error);
    return [];
  }
}

/**
 * 获取热门文案
 * @param platformId - 平台 ID
 * @param limit - 数量限制
 * @returns 热门文案列表
 */
export async function getPopularCaptions(platformId?: PlatformId, limit = 10) {
  try {
    const conditions = platformId ? eq(captions.platformId, platformId) : undefined;
    
    const result = await db
      .select()
      .from(captions)
      .where(conditions)
      .orderBy(desc(captions.copyCount))
      .limit(limit);
    
    return result;
  } catch (error) {
    console.error('Error getting popular captions:', error);
    return [];
  }
}

/**
 * 根据字符数计算长度类型
 * @param charCount - 字符数
 * @returns 长度类型
 */
function calculateLengthType(charCount: number): LengthType {
  if (charCount <= 80) {
    return LengthType.SHORT;
  } else if (charCount <= 200) {
    return LengthType.MEDIUM;
  } else {
    return LengthType.LONG;
  }
}

/**
 * 批量创建文案
 * @param captionsList - 文案列表
 * @returns 创建的文案数量
 */
export async function batchCreateCaptions(captionsList: CreateCaptionParams[]): Promise<number> {
  try {
    const now = new Date().toISOString();
    const captionsToInsert = captionsList.map(params => ({
      id: generateUniqueId(),
      content: params.content,
      formattedContent: params.formattedContent || params.content,
      platformId: params.platformId,
      categoryId: params.categoryId || null,
      moodId: params.moodId || null,
      language: params.language || 'en',
      lengthType: params.lengthType || calculateLengthType(params.content.length),
      characterCount: params.content.length,
      copyCount: 0,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    }));

    await db.insert(captions).values(captionsToInsert);
    
    return captionsToInsert.length;
  } catch (error) {
    console.error('Error batch creating captions:', error);
    throw new Error('Failed to batch create captions');
  }
}

/**
 * 获取分类页面文案（用于 SEO 落地页）
 * @param platformId - 平台 ID
 * @param categoryId - 分类 ID
 * @param limit - 数量限制
 * @returns 文案列表及相关标签
 */
export async function getCategoryPageCaptions(
  platformId: PlatformId,
  categoryId: string,
  limit = 12
): Promise<{
  captions: typeof captions.$inferSelect[];
  hashtags: string[];
}> {
  try {
    // 获取分类文案
    const captionResults = await db
      .select()
      .from(captions)
      .where(
        and(
          eq(captions.platformId, platformId),
          eq(captions.categoryId, categoryId),
          eq(captions.isActive, true)
        )
      )
      .orderBy(desc(captions.isFeatured), desc(captions.copyCount))
      .limit(limit);

    // 获取分类相关 Hashtag
    const hashtagResults = await db
      .select({ tag: hashtags.tag })
      .from(categoryHashtags)
      .innerJoin(hashtags, eq(categoryHashtags.hashtagId, hashtags.id))
      .where(eq(categoryHashtags.categoryId, categoryId))
      .orderBy(desc(hashtags.usageCount))
      .limit(10);

    return {
      captions: captionResults,
      hashtags: hashtagResults.map(h => h.tag),
    };
  } catch (error) {
    console.error('Error getting category page captions:', error);
    return {
      captions: [],
      hashtags: [],
    };
  }
}

/**
 * 获取精选文案（用于首页展示）
 * @param platformId - 平台 ID（可选）
 * @param limit - 数量限制
 * @returns 精选文案列表
 */
export async function getFeaturedCaptions(
  platformId?: PlatformId,
  limit = 8
): Promise<typeof captions.$inferSelect[]> {
  try {
    const conditions = [eq(captions.isFeatured, true), eq(captions.isActive, true)];
    
    if (platformId) {
      conditions.push(eq(captions.platformId, platformId));
    }

    const results = await db
      .select()
      .from(captions)
      .where(and(...conditions))
      .orderBy(desc(captions.copyCount))
      .limit(limit);

    return results;
  } catch (error) {
    console.error('Error getting featured captions:', error);
    return [];
  }
}
