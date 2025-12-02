/**
 * 全局常量配置
 * @description 定义项目中使用的所有常量和默认配置
 */

import { PlatformId, LengthType } from '@/types';

// =============== 网站基础配置 ===============

/**
 * 网站基础信息
 */
export const SITE_CONFIG = {
  /** 网站名称 */
  name: 'Caption Generator',
  /** 网站标语 */
  tagline: 'AI-Powered Social Media Captions',
  /** 网站描述 */
  description: 'Generate perfect captions for Telegram, Instagram, and X (Twitter) with AI. Get ready-to-copy captions optimized for each platform.',
  /** 网站域名 */
  domain: 'captiongenerator.com',
  /** 网站 URL */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://captiongenerator.com',
} as const;

// =============== 平台配置 ===============

/**
 * 支持的平台详细配置
 */
export const PLATFORMS_CONFIG = {
  [PlatformId.TELEGRAM]: {
    id: PlatformId.TELEGRAM,
    name: 'telegram',
    displayName: 'Telegram',
    description: 'Create engaging captions for your Telegram channels and groups',
    icon: 'MessageCircle',
    slug: 'tg-captions',
    maxCharacters: 4096,
    recommendedHashtagCount: 3,
    sortOrder: 1,
    /** 排版预设 */
    layoutPresets: [
      { id: 'tg-channel', name: 'Channel Post', description: 'Standard channel post format' },
      { id: 'tg-group', name: 'Group Message', description: 'Group announcement format' },
      { id: 'tg-preview', name: 'Link Preview', description: 'Caption for link preview' },
    ],
  },
  [PlatformId.INSTAGRAM]: {
    id: PlatformId.INSTAGRAM,
    name: 'instagram',
    displayName: 'Instagram',
    description: 'Perfect captions for your Instagram posts, Reels, and Stories',
    icon: 'Instagram',
    slug: 'captions-for-instagram',
    maxCharacters: 2200,
    recommendedHashtagCount: 30,
    sortOrder: 2,
    /** 排版预设 */
    layoutPresets: [
      { id: 'ig-feed', name: 'Feed Post', description: 'Standard Instagram feed post' },
      { id: 'ig-reels', name: 'Reels Caption', description: 'Short caption for Reels' },
      { id: 'ig-story', name: 'Story Caption', description: 'Story text overlay' },
      { id: 'ig-bio', name: 'Bio', description: 'Instagram bio format' },
    ],
  },
  [PlatformId.X]: {
    id: PlatformId.X,
    name: 'x',
    displayName: 'X (Twitter)',
    description: 'Craft compelling tweets and threads for X',
    icon: 'Twitter',
    slug: 'x-captions',
    maxCharacters: 280,
    recommendedHashtagCount: 2,
    sortOrder: 3,
    /** 排版预设 */
    layoutPresets: [
      { id: 'x-post', name: 'Single Post', description: 'Standard X post (280 chars)' },
      { id: 'x-thread', name: 'Thread', description: 'Multi-part thread format' },
      { id: 'x-reply', name: 'Reply', description: 'Reply format' },
      { id: 'x-quote', name: 'Quote Repost', description: 'Quote repost format' },
    ],
  },
} as const;

// =============== 分类配置 ===============

/**
 * 场景分类配置
 * @description 适用于所有平台的通用场景分类
 */
export const CATEGORIES_CONFIG = [
  {
    id: 'selfie',
    name: 'selfie',
    displayName: 'Selfie',
    description: 'Captions for selfie photos',
    icon: '📸',
    slug: 'selfie',
    sortOrder: 1,
  },
  {
    id: 'travel',
    name: 'travel',
    displayName: 'Travel',
    description: 'Captions for travel and adventure posts',
    icon: '✈️',
    slug: 'travel',
    sortOrder: 2,
  },
  {
    id: 'food',
    name: 'food',
    displayName: 'Food',
    description: 'Captions for food and restaurant posts',
    icon: '🍕',
    slug: 'food',
    sortOrder: 3,
  },
  {
    id: 'couple',
    name: 'couple',
    displayName: 'Couple',
    description: 'Captions for couple and relationship posts',
    icon: '💑',
    slug: 'couple',
    sortOrder: 4,
  },
  {
    id: 'friends',
    name: 'friends',
    displayName: 'Friends',
    description: 'Captions for friend group photos',
    icon: '👯',
    slug: 'friends',
    sortOrder: 5,
  },
  {
    id: 'birthday',
    name: 'birthday',
    displayName: 'Birthday',
    description: 'Captions for birthday celebrations',
    icon: '🎂',
    slug: 'birthday',
    sortOrder: 6,
  },
  {
    id: 'gym',
    name: 'gym',
    displayName: 'Gym & Fitness',
    description: 'Captions for workout and fitness posts',
    icon: '💪',
    slug: 'gym',
    sortOrder: 7,
  },
  {
    id: 'work',
    name: 'work',
    displayName: 'Work & Business',
    description: 'Captions for professional and business content',
    icon: '💼',
    slug: 'work',
    sortOrder: 8,
  },
  {
    id: 'nature',
    name: 'nature',
    displayName: 'Nature',
    description: 'Captions for nature and outdoor photos',
    icon: '🌿',
    slug: 'nature',
    sortOrder: 9,
  },
  {
    id: 'fashion',
    name: 'fashion',
    displayName: 'Fashion & Style',
    description: 'Captions for fashion and outfit posts',
    icon: '👗',
    slug: 'fashion',
    sortOrder: 10,
  },
  {
    id: 'pet',
    name: 'pet',
    displayName: 'Pets',
    description: 'Captions for pet photos',
    icon: '🐕',
    slug: 'pets',
    sortOrder: 11,
  },
  {
    id: 'music',
    name: 'music',
    displayName: 'Music',
    description: 'Captions for music-related content',
    icon: '🎵',
    slug: 'music',
    sortOrder: 12,
  },
] as const;

// =============== 情绪/风格配置 ===============

/**
 * 情绪/风格标签配置
 */
export const MOODS_CONFIG = [
  {
    id: 'funny',
    name: 'funny',
    displayName: 'Funny',
    description: 'Humorous and entertaining captions',
    icon: '😂',
    slug: 'funny',
    sortOrder: 1,
  },
  {
    id: 'cute',
    name: 'cute',
    displayName: 'Cute',
    description: 'Adorable and sweet captions',
    icon: '🥰',
    slug: 'cute',
    sortOrder: 2,
  },
  {
    id: 'cool',
    name: 'cool',
    displayName: 'Cool',
    description: 'Stylish and confident captions',
    icon: '😎',
    slug: 'cool',
    sortOrder: 3,
  },
  {
    id: 'romantic',
    name: 'romantic',
    displayName: 'Romantic',
    description: 'Love and relationship captions',
    icon: '❤️',
    slug: 'romantic',
    sortOrder: 4,
  },
  {
    id: 'sad',
    name: 'sad',
    displayName: 'Sad',
    description: 'Melancholic and emotional captions',
    icon: '😢',
    slug: 'sad',
    sortOrder: 5,
  },
  {
    id: 'motivational',
    name: 'motivational',
    displayName: 'Motivational',
    description: 'Inspiring and uplifting captions',
    icon: '💪',
    slug: 'motivational',
    sortOrder: 6,
  },
  {
    id: 'aesthetic',
    name: 'aesthetic',
    displayName: 'Aesthetic',
    description: 'Artistic and visually pleasing captions',
    icon: '✨',
    slug: 'aesthetic',
    sortOrder: 7,
  },
  {
    id: 'savage',
    name: 'savage',
    displayName: 'Savage',
    description: 'Bold and fierce captions',
    icon: '🔥',
    slug: 'savage',
    sortOrder: 8,
  },
  {
    id: 'sarcastic',
    name: 'sarcastic',
    displayName: 'Sarcastic',
    description: 'Witty and ironic captions',
    icon: '😏',
    slug: 'sarcastic',
    sortOrder: 9,
  },
  {
    id: 'inspirational',
    name: 'inspirational',
    displayName: 'Inspirational',
    description: 'Thought-provoking and meaningful captions',
    icon: '🌟',
    slug: 'inspirational',
    sortOrder: 10,
  },
] as const;

// =============== 语言配置 ===============

/**
 * 支持的语言配置
 */
export const LANGUAGES_CONFIG = [
  { code: 'en', name: 'English', nativeName: 'English', isDefault: true },
  { code: 'zh', name: 'Chinese', nativeName: '中文', isDefault: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', isDefault: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', isDefault: false },
  { code: 'fr', name: 'French', nativeName: 'Français', isDefault: false },
] as const;

// =============== 长度配置 ===============

/**
 * 文案长度配置
 */
export const LENGTH_CONFIG = {
  [LengthType.SHORT]: {
    id: LengthType.SHORT,
    name: 'Short',
    displayName: 'Short',
    description: 'Brief and concise (under 50 characters)',
    minChars: 1,
    maxChars: 50,
  },
  [LengthType.MEDIUM]: {
    id: LengthType.MEDIUM,
    name: 'Medium',
    displayName: 'Medium',
    description: 'Balanced length (50-150 characters)',
    minChars: 50,
    maxChars: 150,
  },
  [LengthType.LONG]: {
    id: LengthType.LONG,
    name: 'Long',
    displayName: 'Long',
    description: 'Detailed caption (over 150 characters)',
    minChars: 150,
    maxChars: 500,
  },
} as const;

// =============== 生成器配置 ===============

/**
 * AI 生成器默认配置
 */
export const GENERATOR_CONFIG = {
  /** 默认生成数量 */
  defaultCount: 6,
  /** 最小生成数量 */
  minCount: 3,
  /** 最大生成数量 */
  maxCount: 10,
  /** 默认语言 */
  defaultLanguage: 'en',
  /** 默认长度类型 */
  defaultLengthType: LengthType.MEDIUM,
  /** 默认是否包含 Hashtag */
  defaultIncludeHashtags: true,
  /** 默认是否包含 Emoji */
  defaultIncludeEmoji: true,
} as const;

// =============== Hashtag 配置 ===============

/**
 * 通用高频 Hashtag
 * @description 当无法匹配特定分类时使用的通用 Hashtag
 */
export const GENERIC_HASHTAGS = {
  instagram: [
    'instagood',
    'photooftheday',
    'instadaily',
    'picoftheday',
    'beautiful',
    'happy',
    'love',
    'style',
    'life',
    'amazing',
  ],
  x: [
    'trending',
    'viral',
    'fyp',
  ],
  telegram: [
    'telegram',
    'channel',
    'subscribe',
  ],
} as const;

/**
 * 分类相关 Hashtag 映射
 */
export const CATEGORY_HASHTAGS: Record<string, string[]> = {
  selfie: ['selfie', 'selfietime', 'selfiesunday', 'me', 'face', 'portrait'],
  travel: ['travel', 'travelgram', 'wanderlust', 'adventure', 'explore', 'vacation', 'travelphotography'],
  food: ['food', 'foodie', 'foodporn', 'yummy', 'delicious', 'foodphotography', 'instafood'],
  couple: ['couple', 'love', 'couplegoals', 'relationship', 'together', 'forever', 'mylove'],
  friends: ['friends', 'bestfriends', 'friendship', 'squad', 'bff', 'friendsforever'],
  birthday: ['birthday', 'happybirthday', 'birthdaygirl', 'birthdayboy', 'celebrate', 'party'],
  gym: ['gym', 'fitness', 'workout', 'gymlife', 'fitnessmotivation', 'training', 'health'],
  work: ['work', 'business', 'entrepreneur', 'success', 'motivation', 'career', 'hustle'],
  nature: ['nature', 'naturephotography', 'outdoors', 'landscape', 'beautiful', 'earth'],
  fashion: ['fashion', 'style', 'ootd', 'fashionblogger', 'outfit', 'streetstyle'],
  pet: ['pet', 'dog', 'cat', 'dogsofinstagram', 'catsofinstagram', 'pets', 'puppy', 'kitten'],
  music: ['music', 'musician', 'song', 'singer', 'playlist', 'concert', 'livemusic'],
};

// =============== SEO 配置 ===============

/**
 * SEO 相关配置
 */
export const SEO_CONFIG = {
  /** 默认 Title 后缀 */
  titleSuffix: ' | Caption Generator',
  /** 默认 OG 图片 */
  defaultOgImage: '/og-image.png',
  /** Twitter 卡片类型 */
  twitterCardType: 'summary_large_image',
} as const;

// =============== UI 配置 ===============

/**
 * UI 相关配置
 */
export const UI_CONFIG = {
  /** 每页显示的文案数量 */
  captionsPerPage: 20,
  /** Toast 显示时长（毫秒） */
  toastDuration: 3000,
  /** 加载动画延迟（毫秒） */
  loadingDelay: 300,
} as const;
