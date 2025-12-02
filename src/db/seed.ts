/**
 * 数据库种子数据初始化脚本
 * @description 初始化平台、分类、情绪标签、Hashtag 等基础数据
 * @usage npx tsx src/db/seed.ts
 */

import { db } from './index';
import {
  platforms,
  categories,
  moods,
  hashtags,
  categoryHashtags,
  platformCategories,
  layoutPresets,
  seoPages,
} from './schema';
import {
  PLATFORMS_CONFIG,
  CATEGORIES_CONFIG,
  MOODS_CONFIG,
  CATEGORY_HASHTAGS,
} from '@/config/constants';
import { PlatformId } from '@/types';
import { generateUniqueId } from '@/lib/utils';

/**
 * 清空所有表数据
 * @description 删除所有表中的数据，用于重新初始化
 */
async function clearAllTables(): Promise<void> {
  console.log('🗑️  清空现有数据...');
  
  // 按照外键依赖顺序删除
  await db.delete(seoPages);
  await db.delete(platformCategories);
  await db.delete(categoryHashtags);
  await db.delete(layoutPresets);
  await db.delete(hashtags);
  await db.delete(moods);
  await db.delete(categories);
  await db.delete(platforms);
  
  console.log('✅ 数据清空完成');
}

/**
 * 初始化平台数据
 * @description 从配置常量中导入平台信息
 */
async function seedPlatforms(): Promise<void> {
  console.log('📱 初始化平台数据...');
  
  const platformData = Object.values(PLATFORMS_CONFIG).map((config) => ({
    id: config.id,
    name: config.name,
    displayName: config.displayName,
    description: config.description,
    icon: config.icon,
    slug: config.slug,
    maxCharacters: config.maxCharacters,
    recommendedHashtagCount: config.recommendedHashtagCount,
    sortOrder: config.sortOrder,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  
  await db.insert(platforms).values(platformData);
  console.log(`✅ 已插入 ${platformData.length} 个平台`);
}

/**
 * 初始化分类数据
 * @description 从配置常量中导入场景分类信息
 */
async function seedCategories(): Promise<void> {
  console.log('📂 初始化分类数据...');
  
  const categoryData = CATEGORIES_CONFIG.map((config) => ({
    id: config.id,
    name: config.name,
    displayName: config.displayName,
    description: config.description,
    icon: config.icon,
    slug: config.slug,
    sortOrder: config.sortOrder,
    isActive: true,
    seoTitle: `${config.displayName} Captions - Best ${config.displayName} Caption Ideas`,
    seoDescription: `Find the perfect ${config.displayName.toLowerCase()} captions for social media. Browse our curated collection of ${config.displayName.toLowerCase()} captions with hashtags.`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  
  await db.insert(categories).values(categoryData);
  console.log(`✅ 已插入 ${categoryData.length} 个分类`);
}

/**
 * 初始化情绪标签数据
 * @description 从配置常量中导入情绪/风格标签信息
 */
async function seedMoods(): Promise<void> {
  console.log('😊 初始化情绪标签数据...');
  
  const moodData = MOODS_CONFIG.map((config) => ({
    id: config.id,
    name: config.name,
    displayName: config.displayName,
    description: config.description,
    icon: config.icon,
    slug: config.slug,
    sortOrder: config.sortOrder,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  
  await db.insert(moods).values(moodData);
  console.log(`✅ 已插入 ${moodData.length} 个情绪标签`);
}

/**
 * 初始化 Hashtag 数据
 * @description 从配置常量中导入 Hashtag 信息
 */
async function seedHashtags(): Promise<void> {
  console.log('#️⃣  初始化 Hashtag 数据...');
  
  // 收集所有唯一的 Hashtag
  const allTags = new Set<string>();
  
  Object.values(CATEGORY_HASHTAGS).forEach((tags) => {
    tags.forEach((tag) => allTags.add(tag));
  });
  
  const hashtagData = Array.from(allTags).map((tag) => ({
    id: generateUniqueId(),
    tag,
    usageCount: 0,
    popularityScore: Math.random() * 100, // 初始随机评分
    isActive: true,
    createdAt: new Date().toISOString(),
  }));
  
  if (hashtagData.length > 0) {
    await db.insert(hashtags).values(hashtagData);
  }
  console.log(`✅ 已插入 ${hashtagData.length} 个 Hashtag`);
  
  // 返回 hashtag 映射用于后续关联
  return;
}

/**
 * 初始化分类与 Hashtag 关联
 * @description 建立分类和 Hashtag 的多对多关系
 */
async function seedCategoryHashtags(): Promise<void> {
  console.log('🔗 初始化分类-Hashtag 关联...');
  
  // 获取所有 hashtags
  const allHashtags = await db.select().from(hashtags);
  const hashtagMap = new Map(allHashtags.map((h) => [h.tag, h.id]));
  
  const relations: { categoryId: string; hashtagId: string; weight: number }[] = [];
  
  Object.entries(CATEGORY_HASHTAGS).forEach(([categoryId, tags]) => {
    tags.forEach((tag, index) => {
      const hashtagId = hashtagMap.get(tag);
      if (hashtagId) {
        relations.push({
          categoryId,
          hashtagId,
          weight: 1 - index * 0.1, // 越靠前权重越高
        });
      }
    });
  });
  
  if (relations.length > 0) {
    await db.insert(categoryHashtags).values(relations);
  }
  console.log(`✅ 已插入 ${relations.length} 个分类-Hashtag 关联`);
}

/**
 * 初始化平台与分类关联
 * @description 建立平台和分类的多对多关系（所有分类适用于所有平台）
 */
async function seedPlatformCategories(): Promise<void> {
  console.log('🔗 初始化平台-分类关联...');
  
  const relations: { platformId: string; categoryId: string; sortOrder: number }[] = [];
  
  Object.values(PlatformId).forEach((platformId) => {
    CATEGORIES_CONFIG.forEach((category, index) => {
      relations.push({
        platformId,
        categoryId: category.id,
        sortOrder: index,
      });
    });
  });
  
  if (relations.length > 0) {
    await db.insert(platformCategories).values(relations);
  }
  console.log(`✅ 已插入 ${relations.length} 个平台-分类关联`);
}

/**
 * 初始化排版预设数据
 * @description 从配置常量中导入各平台的排版预设
 */
async function seedLayoutPresets(): Promise<void> {
  console.log('📐 初始化排版预设数据...');
  
  const presetData: {
    id: string;
    platformId: string;
    name: string;
    displayName: string;
    description: string;
    template: string | null;
    isDefault: boolean;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }[] = [];
  
  Object.values(PLATFORMS_CONFIG).forEach((platform) => {
    platform.layoutPresets.forEach((preset, index) => {
      presetData.push({
        id: preset.id,
        platformId: platform.id,
        name: preset.name,
        displayName: preset.name,
        description: preset.description,
        template: null, // 可后续添加具体模板
        isDefault: index === 0,
        sortOrder: index,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  });
  
  if (presetData.length > 0) {
    await db.insert(layoutPresets).values(presetData);
  }
  console.log(`✅ 已插入 ${presetData.length} 个排版预设`);
}

/**
 * 初始化 SEO 页面配置
 * @description 为各专题页面配置 SEO 元数据
 */
async function seedSeoPages(): Promise<void> {
  console.log('🔍 初始化 SEO 页面配置...');
  
  const seoPageData: {
    id: string;
    path: string;
    platformId: string | null;
    categoryId: string | null;
    title: string;
    metaDescription: string;
    h1: string;
    h2: string | null;
    introContent: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }[] = [];
  
  // 平台专题页
  Object.values(PLATFORMS_CONFIG).forEach((platform) => {
    seoPageData.push({
      id: generateUniqueId(),
      path: `/${platform.slug}`,
      platformId: platform.id,
      categoryId: null,
      title: `${platform.displayName} Captions - Best ${platform.displayName} Caption Ideas`,
      metaDescription: `Find the perfect captions for ${platform.displayName}. Browse our collection of ${platform.displayName} captions, quotes, and post ideas.`,
      h1: `${platform.displayName} Captions`,
      h2: `Best Caption Ideas for ${platform.displayName}`,
      introContent: platform.description,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });
  
  // Instagram 分类详情页
  CATEGORIES_CONFIG.forEach((category) => {
    seoPageData.push({
      id: generateUniqueId(),
      path: `/captions-for-instagram/${category.slug}`,
      platformId: PlatformId.INSTAGRAM,
      categoryId: category.id,
      title: `${category.displayName} Captions for Instagram - Best ${category.displayName} Caption Ideas`,
      metaDescription: `Find the perfect ${category.displayName.toLowerCase()} captions for Instagram. Browse our curated collection with hashtags. Copy and paste ready!`,
      h1: `${category.displayName} Captions for Instagram`,
      h2: `Best ${category.displayName} Instagram Caption Ideas`,
      introContent: category.description || '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });
  
  if (seoPageData.length > 0) {
    await db.insert(seoPages).values(seoPageData);
  }
  console.log(`✅ 已插入 ${seoPageData.length} 个 SEO 页面配置`);
}

/**
 * 主函数：执行所有种子数据初始化
 * @description 按顺序执行所有初始化操作
 */
async function main(): Promise<void> {
  console.log('🚀 开始初始化数据库种子数据...\n');
  
  try {
    // 清空现有数据
    await clearAllTables();
    
    // 按依赖顺序初始化数据
    await seedPlatforms();
    await seedCategories();
    await seedMoods();
    await seedHashtags();
    await seedCategoryHashtags();
    await seedPlatformCategories();
    await seedLayoutPresets();
    await seedSeoPages();
    
    console.log('\n🎉 数据库种子数据初始化完成！');
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

// 执行主函数
main();
