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
  captions,
  generationHistory,
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
  
  // 按照外键依赖顺序删除（先删除依赖其他表的表）
  // 0. 先删除 generationHistory（依赖 platforms, categories, moods）
  await db.delete(generationHistory);
  // 1. 删除 captions（依赖 platforms, categories, moods）
  await db.delete(captions);
  // 2. 删除 seoPages（依赖 platforms, categories）
  await db.delete(seoPages);
  // 3. 删除关联表
  await db.delete(platformCategories);
  await db.delete(categoryHashtags);
  // 4. 删除 layoutPresets（依赖 platforms）
  await db.delete(layoutPresets);
  // 5. 删除基础表
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
  
  // X (Twitter) 分类详情页
  CATEGORIES_CONFIG.forEach((category) => {
    seoPageData.push({
      id: generateUniqueId(),
      path: `/x-captions/${category.slug}`,
      platformId: PlatformId.X,
      categoryId: category.id,
      title: `${category.displayName} Captions for X (Twitter) - Best ${category.displayName} Tweet Ideas`,
      metaDescription: `Find the perfect ${category.displayName.toLowerCase()} captions for X (Twitter). Short, engaging tweets ready to copy and post!`,
      h1: `${category.displayName} Captions for X`,
      h2: `Best ${category.displayName} Tweet Ideas`,
      introContent: category.description || '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  // Telegram 分类详情页
  CATEGORIES_CONFIG.forEach((category) => {
    seoPageData.push({
      id: generateUniqueId(),
      path: `/tg-captions/${category.slug}`,
      platformId: PlatformId.TELEGRAM,
      categoryId: category.id,
      title: `${category.displayName} Captions for Telegram - Best ${category.displayName} Channel Captions`,
      metaDescription: `Find the perfect ${category.displayName.toLowerCase()} captions for Telegram channels and groups. Engaging captions ready to copy!`,
      h1: `${category.displayName} Captions for Telegram`,
      h2: `Best ${category.displayName} Telegram Caption Ideas`,
      introContent: category.description || '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });
  
  if (seoPageData.length > 0) {
    await db.insert(seoPages).values(seoPageData);
  }
  console.log(`✅ 已插入 ${seoPageData.length} 个 SEO 页面配置（含 3 个平台的分类页面）`);
}

/**
 * 预生成文案数据
 * @description 为各分类预生成高质量文案，每个分类包含50+条真实可用的文案
 */
async function seedCaptions(): Promise<void> {
  console.log('📝 初始化预生成文案数据...');
  
  /**
   * 各分类的预生成文案模板
   * @description 使用有效的 mood ID: funny, cute, cool, romantic, sad, motivational, aesthetic, savage, sarcastic, inspirational
   * 每个分类包含50+条企业级文案，覆盖不同情绪和风格
   */
  const captionTemplates: Record<string, { content: string; mood?: string }[]> = {
    // ==================== Selfie 分类 ====================
    selfie: [
      // Inspirational
      { content: 'Be yourself, there is no one better ✨', mood: 'inspirational' },
      { content: 'Not perfect, just real', mood: 'inspirational' },
      { content: 'Own your story', mood: 'inspirational' },
      { content: 'Be the energy you want to attract', mood: 'inspirational' },
      { content: 'I am my own muse', mood: 'inspirational' },
      { content: 'Born to stand out', mood: 'inspirational' },
      { content: 'Embrace the glorious mess that you are', mood: 'inspirational' },
      { content: 'Be a voice, not an echo', mood: 'inspirational' },
      // Savage
      { content: 'Confidence level: Selfie with no filter 💅', mood: 'savage' },
      { content: 'Woke up like this 😌', mood: 'savage' },
      { content: 'Feeling myself today', mood: 'savage' },
      { content: 'I\'m not special, I\'m limited edition', mood: 'savage' },
      { content: 'Sorry, I can\'t hear you over my awesomeness', mood: 'savage' },
      { content: 'I don\'t need your approval to be me', mood: 'savage' },
      { content: 'Too glam to give a damn', mood: 'savage' },
      { content: 'Be you, do you, for you', mood: 'savage' },
      { content: 'Catch flights, not feelings ✈️', mood: 'savage' },
      { content: 'Proof that I can do selfies better than you 📸', mood: 'savage' },
      // Cute
      { content: 'Just me being me 📸', mood: 'cute' },
      { content: 'Making memories with myself', mood: 'cute' },
      { content: 'This is my happy face 😊', mood: 'cute' },
      { content: 'Smile big, laugh often', mood: 'cute' },
      { content: 'Living my best life', mood: 'cute' },
      { content: 'Hello from the other side of the camera', mood: 'cute' },
      { content: 'Sending you sunshine ☀️', mood: 'cute' },
      { content: 'Just here being cute as usual', mood: 'cute' },
      { content: 'Felt cute, might delete later', mood: 'cute' },
      { content: 'Just a girl/guy with a camera 📷', mood: 'cute' },
      // Romantic
      { content: 'Self love is the best love 💕', mood: 'romantic' },
      { content: 'Falling in love with myself first', mood: 'romantic' },
      { content: 'Learning to love every part of me', mood: 'romantic' },
      // Cool
      { content: 'Good vibes and selfies only', mood: 'cool' },
      { content: 'Less perfection, more authenticity', mood: 'cool' },
      { content: 'Zero filter needed', mood: 'cool' },
      { content: 'Just trying to live my vibe', mood: 'cool' },
      { content: 'Chillin\' like a villain', mood: 'cool' },
      { content: 'Low key flexing', mood: 'cool' },
      // Aesthetic
      { content: 'Soft vibes only', mood: 'aesthetic' },
      { content: 'Daydreaming in color', mood: 'aesthetic' },
      { content: 'Golden hour glow ✨', mood: 'aesthetic' },
      { content: 'Chasing light and good angles', mood: 'aesthetic' },
      { content: 'In my own world', mood: 'aesthetic' },
      // Funny
      { content: 'I need a six month vacation, twice a year', mood: 'funny' },
      { content: 'Current mood: Need coffee ☕', mood: 'funny' },
      { content: 'Sorry for what I said when I was hungry', mood: 'funny' },
      { content: 'This is my face, hope you like it', mood: 'funny' },
      { content: 'My selfie game is stronger than my WiFi', mood: 'funny' },
      { content: 'I\'m not lazy, I\'m on energy saving mode', mood: 'funny' },
      // Sarcastic
      { content: 'Another day, another selfie', mood: 'sarcastic' },
      { content: 'Yes, I know I\'m cute. Thanks for noticing', mood: 'sarcastic' },
      { content: 'The bags under my eyes are designer', mood: 'sarcastic' },
    ],
    // ==================== Travel 分类 ====================
    travel: [
      // Inspirational
      { content: 'Adventure awaits ✈️', mood: 'inspirational' },
      { content: 'Collect moments, not things', mood: 'inspirational' },
      { content: 'Travel far, travel wide', mood: 'inspirational' },
      { content: 'Leave only footprints, take only memories', mood: 'inspirational' },
      { content: 'Life is short and the world is wide', mood: 'inspirational' },
      { content: 'The journey is the destination', mood: 'inspirational' },
      { content: 'Travel is the only thing you buy that makes you richer', mood: 'inspirational' },
      { content: 'Let\'s wander where the WiFi is weak', mood: 'inspirational' },
      { content: 'Jobs fill your pocket, adventures fill your soul', mood: 'inspirational' },
      { content: 'Travel far enough to meet yourself', mood: 'inspirational' },
      { content: 'The world is a book, don\'t stay on one page', mood: 'inspirational' },
      { content: 'Life begins at the end of your comfort zone', mood: 'inspirational' },
      // Aesthetic
      { content: 'Wanderlust and city dust', mood: 'aesthetic' },
      { content: 'Not all who wander are lost', mood: 'aesthetic' },
      { content: 'Paradise found 🌴', mood: 'aesthetic' },
      { content: 'Chasing sunsets', mood: 'aesthetic' },
      { content: 'Between the mountains and the sea', mood: 'aesthetic' },
      { content: 'Lost in the beauty of this place', mood: 'aesthetic' },
      { content: 'Golden hour in a golden place', mood: 'aesthetic' },
      { content: 'Views that take your breath away', mood: 'aesthetic' },
      { content: 'Painting the world with my footsteps', mood: 'aesthetic' },
      // Cool
      { content: 'Lost in the right direction 🧭', mood: 'cool' },
      { content: 'Keep calm and travel on', mood: 'cool' },
      { content: 'On top of the world', mood: 'cool' },
      { content: 'Exploring new horizons', mood: 'cool' },
      { content: 'One trip at a time', mood: 'cool' },
      { content: 'Permanently on vacation mode', mood: 'cool' },
      // Motivational
      { content: 'The world is my playground 🌍', mood: 'motivational' },
      { content: 'Dream big, travel bigger', mood: 'motivational' },
      { content: 'Adventure is out there, go find it', mood: 'motivational' },
      { content: 'Life is meant for good friends and great adventures', mood: 'motivational' },
      { content: 'Take only memories, leave only footprints', mood: 'motivational' },
      // Funny
      { content: 'Eat. Sleep. Travel. Repeat.', mood: 'funny' },
      { content: 'I need vitamin SEA 🌊', mood: 'funny' },
      { content: 'Jet lag is for amateurs', mood: 'funny' },
      { content: 'Will travel for food 🍕', mood: 'funny' },
      { content: 'Catch me if you can ✈️', mood: 'funny' },
      { content: 'Out of office: Exploring the world', mood: 'funny' },
      { content: 'My passport is always ready', mood: 'funny' },
      { content: 'Currently accepting travel buddy applications', mood: 'funny' },
      // Romantic
      { content: 'Finding magic in every corner of the world', mood: 'romantic' },
      { content: 'Falling in love with places I\'ve never been', mood: 'romantic' },
      // Cute
      { content: 'Making memories around the world', mood: 'cute' },
      { content: 'Travel is my therapy 🧳', mood: 'cute' },
      { content: 'Wish you were here 💌', mood: 'cute' },
      { content: 'Happiest when exploring', mood: 'cute' },
      // Savage
      { content: 'I haven\'t been everywhere, but it\'s on my list', mood: 'savage' },
      { content: 'My suitcase is always half packed', mood: 'savage' },
    ],
    // ==================== Food 分类 ====================
    food: [
      // Cute
      { content: 'Good food, good mood 🍕', mood: 'cute' },
      { content: 'Happiness is homemade 🏠', mood: 'cute' },
      { content: 'But first, coffee ☕', mood: 'cute' },
      { content: 'You are what you eat, so I\'m sweet 🍰', mood: 'cute' },
      { content: 'Made with love', mood: 'cute' },
      { content: 'Serving up happiness', mood: 'cute' },
      { content: 'Food tastes better when shared', mood: 'cute' },
      { content: 'Sweetness overload 🍩', mood: 'cute' },
      { content: 'Calories don\'t count on weekends', mood: 'cute' },
      // Funny
      { content: 'Eating my way through life', mood: 'funny' },
      { content: 'First we eat, then we do everything else', mood: 'funny' },
      { content: 'Diet starts tomorrow... maybe', mood: 'funny' },
      { content: 'I\'m on a seafood diet. I see food and I eat it', mood: 'funny' },
      { content: 'Life is uncertain. Eat dessert first 🍰', mood: 'funny' },
      { content: 'Running on caffeine and dreams', mood: 'funny' },
      { content: 'The only drama I enjoy is in my cooking', mood: 'funny' },
      { content: 'I followed my heart and it led me to the fridge', mood: 'funny' },
      { content: 'Donut worry, be happy 🍩', mood: 'funny' },
      { content: 'You can\'t make everyone happy. You\'re not pizza.', mood: 'funny' },
      { content: 'Too busy cooking to be upset', mood: 'funny' },
      { content: 'My favorite exercise is eating', mood: 'funny' },
      // Romantic
      { content: 'Food is my love language 💕', mood: 'romantic' },
      { content: 'Cooking is love made visible', mood: 'romantic' },
      { content: 'The secret ingredient is always love', mood: 'romantic' },
      { content: 'Bringing people together, one meal at a time', mood: 'romantic' },
      // Inspirational
      { content: 'Life is too short for bad food', mood: 'inspirational' },
      { content: 'Eat well, live well', mood: 'inspirational' },
      { content: 'Good food is good living', mood: 'inspirational' },
      { content: 'Nourish your body, feed your soul', mood: 'inspirational' },
      // Savage
      { content: 'Food before dudes 🍔', mood: 'savage' },
      { content: 'My relationship status: In a committed relationship with food', mood: 'savage' },
      { content: 'Food is bae', mood: 'savage' },
      { content: 'Sorry, I can\'t. I have plans with my couch and snacks', mood: 'savage' },
      // Aesthetic
      { content: 'Aesthetic eats only', mood: 'aesthetic' },
      { content: 'Too pretty to eat... almost', mood: 'aesthetic' },
      { content: 'Food that feeds the soul', mood: 'aesthetic' },
      { content: 'Beautiful inside and out 🥗', mood: 'aesthetic' },
      // Cool
      { content: 'Brunch is always a good idea', mood: 'cool' },
      { content: 'Coffee and good vibes', mood: 'cool' },
      { content: 'Wine not? 🍷', mood: 'cool' },
      { content: 'Living the sweet life', mood: 'cool' },
      // Motivational
      { content: 'Start your day with good food', mood: 'motivational' },
      { content: 'Cook with passion, serve with love', mood: 'motivational' },
      // Sarcastic
      { content: 'I\'m not a chef, I just play one at home', mood: 'sarcastic' },
      { content: 'Yes, I take pictures of my food. No, I\'m not sorry', mood: 'sarcastic' },
    ],
    // ==================== Couple 分类 ====================
    couple: [
      // Romantic
      { content: 'You are my favorite notification 💕', mood: 'romantic' },
      { content: 'Together is my favorite place to be', mood: 'romantic' },
      { content: 'You make my heart smile 💑', mood: 'romantic' },
      { content: 'Love you to the moon and back 🌙', mood: 'romantic' },
      { content: 'Forever is not long enough with you', mood: 'romantic' },
      { content: 'Home is wherever I am with you', mood: 'romantic' },
      { content: 'I choose you, every day', mood: 'romantic' },
      { content: 'You are worth every mile between us', mood: 'romantic' },
      { content: 'Every love story is beautiful, but ours is my favorite', mood: 'romantic' },
      { content: 'In a world full of chaos, you are my calm', mood: 'romantic' },
      { content: 'My heart found its home in you', mood: 'romantic' },
      { content: 'You are my today and all of my tomorrows', mood: 'romantic' },
      { content: 'I fell in love the way you fall asleep: slowly, then all at once', mood: 'romantic' },
      { content: 'You have my whole heart for my whole life', mood: 'romantic' },
      { content: 'Love is not finding someone to live with, it\'s finding someone you can\'t live without', mood: 'romantic' },
      { content: 'I choose you. And I\'ll choose you over and over and over', mood: 'romantic' },
      { content: 'You are my sun, my moon, and all my stars', mood: 'romantic' },
      { content: 'With you, every moment is a story worth telling', mood: 'romantic' },
      { content: 'You\'re not just my love, you\'re my best friend', mood: 'romantic' },
      { content: 'Falling in love with you is the best thing I ever did', mood: 'romantic' },
      // Cute
      { content: 'My partner in crime and in life', mood: 'cute' },
      { content: 'Together we have it all', mood: 'cute' },
      { content: 'Us against the world 💪', mood: 'cute' },
      { content: 'Better together', mood: 'cute' },
      { content: 'You\'re my favorite person', mood: 'cute' },
      { content: 'Two peas in a pod 🫛', mood: 'cute' },
      { content: 'You + Me = ❤️', mood: 'cute' },
      { content: 'Making memories with you is my favorite thing', mood: 'cute' },
      { content: 'My person', mood: 'cute' },
      { content: 'Life is better with you by my side', mood: 'cute' },
      // Funny
      { content: 'I love you more than pizza, and that says a lot 🍕', mood: 'funny' },
      { content: 'We go together like peanut butter and jelly', mood: 'funny' },
      { content: 'Found my weirdo 🤪', mood: 'funny' },
      { content: 'You\'re my favorite distraction', mood: 'funny' },
      { content: 'Relationship status: Netflix, couch, and you', mood: 'funny' },
      { content: 'I love you more than coffee, but not before coffee', mood: 'funny' },
      // Inspirational
      { content: 'True love is the best thing in the world', mood: 'inspirational' },
      { content: 'Love isn\'t perfect, but it\'s worth it', mood: 'inspirational' },
      { content: 'The best is yet to come', mood: 'inspirational' },
      // Cool
      { content: 'Power couple 💪', mood: 'cool' },
      { content: 'Partners in everything', mood: 'cool' },
      { content: 'Team Us', mood: 'cool' },
      // Savage
      { content: 'Yes, we\'re that couple', mood: 'savage' },
      { content: 'Sorry, I\'m taken by the best', mood: 'savage' },
      { content: 'Not everyone can handle us', mood: 'savage' },
    ],
    // ==================== Friends 分类 ====================
    friends: [
      // Savage
      { content: 'Friends who slay together, stay together 💅', mood: 'savage' },
      { content: 'Real queens fix each other\'s crowns 👑', mood: 'savage' },
      { content: 'Not everyone has good taste, but we do', mood: 'savage' },
      { content: 'We run this town', mood: 'savage' },
      { content: 'Too busy making memories to deal with drama', mood: 'savage' },
      // Funny
      { content: 'Good times + Crazy friends = Amazing memories', mood: 'funny' },
      { content: 'Best friends don\'t let you do stupid things... alone', mood: 'funny' },
      { content: 'We\'re the friends your parents warned you about', mood: 'funny' },
      { content: 'I don\'t know what\'s tighter, our jeans or our friendship', mood: 'funny' },
      { content: 'When worst comes to worst, the squad comes first', mood: 'funny' },
      { content: 'Friends buy you food. Best friends eat your food.', mood: 'funny' },
      { content: 'We don\'t judge each other, we judge others together', mood: 'funny' },
      { content: 'Life was meant for good friends and great adventures', mood: 'funny' },
      { content: 'We go together like drunk and disorderly', mood: 'funny' },
      // Cool
      { content: 'Squad goals 🔥', mood: 'cool' },
      { content: 'My tribe, my vibe 👯', mood: 'cool' },
      { content: 'The crew that never quits', mood: 'cool' },
      { content: 'Too cool for school', mood: 'cool' },
      { content: 'Gang gang 🤟', mood: 'cool' },
      { content: 'Dream team', mood: 'cool' },
      // Inspirational
      { content: 'Life is better with friends', mood: 'inspirational' },
      { content: 'Friends are the family we choose', mood: 'inspirational' },
      { content: 'Friendship isn\'t a big thing, it\'s a million little things', mood: 'inspirational' },
      { content: 'Good friends are like stars, you don\'t always see them but they\'re always there', mood: 'inspirational' },
      { content: 'A true friend is the greatest gift', mood: 'inspirational' },
      { content: 'Together is a wonderful place to be', mood: 'inspirational' },
      { content: 'Friends make the good times better and the hard times easier', mood: 'inspirational' },
      { content: 'In squad we trust', mood: 'inspirational' },
      // Sarcastic
      { content: 'Finding friends with the same mental disorder: Priceless', mood: 'sarcastic' },
      { content: 'We don\'t do normal', mood: 'sarcastic' },
      { content: 'Professional overthinkers, amateur everything else', mood: 'sarcastic' },
      // Cute
      { content: 'Best friends forever 💕', mood: 'cute' },
      { content: 'Side by side or miles apart, friends are always close to the heart', mood: 'cute' },
      { content: 'You\'re my person', mood: 'cute' },
      { content: 'Making memories one adventure at a time', mood: 'cute' },
      { content: 'Lucky to have you', mood: 'cute' },
      { content: 'Partners in crime since day one', mood: 'cute' },
      { content: 'Friendship never goes out of style', mood: 'cute' },
      // Aesthetic
      { content: 'Golden moments with golden friends', mood: 'aesthetic' },
      { content: 'Forever grateful for these souls', mood: 'aesthetic' },
      // Romantic
      { content: 'Soul sisters/brothers for life', mood: 'romantic' },
      { content: 'Found my person, now we\'re collecting memories', mood: 'romantic' },
    ],
    // ==================== Birthday 分类 ====================
    birthday: [
      // Funny
      { content: 'It\'s my birthday, I can eat cake for breakfast 🎂', mood: 'funny' },
      { content: 'Age is just a number, but mine is unlisted', mood: 'funny' },
      { content: 'On this day, a legend was born', mood: 'funny' },
      { content: 'I\'m not getting older, I\'m getting better', mood: 'funny' },
      { content: 'Another year of me being awesome', mood: 'funny' },
      { content: 'Making my age look good', mood: 'funny' },
      { content: 'Old enough to know better, young enough to do it anyway', mood: 'funny' },
      { content: 'Birthday calories don\'t count 🎈', mood: 'funny' },
      { content: 'It\'s my party and I\'ll post if I want to', mood: 'funny' },
      { content: 'Cheers to another year of bad decisions', mood: 'funny' },
      // Cute
      { content: 'Another year around the sun ☀️', mood: 'cute' },
      { content: 'Birthday vibes only 🎉', mood: 'cute' },
      { content: 'Feeling grateful for another year 🙏', mood: 'cute' },
      { content: 'Making wishes and blowing candles 🕯️', mood: 'cute' },
      { content: 'Blessed and birthday-obsessed', mood: 'cute' },
      { content: 'Another chapter begins today', mood: 'cute' },
      { content: 'Living my best life since [year]', mood: 'cute' },
      { content: 'Cheers to another year of amazing', mood: 'cute' },
      // Inspirational
      { content: 'New age, new chapter, new beginning', mood: 'inspirational' },
      { content: 'Growing older is a privilege denied to many', mood: 'inspirational' },
      { content: 'Here\'s to a year of growth and gratitude', mood: 'inspirational' },
      { content: 'Today I celebrate the gift of life', mood: 'inspirational' },
      { content: 'Making this year my best yet', mood: 'inspirational' },
      { content: 'Grateful for every year, every lesson, every moment', mood: 'inspirational' },
      // Savage
      { content: 'It\'s my birthday, be nice to me 👑', mood: 'savage' },
      { content: 'Birthday queen/king has arrived', mood: 'savage' },
      { content: 'Level up, birthday edition 🎮', mood: 'savage' },
      { content: 'I didn\'t choose the birthday life, the birthday life chose me', mood: 'savage' },
      { content: 'Too blessed to be stressed, it\'s my birthday', mood: 'savage' },
      // Cool
      { content: 'New year, same awesome me', mood: 'cool' },
      { content: 'Birthday mode: ON', mood: 'cool' },
      { content: 'Another year of being fabulous', mood: 'cool' },
      // Romantic
      { content: 'Thankful for another year with the best people', mood: 'romantic' },
      { content: 'Surrounded by love on my special day', mood: 'romantic' },
      // Aesthetic
      { content: 'Aging like fine wine 🍷', mood: 'aesthetic' },
      { content: 'Another year of beautiful memories', mood: 'aesthetic' },
    ],
    // ==================== Gym/Fitness 分类 ====================
    gym: [
      // Motivational
      { content: 'No pain, no gain 💪', mood: 'motivational' },
      { content: 'The only bad workout is the one that didn\'t happen', mood: 'motivational' },
      { content: 'Your body can do it, it\'s your mind you need to convince', mood: 'motivational' },
      { content: 'Stronger than yesterday', mood: 'motivational' },
      { content: 'Train insane or remain the same', mood: 'motivational' },
      { content: 'Sweat is just fat crying', mood: 'motivational' },
      { content: 'Wake up. Work out. Look hot. Kick ass.', mood: 'motivational' },
      { content: 'Progress, not perfection', mood: 'motivational' },
      { content: 'Your only limit is you', mood: 'motivational' },
      { content: 'Work hard in silence, let success make the noise', mood: 'motivational' },
      { content: 'Be stronger than your excuses', mood: 'motivational' },
      { content: 'Every workout counts', mood: 'motivational' },
      { content: 'Fall in love with taking care of yourself', mood: 'motivational' },
      // Savage
      { content: 'I don\'t sweat, I sparkle ✨', mood: 'savage' },
      { content: 'Building my summer body year-round', mood: 'savage' },
      { content: 'Lifting my way to the top', mood: 'savage' },
      { content: 'Sore today, strong tomorrow', mood: 'savage' },
      { content: 'Beast mode activated', mood: 'savage' },
      { content: 'Working on myself, for myself, by myself', mood: 'savage' },
      // Funny
      { content: 'I work out because I really like food', mood: 'funny' },
      { content: 'Running late counts as cardio, right?', mood: 'funny' },
      { content: 'Currently burning off last night\'s bad decisions', mood: 'funny' },
      { content: 'Leg day? More like drag day', mood: 'funny' },
      { content: 'My warm-up is your workout', mood: 'funny' },
      { content: 'Exercise? I thought you said extra fries', mood: 'funny' },
      // Cool
      { content: 'Gym hair, don\'t care', mood: 'cool' },
      { content: 'Fitness is not a destination, it\'s a lifestyle', mood: 'cool' },
      { content: 'Hustle for that muscle', mood: 'cool' },
      { content: 'Getting stronger every day', mood: 'cool' },
      { content: 'In my fitness era', mood: 'cool' },
      // Inspirational
      { content: 'The body achieves what the mind believes', mood: 'inspirational' },
      { content: 'Investing in myself', mood: 'inspirational' },
      { content: 'Health is wealth', mood: 'inspirational' },
      { content: 'Today I choose me', mood: 'inspirational' },
      // Cute
      { content: 'Workout complete ✓', mood: 'cute' },
      { content: 'Small progress is still progress', mood: 'cute' },
      { content: 'Feeling strong today 💪', mood: 'cute' },
    ],
    // ==================== Work/Business 分类 ====================
    work: [
      // Motivational
      { content: 'Dream big. Work hard. Stay focused.', mood: 'motivational' },
      { content: 'Success is not given, it\'s earned', mood: 'motivational' },
      { content: 'Hustle until your haters ask if you\'re hiring', mood: 'motivational' },
      { content: 'Building my empire, one day at a time', mood: 'motivational' },
      { content: 'The dream is free, the hustle is sold separately', mood: 'motivational' },
      { content: 'Work until your idols become your rivals', mood: 'motivational' },
      { content: 'Good things come to those who hustle', mood: 'motivational' },
      { content: 'Rise and grind', mood: 'motivational' },
      { content: 'Making moves, not excuses', mood: 'motivational' },
      { content: 'Stay hungry, stay foolish', mood: 'motivational' },
      { content: 'The only way to do great work is to love what you do', mood: 'motivational' },
      { content: 'Your vibe attracts your tribe and your clients', mood: 'motivational' },
      // Savage
      { content: 'Started from the bottom, now we\'re here', mood: 'savage' },
      { content: 'Building my legacy, one deal at a time', mood: 'savage' },
      { content: 'Self-made and proud', mood: 'savage' },
      { content: 'Boss moves only 💼', mood: 'savage' },
      { content: 'Too busy making history', mood: 'savage' },
      // Cool
      { content: 'Work mode: ON', mood: 'cool' },
      { content: 'Coffee and confidence', mood: 'cool' },
      { content: 'Another day, another opportunity', mood: 'cool' },
      { content: 'Making it happen', mood: 'cool' },
      { content: 'Living my professional dream', mood: 'cool' },
      // Funny
      { content: 'I\'m not a workaholic, I just really love what I do', mood: 'funny' },
      { content: 'My desk is a hot mess, but so am I', mood: 'funny' },
      { content: 'Running on caffeine and ambition', mood: 'funny' },
      { content: 'Professional overthinker', mood: 'funny' },
      { content: 'Working hard or hardly working?', mood: 'funny' },
      // Inspirational
      { content: 'Create the life you can\'t wait to wake up to', mood: 'inspirational' },
      { content: 'Your future is created by what you do today', mood: 'inspirational' },
      { content: 'Success is a journey, not a destination', mood: 'inspirational' },
      { content: 'Be the CEO of your own life', mood: 'inspirational' },
      // Cute
      { content: 'Loving what I do', mood: 'cute' },
      { content: 'Grateful for this journey', mood: 'cute' },
      // Aesthetic
      { content: 'Desk goals ✨', mood: 'aesthetic' },
      { content: 'Creating beautiful things', mood: 'aesthetic' },
    ],
    // ==================== Nature 分类 ====================
    nature: [
      // Inspirational
      { content: 'In every walk with nature, one receives far more than he seeks', mood: 'inspirational' },
      { content: 'Nature is not a place to visit, it is home', mood: 'inspirational' },
      { content: 'The earth has music for those who listen', mood: 'inspirational' },
      { content: 'Let nature be your therapy', mood: 'inspirational' },
      { content: 'Keep close to nature\'s heart', mood: 'inspirational' },
      { content: 'Nature never goes out of style', mood: 'inspirational' },
      { content: 'Every mountain top is within reach if you just keep climbing', mood: 'inspirational' },
      // Aesthetic
      { content: 'Lost in the wild 🌿', mood: 'aesthetic' },
      { content: 'Forest bathing', mood: 'aesthetic' },
      { content: 'Where flowers bloom, so does hope', mood: 'aesthetic' },
      { content: 'Sky above, earth below, peace within', mood: 'aesthetic' },
      { content: 'Wild and free', mood: 'aesthetic' },
      { content: 'Mother nature is the best artist', mood: 'aesthetic' },
      { content: 'Chasing waterfalls 💦', mood: 'aesthetic' },
      { content: 'Green therapy', mood: 'aesthetic' },
      { content: 'Nature\'s masterpiece', mood: 'aesthetic' },
      // Cool
      { content: 'Into the wild', mood: 'cool' },
      { content: 'Off the grid', mood: 'cool' },
      { content: 'Adventure is calling', mood: 'cool' },
      { content: 'Outdoor therapy', mood: 'cool' },
      { content: 'Back to basics', mood: 'cool' },
      // Cute
      { content: 'Flower power 🌸', mood: 'cute' },
      { content: 'Sunshine on my mind ☀️', mood: 'cute' },
      { content: 'Nature is my happy place', mood: 'cute' },
      { content: 'Stop and smell the flowers', mood: 'cute' },
      { content: 'Bloom where you are planted 🌻', mood: 'cute' },
      // Romantic
      { content: 'You belong among the wildflowers', mood: 'romantic' },
      { content: 'The mountains are calling and I must go', mood: 'romantic' },
      // Funny
      { content: 'I\'m not lost, I\'m exploring', mood: 'funny' },
      { content: 'Trees don\'t have WiFi, that\'s why the air feels so good', mood: 'funny' },
      // Motivational
      { content: 'Climb mountains not so the world can see you, but so you can see the world', mood: 'motivational' },
      { content: 'Take the road less traveled', mood: 'motivational' },
    ],
    // ==================== Fashion 分类 ====================
    fashion: [
      // Savage
      { content: 'Fashion is what you buy, style is what you do with it', mood: 'savage' },
      { content: 'I don\'t do fashion, I am fashion', mood: 'savage' },
      { content: 'Dress like you\'re already famous', mood: 'savage' },
      { content: 'Life is too short to wear boring clothes', mood: 'savage' },
      { content: 'Slaying all day', mood: 'savage' },
      { content: 'Wear confidence like makeup', mood: 'savage' },
      { content: 'My outfit speaks louder than my words', mood: 'savage' },
      { content: 'Overdressed? There\'s no such thing', mood: 'savage' },
      // Cool
      { content: 'OOTD on point', mood: 'cool' },
      { content: 'Style is a way to say who you are without speaking', mood: 'cool' },
      { content: 'Fashion fades, style is eternal', mood: 'cool' },
      { content: 'Walking like a runway', mood: 'cool' },
      { content: 'Dressed to impress', mood: 'cool' },
      { content: 'Fashion is my armor', mood: 'cool' },
      // Aesthetic
      { content: 'Minimal but maximal', mood: 'aesthetic' },
      { content: 'Serving looks 👀', mood: 'aesthetic' },
      { content: 'Elegance never goes out of style', mood: 'aesthetic' },
      { content: 'Classic never goes out of fashion', mood: 'aesthetic' },
      { content: 'Aesthetic vibes only', mood: 'aesthetic' },
      // Inspirational
      { content: 'Fashion is about expressing your inner self', mood: 'inspirational' },
      { content: 'Dress how you want to be addressed', mood: 'inspirational' },
      { content: 'Invest in your wardrobe, invest in yourself', mood: 'inspirational' },
      // Cute
      { content: 'Feeling cute in my new fit', mood: 'cute' },
      { content: 'New outfit, who dis?', mood: 'cute' },
      { content: 'Fashion is fun!', mood: 'cute' },
      // Funny
      { content: 'I have nothing to wear (said in front of a full closet)', mood: 'funny' },
      { content: 'Shopping is my cardio', mood: 'funny' },
      { content: 'Will work for shoes 👠', mood: 'funny' },
      { content: 'My wallet is crying but I look good', mood: 'funny' },
      // Sarcastic
      { content: 'Yes, this is my everyday look', mood: 'sarcastic' },
      { content: 'Too glam to give a damn', mood: 'sarcastic' },
    ],
    // ==================== Pet 分类 ====================
    pet: [
      // Cute
      { content: 'My best friend has four paws 🐾', mood: 'cute' },
      { content: 'Puppy love 🐶', mood: 'cute' },
      { content: 'All you need is love... and a dog', mood: 'cute' },
      { content: 'Home is where my pet is', mood: 'cute' },
      { content: 'Crazy cat lady/man and proud of it 🐱', mood: 'cute' },
      { content: 'Living my best life with my fur baby', mood: 'cute' },
      { content: 'Paws and relax', mood: 'cute' },
      { content: 'The more people I meet, the more I love my pet', mood: 'cute' },
      { content: 'Life is better with pets', mood: 'cute' },
      { content: 'My therapist has four legs', mood: 'cute' },
      { content: 'My heart belongs to my fur baby', mood: 'cute' },
      { content: 'Unconditional love 💕', mood: 'cute' },
      { content: 'Who rescued who?', mood: 'cute' },
      // Funny
      { content: 'Sorry I can\'t, I have plans with my dog', mood: 'funny' },
      { content: 'My pet is cooler than yours', mood: 'funny' },
      { content: 'Pet hair is my fashion accessory', mood: 'funny' },
      { content: 'I work hard so my pet can have a better life', mood: 'funny' },
      { content: 'Warning: Spoiled pet lives here', mood: 'funny' },
      { content: 'Dogs before boys/cats before gals', mood: 'funny' },
      { content: 'I like you, but I love my pet', mood: 'funny' },
      { content: 'My pet is my Valentine', mood: 'funny' },
      // Inspirational
      { content: 'A house is not a home without a pet', mood: 'inspirational' },
      { content: 'Pets teach us the most important things about love', mood: 'inspirational' },
      { content: 'The best things in life are furry', mood: 'inspirational' },
      // Savage
      { content: 'My pet is better than your pet', mood: 'savage' },
      { content: 'I only trust people my pet likes', mood: 'savage' },
      { content: 'Judge my pet and we\'re not friends', mood: 'savage' },
      // Cool
      { content: 'Pet parent life', mood: 'cool' },
      { content: 'Squad goals: Me and my pet', mood: 'cool' },
      // Romantic
      { content: 'Love at first sight is real - I met my pet', mood: 'romantic' },
      { content: 'Forever my fur baby', mood: 'romantic' },
    ],
    // ==================== Music 分类 ====================
    music: [
      // Inspirational
      { content: 'Where words fail, music speaks', mood: 'inspirational' },
      { content: 'Music is the universal language of mankind', mood: 'inspirational' },
      { content: 'Music is life. That\'s why our hearts have beats.', mood: 'inspirational' },
      { content: 'Without music, life would be a mistake', mood: 'inspirational' },
      { content: 'Music gives a soul to the universe', mood: 'inspirational' },
      { content: 'Let the music move you', mood: 'inspirational' },
      { content: 'Music is the answer', mood: 'inspirational' },
      // Cool
      { content: 'Music is my escape 🎵', mood: 'cool' },
      { content: 'Life is a song, love is the music', mood: 'cool' },
      { content: 'Turn up the volume', mood: 'cool' },
      { content: 'Lost in the music', mood: 'cool' },
      { content: 'Good vibes and good music', mood: 'cool' },
      { content: 'Living for the beat', mood: 'cool' },
      { content: 'Music on, world off', mood: 'cool' },
      // Aesthetic
      { content: 'Melodies and memories', mood: 'aesthetic' },
      { content: 'Dancing through life', mood: 'aesthetic' },
      { content: 'The rhythm of life', mood: 'aesthetic' },
      { content: 'Music is art for the ears', mood: 'aesthetic' },
      // Cute
      { content: 'Making melodies 🎶', mood: 'cute' },
      { content: 'Life\'s too short for bad music', mood: 'cute' },
      { content: 'Playlist on repeat', mood: 'cute' },
      { content: 'Music makes everything better', mood: 'cute' },
      // Funny
      { content: 'I speak fluent music', mood: 'funny' },
      { content: 'My neighbors know all my favorite songs', mood: 'funny' },
      { content: 'Sorry, I can\'t hear you over my amazing playlist', mood: 'funny' },
      { content: 'Music is cheaper than therapy', mood: 'funny' },
      // Savage
      { content: 'The DJ saved my life tonight', mood: 'savage' },
      { content: 'Music is my drug of choice', mood: 'savage' },
      // Romantic
      { content: 'Every song reminds me of you', mood: 'romantic' },
      { content: 'You\'re my favorite song', mood: 'romantic' },
    ],
  };

  const captionData: Array<{
    id: string;
    content: string;
    formattedContent: string;
    platformId: string;
    categoryId: string;
    moodId: string | null;
    language: string;
    lengthType: string;
    characterCount: number;
    copyCount: number;
    viewCount: number;
    qualityScore: number;
    isFeatured: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }> = [];
  const now = new Date().toISOString();

  /**
   * 根据平台格式化文案内容
   * @param content - 原始内容
   * @param platformId - 平台 ID
   * @returns 格式化后的内容
   */
  const formatForPlatform = (content: string, platformId: PlatformId): string => {
    switch (platformId) {
      case PlatformId.X:
        // X 平台限制 280 字符
        return content.length > 280 ? content.substring(0, 277) + '...' : content;
      case PlatformId.TELEGRAM:
        // Telegram 保持简洁
        return content;
      case PlatformId.INSTAGRAM:
      default:
        return content;
    }
  };

  /**
   * 计算长度类型
   * @param length - 字符长度
   * @returns 长度类型
   */
  const getLengthType = (length: number): string => {
    if (length <= 50) return 'short';
    if (length <= 150) return 'medium';
    return 'long';
  };

  // 为每个分类和每个平台生成文案
  Object.entries(captionTemplates).forEach(([categoryId, templates]) => {
    // 为每个平台生成文案
    const platformIds = [PlatformId.INSTAGRAM, PlatformId.TELEGRAM, PlatformId.X];
    
    platformIds.forEach((platformId) => {
      templates.forEach((template, index) => {
        const formattedContent = formatForPlatform(template.content, platformId);
        const characterCount = formattedContent.length;
        
        // X 平台文案需要在 280 字符内
        if (platformId === PlatformId.X && characterCount > 280) {
          return; // 跳过过长的文案
        }
        
        captionData.push({
          id: generateUniqueId(),
          content: template.content,
          formattedContent,
          platformId,
          categoryId,
          moodId: template.mood || null,
          language: 'en',
          lengthType: getLengthType(characterCount),
          characterCount,
          copyCount: Math.floor(Math.random() * 100),
          viewCount: Math.floor(Math.random() * 500),
          qualityScore: 80 + Math.random() * 20,
          isFeatured: index < 5, // 前5条为精选
          isActive: true,
          createdAt: now,
          updatedAt: now,
        });
      });
    });
  });

  // 分批插入，避免 SQLite 参数限制
  const batchSize = 100;
  for (let i = 0; i < captionData.length; i += batchSize) {
    const batch = captionData.slice(i, i + batchSize);
    await db.insert(captions).values(batch);
  }
  console.log(`✅ 已插入 ${captionData.length} 条预生成文案（覆盖 3 个平台 × ${Object.keys(captionTemplates).length} 个分类）`);
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
    await seedCaptions();
    
    console.log('\n🎉 数据库种子数据初始化完成！');
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

// 执行主函数
main();
