/**
 * AI 文案生成服务
 * @description 封装 AI 模型调用，生成社交媒体文案
 */

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { 
  GenerateRequest, 
  GenerateResponse, 
  GeneratedCaption,
  PlatformId,
  LengthType,
} from '@/types';
import { 
  PLATFORMS_CONFIG, 
  CATEGORIES_CONFIG, 
  MOODS_CONFIG,
  LENGTH_CONFIG,
  CATEGORY_HASHTAGS,
  GENERIC_HASHTAGS,
} from '@/config/constants';
import { generateUniqueId } from '@/lib/utils';

/**
 * 根据平台获取格式化指南
 * @param platformId - 平台标识符
 * @returns 平台特定的格式化指南
 */
function getPlatformFormatGuide(platformId: PlatformId): string {
  const guides: Record<PlatformId, string> = {
    [PlatformId.TELEGRAM]: `
- Keep captions concise and attention-grabbing
- First line should hook the reader immediately
- Use line breaks for readability
- Limit hashtags to 2-3 if included
- Emojis should be used sparingly for emphasis`,
    [PlatformId.INSTAGRAM]: `
- Create engaging, visually complementary text
- Use line breaks and spacing for readability
- First line is crucial as it appears in preview
- Can include more hashtags (up to 30, but 10-15 recommended)
- Emojis can be used more freely
- Include a call-to-action when appropriate`,
    [PlatformId.X]: `
- Stay within 280 characters for single posts
- Be concise and impactful
- Use 1-2 hashtags maximum
- For threads, number each part (1/n format)
- Make every word count
- Consider virality and shareability`,
  };
  return guides[platformId];
}

/**
 * 根据长度类型获取字符数范围指南
 * @param lengthType - 长度类型
 * @param platformId - 平台标识符
 * @returns 长度指南字符串
 */
function getLengthGuide(lengthType: LengthType, platformId: PlatformId): string {
  const config = LENGTH_CONFIG[lengthType];
  const platformConfig = PLATFORMS_CONFIG[platformId];
  
  // 对于 X 平台，强制限制在 280 字符内
  if (platformId === PlatformId.X && lengthType !== LengthType.SHORT) {
    return `Keep each caption under 280 characters (X/Twitter limit). Target ${config.minChars}-${Math.min(config.maxChars, platformConfig.maxCharacters)} characters.`;
  }
  
  return `Target caption length: ${config.minChars}-${config.maxChars} characters.`;
}

/**
 * 构建 AI 生成的 Prompt
 * @param request - 生成请求参数
 * @returns 完整的 AI prompt
 */
function buildPrompt(request: GenerateRequest): string {
  const platformConfig = PLATFORMS_CONFIG[request.platformId];
  const category = CATEGORIES_CONFIG.find(c => c.id === request.categoryId);
  const selectedMoods = MOODS_CONFIG.filter(m => request.moodIds.includes(m.id));
  
  const moodDescriptions = selectedMoods.map(m => m.displayName).join(', ') || 'general';
  const categoryDescription = category?.displayName || 'general content';
  const languageInstruction = request.language === 'zh' ? 'Write in Chinese (Simplified).' : 'Write in English.';
  
  const prompt = `You are an expert social media content creator specializing in ${platformConfig.displayName} captions.

Generate ${request.count || 6} unique, engaging captions for ${platformConfig.displayName}.

**Context:**
- Platform: ${platformConfig.displayName}
- Content Category: ${categoryDescription}
- Mood/Style: ${moodDescriptions}
- Keywords to incorporate (if provided): ${request.keywords || 'none'}
${languageInstruction}

**Platform-Specific Guidelines:**
${getPlatformFormatGuide(request.platformId)}

**Length Requirement:**
${getLengthGuide(request.lengthType, request.platformId)}

**Output Format:**
Return a JSON array of caption objects. Each object should have:
- "content": The caption text (properly formatted with line breaks where appropriate)
- "hashtags": An array of relevant hashtags (without # symbol)

${request.includeEmoji ? 'Include appropriate emojis to enhance the captions.' : 'Do not include emojis.'}

**Important:**
- Each caption must be unique and creative
- Captions should be ready to copy-paste
- Ensure proper formatting for ${platformConfig.displayName}
- Make captions engaging and shareable

Return ONLY the JSON array, no additional text.`;

  return prompt;
}

/**
 * 解析 AI 响应为结构化的文案数组
 * @param responseText - AI 返回的原始文本
 * @param platformId - 平台标识符
 * @param categoryId - 分类 ID
 * @returns 解析后的文案数组
 */
function parseAIResponse(
  responseText: string, 
  platformId: PlatformId,
  categoryId?: string
): GeneratedCaption[] {
  try {
    // 尝试提取 JSON 数组
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(parsed)) {
      throw new Error('Parsed result is not an array');
    }
    
    return parsed.map((item: { content?: string; hashtags?: string[] }) => {
      const content = item.content || '';
      const aiHashtags = item.hashtags || [];
      
      // 合并 AI 生成的 hashtags 和分类相关的 hashtags
      const categoryTags = categoryId ? CATEGORY_HASHTAGS[categoryId] || [] : [];
      const genericTags = GENERIC_HASHTAGS[platformId] || [];
      
      // 优先使用 AI 生成的，然后补充分类相关的
      const allHashtags = [...new Set([...aiHashtags, ...categoryTags.slice(0, 5)])];
      
      // 如果 hashtag 不足，补充通用的
      if (allHashtags.length < 5) {
        const needed = 5 - allHashtags.length;
        const additionalTags = genericTags
          .filter(t => !allHashtags.includes(t))
          .slice(0, needed);
        allHashtags.push(...additionalTags);
      }
      
      return {
        id: generateUniqueId(),
        content,
        formattedContent: formatCaptionForPlatform(content, platformId),
        hashtags: allHashtags.slice(0, PLATFORMS_CONFIG[platformId].recommendedHashtagCount),
        characterCount: content.length,
      };
    });
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw new Error('Failed to parse AI response');
  }
}

/**
 * 根据平台格式化文案内容
 * @param content - 原始文案内容
 * @param platformId - 平台标识符
 * @returns 格式化后的文案
 */
function formatCaptionForPlatform(content: string, platformId: PlatformId): string {
  switch (platformId) {
    case PlatformId.INSTAGRAM:
      // Instagram: 确保有适当的换行和空行分隔
      return content
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    
    case PlatformId.TELEGRAM:
      // Telegram: 保持简洁，移除多余空行
      return content
        .replace(/\n{2,}/g, '\n')
        .trim();
    
    case PlatformId.X:
      // X: 确保在字符限制内
      const maxLength = 280;
      if (content.length > maxLength) {
        return content.substring(0, maxLength - 3) + '...';
      }
      return content.trim();
    
    default:
      return content.trim();
  }
}

/**
 * 生成社交媒体文案
 * @param request - 生成请求参数
 * @returns 生成响应，包含文案列表
 */
export async function generateCaptions(request: GenerateRequest): Promise<GenerateResponse> {
  const startTime = Date.now();
  
  try {
    // 验证 API Key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }
    
    const prompt = buildPrompt(request);
    
    // 调用 AI 模型生成文案
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.8,
    });
    
    // 解析响应
    const captions = parseAIResponse(text, request.platformId, request.categoryId);
    
    const generationTime = Date.now() - startTime;
    
    return {
      success: true,
      captions,
      metadata: {
        generationTime,
        model: 'gpt-4o-mini',
      },
    };
  } catch (error) {
    console.error('Caption generation error:', error);
    
    return {
      success: false,
      captions: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * 获取分类相关的 Hashtag 列表
 * @param categoryId - 分类 ID
 * @param platformId - 平台标识符
 * @param limit - 返回的最大数量
 * @returns Hashtag 数组
 */
export function getHashtagsForCategory(
  categoryId: string,
  platformId: PlatformId,
  limit: number = 10
): string[] {
  const categoryTags = CATEGORY_HASHTAGS[categoryId] || [];
  const genericTags = GENERIC_HASHTAGS[platformId] || [];
  
  const combined = [...new Set([...categoryTags, ...genericTags])];
  return combined.slice(0, limit);
}

/**
 * 验证生成请求参数
 * @param request - 生成请求参数
 * @returns 验证结果和错误信息
 */
export function validateGenerateRequest(request: GenerateRequest): { 
  valid: boolean; 
  errors: string[]; 
} {
  const errors: string[] = [];
  
  // 验证平台
  if (!Object.values(PlatformId).includes(request.platformId)) {
    errors.push('Invalid platform selected');
  }
  
  // 验证语言
  const validLanguages = ['en', 'zh', 'es', 'pt', 'fr'];
  if (!validLanguages.includes(request.language)) {
    errors.push('Invalid language selected');
  }
  
  // 验证长度类型
  if (!Object.values(LengthType).includes(request.lengthType)) {
    errors.push('Invalid length type selected');
  }
  
  // 验证生成数量
  if (request.count !== undefined && (request.count < 1 || request.count > 10)) {
    errors.push('Generation count must be between 1 and 10');
  }
  
  // 验证关键词长度
  if (request.keywords && request.keywords.length > 200) {
    errors.push('Keywords must be under 200 characters');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
