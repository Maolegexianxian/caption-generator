/**
 * 文案服务层
 * @description 提供文案的数据操作接口
 * @note 当前版本暂时禁用数据库，返回空结果
 * @todo 后续可接入 Cloudflare D1 或其他数据库
 */

import { PlatformId, LengthType } from '@/types';
import { CATEGORY_HASHTAGS } from '@/config/constants';

/**
 * 文案数据类型（静态版本）
 */
export interface CaptionData {
  id: string;
  content: string;
  formattedContent: string | null;
  platformId: string | null;
  categoryId: string | null;
  moodId: string | null;
  language: string;
  lengthType: string;
  characterCount: number | null;
  viewCount: number;
  copyCount: number;
  qualityScore: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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
  captions: CaptionData[];
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
 * 根据条件查询文案（静态版本 - 返回空结果）
 * @param params - 查询参数
 * @returns 文案列表和分页信息
 * @note 当前版本不支持文案查询
 */
export async function queryCaptions(params: CaptionQueryParams): Promise<CaptionQueryResult> {
  // 静态版本，返回空结果
  void params;
  return {
    captions: [],
    total: 0,
    hasMore: false,
  };
}

/**
 * 根据 ID 获取单条文案（静态版本）
 * @param id - 文案 ID
 * @returns null
 */
export async function getCaptionById(id: string): Promise<CaptionData | null> {
  void id;
  return null;
}

/**
 * 创建新文案（静态版本 - 无操作）
 * @param params - 创建参数
 * @returns 模拟的文案对象
 */
export async function createCaption(params: CreateCaptionParams): Promise<CaptionData> {
  const now = new Date().toISOString();
  const calculatedLengthType = params.lengthType || calculateLengthType(params.content.length);
  
  // 返回模拟数据，实际不存储
  return {
    id: `temp-${Date.now()}`,
    content: params.content,
    formattedContent: params.formattedContent || params.content,
    platformId: params.platformId,
    categoryId: params.categoryId || null,
    moodId: params.moodId || null,
    language: params.language || 'en',
    lengthType: calculatedLengthType,
    characterCount: params.content.length,
    copyCount: 0,
    viewCount: 0,
    qualityScore: 0,
    isFeatured: false,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * 更新文案复制次数（静态版本 - 无操作）
 * @param id - 文案 ID
 */
export async function incrementCaptionCopyCount(id: string): Promise<void> {
  void id;
}

/**
 * 更新文案查看次数（静态版本 - 无操作）
 * @param id - 文案 ID
 */
export async function incrementCaptionViewCount(id: string): Promise<void> {
  void id;
}

/**
 * 获取分类下的 Hashtag 列表（静态配置版本）
 * @param categoryId - 分类 ID
 * @returns Hashtag 列表
 */
export async function getHashtagsByCategory(categoryId: string): Promise<string[]> {
  return CATEGORY_HASHTAGS[categoryId] || [];
}

/**
 * 获取热门文案（静态版本 - 返回空）
 * @param platformId - 平台 ID
 * @param limit - 数量限制
 * @returns 空列表
 */
export async function getPopularCaptions(platformId?: PlatformId, limit = 10): Promise<CaptionData[]> {
  void platformId;
  void limit;
  return [];
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
 * 批量创建文案（静态版本 - 无操作）
 * @param captionsList - 文案列表
 * @returns 0
 */
export async function batchCreateCaptions(captionsList: CreateCaptionParams[]): Promise<number> {
  void captionsList;
  return 0;
}

/**
 * 获取分类页面文案（静态版本）
 * @param platformId - 平台 ID
 * @param categoryId - 分类 ID
 * @param limit - 数量限制
 * @returns 空文案列表和配置的标签
 */
export async function getCategoryPageCaptions(
  platformId: PlatformId,
  categoryId: string,
  limit = 12
): Promise<{
  captions: CaptionData[];
  hashtags: string[];
}> {
  void platformId;
  void limit;
  
  return {
    captions: [],
    hashtags: CATEGORY_HASHTAGS[categoryId] || [],
  };
}

/**
 * 获取精选文案（静态版本 - 返回空）
 * @param platformId - 平台 ID（可选）
 * @param limit - 数量限制
 * @returns 空列表
 */
export async function getFeaturedCaptions(
  platformId?: PlatformId,
  limit = 8
): Promise<CaptionData[]> {
  void platformId;
  void limit;
  return [];
}
