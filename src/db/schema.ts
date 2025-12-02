/**
 * 数据库 Schema 定义
 * 使用 Drizzle ORM 定义所有数据库表结构
 * @description 包含平台、分类、情绪标签、文案模板、Hashtag 等核心数据表
 */

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

/**
 * 平台表 - 存储支持的社交媒体平台信息
 * @description 支持 Telegram、Instagram、X (Twitter) 等平台
 */
export const platforms = sqliteTable('platforms', {
  /** 平台唯一标识符 */
  id: text('id').primaryKey(),
  /** 平台名称 */
  name: text('name').notNull(),
  /** 平台显示名称 */
  displayName: text('display_name').notNull(),
  /** 平台描述 */
  description: text('description'),
  /** 平台图标名称 */
  icon: text('icon'),
  /** 平台 URL slug */
  slug: text('slug').notNull().unique(),
  /** 推荐最大字符数 */
  maxCharacters: integer('max_characters'),
  /** 推荐 Hashtag 数量 */
  recommendedHashtagCount: integer('recommended_hashtag_count'),
  /** 排序权重 */
  sortOrder: integer('sort_order').default(0),
  /** 是否启用 */
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  /** 创建时间 */
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  /** 更新时间 */
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

/**
 * 场景分类表 - 存储文案使用场景
 * @description 如 Travel、Birthday、Selfie、Food 等场景分类
 */
export const categories = sqliteTable('categories', {
  /** 分类唯一标识符 */
  id: text('id').primaryKey(),
  /** 分类名称 */
  name: text('name').notNull(),
  /** 分类显示名称 */
  displayName: text('display_name').notNull(),
  /** 分类描述 */
  description: text('description'),
  /** 分类图标 */
  icon: text('icon'),
  /** URL slug */
  slug: text('slug').notNull().unique(),
  /** 排序权重 */
  sortOrder: integer('sort_order').default(0),
  /** 是否启用 */
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  /** SEO 标题 */
  seoTitle: text('seo_title'),
  /** SEO 描述 */
  seoDescription: text('seo_description'),
  /** 创建时间 */
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  /** 更新时间 */
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

/**
 * 情绪标签表 - 存储文案情绪/风格标签
 * @description 如 Funny、Cute、Romantic、Sad、Motivational 等情绪标签
 */
export const moods = sqliteTable('moods', {
  /** 情绪标签唯一标识符 */
  id: text('id').primaryKey(),
  /** 情绪名称 */
  name: text('name').notNull(),
  /** 情绪显示名称 */
  displayName: text('display_name').notNull(),
  /** 情绪描述 */
  description: text('description'),
  /** 情绪图标/emoji */
  icon: text('icon'),
  /** URL slug */
  slug: text('slug').notNull().unique(),
  /** 排序权重 */
  sortOrder: integer('sort_order').default(0),
  /** 是否启用 */
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  /** 创建时间 */
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  /** 更新时间 */
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

/**
 * 排版预设表 - 存储不同平台的排版格式预设
 * @description 如 IG 帖子格式、TG 频道预告格式、X Thread 格式等
 */
export const layoutPresets = sqliteTable('layout_presets', {
  /** 预设唯一标识符 */
  id: text('id').primaryKey(),
  /** 关联的平台 ID */
  platformId: text('platform_id').references(() => platforms.id),
  /** 预设名称 */
  name: text('name').notNull(),
  /** 预设显示名称 */
  displayName: text('display_name').notNull(),
  /** 预设描述 */
  description: text('description'),
  /** 排版模板（包含换行、空行等格式配置） */
  template: text('template'),
  /** 是否默认预设 */
  isDefault: integer('is_default', { mode: 'boolean' }).default(false),
  /** 排序权重 */
  sortOrder: integer('sort_order').default(0),
  /** 是否启用 */
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  /** 创建时间 */
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  /** 更新时间 */
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

/**
 * 文案模板表 - 存储 AI 生成的文案模板
 * @description 存储预生成的高质量文案，用于 SEO 页面展示和快速选用
 */
export const captions = sqliteTable('captions', {
  /** 文案唯一标识符 */
  id: text('id').primaryKey(),
  /** 文案内容 */
  content: text('content').notNull(),
  /** 格式化后的文案内容（包含排版） */
  formattedContent: text('formatted_content'),
  /** 关联的平台 ID */
  platformId: text('platform_id').references(() => platforms.id),
  /** 关联的分类 ID */
  categoryId: text('category_id').references(() => categories.id),
  /** 关联的情绪 ID */
  moodId: text('mood_id').references(() => moods.id),
  /** 语言代码 */
  language: text('language').default('en'),
  /** 文案长度类型: short/medium/long */
  lengthType: text('length_type').default('medium'),
  /** 字符数 */
  characterCount: integer('character_count'),
  /** 浏览次数 */
  viewCount: integer('view_count').default(0),
  /** 复制次数 */
  copyCount: integer('copy_count').default(0),
  /** 质量评分 (0-100) */
  qualityScore: real('quality_score').default(0),
  /** 是否精选 */
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
  /** 是否启用 */
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  /** 创建时间 */
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  /** 更新时间 */
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

/**
 * Hashtag 表 - 存储 Hashtag 标签
 * @description 用于推荐和管理常用 Hashtag
 */
export const hashtags = sqliteTable('hashtags', {
  /** Hashtag 唯一标识符 */
  id: text('id').primaryKey(),
  /** Hashtag 标签（不含 # 符号） */
  tag: text('tag').notNull().unique(),
  /** 使用次数 */
  usageCount: integer('usage_count').default(0),
  /** 热度评分 */
  popularityScore: real('popularity_score').default(0),
  /** 是否启用 */
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  /** 创建时间 */
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
});

/**
 * 分类与 Hashtag 关联表 - 多对多关系
 * @description 关联分类和相关的 Hashtag
 */
export const categoryHashtags = sqliteTable('category_hashtags', {
  /** 分类 ID */
  categoryId: text('category_id').references(() => categories.id),
  /** Hashtag ID */
  hashtagId: text('hashtag_id').references(() => hashtags.id),
  /** 权重分数 */
  weight: real('weight').default(1.0),
});

/**
 * 平台与分类关联表 - 多对多关系
 * @description 关联平台和适用的分类
 */
export const platformCategories = sqliteTable('platform_categories', {
  /** 平台 ID */
  platformId: text('platform_id').references(() => platforms.id),
  /** 分类 ID */
  categoryId: text('category_id').references(() => categories.id),
  /** 排序权重 */
  sortOrder: integer('sort_order').default(0),
});

/**
 * SEO 页面配置表 - 存储 SEO 专题页配置
 * @description 用于管理每个 SEO 落地页的元信息和内容配置
 */
export const seoPages = sqliteTable('seo_pages', {
  /** 页面唯一标识符 */
  id: text('id').primaryKey(),
  /** URL 路径 */
  path: text('path').notNull().unique(),
  /** 关联的平台 ID */
  platformId: text('platform_id').references(() => platforms.id),
  /** 关联的分类 ID */
  categoryId: text('category_id').references(() => categories.id),
  /** 页面标题 (Title) */
  title: text('title').notNull(),
  /** Meta 描述 */
  metaDescription: text('meta_description'),
  /** H1 标题 */
  h1: text('h1').notNull(),
  /** H2 标题 */
  h2: text('h2'),
  /** 引言段落 */
  introContent: text('intro_content'),
  /** 是否启用 */
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  /** 创建时间 */
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  /** 更新时间 */
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

/**
 * 生成历史记录表 - 存储用户生成历史
 * @description 用于后续账号体系的历史记录功能
 */
export const generationHistory = sqliteTable('generation_history', {
  /** 记录唯一标识符 */
  id: text('id').primaryKey(),
  /** 用户会话 ID */
  sessionId: text('session_id'),
  /** 平台 ID */
  platformId: text('platform_id').references(() => platforms.id),
  /** 分类 ID */
  categoryId: text('category_id').references(() => categories.id),
  /** 情绪 ID */
  moodId: text('mood_id').references(() => moods.id),
  /** 输入的关键词 */
  keywords: text('keywords'),
  /** 生成的文案内容（JSON 数组） */
  generatedContent: text('generated_content'),
  /** 用户 IP（脱敏存储） */
  userIp: text('user_ip'),
  /** 创建时间 */
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
});

// =============== 关系定义 ===============

/**
 * 平台关系定义
 */
export const platformsRelations = relations(platforms, ({ many }) => ({
  /** 平台包含的排版预设 */
  layoutPresets: many(layoutPresets),
  /** 平台包含的文案 */
  captions: many(captions),
  /** 平台关联的分类 */
  platformCategories: many(platformCategories),
  /** 平台的 SEO 页面 */
  seoPages: many(seoPages),
}));

/**
 * 分类关系定义
 */
export const categoriesRelations = relations(categories, ({ many }) => ({
  /** 分类包含的文案 */
  captions: many(captions),
  /** 分类关联的 Hashtag */
  categoryHashtags: many(categoryHashtags),
  /** 分类关联的平台 */
  platformCategories: many(platformCategories),
  /** 分类的 SEO 页面 */
  seoPages: many(seoPages),
}));

/**
 * 情绪关系定义
 */
export const moodsRelations = relations(moods, ({ many }) => ({
  /** 情绪关联的文案 */
  captions: many(captions),
}));

/**
 * 排版预设关系定义
 */
export const layoutPresetsRelations = relations(layoutPresets, ({ one }) => ({
  /** 预设所属的平台 */
  platform: one(platforms, {
    fields: [layoutPresets.platformId],
    references: [platforms.id],
  }),
}));

/**
 * 文案关系定义
 */
export const captionsRelations = relations(captions, ({ one }) => ({
  /** 文案所属的平台 */
  platform: one(platforms, {
    fields: [captions.platformId],
    references: [platforms.id],
  }),
  /** 文案所属的分类 */
  category: one(categories, {
    fields: [captions.categoryId],
    references: [categories.id],
  }),
  /** 文案的情绪标签 */
  mood: one(moods, {
    fields: [captions.moodId],
    references: [moods.id],
  }),
}));

/**
 * Hashtag 关系定义
 */
export const hashtagsRelations = relations(hashtags, ({ many }) => ({
  /** Hashtag 关联的分类 */
  categoryHashtags: many(categoryHashtags),
}));

/**
 * 分类与 Hashtag 关联关系定义
 */
export const categoryHashtagsRelations = relations(categoryHashtags, ({ one }) => ({
  /** 关联的分类 */
  category: one(categories, {
    fields: [categoryHashtags.categoryId],
    references: [categories.id],
  }),
  /** 关联的 Hashtag */
  hashtag: one(hashtags, {
    fields: [categoryHashtags.hashtagId],
    references: [hashtags.id],
  }),
}));

/**
 * 平台与分类关联关系定义
 */
export const platformCategoriesRelations = relations(platformCategories, ({ one }) => ({
  /** 关联的平台 */
  platform: one(platforms, {
    fields: [platformCategories.platformId],
    references: [platforms.id],
  }),
  /** 关联的分类 */
  category: one(categories, {
    fields: [platformCategories.categoryId],
    references: [categories.id],
  }),
}));

/**
 * SEO 页面关系定义
 */
export const seoPagesRelations = relations(seoPages, ({ one }) => ({
  /** 页面关联的平台 */
  platform: one(platforms, {
    fields: [seoPages.platformId],
    references: [platforms.id],
  }),
  /** 页面关联的分类 */
  category: one(categories, {
    fields: [seoPages.categoryId],
    references: [categories.id],
  }),
}));
