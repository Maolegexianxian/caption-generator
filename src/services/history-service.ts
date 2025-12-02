/**
 * 生成历史记录服务
 * @description 管理 AI 文案生成历史记录
 */

import { db } from '@/db';
import { generationHistory } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { PlatformId, GeneratedCaption } from '@/types';
import { generateUniqueId } from '@/lib/utils';

/**
 * 创建历史记录参数
 */
export interface CreateHistoryParams {
  /** 平台 ID */
  platformId: PlatformId;
  /** 分类 ID */
  categoryId?: string;
  /** 情绪 ID */
  moodId?: string;
  /** 关键词 */
  keywords?: string;
  /** 生成的文案列表 */
  generatedCaptions: GeneratedCaption[];
  /** 会话 ID */
  sessionId?: string;
  /** 用户 IP（脱敏） */
  userIp?: string;
}

/**
 * 历史记录查询参数
 */
export interface HistoryQueryParams {
  /** 会话 ID */
  sessionId?: string;
  /** 平台筛选 */
  platformId?: PlatformId;
  /** 数量限制 */
  limit?: number;
  /** 偏移量 */
  offset?: number;
}

/**
 * 保存生成历史记录
 * @param params - 历史记录参数
 * @returns 创建的历史记录
 */
export async function saveGenerationHistory(params: CreateHistoryParams) {
  const {
    platformId,
    categoryId,
    moodId,
    keywords,
    generatedCaptions,
    sessionId,
    userIp,
  } = params;

  try {
    const id = generateUniqueId();
    const now = new Date().toISOString();
    
    const historyRecord = {
      id,
      sessionId: sessionId || null,
      platformId,
      categoryId: categoryId || null,
      moodId: moodId || null,
      keywords: keywords || null,
      generatedContent: JSON.stringify(generatedCaptions),
      userIp: userIp || null,
      createdAt: now,
    };

    await db.insert(generationHistory).values(historyRecord);
    
    return historyRecord;
  } catch (error) {
    console.error('Error saving generation history:', error);
    throw new Error('Failed to save generation history');
  }
}

/**
 * 获取会话的生成历史
 * @param params - 查询参数
 * @returns 历史记录列表
 */
export async function getGenerationHistory(params: HistoryQueryParams) {
  const {
    sessionId,
    platformId,
    limit = 20,
    offset = 0,
  } = params;

  try {
    // 构建查询条件
    const conditions = [];
    
    if (sessionId) {
      conditions.push(eq(generationHistory.sessionId, sessionId));
    }
    
    if (platformId) {
      conditions.push(eq(generationHistory.platformId, platformId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db
      .select()
      .from(generationHistory)
      .where(whereClause)
      .orderBy(desc(generationHistory.createdAt))
      .limit(limit)
      .offset(offset);

    // 解析 JSON 字段
    return results.map(record => ({
      ...record,
      generatedCaptions: record.generatedContent ? JSON.parse(record.generatedContent) : [],
    }));
  } catch (error) {
    console.error('Error getting generation history:', error);
    return [];
  }
}

/**
 * 根据 ID 获取历史记录详情
 * @param id - 历史记录 ID
 * @returns 历史记录或 null
 */
export async function getHistoryById(id: string) {
  try {
    const result = await db
      .select()
      .from(generationHistory)
      .where(eq(generationHistory.id, id))
      .limit(1);
    
    if (result.length === 0) {
      return null;
    }

    const record = result[0];
    return {
      ...record,
      generatedCaptions: record.generatedContent ? JSON.parse(record.generatedContent) : [],
    };
  } catch (error) {
    console.error('Error getting history by ID:', error);
    return null;
  }
}

/**
 * 删除历史记录
 * @param id - 历史记录 ID
 * @param sessionId - 会话 ID（用于验证权限）
 * @returns 是否成功删除
 */
export async function deleteHistory(id: string, sessionId?: string) {
  try {
    const conditions = [eq(generationHistory.id, id)];
    
    if (sessionId) {
      conditions.push(eq(generationHistory.sessionId, sessionId));
    }

    await db
      .delete(generationHistory)
      .where(and(...conditions));
    
    return true;
  } catch (error) {
    console.error('Error deleting history:', error);
    return false;
  }
}

/**
 * 清空会话的所有历史记录
 * @param sessionId - 会话 ID
 * @returns 是否成功清空
 */
export async function clearSessionHistory(sessionId: string) {
  try {
    await db
      .delete(generationHistory)
      .where(eq(generationHistory.sessionId, sessionId));
    
    return true;
  } catch (error) {
    console.error('Error clearing session history:', error);
    return false;
  }
}

/**
 * 获取会话生成统计
 * @param sessionId - 会话 ID
 * @returns 统计信息
 */
export async function getSessionGenerationStats(sessionId: string) {
  try {
    const results = await db
      .select()
      .from(generationHistory)
      .where(eq(generationHistory.sessionId, sessionId));

    const totalGenerations = results.length;
    
    // 计算生成的文案总数
    let totalCaptions = 0;
    results.forEach(r => {
      if (r.generatedContent) {
        try {
          const captions = JSON.parse(r.generatedContent);
          totalCaptions += Array.isArray(captions) ? captions.length : 0;
        } catch {
          // 解析失败忽略
        }
      }
    });
    
    // 按平台统计
    const platformStats = results.reduce((acc, r) => {
      if (r.platformId) {
        acc[r.platformId] = (acc[r.platformId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalGenerations,
      totalCaptions,
      platformStats,
    };
  } catch (error) {
    console.error('Error getting session stats:', error);
    return {
      totalGenerations: 0,
      totalCaptions: 0,
      platformStats: {},
    };
  }
}
