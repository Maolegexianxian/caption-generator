/**
 * 生成器状态管理
 * @description 使用 Zustand 管理 AI 文案生成器的全局状态
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  PlatformId, 
  LengthType, 
  GeneratorState, 
  GeneratorActions,
  GeneratedCaption,
} from '@/types';
import { GENERATOR_CONFIG } from '@/config/constants';

/**
 * 生成器状态的初始值
 */
const initialState: GeneratorState = {
  /** 默认选择 Instagram 平台 */
  platform: PlatformId.INSTAGRAM,
  /** 未选择分类 */
  category: null,
  /** 未选择情绪 */
  moods: [],
  /** 空关键词 */
  keywords: '',
  /** 默认中等长度 */
  lengthType: GENERATOR_CONFIG.defaultLengthType,
  /** 未选择排版预设 */
  layoutPreset: null,
  /** 默认英语 */
  language: GENERATOR_CONFIG.defaultLanguage,
  /** 默认包含 Hashtag */
  includeHashtags: GENERATOR_CONFIG.defaultIncludeHashtags,
  /** 默认包含 Emoji */
  includeEmoji: GENERATOR_CONFIG.defaultIncludeEmoji,
  /** 空结果 */
  results: [],
  /** 初始非生成状态 */
  isGenerating: false,
  /** 无错误 */
  error: null,
};

/**
 * 生成器 Zustand Store
 * @description 管理文案生成器的所有状态和操作
 */
export const useGeneratorStore = create<GeneratorState & GeneratorActions>()(
  devtools(
    persist(
      (set) => ({
        // =============== 状态 ===============
        ...initialState,

        // =============== 操作 ===============

        /**
         * 设置目标平台
         * @param platform - 平台标识符
         */
        setPlatform: (platform: PlatformId) => 
          set({ platform, layoutPreset: null }, false, 'setPlatform'),

        /**
         * 设置场景分类
         * @param category - 分类 ID 或 null
         */
        setCategory: (category: string | null) => 
          set({ category }, false, 'setCategory'),

        /**
         * 设置情绪标签列表
         * @param moods - 情绪 ID 数组
         */
        setMoods: (moods: string[]) => 
          set({ moods }, false, 'setMoods'),

        /**
         * 设置用户输入的关键词
         * @param keywords - 关键词字符串
         */
        setKeywords: (keywords: string) => 
          set({ keywords }, false, 'setKeywords'),

        /**
         * 设置文案长度偏好
         * @param lengthType - 长度类型
         */
        setLengthType: (lengthType: LengthType) => 
          set({ lengthType }, false, 'setLengthType'),

        /**
         * 设置排版预设
         * @param layoutPreset - 预设 ID 或 null
         */
        setLayoutPreset: (layoutPreset: string | null) => 
          set({ layoutPreset }, false, 'setLayoutPreset'),

        /**
         * 设置生成语言
         * @param language - 语言代码
         */
        setLanguage: (language: string) => 
          set({ language }, false, 'setLanguage'),

        /**
         * 设置是否包含 Hashtag
         * @param includeHashtags - 布尔值
         */
        setIncludeHashtags: (includeHashtags: boolean) => 
          set({ includeHashtags }, false, 'setIncludeHashtags'),

        /**
         * 设置是否包含 Emoji
         * @param includeEmoji - 布尔值
         */
        setIncludeEmoji: (includeEmoji: boolean) => 
          set({ includeEmoji }, false, 'setIncludeEmoji'),

        /**
         * 设置生成结果
         * @param results - 生成的文案数组
         */
        setResults: (results: GeneratedCaption[]) => 
          set({ results, error: null }, false, 'setResults'),

        /**
         * 设置生成状态
         * @param isGenerating - 是否正在生成
         */
        setIsGenerating: (isGenerating: boolean) => 
          set({ isGenerating }, false, 'setIsGenerating'),

        /**
         * 设置错误信息
         * @param error - 错误信息或 null
         */
        setError: (error: string | null) => 
          set({ error, isGenerating: false }, false, 'setError'),

        /**
         * 重置所有状态到初始值
         */
        reset: () => 
          set(initialState, false, 'reset'),
      }),
      {
        /** 持久化存储的名称 */
        name: 'caption-generator-storage',
        /** 只持久化部分状态 */
        partialize: (state) => ({
          platform: state.platform,
          language: state.language,
          includeHashtags: state.includeHashtags,
          includeEmoji: state.includeEmoji,
        }),
      }
    ),
    { name: 'GeneratorStore' }
  )
);

/**
 * 选择器：获取当前生成请求参数
 * @description 从 store 中提取生成 API 所需的参数
 */
export const selectGenerateParams = (state: GeneratorState) => ({
  platformId: state.platform,
  language: state.language,
  moodIds: state.moods,
  categoryId: state.category,
  keywords: state.keywords,
  lengthType: state.lengthType,
  layoutPresetId: state.layoutPreset,
  includeHashtags: state.includeHashtags,
  includeEmoji: state.includeEmoji,
});

/**
 * 选择器：判断是否可以提交生成请求
 * @description 至少需要选择平台才能生成
 */
export const selectCanGenerate = (state: GeneratorState) => 
  !!state.platform && !state.isGenerating;
