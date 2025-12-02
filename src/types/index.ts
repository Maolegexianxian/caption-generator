/**
 * 全局类型定义
 * @description 定义项目中使用的所有 TypeScript 类型和接口
 */

import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type {
  platforms,
  categories,
  moods,
  layoutPresets,
  captions,
  hashtags,
  seoPages,
} from '@/db/schema';

// =============== 数据库模型类型 ===============

/** 平台类型 - 数据库查询结果 */
export type Platform = InferSelectModel<typeof platforms>;
/** 平台类型 - 数据库插入数据 */
export type NewPlatform = InferInsertModel<typeof platforms>;

/** 分类类型 - 数据库查询结果 */
export type Category = InferSelectModel<typeof categories>;
/** 分类类型 - 数据库插入数据 */
export type NewCategory = InferInsertModel<typeof categories>;

/** 情绪标签类型 - 数据库查询结果 */
export type Mood = InferSelectModel<typeof moods>;
/** 情绪标签类型 - 数据库插入数据 */
export type NewMood = InferInsertModel<typeof moods>;

/** 排版预设类型 - 数据库查询结果 */
export type LayoutPreset = InferSelectModel<typeof layoutPresets>;
/** 排版预设类型 - 数据库插入数据 */
export type NewLayoutPreset = InferInsertModel<typeof layoutPresets>;

/** 文案类型 - 数据库查询结果 */
export type Caption = InferSelectModel<typeof captions>;
/** 文案类型 - 数据库插入数据 */
export type NewCaption = InferInsertModel<typeof captions>;

/** Hashtag 类型 - 数据库查询结果 */
export type Hashtag = InferSelectModel<typeof hashtags>;
/** Hashtag 类型 - 数据库插入数据 */
export type NewHashtag = InferInsertModel<typeof hashtags>;

/** SEO 页面类型 - 数据库查询结果 */
export type SeoPage = InferSelectModel<typeof seoPages>;
/** SEO 页面类型 - 数据库插入数据 */
export type NewSeoPage = InferInsertModel<typeof seoPages>;

// =============== 平台标识符枚举 ===============

/**
 * 支持的社交媒体平台标识符
 * @description 用于类型安全的平台选择
 */
export enum PlatformId {
  /** Telegram 平台 */
  TELEGRAM = 'telegram',
  /** Instagram 平台 */
  INSTAGRAM = 'instagram',
  /** X (Twitter) 平台 */
  X = 'x',
}

// =============== 文案长度类型 ===============

/**
 * 文案长度类型
 * @description 用于控制生成文案的长度偏好
 */
export enum LengthType {
  /** 短文案 */
  SHORT = 'short',
  /** 中等长度文案 */
  MEDIUM = 'medium',
  /** 长文案 */
  LONG = 'long',
}

// =============== AI 生成相关类型 ===============

/**
 * AI 文案生成请求参数
 * @description 用户提交的生成请求参数
 */
export interface GenerateRequest {
  /** 目标平台 ID */
  platformId: PlatformId;
  /** 语言代码 (如 'en', 'zh') */
  language: string;
  /** 选择的情绪/风格标签 ID 列表 */
  moodIds: string[];
  /** 选择的场景分类 ID */
  categoryId?: string;
  /** 用户输入的关键词 */
  keywords?: string;
  /** 文案长度偏好 */
  lengthType: LengthType;
  /** 排版预设 ID */
  layoutPresetId?: string;
  /** 生成数量 (默认 5-10 条) */
  count?: number;
  /** 是否包含 Hashtag */
  includeHashtags?: boolean;
  /** 是否包含 Emoji */
  includeEmoji?: boolean;
}

/**
 * 单条生成的文案结果
 * @description AI 生成的单条文案及其相关信息
 */
export interface GeneratedCaption {
  /** 唯一标识符 */
  id: string;
  /** 原始文案内容 */
  content: string;
  /** 格式化后的文案（包含排版） */
  formattedContent: string;
  /** 推荐的 Hashtag 列表 */
  hashtags: string[];
  /** 字符数 */
  characterCount: number;
}

/**
 * AI 文案生成响应
 * @description 生成器返回的完整响应
 */
export interface GenerateResponse {
  /** 生成是否成功 */
  success: boolean;
  /** 生成的文案列表 */
  captions: GeneratedCaption[];
  /** 错误信息（如有） */
  error?: string;
  /** 生成元数据 */
  metadata?: {
    /** 生成时间（毫秒） */
    generationTime: number;
    /** 使用的模型 */
    model: string;
  };
}

// =============== 复制功能相关类型 ===============

/**
 * 复制选项配置
 * @description 控制复制到剪贴板的内容格式
 */
export interface CopyOptions {
  /** 是否包含 Hashtag */
  includeHashtags: boolean;
  /** 是否使用格式化内容 */
  useFormattedContent: boolean;
}

// =============== SEO 页面相关类型 ===============

/**
 * SEO 页面配置
 * @description 用于渲染 SEO 专题页的完整配置
 */
export interface SeoPageConfig {
  /** 页面路径 */
  path: string;
  /** 页面标题 */
  title: string;
  /** Meta 描述 */
  metaDescription: string;
  /** H1 标题 */
  h1: string;
  /** H2 标题（可选） */
  h2?: string;
  /** 引言内容 */
  introContent: string;
  /** 关联的平台 */
  platform?: Platform;
  /** 关联的分类 */
  category?: Category;
  /** 预加载的文案列表 */
  captions: Caption[];
}

// =============== 筛选和搜索相关类型 ===============

/**
 * 文案筛选参数
 * @description 用于筛选文案列表的参数
 */
export interface CaptionFilters {
  /** 平台 ID */
  platformId?: string;
  /** 分类 ID */
  categoryId?: string;
  /** 情绪 ID */
  moodId?: string;
  /** 语言代码 */
  language?: string;
  /** 长度类型 */
  lengthType?: LengthType;
  /** 搜索关键词 */
  searchKeyword?: string;
  /** 分页 - 页码 */
  page?: number;
  /** 分页 - 每页数量 */
  pageSize?: number;
  /** 排序字段 */
  sortBy?: 'createdAt' | 'copyCount' | 'characterCount';
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc';
}

/**
 * 分页响应
 * @description 带分页信息的数据响应
 */
export interface PaginatedResponse<T> {
  /** 数据列表 */
  data: T[];
  /** 分页信息 */
  pagination: {
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
    /** 总数量 */
    total: number;
    /** 总页数 */
    totalPages: number;
  };
}

// =============== API 响应类型 ===============

/**
 * 通用 API 响应
 * @description 所有 API 接口的标准响应格式
 */
export interface ApiResponse<T = unknown> {
  /** 是否成功 */
  success: boolean;
  /** 响应数据 */
  data?: T;
  /** 错误信息 */
  error?: string;
  /** 错误代码 */
  errorCode?: string;
}

// =============== 组件 Props 类型 ===============

/**
 * 文案卡片组件属性
 * @description CaptionCard 组件的属性类型
 */
export interface CaptionCardProps {
  /** 文案数据 */
  caption: Caption | GeneratedCaption;
  /** 关联的 Hashtag 列表 */
  hashtags?: string[];
  /** 是否显示 Hashtag */
  showHashtags?: boolean;
  /** 复制回调函数 */
  onCopy?: (content: string) => void;
  /** 生成相似文案回调 */
  onGenerateSimilar?: () => void;
  /** 平台类型（用于格式化） */
  platform?: PlatformId;
}

/**
 * 生成器表单属性
 * @description GeneratorForm 组件的属性类型
 */
export interface GeneratorFormProps {
  /** 初始平台选择 */
  initialPlatform?: PlatformId;
  /** 初始分类选择 */
  initialCategory?: string;
  /** 初始情绪选择 */
  initialMoods?: string[];
  /** 是否为简化版本（用于 SEO 页面嵌入） */
  simplified?: boolean;
  /** 生成完成回调 */
  onGenerate?: (result: GenerateResponse) => void;
}

// =============== 状态管理类型 ===============

/**
 * 生成器状态
 * @description Zustand store 中的生成器状态
 */
export interface GeneratorState {
  /** 当前选择的平台 */
  platform: PlatformId;
  /** 当前选择的分类 */
  category: string | null;
  /** 当前选择的情绪列表 */
  moods: string[];
  /** 用户输入的关键词 */
  keywords: string;
  /** 长度偏好 */
  lengthType: LengthType;
  /** 排版预设 */
  layoutPreset: string | null;
  /** 语言 */
  language: string;
  /** 是否包含 Hashtag */
  includeHashtags: boolean;
  /** 是否包含 Emoji */
  includeEmoji: boolean;
  /** 生成的结果 */
  results: GeneratedCaption[];
  /** 是否正在生成 */
  isGenerating: boolean;
  /** 错误信息 */
  error: string | null;
}

/**
 * 生成器操作
 * @description Zustand store 中的生成器操作方法
 */
export interface GeneratorActions {
  /** 设置平台 */
  setPlatform: (platform: PlatformId) => void;
  /** 设置分类 */
  setCategory: (category: string | null) => void;
  /** 设置情绪列表 */
  setMoods: (moods: string[]) => void;
  /** 设置关键词 */
  setKeywords: (keywords: string) => void;
  /** 设置长度偏好 */
  setLengthType: (lengthType: LengthType) => void;
  /** 设置排版预设 */
  setLayoutPreset: (preset: string | null) => void;
  /** 设置语言 */
  setLanguage: (language: string) => void;
  /** 设置是否包含 Hashtag */
  setIncludeHashtags: (include: boolean) => void;
  /** 设置是否包含 Emoji */
  setIncludeEmoji: (include: boolean) => void;
  /** 设置生成结果 */
  setResults: (results: GeneratedCaption[]) => void;
  /** 设置生成状态 */
  setIsGenerating: (isGenerating: boolean) => void;
  /** 设置错误信息 */
  setError: (error: string | null) => void;
  /** 重置状态 */
  reset: () => void;
}
