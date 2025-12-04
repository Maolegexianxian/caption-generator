/**
 * 生成历史记录服务
 * @description 管理 AI 文案生成历史记录
 * @note 当前版本暂时禁用数据库，使用内存存储
 * @todo 后续可接入 Cloudflare D1 或其他数据库
 */

import { PlatformId, GeneratedCaption } from '@/types';
import { generateUniqueId } from '@/lib/utils';

/**
 * 内存存储的历史记录（临时方案）
 * @description 服务重启后会清空，仅用于当前会话
 */
const memoryHistoryStore: Map<string, HistoryRecord> = new Map();

/**
 * 历史记录类型
 */
interface HistoryRecord {
  id: string;
  sessionId: string | null;
  platformId: string;
  categoryId: string | null;
  moodId: string | null;
  keywords: string | null;
  generatedContent: string;
  userIp: string | null;
  createdAt: string;
}

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
 * 保存生成历史记录（内存存储版本）
 * @param params - 历史记录参数
 * @returns 创建的历史记录
 */
export async function saveGenerationHistory(params: CreateHistoryParams): Promise<HistoryRecord> {
  const {
    platformId,
    categoryId,
    moodId,
    keywords,
    generatedCaptions,
    sessionId,
    userIp,
  } = params;

  const id = generateUniqueId();
  const now = new Date().toISOString();
  
  const historyRecord: HistoryRecord = {
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

  // 存储到内存
  memoryHistoryStore.set(id, historyRecord);
  
  return historyRecord;
}

/**
 * 获取会话的生成历史（内存存储版本）
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

  // 从内存获取所有记录并过滤
  let results = Array.from(memoryHistoryStore.values());
  
  if (sessionId) {
    results = results.filter(r => r.sessionId === sessionId);
  }
  
  if (platformId) {
    results = results.filter(r => r.platformId === platformId);
  }

  // 按创建时间倒序排序
  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // 分页
  const paginatedResults = results.slice(offset, offset + limit);

  // 解析 JSON 字段
  return paginatedResults.map(record => ({
    ...record,
    generatedCaptions: record.generatedContent ? JSON.parse(record.generatedContent) : [],
  }));
}

/**
 * 根据 ID 获取历史记录详情（内存存储版本）
 * @param id - 历史记录 ID
 * @returns 历史记录或 null
 */
export async function getHistoryById(id: string) {
  const record = memoryHistoryStore.get(id);
  
  if (!record) {
    return null;
  }

  return {
    ...record,
    generatedCaptions: record.generatedContent ? JSON.parse(record.generatedContent) : [],
  };
}

/**
 * 删除历史记录（内存存储版本）
 * @param id - 历史记录 ID
 * @param sessionId - 会话 ID（用于验证权限）
 * @returns 是否成功删除
 */
export async function deleteHistory(id: string, sessionId?: string): Promise<boolean> {
  const record = memoryHistoryStore.get(id);
  
  if (!record) {
    return false;
  }
  
  // 验证会话权限
  if (sessionId && record.sessionId !== sessionId) {
    return false;
  }
  
  memoryHistoryStore.delete(id);
  return true;
}

/**
 * 清空会话的所有历史记录（内存存储版本）
 * @param sessionId - 会话 ID
 * @returns 是否成功清空
 */
export async function clearSessionHistory(sessionId: string): Promise<boolean> {
  const idsToDelete: string[] = [];
  
  memoryHistoryStore.forEach((record, id) => {
    if (record.sessionId === sessionId) {
      idsToDelete.push(id);
    }
  });
  
  idsToDelete.forEach(id => memoryHistoryStore.delete(id));
  return true;
}

/**
 * 获取会话生成统计（内存存储版本）
 * @param sessionId - 会话 ID
 * @returns 统计信息
 */
export async function getSessionGenerationStats(sessionId: string) {
  const results = Array.from(memoryHistoryStore.values())
    .filter(r => r.sessionId === sessionId);

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
}
